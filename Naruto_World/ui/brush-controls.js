import { state } from '../model.js';

// Show or hide brush controls based on the active drawing mode.
export function updateBrushPanel() {
  const panel = document.getElementById('brushPanel');
  if (!panel) return;
  const rows = panel.querySelectorAll('[data-for]');
  let visible = false;
  rows.forEach(row => {
    const show = row.getAttribute('data-for') === state.mode;
    row.hidden = !show;
    if (show) visible = true;
  });
  panel.hidden = !visible;
}

export function initBrushControls() {
  const $r = t => document.getElementById(t);
  $r('brRoadType').addEventListener('change', e => state.brush.road.type = e.target.value);
  $r('brRoadW').addEventListener('change', e => state.brush.road.width = parseInt(e.target.value, 10) || 3);
  $r('brRiverW').addEventListener('change', e => state.brush.river.width = parseInt(e.target.value, 10) || 7);
  $r('brForestW').addEventListener('change', e => state.brush.forest.width = parseInt(e.target.value, 10) || 40);
  $r('brMountainShape').addEventListener('change', e => {
    state.brush.mountain.shape = e.target.value;
    $r('brMountainWWrap').hidden = e.target.value === 'triangle';
    $r('brMountainTriWrap').hidden = e.target.value !== 'triangle';
  });
  $r('brMountainW').addEventListener('change', e => state.brush.mountain.width = parseInt(e.target.value, 10) || 10);
  $r('brMountainTri').addEventListener('change', e => state.brush.mountain.triSize = parseInt(e.target.value, 10) || 8);
}
