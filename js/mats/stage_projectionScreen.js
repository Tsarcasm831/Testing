// Kitbashing material: Projection Screen
import { createMaterial } from './createMaterial.js';
export default function(assetManager, repeatU=1, repeatV=1){
  return createMaterial('projectionScreen', repeatU, repeatV, assetManager);
}
