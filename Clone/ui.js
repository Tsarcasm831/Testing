import { W, H, svg, $ } from './constants.js';
import { MODEL, state } from './model.js';
import { download, autosave } from './utils.js';
import { drawAll } from './render.js';
import { dumpJSON, buildExportSVG, buildDefaultModelJS } from './export-utils.js';
import { canvasDown, finishDrawing, cancelDrawing, select } from './interactions.js';
import { LAND_ICONS } from './constants.js';

function wireUI(){
  document.querySelectorAll('input[name="mode"]').forEach(r=>r.addEventListener('change',e=>{
    state.mode=e.target.value; state.drawing=null; document.body.dataset.mode=state.mode; drawAll(); updateBrushPanel();
  }));
  document.getElementById('edit').addEventListener('change',e=>{ state.edit=e.target.checked; drawAll(); });
  document.getElementById('snap').addEventListener('change',e=>{ state.snap=e.target.checked; });
  document.getElementById('hideBackground')?.addEventListener('change', e => {
    const bgImg = document.getElementById('backgroundImage');
    if(bgImg) bgImg.style.display = e.target.checked ? 'none' : '';
  });
  const onToggle=id=>{ const el=document.getElementById(id); if(el) el.addEventListener('change',drawAll); };
  ['toggleLands','toggleRoads','toggleWalls','togglePOI','toggleRivers','toggleGrass','toggleForest','toggleMountains'].forEach(onToggle);

  // Mobile menu wiring
  const menuBtn = document.getElementById('mobileMenuBtn');
  if(menuBtn) {
    menuBtn.addEventListener('click', () => {
      document.getElementById('side').classList.toggle('open');
    });
  }

  // POI modal wiring
  document.getElementById('addPoiBtn').addEventListener('click', ()=>{
    if(state.locks?.poiLocked){ alert('POIs are locked. Unlocking is disabled in this build.'); return; }
    state.addingPOI=true;
    // do not open modal yet; wait for map click to choose location
  });
  document.getElementById('poiCancel').addEventListener('click', ()=>{
    state.addingPOI=false;
    state._pendingPOI=null;
    document.getElementById('poiModal').hidden=true;
  });

  // Wire up the Mini Land Modal close button
  document.getElementById('mmClose').addEventListener('click', () => {
    document.getElementById('miniLandModal').hidden = true;
  });

  // Sidebar Land Color wiring
  const sColor = document.getElementById('sColor');
  if(sColor) {
    sColor.addEventListener('input', (e) => {
      if (state.selected && state.selected.kind === 'land') {
        const land = MODEL.lands[state.selected.key];
        if (land) {
          land.color = e.target.value;
          drawAll(); // Real-time update
        }
      }
    });
    sColor.addEventListener('change', () => {
      dumpJSON(); autosave(MODEL);
    });
  }

  svg.addEventListener('dblclick',finishDrawing);
  // Use mousedown to avoid resetting state on every mouse movement while hovering the map
  svg.addEventListener('mousemove',canvasDown);
  svg.addEventListener('mousemove', (e) => {
    // Close sidebar on mobile when clicking the map
    if(window.innerWidth <= 980) {
      const side = document.getElementById('side');
      if(side.classList.contains('open') && !side.contains(e.target) && e.target.id !== 'mobileMenuBtn') {
        side.classList.remove('open');
      }
    }
  });
  svg.addEventListener('wheel', throttledWheelZoom, { passive:false });
  window.addEventListener('keydown',e=>{
    const t=e.target, tag=(t?.tagName||'').toUpperCase();
    if(['INPUT','TEXTAREA','SELECT'].includes(tag) || t?.isContentEditable) return;
    if(e.key==='Escape'){ 
      cancelDrawing(); 
      if(state.addingPOI){ state.addingPOI=false; state._pendingPOI=null; document.getElementById('poiModal').hidden=true; }
      document.getElementById('miniLandModal').hidden = true;
    }
    if(e.key==='Enter' && state.drawing){ e.preventDefault(); finishDrawing(); }
    if(e.key.toLowerCase()==='e'){ document.getElementById('edit').click(); }
    if(e.key.toLowerCase()==='h'){ document.querySelector('#wrap').style.gridTemplateColumns=
      getComputedStyle(document.querySelector('#wrap')).gridTemplateColumns==='1fr 348px'?'1fr':'1fr 348px'; }
  });

  document.getElementById('apply').addEventListener('click',()=>{
    if(!state.selected) return;
    const sel=state.selected;
    if(sel.kind==='land' && state.locks?.landsLocked){ alert('Lands are locked.'); return; }
    if(sel.kind==='poi' && state.locks?.poiLocked){ alert('POIs are locked.'); return; }
    if(sel.kind==='land'){
      const d=MODEL.lands[sel.key];
      const newId=document.getElementById('sId').value.trim()||sel.key;
      // Check if ID changed and rename key if so
      if(newId !== sel.key) {
         MODEL.lands[newId] = {...d};
         delete MODEL.lands[sel.key];
         sel.key = newId;
      }
      const land = MODEL.lands[sel.key];
      land.id = newId;
      land.name = document.getElementById('sName').value;
      land.desc = document.getElementById('sDesc').value;
      land.color = document.getElementById('sColor').value;
      select('land',newId);
    } else if(sel.kind==='road'){
      const r=MODEL.roads[sel.key];
      r.id=document.getElementById('sId').value; r.name=document.getElementById('sName').value; r.desc=document.getElementById('sDesc').value;
      r.type=document.getElementById('sRoadType').value; r.width=parseInt(document.getElementById('sRoadW').value,10)||3;
    } else {
      const p=MODEL.poi[sel.key];
      p.id=document.getElementById('sId').value; p.name=document.getElementById('sName').value; p.desc=document.getElementById('sDesc').value;
    }
    drawAll(); dumpJSON(); autosave(MODEL);
  });
  document.getElementById('delete').addEventListener('click',()=>{
    if(!state.selected) return;
    const s=state.selected;
    if((s.kind==='land' && state.locks?.landsLocked) || (s.kind==='poi' && state.locks?.poiLocked)){
      alert('This item type is locked.'); return;
    }
    if(s.kind==='land') delete MODEL.lands[s.key];
    if(s.kind==='road') MODEL.roads.splice(s.key,1);
    if(s.kind==='poi') MODEL.poi.splice(s.key,1);
    if(s.kind==='wall') MODEL.walls.splice(s.key,1);
    state.selected=null; drawAll(); dumpJSON(); autosave(MODEL);
  });

  document.getElementById('copyJson').addEventListener('click', async ()=>{
    const txt = document.getElementById('json').value;
    try{
      if(document.hasFocus() && window.isSecureContext && navigator.clipboard){
        await navigator.clipboard.writeText(txt);
      } else { throw new Error('fallback'); }
    }catch{
      const ta=document.createElement('textarea');
      ta.value=txt; ta.style.position='fixed'; ta.style.opacity='0';
      document.body.appendChild(ta); ta.select();
      try{ document.execCommand('copy'); } finally{ document.body.removeChild(ta); }
    }
  });
  document.getElementById('downloadJson').addEventListener('click',()=> download('konoha-map.json', document.getElementById('json').value));
  document.getElementById('exportSvg').addEventListener('click',()=>{
    const svgStr = buildExportSVG();
    download('konoha-overlay.svg', svgStr, 'image/svg+xml');
  });
  const btnJs = document.getElementById('downloadJsModel');
  if(btnJs){ btnJs.addEventListener('click', ()=>{
    const js = buildDefaultModelJS();
    download('full-default-model.js', js, 'application/javascript');
  });}
  const btnSaveDef = document.getElementById('saveAsDefault');
  if(btnSaveDef){
    btnSaveDef.addEventListener('click', ()=>{
      const obj = {
        districts: MODEL.districts || {},
        roads: MODEL.roads || [],
        poi: MODEL.poi || [],
        walls: MODEL.walls || [],
        rivers: MODEL.rivers || [],
        grass: MODEL.grass || [],
        forest: MODEL.forest || [],
        mountains: MODEL.mountains || []
      };
      try{
        localStorage.setItem('konoha-default-model-v2', JSON.stringify(obj));
        alert('Saved current map as the default. Reload to use it.');
      }catch(e){
        alert('Failed to save default (storage full or blocked).');
      }
    });
  }
  document.getElementById('importFile').addEventListener('change',async (e)=>{
    const file=e.target.files[0]; if(!file) return;
    const text=await file.text();
    try{
      const data=JSON.parse(text);
      // new split format support (with backward compatibility)
      const lands = data.lands ?? data.districts ?? MODEL.lands;
      const roads = data.roads ?? [];
      const poi = data.poi ?? MODEL.poi;
      const walls = data.walls ?? [];
      const rivers = data.rivers ?? data.river ?? []; // accept legacy typo if any
      const terrain = data.terrain || {};
      const grass = terrain.grass ?? data.grass ?? MODEL.grass ?? [];
      const forest = terrain.forest ?? data.forest ?? MODEL.forest ?? [];
      const mountains = terrain.mountains ?? data.mountains ?? MODEL.mountains ?? [];

      if(!state.locks?.landsLocked) MODEL.lands = lands;
      MODEL.roads = roads;
      if(!state.locks?.poiLocked) MODEL.poi = poi;
      MODEL.walls = walls;
      MODEL.rivers = rivers;
      MODEL.grass = grass;
      MODEL.forest = forest;
      MODEL.mountains = mountains;

      drawAll(); dumpJSON(); autosave(MODEL);
    }catch(err){ alert('Invalid JSON'); }
  });
  document.getElementById('loadAutosave').addEventListener('click',()=>{
    const txt=localStorage.getItem('konoha-map-v2'); if(!txt){ alert('No autosave found'); return; }
    try{
      const data=JSON.parse(txt);
      if(!state.locks?.landsLocked) MODEL.lands=data.lands||data.districts||MODEL.lands;
      MODEL.roads=data.roads||[];
      if(!state.locks?.poiLocked) MODEL.poi=data.poi||MODEL.poi;
      MODEL.walls=data.walls||[];
      drawAll(); dumpJSON();
    } catch { alert('Autosave corrupt'); }
  });
  document.getElementById('loadDefaultLands').addEventListener('click', async ()=>{
    if(state.locks?.landsLocked){ alert('Lands are locked.'); return; }
    if(!confirm('Load default lands and terrain? This will replace current lands and terrain.')) return;
    const { DEFAULT_MODEL } = await import('./user-defaults.js');
    MODEL.lands = DEFAULT_MODEL.lands || {};
    MODEL.mountains = DEFAULT_MODEL.mountains || [];
    MODEL.forest = DEFAULT_MODEL.forest || [];
    MODEL.grass = DEFAULT_MODEL.grass || [];
    drawAll(); dumpJSON(); autosave(MODEL);
  });
  document.getElementById('loadDefaultPOI').addEventListener('click', async ()=>{
    if(state.locks?.poiLocked){ alert('POIs are locked.'); return; }
    if(!confirm('Append default POI to current POI?')) return;
    const { DEFAULT_MODEL } = await import('./user-defaults.js');
    const defaultPOI = DEFAULT_MODEL.poi || [];
    if(!Array.isArray(MODEL.poi)) MODEL.poi = [];
    MODEL.poi.push(...defaultPOI);
    drawAll(); dumpJSON(); autosave(MODEL);
  });
  document.getElementById('clearAll').addEventListener('click',()=>{
    if(!confirm('Clear roads and overlays? Lands/POIs are locked and will be preserved.')) return;
    MODEL.roads=[];
    // preserve lands when locked
    if(!state.locks?.landsLocked) MODEL.lands={};
    MODEL.walls=[]; 
    MODEL.mountains=[];
    MODEL.forest=[];
    MODEL.grass=[];
    drawAll(); dumpJSON(); autosave(MODEL);
  });

  // Create POI from modal after map placement
  document.getElementById('poiCreate').addEventListener('click', ()=>{
    if(state.locks?.poiLocked){ alert('POIs are locked.'); return; }
    const pos = state._pendingPOI; if(!state.addingPOI || !pos) return;
    const type = document.getElementById('poiType').value;
    const inId = (document.getElementById('poiId').value||'').trim();
    const name = (document.getElementById('poiName').value||'').trim();
    const desc = (document.getElementById('poiDesc').value||'').trim();
    const idx = (MODEL.poi?.length||0)+1;
    const autoId = (type==='gate' ? `gate-${idx}` : type==='park' ? `C${idx}` : type==='letter' ? String.fromCharCode(64 + ((idx%26)||26)) : `poi-${idx}`);
    if(!Array.isArray(MODEL.poi)) MODEL.poi=[];
    MODEL.poi.push({id: inId || autoId, name, type, x: pos.x, y: pos.y, desc});
    state.addingPOI=false; state._pendingPOI=null; document.getElementById('poiModal').hidden=true;
    select('poi', MODEL.poi.length-1); dumpJSON(); autosave(MODEL);
  });

  // Brush controls
  const $r=t=>document.getElementById(t);
  $r('brRoadType').addEventListener('change',e=>state.brush.road.type=e.target.value);
  $r('brRoadW').addEventListener('change',e=>state.brush.road.width=parseInt(e.target.value,10)||3);
  $r('brRiverW').addEventListener('change',e=>state.brush.river.width=parseInt(e.target.value,10)||7);
  $r('brForestW').addEventListener('change',e=>state.brush.forest.width=parseInt(e.target.value,10)||40);
  $r('brMountainShape').addEventListener('change',e=>{
    state.brush.mountain.shape=e.target.value;
    $r('brMountainWWrap').hidden = e.target.value==='triangle';
    $r('brMountainTriWrap').hidden = e.target.value!=='triangle';
  });
  $r('brMountainW').addEventListener('change',e=>state.brush.mountain.width=parseInt(e.target.value,10)||10);
  $r('brMountainTri').addEventListener('change',e=>state.brush.mountain.triSize=parseInt(e.target.value,10)||8);
}

function migrateDefaults(){
  /* force all districts to sequential residential ids/names each load */
  const nd={}, list=Object.values(MODEL.districts); let n=1;
  for(const d of list){ const id=`residential${n++}`; nd[id]={...d, id, name:id, desc:''}; }
  MODEL.districts = nd;
}

function updateBrushPanel(){
  const panel = document.getElementById('brushPanel');
  if(!panel) return;
  const rows = panel.querySelectorAll('[data-for]');
  let visible = false;
  rows.forEach(row=>{
    const show = row.getAttribute('data-for') === state.mode;
    row.hidden = !show;
    if(show) visible = true;
  });
  // Hide the entire fieldset if no controls are relevant for the current mode
  // This effectively "replaces" it with the selection panel (which is below it) by removing it from layout
  panel.hidden = !visible;
}

// Global function to show mini modal
window.__showMiniLandModal = function(key) {
  const land = MODEL.lands[key];
  if (!land) return;

  const modal = document.getElementById('miniLandModal');
  const mmName = document.getElementById('mmName');
  const mmDesc = document.getElementById('mmDesc');
  const mmIcon = document.getElementById('mmIcon');
  const mmLink = document.getElementById('mmLink');

  mmName.textContent = land.name || land.id;
  mmDesc.textContent = land.desc || 'No description.';
  
  const iconSrc = LAND_ICONS[land.id] || LAND_ICONS[key];
  if (iconSrc) {
    mmIcon.src = iconSrc;
    mmIcon.hidden = false;
  } else {
    mmIcon.hidden = true;
  }

  // Heuristic check for built-in land IDs since DEFAULT_MODEL is lazy loaded
  const isBuiltIn = /^(Land|Island)\d+$/.test(land.id || key);
  mmLink.href = isBuiltIn ? `land-pages/${land.id || key}.html` : `land-pages/land.html?id=${land.id || key}`;

  modal.hidden = false;
}

// Zoom helpers - throttled for performance
let zoomThrottle = null;
function throttledWheelZoom(e) {
  e.preventDefault();
  if (zoomThrottle) return;
  zoomThrottle = setTimeout(() => {
    zoomThrottle = null;
  }, 16); // ~60fps
  onWheelZoom(e);
}

function parseViewBox() {
  const vb = (svg.getAttribute('viewBox') || '').trim().split(/\s+/).map(Number);
  return (vb.length===4 && vb.every(n=>!Number.isNaN(n))) ? { x:vb[0], y:vb[1], w:vb[2], h:vb[3] } : { x:0, y:0, w:W, h:H };
}
function setViewBox(vb){ svg.setAttribute('viewBox', `${vb.x} ${vb.y} ${vb.w} ${vb.h}`); }
function onWheelZoom(e){
  const vb = parseViewBox();
  const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
  const p = pt.matrixTransform(svg.getScreenCTM().inverse());
  const minW = W/6, minH = H/6, maxW = W, maxH = H;
  const zoomFactor = e.deltaY < 0 ? 0.9 : 1.1;
  const newW = Math.min(maxW, Math.max(minW, vb.w * zoomFactor));
  const newH = Math.min(maxH, Math.max(minH, vb.h * zoomFactor));
  const tx = (p.x - vb.x) / vb.w;
  const ty = (p.y - vb.y) / vb.h;
  let nx = p.x - tx * newW;
  let ny = p.y - ty * newH;
  nx = Math.max(0, Math.min(W - newW, nx));
  ny = Math.max(0, Math.min(H - newH, ny));
  setViewBox({ x:nx, y:ny, w:newW, h:newH });
}

function updatePieceView(){
  const sel = document.getElementById('viewPiece');
  const ta = document.getElementById('piece');
  if(!sel || !ta) return;
  const key = sel.value;
  const src = key==='lands' ? MODEL.lands
            : key==='roads' ? MODEL.roads
            : key==='poi' ? MODEL.poi
            : key==='walls' ? MODEL.walls
            : key==='rivers' ? MODEL.rivers
            : key==='forest' ? MODEL.forest
            : key==='grass' ? MODEL.grass
            : key==='mountains' ? MODEL.mountains
            : {};
  ta.value = JSON.stringify(src ?? {}, null, 2);
}

export function initUI(){
  wireUI();
  document.body.dataset.mode=state.mode;
  // Ensure starting at max zoom-out
  setViewBox({ x:0, y:0, w:W, h:H });
  drawAll(); dumpJSON(); updateBrushPanel();
  // piece analyzer wiring
  const vp=document.getElementById('viewPiece');
  const cp=document.getElementById('copyPiece');
  if(vp){ vp.addEventListener('change', updatePieceView); }
  if(cp){ cp.addEventListener('click', async ()=>{
    const txt = (document.getElementById('piece')||{}).value || '';
    try{ await navigator.clipboard.writeText(txt); }catch{
      const ta=document.createElement('textarea'); ta.value=txt; ta.style.position='fixed'; ta.style.opacity='0';
      document.body.appendChild(ta); ta.select(); try{ document.execCommand('copy'); } finally{ document.body.removeChild(ta); }
    }
  });}
  window.addEventListener('json:updated', updatePieceView);
  updatePieceView();
}