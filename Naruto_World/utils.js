import { W, H, svg } from './constants.js';
import { state } from './model.js';

export const pct = n => `${n}%`;
export const clamp=(v,min,max)=>v<min?min:v>max?max:v;

export function screenToPct(clientX, clientY) {
  const pt = svg.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  const p = pt.matrixTransform(svg.getScreenCTM().inverse());
  let x = (p.x / W) * 100;
  let y = (p.y / H) * 100;
  return [clamp(x, 0, 100), clamp(y, 0, 100)];
}

export function mk(tag, attrs={}, children=[]){
  const el=document.createElementNS('http://www.w3.org/2000/svg',tag);
  for(const k in attrs) el.setAttribute(k,attrs[k]);
  for(const c of children) el.append(c instanceof Node?c:document.createTextNode(c));
  return el;
}

export function download(name, text, type='application/json'){
  const blob=new Blob([text],{type}); const url=URL.createObjectURL(blob);
  const a=document.createElement('a'); a.href=url; a.download=name; a.click(); URL.revokeObjectURL(url);
}

export function autosave(MODEL){
  if(document.getElementById('autosave').checked){
    localStorage.setItem('konoha-map-v3', JSON.stringify(MODEL));
  }
}

export function clear(el){
  while(el && el.firstChild) el.removeChild(el.firstChild);
}

export function preloadImages(urls) {
  if (!Array.isArray(urls)) return;
  urls.forEach(url => {
    const img = new Image();
    img.src = url;
  });
}

export function pointInPolygon(point, vs) {
  var x = point[0], y = point[1];
  var inside = false;
  for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    var xi = vs[i][0], yi = vs[i][1];
    var xj = vs[j][0], yj = vs[j][1];
    var intersect = ((yi > y) != (yj > y))
      && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}