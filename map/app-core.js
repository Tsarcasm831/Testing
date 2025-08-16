import { W, H, svg, dLayer, rLayer, pLayer, hLayer, wLayer, tip, out, $ } from './constants.js';
import { MODEL, state } from './model.js';
import { pct, clamp, screenToPct, mk, download, autosave, clear } from './utils.js';

import { initUI } from './ui.js';

export function init(){
  initUI();
  // keep default rivers intact; remove prior unification/deletion logic
  /* removed river migration and deletion to honor provided defaults */
}