import { W, H, svg, dLayer, rLayer, pLayer, hLayer, wLayer, tip, out, $ } from './constants.js';
import { MODEL, state, loadData } from './model.js';
import { pct, clamp, screenToPct, mk, download, autosave, clear } from './utils.js';

import { initUI } from './ui.js';
import { drawAll } from './render.js';

export async function init(){
  initUI();
  await loadData();
  drawAll();
  // Notify UI components that data is ready
  window.dispatchEvent(new CustomEvent('json:updated'));
}

