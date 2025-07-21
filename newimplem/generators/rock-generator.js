import * as THREE from 'three';
import { CHUNK_SIZE } from '../config.js';
import { getBiome } from '../terrain-generator.js';
import { settings } from '../settings.js';
import { deterministicRandom } from '../utils.js';

let rockGeometries = [];

function createRockGeometries() {
    if (rockGeometries.length > 0) return rockGeometries;

    // Rock Type 1: Boulder (original) - Reduced complexity for performance
    const geo1 = new THREE.IcosahedronGeometry(1, 1); // Subdivisions reduced from 2 to 1
    const pos1 = geo1.attributes.position;
    const norm1 = geo1.attributes.normal;
    for (let i = 0; i < pos1.count; i++) {
        const p = new THREE.Vector3().fromBufferAttribute(pos1, i);
        const n = new THREE.Vector3().fromBufferAttribute(norm1, i);
        const noise = 0.3 * (Math.sin(p.x * 5) * Math.cos(p.y * 5) + Math.sin(p.y * 5) * Math.cos(p.z * 5) + Math.sin(p.z * 5) * Math.cos(p.x * 5));
        p.add(n.multiplyScalar(noise));
        pos1.setXYZ(i, p.x, p.y, p.z);
    }
    geo1.computeVertexNormals();
    rockGeometries.push(geo1);

    // Rock Type 2: Spire
    const geo2 = new THREE.CylinderGeometry(0.3, 1, 5, 8, 3);
    const pos2 = geo2.attributes.position;
    for (let i = 0; i < pos2.count; i++) {
        const p = new THREE.Vector3().fromBufferAttribute(pos2, i);
        const noise = 0.2 * (Math.sin(p.x * 3 + p.y * 0.5) + Math.cos(p.z * 3));
        p.x += noise;
        p.z += noise;
        if (p.y > 0) p.y += Math.sin(p.y * 2) * 0.3; // Taper noise
        pos2.setXYZ(i, p.x, p.y, p.z);
    }
    geo2.computeVertexNormals();
    rockGeometries.push(geo2);

    // Rock Type 3: Flat Slab
    const geo3 = new THREE.BoxGeometry(2.5, 0.5, 3.5, 5, 1, 5);
    const pos3 = geo3.attributes.position;
    for (let i = 0; i < pos3.count; i++) {
        const p = new THREE.Vector3().fromBufferAttribute(pos3, i);
        const noise = 0.15 * Math.sin(p.x * 2) * Math.cos(p.z * 2);
        p.y += noise;
        pos3.setXYZ(i, p.x, p.y, p.z);
    }
    geo3.computeVertexNormals();
    rockGeometries.push(geo3);

    // Rock Type 4: Small & Rounded
    const geo4 = new THREE.SphereGeometry(0.8, 8, 6);
    const pos4 = geo4.attributes.position;
    for (let i = 0; i < pos4.count; i++) {
        const p = new THREE.Vector3().fromBufferAttribute(pos4, i);
        const noise = 0.2 * Math.sin(p.x * 6) * Math.cos(p.y * 6) * Math.sin(p.z * 6);
        p.addScaledVector(p.clone().normalize(), noise);
        pos4.setXYZ(i, p.x, p.y, p.z);
    }
    geo4.computeVertexNormals();
    rockGeometries.push(geo4);

    // Rock Type 5: Jagged/Sharp
    const geo5 = new THREE.IcosahedronGeometry(1.2, 1);
    const pos5 = geo5.attributes.position;
    for (let i = 0; i < pos5.count; i++) {
        const p = new THREE.Vector3().fromBufferAttribute(pos5, i);
         if (Math.random() > 0.5) {
            p.multiplyScalar(1 + (Math.random() - 0.5) * 0.8);
        }
        pos5.setXYZ(i, p.x, p.y, p.z);
    }
    geo5.computeVertexNormals();
    rockGeometries.push(geo5);

    return rockGeometries;
}


export function generateRockMeshesForChunk(chunkX, chunkZ, terrainMesh, material) {
    if (!terrainMesh) return [];

    const geoms = createRockGeometries();
    const terrainPositions = terrainMesh.geometry.attributes.position;
    const terrainNormals = terrainMesh.geometry.attributes.normal;
    const dummy = new THREE.Object3D();

    const instanceLists = Array.from({ length: geoms.length }, () => []);

    const ROCK_DENSITY = settings.get('rockDensity');
    
    // OPTIMIZATION: Instead of iterating every terrain vertex, make a fixed number of attempts.
    const numVertices = terrainPositions.count;
    const attempts = Math.floor(CHUNK_SIZE * CHUNK_SIZE * ROCK_DENSITY * 3); // Based on area, not vertices

    for (let j = 0; j < attempts; j++) {
        // Pick a random vertex to try placing a rock on
        const i = Math.floor(deterministicRandom(chunkX * 100 + j, chunkZ * 100 - j) * numVertices);
        
        const y = terrainPositions.getY(i);
        const normalY = terrainNormals.getY(i);
        const slope = 1.0 - normalY;
        
        const worldX = terrainPositions.getX(i) + chunkX * CHUNK_SIZE;
        const worldZ = terrainPositions.getZ(i) + chunkZ * CHUNK_SIZE;
        // OPTIMIZATION: Pass the known height to getBiome to avoid recalculation.
        const biome = getBiome(worldX, worldZ, y);
        
        const isRockyBiome = biome === 'Snowy Peak' || biome === 'Rolling Hills' || biome === 'Badlands' || biome === 'Taiga' || biome === 'Forest';
        const isGoodSlope = slope > 0.2 && slope < 0.7;
        const isAboveWater = y > -18.0;

        // Check for concrete slab area
        const onSlab = worldX >= 121.0 && worldX <= 161.0 && worldZ >= -91.0 && worldZ <= 9.0;
        
        // Place rocks in biomes that should have them, on steep-ish slopes, and above water.
        if (isRockyBiome && isGoodSlope && isAboveWater && !onSlab) {
            let spawnChance = 0.4; // Base chance

            // In biomes that are not primarily rock, reduce spawn chance
            if (biome === 'Taiga' || biome === 'Forest') {
                spawnChance = 0.15;
            }
            
            // Increase spawn chance at higher, rockier altitudes
            if (y > 60) {
                 spawnChance *= 2.0;
            }

            if (deterministicRandom(worldX, worldZ) < spawnChance) {
                const rockTypeIndex = Math.floor(deterministicRandom(worldX + 1, worldZ - 1) * geoms.length);
            
                dummy.position.set(
                    terrainPositions.getX(i),
                    y - 0.2, 
                    terrainPositions.getZ(i)
                );
                dummy.rotation.x = deterministicRandom(worldX + 1, worldZ) * Math.PI;
                dummy.rotation.y = deterministicRandom(worldX, worldZ + 1) * Math.PI;
                dummy.rotation.z = deterministicRandom(worldX - 1, worldZ - 1) * Math.PI;
                
                const scaleRnd = deterministicRandom(worldX, worldZ - 1);
                const scale = 1.2 + scaleRnd * 1.8;
                dummy.scale.set(scale, scale * (0.8 + deterministicRandom(worldX + 1, worldZ + 1) * 0.4), scale);
                
                dummy.updateMatrix();
                instanceLists[rockTypeIndex].push(dummy.matrix.clone());
            }
        }
    }

    const meshes = [];
    for (let i = 0; i < geoms.length; i++) {
        const instances = instanceLists[i];
        if (instances.length > 0) {
            const geometry = geoms[i];
            const mesh = new THREE.InstancedMesh(geometry, material, instances.length);
            for (let j = 0; j < instances.length; j++) {
                mesh.setMatrixAt(j, instances[j]);
            }
            mesh.instanceMatrix.needsUpdate = true;
            mesh.receiveShadow = true;
            mesh.castShadow = true;
            mesh.name = 'rock';
            meshes.push(mesh);
        }
    }
    
    return meshes;
}

// Storing the geometry so it's only created once.
let scatterRockGeometry = null;

function createScatterRockGeometry() {
    if (scatterRockGeometry) return scatterRockGeometry;

    const geo = new THREE.IcosahedronGeometry(0.5, 1);
    const pos = geo.attributes.position;
    const norm = geo.attributes.normal;
    for (let i = 0; i < pos.count; i++) {
        const p = new THREE.Vector3().fromBufferAttribute(pos, i);
        const n = new THREE.Vector3().fromBufferAttribute(norm, i);
        const noise = 0.2 * (Math.sin(p.x * 8) * Math.cos(p.y * 8) + Math.cos(p.z * 8));
        p.add(n.multiplyScalar(noise));
        pos.setXYZ(i, p.x, p.y, p.z);
    }
    geo.computeVertexNormals();
    scatterRockGeometry = geo;
    return scatterRockGeometry;
}


export function generateScatterRockMeshForChunk(chunkX, chunkZ, terrainMesh, material) {
    if (!terrainMesh || !material) return null;

    const terrainPositions = terrainMesh.geometry.attributes.position;
    const terrainNormals = terrainMesh.geometry.attributes.normal;
    const dummy = new THREE.Object3D();
    const instances = [];

    const DENSITY = settings.get('scatterRockDensity');
    const SCALE = 1.5; // Adjusted scale for 3D model

    const numVertices = terrainPositions.count;
    const attempts = Math.floor(CHUNK_SIZE * CHUNK_SIZE * DENSITY * 2);

    for (let j = 0; j < attempts; j++) {
        const i = Math.floor(deterministicRandom(chunkX * 100 + j * 0.1, chunkZ * 100 - j * 0.1) * numVertices);
        
        const y = terrainPositions.getY(i);
        const normal = new THREE.Vector3(terrainNormals.getX(i), terrainNormals.getY(i), terrainNormals.getZ(i));
        const slope = 1.0 - normal.y;
        
        const worldX = terrainPositions.getX(i) + chunkX * CHUNK_SIZE;
        const worldZ = terrainPositions.getZ(i) + chunkZ * CHUNK_SIZE;
        // OPTIMIZATION: Pass the known height to getBiome to avoid recalculation.
        const biome = getBiome(worldX, worldZ, y);
        
        // Check for concrete slab area
        const onSlab = worldX >= 121.0 && worldX <= 161.0 && worldZ >= -91.0 && worldZ <= 9.0;

        // Place in rocky areas, but on flatter parts than the big rocks
        if ((biome === 'Snowy Peak' || biome === 'Rolling Hills' || biome === 'Grassy Plains' || biome === 'Desert' || biome === 'Badlands') && slope < 0.5 && y > -19.0 && !onSlab) {
            dummy.position.set(
                terrainPositions.getX(i),
                y, 
                terrainPositions.getZ(i)
            );
            
            // Random rotations
            dummy.rotation.x = deterministicRandom(worldX + 1, worldZ) * Math.PI;
            dummy.rotation.y = deterministicRandom(worldX, worldZ + 1) * Math.PI;
            dummy.rotation.z = deterministicRandom(worldX - 1, worldZ - 1) * Math.PI;
            
            const scaleRnd = deterministicRandom(worldX + 1, worldZ - 1);
            const scale = SCALE * (0.8 + scaleRnd * 0.4);
            dummy.scale.set(scale, scale, scale);
            
            dummy.updateMatrix();
            instances.push(dummy.matrix.clone());
        }
    }
    
    if (instances.length === 0) return null;

    const geometry = createScatterRockGeometry();
    
    const mesh = new THREE.InstancedMesh(geometry, material, instances.length);
    for(let i = 0; i < instances.length; i++) {
        mesh.setMatrixAt(i, instances[i]);
    }
    mesh.instanceMatrix.needsUpdate = true;
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    mesh.name = 'scatter_rock';
    
    return mesh;
}