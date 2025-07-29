// Kitbashing material: Vinyl Siding
import { createMaterial } from './createMaterial.js';
export default function(assetManager, repeatU=1, repeatV=1){
  return createMaterial('vinylSiding', repeatU, repeatV, assetManager);
}