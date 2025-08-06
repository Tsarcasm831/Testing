// Kitbashing material: Metal Panels
import { createMaterial } from './createMaterial.js';
export default function(assetManager, repeatU=1, repeatV=1){
  return createMaterial('metalPanels', repeatU, repeatV, assetManager);
}