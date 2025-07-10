import * as THREE from 'three';

const setupLighting = (scene) => {
  const ambient = new THREE.AmbientLight(0xffffff, 0.6);
  const directional = new THREE.DirectionalLight(0xffffff, 0.8);
  directional.position.set(100, 100, 100);
  scene.add(ambient);
  scene.add(directional);
};

export default setupLighting;
