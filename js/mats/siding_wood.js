// Kitbashing material: Wood Siding
import { createMaterial } from './createMaterial.js';
export default function(assetManager, repeatU=1, repeatV=1){
  return createMaterial('woodSiding', repeatU, repeatV, assetManager);
}