import { W, H, svg, dLayer, rLayer, pLayer, hLayer, wLayer, tip, out, $ } from './constants.js';
import { MODEL, state } from './model.js';
import { pct, clamp, screenToPct, mk, download, autosave, clear } from './utils.js';

import { initUI } from './ui.js';

export function init(){
  initUI();
  try{
    if(!localStorage.getItem('konoha-unified-rivers')){
      const pts = (MODEL.rivers||[]).flatMap(r=>r.points||[]);
      const out=[]; let last=null;
      for(const p of pts){ if(!last || Math.hypot(p[0]-last[0],p[1]-last[1])>1){ out.push(p); last=p; } }
      if(out.length){ MODEL.rivers=[{id:'river-main',points:out,width:7}]; localStorage.setItem('konoha-unified-rivers','1'); }
    }
  }catch{}
}