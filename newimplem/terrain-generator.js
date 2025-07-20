import { createNoise3D } from 'simplex-noise';
import { WORLD_HEIGHT } from './config.js';

const noise3D = createNoise3D(() => 0.5); // Use a fixed seed for consistency

// Fractional Brownian Motion for natural-looking terrain
function fbm(x, z, octaves, persistence, lacunarity, scale, seedOffset = 0) {
    let total = 0;
    let frequency = 1.0;
    let amplitude = 1.0;
    let maxValue = 0;

    for (let i = 0; i < octaves; i++) {
        total += noise3D(x * frequency / scale, z * frequency / scale, seedOffset + i) * amplitude;
        maxValue += amplitude;
        amplitude *= persistence;
        frequency *= lacunarity;
    }

    return (total / maxValue); // Output in [-1, 1]
}

// Ridged noise for mountain ranges
function ridgedNoise(x, z, octaves, persistence, lacunarity, scale, seedOffset = 0) {
    let n = fbm(x, z, octaves, persistence, lacunarity, scale, seedOffset);
    return 1.0 - Math.abs(n);
}

// Domain warping - distorts coordinates using noise
function domainWarp(x, z, scale, amplitude, seedOffset) {
    const qx = fbm(x, z, 2, 0.5, 2.0, scale, seedOffset);
    const qz = fbm(x, z, 2, 0.5, 2.0, scale, seedOffset + 1);
    return {
        x: x + qx * amplitude,
        z: z + qz * amplitude
    };
}

// Smoothly blend between values
function smoothMix(a, b, t) {
    const easedT = t * t * (3.0 - 2.0 * t);
    return a * (1.0 - easedT) + b * easedT;
}

// A standard smoothstep function
function smoothstep(edge0, edge1, x) {
    const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
    return t * t * (3.0 - 2.0 * t);
}

export function getHeight(worldX, worldZ) {
    // --- 1. Large-scale continental/ocean definition ---
    const continentNoise = (fbm(worldX, worldZ, 4, 0.5, 2.0, 3000, 10) + 1) / 2; // [0, 1], larger scale

    // --- 2. Biome definition noises ---
    const warpedForBiome = domainWarp(worldX, worldZ, 800, 300, 20);
    const temperatureNoise = (fbm(warpedForBiome.x, warpedForBiome.z, 4, 0.5, 2.0, 2000, 30) + 1) / 2; // [0, 1]
    const moistureNoise = (fbm(worldX, worldZ, 5, 0.5, 2.0, 1500, 100) + 1) / 2; // [0, 1]

    // --- 3. Define terrain feature contributions ---
    
    // Plains/Desert: Gentle rolling terrain
    const plains = fbm(worldX, worldZ, 6, 0.5, 2.0, 400, 0) * 0.1;
    
    // Badlands/Mesa: a stepped, hilly terrain
    const warpedForBadlands = domainWarp(worldX, worldZ, 600, 200, 110);
    const badlandsBase = fbm(warpedForBadlands.x, warpedForBadlands.z, 3, 0.6, 2.5, 500, 120);
    const badlandsSteppes = Math.floor(badlandsBase * 10.0) / 10.0; // Create plateaus
    const badlands = badlandsSteppes * 0.5;

    // Hills/Forests: More pronounced rolling terrain
    const hills = fbm(worldX, worldZ, 8, 0.45, 2.1, 800, 40) * 0.4;

    // Mountains: A combination of a large, bulky base and sharp, ridged peaks
    const warpedForMountains = domainWarp(worldX, worldZ, 1200, 500, 50);
    const mountainBase = fbm(warpedForMountains.x, warpedForMountains.z, 6, 0.5, 2.0, 2200, 60);
    const mountainPeaks = ridgedNoise(warpedForMountains.x, warpedForMountains.z, 8, 0.52, 2.2, 1600, 70);
    const mountains = (mountainBase * 0.4 + mountainPeaks * 0.6);

    // Dense Forest: More rugged hills than normal forests
    const denseForestHills = fbm(worldX, worldZ, 8, 0.48, 2.0, 700, 140) * 0.6;

    // --- 4. Blend terrain features based on biome ---
    let height;
    const biome = getBiome(worldX, worldZ, -1); // Pass dummy height to get biome type

    // Determine base height by temperature
    if (biome === 'Tundra') {
        height = plains;
    } else if (biome === 'Forest' || biome === 'Grassy Plains' || biome === 'Rolling Hills' || biome === 'Jungle') {
        height = hills;
    } else if (biome === 'Dense Forest') {
        height = denseForestHills;
    } else if (biome === 'Desert') {
        height = plains;
    } else if (biome === 'Badlands') {
        height = badlands;
    } else { // Taiga and others
        height = smoothMix(plains, hills, smoothstep(0.3, 1.0, moistureNoise));
    }
    
    // Blend in mountains at high temperature points, overriding other features
    const mountainBlend = smoothstep(0.65, 0.9, temperatureNoise);
    height = smoothMix(height, mountains, mountainBlend);


    // --- 5. Apply continental scale and add water features ---
    const baseHeight = height;

    // Scale height by continent noise to form landmasses
    const continentShape = smoothMix(0.1, 1.0, continentNoise * continentNoise);
    height = height * continentShape;

    // Carve out lakes in lower, non-mountainous areas
    const lakeNoise = (fbm(worldX, worldZ, 4, 0.5, 2.0, 700, 80) + 1) / 2;
    if (baseHeight < 0.2 && continentNoise > 0.4) {
        const lakeT = Math.pow(Math.max(0, 1.0 - lakeNoise / 0.35), 2.5);
        if (lakeT > 0) {
            height = smoothMix(height, -0.2, lakeT); // Dig down to create lakebed
        }
    }

    // --- 6. Final scaling and spawn area adjustment ---
    height = height * WORLD_HEIGHT * 1.5;
    height += 5; // Lower the whole world to create a global water level, adjusted for lower water

    // Ensure spawn area is a relatively flat and safe island
    const dist = Math.sqrt(worldX * worldX + worldZ * worldZ);
    const flattenRadius = 200;
    if (dist < flattenRadius) {
        const flattenFactor = Math.pow(1.0 - dist / flattenRadius, 1.5);
        const islandHeight = 2; // a bit above water level
        height = height * (1.0 - flattenFactor) + flattenFactor * islandHeight;
    }

    return height;
}

export function getBiome(worldX, worldZ, height) {
    const warpedForBiome = domainWarp(worldX, worldZ, 800, 300, 20);
    const temperatureNoise = (fbm(warpedForBiome.x, warpedForBiome.z, 4, 0.5, 2.0, 2000, 30) + 1) / 2; // [0, 1]
    const moistureNoise = (fbm(worldX, worldZ, 5, 0.5, 2.0, 1500, 100) + 1) / 2; // [0, 1]
    
    // If height is not provided (or a dummy value is passed), calculate it.
    if (height === undefined || height === -1) {
        // Avoid calling getHeight here to prevent infinite recursion if getBiome is called from getHeight
    } else {
        // Water Biomes (Height-based)
        if (height <= -35) return 'Ocean';
        if (height < -21) return 'Shallows';
        if (height < -19.5) return 'Sandy Beach';
        
        // Peak Biome (Height-based)
        if (height > 110) return 'Snowy Peak';
    }


    // Land Biomes (Temperature & Moisture based)
    if (temperatureNoise < 0.35) { // Cold
        if (moistureNoise < 0.4) return 'Tundra';
        return 'Taiga';
    } 
    else if (temperatureNoise < 0.65) { // Temperate
        if (moistureNoise < 0.3) return 'Grassy Plains';
        if (moistureNoise < 0.6) return 'Forest';
        if (moistureNoise < 0.8) return 'Dense Forest';
        return 'Rolling Hills';
    }
    else { // Hot
        if (moistureNoise < 0.3) return 'Desert';
        if (moistureNoise < 0.5) return 'Badlands';
        return 'Jungle';
    }
}

export function getColor(height, color) {
    // Add noise to color transitions for a more natural look
    const colorNoise = noise3D(height * 2, height * 5, 0) * 4;
    const noisyHeight = height + colorNoise;

    if (noisyHeight < -15) { // Deep Water
        color.set(0x0a2f51);
    } else if (noisyHeight < 0) { // Shallow Water
        color.set(0x0e5a8a);
    } else if (noisyHeight < 5) { // Sand/Beach
        color.set(0xedd8ae);
    } else if (noisyHeight < 45) { // Grass
        color.set(0x5a8a0e);
    } else if (noisyHeight < 65) { // Dirt/Low Rock
        color.set(0x8a6f50);
    } else if (noisyHeight < 90) { // Rock
        color.set(0x7d7d7d);
    } else { // Snow
        color.set(0xffffff);
    }
}