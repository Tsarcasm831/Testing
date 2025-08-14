import { parseGridLabel, posForCell } from '../utils/gridLabel.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three';

// Load and place the Hokage monument model.
// Adds a spherical collider to the provided object grid.
export function placeHokageMonument(scene, objectGrid, worldSize, settings, label = 'KN129') {
  try {
    const { i, j } = parseGridLabel(label);
    const pos = posForCell(i, j, worldSize);
    pos.y = 0;

    const monumentGroup = new THREE.Group();
    monumentGroup.name = 'HokageMonument';
    monumentGroup.position.copy(pos);
    scene.add(monumentGroup);

    const proxy = new THREE.Object3D();
    proxy.position.set(pos.x, pos.y, pos.z);
    proxy.userData = {
      label: 'Hokage Monument',
      collider: { type: 'sphere', radius: 180 }
    };
    objectGrid.add(proxy);
    scene.add(proxy);

    const loader = new GLTFLoader();
    loader.load(
      '/src/assets/Hokage_Monument.glb',
      gltf => {
        const model = gltf.scene || gltf.scenes?.[0];
        if (!model) return;
        model.scale.set(54, 54, 54);
        model.traverse(n => {
          if (n.isMesh) {
            n.castShadow = !!settings.shadows;
            n.receiveShadow = !!settings.shadows;
          }
        });
        model.position.y = 0;
        monumentGroup.add(model);
      },
      undefined,
      err => console.error('Failed to load Hokage Monument GLB:', err)
    );

    return monumentGroup;
  } catch (e) {
    console.warn(`Failed to place Hokage Monument at ${label}:`, e);
    return null;
  }
}
