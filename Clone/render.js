import { W, H, svg, dLayer, rLayer, pLayer, hLayer, wLayer, tip, oceanMaskShapes, LAND_ICONS } from './constants.js';
import { MODEL, state } from './model.js';
import { pct, mk, clear, autosave } from './utils.js';
import { select, startDragVertex, startDragWhole, startDragPOI } from './interactions.js';
import { dumpJSON } from './export-utils.js';

function isSelected(kind,key){ return state.selected && state.selected.kind===kind && state.selected.key===key; }
const getToggle = (id, def=true) => { const el = document.getElementById(id); return el ? !!el.checked : def; };

// Performance optimization: batch draws with RAF
let rafPending = false;
let dirtyLayers = new Set();

export function drawAll(){
  dirtyLayers.add('grass');
  dirtyLayers.add('forest');
  dirtyLayers.add('mountains');
  dirtyLayers.add('roads');
  dirtyLayers.add('lands');
  dirtyLayers.add('walls');
  dirtyLayers.add('poi');
  dirtyLayers.add('handles');
  dirtyLayers.add('form');
  scheduleRender();
}

function scheduleRender() {
  if (rafPending) return;
  rafPending = true;
  requestAnimationFrame(() => {
    rafPending = false;
    performRender();
  });
}

function performRender() {
  if (dirtyLayers.has('grass')) drawGrass();
  if (dirtyLayers.has('forest')) drawForest();
  if (dirtyLayers.has('mountains')) drawMountains();
  if (dirtyLayers.has('roads')) drawRoads();
  if (dirtyLayers.has('lands')) drawLands();
  if (dirtyLayers.has('walls')) drawWalls();
  if (dirtyLayers.has('poi')) drawPOI();
  if (dirtyLayers.has('handles')) drawHandles();
  if (dirtyLayers.has('form')) updateForm();
  dirtyLayers.clear();
}

function drawLands(){
  clear(dLayer);
  clear(oceanMaskShapes);
  // Initialize mask with white background (reveal water everywhere)
  oceanMaskShapes.appendChild(mk('rect', {x:0, y:0, width:W, height:H, fill:'white'}));

  const shouldDrawLands = getToggle('toggleLands');
  const locked = !!state.locks?.landsLocked;
  const fragment = document.createDocumentFragment();
  const maskFragment = document.createDocumentFragment();
  const selectedKey = state.selected?.kind === 'land' ? state.selected.key : null;

  for(const k in MODEL.lands){
    const d=MODEL.lands[k];
    const pts=d.points.map(([x,y])=>[x*W/100,y*H/100].join(',')).join(' ');
    maskFragment.appendChild(mk('polygon',{ points:pts, fill:'black' }));

    if(shouldDrawLands){
      const col = d.color || '#22d3ee';
      const isSelected = k === selectedKey;
      const opacity = selectedKey && !isSelected ? '0.25' : '1';
      const poly=mk('polygon',{
        class:'land '+(isSelected?'selected':''),
        'data-id':k,
        points:pts,
        style:`--dist-stroke:${col};--dist-fill:${col}55;opacity:${opacity}`
      });
      poly.addEventListener('mouseenter',e=>showTip(e,{name:d.name,desc:d.desc}));
      poly.addEventListener('mousemove',moveTip);
      poly.addEventListener('mouseleave',hideTip);
      poly.addEventListener('mousedown',e=>{
        if(state.addingPOI) return;
        e.stopPropagation();
        if(locked) return;
        if(state.mode==='select'){
          select('land',k);
          if(e.altKey){
            startDragWhole(e,'land',k);
          }
        }
      });
      fragment.appendChild(poly);

      // Add icon if this land is selected and has a special icon
      if(isSelected && LAND_ICONS[k]){
        // Calculate center of land's bounding box
        let minX = 100, maxX = 0, minY = 100, maxY = 0;
        for(const [x,y] of d.points){
          minX = Math.min(minX, x);
          maxX = Math.max(maxX, x);
          minY = Math.min(minY, y);
          maxY = Math.max(maxY, y);
        }
        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;
        const size = Math.min((maxX - minX), (maxY - minY)) * 0.3; // Icon is 30% of land size

        const icon = mk('image', {
          href: LAND_ICONS[k],
          x: (centerX - size/2) * W/100,
          y: (centerY - size/2) * H/100,
          width: size * W/100,
          height: size * H/100,
          opacity: '0.8',
          style: 'pointer-events: none;'
        });
        fragment.appendChild(icon);
      }
    }
  }
  oceanMaskShapes.appendChild(maskFragment);
  if(shouldDrawLands){
    dLayer.appendChild(fragment);
  }
}

function drawRoads(){
  clear(rLayer);
  if(!getToggle('toggleRoads')) return;
  const fragment = document.createDocumentFragment();
  for(let i=0;i<MODEL.roads.length;i++){
    const r=MODEL.roads[i];
    const d=r.points.map(p=>[p[0]*W/100,p[1]*H/100].join(',')).join(' ');
    const pl=mk('polyline',{class:`road ${r.type} ${isSelected('road',i)?'selected':''}`,'data-i':i,points:d,strokeWidth:Math.max(4, r.width ?? 4)});
    pl.addEventListener('mouseenter',e=>showTip(e,{name:r.name||r.id||'road',desc:r.type+` (${r.width||3}px)`}));
    pl.addEventListener('mousemove',moveTip);
    pl.addEventListener('mouseleave',hideTip);
    pl.addEventListener('mousedown',e=>{
      e.stopPropagation();
      if(state.mode==='select'){ select('road',i); if(e.altKey){ startDragWhole(e,'road',i);} }
    });
    pl.addEventListener('wheel', e => {
      if(state.mode!=='select') return;
      e.preventDefault();
      select('road', i);
      const r = MODEL.roads[i];
      const step = (e.deltaY < 0 ? 1 : -1);
      r.width = Math.max(1, Math.min(24, (r.width ?? 4) + step));
      drawAll(); dumpJSON(); autosave(MODEL);
    });
    fragment.appendChild(pl);
  }
  rLayer.appendChild(fragment);
}

function drawRivers(){
  const layer = document.getElementById('riverLayer');
  clear(layer);
  return;
}

function drawGrass(){
  const layer = document.getElementById('grassLayer');
  clear(layer);
  if(!getToggle('toggleGrass') || !Array.isArray(MODEL.grass)) return;
  const fragment = document.createDocumentFragment();
  for(const g of MODEL.grass){
    const d=g.points.map(p=>[p[0]*W/100,p[1]*H/100].join(',')).join(' ');
    fragment.appendChild(mk('polyline',{class:'grass',points:d,strokeWidth:g.width||50}));
  }
  layer.appendChild(fragment);
}

function drawForest(){
  const layer = document.getElementById('forestLayer');
  clear(layer);
  if(!getToggle('toggleForest') || !Array.isArray(MODEL.forest)) return;
  const fragment = document.createDocumentFragment();
  for(const f of MODEL.forest){
    const d=f.points.map(p=>[p[0]*W/100,p[1]*H/100].join(',')).join(' ');
    fragment.appendChild(mk('polygon',{class:'forest-area',points:d}));
  }
  layer.appendChild(fragment);
}

function drawMountains(){
  const layer = document.getElementById('mountainLayer');
  clear(layer);
  if(!getToggle('toggleMountains') || !Array.isArray(MODEL.mountains)) return;
  const fragment = document.createDocumentFragment();
  for(const m of MODEL.mountains){
    const d=m.points.map(p=>[p[0]*W/100,p[1]*H/100].join(',')).join(' ');
    if(m.shape==='triangle'){
      fragment.appendChild(mk('polygon',{class:'mountain-tri',points:d}));
    }else{
      fragment.appendChild(mk('polyline',{class:'mountain',points:d,strokeWidth:m.width||10}));
    }
  }
  layer.appendChild(fragment);
}

function drawWalls(){
  clear(wLayer);
  if(!getToggle('toggleWalls') || !Array.isArray(MODEL.walls)) return;
  const fragment = document.createDocumentFragment();
  for(let i=0;i<MODEL.walls.length;i++){
    const w=MODEL.walls[i], c=mk('circle',{class:`wall ${isSelected('wall',i)?'selected':''}`,'data-i':i,
      cx:w.cx*W/100, cy:w.cy*H/100, r:w.r*W/100, strokeWidth:w.width||8});
    c.addEventListener('mouseenter',e=>showTip(e,{name:w.name||w.id||'Wall',desc:w.desc||''}));
    c.addEventListener('mousemove',moveTip); c.addEventListener('mouseleave',hideTip);
    c.addEventListener('mousedown',e=>{ e.stopPropagation(); if(state.mode==='select'){ select('wall',i); if(e.altKey){ startDragWhole(e,'wall',i);} }});
    fragment.appendChild(c);
  }
  wLayer.appendChild(fragment);
}

function drawPOI(){
  clear(pLayer);
  if(!getToggle('togglePOI')) return;
  const locked = !!state.locks?.poiLocked;
  const fragment = document.createDocumentFragment();
  for(let i=0;i<MODEL.poi.length;i++){
    const p=MODEL.poi[i];
    const g=mk('g',{'data-i':i});
    const r=0.88, size=(W*(r*2))/100, cx=p.x*W/100, cy=p.y*H/100;
    let icon=null;
    if(/^(?:[1-9]|1[0-2])$/.test(String(p.id))) icon=String(p.id);
    else if(/^[A-E]$/.test(String(p.id))) icon=String(p.id);
    else if(p.type==='park') icon='C'; else if(p.type==='gate') icon='E';
    else if(/^[A-E]/.test(String(p.id))) icon=String(p.id)[0];
    const img = mk('image',{href:`assets/icons/${icon||'A'}.png`,x:cx-size/2,y:cy-size/2,width:size,height:size});
    g.append(img);
    g.addEventListener('mouseenter',e=>showTip(e,p));
    g.addEventListener('mousemove',moveTip);
    g.addEventListener('mouseleave',hideTip);
    g.addEventListener('mousedown',e=>{
      e.stopPropagation();
      if(locked) return;
      if(state.mode==='select'){ select('poi',i); startDragPOI(e,i); }
    });
    if(isSelected('poi',i)) g.classList.add('selected');
    fragment.appendChild(g);
  }
  pLayer.appendChild(fragment);
}

function drawHandles(){
  clear(hLayer);
  if(!state.selected) return;
  const fragment = document.createDocumentFragment();
  if(state.selected.kind==='land'){
    // Don't show handles for lands - just highlight via darkening
    return;
  } else if(state.selected.kind==='road'){
    const r=MODEL.roads[state.selected.key];
    if(!r) return;
    r.points.forEach(([x,y],idx)=>{
      const h=mk('circle',{class:'handle',r:6,cx:x*W/100,cy:y*H/100,'data-i':idx});
      h.addEventListener('mousemove',e=>startDragVertex(e,'road',state.selected.key,idx));
      fragment.appendChild(h);
    });
  }
  hLayer.appendChild(fragment);
}

function showTip(evt,obj){
  tip.hidden=false; tip.innerHTML=`<h3>${obj.name||obj.id||'Item'}</h3><p>${obj.desc||''}</p>`;
  moveTip(evt);
}
function moveTip(evt){
  const r=svg.getBoundingClientRect();
  tip.style.left=(evt.clientX-r.left+10)+'px';
  tip.style.top=(evt.clientY-r.top+10)+'px';
}
function hideTip(){ tip.hidden=true; }

function updateForm(){
  const sel=state.selected;
  document.getElementById('selNone').hidden=!!sel; document.getElementById('selForm').hidden=!sel;
  
  // Hide/Show Brush Panel based on selection mode
  // If something is selected, we might want to hide the brush panel to make room?
  // Actually, ui.js handles updateBrushPanel based on 'mode'.
  // Here we just populate the form.

  if(!sel) return;
  const obj = sel.kind==='land' ? MODEL.lands[sel.key]
            : sel.kind==='road' ? MODEL.roads[sel.key]
            : sel.kind==='wall' ? MODEL.walls[sel.key]
            : MODEL.poi[sel.key];
  if(!obj) return; // Safety check
  document.getElementById('sType').value = sel.kind;
  document.getElementById('sId').value   = obj.id ?? sel.key;
  document.getElementById('sName').value = obj.name ?? '';
  document.getElementById('sDesc').value = obj.desc ?? '';
  
  const isRoad = sel.kind==='road';
  const isLand = sel.kind==='land';
  
  document.getElementById('roadExtras').hidden = !isRoad;
  document.getElementById('landExtras').hidden = !isLand;
  
  if(isRoad){ 
    document.getElementById('sRoadType').value=obj.type||'street'; 
    document.getElementById('sRoadW').value=Math.max(4, obj.width||4); 
  }
  if(isLand){
    document.getElementById('sColor').value = obj.color || '#22d3ee';
  }
}

export { showTip, moveTip, hideTip };