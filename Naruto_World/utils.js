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
    localStorage.setItem('konoha-map', JSON.stringify(MODEL));
  }
}

export function clear(el){
  while(el && el.firstChild) el.removeChild(el.firstChild);
}

export function parseViewBox(){
  const vb=(svg.getAttribute('viewBox')||'').trim().split(/\s+/).map(Number);
  return (vb.length===4 && vb.every(n=>!Number.isNaN(n))) ? { x:vb[0], y:vb[1], w:vb[2], h:vb[3] } : { x:0, y:0, w:W, h:H };
}

export function setViewBox(vb){
  svg.setAttribute('viewBox', `${vb.x} ${vb.y} ${vb.w} ${vb.h}`);
}