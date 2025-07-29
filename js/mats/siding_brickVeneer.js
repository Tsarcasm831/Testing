// Kitbashing material: Brick Veneer
import { createMaterial } from './createMaterial.js';
export default function(assetManager, repeatU=1, repeatV=1){
  return createMaterial('brickVeneer', repeatU, repeatV, assetManager);
}