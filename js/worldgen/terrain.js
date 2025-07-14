import * as THREE from 'three';
import {
  CLUSTER_SIZE,
  ZONES_PER_CHUNK_SIDE,
  CHUNKS_PER_CLUSTER_SIDE,
  TERRAIN_SEGMENTS,
  TERRAIN_TEXTURE_REPEAT_PER_ZONE,
  TERRAIN_AMPLITUDE,
  TERRAIN_SCALE
} from './constants.js';

function simpleNoise(x, z) {
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
  groundTexture.repeat.set(
    TERRAIN_TEXTURE_REPEAT_PER_ZONE * totalZonesSide,
    TERRAIN_TEXTURE_REPEAT_PER_ZONE * totalZonesSide
  );

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
    const clampedX = Math.max(-terrainSize / 2, Math.min(terrainSize / 2, x));
    const clampedZ = Math.max(-terrainSize / 2, Math.min(terrainSize / 2, z));
    return simpleNoise(clampedX, clampedZ);
  };

  terrain.userData.getHeight = getHeight;
  return terrain;
}
