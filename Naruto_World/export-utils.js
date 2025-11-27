import { W, H } from './constants.js';
import { MODEL } from './model.js';
import { out } from './constants.js';

let pendingJson = null;
let pendingWasIdle = false;

function writeJSON(){
  // split export into separate sections + terrain grouping
  const data = {
    meta: {
      counts: {
        lands: Object.keys(MODEL.lands||{}).length,
        roads: (MODEL.roads||[]).length,
        bridges: (MODEL.roads||[]).filter(r => r.type === 'bridge').length,
        poi: (MODEL.poi||[]).length,
        rivers: 0,
        forest: (MODEL.forest||[]).length,
        mountains: (MODEL.mountains||[]).length
      }
    },
    lands: MODEL.lands || {},
    roads: MODEL.roads || [],
    poi: MODEL.poi || [],
    rivers: [],
    terrain: {
      forest: MODEL.forest || [],
      mountains: MODEL.mountains || []
    }
  };
  out.value = JSON.stringify(data,null,2);
  window.dispatchEvent(new CustomEvent('json:updated'));
}

export function dumpJSON(){
  // Cancel any deferred write and flush immediately
  if (pendingJson){
    if (pendingWasIdle && 'cancelIdleCallback' in window) window.cancelIdleCallback(pendingJson);
    else cancelAnimationFrame(pendingJson);
    pendingJson = null;
  }
  writeJSON();
}

export function scheduleDumpJSON(){
  if (pendingJson) return;
  const cb = () => { pendingJson = null; writeJSON(); };
  if ('requestIdleCallback' in window){
    pendingWasIdle = true;
    pendingJson = window.requestIdleCallback(cb, { timeout: 120 });
  } else {
    pendingWasIdle = false;
    pendingJson = requestAnimationFrame(cb);
  }
}

export function buildExportSVG(){
  const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const dPolys = Object.values(MODEL.lands).map(d=>{
    const pts=d.points.map(([x,y])=>[x*W/100,y*H/100].join(',')).join(' ');
    const col = d.color || '#22d3ee';
    return `<polygon points="${pts}" fill="${col}" fill-opacity="0.33" stroke="${col}" stroke-width="2"/>`;
  }).join('\n');
  const dRoads = MODEL.roads.map(r=>{
    const pts=r.points.map(([x,y])=>[x*W/100,y*H/100].join(',')).join(' ');
    const col = r.type==='avenue'?'#f8fafc':(r.type==='canal'?'#38bdf8':'#cbd5e1');
    return `<polyline points="${pts}" fill="none" stroke="${col}" stroke-width="${Math.max(4, r.width||4)}" stroke-linecap="round" stroke-linejoin="round"/>`;
  }).join('\n');
  const dPins = MODEL.poi.map(p=>{
    const r = 8.8; // uniform px radius for all POIs in exported SVG
    const cx=p.x*W/100, cy=p.y*H/100;
    const fill = p.type==='gate'?'#ef4444':(p.type==='park'?'#22c55e':(p.type==='letter'?'#a78bfa':(p.type==='city'?'#4f46e5':'#f59e0b')));
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="#000" stroke-width="1.1"><title>${esc(p.name||p.id||'')}</title></circle>`;
  }).join('\n');
  const dForest = (MODEL.forest||[]).map(f=>{
    const pts=f.points.map(([x,y])=>[x*W/100,y*H/100].join(',')).join(' ');
    return `<polygon points="${pts}" fill="#166534" fill-opacity="0.75" stroke="#064e3b" stroke-width="1.5" />`;
  }).join('\n');
  const dMountains = (MODEL.mountains||[]).map(m=>{
    const pts=m.points.map(([x,y])=>[x*W/100,y*H/100].join(',')).join(' ');
    return m.shape==='triangle'
      ? `<polygon points="${pts}" fill="#78350f" fill-opacity=".85" stroke="#3f1d0b" stroke-width="1.5"/>`
      : `<polyline points="${pts}" fill="none" stroke="#78350f" stroke-opacity=".8" stroke-width="${m.width||10}" stroke-linecap="round" stroke-linejoin="round"/>`;
  }).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
${dForest}
${dMountains}
${dRoads}
${dPolys}
${dPins}
</svg>`;
}

export function buildDefaultModelJS(){
  const obj = {
    lands: MODEL.lands || {},
    roads: MODEL.roads || [],
    poi: MODEL.poi || [],
    rivers: [],
    forest: MODEL.forest || [],
    mountains: MODEL.mountains || []
  };
  return `export const DEFAULT_MODEL = ${JSON.stringify(obj, null, 2)};\n`;
}
