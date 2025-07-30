// Kitbashing material: Rigging
import { createMaterial } from './createMaterial.js';
export default function(assetManager, repeatU=1, repeatV=1){
  return createMaterial('stageRigging', repeatU, repeatV, assetManager);
}
