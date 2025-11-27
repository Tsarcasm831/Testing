import { MODEL, state } from '../model.js';
import { select } from '../interactions.js';
import { dumpJSON } from '../export-utils.js';
import { autosave } from '../utils.js';

export function initPoiControls() {
  document.getElementById('addPoiBtn').addEventListener('click', () => {
    if (state.locks?.poiLocked) { alert('POIs are locked. Unlocking is disabled in this build.'); return; }
    state.addingPOI = true;
  });
  document.getElementById('poiCancel').addEventListener('click', () => {
    state.addingPOI = false;
    state._pendingPOI = null;
    document.getElementById('poiModal').hidden = true;
  });

  document.getElementById('poiCreate').addEventListener('click', () => {
    if (state.locks?.poiLocked) { alert('POIs are locked.'); return; }
    const pos = state._pendingPOI; if (!state.addingPOI || !pos) return;
    const type = document.getElementById('poiType').value;
    const inId = (document.getElementById('poiId').value || '').trim();
    const name = (document.getElementById('poiName').value || '').trim();
    const desc = (document.getElementById('poiDesc').value || '').trim();
    const idx = (MODEL.poi?.length || 0) + 1;
    const autoId = (type === 'gate' ? `gate-${idx}` : type === 'park' ? `C${idx}` : type === 'letter' ? String.fromCharCode(64 + ((idx % 26) || 26)) : `poi-${idx}`);
    if (!Array.isArray(MODEL.poi)) MODEL.poi = [];
    MODEL.poi.push({ id: inId || autoId, name, type, x: pos.x, y: pos.y, desc });
    state.addingPOI = false; state._pendingPOI = null; document.getElementById('poiModal').hidden = true;
    select('poi', MODEL.poi.length - 1); dumpJSON(); autosave(MODEL);
  });
}
