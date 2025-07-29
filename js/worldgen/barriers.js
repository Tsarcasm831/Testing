import * as THREE from 'three';
import { MathRandom } from './random.js';
import {
  ZONES_PER_CHUNK_SIDE,
  CHUNKS_PER_CLUSTER_SIDE,
  CLUSTER_SIZE,
  BARRIERS_PER_ZONE,
  PILLARS_PER_ZONE,
  SPAWN_SAFE_RADIUS,
  AMPHITHEATRE_CLEARING_RADIUS
} from './constants.js';
import { createAmphitheatre } from './amphitheatre.js';

let amphitheatrePosition = null;

export function createBarriers(scene, terrain) {
  const getHeight = terrain.userData.getHeight;
  const isWater = terrain.userData.isWater;

  // We get the position from the created amphitheater instance to avoid circular dependency issues
  // and ensure we're using the same position data.
  if (!amphitheatrePosition) {
    const amp = scene.children.find(c => c.name === 'amphitheatre');
    if (amp) {
      amphitheatrePosition = amp.position;
    }
  }

  const barrierSeed = 12345;
  let rng = new MathRandom(barrierSeed);
  const totalZones = ZONES_PER_CHUNK_SIDE * CHUNKS_PER_CLUSTER_SIDE * ZONES_PER_CHUNK_SIDE * CHUNKS_PER_CLUSTER_SIDE;
  const worldRadius = CLUSTER_SIZE / 2;

  const wallMaterial = new THREE.MeshStandardMaterial({
    color: 0x888888,
    roughness: 0.7,
    metalness: 0.2
  });

  for (let i = 0; i < totalZones * BARRIERS_PER_ZONE; i++) {
    const width = 1 + rng.random() * 3;
    const height = 1 + rng.random() * 3;
    const depth = 1 + rng.random() * 3;

    const wallGeometry = new THREE.BoxGeometry(width, height, depth);
    const wall = new THREE.Mesh(wallGeometry, wallMaterial);

    const angle = rng.random() * Math.PI * 2;
    const distance = SPAWN_SAFE_RADIUS + rng.random() * (worldRadius - SPAWN_SAFE_RADIUS);
    const x = Math.cos(angle) * distance;
    const z = Math.sin(angle) * distance;

    if (isWater && isWater(x, z)) {
        continue;
    }

    if (amphitheatrePosition) {
      const distToAmphitheatre = Math.sqrt(Math.pow(x - amphitheatrePosition.x, 2) + Math.pow(z - amphitheatrePosition.z, 2));
      if (distToAmphitheatre < AMPHITHEATRE_CLEARING_RADIUS) {
          continue;
      }
    }
    
    wall.position.x = x;
    wall.position.z = z;
    const terrainHeight = getHeight ? getHeight(wall.position.x, wall.position.z) : 0;
    wall.position.y = terrainHeight + height / 2;

    wall.castShadow = true;
    wall.receiveShadow = true;
    wall.userData.isBarrier = true;

    scene.add(wall);
  }

  const pillarCount = totalZones * PILLARS_PER_ZONE;
  for (let i = 0; i < pillarCount; i++) {
    const angle = rng.random() * Math.PI * 2;
    const distance = SPAWN_SAFE_RADIUS + rng.random() * (worldRadius - SPAWN_SAFE_RADIUS);
    const x = Math.cos(angle) * distance;
    const z = Math.sin(angle) * distance;

    if (isWater && isWater(x, z)) {
        continue;
    }

    if (amphitheatrePosition) {
      const distToAmphitheatre = Math.sqrt(Math.pow(x - amphitheatrePosition.x, 2) + Math.pow(z - amphitheatrePosition.z, 2));
      if (distToAmphitheatre < AMPHITHEATRE_CLEARING_RADIUS) {
          continue;
      }
    }

    const pillarHeight = 2 + rng.random() * 15;
    const pillarWidth = 0.8 + rng.random() * 0.6;
    const pillarGeo = new THREE.BoxGeometry(pillarWidth, pillarHeight, pillarWidth);

    const pillarMaterial = new THREE.MeshStandardMaterial({
      color: 0xaaaaaa,
      roughness: 0.6,
      metalness: 0.3
    });

    const pillar = new THREE.Mesh(pillarGeo, pillarMaterial);
    const terrainPillarHeight = getHeight ? getHeight(x, z) : 0;
    pillar.position.set(x, terrainPillarHeight + pillarHeight / 2, z);
    pillar.castShadow = true;
    pillar.receiveShadow = true;
    pillar.userData.isBarrier = true;

    const capSize = pillarWidth * 1.5;
    const capHeight = 0.5;
    const capGeo = new THREE.BoxGeometry(capSize, capHeight, capSize);
    const cap = new THREE.Mesh(capGeo, wallMaterial);
    cap.position.y = pillarHeight / 2 + capHeight / 2;
    pillar.add(cap);

    if (rng.random() < 0.25) {
      const remoteGeo = new THREE.BoxGeometry(0.3, 0.1, 0.15);
      const remoteMaterial = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        roughness: 0.3,
        metalness: 0.7,
        emissive: 0xff0000,
        emissiveIntensity: 0.3
      });

      const remote = new THREE.Mesh(remoteGeo, remoteMaterial);
      remote.position.y = pillarHeight / 2 + capHeight + 0.1;
      remote.rotation.y = Math.PI * rng.random();
      remote.castShadow = true;
      remote.userData.isRemote = true;
      remote.userData.remoteId = `remote_${i}`;
      pillar.add(remote);

      const buttonGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.02, 8);
      const buttonMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
      const button = new THREE.Mesh(buttonGeo, buttonMaterial);
      button.position.set(0, 0.06, 0);
      button.rotation.x = Math.PI / 2;
      remote.add(button);
    }

    scene.add(pillar);
  }
}