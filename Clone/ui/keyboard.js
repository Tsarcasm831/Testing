import { state } from '../model.js';
import { finishDrawing, cancelDrawing } from '../interactions.js';

export function initKeyboardShortcuts() {
  window.addEventListener('keydown', e => {
    const t = e.target, tag = (t?.tagName || '').toUpperCase();
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag) || t?.isContentEditable) return;
    if (e.key === 'Escape') {
      cancelDrawing();
      if (state.addingPOI) { state.addingPOI = false; state._pendingPOI = null; document.getElementById('poiModal').hidden = true; }
      document.getElementById('miniLandModal').hidden = true;
    }
    if (e.key === 'Enter' && state.drawing) { e.preventDefault(); finishDrawing(); }
    if (e.key.toLowerCase() === 'e') { document.getElementById('edit').click(); }
    if (e.key.toLowerCase() === 'h') {
      document.querySelector('#wrap').style.gridTemplateColumns =
        getComputedStyle(document.querySelector('#wrap')).gridTemplateColumns === '1fr 348px' ? '1fr' : '1fr 348px';
    }
  });
}
