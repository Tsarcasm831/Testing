// Kitbashing material: Fiber Cement
import { createMaterial } from './createMaterial.js';
export default function(repeatU=1, repeatV=1){
  return createMaterial('assets/textures/siding/fiberCement/', repeatU, repeatV);
}