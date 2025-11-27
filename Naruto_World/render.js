import { W, H, dLayer, rLayer, pLayer, hLayer, tip, oceanMaskShapes, LAND_ICONS, landBaseLayer, forestLayer, mountainLayer } from './constants.js';
import { MODEL, state } from './model.js';
import { mk, clear } from './utils.js';
import { select, startDragVertex, startDragWhole, startDragPOI } from './interactions.js';

function isSelected(kind,key){ return state.selected && state.selected.kind===kind && state.selected.key===key; }
const getToggle = (id, def=true) => { const el = document.getElementById(id); return el ? !!el.checked : def; };

// Performance optimization: batch draws with RAF
let rafPending = false;
let dirtyLayers = new Set();
const ALL_LAYERS = ['forest','mountains','roads','lands','poi','units','handles','form'];

const extraRenderers = {};
export function registerRenderer(name, fn) { extraRenderers[name] = fn; }

export function drawAll(){
  requestRender(ALL_LAYERS);
}

export function requestRender(layers=ALL_LAYERS){
  for (const layer of layers) dirtyLayers.add(layer);
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
  if (dirtyLayers.has('forest')) drawForest();
  if (dirtyLayers.has('mountains')) drawMountains();
  if (dirtyLayers.has('roads')) drawRoads();
  if (dirtyLayers.has('lands')) drawLands();
  if (dirtyLayers.has('poi')) drawPOI();
  if (dirtyLayers.has('units') && extraRenderers['units']) extraRenderers['units']();
  if (dirtyLayers.has('handles')) drawHandles();
  if (dirtyLayers.has('form')) updateForm();
  dirtyLayers.clear();
}

function drawLands(){
  clear(dLayer);
  clear(oceanMaskShapes);
  if(landBaseLayer) clear(landBaseLayer);
  // Initialize mask with white background (reveal water everywhere)
  oceanMaskShapes.appendChild(mk('rect', {x:0, y:0, width:W, height:H, fill:'white'}));

  const shouldDrawLands = getToggle('toggleLands');
  const bgHidden = document.getElementById('hideBackground') ? document.getElementById('hideBackground').checked : true;
  const locked = !!state.locks?.landsLocked;
  const fragment = document.createDocumentFragment();
  const maskFragment = document.createDocumentFragment();
  const baseFragment = document.createDocumentFragment();
  const selectedKey = state.selected?.kind === 'land' ? state.selected.key : null;

  for(const k in MODEL.lands){
    const d=MODEL.lands[k];
    const pts=d.points.map(([x,y])=>[x*W/100,y*H/100].join(',')).join(' ');
    maskFragment.appendChild(mk('polygon',{ points:pts, fill:'black' }));

    if(bgHidden) {
      baseFragment.appendChild(mk('polygon',{ points:pts, fill:'#e4d5b7', stroke:'none' }));
    }

    if(shouldDrawLands){
      const col = d.color || '#22d3ee';
      const isSelected = k === selectedKey;
      const opacity = selectedKey && !isSelected ? '0.25' : '1';
      const poly=mk('polygon',{
        class:'land '+(isSelected?'selected':''),
        'data-id':k,
        points:pts,
        style:`--dist-stroke:${col};--dist-fill:${col}55;opacity:${opacity}`,
        'shape-rendering': 'geometricPrecision' // Ensure consistent rendering
      });
      poly.addEventListener('mouseenter',e=>showTip(e,{name:d.name,desc:d.desc}));
      poly.addEventListener('mousemove',moveTip);
      poly.addEventListener('mouseleave',hideTip);
      poly.addEventListener('mousedown',e=>{
        hideTip();
        if(state.addingPOI) return;
        if(state.mode !== 'select' && state.mode !== 'move') return;
        e.stopPropagation();
        if(locked) return;
        
        select('land',k);
        if(state.mode === 'move'){
          startDragWhole(e,'land',k);
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
  if(landBaseLayer) landBaseLayer.appendChild(baseFragment);
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
    pl.addEventListener('mouseenter',e=>showTip(e,{name:r.name,desc:r.desc}));
    pl.addEventListener('mousemove',moveTip);
    pl.addEventListener('mouseleave',hideTip);
    pl.addEventListener('mousedown',e=>{
      hideTip();
      if(state.addingPOI) return;
      if(state.mode !== 'select' && state.mode !== 'move') return;
      e.stopPropagation();
      select('road',i);
      if(state.mode === 'move') startDragWhole(e,'road',i);
    });
    fragment.appendChild(pl);
  }
  rLayer.appendChild(fragment);
}

function drawForest(){
  clear(forestLayer);
  if(!getToggle('toggleForest', true)) return;
  if(!MODEL.forest) return;
  const fragment = document.createDocumentFragment();
  for(const f of MODEL.forest){
    const pts = f.points.map(([x,y])=>[x*W/100,y*H/100].join(',')).join(' ');
    fragment.appendChild(mk('polygon',{class:'forest-area', points:pts}));
  }
  forestLayer.appendChild(fragment);
}

function drawMountains(){
  clear(mountainLayer);
  if(!getToggle('toggleMountains', true)) return;
  if(!MODEL.mountains) return;
  const fragment = document.createDocumentFragment();
  MODEL.mountains.forEach(m => {
    if(m.shape === 'triangle'){
       // draw triangle polygons
       m.points.forEach(tri => {
          const pts = tri.map(([x,y])=>[x*W/100,y*H/100].join(',')).join(' ');
          fragment.appendChild(mk('polygon',{class:'mountain-tri', points:pts}));
       });
    } else {
       // draw lines
       const pts = m.points.map(([x,y])=>[x*W/100,y*H/100].join(',')).join(' ');
       fragment.appendChild(mk('polyline',{class:'mountain', points:pts, strokeWidth:m.width||10}));
    }
  });
  mountainLayer.appendChild(fragment);
}

function drawPOI(){
  clear(pLayer);
  if(!getToggle('togglePOI')) return;
  const fragment = document.createDocumentFragment();
  for(let i=0;i<MODEL.poi.length;i++){
    const p=MODEL.poi[i];
    const cx=p.x*W/100, cy=p.y*H/100;
    let el;
    
    const isDrawUnit = state.mode === 'draw-unit';
    const cursorStyle = isDrawUnit ? 'cursor:crosshair' : 'cursor:pointer';

    if ((p.type === 'city' || p.type === 'hidden-village' || p.type === 'gate') && p.image) {
        const size = 24; 
        el = mk('image', {
            href: p.image,
            x: cx - size/2, 
            y: cy - size/2, 
            width: size, 
            height: size, 
            class: `poi-icon ${isSelected('poi',i)?'selected':''}`,
            style: cursorStyle
        });
    } else if (p.icon && p.icon.length === 1 && /[A-E1-9]/.test(p.icon)) {
        const size = 20;
        el = mk('image', {
            href: `assets/icons/${p.icon}.png`,
            x: cx - size/2, 
            y: cy - size/2, 
            width: size, 
            height: size,
            class: `poi-icon ${isSelected('poi',i)?'selected':''}`,
            style: cursorStyle
        });
    } else {
        el = mk('circle',{cx,cy,r:5,class:`pin ${p.type} ${isSelected('poi',i)?'selected':''}`});
    }

    el.addEventListener('mouseenter',e=>{
      if(state.mode === 'draw-unit') return;
      showTip(e,p)
    });
    el.addEventListener('mousemove',e=>{
      if(state.mode === 'draw-unit') return;
      moveTip(e)
    });
    el.addEventListener('mouseleave',hideTip);
    el.addEventListener('mousedown',e=>{
      if(state.mode === 'draw-unit') return; // Allow bubbling to canvas logic
      hideTip();
      e.stopPropagation();
      if(state.locks?.poiLocked) {
         select('poi',i);
         return;
      }
      select('poi',i);
      startDragPOI(e,i);
    });
    fragment.appendChild(el);
  }
  pLayer.appendChild(fragment);
}

function drawHandles(){
  clear(hLayer);
  // Always show handles if something is selected, regardless of edit toggle
  const s = state.selected;
  if(!s) return;

  const fragment = document.createDocumentFragment();
  if(s.kind==='land'){
    const land = MODEL.lands[s.key];
    if(land) land.points.forEach(([x,y],i)=>{
      const c=mk('circle',{cx:x*W/100,cy:y*H/100,r:4,class:'handle'});
      c.addEventListener('mousedown',e=>startDragVertex(e,'land',s.key,i));
      fragment.appendChild(c);
    });
  } else if(s.kind==='road'){
    const road = MODEL.roads[s.key];
    if(road) road.points.forEach(([x,y],i)=>{
      const c=mk('circle',{cx:x*W/100,cy:y*H/100,r:4,class:'handle'});
      c.addEventListener('mousedown',e=>startDragVertex(e,'road',s.key,i));
      fragment.appendChild(c);
    });
  } else if(s.kind==='unit'){
    const unit = MODEL.units[s.key];
    if(unit && unit.path) unit.path.forEach(([x,y],i)=>{
      const c=mk('circle',{cx:x*W/100,cy:y*H/100,r:4,class:'handle', style:'fill:#fbbf24'});
      c.addEventListener('mousedown',e=>startDragVertex(e,'unit',s.key,i));
      fragment.appendChild(c);
    });
  }
  hLayer.appendChild(fragment);
}

function updateForm(){
  const f = document.getElementById('selForm');
  const n = document.getElementById('selNone');
  if(!f || !n) return;
  if(!state.selected){
    f.hidden=true; n.hidden=false; return;
  }
  f.hidden=false; n.hidden=true;
  const s=state.selected;
  document.getElementById('sType').value = s.kind;
  let obj;
  if(s.kind==='land') obj=MODEL.lands[s.key];
  else if(s.kind==='road') obj=MODEL.roads[s.key];
  else if(s.kind==='poi') obj=MODEL.poi[s.key];
  else if(s.kind==='unit') obj=MODEL.units[s.key];
  
  if(obj){
    document.getElementById('sId').value = obj.id || '';
    document.getElementById('sName').value = obj.name || '';
    document.getElementById('sDesc').value = obj.desc || '';
    const landExtras = document.getElementById('landExtras');
    const roadExtras = document.getElementById('roadExtras');
    if(landExtras) {
        landExtras.hidden = s.kind !== 'land';
        if(s.kind === 'land') document.getElementById('sColor').value = obj.color || '#22d3ee';
    }
    if(roadExtras) {
        roadExtras.hidden = s.kind !== 'road';
        if(s.kind === 'road') {
            document.getElementById('sRoadType').value = obj.type || 'street';
            document.getElementById('sRoadW').value = obj.width || 4;
        }
    }
  }
}

function showTip(e, data){
  if(!data || (!data.name && !data.desc)) return;
  tip.hidden=false;
  tip.innerHTML = `<h3>${data.name||'Unknown'}</h3>${data.desc?`<p>${data.desc}</p>`:''}`;
  moveTip(e);
}

function moveTip(e){
  if(tip.hidden) return;
  const x = e.clientX + 15;
  const y = e.clientY + 15;
  tip.style.left = x + 'px';
  tip.style.top = y + 'px';
}

function hideTip(){
  tip.hidden=true;
}

