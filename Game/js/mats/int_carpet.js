// Kitbashing material: Carpet
import { createMaterial } from './createMaterial.js';
export default function(assetManager, repeatU=1, repeatV=1){
  return createMaterial('carpet', repeatU, repeatV, assetManager);
}