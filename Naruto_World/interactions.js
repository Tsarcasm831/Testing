import { svg } from './constants.js';
import { MODEL, state } from './model.js';
import { clamp, screenToPct, autosave } from './utils.js';
import { dumpJSON } from './export-utils.js';
import { drawAll, requestRender } from './render.js';
import { W, H, hLayer } from './constants.js';

let zoomAnim = null;

function findCityAt(x, y) {
  const threshold = 2.5; // Hit radius in %
  for (const p of MODEL.poi) {
    if ((p.type === 'city' || p.type === 'hidden-village') && p.x != null && p.y != null) {
      const dx = p.x - x;
      const dy = p.y - y;
      if (Math.sqrt(dx*dx + dy*dy) < threshold) return p;
    }
  }
  return null;
}

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
  
  // Estimate duration: Reduce max duration to prevent long-running paints
  const change = dist + scaleDiff;
  const duration = Math.min(1200, Math.max(400, 400 + (change / 1500) * 800));
  
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
    requestRender(['lands', 'form']);
  } else if (kind === 'poi') {
    const p = MODEL.poi[key];
    if (p && (p.type === 'city' || p.type === 'hidden-village')) {
      if (window.__showCityModal) window.__showCityModal(key);
    }
    requestRender(['poi', 'form']);
  } else if (kind === 'road') {
    requestRender(['roads', 'handles', 'form']);
  } else if (kind === 'unit') {
    requestRender(['units', 'handles', 'form']);
  } else if (!kind) {
    // Reset zoom when nothing is selected
    animateToViewBox({x: 0, y: 0, w: W, h: H});
    requestRender(['lands', 'roads', 'poi', 'units', 'handles', 'form']);
  } else {
    drawAll(); 
  }
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
      if(kind==='land') {
        MODEL.lands[key].points[idx]=[x,y];
        requestRender(['lands']);
      } else if(kind === 'road') {
        MODEL.roads[key].points[idx]=[x,y];
        requestRender(['roads', 'handles']);
      } else if(kind === 'unit') {
        MODEL.units[key].path[idx]=[x,y];
        requestRender(['units', 'handles']); // Redraw path when dragging vertices
      }
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
        requestRender(['lands']);
      }else if(kind==='road'){
        MODEL.roads[key].points = MODEL.roads[key].points.map(([x,y])=>[clamp(+((x+dx)).toFixed(2),0,100), clamp(+((y+dy)).toFixed(2),0,100)]);
        requestRender(['roads', 'handles']);
      }else if(kind==='unit'){
        MODEL.units[key].path = MODEL.units[key].path.map(([x,y])=>[clamp(+((x+dx)).toFixed(2),0,100), clamp(+((y+dy)).toFixed(2),0,100)]);
        requestRender(['units', 'handles']);
      }
      ref[0] = nx; ref[1] = ny;
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

  const [mx, my] = screenToPct(e.clientX, e.clientY);
  const poi = MODEL.poi[i];
  const offX = poi.x - mx;
  const offY = poi.y - my;

  const move=(ev)=>{
    if (dragThrottle) return;
    dragThrottle = requestAnimationFrame(() => {
      dragThrottle = null;
      const [x,y]=screenToPct(ev.clientX,ev.clientY);
      MODEL.poi[i].x=x + offX; 
      MODEL.poi[i].y=y + offY; 
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
  
  if (state.mode === 'draw-unit') {
    const city = findCityAt(x, y);
    if (!state.drawing) {
      if (city) {
        state.drawing = { kind: 'unit', points: [[city.x, city.y]] };
        drawGhost(true);
      } else {
        alert("Unit paths must start at a city.");
      }
    } else {
      if (city) {
        // Snap to city and finish
        state.drawing.points.push([city.x, city.y]);
        finishDrawing();
      } else {
        state.drawing.points.push([x, y]);
        drawGhost(true);
      }
    }
    return;
  }

  if(state.addingPOI){
    state._pendingPOI = {x,y};
    const modal = document.getElementById('poiModal');
    if(modal) modal.hidden=false;
    return;
  }
  if(state.mode==='draw-city'){
    if(state.locks?.poiLocked) { alert('POIs are locked.'); return; }
    if(!MODEL.poi) MODEL.poi=[];
    const count = MODEL.poi.filter(p => p.type === 'city').length + 1;
    MODEL.poi.push({
      id: `City-${count}`,
      name: `City ${count}`,
      type: 'city',
      x: x,
      y: y,
      desc: ''
    });
    select('poi', MODEL.poi.length - 1);
    dumpJSON(); autosave(MODEL);
    return;
  }
  if(state.mode==='select' || state.mode==='move'){
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

export function drawGhost(isRoad=false){
  const pts = state.drawing?.points?.map(([x,y])=>[x*W/100,y*H/100].join(',')).join(' ');
  clearLayer(hLayer);
  const kind = state.drawing?.kind;
  const el = (kind==='mountain' && state.drawing?.center && state.brush.mountain.shape==='triangle')
    ? (()=>{ const [cx,cy]=state.drawing.center, r=state.drawing.r;
        const tri=trianglePts(cx,cy,r).map(([px,py])=>[px*W/100,py*H/100].join(',')).join(' ');
        return mkEl('polygon',{class:'mountain-tri ghost',points:tri});
      })()
    : (isRoad || kind==='road' || kind==='river' || kind==='mountain' || kind==='unit')
    ? mkEl('polyline',{class:(kind==='river'?'river':(kind==='mountain'?'mountain':'road'))+' ghost',
        points:pts,strokeWidth:(kind==='river'? (state.brush.river.width||7)
                               : kind==='mountain'? (state.brush.mountain.width||10)
                               : kind==='unit' ? 2
                               : (state.brush.road.width||3)),
        style: kind==='unit' ? 'stroke: #fbbf24; stroke-dasharray: 4 4;' : ''
      })
    : mkEl('polygon',{class: (kind==='forest' ? 'forest-area ghost' : 'land ghost'), points:pts});
  hLayer.append(el);
}

export function finishDrawing(){
  if(!state.drawing) return;
  const kind = state.drawing.kind;
  const points = state.drawing.points;
  
  // Determine min points based on type
  const isLine = ['road','river','mountain','unit'].includes(kind);
  if(points.length < (isLine ? 2 : 3)){ cancelDrawing(); return; }

  if(kind==='land'){
    let idx=1; while(MODEL.lands['Land'+String(idx).padStart(2,'0')]) idx++;
    const id='Land'+String(idx).padStart(2,'0');
    MODEL.lands[id]={id,name:id,desc:'',points:points};
    select('land',id);
  }else if(kind==='unit'){
    if(!MODEL.units) MODEL.units = [];
    const id = 'u' + (MODEL.units.length + 1);
    MODEL.units.push({
        id: id,
        path: points,
        currentSegment: 0,
        t: 0,
        direction: 1
    });
    select('unit', MODEL.units.length - 1);
  }else if(kind==='road'){
    const type = state.brush.road.type || 'street';
    const prefix = (type === 'bridge') ? 'bridge' : (type === 'canal' ? 'canal' : 'road');
    const id = prefix + '-' + (MODEL.roads.length+1);
    MODEL.roads.push({id,name:'',type,width:state.brush.road.width||4,points:points});
    select('road',MODEL.roads.length-1);
  }else if(kind==='river'){
    if(!Array.isArray(MODEL.rivers)) MODEL.rivers=[];
    MODEL.rivers.push({id:'river-'+(MODEL.rivers.length+1),points:points,width:state.brush.river.width||7});
  }else if(kind==='forest'){
    if(!Array.isArray(MODEL.forest)) MODEL.forest=[];
    MODEL.forest.push({id:'forest-'+(MODEL.forest.length+1),points:points});
  }else if(kind==='mountain'){
    if(!Array.isArray(MODEL.mountains)) MODEL.mountains=[];
    if(state.drawing.center && (state.brush.mountain.shape==='triangle')){ 
      const [cx,cy]=state.drawing.center, r=state.drawing.r||6;
      const pts=trianglePts(cx,cy,r);
      MODEL.mountains.push({id:'mountain-'+(MODEL.mountains.length+1),points:pts,shape:'triangle'});
    } else {
      MODEL.mountains.push({id:'mountain-'+(MODEL.mountains.length+1),points:points,width:state.brush.mountain.width||10});
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