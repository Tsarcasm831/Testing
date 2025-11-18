import { MODEL, state } from './model.js';
import { clamp, screenToPct, autosave, parseViewBox, setViewBox } from './utils.js';
import { dumpJSON } from './export-utils.js';
import { drawAll } from './render.js';
import { W, H, hLayer } from './constants.js';

let zoomAnimation=null;

function stopZoomAnimation(){
  if(zoomAnimation?.rafId) cancelAnimationFrame(zoomAnimation.rafId);
  zoomAnimation=null;
}

function animateViewBox(start,target){
  const ratio=Math.max(target.w,start.w)/Math.min(target.w,start.w);
  const duration=1500 + Math.min(Math.abs(ratio-1),1)*1500;
  const anim={start,target,duration,startTime:performance.now(),rafId:null};
  const step=(now)=>{
    if(zoomAnimation!==anim) return;
    const t=Math.min((now-anim.startTime)/anim.duration,1);
    const eased=t*t*(3-2*t);
    const vb={
      x:anim.start.x + (anim.target.x-anim.start.x)*eased,
      y:anim.start.y + (anim.target.y-anim.start.y)*eased,
      w:anim.start.w + (anim.target.w-anim.start.w)*eased,
      h:anim.start.h + (anim.target.h-anim.start.h)*eased
    };
    setViewBox(vb);
    if(t<1){
      anim.rafId=requestAnimationFrame(step);
    }else{
      zoomAnimation=null;
    }
  };
  zoomAnimation=anim;
  anim.rafId=requestAnimationFrame(step);
}

export function select(kind,key){
  stopZoomAnimation();
  state.selected={kind,key};
  window.dispatchEvent(new CustomEvent('selection:changed', { detail: state.selected }));
  if(kind === 'land') {
    zoomToLand(key);
  } else if (!kind) {
    // Reset zoom when nothing is selected
    setViewBox({ x:0, y:0, w:W, h:H });
  }
  drawAll();
}

function zoomToLand(key) {
  const land = MODEL.lands[key];
  if (!land || !land.points || land.points.length === 0) return;

  const currentView = parseViewBox();

  // Calculate bounding box
  let minX = 100, maxX = 0, minY = 100, maxY = 0;
  for (const [x, y] of land.points) {
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }
  
  // Add padding (10% of dimensions)
  const width = maxX - minX;
  const height = maxY - minY;
  const padX = width * 0.1;
  const padY = height * 0.1;
  
  minX = Math.max(0, minX - padX);
  maxX = Math.min(100, maxX + padX);
  minY = Math.max(0, minY - padY);
  maxY = Math.min(100, maxY + padY);
  
  // Convert to viewBox coordinates
  const vbX = (minX / 100) * W;
  const vbY = (minY / 100) * H;
  const vbW = ((maxX - minX) / 100) * W;
  const vbH = ((maxY - minY) / 100) * H;

  const target={ x:vbX, y:vbY, w:vbW, h:vbH };
  const unchanged = ['x','y','w','h'].every(k=>Math.abs(target[k]-currentView[k])<0.5);
  if(unchanged){
    setViewBox(target);
    return;
  }

  stopZoomAnimation();
  animateViewBox(currentView,target);
}

// Optimized drag vertex - throttled updates
let dragThrottle = null;
export function startDragVertex(e,kind,key,idx){
  e.preventDefault(); e.stopPropagation();
  const move=(ev)=>{
    if (dragThrottle) return;
    dragThrottle = requestAnimationFrame(() => {
      dragThrottle = null;
      const [x,y]=screenToPct(ev.clientX,ev.clientY);
      if(kind==='land') MODEL.lands[key].points[idx]=[x,y];
      else MODEL.roads[key].points[idx]=[x,y];
      drawAll();
    });
  };
  const up=()=>{
    if (dragThrottle) cancelAnimationFrame(dragThrottle);
    dragThrottle = null;
    window.removeEventListener('mousemove',move); 
    window.removeEventListener('mouseup',up);
    dumpJSON(); autosave(MODEL);
  };
  window.addEventListener('mousemove',move); window.addEventListener('mouseup',up,{once:true});
}

// Optimized drag whole - throttled updates
export function startDragWhole(e,kind,key){
  e.preventDefault(); e.stopPropagation();
  if(kind==='land' && state.locks?.landsLocked) return;
  const ref=screenToPct(e.clientX,e.clientY);
  const move=(ev)=>{
    if (dragThrottle) return;
    dragThrottle = requestAnimationFrame(() => {
      dragThrottle = null;
      const [nx,ny]=screenToPct(ev.clientX,ev.clientY);
      const dx=nx-ref[0], dy=ny-ref[1];
      if(kind==='land'){
        MODEL.lands[key].points = MODEL.lands[key].points.map(([x,y])=>[clamp(+((x+dx)).toFixed(2),0,100), clamp(+((y+dy)).toFixed(2),0,100)]);
      }else if(kind==='road'){
        MODEL.roads[key].points = MODEL.roads[key].points.map(([x,y])=>[clamp(+((x+dx)).toFixed(2),0,100), clamp(+((y+dy)).toFixed(2),0,100)]);
      }else if(kind==='wall'){
        const w=MODEL.walls[key]; w.cx=clamp(+((w.cx+dx)).toFixed(2),0,100); w.cy=clamp(+((w.cy+dy)).toFixed(2),0,100);
      }
      ref[0] = nx; ref[1] = ny;
      drawAll();
    });
  };
  const up=()=>{
    if (dragThrottle) cancelAnimationFrame(dragThrottle);
    dragThrottle = null;
    window.removeEventListener('mousemove',move); 
    window.removeEventListener('mouseup',up);
    dumpJSON(); autosave(MODEL);
  };
  window.addEventListener('mousemove',move); window.addEventListener('mouseup',up,{once:true});
}

// Optimized drag POI - throttled updates
export function startDragPOI(e,i){
  e.preventDefault(); e.stopPropagation();
  if(state.locks?.poiLocked) return;
  const move=(ev)=>{
    if (dragThrottle) return;
    dragThrottle = requestAnimationFrame(() => {
      dragThrottle = null;
      const [x,y]=screenToPct(ev.clientX,ev.clientY);
      MODEL.poi[i].x=x; MODEL.poi[i].y=y; drawAll();
    });
  };
  const up=()=>{
    if (dragThrottle) cancelAnimationFrame(dragThrottle);
    dragThrottle = null;
    window.removeEventListener('mousemove',move); 
    window.removeEventListener('mouseup',up);
    dumpJSON(); autosave(MODEL);
  };
  window.addEventListener('mousemove',move); window.addEventListener('mouseup',up,{once:true});
}

export function canvasDown(e){
  const [x,y]=screenToPct(e.clientX,e.clientY);
  if(state.addingPOI){
    state._pendingPOI = {x,y};
    const modal = document.getElementById('poiModal');
    if(modal) modal.hidden=false;
    return;
  }
  if(state.mode==='select'){
    const onLand = e.target && typeof e.target.closest==='function' ? e.target.closest('.land') : null;
    if(!onLand){ select(null, null); }
    return;
  }
  if(state.mode==='draw-land'){
    if(!state.drawing){ state.drawing={kind:'land',points:[[x,y]]}; drawGhost(); }
    else{ state.drawing.points.push([x,y]); drawGhost(); }
  } else if(state.mode==='draw-road'){
    if(!state.drawing){ state.drawing={kind:'road',points:[[x,y]]}; drawGhost(true); }
    else{ state.drawing.points.push([x,y]); drawGhost(true); }
  }
}

export function drawGhost(isRoad=false,isWall=false){
  const pts = state.drawing?.points?.map(([x,y])=>[x*W/100,y*H/100].join(',')).join(' ');
  clearLayer(hLayer);
  const kind = state.drawing?.kind;
  const el = isWall || kind==='wall'
    ? mkEl('circle',{class:'wall ghost',cx:state.drawing.center[0]*W/100,cy:state.drawing.center[1]*H/100,r:state.drawing.r*W/100,strokeWidth:8})
    : (kind==='mountain' && state.drawing?.center && state.brush.mountain.shape==='triangle')
    ? (()=>{ const [cx,cy]=state.drawing.center, r=state.drawing.r;
        const tri=trianglePts(cx,cy,r).map(([px,py])=>[px*W/100,py*H/100].join(',')).join(' ');
        return mkEl('polygon',{class:'mountain-tri ghost',points:tri});
      })()
    : (isRoad || kind==='road' || kind==='river' || kind==='mountain')
    ? mkEl('polyline',{class:(kind==='river'?'river':'mountain')+' ghost',
        points:pts,strokeWidth:(kind==='river'? (state.brush.river.width||7)
                               : kind==='mountain'? (state.brush.mountain.width||10)
                               : (state.brush.road.width||3))})
    : mkEl('polygon',{class: (kind==='forest' ? 'forest-area ghost' : 'land ghost'), points:pts});
  hLayer.append(el);
}

export function finishDrawing(){
  if(!state.drawing) return;
  const isRoad = state.drawing.kind==='road';
  const isRiver = state.drawing.kind==='river';
  const isWall = state.drawing.kind==='wall';
  const isForest = state.drawing.kind==='forest';
  const isMountain = state.drawing.kind==='mountain';
  if(isWall){
    if(state._wallMove){ window.removeEventListener('mousemove',state._wallMove); state._wallMove=null; }
    if(!MODEL.walls) MODEL.walls=[];
    const {center:[cx,cy],r}=state.drawing;
    if(r<=0){ cancelDrawing(); return; }
    MODEL.walls.push({id:'wall-'+(MODEL.walls.length+1),name:'',desc:'',cx,cy,r,width:8});
    state.drawing=null; select('wall',MODEL.walls.length-1); dumpJSON(); autosave(MODEL); return;
  }
  if(state.drawing.points.length < ((isRoad||isRiver)?2 : (isForest?3 : (isMountain?2 : 3)))){ cancelDrawing(); return;}
  if(!isRoad && !isRiver && !isWall && !isForest && !isMountain){
    let idx=1; while(MODEL.lands['Land'+String(idx).padStart(2,'0')]) idx++;
    const id='Land'+String(idx).padStart(2,'0');
    MODEL.lands[id]={id,name:id,desc:'',points:state.drawing.points};
    select('land',id);
  }else if(isRoad){
    const id='road-'+(MODEL.roads.length+1);
    MODEL.roads.push({id,name:'',type:state.brush.road.type||'street',width:state.brush.road.width||4,points:state.drawing.points});
    select('road',MODEL.roads.length-1);
  }else if(isRiver){
    if(!Array.isArray(MODEL.rivers)) MODEL.rivers=[];
    MODEL.rivers.push({id:'river-'+(MODEL.rivers.length+1),points:state.drawing.points,width:state.brush.river.width||7});
  }else if(isForest){
    if(!Array.isArray(MODEL.forest)) MODEL.forest=[];
    MODEL.forest.push({id:'forest-'+(MODEL.forest.length+1),points:state.drawing.points});
  }else if(isMountain){
    if(state._mountMove){ window.removeEventListener('mousemove',state._mountMove); state._mountMove=null; }
    if(!Array.isArray(MODEL.mountains)) MODEL.mountains=[];
    if(state.drawing.center && (state.brush.mountain.shape==='triangle')){ 
      const [cx,cy]=state.drawing.center, r=state.drawing.r||6;
      const pts=trianglePts(cx,cy,r);
      MODEL.mountains.push({id:'mountain-'+(MODEL.mountains.length+1),points:pts,shape:'triangle'});
    } else {
      MODEL.mountains.push({id:'mountain-'+(MODEL.mountains.length+1),points:state.drawing.points,width:state.brush.mountain.width||10});
    }
  }
  state.drawing=null; drawAll(); dumpJSON(); autosave(MODEL);
}

export function cancelDrawing(){ 
  if(state._wallMove){ window.removeEventListener('mousemove',state._wallMove); state._wallMove=null; }
  state.drawing=null; drawAll(); 
}

function mkEl(tag,attrs){const ns='http://www.w3.org/2000/svg';const el=document.createElementNS(ns,tag);for(const k in attrs)el.setAttribute(k,attrs[k]);return el;}
function clearLayer(el){ while(el && el.firstChild) el.removeChild(el.firstChild); }

function trianglePts(cx,cy,r){
  const h = r*1.732;
  return [
    [cx, cy - h/2],
    [cx - r, cy + h/2],
    [cx + r, cy + h/2]
  ];
}