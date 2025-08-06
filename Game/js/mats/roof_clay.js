// Kitbashing material: Clay Tiles
import { createMaterial } from './createMaterial.js';
export default function(assetManager, repeatU=1, repeatV=1){
  return createMaterial('clayTiles', repeatU, repeatV, assetManager);
}