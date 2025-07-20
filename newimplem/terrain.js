import * as THREE from 'three';
import { CHUNK_SIZE, WORLD_HEIGHT, RENDER_DISTANCE } from './config.js';
import { Chunk } from './chunk.js';
import { createTerrainMaterial } from './materials/terrain-material.js';
import { createGrassMaterial } from './grass.js';
import { createRockMaterial } from './rocks.js';
import { createScatterRockMaterial } from './scatter-rocks.js';
import { createPalmTrunkMaterial, createPalmLeafMaterial, createAspenTrunkMaterial, createAspenLeafMaterial, createPineTrunkMaterial, createPineLeafMaterial, createOakTrunkMaterial, createOakLeafMaterial } from './materials/tree-materials.js';

export class Terrain {
    constructor(scene, loadedAssets, sky) {
        this.scene = scene;
        this.chunks = new Map();
        this.chunkGroup = new THREE.Group();
        this.scene.add(this.chunkGroup);
        this.worldSize = 4000; // in chunks (e.g., 4000x4000)
        this.material = createTerrainMaterial(loadedAssets, sky);
        this.grassMaterial = createGrassMaterial(loadedAssets, sky);
        this.rockMaterial = createRockMaterial(loadedAssets, sky);
        this.scatterRockMaterial = createScatterRockMaterial(loadedAssets, sky);
        this.palmTrunkMaterial = createPalmTrunkMaterial(loadedAssets, sky);
        this.palmLeafMaterial = createPalmLeafMaterial(loadedAssets, sky);
        this.aspenTrunkMaterial = createAspenTrunkMaterial(loadedAssets, sky);
        this.aspenLeafMaterial = createAspenLeafMaterial(loadedAssets, sky);
        this.pineTrunkMaterial = createPineTrunkMaterial(loadedAssets, sky);
        this.pineLeafMaterial = createPineLeafMaterial(loadedAssets, sky);
        this.oakTrunkMaterial = createOakTrunkMaterial(loadedAssets, sky);
        this.oakLeafMaterial = createOakLeafMaterial(loadedAssets, sky);
        this.specialObjects = {};
    }

    setSpecialObjects(objects) {
        this.specialObjects = objects;
    }

    preloadInitialChunks(playerPosition, onComplete) {
        const playerChunkX = Math.floor(playerPosition.x / CHUNK_SIZE);
        const playerChunkZ = Math.floor(playerPosition.z / CHUNK_SIZE);
        const halfSize = Math.floor(this.worldSize / 2);

        let chunksToGenerate = 0;
        let chunksGenerated = 0;

        for (let x = playerChunkX - RENDER_DISTANCE; x <= playerChunkX + RENDER_DISTANCE; x++) {
            for (let z = playerChunkZ - RENDER_DISTANCE; z <= playerChunkZ + RENDER_DISTANCE; z++) {
                if (Math.abs(x) < halfSize && Math.abs(z) < halfSize) {
                    chunksToGenerate++;
                }
            }
        }
        
        const processChunk = (x, z) => {
            if (Math.abs(x) >= halfSize || Math.abs(z) >= halfSize) {
                if (++chunksGenerated >= chunksToGenerate && onComplete) {
                    onComplete();
                }
                return;
            }

            const chunkId = `${x},${z}`;
            if (!this.chunks.has(chunkId)) {
                const newChunk = new Chunk(x, z, this.material, this.grassMaterial, this.rockMaterial, this.scatterRockMaterial, this.palmTrunkMaterial, this.palmLeafMaterial, this.aspenTrunkMaterial, this.aspenLeafMaterial, this.pineTrunkMaterial, this.pineLeafMaterial, this.oakTrunkMaterial, this.oakLeafMaterial, this.specialObjects);
                this.chunks.set(chunkId, newChunk);
                this.chunkGroup.add(newChunk.group);
            }
            if (++chunksGenerated >= chunksToGenerate && onComplete) {
                onComplete();
            }
        }
        
        if (chunksToGenerate === 0) {
            onComplete();
            return;
        }

        for (let x = playerChunkX - RENDER_DISTANCE; x <= playerChunkX + RENDER_DISTANCE; x++) {
            for (let z = playerChunkZ - RENDER_DISTANCE; z <= playerChunkZ + RENDER_DISTANCE; z++) {
                processChunk(x, z);
            }
        }
    }

    getChunk(chunkX, chunkZ) {
        return this.chunks.get(`${chunkX},${chunkZ}`);
    }

    update(playerPosition) {
        const playerChunkX = Math.floor(playerPosition.x / CHUNK_SIZE);
        const playerChunkZ = Math.floor(playerPosition.z / CHUNK_SIZE);
        const halfSize = Math.floor(this.worldSize / 2);

        // Load chunks
        for (let x = playerChunkX - RENDER_DISTANCE; x <= playerChunkX + RENDER_DISTANCE; x++) {
            for (let z = playerChunkZ - RENDER_DISTANCE; z <= playerChunkZ + RENDER_DISTANCE; z++) {
                if (Math.abs(x) < halfSize && Math.abs(z) < halfSize) {
                    const chunkId = `${x},${z}`;
                    if (!this.chunks.has(chunkId)) {
                        const newChunk = new Chunk(x, z, this.material, this.grassMaterial, this.rockMaterial, this.scatterRockMaterial, this.palmTrunkMaterial, this.palmLeafMaterial, this.aspenTrunkMaterial, this.aspenLeafMaterial, this.pineTrunkMaterial, this.pineLeafMaterial, this.oakTrunkMaterial, this.oakLeafMaterial, this.specialObjects);
                        this.chunks.set(chunkId, newChunk);
                        this.chunkGroup.add(newChunk.group);
                    }
                }
            }
        }

        // Unload chunks
        for (const [chunkId, chunk] of this.chunks.entries()) {
            const [x, z] = chunkId.split(',').map(Number);
            const dx = x - playerChunkX;
            const dz = z - playerChunkZ;
            const distance = Math.sqrt(dx*dx + dz*dz);
            if (distance > RENDER_DISTANCE + 2) { // Unload chunks a bit further out
                this.chunkGroup.remove(chunk.group);
                chunk.dispose();
                this.chunks.delete(chunkId);
            }
        }
    }
}