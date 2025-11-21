import { MODEL, state } from '../model.js';
import { drawAll } from '../render.js';
import { dumpJSON } from '../export-utils.js';
import { autosave } from '../utils.js';

export function initModeAndVisibilityControls(onModeChange) {
  document.querySelectorAll('input[name="mode"]').forEach(r => r.addEventListener('change', e => {
    state.mode = e.target.value;
    state.drawing = null;
    document.body.dataset.mode = state.mode;
    drawAll();
    onModeChange?.();
  }));
  document.getElementById('edit').addEventListener('change', e => { state.edit = e.target.checked; drawAll(); });
  document.getElementById('snap').addEventListener('change', e => { state.snap = e.target.checked; });
  document.getElementById('hideBackground')?.addEventListener('change', e => {
    const bgImg = document.getElementById('backgroundImage');
    if (bgImg) bgImg.style.display = e.target.checked ? 'none' : '';
  });
  const onToggle = id => { const el = document.getElementById(id); if (el) el.addEventListener('change', drawAll); };
  ['toggleLands', 'toggleRoads', 'toggleWalls', 'togglePOI', 'toggleRivers', 'toggleGrass', 'toggleForest', 'toggleMountains'].forEach(onToggle);
}

export function initMobileMenuToggle() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  if (!menuBtn) return;
  menuBtn.addEventListener('click', () => {
    document.getElementById('side').classList.toggle('open');
  });
}

export function initLandColorControl() {
  const sColor = document.getElementById('sColor');
  if (!sColor) return;
  sColor.addEventListener('input', e => {
    if (state.selected && state.selected.kind === 'land') {
      const land = MODEL.lands[state.selected.key];
      if (land) {
        land.color = e.target.value;
        drawAll();
      }
    }
  });
  sColor.addEventListener('change', () => {
    dumpJSON(); autosave(MODEL);
  });
}
