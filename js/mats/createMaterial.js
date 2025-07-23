import * as THREE from 'three';

export function createMaterial(textureDir, repeatU = 1, repeatV = 1) {
  const loader = new THREE.TextureLoader();
  const textures = {
    map: loader.load(`${textureDir}albedo.png`),
    normalMap: loader.load(`${textureDir}normal.png`),
    roughnessMap: loader.load(`${textureDir}roughness.png`),
    aoMap: loader.load(`${textureDir}ao.png`),
  };
  for (const tex of Object.values(textures)) {
    if (tex) {
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(repeatU, repeatV);
    }
  }
  return new THREE.MeshStandardMaterial(textures);
}
