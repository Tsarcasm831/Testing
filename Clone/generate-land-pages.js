// Script to generate static land pages for all lands
// Run with: node generate-land-pages.js

import { DEFAULT_MODEL } from './user-defaults.js';
import { writeFileSync } from 'fs';

const DEFAULT_LANDS = DEFAULT_MODEL.lands;

const W = 1018;
const H = 968;

function calculateViewBox(points) {
  let minX = 100, maxX = 0, minY = 100, maxY = 0;
  for (const [x, y] of points) {
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
  return `${Math.round(vbX)} ${Math.round(vbY)} ${Math.round(vbW)} ${Math.round(vbH)}`;
}

function generateLandPage(land) {
  const viewBox = calculateViewBox(land.points);
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${land.name}</title>
<style>
body {
  margin: 0;
  background: #000;
  overflow: hidden;
  font-family: system-ui, -apple-system, sans-serif;
}
#container {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
svg {
  max-width: 90vw;
  max-height: 90vh;
}
.land {
  stroke-width: 3;
  vector-effect: non-scaling-stroke;
}
#info {
  position: absolute;
  top: 20px;
  left: 20px;
  color: #fff;
  background: rgba(0,0,0,0.7);
  padding: 15px 20px;
  border-radius: 8px;
  border: 1px solid #333;
}
#info h1 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 700;
}
#info p {
  margin: 4px 0;
  font-size: 14px;
  opacity: 0.85;
}
#backBtn {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 10px 16px;
  background: rgba(255,255,255,0.1);
  border: 1px solid #444;
  border-radius: 8px;
  color: #fff;
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;
}
#backBtn:hover {
  background: rgba(255,255,255,0.15);
}
</style>
</head>
<body>
<a id="backBtn" href="index.html">← Back to Map</a>
<div id="info">
  <h1>${land.name}</h1>
  <p>${land.desc || ''}</p>
</div>
<div id="container">
  <svg id="landSvg" viewBox="${viewBox}"></svg>
</div>
<script type="module">
const W = ${W}, H = ${H};
const land = ${JSON.stringify(land)};

const svg = document.getElementById('landSvg');
const points = land.points.map(([x, y]) => [x * W / 100, y * H / 100].join(',')).join(' ');
const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
polygon.setAttribute('class', 'land');
polygon.setAttribute('points', points);
polygon.setAttribute('fill', land.color);
polygon.setAttribute('fill-opacity', '0.6');
polygon.setAttribute('stroke', land.color);
svg.appendChild(polygon);
</script>
</body>
</html>
`;
}

// Generate all land pages
for (const [id, land] of Object.entries(DEFAULT_LANDS)) {
  const html = generateLandPage(land);
  writeFileSync(`land-pages/${id}.html`, html);
  console.log(`Generated land-pages/${id}.html`);
}

console.log('✓ All land pages generated');