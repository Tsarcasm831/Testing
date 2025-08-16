import { svg, $ } from './constants.js';
import { MODEL, state } from './model.js';
import { download, autosave } from './utils.js';
import { drawAll } from './render.js';
import { dumpJSON, buildExportSVG } from './export-utils.js';
import { canvasDown, finishDrawing, cancelDrawing, select } from './interactions.js';

// @tweakable keyboard shortcut to open the Load JSON modal (DOM KeyboardEvent.code)
const LOAD_JSON_HOTKEY_CODE = 'Backquote';
// @tweakable when true, completely replace MODEL fields with loaded data; when false, shallow-merge
const LOAD_JSON_REPLACE = true;
/* @tweakable additional keyboard identifiers to trigger Load JSON (matches KeyboardEvent.key) */
const LOAD_JSON_ALT_KEYS = ['`', '～', '°'];
/* @tweakable allow the hotkey to work even when a text input or textarea is focused */
const LOAD_JSON_HOTKEY_IN_INPUTS = true;
/* @tweakable when true, the hotkey toggles the modal instead of only opening it */
const LOAD_JSON_TOGGLE_MODAL = true;

function wireUI(){
  document.querySelectorAll('input[name="mode"]').forEach(r=>r.addEventListener('change',e=>{
    state.mode=e.target.value; state.drawing=null; document.body.dataset.mode=state.mode; drawAll();
  }));
  document.getElementById('edit').addEventListener('change',e=>{ state.edit=e.target.checked; drawAll(); });
  document.getElementById('snap').addEventListener('change',e=>{ state.snap=e.target.checked; });
  document.getElementById('toggleDistricts').addEventListener('change',drawAll);
  document.getElementById('toggleRoads').addEventListener('change',drawAll);
  document.getElementById('toggleWalls').addEventListener('change',drawAll);
  document.getElementById('togglePOI').addEventListener('change',drawAll);
  document.getElementById('toggleRivers').addEventListener('change',drawAll);
  document.getElementById('toggleGrass').addEventListener('change',drawAll);
  document.getElementById('toggleForest').addEventListener('change',drawAll);
  document.getElementById('toggleMountains').addEventListener('change',drawAll);

  // POI modal wiring
  document.getElementById('addPoiBtn').addEventListener('click', ()=>{
    state.addingPOI=true;
    document.getElementById('poiModal').hidden=false;
  });
  document.getElementById('poiCancel').addEventListener('click', ()=>{
    state.addingPOI=false;
    document.getElementById('poiModal').hidden=true;
  });

  // Load JSON modal wiring
  const jsonLoadModal = document.getElementById('jsonLoadModal');
  const jsonLoadInput = document.getElementById('jsonLoadInput');
  document.getElementById('jsonLoadCancel').addEventListener('click', () => { jsonLoadModal.hidden = true; });
  document.getElementById('jsonLoadApply').addEventListener('click', () => {
    try{
      const data = JSON.parse(jsonLoadInput.value || '{}');
      if (LOAD_JSON_REPLACE) {
        MODEL.districts = data.districts || {};
        MODEL.roads     = data.roads     || [];
        MODEL.poi       = data.poi       || [];
        MODEL.walls     = data.walls     || [];
        MODEL.rivers    = data.rivers    || [];
        MODEL.grass     = data.grass     || [];
        MODEL.forest    = data.forest    || [];
        MODEL.mountains = data.mountains || [];
      } else {
        MODEL.districts = { ...(MODEL.districts||{}), ...(data.districts||{}) };
        MODEL.roads     = Array.isArray(data.roads) ? data.roads : (MODEL.roads||[]);
        MODEL.poi       = Array.isArray(data.poi) ? data.poi : (MODEL.poi||[]);
        MODEL.walls     = Array.isArray(data.walls) ? data.walls : (MODEL.walls||[]);
        MODEL.rivers    = Array.isArray(data.rivers) ? data.rivers : (MODEL.rivers||[]);
        MODEL.grass     = Array.isArray(data.grass) ? data.grass : (MODEL.grass||[]);
        MODEL.forest    = Array.isArray(data.forest) ? data.forest : (MODEL.forest||[]);
        MODEL.mountains = Array.isArray(data.mountains) ? data.mountains : (MODEL.mountains||[]);
      }
      drawAll(); dumpJSON(); autosave(MODEL);
      jsonLoadModal.hidden = true;
    }catch(err){
      alert('Invalid JSON');
    }
  });

  svg.addEventListener('dblclick',finishDrawing);
  svg.addEventListener('mousedown',canvasDown);
  window.addEventListener('keydown',e=>{
    const t=e.target, tag=(t?.tagName||'').toUpperCase();
    const isEditable = ['INPUT','TEXTAREA','SELECT'].includes(tag) || t?.isContentEditable;
    const wantsHotkey = (e.code === LOAD_JSON_HOTKEY_CODE) || LOAD_JSON_ALT_KEYS.includes(e.key);
    if (wantsHotkey) {
      if (!LOAD_JSON_HOTKEY_IN_INPUTS && isEditable) return;
      e.preventDefault();
      const modal = document.getElementById('jsonLoadModal');
      const input = document.getElementById('jsonLoadInput');
      if (LOAD_JSON_TOGGLE_MODAL) {
        modal.hidden = !modal.hidden;
      } else {
        modal.hidden = false;
      }
      if (!modal.hidden) setTimeout(() => input.focus(), 0);
      return;
    }
    if(isEditable) return;
    if(e.key==='Escape') cancelDrawing();
    if(e.key==='Enter' && state.drawing){ e.preventDefault(); finishDrawing(); }
    if(e.key.toLowerCase()==='e'){ document.getElementById('edit').click(); }
    if(e.key.toLowerCase()==='h'){ document.querySelector('#wrap').style.gridTemplateColumns=
      getComputedStyle(document.querySelector('#wrap')).gridTemplateColumns==='1fr 348px'?'1fr':'1fr 348px'; }
  });

  document.getElementById('apply').addEventListener('click',()=>{
    if(!state.selected) return;
    const sel=state.selected;
    if(sel.kind==='district'){
      const d=MODEL.districts[sel.key];
      delete MODEL.districts[sel.key];
      const newId=document.getElementById('sId').value.trim()||sel.key;
      MODEL.districts[newId]={...d,id:newId,name:document.getElementById('sName').value,desc:document.getElementById('sDesc').value};
      select('district',newId);
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
    if(!confirm('Delete selected '+s.kind+'?')) return;
    if(s.kind==='district') delete MODEL.districts[s.key];
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
  document.getElementById('importFile').addEventListener('change',async (e)=>{
    const file=e.target.files[0]; if(!file) return;
    const text=await file.text();
    try{
      const data=JSON.parse(text);
      MODEL.districts=data.districts || {};
      MODEL.roads = data.roads || [];
      MODEL.poi   = data.poi   || MODEL.poi;
      MODEL.walls = data.walls || [];
      drawAll(); dumpJSON(); autosave(MODEL);
    }catch(err){ alert('Invalid JSON'); }
  });
  document.getElementById('loadAutosave').addEventListener('click',()=>{
    const txt=localStorage.getItem('konoha-map'); if(!txt){ alert('No autosave found'); return; }
    try{ const data=JSON.parse(txt); MODEL.districts=data.districts||{}; MODEL.roads=data.roads||[]; MODEL.poi=data.poi||MODEL.poi; MODEL.walls=data.walls||[]; drawAll(); dumpJSON(); }
    catch{ alert('Autosave corrupt'); }
  });
  document.getElementById('clearAll').addEventListener('click',()=>{
    if(!confirm('Clear all districts & roads?')) return;
    MODEL.roads=[]; MODEL.districts={}; MODEL.walls=[]; drawAll(); dumpJSON(); autosave(MODEL);
  });
}

function migrateDefaults(){
  try{
    // supersede previous migration to avoid renaming/injecting roads
    if(localStorage.getItem('konoha-migrated-v4')) return;
    if(!Array.isArray(MODEL.walls) || MODEL.walls.length===0){
      MODEL.walls=[{id:'wall-1',name:'',desc:'',cx:52.85,cy:52,r:35.4649601719782,width:8}];
    }
    localStorage.setItem('konoha-migrated-v4','1');
  }catch{}
}

export function initUI(){
  wireUI();
  migrateDefaults();
  document.body.dataset.mode=state.mode;
  drawAll(); dumpJSON();
}