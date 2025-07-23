import * as THREE from 'three';
import {
  CLUSTER_SIZE,
  ZONES_PER_CHUNK_SIDE,
  CHUNKS_PER_CLUSTER_SIDE,
  TERRAIN_SEGMENTS,
  TERRAIN_TEXTURE_REPEAT_PER_ZONE,
  TERRAIN_AMPLITUDE,
  TERRAIN_SCALE,
  GROUND_TEXTURE_FILENAME
} from './constants.js';

/* @tweakable The width of the blend between biomes. Higher values create a smoother transition. */
const BIOME_BLEND_WIDTH = 40.0;
/* @tweakable The starting height for stone to appear in the dirt/stone biome. */
const STONE_START_HEIGHT = 2.0;
/* @tweakable The height range over which stone fully replaces dirt. */
const STONE_TRANSITION_HEIGHT = 8.0;
/* @tweakable The radius of the central grass biome before it starts blending into other biomes. */
const GRASS_RADIUS = 80.0;
/* @tweakable The width of the blend from the central grass biome to other biomes. */
const GRASS_BLEND_WIDTH = 20.0;

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
  const textures = {
      grass: textureLoader.load('ground_texture.png'),
      sand: textureLoader.load('ground_texture_sand.png'),
      dirt: textureLoader.load('ground_texture_dirt.png'),
      stone: textureLoader.load('ground_texture_stone.png'),
      snow: textureLoader.load('ground_texture_snow.png'),
      forest: textureLoader.load('ground_texture_forest.png')
  };

  const totalZonesSide = ZONES_PER_CHUNK_SIDE * CHUNKS_PER_CLUSTER_SIDE;
  const repeatValue = TERRAIN_TEXTURE_REPEAT_PER_ZONE * totalZonesSide;

  for (const key in textures) {
      // HACK: To prevent CORS issues with textures on some browsers,
      // we set crossOrigin to 'anonymous'
      if (textures[key].image) {
          // If image is already loaded (from cache)
          textures[key].image.crossOrigin = "anonymous";
      } else {
          // If image is not yet loaded
          const originalOnLoad = textures[key].onLoad;
          textures[key].onLoad = (image) => {
              if(originalOnLoad) originalOnLoad(image);
              image.crossOrigin = "anonymous";
          };
      }
      textures[key].wrapS = THREE.RepeatWrapping;
      textures[key].wrapT = THREE.RepeatWrapping;
      textures[key].repeat.set(repeatValue, repeatValue);
  }

  const material = new THREE.MeshStandardMaterial({
    map: textures.grass,
    roughness: 0.8,
    metalness: 0.2
  });

  material.onBeforeCompile = shader => {
      shader.uniforms.sandTexture = { value: textures.sand };
      shader.uniforms.snowTexture = { value: textures.snow };
      shader.uniforms.forestTexture = { value: textures.forest };
      shader.uniforms.dirtTexture = { value: textures.dirt };
      shader.uniforms.stoneTexture = { value: textures.stone };
      /* @tweakable The width of the blend between biomes. Higher values create a smoother transition. */
      shader.uniforms.blendWidth = { value: BIOME_BLEND_WIDTH };
      shader.uniforms.stoneStartHeight = { value: STONE_START_HEIGHT };
      shader.uniforms.stoneTransitionHeight = { value: STONE_TRANSITION_HEIGHT };
      shader.uniforms.grassRadius = { value: GRASS_RADIUS };
      shader.uniforms.grassBlendWidth = { value: GRASS_BLEND_WIDTH };
      /* @tweakable The overall scale of the terrain textures. Smaller values make textures larger. */
      shader.uniforms.textureScale = { value: 0.2 };

      shader.vertexShader = 'varying vec3 vWorldPosition;\n' + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace(
          '#include <worldpos_vertex>',
          `
          #include <worldpos_vertex>
          vWorldPosition = worldPosition.xyz;
          `
      );

      shader.fragmentShader = 'varying vec3 vWorldPosition;\n' +
          'uniform sampler2D sandTexture;\n' +
          'uniform sampler2D snowTexture;\n' +
          'uniform sampler2D forestTexture;\n' +
          'uniform sampler2D dirtTexture;\n' +
          'uniform sampler2D stoneTexture;\n' +
          'uniform float blendWidth;\n' +
          'uniform float stoneStartHeight;\n' +
          'uniform float stoneTransitionHeight;\n' +
          'uniform float grassRadius;\n' +
          'uniform float grassBlendWidth;\n' +
          'uniform float textureScale;\n' +
          `
          /* @tweakable The scale of the noise used for blending biomes. Smaller values create larger patterns. */
          const float NOISE_SCALE = 0.015;
          /* @tweakable The sharpness of the blend between biomes. Higher values create sharper edges. */
          const float BLEND_SHARPNESS = 1.5;

          // 2D Random function
          float random(vec2 st) {
              return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
          }

          // 2D Noise function
          float noise(vec2 st) {
              vec2 i = floor(st);
              vec2 f = fract(st);

              // Four corners in 2D of a tile
              float a = random(i);
              float b = random(i + vec2(1.0, 0.0));
              float c = random(i + vec2(0.0, 1.0));
              float d = random(i + vec2(1.0, 1.0));

              vec2 u = f * f * (3.0 - 2.0 * f);
              return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.y * u.x;
          }

          // Fractional Brownian Motion
          float fbm(vec2 st) {
              float value = 0.0;
              float amplitude = 0.5;
              for (int i = 0; i < 4; i++) {
                  value += amplitude * noise(st);
                  st *= 2.0;
                  amplitude *= 0.5;
              }
              return value;
          }
          
          vec4 triplanarTexture(sampler2D tex, vec3 worldPos, vec3 worldNormal) {
              vec3 blending = abs(worldNormal);
              blending = normalize(max(blending, 0.00001)); // Force weights to sum to 1.0
              blending /= (blending.x + blending.y + blending.z);

              vec2 uvX = worldPos.zy * textureScale;
              vec2 uvY = worldPos.xz * textureScale;
              vec2 uvZ = worldPos.xy * textureScale;

              vec4 texX = texture2D(tex, uvX);
              vec4 texY = texture2D(tex, uvY);
              vec4 texZ = texture2D(tex, uvZ);

              return texX * blending.x + texY * blending.y + texZ * blending.z;
          }
          ` +
          shader.fragmentShader;

      shader.fragmentShader = shader.fragmentShader.replace(
          '#include <map_fragment>',
          `
          vec4 texelColor = triplanarTexture(map, vWorldPosition, vNormal); // Base grass texture

          vec2 pos = vWorldPosition.xz;
          float height = vWorldPosition.y;

          vec4 sandColor = triplanarTexture(sandTexture, vWorldPosition, vNormal);
          vec4 snowColor = triplanarTexture(snowTexture, vWorldPosition, vNormal);
          vec4 forestColor = triplanarTexture(forestTexture, vWorldPosition, vNormal);
          vec4 dirtColor = triplanarTexture(dirtTexture, vWorldPosition, vNormal);
          vec4 stoneColor = triplanarTexture(stoneTexture, vWorldPosition, vNormal);
          
          float blendNoise = (fbm(pos * NOISE_SCALE) - 0.25) * blendWidth;

          // Bilinear interpolation between the 4 biome quadrants
          float w_x = smoothstep(-blendWidth + blendNoise, blendWidth + blendNoise, pos.x);
          float w_z = smoothstep(-blendWidth + blendNoise, blendWidth + blendNoise, pos.y);

          // Corrected Biome layout to match tree generation
          // Quadrant -- (x<0, z<0): Forest
          // Quadrant +- (x>0, z<0): Dirt/Stone
          // Quadrant -+ (x<0, z>0): Snow
          // Quadrant ++ (x>0, z>0): Sand
          
          float height_t = smoothstep(stoneStartHeight, stoneStartHeight + stoneTransitionHeight, height);
          vec4 dirtStoneColor = mix(dirtColor, stoneColor, height_t);

          vec4 neg_z_mix = mix(forestColor, dirtStoneColor, w_x); // bottom row: forest, dirt/stone
          vec4 pos_z_mix = mix(snowColor, sandColor, w_x);     // top row: snow, sand

          vec4 biome_color = mix(neg_z_mix, pos_z_mix, w_z);

          // Blend with grass in the center
          float center_dist = length(pos);
          float grass_weight = 1.0 - smoothstep(grassRadius - blendNoise, grassRadius + grassBlendWidth + blendNoise, center_dist);
          
          vec4 final_color = mix(biome_color, texelColor, pow(grass_weight, BLEND_SHARPNESS));

          diffuseColor *= final_color;
          `
      );
  };

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