import { W, H, svg, dLayer, rLayer, pLayer, hLayer, tip, out, $, LAND_ICONS } from './constants.js';
import { MODEL, state, loadData } from './model.js';
import { pct, clamp, screenToPct, mk, download, autosave, clear, preloadImages } from './utils.js';

import { initUI } from './ui.js';
import { drawAll } from './render.js';
import { dumpJSON } from './export-utils.js';
import { updateBrushPanel } from './ui/brush-controls.js';
import { updatePieceView } from './ui/piece-inspector.js';
import { initUnits } from './units.js';

export async function init(){
  initUI();
  await loadData();
  initUnits();

  // Preload assets to prevent flickering
  const assets = new Set(['Map of Naruto2.jpg']);
  ['A','B','C','D','E'].forEach(c => assets.add(`assets/icons/${c}.png`));
  for(let i=1; i<=12; i++) assets.add(`assets/icons/${i}.png`);
  Object.values(LAND_ICONS).forEach(u => assets.add(u));
  MODEL.poi?.forEach(p => p.image && assets.add(p.image));
  Object.values(MODEL.lands || {}).forEach(land => {
    land.ninjaRisks?.forEach(n => n.image && assets.add(n.image));
  });
  preloadImages(Array.from(assets));

  drawAll();
  dumpJSON();
  updateBrushPanel();
  updatePieceView();
  // Notify UI components that data is ready
  window.dispatchEvent(new CustomEvent('json:updated'));
}
