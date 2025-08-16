import { W, H, svg, dLayer, rLayer, pLayer, hLayer, wLayer, tip } from './constants.js';
import { MODEL, state } from './model.js';
import { pct, mk, clear } from './utils.js';
import { select, startDragVertex, startDragWhole, startDragPOI } from './interactions.js';

function isSelected(kind,key){ return state.selected && state.selected.kind===kind && state.selected.key===key; }

export function drawAll(){
  drawGrass(); drawForest(); drawMountains();
  drawRoads(); drawRivers(); drawDistricts(); drawWalls(); drawPOI(); drawHandles(); updateForm();
}

function drawDistricts(){
  clear(dLayer);
  if(!document.getElementById('toggleDistricts').checked) return;
  for(const k in MODEL.districts){
    const d=MODEL.districts[k];
    const pts=d.points.map(([x,y])=>[x*W/100,y*H/100].join(',')).join(' ');
    const poly=mk('polygon',{class:'district '+(isSelected('district',k)?'selected':''),'data-id':k,points:pts});
    poly.addEventListener('mouseenter',e=>showTip(e,{name:d.name,desc:d.desc}));
    poly.addEventListener('mousemove',moveTip);
    poly.addEventListener('mouseleave',hideTip);
    poly.addEventListener('mousedown',e=>{
      e.stopPropagation();
      if(state.mode==='select'){ select('district',k); if(e.altKey){ startDragWhole(e,'district',k);} }
    });
    dLayer.append(poly);
  }
}

function drawRoads(){
  clear(rLayer);
  if(!document.getElementById('toggleRoads').checked) return;
  for(let i=0;i<MODEL.roads.length;i++){
    const r=MODEL.roads[i];
    const d=r.points.map(p=>[p[0]*W/100,p[1]*H/100].join(',')).join(' ');
    const pl=mk('polyline',{class:`road ${r.type} ${isSelected('road',i)?'selected':''}`,'data-i':i,points:d,strokeWidth:r.width ?? 3});
    pl.addEventListener('mouseenter',e=>showTip(e,{name:r.name||r.id||'road',desc:r.type+` (${r.width||3}px)`}));
    pl.addEventListener('mousemove',moveTip);
    pl.addEventListener('mouseleave',hideTip);
    pl.addEventListener('mousedown',e=>{
      e.stopPropagation();
      if(state.mode==='select'){ select('road',i); if(e.altKey){ startDragWhole(e,'road',i);} }
    });
    rLayer.append(pl);
  }
}

function drawRivers(){
  const layer = document.getElementById('riverLayer');
  clear(layer);
  if(!document.getElementById('toggleRivers').checked || !Array.isArray(MODEL.rivers)) return;
  for(let i=0;i<MODEL.rivers.length;i++){
    const rv=MODEL.rivers[i];
    const d=rv.points.map(p=>[p[0]*W/100,p[1]*H/100].join(',')).join(' ');
    const pl=mk('polyline',{class:'river',points:d,strokeWidth:rv.width||7});
    layer.append(pl);
  }
}

function drawGrass(){
  const layer = document.getElementById('grassLayer');
  clear(layer);
  if(!document.getElementById('toggleGrass').checked || !Array.isArray(MODEL.grass)) return;
  for(const g of MODEL.grass){
    const d=g.points.map(p=>[p[0]*W/100,p[1]*H/100].join(',')).join(' ');
    layer.append(mk('polyline',{class:'grass',points:d,strokeWidth:g.width||22}));
  }
}

function drawForest(){
  const layer = document.getElementById('forestLayer');
  clear(layer);
  if(!document.getElementById('toggleForest').checked || !Array.isArray(MODEL.forest)) return;
  for(const f of MODEL.forest){
    const d=f.points.map(p=>[p[0]*W/100,p[1]*H/100].join(',')).join(' ');
    layer.append(mk('polyline',{class:'forest',points:d,strokeWidth:f.width||10}));
  }
}

function drawMountains(){
  const layer = document.getElementById('mountainLayer');
  clear(layer);
  if(!document.getElementById('toggleMountains').checked || !Array.isArray(MODEL.mountains)) return;
  for(const m of MODEL.mountains){
    const d=m.points.map(p=>[p[0]*W/100,p[1]*H/100].join(',')).join(' ');
    layer.append(mk('polyline',{class:'mountain',points:d,strokeWidth:m.width||10}));
  }
}

function drawWalls(){
  clear(wLayer);
  if(!document.getElementById('toggleWalls').checked || !Array.isArray(MODEL.walls)) return;
  for(let i=0;i<MODEL.walls.length;i++){
    const w=MODEL.walls[i], c=mk('circle',{class:`wall ${isSelected('wall',i)?'selected':''}`,'data-i':i,
      cx:w.cx*W/100, cy:w.cy*H/100, r:w.r*W/100, strokeWidth:w.width||8});
    c.addEventListener('mouseenter',e=>showTip(e,{name:w.name||w.id||'Wall',desc:w.desc||''}));
    c.addEventListener('mousemove',moveTip); c.addEventListener('mouseleave',hideTip);
    c.addEventListener('mousedown',e=>{ e.stopPropagation(); if(state.mode==='select'){ select('wall',i); if(e.altKey){ startDragWhole(e,'wall',i);} }});
    wLayer.append(c);
  }
}

function drawPOI(){
  clear(pLayer);
  if(!document.getElementById('togglePOI').checked) return;
  for(let i=0;i<MODEL.poi.length;i++){
    const p=MODEL.poi[i];
    const g=mk('g',{'data-i':i});
    const r = 0.88; // uniform size for all POIs
    const c=mk('circle',{class:`pin ${p.type}`,cx:pct(p.x),cy:pct(p.y),r:pct(r)});
    const t=mk('text',{class:'lbl',x:pct(p.x),y:`calc(${pct(p.y)} + .35%)`}, p.type==='letter'?p.id:(p.type==='park'?(p.id.startsWith('C')?'C':'D'):(p.type==='gate'?'G':'●')));
    g.append(c,t);
    g.addEventListener('mouseenter',e=>showTip(e,p));
    g.addEventListener('mousemove',moveTip);
    g.addEventListener('mouseleave',hideTip);
    g.addEventListener('mousedown',e=>{
      e.stopPropagation();
      if(state.mode==='select'){ select('poi',i); startDragPOI(e,i); }
    });
    if(isSelected('poi',i)) g.classList.add('selected');
    pLayer.append(g);
  }
}

function drawHandles(){
  clear(hLayer);
  if(!state.edit || !state.selected) return;
  if(state.selected.kind==='district'){
    const d=MODEL.districts[state.selected.key];
    d.points.forEach(([x,y],idx)=>{
      const h=mk('circle',{class:'handle',r:6,cx:x*W/100,cy:y*H/100,'data-i':idx});
      h.addEventListener('mousedown',e=>startDragVertex(e,'district',state.selected.key,idx));
      hLayer.append(h);
    });
  } else if(state.selected.kind==='road'){
    const r=MODEL.roads[state.selected.key];
    r.points.forEach(([x,y],idx)=>{
      const h=mk('circle',{class:'handle',r:6,cx:x*W/100,cy:y*H/100,'data-i':idx});
      h.addEventListener('mousedown',e=>startDragVertex(e,'road',state.selected.key,idx));
      hLayer.append(h);
    });
  }
}

function showTip(evt,obj){
  tip.hidden=false; tip.innerHTML=`<h3>${obj.name||obj.id||'Item'}</h3><p>${obj.desc||''}</p>`;
  moveTip(evt);
}
function moveTip(evt){
  const r=svg.getBoundingClientRect();
  tip.style.left=(evt.clientX-r.left+10)+'px';
  tip.style.top=(evt.clientY-r.top+10)+'px';
}
function hideTip(){ tip.hidden=true; }

function updateForm(){
  const sel=state.selected;
  document.getElementById('selNone').hidden=!!sel; document.getElementById('selForm').hidden=!sel;
  if(!sel) return;
  const obj = sel.kind==='district' ? MODEL.districts[sel.key]
            : sel.kind==='road' ? MODEL.roads[sel.key]
            : MODEL.poi[sel.key];
  document.getElementById('sType').value = sel.kind;
  document.getElementById('sId').value   = obj.id ?? sel.key;
  document.getElementById('sName').value = obj.name ?? '';
  document.getElementById('sDesc').value = obj.desc ?? '';
  const isRoad = sel.kind==='road';
  document.getElementById('roadExtras').hidden = !isRoad;
  if(isRoad){ document.getElementById('sRoadType').value=obj.type||'street'; document.getElementById('sRoadW').value=obj.width||3; }
}

export { showTip, moveTip, hideTip };