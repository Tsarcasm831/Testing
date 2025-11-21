import { W, H, svg } from '../constants.js';

let zoomThrottle = null;

export function initZoom() {
  svg.addEventListener('wheel', throttledWheelZoom, { passive: false });
}

export function resetViewBox() {
  setViewBox({ x: 0, y: 0, w: W, h: H });
}

function throttledWheelZoom(e) {
  e.preventDefault();
  if (zoomThrottle) return;
  zoomThrottle = setTimeout(() => {
    zoomThrottle = null;
  }, 16); // ~60fps
  onWheelZoom(e);
}

function parseViewBox() {
  const vb = (svg.getAttribute('viewBox') || '').trim().split(/\s+/).map(Number);
  return (vb.length === 4 && vb.every(n => !Number.isNaN(n))) ? { x: vb[0], y: vb[1], w: vb[2], h: vb[3] } : { x: 0, y: 0, w: W, h: H };
}

function setViewBox(vb) {
  svg.setAttribute('viewBox', `${vb.x} ${vb.y} ${vb.w} ${vb.h}`);
}

function onWheelZoom(e) {
  const vb = parseViewBox();
  const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
  const p = pt.matrixTransform(svg.getScreenCTM().inverse());
  const minW = W / 6, minH = H / 6, maxW = W, maxH = H;
  const zoomFactor = e.deltaY < 0 ? 0.9 : 1.1;
  const newW = Math.min(maxW, Math.max(minW, vb.w * zoomFactor));
  const newH = Math.min(maxH, Math.max(minH, vb.h * zoomFactor));
  const tx = (p.x - vb.x) / vb.w;
  const ty = (p.y - vb.y) / vb.h;
  let nx = p.x - tx * newW;
  let ny = p.y - ty * newH;
  nx = Math.max(0, Math.min(W - newW, nx));
  ny = Math.max(0, Math.min(H - newH, ny));
  setViewBox({ x: nx, y: ny, w: newW, h: newH });
}
