import { MODEL, state } from '../model.js';
import { drawAll } from '../render.js';
import { dumpJSON, buildExportSVG, buildDefaultModelJS } from '../export-utils.js';
import { download, autosave } from '../utils.js';

export function initImportExportControls() {
  document.getElementById('copyJson').addEventListener('click', async () => {
    const txt = document.getElementById('json').value;
    try {
      if (document.hasFocus() && window.isSecureContext && navigator.clipboard) {
        await navigator.clipboard.writeText(txt);
      } else { throw new Error('fallback'); }
    } catch {
      const ta = document.createElement('textarea');
      ta.value = txt; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } finally { document.body.removeChild(ta); }
    }
  });
  document.getElementById('downloadJson').addEventListener('click', () => download('konoha-map.json', document.getElementById('json').value));
  document.getElementById('exportSvg').addEventListener('click', () => {
    const svgStr = buildExportSVG();
    download('konoha-overlay.svg', svgStr, 'image/svg+xml');
  });
  const btnJs = document.getElementById('downloadJsModel');
  if (btnJs) {
    btnJs.addEventListener('click', () => {
      const js = buildDefaultModelJS();
      download('full-default-model.js', js, 'application/javascript');
    });
  }
  const btnSaveDef = document.getElementById('saveAsDefault');
  if (btnSaveDef) {
    btnSaveDef.addEventListener('click', () => {
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
      try {
        localStorage.setItem('konoha-default-model-v2', JSON.stringify(obj));
        alert('Saved current map as the default. Reload to use it.');
      } catch (e) {
        alert('Failed to save default (storage full or blocked).');
      }
    });
  }
  document.getElementById('importFile').addEventListener('change', async e => {
    const file = e.target.files[0]; if (!file) return;
    const text = await file.text();
    try {
      const data = JSON.parse(text);
      const lands = data.lands ?? data.districts ?? MODEL.lands;
      const roads = data.roads ?? [];
      const poi = data.poi ?? MODEL.poi;
      const walls = data.walls ?? [];
      const rivers = data.rivers ?? data.river ?? [];
      const terrain = data.terrain || {};
      const grass = terrain.grass ?? data.grass ?? MODEL.grass ?? [];
      const forest = terrain.forest ?? data.forest ?? MODEL.forest ?? [];
      const mountains = terrain.mountains ?? data.mountains ?? MODEL.mountains ?? [];

      if (!state.locks?.landsLocked) MODEL.lands = lands;
      MODEL.roads = roads;
      if (!state.locks?.poiLocked) MODEL.poi = poi;
      MODEL.walls = walls;
      MODEL.rivers = rivers;
      MODEL.grass = grass;
      MODEL.forest = forest;
      MODEL.mountains = mountains;

      drawAll(); dumpJSON(); autosave(MODEL);
    } catch (err) { alert('Invalid JSON'); }
  });
  document.getElementById('loadAutosave').addEventListener('click', () => {
    const txt = localStorage.getItem('konoha-map-v2'); if (!txt) { alert('No autosave found'); return; }
    try {
      const data = JSON.parse(txt);
      if (!state.locks?.landsLocked) MODEL.lands = data.lands || data.districts || MODEL.lands;
      MODEL.roads = data.roads || [];
      if (!state.locks?.poiLocked) MODEL.poi = data.poi || MODEL.poi;
      MODEL.walls = data.walls || [];
      drawAll(); dumpJSON();
    } catch { alert('Autosave corrupt'); }
  });
  document.getElementById('loadDefaultLands').addEventListener('click', async () => {
    if (state.locks?.landsLocked) { alert('Lands are locked.'); return; }
    if (!confirm('Load default lands and terrain? This will replace current lands and terrain.')) return;
    const { DEFAULT_MODEL } = await import('../user-defaults.js');
    MODEL.lands = DEFAULT_MODEL.lands || {};
    MODEL.mountains = DEFAULT_MODEL.mountains || [];
    MODEL.forest = DEFAULT_MODEL.forest || [];
    MODEL.grass = DEFAULT_MODEL.grass || [];
    drawAll(); dumpJSON(); autosave(MODEL);
  });
  document.getElementById('loadDefaultPOI').addEventListener('click', async () => {
    if (state.locks?.poiLocked) { alert('POIs are locked.'); return; }
    if (!confirm('Append default POI to current POI?')) return;
    const { DEFAULT_MODEL } = await import('../user-defaults.js');
    const defaultPOI = DEFAULT_MODEL.poi || [];
    if (!Array.isArray(MODEL.poi)) MODEL.poi = [];
    MODEL.poi.push(...defaultPOI);
    drawAll(); dumpJSON(); autosave(MODEL);
  });
  document.getElementById('clearAll').addEventListener('click', () => {
    if (!confirm('Clear roads and overlays? Lands/POIs are locked and will be preserved.')) return;
    MODEL.roads = [];
    if (!state.locks?.landsLocked) MODEL.lands = {};
    MODEL.walls = [];
    MODEL.mountains = [];
    MODEL.forest = [];
    MODEL.grass = [];
    drawAll(); dumpJSON(); autosave(MODEL);
  });
}
