// Kitbashing material: Slate
import { createMaterial } from './createMaterial.js';
export default function(assetManager, repeatU=1, repeatV=1){
  return createMaterial('slate', repeatU, repeatV, assetManager);
}