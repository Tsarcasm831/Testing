// Kitbashing material: Backdrop
import { createMaterial } from './createMaterial.js';
export default function(assetManager, repeatU=1, repeatV=1){
  return createMaterial('stageBackdrop', repeatU, repeatV, assetManager);
}
