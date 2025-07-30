// Kitbashing material: Stage Light
import { createMaterial } from './createMaterial.js';
export default function(assetManager, repeatU=1, repeatV=1){
  return createMaterial('stageLight', repeatU, repeatV, assetManager);
}
