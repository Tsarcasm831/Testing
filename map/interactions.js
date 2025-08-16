import { svg } from './constants.js';
import { MODEL, state } from './model.js';
import { clamp, screenToPct, autosave } from './utils.js';
import { dumpJSON } from './export-utils.js';
import { drawAll } from './render.js';
import { W, H, hLayer } from './constants.js';

export function select(kind,key){ state.selected={kind,key}; drawAll(); }

export function startDragVertex(e,kind,key,idx){
  e.preventDefault(); e.stopPropagation();
  const move=(ev)=>{
    const [x,y]=screenToPct(ev.clientX,ev.clientY);
    if(kind==='district') MODEL.districts[key].points[idx]=[x,y];
    else MODEL.roads[key].points[idx]=[x,y];
    drawAll();
  };
  const up=()=>{window.removeEventListener('mousemove',move); window.removeEventListener('mouseup',up);
    dumpJSON(); autosave(MODEL);
  };
  window.addEventListener('mousemove',move); window.addEventListener('mouseup',up,{once:true});
}

export function startDragWhole(e,kind,key){
  e.preventDefault(); e.stopPropagation();
  const ref=screenToPct(e.clientX,e.clientY);
  const move=(ev)=>{
    const [nx,ny]=screenToPct(ev.clientX,ev.clientY);
    const dx=nx-ref[0], dy=ny-ref[1];
    if(kind==='district'){
      MODEL.districts[key].points = MODEL.districts[key].points.map(([x,y])=>[clamp(+((x+dx)).toFixed(2),0,100), clamp(+((y+dy)).toFixed(2),0,100)]);
    }else if(kind==='road'){
      MODEL.roads[key].points = MODEL.roads[key].points.map(([x,y])=>[clamp(+((x+dx)).toFixed(2),0,100), clamp(+((y+dy)).toFixed(2),0,100)]);
    }else if(kind==='wall'){
      const w=MODEL.walls[key]; w.cx=clamp(+((w.cx+dx)).toFixed(2),0,100); w.cy=clamp(+((w.cy+dy)).toFixed(2),0,100);
    }
    drawAll();
  };
  const up=()=>{window.removeEventListener('mousemove',move); window.removeEventListener('mouseup',up);
    dumpJSON(); autosave(MODEL);
  };
  window.addEventListener('mousemove',move); window.addEventListener('mouseup',up,{once:true});
}

export function startDragPOI(e,i){
  e.preventDefault(); e.stopPropagation();
  const move=(ev)=>{
    const [x,y]=screenToPct(ev.clientX,ev.clientY);
    MODEL.poi[i].x=x; MODEL.poi[i].y=y; drawAll();
  };
  const up=()=>{window.removeEventListener('mousemove',move); window.removeEventListener('mouseup',up);
    dumpJSON(); autosave(MODEL);
  };
  window.addEventListener('mousemove',move); window.addEventListener('mouseup',up,{once:true});
}

export function canvasDown(e){
  const [x,y]=screenToPct(e.clientX,e.clientY);
  // Handle placing a new POI via modal
  if(state.addingPOI){
    const type = document.getElementById('poiType').value;
    const inId = (document.getElementById('poiId').value||'').trim();
    const name = (document.getElementById('poiName').value||'').trim();
    const desc = (document.getElementById('poiDesc').value||'').trim();
    const idx = (MODEL.poi?.length||0)+1;
    let id = inId || (type==='gate' ? `gate-${idx}` : type==='park' ? `C${idx}` : type==='letter' ? String.fromCharCode(64 + ((idx%26)||26)) : `poi-${idx}`);
    if(!Array.isArray(MODEL.poi)) MODEL.poi=[];
    MODEL.poi.push({id,name,type,x,y,desc});
    state.addingPOI=false; document.getElementById('poiModal').hidden=true;
    select('poi', MODEL.poi.length-1); dumpJSON(); autosave(MODEL);
    return;
  }
  if(state.mode==='select'){ if(e.target===svg){ state.selected=null; drawAll(); } return; }
  if(state.mode==='draw-district'){
    if(!state.drawing){ state.drawing={kind:'district',points:[[x,y]]}; drawGhost(); }
    else{ state.drawing.points.push([x,y]); drawGhost(); }
  } else if(state.mode==='draw-road'){
    if(!state.drawing){ state.drawing={kind:'road',points:[[x,y]]}; drawGhost(true); }
    else{ state.drawing.points.push([x,y]); drawGhost(true); }
  } else if(state.mode==='draw-river'){
    if(!state.drawing){
      state.drawing={kind:'river',points:[[x,y]]};
      drawGhost(true);
      const move=(ev)=>{
        const [mx,my]=screenToPct(ev.clientX,ev.clientY);
        const last=state.drawing.points[state.drawing.points.length-1];
        if(!last || Math.hypot(mx-last[0], my-last[1])>0.3){
          state.drawing.points.push([mx,my]); drawGhost(true);
        }
      };
      const up=()=>{
        window.removeEventListener('mousemove',move);
        finishDrawing();
      };
      window.addEventListener('mousemove',move);
      window.addEventListener('mouseup',up,{once:true});
    }
  } else if(state.mode==='draw-grass' || state.mode==='draw-forest' || state.mode==='draw-mountain'){
    if(!state.drawing){
      state.drawing={kind: state.mode.replace('draw-',''), points:[[x,y]]};
      drawGhost(true);
      const move=(ev)=>{
        const [mx,my]=screenToPct(ev.clientX,ev.clientY);
        const last=state.drawing.points[state.drawing.points.length-1];
        if(!last || Math.hypot(mx-last[0], my-last[1])>0.3){
          state.drawing.points.push([mx,my]); drawGhost(true);
        }
      };
      const up=()=>{ window.removeEventListener('mousemove',move); finishDrawing(); };
      window.addEventListener('mousemove',move); window.addEventListener('mouseup',up,{once:true});
    }
  } else if(state.mode==='draw-wall'){
    if(!state.drawing){
      state.drawing={kind:'wall',center:[x,y],r:0};
      const move=(ev)=>{ const [mx,my]=screenToPct(ev.clientX,ev.clientY);
        const dx=mx-x, dy=my-y; state.drawing.r=Math.hypot(dx,dy); drawGhost(false,true); };
      state._wallMove=move; window.addEventListener('mousemove',move);
    } else {
      finishDrawing();
    }
  }
}

export function drawGhost(isRoad=false,isWall=false){
  const pts = state.drawing?.points?.map(([x,y])=>[x*W/100,y*H/100].join(',')).join(' ');
  clearLayer(hLayer);
  const kind = state.drawing?.kind;
  const el = isWall || kind==='wall'
    ? mkEl('circle',{class:'wall ghost',cx:state.drawing.center[0]*W/100,cy:state.drawing.center[1]*H/100,r:state.drawing.r*W/100,strokeWidth:8})
    : (isRoad || kind==='road' || kind==='river' || kind==='grass' || kind==='forest' || kind==='mountain')
    ? mkEl('polyline',{class:(kind==='river'?'river':(kind==='grass'?'grass':(kind==='forest'?'forest':'mountain')))+' ghost',points:pts,strokeWidth:(kind==='grass'?28:(kind==='forest'?10:(kind==='mountain'?10:3)))})
    : mkEl('polygon',{class:'district ghost',points:pts});
  hLayer.append(el);
}

export function finishDrawing(){
  if(!state.drawing) return;
  const isRoad = state.drawing.kind==='road';
  const isRiver = state.drawing.kind==='river';
  const isWall = state.drawing.kind==='wall';
  const isGrass = state.drawing.kind==='grass';
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
  if(state.drawing.points.length < (isRoad?2:(isRiver?2: (isGrass||isForest||isMountain?2:3)))){ cancelDrawing(); return;}
  if(!isRoad && !isRiver && !isWall && !isGrass && !isForest && !isMountain){
    let idx=1; while(MODEL.districts['district-'+idx]) idx++;
    const id='district-'+idx;
    MODEL.districts[id]={id,name:'',desc:'',points:state.drawing.points};
    select('district',id);
  }else if(isRoad){
    const id='road-'+(MODEL.roads.length+1);
    MODEL.roads.push({id,name:'',type:'street',width:3,points:state.drawing.points});
    select('road',MODEL.roads.length-1);
  }else if(isRiver){
    if(!Array.isArray(MODEL.rivers)) MODEL.rivers=[];
    MODEL.rivers.push({id:'river-'+(MODEL.rivers.length+1),points:state.drawing.points,width:7});
  }else if(isGrass){
    if(!Array.isArray(MODEL.grass)) MODEL.grass=[];
    MODEL.grass.push({id:'grass-'+(MODEL.grass.length+1),points:state.drawing.points,width:28});
  }else if(isForest){
    if(!Array.isArray(MODEL.forest)) MODEL.forest=[];
    MODEL.forest.push({id:'forest-'+(MODEL.forest.length+1),points:state.drawing.points,width:10});
  }else if(isMountain){
    if(!Array.isArray(MODEL.mountains)) MODEL.mountains=[];
    MODEL.mountains.push({id:'mountain-'+(MODEL.mountains.length+1),points:state.drawing.points,width:10});
  }
  state.drawing=null; drawAll(); dumpJSON(); autosave(MODEL);
}

export function cancelDrawing(){ 
  if(state._wallMove){ window.removeEventListener('mousemove',state._wallMove); state._wallMove=null; }
  state.drawing=null; drawAll(); 
}

/* lightweight helpers to avoid importing heavy modules here */
function mkEl(tag,attrs){const ns='http://www.w3.org/2000/svg';const el=document.createElementNS(ns,tag);for(const k in attrs)el.setAttribute(k,attrs[k]);return el;}
function clearLayer(el){ while(el && el.firstChild) el.removeChild(el.firstChild); }