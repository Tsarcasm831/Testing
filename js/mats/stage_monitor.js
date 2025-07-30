// Kitbashing material: Monitor
import { createMaterial } from './createMaterial.js';
export default function(assetManager, repeatU=1, repeatV=1){
  return createMaterial('stageMonitor', repeatU, repeatV, assetManager);
}
