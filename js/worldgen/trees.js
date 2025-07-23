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

let amphitheatrePosition = null;

/**
 * Creates a palm tree.
 * @param {MathRandom} rng - The random number generator.
 * @returns {THREE.Group} A group containing the tree.
 */
function createPalmTree(rng) {
    const tree = new THREE.Group();
    /* @tweakable The color of the palm tree trunk. */
    const palmTrunkMaterial = new THREE.MeshStandardMaterial({ color: 0xAC8B67, roughness: 0.9, metalness: 0.1 });
    /* @tweakable The color of the palm tree leaves. */
    const palmLeavesMaterial = new THREE.MeshStandardMaterial({ color: 0x2E8B57, roughness: 0.8, metalness: 0.0, side: THREE.DoubleSide });

    const trunkHeight = 8 + rng.random() * 4;
    const trunkRadius = 0.2 + rng.random() * 0.1;

    const trunkGeometry = new THREE.CylinderGeometry(trunkRadius * 0.8, trunkRadius, trunkHeight, 8);
    trunkGeometry.translate(0, trunkHeight / 2, 0);

    for (let j = 0; j < trunkGeometry.attributes.position.count; j++) {
        const y = trunkGeometry.attributes.position.getY(j);
        const bendFactor = Math.sin((y / trunkHeight) * Math.PI / 2);
        const bendAmount = bendFactor * trunkRadius * 2;
        trunkGeometry.attributes.position.setX(j, trunkGeometry.attributes.position.getX(j) + bendAmount);
    }
    
    const trunk = new THREE.Mesh(trunkGeometry, palmTrunkMaterial);
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    tree.add(trunk);

    /* @tweakable The number of leaves on a palm tree. */
    const numLeaves = 6 + Math.floor(rng.random() * 4);
    /* @tweakable Length of palm leaves. */
    const palmLeafLength = 3 + rng.random() * 2;
    /* @tweakable Width of palm leaves. */
    const palmLeafWidth = 0.5 + rng.random() * 0.3;

    for(let i = 0; i < numLeaves; i++) {
        const leafGeom = new THREE.BoxGeometry(palmLeafLength, 0.05, palmLeafWidth);
        leafGeom.translate(palmLeafLength / 2, 0, 0);
        const leaf = new THREE.Mesh(leafGeom, palmLeavesMaterial);
        
        const angle = (i / numLeaves) * Math.PI * 2 + rng.random() * 0.2;
        const tilt = -Math.PI / 3 - rng.random() * Math.PI / 4;

        leaf.rotation.y = angle;
        leaf.rotation.z = tilt;
        
        leaf.position.y = trunkHeight - 0.5;
        
        leaf.castShadow = true;
        tree.add(leaf);
    }

    return tree;
}

/**
 * Creates a pine tree, with an option for snow.
 * @param {MathRandom} rng - The random number generator.
 * @param {boolean} snowy - Whether the tree should have snow.
 * @returns {THREE.Group} A group containing the tree.
 */
function createPineTree(rng, snowy = false) {
    const tree = new THREE.Group();
    /* @tweakable Color of pine tree trunks. */
    const pineTrunkMaterial = new THREE.MeshStandardMaterial({ color: 0x694E33, roughness: 0.9, metalness: 0.1 });
    /* @tweakable Color of pine tree leaves. */
    const pineLeavesMaterial = new THREE.MeshStandardMaterial({ color: 0x1A472A, roughness: 0.8, metalness: 0.0 });
    /* @tweakable Color of snow on snowy pine trees. */
    const snowMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFAFA, roughness: 0.9, metalness: 0.0 });

    const trunkHeight = 6 + rng.random() * 8;
    const trunkRadius = 0.3 + rng.random() * 0.2;

    const trunkGeometry = new THREE.CylinderGeometry(trunkRadius * 0.5, trunkRadius, trunkHeight, 8);
    trunkGeometry.translate(0, trunkHeight / 2, 0);
    const trunk = new THREE.Mesh(trunkGeometry, pineTrunkMaterial);
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    tree.add(trunk);

    /* @tweakable The number of foliage layers on a pine tree. */
    const numLeafLayers = 4 + Math.floor(rng.random() * 3);
    /* @tweakable Base radius of the lowest pine tree foliage layer. */
    const baseFoliageRadius = 2.5 + rng.random();
    /* @tweakable Height of each foliage layer on a pine tree. */
    const foliageLayerHeight = 2 + rng.random();

    for(let i = 0; i < numLeafLayers; i++) {
        const layerRatio = (numLeafLayers - i) / numLeafLayers;
        const radius = baseFoliageRadius * layerRatio * (1 + (rng.random() - 0.5) * 0.2);
        const y = trunkHeight * 0.2 + i * (trunkHeight * 0.8 / numLeafLayers);

        const foliageGeom = new THREE.ConeGeometry(radius, foliageLayerHeight, 8);
        const foliage = new THREE.Mesh(foliageGeom, pineLeavesMaterial);
        foliage.position.y = y;
        foliage.castShadow = true;
        tree.add(foliage);

        if (snowy) {
             /* @tweakable The amount of snow on snowy trees (0-1). */
            const snowCoverage = 0.5 + rng.random() * 0.5;
            if (rng.random() < snowCoverage) {
                const snowGeom = new THREE.ConeGeometry(radius * 0.95, foliageLayerHeight, 8);
                const snow = new THREE.Mesh(snowGeom, snowMaterial);
                snow.position.y = y + 0.2 * foliageLayerHeight;
                tree.add(snow);
            }
        }
    }

    return tree;
}

/**
 * Creates a sparse, bare tree.
 * @param {MathRandom} rng - The random number generator.
 * @returns {THREE.Group} A group containing the tree.
 */
function createSparseTree(rng) {
    const tree = new THREE.Group();
    /* @tweakable Color of sparse/dead tree trunks. */
    const sparseTrunkMaterial = new THREE.MeshStandardMaterial({ color: 0x5D5C61, roughness: 0.9, metalness: 0.1 });

    const trunkHeight = 5 + rng.random() * 5;
    const trunkRadius = 0.2 + rng.random() * 0.2;

    const trunkGeometry = new THREE.CylinderGeometry(trunkRadius * 0.7, trunkRadius, trunkHeight, 6);
    trunkGeometry.translate(0, trunkHeight / 2, 0);
    const trunk = new THREE.Mesh(trunkGeometry, sparseTrunkMaterial);
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    tree.add(trunk);

    /* @tweakable The number of branches on sparse trees. */
    const numBranches = 4 + Math.floor(rng.random() * 5);
    /* @tweakable The base length of branches on sparse trees. */
    const baseBranchLength = trunkHeight * 0.5;

    for (let i = 0; i < numBranches; i++) {
        const branchLength = baseBranchLength * (0.5 + rng.random() * 0.5);
        const branchRadius = trunkRadius * 0.4 * (1 - (i / numBranches));
        const branchGeometry = new THREE.CylinderGeometry(branchRadius * 0.5, branchRadius, branchLength, 5);
        branchGeometry.translate(0, branchLength / 2, 0);
        const branch = new THREE.Mesh(branchGeometry, sparseTrunkMaterial);

        branch.position.y = trunkHeight * 0.3 + rng.random() * (trunkHeight * 0.7);
        
        const randomYAngle = Math.PI / 3 + (rng.random() - 0.5) * Math.PI / 4;
        const randomXZAngle = rng.random() * Math.PI * 2;
        branch.rotation.set(Math.cos(randomXZAngle) * randomYAngle, rng.random() * Math.PI, Math.sin(randomXZAngle) * randomYAngle);

        branch.castShadow = true;
        tree.add(branch);
    }
    return tree;
}

/**
 * Creates a default deciduous/forest tree.
 * @param {MathRandom} rng - The random number generator.
 * @param {object} materials - Object containing trunk and leaves materials arrays.
 * @returns {THREE.Group} A group containing the tree.
 */
function createForestTree(rng, materials) {
    const tree = new THREE.Group();
    const trunkMaterial = materials.trunk[Math.floor(rng.random() * materials.trunk.length)];
    const leavesMaterial = materials.leaves[Math.floor(rng.random() * materials.leaves.length)];
  
    const MIN_TRUNK_HEIGHT = 5;
    const RAND_TRUNK_HEIGHT = 7;
    const BASE_TRUNK_RADIUS = 0.3;
    const RAND_TRUNK_RADIUS = 0.3;
    const TRUNK_SEGMENTS = 12;
    const TRUNK_TAPER = 0.8;
    const MIN_BRANCHES = 3;
    const RAND_BRANCHES = 4;
    const LEAF_CLUSTER_RADIUS = 1.8;
    const LEAF_CLUSTER_SEGMENTS = 5;
    const MAX_BRANCH_DEPTH = 3;
    const BRANCH_SHRINK_FACTOR = 0.7;
    const BRANCH_ANGLE_Y = Math.PI / 3;
    const BRANCH_ANGLE_XZ = Math.PI * 2;
  
    const trunkHeight = MIN_TRUNK_HEIGHT + rng.random() * RAND_TRUNK_HEIGHT;
    const trunkRadius = BASE_TRUNK_RADIUS + rng.random() * RAND_TRUNK_RADIUS;
  
    const trunkGeometry = new THREE.CylinderGeometry(trunkRadius * TRUNK_TAPER, trunkRadius, trunkHeight, TRUNK_SEGMENTS);
    trunkGeometry.translate(0, trunkHeight / 2, 0);
  
    for (let j = 0; j < trunkGeometry.attributes.position.count; j++) {
      const y = trunkGeometry.attributes.position.getY(j);
      const bendFactor = y / trunkHeight;
      const bendAmount = Math.sin(bendFactor * Math.PI) * trunkRadius * 0.5;
      trunkGeometry.attributes.position.setX(j, trunkGeometry.attributes.position.getX(j) + bendAmount);
    }
  
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    tree.add(trunk);
  
    function createBranch(parent, position, radius, length, depth, trunkMat, leafMat) {
        if (depth > MAX_BRANCH_DEPTH) return;
  
        const branchGeometry = new THREE.CylinderGeometry(radius * TRUNK_TAPER, radius, length, Math.max(4, TRUNK_SEGMENTS - depth * 2));
        branchGeometry.translate(0, length / 2, 0);
        const branch = new THREE.Mesh(branchGeometry, trunkMat);
        branch.position.copy(position);
  
        const randomYAngle = (rng.random() - 0.2) * BRANCH_ANGLE_Y;
        const randomXZAngle = rng.random() * BRANCH_ANGLE_XZ;
        branch.rotation.set(Math.cos(randomXZAngle) * randomYAngle, rng.random() * Math.PI, Math.sin(randomXZAngle) * randomYAngle);
  
        parent.add(branch);
  
        const endPosition = new THREE.Vector3(0, length, 0);
        endPosition.applyQuaternion(branch.quaternion).add(branch.position);
  
        if (depth === MAX_BRANCH_DEPTH || rng.random() < 0.3) {
          const leafClusterGeometry = new THREE.IcosahedronGeometry(LEAF_CLUSTER_RADIUS, LEAF_CLUSTER_SEGMENTS - depth);
          const leafCluster = new THREE.Mesh(leafClusterGeometry, leafMat);
          leafCluster.position.copy(endPosition);
          leafCluster.castShadow = true;
          parent.add(leafCluster);
        } else {
          const subBranches = 1 + Math.floor(rng.random() * 2);
          for (let k = 0; k < subBranches; k++) {
            createBranch(parent, endPosition, radius * BRANCH_SHRINK_FACTOR, length * BRANCH_SHRINK_FACTOR, depth + 1, trunkMat, leafMat);
          }
        }
    }

    const numBranches = MIN_BRANCHES + Math.floor(rng.random() * RAND_BRANCHES);
    for (let j = 0; j < numBranches; j++) {
      const startHeight = trunkHeight * 0.4 + rng.random() * (trunkHeight * 0.6);
      createBranch(tree, new THREE.Vector3(0, startHeight, 0), trunkRadius * 0.8, trunkHeight * 0.4, 0, trunkMaterial, leavesMaterial);
    }

    return tree;
}

export function createTrees(scene, getHeight) {
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
    const treeScale = 0.8 + rng.random() * 0.5;
    tree.scale.set(treeScale, treeScale, treeScale);

    tree.userData.isTree = true;
    tree.userData.isBarrier = true;

    scene.add(tree);
  }
}