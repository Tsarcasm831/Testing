// Kitbashing material: Microphone Stand
import { createMaterial } from './createMaterial.js';
export default function(assetManager, repeatU=1, repeatV=1){
  return createMaterial('microphoneStand', repeatU, repeatV, assetManager);
}
