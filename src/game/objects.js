import * as THREE from 'three';

const geometries = [
    new THREE.BoxGeometry(5, 5, 5),
    new THREE.ConeGeometry(3, 8, 8),
    new THREE.SphereGeometry(3, 8, 8)
];
const materials = [0xFF6B6B, 0x4ECDC4, 0x45B7D1, 0x96CEB4, 0xFECA57].map(color => new THREE.MeshLambertMaterial({ color }));

export class ObjectGrid {
    constructor(worldSize, cellSize) {
        this.worldSize = worldSize;
        this.cellSize = cellSize;
        this.grid = {};
        this.halfWorldSize = worldSize / 2;
        this.numCells = Math.ceil(worldSize / cellSize);
    }

    _getGridCoords(position) {
        const x = Math.floor((position.x + this.halfWorldSize) / this.cellSize);
        const z = Math.floor((position.z + this.halfWorldSize) / this.cellSize);
        return { x, z };
    }

    _getKey(coords) {
        return `${coords.x},${coords.z}`;
    }

    add(object) {
        const coords = this._getGridCoords(object.position);
        const key = this._getKey(coords);
        if (!this.grid[key]) {
            this.grid[key] = [];
        }
        this.grid[key].push(object);
    }

    getObjectsNear(position, radius) {
        const centerCoords = this._getGridCoords(position);
        const cellRadius = Math.ceil(radius / this.cellSize);
        const nearbyObjects = new Set();

        for (let x = centerCoords.x - cellRadius; x <= centerCoords.x + cellRadius; x++) {
            for (let z = centerCoords.z - cellRadius; z <= centerCoords.z + cellRadius; z++) {
                const key = this._getKey({ x, z });
                if (this.grid[key]) {
                    this.grid[key].forEach(obj => nearbyObjects.add(obj));
                }
            }
        }
        return Array.from(nearbyObjects);
    }

    clear() {
        this.grid = {};
    }
}

// Create simplified geometries for LOD
const simpleGeometries = [
    new THREE.BoxGeometry(5, 5, 5, 1, 1, 1),
    new THREE.ConeGeometry(3, 8, 4),
    new THREE.SphereGeometry(3, 4, 3)
];

export function updateObjects(scene, currentObjects, settings) {
    // Remove old objects
    currentObjects.forEach(obj => scene.remove(obj));
    const newObjects = [];

    // Add new objects based on density
    const worldSize = 2000;
    const objectCountMap = { low: 15, medium: 50, high: 120 };
    const objectCount = objectCountMap[settings.objectDensity] || 50;
    
    const objectGrid = new ObjectGrid(worldSize, 200);

    for (let i = 0; i < objectCount; i++) {
        const material = materials[Math.floor(Math.random() * materials.length)];
        
        // Create LOD object
        const lod = new THREE.LOD();

        // High detail mesh
        const highDetailMesh = new THREE.Mesh(geometries[i % geometries.length], material);
        highDetailMesh.receiveShadow = true;
        highDetailMesh.castShadow = false; // Shadow managed dynamically
        lod.addLevel(highDetailMesh, 75);

        // Low detail mesh
        const lowDetailMesh = new THREE.Mesh(simpleGeometries[i % simpleGeometries.length], material);
        lowDetailMesh.receiveShadow = false;
        lowDetailMesh.castShadow = false;
        lod.addLevel(lowDetailMesh, 200);
        
        // No mesh visible beyond this distance
        // lod.addLevel(new THREE.Mesh(new THREE.BufferGeometry(), material), 500);

        lod.position.x = (Math.random() - 0.5) * (worldSize - 100);
        lod.position.z = (Math.random() - 0.5) * (worldSize - 100);
        lod.position.y = Math.random() * 5 + 2.5;

        // For the purpose of shadow management and grid, we treat the LOD itself as the object.
        // The dynamic shadow logic will access lod.children[0] (the high detail mesh).
        lod.castShadow = false; 
        lod.receiveShadow = true;

        scene.add(lod);
        newObjects.push(lod);
        objectGrid.add(lod);
    }

    return { objects: newObjects, grid: objectGrid };
}