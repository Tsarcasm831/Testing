import * as THREE from 'three';
import { CHUNK_SIZE } from './config.js';
import { getHeight, getColor, getBiome } from './terrain-generator.js';
import { generateGrassMeshForChunk } from './generators/grass-generator.js';
import { generateRockMeshesForChunk, generateScatterRockMeshForChunk } from './generators/rock-generator.js';
import { generateTreeMeshesForChunk } from './generators/tree-generator.js';

export class Chunk {
    constructor(chunkX, chunkZ, terrainMaterial, grassMaterial, rockMaterial, scatterRockMaterial, palmTrunkMaterial, palmLeafMaterial, aspenTrunkMaterial, aspenLeafMaterial, pineTrunkMaterial, pineLeafMaterial, oakTrunkMaterial, oakLeafMaterial, specialObjects) {
        this.chunkX = chunkX;
        this.chunkZ = chunkZ;

        this.group = new THREE.Group();
        this.group.position.set(this.chunkX * CHUNK_SIZE, 0, this.chunkZ * CHUNK_SIZE);

        this.terrainMesh = this._generateTerrainMesh(terrainMaterial);
        if (this.terrainMesh) {
            this.group.add(this.terrainMesh);
        }

        // Add special objects if they belong to this chunk
        this._addSpecialObjects(specialObjects);

        this.grassMesh = generateGrassMeshForChunk(this.terrainMesh, grassMaterial, this.chunkX, this.chunkZ);
        if (this.grassMesh) {
            this.group.add(this.grassMesh);
        }

        this.rockMeshes = generateRockMeshesForChunk(this.chunkX, this.chunkZ, this.terrainMesh, rockMaterial);
        if (this.rockMeshes) {
            this.rockMeshes.forEach(mesh => this.group.add(mesh));
        }

        this.scatterRockMesh = generateScatterRockMeshForChunk(this.chunkX, this.chunkZ, this.terrainMesh, scatterRockMaterial);
        if (this.scatterRockMesh) {
            this.group.add(this.scatterRockMesh);
        }

        this.treeMeshes = generateTreeMeshesForChunk(this.chunkX, this.chunkZ, this.terrainMesh, palmTrunkMaterial, palmLeafMaterial, aspenTrunkMaterial, aspenLeafMaterial, pineTrunkMaterial, pineLeafMaterial, oakTrunkMaterial, oakLeafMaterial);
        if (this.treeMeshes.palmTrunkMesh) {
            this.group.add(this.treeMeshes.palmTrunkMesh);
        }
        if (this.treeMeshes.palmLeafMesh) {
            this.group.add(this.treeMeshes.palmLeafMesh);
        }
        if (this.treeMeshes.aspenTrunkMesh) {
            this.group.add(this.treeMeshes.aspenTrunkMesh);
        }
        if (this.treeMeshes.aspenLeafMesh) {
            this.group.add(this.treeMeshes.aspenLeafMesh);
        }
        if (this.treeMeshes.pineTrunkMesh) {
            this.group.add(this.treeMeshes.pineTrunkMesh);
        }
        if (this.treeMeshes.pineLeafMesh) {
            this.group.add(this.treeMeshes.pineLeafMesh);
        }
        if (this.treeMeshes.oakTrunkMesh) {
            this.group.add(this.treeMeshes.oakTrunkMesh);
        }
        if (this.treeMeshes.oakLeafMesh) {
            this.group.add(this.treeMeshes.oakLeafMesh);
        }
    }

    _addSpecialObjects(specialObjects) {
        // Concrete slab for lordtsarcasm spawn point
        if (specialObjects.concrete_slab) {
            const slabPos = new THREE.Vector3(141.0, 9.5, -41.0);
            const slabChunkX = Math.floor(slabPos.x / CHUNK_SIZE);
            const slabChunkZ = Math.floor(slabPos.z / CHUNK_SIZE);

            if (this.chunkX === slabChunkX && this.chunkZ === slabChunkZ) {
                const slab = specialObjects.concrete_slab;
                // Position is relative to the chunk's origin
                const localX = slabPos.x - this.chunkX * CHUNK_SIZE;
                const localY = slabPos.y;
                const localZ = slabPos.z - this.chunkZ * CHUNK_SIZE;
                slab.position.set(localX, localY, localZ);
                this.group.add(slab);
            }
        }

        // Stage
        if (specialObjects.stage) {
            const stagePos = specialObjects.stage.position.clone();
            const stageChunkX = Math.floor(stagePos.x / CHUNK_SIZE);
            const stageChunkZ = Math.floor(stagePos.z / CHUNK_SIZE);

            if (this.chunkX === stageChunkX && this.chunkZ === stageChunkZ) {
                const stage = specialObjects.stage;
                const localX = stagePos.x - this.chunkX * CHUNK_SIZE;
                const localY = stagePos.y;
                const localZ = stagePos.z - this.chunkZ * CHUNK_SIZE;
                stage.position.set(localX, localY, localZ);
                this.group.add(stage);
            }
        }
    }

    _generateTerrainMesh(material) {
        const geometry = new THREE.PlaneGeometry(CHUNK_SIZE, CHUNK_SIZE, CHUNK_SIZE - 1, CHUNK_SIZE - 1);
        geometry.rotateX(-Math.PI / 2);

        const positions = geometry.attributes.position;
        const colors = [];
        const color = new THREE.Color();

        for (let i = 0; i < positions.count; i++) {
            const worldX = positions.getX(i) + this.chunkX * CHUNK_SIZE;
            const worldZ = positions.getZ(i) + this.chunkZ * CHUNK_SIZE;

            const y = getHeight(worldX, worldZ);
            positions.setY(i, y);

            // Vertex colors are no longer used for the final look, but can be useful for debugging
            getColor(y, color);
            colors.push(color.r, color.g, color.b);
        }
        
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geometry.computeVertexNormals();

        const chunkMesh = new THREE.Mesh(geometry, material);
        chunkMesh.name = 'terrain'; // Add a name for collision detection
        chunkMesh.receiveShadow = true;
        chunkMesh.castShadow = true;
        
        return chunkMesh;
    }

    dispose() {
        if (this.terrainMesh) {
            this.terrainMesh.geometry.dispose();
        }
        if (this.grassMesh) {
            this.grassMesh.geometry.dispose();
        }
        if (this.rockMeshes) {
            this.rockMeshes.forEach(mesh => {
                // Geometries are static and shared, so we don't dispose them here.
                // The InstancedMesh itself will be GC'd.
            });
        }
        if (this.scatterRockMesh) {
            this.scatterRockMesh.geometry.dispose();
        }
        if (this.treeMeshes) {
            if (this.treeMeshes.palmTrunkMesh) {
                // Geometry is shared
            }
            if (this.treeMeshes.palmLeafMesh) {
                // Geometry is shared
            }
            if (this.treeMeshes.aspenTrunkMesh) {
                // Geometry is shared
            }
            if (this.treeMeshes.aspenLeafMesh) {
                // Geometry is shared
            }
            if (this.treeMeshes.pineTrunkMesh) {
                // Geometry is shared
            }
            if (this.treeMeshes.pineLeafMesh) {
                // Geometry is shared
            }
            if (this.treeMeshes.oakTrunkMesh) {
                // Geometry is shared
            }
            if (this.treeMeshes.oakLeafMesh) {
                // Geometry is shared
            }
        }
    }
}