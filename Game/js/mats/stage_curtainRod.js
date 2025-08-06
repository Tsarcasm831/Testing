// Kitbashing material: Curtain Rod
import { createMaterial } from './createMaterial.js';
export default function(assetManager, repeatU=1, repeatV=1){
  return createMaterial('curtainRod', repeatU, repeatV, assetManager);
}
