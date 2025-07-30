// Kitbashing material: Control Panel
import { createMaterial } from './createMaterial.js';
export default function(assetManager, repeatU=1, repeatV=1){
  return createMaterial('controlPanel', repeatU, repeatV, assetManager);
}
