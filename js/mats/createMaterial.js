import * as THREE from 'three';

/**
 * Creates a PBR material from preloaded texture assets.
 * @param {string} assetNamePrefix - The prefix for asset names, e.g., 'wood'.
 * @param {number} repeatU - Horizontal texture repetition.
 * @param {number} repeatV - Vertical texture repetition.
 * @param {import('../assetReplacementManager.js').AssetReplacementManager} assetManager - The asset manager containing preloaded textures.
 * @returns {Promise<THREE.MeshStandardMaterial>} The created material.
 */
export async function createMaterial(assetNamePrefix, repeatU = 1, repeatV = 1, assetManager = null) {
  if (!assetManager) {
    console.warn(`AssetManager not provided for material '${assetNamePrefix}'. Falling back to placeholder.`);
    return new THREE.MeshStandardMaterial({ color: 0xcccccc });
  }

  const textureTypes = {
    map: 'albedo texture',
    normalMap: 'normal texture',
    roughnessMap: 'roughness texture',
    aoMap: 'ao texture',
    metalnessMap: 'metalness texture',
    heightMap: 'height texture',
  };

  const materialProps = {};

  const texturePromises = Object.entries(textureTypes).map(async ([prop, suffix]) => {
    const assetName = `${assetNamePrefix} ${suffix}`;
    // Check if asset exists before trying to load
    if (assetManager.assets && assetManager.assets[assetName]) {
        try {
            const texture = await assetManager.getTexture(assetName);
            if (texture) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(repeatU, repeatV);
                materialProps[prop] = texture;
            }
        } catch(e) {
            console.warn(`Could not load texture ${assetName}`, e);
        }
    }
  });

  await Promise.all(texturePromises);

  const material = new THREE.MeshStandardMaterial(materialProps);
  
  /* @tweakable Fallback color for materials if textures are missing from the preloaded assets. */
  const fallbackColor = new THREE.Color(0xcccccc);
  if (!materialProps.map) {
      material.color = fallbackColor;
  }
  
  return material;
}