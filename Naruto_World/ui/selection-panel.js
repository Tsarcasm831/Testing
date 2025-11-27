import { MODEL, state } from '../model.js';
import { drawAll } from '../render.js';
import { select } from '../interactions.js';
import { dumpJSON } from '../export-utils.js';
import { autosave } from '../utils.js';

export function initSelectionPanel() {
  document.getElementById('apply').addEventListener('click', () => {
    if (!state.selected) return;
    const sel = state.selected;
    if (sel.kind === 'land' && state.locks?.landsLocked) { alert('Lands are locked.'); return; }
    if (sel.kind === 'poi' && state.locks?.poiLocked) { alert('POIs are locked.'); return; }
    if (sel.kind === 'land') {
      const d = MODEL.lands[sel.key];
      const newId = document.getElementById('sId').value.trim() || sel.key;
      if (newId !== sel.key) {
        MODEL.lands[newId] = { ...d };
        delete MODEL.lands[sel.key];
        sel.key = newId;
      }
      const land = MODEL.lands[sel.key];
      land.id = newId;
      land.name = document.getElementById('sName').value;
      land.desc = document.getElementById('sDesc').value;
      land.color = document.getElementById('sColor').value;
      select('land', newId);
    } else if (sel.kind === 'road') {
      const r = MODEL.roads[sel.key];
      r.id = document.getElementById('sId').value; r.name = document.getElementById('sName').value; r.desc = document.getElementById('sDesc').value;
      r.type = document.getElementById('sRoadType').value; r.width = parseInt(document.getElementById('sRoadW').value, 10) || 3;
    } else {
      const p = MODEL.poi[sel.key];
      p.id = document.getElementById('sId').value; p.name = document.getElementById('sName').value; p.desc = document.getElementById('sDesc').value;
    }
    drawAll(); dumpJSON(); autosave(MODEL);
  });

  document.getElementById('delete').addEventListener('click', () => {
    if (!state.selected) return;
    const s = state.selected;
    if ((s.kind === 'land' && state.locks?.landsLocked) || (s.kind === 'poi' && state.locks?.poiLocked)) {
      alert('This item type is locked.'); return;
    }
    if (s.kind === 'land') delete MODEL.lands[s.key];
    if (s.kind === 'road') MODEL.roads.splice(s.key, 1);
    if (s.kind === 'poi') MODEL.poi.splice(s.key, 1);
    state.selected = null; drawAll(); dumpJSON(); autosave(MODEL);
  });
}
