// Kitbashing material: Concrete
import { createMaterial } from './createMaterial.js';
export default function(assetManager, repeatU=1, repeatV=1){
  return createMaterial('concrete', repeatU, repeatV, assetManager);
}