import * as THREE from 'three';
import { MathRandom } from './random.js';
import {
  ZONES_PER_CHUNK_SIDE,
  CHUNKS_PER_CLUSTER_SIDE,
  CLUSTER_SIZE,
  TREES_PER_ZONE,
  SPAWN_SAFE_RADIUS,
  AMPHITHEATRE_CLEARING_RADIUS
} from './constants.js';
import { createPalmTree } from './trees/palm-tree.js';
import { createPineTree } from './trees/pine-tree.js';
import { createSparseTree } from './trees/sparse-tree.js';
import { createForestTree } from './trees/forest-tree.js';

let amphitheatrePosition = null;
export function createTrees(scene, terrain) {
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

  const treeSeed = 54321;
  let rng = new MathRandom(treeSeed);
  const totalZones = ZONES_PER_CHUNK_SIDE * CHUNKS_PER_CLUSTER_SIDE * ZONES_PER_CHUNK_SIDE * CHUNKS_PER_CLUSTER_SIDE;
  const worldRadius = CLUSTER_SIZE / 2;

  const trunkMaterials = [
    new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 0.9, metalness: 0.1 }),
    new THREE.MeshStandardMaterial({ color: 0x6b4423, roughness: 0.9, metalness: 0.1 }),
    new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.8, metalness: 0.1 })
  ];

  const leavesMaterials = [
    new THREE.MeshStandardMaterial({ color: 0x2e8b57, roughness: 0.8, metalness: 0.0 }),
    new THREE.MeshStandardMaterial({ color: 0x228b22, roughness: 0.8, metalness: 0.0 }),
    new THREE.MeshStandardMaterial({ color: 0x006400, roughness: 0.7, metalness: 0.0 })
  ];

  const materials = { trunk: trunkMaterials, leaves: leavesMaterials };

  for (let i = 0; i < totalZones * TREES_PER_ZONE; i++) {
    const angle = rng.random() * Math.PI * 2;
    const distance = SPAWN_SAFE_RADIUS + rng.random() * (worldRadius - SPAWN_SAFE_RADIUS);
    const x = Math.cos(angle) * distance;
    const z = Math.sin(angle) * distance;
    
    if (isWater && isWater(x, z)) {
        continue;
    }
    
    let tree;

    // Biome logic based on world quadrants
    if (x > 0 && z > 0) { // Sand biome
        tree = createPalmTree(rng);
    } else if (x < 0 && z > 0) { // Snow biome
        tree = createPineTree(rng, true);
    } else if (x < 0 && z < 0) { // Forest biome
        /* @tweakable Chance (0-1) for a regular pine tree to spawn in the forest biome instead of a deciduous tree. Set to 0 to only have deciduous trees. */
        const pineTreeChanceInForest = 0.1;
        if (rng.random() > pineTreeChanceInForest) {
            tree = createForestTree(rng, materials);
        } else {
            tree = createPineTree(rng, false);
        }
    } else { // Dirt/Stone biome
        tree = createSparseTree(rng);
    }

    if (amphitheatrePosition) {
      const distToAmphitheatre = Math.sqrt(Math.pow(x - amphitheatrePosition.x, 2) + Math.pow(z - amphitheatrePosition.z, 2));
      if (distToAmphitheatre < AMPHITHEATRE_CLEARING_RADIUS) {
          continue;
      }
    }

    tree.position.x = x;
    tree.position.z = z;
    tree.position.y = getHeight ? getHeight(tree.position.x, tree.position.z) : 0;

    tree.rotation.y = rng.random() * Math.PI * 2;
    /* @tweakable The base scale for all trees. */
    const baseTreeScale = 0.8;
    /* @tweakable The random additional scale for all trees. */
    const randTreeScale = 0.5;
    const treeScale = baseTreeScale + rng.random() * randTreeScale;
    tree.scale.set(treeScale, treeScale, treeScale);

    tree.userData.isTree = true;
    tree.userData.isBarrier = true;

    scene.add(tree);
  }
}
