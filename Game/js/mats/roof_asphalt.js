// Kitbashing material: Asphalt Shingles
import { createMaterial } from './createMaterial.js';
export default function(assetManager, repeatU=1, repeatV=1){
  return createMaterial('asphaltShingles', repeatU, repeatV, assetManager);
}