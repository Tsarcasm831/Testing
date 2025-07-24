const fs = require('fs');
const path = require('path');

const matsData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'mats.json'), 'utf8'));

for (const category of matsData.materials) {
  for (const item of category.items) {
    const destPath = path.join(__dirname, '..', item.modelModule);
    const dir = path.dirname(destPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const content = `// Kitbashing material: ${item.name}\n` +
      "import { createMaterial } from './createMaterial.js';\n" +
      `export default function(repeatU=1, repeatV=1){\n` +
      `  return createMaterial('${item.textureDir}', repeatU, repeatV);\n` +
      `}\n`;
    fs.writeFileSync(destPath, content);
  }
}
