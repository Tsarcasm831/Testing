import { svg } from './constants.js';
import { MODEL, state } from './model.js';
import { clamp, screenToPct, autosave } from './utils.js';
import { dumpJSON } from './export-utils.js';
import { drawAll, requestRender } from './render.js';
import { W, H, hLayer } from './constants.js';

let zoomAnim = null;

function animateToViewBox(target, onComplete) {
  if (zoomAnim) cancelAnimationFrame(zoomAnim);

  const currentAttr = svg.getAttribute('viewBox');
  let start = { x: 0, y: 0, w: W, h: H };
  if (currentAttr) {
    const p = currentAttr.split(/\s+|,/).map(parseFloat);
    if (p.length === 4 && p.every(n => !isNaN(n))) {
      start = { x: p[0], y: p[1], w: p[2], h: p[3] };
    }
  }

  const startCx = start.x + start.w/2;
  const startCy = start.y + start.h/2;
  const targetCx = target.x + target.w/2;
  const targetCy = target.y + target.h/2;
  
  const dist = Math.sqrt(Math.pow(targetCx - startCx, 2) + Math.pow(targetCy - startCy, 2));
  const scaleDiff = Math.abs(target.w - start.w);
  
  // Estimate duration: 1.5s min, 3s max based on magnitude of change
  const change = dist + scaleDiff;
  const duration = Math.min(3000, Math.max(1500, 1500 + (change / 1500) * 1500));
  
  const startTime = performance.now();

  function frame(now) {
    const elapsed = now - startTime;
    let t = elapsed / duration;
    if (t > 1) t = 1;
    
    // Ease in-out cubic
    const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const nx = start.x + (target.x - start.x) * ease;
    const ny = start.y + (target.y - start.y) * ease;
    const nw = start.w + (target.w - start.w) * ease;
    const nh = start.h + (target.h - start.h) * ease;

    svg.setAttribute('viewBox', `${nx} ${ny} ${nw} ${nh}`);

    if (t < 1) {
      zoomAnim = requestAnimationFrame(frame);
    } else {
      zoomAnim = null;
      if (onComplete) onComplete();
    }
  }
  zoomAnim = requestAnimationFrame(frame);
}

export function select(kind,key){ 
  state.selected={kind,key}; 
  // hide mini modal when selection changes
  const miniModal = document.getElementById('miniLandModal');
  if(miniModal) miniModal.hidden = true;

  if(kind === 'land') {
    if (window.__showMiniLandModal) window.__showMiniLandModal(key);
    zoomToLand(key);
  } else if (!kind) {
    // Reset zoom when nothing is selected
    animateToViewBox({x: 0, y: 0, w: W, h: H});
  }
  drawAll(); 
}

function zoomToLand(key, onComplete) {
  const land = MODEL.lands[key];
  if (!land || !land.points || land.points.length === 0) {
    if(onComplete) onComplete();
    return;
  }
  
  // Calculate bounding box
  let minX = 100, maxX = 0, minY = 100, maxY = 0;
  for (const [x, y] of land.points) {
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }
  
  // Add padding (20% of dimensions)
  const width = maxX - minX;
  const height = maxY - minY;
  const padX = Math.max(width * 0.2, 2);
  const padY = Math.max(height * 0.2, 2);
  
  let tMinX = Math.max(0, minX - padX);
  let tMaxX = Math.min(100, maxX + padX);
  let tMinY = Math.max(0, minY - padY);
  let tMaxY = Math.min(100, maxY + padY);

  // Convert to viewBox coordinates
  const vbX = (tMinX / 100) * W;
  const vbY = (tMinY / 100) * H;
  const vbW = ((tMaxX - tMinX) / 100) * W;
  const vbH = ((tMaxY - tMinY) / 100) * H;
  
  animateToViewBox({x: vbX, y: vbY, w: vbW, h: vbH}, onComplete);
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
        requestRender(kind==='land' ? ['lands','handles'] : ['roads','handles']);
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
      if(kind==='land') requestRender(['lands','handles']);
      else if(kind==='road') requestRender(['roads','handles']);
      else requestRender(['walls','handles']);
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
        MODEL.poi[i].x=x; MODEL.poi[i].y=y;
        requestRender(['poi']);
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
