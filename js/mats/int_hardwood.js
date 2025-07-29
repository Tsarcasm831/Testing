// Kitbashing material: Hardwood
import { createMaterial } from './createMaterial.js';
export default function(assetManager, repeatU=1, repeatV=1){
  return createMaterial('hardwood', repeatU, repeatV, assetManager);
}