// Kitbashing material: Plywood
import { createMaterial } from './createMaterial.js';
export default function(assetManager, repeatU=1, repeatV=1){
  return createMaterial('plywood', repeatU, repeatV, assetManager);
}