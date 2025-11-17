// Script to generate static land pages for all lands
// Run with: node generate-land-pages.js

import { DEFAULT_LANDS } from './defaults/parts/lands-custom.js';
import { readFileSync, writeFileSync } from 'fs';

const baseTemplate = readFileSync('./land.html', 'utf8');

function generateLandPage(land) {
  return baseTemplate
    .replace(/<title>.*?<\/title>/, `<title>${land.name}</title>`)
    .replace('<body>', `<body data-land-id="${land.id}">`);
}

for (const [id, land] of Object.entries(DEFAULT_LANDS)) {
  const html = generateLandPage(land);
  writeFileSync(`${id}.html`, html);
  console.log(`Generated ${id}.html`);
}

console.log('✓ All land pages generated');
