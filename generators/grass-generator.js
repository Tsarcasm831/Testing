import * as THREE from 'three';
import { MathRandom } from '../js/worldgen/random.js';
import { WATER_LEVEL } from '../js/worldgen/constants.js';

/* @tweakable The number of grass instances to generate. Higher numbers can impact performance. */
const GRASS_COUNT = 50000;
/* @tweakable The base color of the grass blades. */
const GRASS_BASE_COLOR = 0x338833;
/* @tweakable How much color can vary. A value of 0.4 means lightness can vary by +/- 20%. */
const GRASS_COLOR_VARIATION = 0.4;
/* @tweakable The minimum height of a grass blade. */
const MIN_GRASS_HEIGHT = 0.4;
/* @tweakable The maximum height of a grass blade. */
const MAX_GRASS_HEIGHT = 1.0;
/* @tweakable The width of a single grass blade geometry. This is scaled randomly per instance. */
const BLADE_WIDTH = 0.1;
/* @tweakable The base height of a single grass blade geometry (used for geometry, scaled later). */
const BLADE_HEIGHT = 1.0;
/* @tweakable How much the top of the grass blade is narrower than the bottom. 0 is rectangular, 1 is a triangle. */
const BLADE_TAPER = 0.8;
/* @tweakable How much the grass blade bends forward, creating a curve. */
const BLADE_BEND = 0.3;
/* @tweakable The minimum random scale to apply to a blade's width. */
const MIN_BLADE_WIDTH_SCALE = 0.7;
/* @tweakable The maximum random scale to apply to a blade's width. */
const MAX_BLADE_WIDTH_SCALE = 1.3;
/* @tweakable The strength of the wind effect on the grass. */
const WIND_STRENGTH = 0.1;
/* @tweakable The speed of the wind effect on the grass. */
const WIND_SPEED = 1.5;

/* @tweakable The minimum X coordinate for grass generation. */
const MIN_X = 48.75;
/* @tweakable The maximum X coordinate for grass generation. */
const MAX_X = 51.25;
/* @tweakable The minimum Z coordinate for grass generation. */
const MIN_Z = 23.75;
/* @tweakable The maximum Z coordinate for grass generation. */
const MAX_Z = 26.25;

// Simple noise for clumping.
function createDensityNoise() {
    /* @tweakable Scale of the grass clumps. Smaller values create larger clumps. */
    const noiseScale = 0.05;
    /* @tweakable Number of noise layers. More layers create more detailed clumps but can be slower. */
    const octaves = 4;
    
    let maxAmplitude = 0;
    let amp = 1;
    for (let i = 0; i < octaves; i++) {
        maxAmplitude += amp;
        amp *= 0.5;
    }

    return (x, z) => {
        let value = 0;
        let amplitude = 1;
        let frequency = noiseScale;
        for (let i = 0; i < octaves; i++) {
            // Using sin and cos for simple noise
            value += Math.sin(z * frequency) * Math.cos(x * frequency) * amplitude;
            amplitude *= 0.5;
            frequency *= 2.0;
        }
        return (value + maxAmplitude) / (2 * maxAmplitude); // Normalize to [0, 1]
    };
}

export function createGrass(scene, terrain) {
    if (!terrain || !terrain.userData.getHeight) {
        console.error("Grass generator requires terrain with a getHeight function.");
        return;
    }

    const textureLoader = new THREE.TextureLoader();
    const grassTexture = textureLoader.load('grass_texture.png');

    const grassMaterial = new THREE.MeshStandardMaterial({
        map: grassTexture,
        side: THREE.DoubleSide,
        roughness: 0.8,
        metalness: 0.1,
        transparent: true,
        /* @tweakable This value is the alpha threshold for rendering grass. Pixels with alpha below this value won't be rendered. This helps with performance and sorting issues for transparent objects. */
        alphaTest: 0.5,
        /* @tweakable This enables writing to the depth buffer for transparent objects, which is crucial for correct occlusion and preventing visual glitches. */
        depthWrite: true,
    });

    grassMaterial.userData.uniforms = {
        time: { value: 0 },
        bladeHeight: { value: BLADE_HEIGHT },
        windStrength: { value: WIND_STRENGTH },
        windSpeed: { value: WIND_SPEED },
    };

    grassMaterial.onBeforeCompile = shader => {
        shader.uniforms.time = grassMaterial.userData.uniforms.time;
        shader.uniforms.bladeHeight = grassMaterial.userData.uniforms.bladeHeight;
        shader.uniforms.windStrength = grassMaterial.userData.uniforms.windStrength;
        shader.uniforms.windSpeed = grassMaterial.userData.uniforms.windSpeed;

        shader.vertexShader = `
            uniform float time;
            uniform float bladeHeight;
            uniform float windStrength;
            uniform float windSpeed;
            ` + shader.vertexShader;
        
        shader.vertexShader = shader.vertexShader.replace(
            '#include <begin_vertex>',
            `
            #include <begin_vertex>
            
            vec4 instancePosition = instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
            float windX = sin(time * windSpeed + instancePosition.z * 0.5) * windStrength;
            float windZ = cos(time * windSpeed + instancePosition.x * 0.5) * windStrength;
            
            float bendFactor = position.y / bladeHeight;
            transformed.x += windX * bendFactor;
            transformed.z += windZ * bendFactor;
            `
        );
    };

    const bladeGeometry = new THREE.BufferGeometry();
    const halfWidth = BLADE_WIDTH / 2;
    const topWidth = halfWidth * (1 - BLADE_TAPER);

    const vertices = new Float32Array([
        // Plane 1 (along X axis)
        -halfWidth, 0, 0,
         halfWidth, 0, 0,
        -topWidth,  BLADE_HEIGHT, BLADE_BEND,
         topWidth,  BLADE_HEIGHT, BLADE_BEND,

        // Plane 2 (along Z axis)
         0, 0, -halfWidth,
         0, 0,  halfWidth,
         BLADE_BEND, BLADE_HEIGHT, -topWidth,
         BLADE_BEND, BLADE_HEIGHT,  topWidth,
    ]);

    const uvs = new Float32Array([
        0, 0, 1, 0, 0, 1, 1, 1,
        0, 0, 1, 0, 0, 1, 1, 1,
    ]);

    const indices = new Uint16Array([
        0, 1, 2,  1, 3, 2,
        4, 5, 6,  5, 7, 6,
    ]);

    bladeGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    bladeGeometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    bladeGeometry.setIndex(new THREE.BufferAttribute(indices, 1));
    bladeGeometry.computeVertexNormals();

    const instancedGrass = new THREE.InstancedMesh(bladeGeometry, grassMaterial, GRASS_COUNT);
    instancedGrass.castShadow = true;
    
    const grassSeed = 42;
    const rng = new MathRandom(grassSeed);
    const densityNoise = createDensityNoise();

    /* @tweakable The radius of the main grassland area where grass can grow. */
    const GRASS_AREA_RADIUS = 80.0;
    
    let placedCount = 0;
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    
    // Attempt to place GRASS_COUNT blades, with a limit on attempts to avoid infinite loops
    for (let i = 0; i < GRASS_COUNT * 5 && placedCount < GRASS_COUNT; i++) {
        const angle = rng.random() * Math.PI * 2;
        const radius = Math.sqrt(rng.random()) * GRASS_AREA_RADIUS; // Uniform distribution in a circle
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        if (terrain.userData.isWater && terrain.userData.isWater(x, z)) {
            continue;
        }

        const density = densityNoise(x, z);

        /* @tweakable A threshold to control overall grass coverage. Higher values mean less grass. Range 0-1. */
        const COVERAGE_THRESHOLD = 0.45;
        if (density < COVERAGE_THRESHOLD) {
            continue;
        }

        /* @tweakable Controls how clumpy the grass is. Higher values create denser, more separated clumps. */
        const CLUMPINESS = 2.0;
        const spawnProbability = Math.pow((density - COVERAGE_THRESHOLD) / (1.0 - COVERAGE_THRESHOLD), CLUMPINESS);
        
        if (rng.random() > spawnProbability) {
            continue;
        }
        
        const y = terrain.userData.getHeight(x, z);
        
        /* @tweakable The maximum slope for grass to grow on. Lower values mean grass only on flatter areas. */
        const slopeThreshold = 0.7; 
        const dx = terrain.userData.getHeight(x + 0.1, z) - y;
        const dz = terrain.userData.getHeight(x, z + 0.1) - y;
        const slope = Math.sqrt(dx*dx + dz*dz);
        if (slope > slopeThreshold) {
            continue;
        }

        dummy.position.set(x, y, z);
        
        dummy.rotation.y = rng.random() * Math.PI * 2;
        
        const scaleX = MIN_BLADE_WIDTH_SCALE + rng.random() * (MAX_BLADE_WIDTH_SCALE - MIN_BLADE_WIDTH_SCALE);
        const scaleY = (MIN_GRASS_HEIGHT + rng.random() * (MAX_GRASS_HEIGHT - MIN_GRASS_HEIGHT)) / BLADE_HEIGHT;
        dummy.scale.set(scaleX, scaleY, 1);
        
        dummy.updateMatrix();
        instancedGrass.setMatrixAt(placedCount, dummy.matrix);

        color.setHex(GRASS_BASE_COLOR);
        const lightnessVariation = 1.0 - (GRASS_COLOR_VARIATION / 2) + (rng.random() * GRASS_COLOR_VARIATION);
        color.multiplyScalar(lightnessVariation);
        instancedGrass.setColorAt(placedCount, color);

        placedCount++;
    }
    
    instancedGrass.count = placedCount;
    instancedGrass.instanceMatrix.needsUpdate = true;
    instancedGrass.instanceColor.needsUpdate = true;
    scene.add(instancedGrass);
    return instancedGrass;
}