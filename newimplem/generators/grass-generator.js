import * as THREE from 'three';
import { settings } from '../settings.js';
import { getBiome } from '../terrain-generator.js';
import { CHUNK_SIZE } from '../config.js';
import { deterministicRandom } from '../utils.js';

export function generateGrassMeshForChunk(terrainMesh, material, chunkX, chunkZ) {
    if (!terrainMesh) return null;

    const terrainPositions = terrainMesh.geometry.attributes.position;
    const terrainNormals = terrainMesh.geometry.attributes.normal;
    const instances = [];
    const dummy = new THREE.Object3D();

    const GRASS_DENSITY = settings.get('grassDensity');
    const GRASS_HEIGHT = 1.2;
    const GRASS_WIDTH = 1.2;

    const numVertices = terrainPositions.count;
    // OPTIMIZATION: Base attempts on chunk area and density, not vertex count.
    const attempts = Math.floor(CHUNK_SIZE * CHUNK_SIZE * GRASS_DENSITY * 10);

    for (let j = 0; j < attempts; j++) {
        const i = Math.floor(deterministicRandom(chunkX * 100 + j, chunkZ * 100 - j) * numVertices);
        
        const y = terrainPositions.getY(i);
        const normalY = terrainNormals.getY(i);
        const slope = 1.0 - normalY;

        const worldX = terrainPositions.getX(i) + chunkX * 32; // CHUNK_SIZE
        const worldZ = terrainPositions.getZ(i) + chunkZ * 32;
        // OPTIMIZATION: Pass the known height to getBiome to avoid recalculation.
        const biome = getBiome(worldX, worldZ, y);
        
        const isGrassyBiome = biome === 'Grassy Plains' || biome === 'Forest' || biome === 'Rolling Hills' || biome === 'Jungle';
        
        // Check for concrete slab area
        const onSlab = worldX >= 121.0 && worldX <= 161.0 && worldZ >= -91.0 && worldZ <= 9.0;

        // Place grass in valid biomes, on dirt/grass, and on gentle slopes.
        if (isGrassyBiome && y > -19.0 && slope < 0.45 && !onSlab) {
            dummy.position.set(
                terrainPositions.getX(i),
                y,
                terrainPositions.getZ(i)
            );
            dummy.rotation.y = deterministicRandom(worldX, worldZ) * Math.PI * 2;
            const scaleRnd = deterministicRandom(worldX + 1, worldZ - 1);
            const scale = 0.8 + scaleRnd * 0.7;
            dummy.scale.set(scale, scale, scale);
            dummy.updateMatrix();
            instances.push(dummy.matrix.clone());
        }
    }

    if (instances.length === 0) return null;

    const geometry = new THREE.PlaneGeometry(GRASS_WIDTH, GRASS_HEIGHT);
    geometry.translate(0, GRASS_HEIGHT / 2, 0); // anchor at bottom center
    
    // Add a second plane for a "crossed" or "3D" look
    const crossGeo = new THREE.PlaneGeometry(GRASS_WIDTH, GRASS_HEIGHT);
    crossGeo.rotateY(Math.PI / 2);
    crossGeo.translate(0, GRASS_HEIGHT / 2, 0);
    
    geometry.computeVertexNormals();
    crossGeo.computeVertexNormals();

    const mergedGeometry = new THREE.BufferGeometry();
    const positionsArr = new Float32Array([...geometry.attributes.position.array, ...crossGeo.attributes.position.array]);
    const uvsArr = new Float32Array([...geometry.attributes.uv.array, ...crossGeo.attributes.uv.array]);
    const normalsArr = new Float32Array([...geometry.attributes.normal.array, ...crossGeo.attributes.normal.array]);
    mergedGeometry.setAttribute('position', new THREE.BufferAttribute(positionsArr, 3));
    mergedGeometry.setAttribute('uv', new THREE.BufferAttribute(uvsArr, 2));
    mergedGeometry.setAttribute('normal', new THREE.BufferAttribute(normalsArr, 3));


    const mesh = new THREE.InstancedMesh(mergedGeometry, material, instances.length);
    for(let i = 0; i < instances.length; i++) {
        mesh.setMatrixAt(i, instances[i]);
    }
    mesh.instanceMatrix.needsUpdate = true;
    mesh.receiveShadow = true;
    
    return mesh;
}