import { DEFAULT_MODEL } from './user-defaults.js';

const W = 1018;
const H = 968;

function getLandId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id') || document.body.dataset.landId || null;
}

function renderLand() {
  const landId = getLandId();
  const land = landId ? DEFAULT_MODEL.lands[landId] : null;

  if (!land) {
    document.getElementById('landName').textContent = 'Land not found';
    document.getElementById('landDesc').textContent = '';
    return;
  }

  document.getElementById('landName').textContent = land.name || land.id;
  document.getElementById('landDesc').textContent = land.desc || '';
  document.title = land.name || land.id;

  const svg = document.getElementById('landSvg');
  svg.innerHTML = '';
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);

  if (!Array.isArray(land.points) || land.points.length === 0) {
    return;
  }

  const points = land.points
    .map(([x, y]) => [x * W / 100, y * H / 100].join(','))
    .join(' ');
  const color = land.color || '#22d3ee';

  let minX = 100;
  let maxX = 0;
  let minY = 100;
  let maxY = 0;
  for (const [x, y] of land.points) {
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }

  const width = maxX - minX;
  const height = maxY - minY;
  const padX = width * 0.15;
  const padY = height * 0.15;

  const vbX = Math.max(0, (minX - padX) * W / 100);
  const vbY = Math.max(0, (minY - padY) * H / 100);
  const vbW = Math.min(W, (width + 2 * padX) * W / 100);
  const vbH = Math.min(H, (height + 2 * padY) * H / 100);

  svg.setAttribute('viewBox', `${vbX} ${vbY} ${vbW} ${vbH}`);

  const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  polygon.setAttribute('class', 'land');
  polygon.setAttribute('points', points);
  polygon.setAttribute('fill', color);
  polygon.setAttribute('fill-opacity', '0.6');
  polygon.setAttribute('stroke', color);

  svg.appendChild(polygon);
}

renderLand();
