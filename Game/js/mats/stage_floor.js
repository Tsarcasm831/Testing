// Kitbashing material: Stage Floor
import { createMaterial } from './createMaterial.js';
export default function(assetManager, repeatU=1, repeatV=1){
  return createMaterial('stageFloor', repeatU, repeatV, assetManager);
}
