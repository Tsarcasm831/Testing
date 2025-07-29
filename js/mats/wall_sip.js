// Kitbashing material: Insulated Panel
import { createMaterial } from './createMaterial.js';
export default function(assetManager, repeatU=1, repeatV=1){
  return createMaterial('sip', repeatU, repeatV, assetManager);
}