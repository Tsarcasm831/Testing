import * as THREE from 'three';
import { MathRandom } from './random.js';
import { CLUSTER_SIZE, CLOUD_COUNT } from './constants.js';

/* @tweakable The lowest altitude for clouds. */
const MIN_CLOUD_ALTITUDE = 20;
/* @tweakable The range of altitudes for clouds (Min + Range). */
const CLOUD_ALTITUDE_RANGE = 15;
/* @tweakable The minimum number of puffs per cloud group. */
const MIN_CLOUD_PUFFS = 3;
/* @tweakable The additional random number of puffs per cloud group. */
const RAND_CLOUD_PUFFS = 5;

export function createClouds(scene) {
  const cloudSeed = 67890;
  let rng = new MathRandom(cloudSeed);
  const worldRadius = CLUSTER_SIZE / 2;

  const cloudMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    opacity: 0.95,
    transparent: true,
    roughness: 0.9,
    metalness: 0.0,
    emissive: 0xcccccc,
    emissiveIntensity: 0.2
  });

  for (let i = 0; i < CLOUD_COUNT; i++) {
    const cloudGroup = new THREE.Group();
    const puffCount = MIN_CLOUD_PUFFS + Math.floor(rng.random() * RAND_CLOUD_PUFFS);
    for (let j = 0; j < puffCount; j++) {
      const puffSize = 2 + rng.random() * 3;
      const puffGeometry = new THREE.SphereGeometry(puffSize, 7, 7);
      const puff = new THREE.Mesh(puffGeometry, cloudMaterial);
      puff.position.x = (rng.random() - 0.5) * 5;
      puff.position.y = (rng.random() - 0.5) * 2;
      puff.position.z = (rng.random() - 0.5) * 5;
      cloudGroup.add(puff);
    }

    const angle = rng.random() * Math.PI * 2;
    const distance = rng.random() * worldRadius * 1.5;
    cloudGroup.position.x = Math.cos(angle) * distance;
    cloudGroup.position.z = Math.sin(angle) * distance;
    cloudGroup.position.y = MIN_CLOUD_ALTITUDE + rng.random() * CLOUD_ALTITUDE_RANGE;

    cloudGroup.rotation.y = rng.random() * Math.PI * 2;
    scene.add(cloudGroup);
  }
}