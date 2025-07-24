import { createMaterial } from './createMaterial.js';
export default function(repeatU=1, repeatV=1){
  return createMaterial('assets/textures/claddingAndSiding/woodSiding/', repeatU, repeatV);
}
