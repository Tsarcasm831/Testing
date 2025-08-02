/* @tweakable A script to regenerate material modules with kitbashing comments. Run this if you update mats.json */
const fs = require('fs');
const path = require('path');

/* @tweakable The path to the materials definition file. */
const matsDataPath = 'json/mats.json';
const matsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, matsDataPath), 'utf8')
);

for (const category of matsData.materials) {
  for (const item of category.items) {
    const destPath = path.join(__dirname, '..', item.modelModule);
    const dir = path.dirname(destPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const content = `// Kitbashing material: ${item.name}\n` +
      "import { createMaterial } from './createMaterial.js';\n" +
      `export default function(assetManager, repeatU=1, repeatV=1){\n` +
      `  return createMaterial('${item.assetNamePrefix}', repeatU, repeatV, assetManager);\n` +
      `}\n`;
    fs.writeFileSync(destPath, content);
  }
}