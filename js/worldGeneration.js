import * as THREE from "three";
import './HouseBlocks.js';

// Simple seeded random number generator
class MathRandom {
  constructor(seed) {
    this.seed = seed;
  }
  
  random() {
    const x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }
}

/* @tweakable The size of a single zone. The current play area is one zone. */
export const ZONE_SIZE = 150;
/* @tweakable The number of zones along one side of a chunk. A value of 5 means a 5x5 grid of zones per chunk. */
export const ZONES_PER_CHUNK_SIDE = 5;
/* @tweakable The number of chunks along one side of a cluster. A value of 5 means a 5x5 grid of chunks per cluster. */
export const CHUNKS_PER_CLUSTER_SIDE = 5;

const CHUNK_SIZE = ZONE_SIZE * ZONES_PER_CHUNK_SIDE;
const CLUSTER_SIZE = CHUNK_SIZE * CHUNKS_PER_CLUSTER_SIDE;
/* @tweakable Radius around the origin kept clear of objects for safe spawning */
export const SPAWN_SAFE_RADIUS = 10;

/* @tweakable The maximum height of the terrain. */
const TERRAIN_AMPLITUDE = 10;
/* @tweakable The scale of the terrain features. Larger values mean more spread out hills. */
const TERRAIN_SCALE = 80;
/* @tweakable How many times the ground texture should repeat across a single zone. */
const TERRAIN_TEXTURE_REPEAT_PER_ZONE = 50;
/* @tweakable The number of segments for the terrain geometry. Higher values are more detailed but less performant. */
const TERRAIN_SEGMENTS = 250;
/* @tweakable The number of barriers to generate per zone. */
const BARRIERS_PER_ZONE = 0.3;
/* @tweakable The number of pillars to generate per zone. */
const PILLARS_PER_ZONE = 0.2;
/* @tweakable The number of trees to generate per zone. */
const TREES_PER_ZONE = 0.5;
/* @tweakable The number of clouds to generate for the entire cluster. */
const CLOUD_COUNT = 100;

function simpleNoise(x, z) {
  // A simple noise function using sine waves for a rolling hills effect.
  let a = TERRAIN_AMPLITUDE;
  let f = 1 / TERRAIN_SCALE;
  let y = 0;
  for (let i = 0; i < 4; i++) {
      y += a * (Math.sin(f * x) * Math.cos(f * z));
      a *= 0.5;
      f *= 2.0;
  }
  return y;
}

export function createTerrain(scene) {
  const terrainSize = CLUSTER_SIZE;
  const segments = TERRAIN_SEGMENTS;

  const geometry = new THREE.PlaneGeometry(terrainSize, terrainSize, segments, segments);
  geometry.rotateX(-Math.PI / 2);

  const vertices = geometry.attributes.position.array;
  for (let i = 0, j = 0; i < vertices.length; i++, j += 3) {
      const x = vertices[j];
      const z = vertices[j + 2];
      vertices[j + 1] = simpleNoise(x, z);
  }
  geometry.computeVertexNormals();

  const textureLoader = new THREE.TextureLoader();
  const groundTexture = textureLoader.load('ground_texture.png');
  groundTexture.wrapS = THREE.RepeatWrapping;
  groundTexture.wrapT = THREE.RepeatWrapping;
  const totalZonesSide = ZONES_PER_CHUNK_SIDE * CHUNKS_PER_CLUSTER_SIDE;
  groundTexture.repeat.set(TERRAIN_TEXTURE_REPEAT_PER_ZONE * totalZonesSide, TERRAIN_TEXTURE_REPEAT_PER_ZONE * totalZonesSide);

  const material = new THREE.MeshStandardMaterial({
      map: groundTexture,
      roughness: 0.8,
      metalness: 0.2
  });

  const terrain = new THREE.Mesh(geometry, material);
  terrain.receiveShadow = true;
  terrain.userData.isTerrain = true;
  scene.add(terrain);

  const getHeight = (x, z) => {
      // Clamp x and z to be within terrain bounds
      const clampedX = Math.max(-terrainSize / 2, Math.min(terrainSize / 2, x));
      const clampedZ = Math.max(-terrainSize / 2, Math.min(terrainSize / 2, z));
      return simpleNoise(clampedX, clampedZ);
  };

  terrain.userData.getHeight = getHeight;
  return terrain;
}

export function createBarriers(scene, getHeight) {
  // Use a deterministic random number generator based on a fixed seed
  const barrierSeed = 12345; // Fixed seed for deterministic generation
  let rng = new MathRandom(barrierSeed);
  const totalZones = ZONES_PER_CHUNK_SIDE * CHUNKS_PER_CLUSTER_SIDE * ZONES_PER_CHUNK_SIDE * CHUNKS_PER_CLUSTER_SIDE;
  const worldRadius = CLUSTER_SIZE / 2;
  
  // Wall material
  const wallMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x888888,
    roughness: 0.7,
    metalness: 0.2
  });
  
  // Create some random barriers
  for (let i = 0; i < totalZones * BARRIERS_PER_ZONE; i++) {  
    const width = 1 + rng.random() * 3;
    const height = 1 + rng.random() * 3;
    const depth = 1 + rng.random() * 3;
    
    const wallGeometry = new THREE.BoxGeometry(width, height, depth);
    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
    
    // Random position outside the spawn safe area
    const angle = rng.random() * Math.PI * 2;
    const distance = SPAWN_SAFE_RADIUS + rng.random() * (worldRadius - SPAWN_SAFE_RADIUS);
    wall.position.x = Math.cos(angle) * distance;
    wall.position.z = Math.sin(angle) * distance;
    const terrainHeight = getHeight ? getHeight(wall.position.x, wall.position.z) : 0;
    wall.position.y = terrainHeight + height / 2;
    
    wall.castShadow = true;
    wall.receiveShadow = true;
    wall.userData.isBarrier = true;
    
    scene.add(wall);
  }
  
  // Add decorative pillars throughout the scene
  const pillarCount = totalZones * PILLARS_PER_ZONE;
  for (let i = 0; i < pillarCount; i++) {
    const angle = rng.random() * Math.PI * 2;
    const distance = SPAWN_SAFE_RADIUS + rng.random() * (worldRadius - SPAWN_SAFE_RADIUS);
    const x = Math.cos(angle) * distance;
    const z = Math.sin(angle) * distance;
    
    // Create a tall, thin pillar with much more height variation
    const pillarHeight = 2 + rng.random() * 15; 
    const pillarWidth = 0.8 + rng.random() * 0.6;
    const pillarGeo = new THREE.BoxGeometry(pillarWidth, pillarHeight, pillarWidth);
    
    // Use a slightly different material for pillars
    const pillarMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xaaaaaa,
      roughness: 0.6,
      metalness: 0.3
    });
    
    const pillar = new THREE.Mesh(pillarGeo, pillarMaterial);
    const terrainPillarHeight = getHeight ? getHeight(x, z) : 0;
    pillar.position.set(x, terrainPillarHeight + pillarHeight/2, z);
    pillar.castShadow = true;
    pillar.receiveShadow = true;
    pillar.userData.isBarrier = true;
    
    // Add a decorative cap to the pillar
    const capSize = pillarWidth * 1.5;
    const capHeight = 0.5;
    const capGeo = new THREE.BoxGeometry(capSize, capHeight, capSize);
    const cap = new THREE.Mesh(capGeo, wallMaterial);
    cap.position.y = pillarHeight/2 + capHeight/2;
    pillar.add(cap);
    
    // 25% chance to spawn a remote on tall pillars
    if (rng.random() < 0.25) {
      // Create a remote object
      const remoteGeo = new THREE.BoxGeometry(0.3, 0.1, 0.15);
      const remoteMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xff0000,
        roughness: 0.3,
        metalness: 0.7,
        emissive: 0xff0000,
        emissiveIntensity: 0.3
      });
      
      const remote = new THREE.Mesh(remoteGeo, remoteMaterial);
      remote.position.y = pillarHeight/2 + capHeight + 0.1;
      remote.rotation.y = Math.PI * rng.random();
      remote.castShadow = true;
      remote.userData.isRemote = true;
      remote.userData.remoteId = `remote_${i}`;
      pillar.add(remote);
      
      // Add a button to the remote
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

export function createTrees(scene, getHeight) {
  // Use a deterministic random number generator for consistent tree placement
  const treeSeed = 54321; // Different seed than barriers
  let rng = new MathRandom(treeSeed);
  const totalZones = ZONES_PER_CHUNK_SIDE * CHUNKS_PER_CLUSTER_SIDE * ZONES_PER_CHUNK_SIDE * CHUNKS_PER_CLUSTER_SIDE;
  const worldRadius = CLUSTER_SIZE / 2;
  
  // Tree trunk materials (varying browns)
  const trunkMaterials = [
    new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.9, metalness: 0.1 }),
    new THREE.MeshStandardMaterial({ color: 0x6B4423, roughness: 0.9, metalness: 0.1 }),
    new THREE.MeshStandardMaterial({ color: 0x5D4037, roughness: 0.8, metalness: 0.1 })
  ];
  
  // Tree leaves materials (varying greens)
  const leavesMaterials = [
    new THREE.MeshStandardMaterial({ color: 0x2E8B57, roughness: 0.8, metalness: 0.0 }),
    new THREE.MeshStandardMaterial({ color: 0x228B22, roughness: 0.8, metalness: 0.0 }),
    new THREE.MeshStandardMaterial({ color: 0x006400, roughness: 0.7, metalness: 0.0 })
  ];

  /* @tweakable Minimum height for tree trunks. */
  const MIN_TRUNK_HEIGHT = 5;
  /* @tweakable Additional random height for tree trunks. */
  const RAND_TRUNK_HEIGHT = 7;
  /* @tweakable Base radius for tree trunks. */
  const BASE_TRUNK_RADIUS = 0.3;
  /* @tweakable Additional random radius for tree trunks. */
  const RAND_TRUNK_RADIUS = 0.3;
  /* @tweakable Number of segments for the tree trunk geometry. */
  const TRUNK_SEGMENTS = 12;
  /* @tweakable How much the trunk tapers towards the top (0 = no taper, 1 = tapers to a point). */
  const TRUNK_TAPER = 0.8;
  /* @tweakable Minimum number of main branches on a tree. */
  const MIN_BRANCHES = 3;
  /* @tweakable Additional random number of main branches. */
  const RAND_BRANCHES = 4;
  /* @tweakable Radius of the leaf clusters. */
  const LEAF_CLUSTER_RADIUS = 1.8;
  /* @tweakable Number of segments for the leaf cluster geometry. */
  const LEAF_CLUSTER_SEGMENTS = 5;
  /* @tweakable Maximum recursion depth for branches. */
  const MAX_BRANCH_DEPTH = 3;
  /* @tweakable Factor by which branches get smaller with each level of recursion. */
  const BRANCH_SHRINK_FACTOR = 0.7;
  /* @tweakable Vertical angle variation for branches. */
  const BRANCH_ANGLE_Y = Math.PI / 3;
  /* @tweakable Horizontal angle variation for branches. */
  const BRANCH_ANGLE_XZ = Math.PI * 2;
  
  // Create different types of trees
  for (let i = 0; i < totalZones * TREES_PER_ZONE; i++) {  
    const tree = new THREE.Group();
    const trunkMaterial = trunkMaterials[Math.floor(rng.random() * trunkMaterials.length)];
    const leavesMaterial = leavesMaterials[Math.floor(rng.random() * leavesMaterials.length)];

    const trunkHeight = MIN_TRUNK_HEIGHT + rng.random() * RAND_TRUNK_HEIGHT;
    const trunkRadius = BASE_TRUNK_RADIUS + rng.random() * RAND_TRUNK_RADIUS;

    const trunkGeometry = new THREE.CylinderGeometry(trunkRadius * TRUNK_TAPER, trunkRadius, trunkHeight, TRUNK_SEGMENTS);
    trunkGeometry.translate(0, trunkHeight / 2, 0);

    // Add some bend to the trunk
    for (let j = 0; j < trunkGeometry.attributes.position.count; j++) {
      const y = trunkGeometry.attributes.position.getY(j);
      const bendFactor = (y / trunkHeight);
      const bendAmount = Math.sin(bendFactor * Math.PI) * trunkRadius * 0.5;
      trunkGeometry.attributes.position.setX(j, trunkGeometry.attributes.position.getX(j) + bendAmount);
    }

    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    tree.add(trunk);

    const numBranches = MIN_BRANCHES + Math.floor(rng.random() * RAND_BRANCHES);
    for (let j = 0; j < numBranches; j++) {
      const startHeight = trunkHeight * 0.4 + rng.random() * (trunkHeight * 0.6);
      createBranch(
        tree,
        new THREE.Vector3(0, startHeight, 0),
        trunkRadius * 0.8,
        trunkHeight * 0.4,
        0,
        trunkMaterial,
        leavesMaterial
      );
    }
    
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

    // Random position outside the spawn safe area and existing barriers
    const angle = rng.random() * Math.PI * 2;
    const distance = SPAWN_SAFE_RADIUS + rng.random() * (worldRadius - SPAWN_SAFE_RADIUS);
    tree.position.x = Math.cos(angle) * distance;
    tree.position.z = Math.sin(angle) * distance;
    tree.position.y = getHeight ? getHeight(tree.position.x, tree.position.z) : 0;
    
    // Add some random rotation and scale variation
    tree.rotation.y = rng.random() * Math.PI * 2;
    const treeScale = 0.8 + rng.random() * 0.5;
    tree.scale.set(treeScale, treeScale, treeScale);
    
    // Add custom property for collision detection - move barrier detection to the whole tree instead
    tree.userData.isTree = true;
    tree.userData.isBarrier = true;
    
    scene.add(tree);
  }
}

export function createClouds(scene) {
  const cloudSeed = 67890; // Different seed for clouds
  let rng = new MathRandom(cloudSeed);
  const worldRadius = CLUSTER_SIZE / 2;
  
  const cloudMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff, // Pure white
    opacity: 0.95, // Slightly increased opacity
    transparent: true,
    roughness: 0.9, // Increased roughness to make it less shiny
    metalness: 0.0,
    emissive: 0xcccccc, // Add slight emissive color to make it brighter
    emissiveIntensity: 0.2 // Subtle emission to enhance whiteness
  });
  
  for (let i = 0; i < CLOUD_COUNT; i++) {
    const cloudGroup = new THREE.Group();
    
    // Create cloud with multiple spheres
    const puffCount = 3 + Math.floor(rng.random() * 5);
    for (let j = 0; j < puffCount; j++) {
      const puffSize = 2 + rng.random() * 3;
      const puffGeometry = new THREE.SphereGeometry(puffSize, 7, 7);
      const puff = new THREE.Mesh(puffGeometry, cloudMaterial);
      
      puff.position.x = (rng.random() - 0.5) * 5;
      puff.position.y = (rng.random() - 0.5) * 2;
      puff.position.z = (rng.random() - 0.5) * 5;
      
      cloudGroup.add(puff);
    }
    
    // Position the cloud
    const angle = rng.random() * Math.PI * 2;
    const distance = rng.random() * worldRadius * 1.5; // Allow clouds to go beyond terrain edge
    cloudGroup.position.x = Math.cos(angle) * distance;
    cloudGroup.position.z = Math.sin(angle) * distance;
    cloudGroup.position.y = 20 + rng.random() * 15;
    
    // Random rotation
    cloudGroup.rotation.y = rng.random() * Math.PI * 2;
    
    // Add to scene
    scene.add(cloudGroup);
  }
}

export function createStarterHouse(scene, getHeight) {
    /* @tweakable Position of the starter house */
    const housePosition = new THREE.Vector3(15, 0, 15);
    const houseY = getHeight(housePosition.x, housePosition.z);
    housePosition.y = houseY;

    // Dimensions
    /* @tweakable Width of the house */
    const houseWidth = 5;
    /* @tweakable Depth of the house */
    const houseDepth = 6;
    /* @tweakable Height of the house walls */
    const wallHeight = 2.5;
    /* @tweakable Width of the doorway */
    const doorWidth = 1.2;
    /* @tweakable Height of the doorway */
    const doorHeight = 2.0;
    /* @tweakable Thickness of the house walls */
    const wallThickness = 0.15;

    const addPart = (mesh) => {
        mesh.position.add(housePosition);
        mesh.userData.isBarrier = true;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        scene.add(mesh);
    };

    // Foundation
    const foundation = createFoundationSlab(houseWidth, houseDepth, 0.2);
    addPart(foundation);

    // Back wall
    const backWall = createExteriorWall(houseWidth, wallHeight, wallThickness);
    backWall.position.set(0, wallHeight / 2, -houseDepth / 2 + wallThickness / 2);
    addPart(backWall);

    // Left wall
    const leftWall = createExteriorWall(houseDepth, wallHeight, wallThickness);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-houseWidth / 2 + wallThickness / 2, wallHeight / 2, 0);
    addPart(leftWall);
    
    // Right wall
    const rightWall = createExteriorWall(houseDepth, wallHeight, wallThickness);
    rightWall.rotation.y = Math.PI / 2;
    rightWall.position.set(houseWidth / 2 - wallThickness / 2, wallHeight / 2, 0);
    addPart(rightWall);

    // Front wall (with doorway)
    const sideWallWidth = (houseWidth - doorWidth) / 2;

    const frontWallLeft = createExteriorWall(sideWallWidth, wallHeight, wallThickness);
    frontWallLeft.position.set(-doorWidth/2 - sideWallWidth/2, wallHeight/2, houseDepth/2 - wallThickness/2);
    addPart(frontWallLeft);
    
    const frontWallRight = createExteriorWall(sideWallWidth, wallHeight, wallThickness);
    frontWallRight.position.set(doorWidth/2 + sideWallWidth/2, wallHeight/2, houseDepth/2 - wallThickness/2);
    addPart(frontWallRight);
    
    // Lintel above door
    const lintelHeight = wallHeight - doorHeight;
    const lintel = createExteriorWall(doorWidth, lintelHeight, wallThickness);
    lintel.position.set(0, doorHeight + lintelHeight/2, houseDepth/2 - wallThickness/2);
    addPart(lintel);

    // Roof
    const roofGroup = createRoofGable(houseWidth + 0.5, 1.2, houseDepth + 0.5);
    roofGroup.position.y = wallHeight;
    roofGroup.position.add(housePosition);
    roofGroup.updateWorldMatrix(true, true);

    const roofMeshes = [];
    roofGroup.traverse(child => {
        if(child.isMesh) {
            roofMeshes.push(child);
        }
    });

    roofMeshes.forEach(mesh => {
        scene.attach(mesh);
        mesh.userData.isBarrier = true;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
    });
}