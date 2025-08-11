import * as THREE from 'three';

export const terrainFiles = {
    grass: 'grass_texture.png',
    sand: 'sand_texture.png',
    dirt: 'dirt_path_texture.png',
    rocky: 'rocky_ground_texture.png',
    snow: 'snow_texture.png',
    forest: 'forest_floor_texture.png',
};

// Biome list (ensure we use every available terrain)
const BIOMES = ['grass', 'sand', 'dirt', 'rocky', 'snow', 'forest'];

// Expose world dimensions to other modules (e.g., minimap)
export const WORLD_SIZE = 3000;
export const TILE_SIZE = 200;
// In scene, textures repeat tileSize/20 times, so one texture image covers 20 world units.
export const TEXTURE_WORLD_UNITS = 20;

// Module-scoped seeds to be populated on scene init so other systems (minimap) can query the same layout
let biomeSeedsRef = null;
// NEW: exact per-tile biome map for precise queries
let biomeTileMapRef = null;
let numTilesRef = null;

// Helper to generate biome seeds that partition the world into organic regions.
// We guarantee at least one seed per biome, then add more random seeds with weighted choices.
function generateBiomeSeeds(worldSize, extraSeeds = 18) {
    const half = worldSize / 2;

    // Create one seed per biome
    const seeds = BIOMES.map((biome, i) => ({
        x: (Math.random() * worldSize) - half,
        z: (Math.random() * worldSize) - half,
        biome
    }));

    // Distribution to keep variety: grass and forest a bit more common, others balanced
    const weightedBiomes = [
        'grass','grass','grass',
        'forest','forest',
        'sand','sand',
        'rocky','rocky',
        'dirt',
        'snow'
    ];

    for (let i = 0; i < extraSeeds; i++) {
        seeds.push({
            x: (Math.random() * worldSize) - half,
            z: (Math.random() * worldSize) - half,
            biome: weightedBiomes[Math.floor(Math.random() * weightedBiomes.length)]
        });
    }

    return seeds;
}

function nearestBiomeAt(x, z, seeds) {
    let best = null;
    let bestDist = Infinity;
    for (let i = 0; i < seeds.length; i++) {
        const dx = x - seeds[i].x;
        const dz = z - seeds[i].z;
        const d2 = dx * dx + dz * dz;
        if (d2 < bestDist) {
            bestDist = d2;
            best = seeds[i].biome;
        }
    }
    return best || 'grass';
}

// Public: query biome under a world position using the same layout as the 3D terrain
export function getBiomeAt(x, z) {
    // For now, force the entire world to be grass
    return 'grass';
}

// Public: get the terrain texture filename for a biome
export function getTerrainTextureForBiome(biome) {
    return terrainFiles[biome] || terrainFiles.grass;
}

export function createTerrain(scene, settings) {
    const textureLoader = new THREE.TextureLoader();
    const worldSize = WORLD_SIZE;
    const tileSize = TILE_SIZE;
    const numTiles = worldSize / tileSize;
    const textureRepeat = tileSize / TEXTURE_WORLD_UNITS;

    // Preload only grass material (all ground is grass for now)
    const grassTexture = textureLoader.load(terrainFiles.grass);
    grassTexture.wrapS = THREE.RepeatWrapping;
    grassTexture.wrapT = THREE.RepeatWrapping;
    grassTexture.repeat.set(textureRepeat, textureRepeat);
    const grassMaterial = new THREE.MeshLambertMaterial({ map: grassTexture });

    // Since we're locking to grass, we don't need biome seeds
    biomeSeedsRef = null;

    // Build exact per-tile biome map as 'grass' for all tiles
    biomeTileMapRef = Array.from({ length: numTiles }, () => new Array(numTiles).fill('grass'));
    numTilesRef = numTiles;

    const groundContainer = new THREE.Group();
    scene.add(groundContainer);

    const groundGeometry = new THREE.PlaneGeometry(tileSize, tileSize);

    for (let i = 0; i < numTiles; i++) {
        for (let j = 0; j < numTiles; j++) {
            const x = (i - numTiles / 2) * tileSize + tileSize / 2;
            const z = (j - numTiles / 2) * tileSize + tileSize / 2;

            const groundTile = new THREE.Mesh(groundGeometry, grassMaterial);
            groundTile.position.set(x, 0, z);
            groundTile.rotation.x = -Math.PI / 2;
            groundTile.receiveShadow = settings.shadows;
            groundContainer.add(groundTile);
        }
    }

    return { groundContainer, worldSize };
}