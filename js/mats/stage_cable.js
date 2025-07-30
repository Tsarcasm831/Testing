// Kitbashing material: Stage Cable
import { createMaterial } from './createMaterial.js';
export default function(assetManager, repeatU=1, repeatV=1){
  return createMaterial('stageCable', repeatU, repeatV, assetManager);
}
