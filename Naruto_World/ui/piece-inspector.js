import { MODEL } from '../model.js';

export function initPieceInspector() {
  const vp = document.getElementById('viewPiece');
  const cp = document.getElementById('copyPiece');
  if (vp) vp.addEventListener('change', updatePieceView);
  if (cp) {
    cp.addEventListener('click', async () => {
      const txt = (document.getElementById('piece') || {}).value || '';
      try { await navigator.clipboard.writeText(txt); } catch {
        const ta = document.createElement('textarea'); ta.value = txt; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } finally { document.body.removeChild(ta); }
      }
    });
  }
  window.addEventListener('json:updated', updatePieceView);
  updatePieceView();
}

export function updatePieceView() {
  const sel = document.getElementById('viewPiece');
  const ta = document.getElementById('piece');
  if (!sel || !ta) return;
  const key = sel.value;
  const src = key === 'lands' ? MODEL.lands
    : key === 'roads' ? MODEL.roads
    : key === 'poi' ? MODEL.poi
    : key === 'rivers' ? MODEL.rivers
    : key === 'forest' ? MODEL.forest
    : key === 'mountains' ? MODEL.mountains
    : key === 'units' ? MODEL.units
    : {};
  ta.value = JSON.stringify(src ?? {}, null, 2);
}
