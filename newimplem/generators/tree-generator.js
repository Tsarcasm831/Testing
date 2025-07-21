import * as THREE from 'three';
import { CHUNK_SIZE, WORLD_HEIGHT } from '../config.js';
import { getHeight, getBiome } from '../terrain-generator.js';
import { settings } from '../settings.js';
import { deterministicRandom } from '../utils.js';
import { 
    createPalmTreeGeometry, 
    createAspenTreeGeometry, 
    createPineTreeGeometry, 
    createOakTreeGeometry 
} from './tree-geometries.js';

export function generateTreeMeshesForChunk(chunkX, chunkZ, terrainMesh, palmTrunkMaterial, palmLeafMaterial, aspenTrunkMaterial, aspenLeafMaterial, pineTrunkMaterial, pineLeafMaterial, oakTrunkMaterial, oakLeafMaterial) {
    if (!terrainMesh) return {};

    const palmGeoms = createPalmTreeGeometry();
    const aspenGeoms = createAspenTreeGeometry();
    const pineGeoms = createPineTreeGeometry();
    const oakGeoms = createOakTreeGeometry();
    const dummy = new THREE.Object3D();

    const palmTrunkInstances = [];
    const palmLeafInstances = [];
    const aspenTrunkInstances = [];
    const aspenLeafInstances = [];
    const pineTrunkInstances = [];
    const pineLeafInstances = [];
    const oakTrunkInstances = [];
    const oakLeafInstances = [];

    const TREE_DENSITY = settings.get('treeDensity');
    
    const terrainPositions = terrainMesh.geometry.attributes.position;
    const terrainNormals = terrainMesh.geometry.attributes.normal;
    const numVertices = terrainPositions.count;

    // OPTIMIZATION: Base attempts on chunk area and density, not vertex count.
    const attempts = Math.floor(CHUNK_SIZE * CHUNK_SIZE * TREE_DENSITY * 2.5);

    for (let i = 0; i < attempts; i++) {
        // Pick a random vertex from the terrain mesh to try and place a tree on.
        const vertIndex = Math.floor(deterministicRandom(chunkX * 100 + i, chunkZ * 100) * numVertices);
        
        const localX = terrainPositions.getX(vertIndex);
        const y = terrainPositions.getY(vertIndex);
        const localZ = terrainPositions.getZ(vertIndex);
        
        const normalY = terrainNormals.getY(vertIndex);
        const slope = 1.0 - normalY;

        const worldX = localX + chunkX * CHUNK_SIZE;
        const worldZ = localZ + chunkZ * CHUNK_SIZE;
        // OPTIMIZATION: Pass the known height to getBiome to avoid recalculation.
        const biome = getBiome(worldX, worldZ, y);
        const rand = deterministicRandom(worldX, worldZ);
        
        const validSlope = slope < 0.45;
        const validHeight = y > -20.0 && y < 95.0;

        // Check for concrete slab area
        const onSlab = worldX >= 121.0 && worldX <= 161.0 && worldZ >= -91.0 && worldZ <= 9.0;

        if (validSlope && validHeight && !onSlab) {
             dummy.position.set(localX, y, localZ);
             dummy.rotation.y = deterministicRandom(worldX + 1, worldZ -1) * Math.PI * 2;
             const scaleRnd = deterministicRandom(worldX, worldZ + 1);
             let scale = 1.0;
             let placed = false;
             
             switch(biome) {
                case 'Jungle':
                case 'Sandy Beach':
                    scale = (biome === 'Jungle' ? 1.0 : 0.8) + scaleRnd * 0.6;
                    dummy.scale.set(scale, scale, scale);
                    dummy.updateMatrix();
                    palmTrunkInstances.push(dummy.matrix.clone());
                    palmLeafInstances.push(dummy.matrix.clone());
                    placed = true;
                    break;
                case 'Dense Forest':
                    scale = 0.9 + scaleRnd * 0.4;
                    dummy.scale.set(scale, scale, scale);
                    dummy.updateMatrix();
                    if(rand < 0.5) {
                        pineTrunkInstances.push(dummy.matrix.clone());
                        pineLeafInstances.push(dummy.matrix.clone());
                    } else {
                        oakTrunkInstances.push(dummy.matrix.clone());
                        oakLeafInstances.push(dummy.matrix.clone());
                    }
                    placed = true;
                    break;
                case 'Forest':
                    scale = 0.9 + scaleRnd * 0.5;
                    dummy.scale.set(scale, scale, scale);
                    dummy.updateMatrix();
                    if (rand < 0.4) {
                        pineTrunkInstances.push(dummy.matrix.clone());
                        pineLeafInstances.push(dummy.matrix.clone());
                    } else if (rand < 0.8) {
                        oakTrunkInstances.push(dummy.matrix.clone());
                        oakLeafInstances.push(dummy.matrix.clone());
                    } else {
                        aspenTrunkInstances.push(dummy.matrix.clone());
                        aspenLeafInstances.push(dummy.matrix.clone());
                    }
                    placed = true;
                    break;
                 case 'Taiga':
                    scale = 0.9 + scaleRnd * 0.6;
                    dummy.scale.set(scale, scale, scale);
                    dummy.updateMatrix();
                    if (rand < 0.7) {
                        pineTrunkInstances.push(dummy.matrix.clone());
                        pineLeafInstances.push(dummy.matrix.clone());
                    } else {
                        aspenTrunkInstances.push(dummy.matrix.clone());
                        aspenLeafInstances.push(dummy.matrix.clone());
                    }
                    placed = true;
                    break;
                case 'Rolling Hills':
                case 'Grassy Plains':
                     if (rand < 0.15) { // Sparsely populated
                        scale = 0.9 + scaleRnd * 0.5;
                        dummy.scale.set(scale, scale, scale);
                        dummy.updateMatrix();
                        if (rand < 0.07) {
                             oakTrunkInstances.push(dummy.matrix.clone());
                             oakLeafInstances.push(dummy.matrix.clone());
                        } else {
                             aspenTrunkInstances.push(dummy.matrix.clone());
                             aspenLeafInstances.push(dummy.matrix.clone());
                        }
                        placed = true;
                     }
                    break;
             }
        }
    }

    let palmTrunkMesh = null;
    if (palmTrunkInstances.length > 0) {
        palmTrunkMesh = new THREE.InstancedMesh(palmGeoms.trunk, palmTrunkMaterial, palmTrunkInstances.length);
        for (let j = 0; j < palmTrunkInstances.length; j++) {
            palmTrunkMesh.setMatrixAt(j, palmTrunkInstances[j]);
        }
        palmTrunkMesh.instanceMatrix.needsUpdate = true;
        palmTrunkMesh.receiveShadow = true;
        palmTrunkMesh.castShadow = true;
        palmTrunkMesh.name = 'palm_trunk';
    }

    let palmLeafMesh = null;
    if (palmLeafInstances.length > 0) {
        palmLeafMesh = new THREE.InstancedMesh(palmGeoms.leaves, palmLeafMaterial, palmLeafInstances.length);
        for (let j = 0; j < palmLeafInstances.length; j++) {
            palmLeafMesh.setMatrixAt(j, palmLeafInstances[j]);
        }
        palmLeafMesh.instanceMatrix.needsUpdate = true;
        palmLeafMesh.castShadow = true;
        palmLeafMesh.name = 'palm_leaf';
    }
    
    let aspenTrunkMesh = null;
    if (aspenTrunkInstances.length > 0) {
        aspenTrunkMesh = new THREE.InstancedMesh(aspenGeoms.trunk, aspenTrunkMaterial, aspenTrunkInstances.length);
        for (let j = 0; j < aspenTrunkInstances.length; j++) {
            aspenTrunkMesh.setMatrixAt(j, aspenTrunkInstances[j]);
        }
        aspenTrunkMesh.instanceMatrix.needsUpdate = true;
        aspenTrunkMesh.receiveShadow = true;
        aspenTrunkMesh.castShadow = true;
        aspenTrunkMesh.name = 'aspen_trunk';
    }

    let aspenLeafMesh = null;
    if (aspenLeafInstances.length > 0) {
        aspenLeafMesh = new THREE.InstancedMesh(aspenGeoms.leaves, aspenLeafMaterial, aspenLeafInstances.length);
        for (let j = 0; j < aspenLeafInstances.length; j++) {
            aspenLeafMesh.setMatrixAt(j, aspenLeafInstances[j]);
        }
        aspenLeafMesh.instanceMatrix.needsUpdate = true;
        aspenLeafMesh.castShadow = true;
        aspenLeafMesh.name = 'aspen_leaf';
    }

    let pineTrunkMesh = null;
    if (pineTrunkInstances.length > 0) {
        pineTrunkMesh = new THREE.InstancedMesh(pineGeoms.trunk, pineTrunkMaterial, pineTrunkInstances.length);
        for (let j = 0; j < pineTrunkInstances.length; j++) {
            pineTrunkMesh.setMatrixAt(j, pineTrunkInstances[j]);
        }
        pineTrunkMesh.instanceMatrix.needsUpdate = true;
        pineTrunkMesh.receiveShadow = true;
        pineTrunkMesh.castShadow = true;
        pineTrunkMesh.name = 'pine_trunk';
    }

    let pineLeafMesh = null;
    if (pineLeafInstances.length > 0) {
        pineLeafMesh = new THREE.InstancedMesh(pineGeoms.leaves, pineLeafMaterial, pineLeafInstances.length);
        for (let j = 0; j < pineLeafInstances.length; j++) {
            pineLeafMesh.setMatrixAt(j, pineLeafInstances[j]);
        }
        pineLeafMesh.instanceMatrix.needsUpdate = true;
        pineLeafMesh.castShadow = true;
        pineLeafMesh.name = 'pine_leaf';
    }

    let oakTrunkMesh = null;
    if (oakTrunkInstances.length > 0) {
        oakTrunkMesh = new THREE.InstancedMesh(oakGeoms.trunk, oakTrunkMaterial, oakTrunkInstances.length);
        for (let j = 0; j < oakTrunkInstances.length; j++) {
            oakTrunkMesh.setMatrixAt(j, oakTrunkInstances[j]);
        }
        oakTrunkMesh.instanceMatrix.needsUpdate = true;
        oakTrunkMesh.receiveShadow = true;
        oakTrunkMesh.castShadow = true;
        oakTrunkMesh.name = 'oak_trunk';
    }

    let oakLeafMesh = null;
    if (oakLeafInstances.length > 0) {
        oakLeafMesh = new THREE.InstancedMesh(oakGeoms.leaves, oakLeafMaterial, oakLeafInstances.length);
        for (let j = 0; j < oakLeafInstances.length; j++) {
            oakLeafMesh.setMatrixAt(j, oakLeafInstances[j]);
        }
        oakLeafMesh.instanceMatrix.needsUpdate = true;
        oakLeafMesh.castShadow = true;
        oakLeafMesh.name = 'oak_leaf';
    }

    return { palmTrunkMesh, palmLeafMesh, aspenTrunkMesh, aspenLeafMesh, pineTrunkMesh, pineLeafMesh, oakTrunkMesh, oakLeafMesh };
}