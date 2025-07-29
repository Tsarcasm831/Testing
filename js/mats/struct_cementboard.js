// Kitbashing material: Cement Board
import { createMaterial } from './createMaterial.js';
export default function(assetManager, repeatU=1, repeatV=1){
  return createMaterial('cementBoard', repeatU, repeatV, assetManager);
}