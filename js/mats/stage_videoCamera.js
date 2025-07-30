// Kitbashing material: Video Camera
import { createMaterial } from './createMaterial.js';
export default function(assetManager, repeatU=1, repeatV=1){
  return createMaterial('videoCamera', repeatU, repeatV, assetManager);
}
