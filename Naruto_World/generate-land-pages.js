// Script to generate static land pages for all lands
// Run with: node generate-land-pages.js

import { DEFAULT_LANDS } from './defaults/parts/lands-custom.js';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';

const OUTPUT_DIR = './land-pages';
mkdirSync(OUTPUT_DIR, { recursive: true });
const baseTemplate = readFileSync(`${OUTPUT_DIR}/land.html`, 'utf8');

function generateLandPage(land) {
  return baseTemplate
    .replace(/<title>.*?<\/title>/, `<title>${land.name}</title>`)
    .replace('<body>', `<body data-land-id="${land.id}">`);
}

for (const [id, land] of Object.entries(DEFAULT_LANDS)) {
  const html = generateLandPage(land);
  const outPath = `${OUTPUT_DIR}/${id}.html`;
  writeFileSync(outPath, html);
  console.log(`Generated ${outPath}`);
}

console.log('✓ All land pages generated');
