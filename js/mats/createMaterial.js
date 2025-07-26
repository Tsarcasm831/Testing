import * as THREE from 'three';
import { AssetReplacementManager } from '../assetReplacementManager.js';

/* @tweakable The base URL for PBR texture assets. This is now deprecated as assets are preloaded. */
const TEXTURE_BASE_URL = '';

/**
 * Creates a PBR material from preloaded texture assets.
 * @param {string} assetNamePrefix - The prefix for asset names, e.g., 'wood'.
 * @param {number} repeatU - Horizontal texture repetition.
 * @param {number} repeatV - Vertical texture repetition.
 * @param {AssetReplacementManager} assetManager - The asset manager containing preloaded textures.
 * @returns {THREE.MeshStandardMaterial} The created material.
 */
export function createMaterial(assetNamePrefix, repeatU = 1, repeatV = 1, assetManager = null) {
  if (!assetManager) {
    console.warn(`AssetManager not provided for material '${assetNamePrefix}'. Falling back to placeholder.`);
    return new THREE.MeshStandardMaterial({ color: 0xcccccc });
  }

  const textureTypes = {
    map: 'albedo texture',
    normalMap: 'normal texture',
    roughnessMap: 'roughness texture',
    aoMap: 'ao texture',
  };

  const materialProps = {};

  for (const [prop, suffix] of Object.entries(textureTypes)) {
    const assetName = `${assetNamePrefix} ${suffix}`;
    const texture = assetManager.getTexture(assetName);
    if (texture) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(repeatU, repeatV);
      materialProps[prop] = texture;
    }
  }

  const material = new THREE.MeshStandardMaterial(materialProps);
  
  /* @tweakable Fallback color for materials if textures are missing from the preloaded assets. */
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = 'varying vec2 vUv;\n' + shader.vertexShader;
    shader.fragmentShader = 'varying vec2 vUv;\n' + shader.fragmentShader;

    shader.vertexShader = shader.vertexShader.replace(
      '#include <uv_vertex>',
      `
      #include <uv_vertex>
      vUv = uv;
      `
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <map_fragment>',
      `
      #if defined(USE_MAP)
        vec4 texelColor = texture2D(map, vUv);
        // A simple check if the texture is loaded can be done on alpha, but it's not foolproof.
        // If the texture is missing, it might be transparent black.
        if (texelColor.a < 0.1 && texelColor.r < 0.1 && texelColor.g < 0.1 && texelColor.b < 0.1) {
            texelColor = vec4(0.5, 0.5, 0.5, 1.0); // Fallback to gray
        }
        diffuseColor *= texelColor;
      #endif
      `
    );
  };
  
  return material;
}