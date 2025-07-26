import * as THREE from 'three';

/* @tweakable The base URL for PBR texture assets. Set to "" to use local relative paths. */
const TEXTURE_BASE_URL = '';

export function createMaterial(textureDir, repeatU = 1, repeatV = 1, assetManager = null) {
  const loader = new THREE.TextureLoader();
  const fullTextureDir = `${TEXTURE_BASE_URL}${textureDir}`;
  
  const onLoad = () => {};
  const onProgress = () => {};
  const onError = (err) => {
    console.error(`Failed to load texture from ${err.path}. Using fallback color.`);
  };
  
  const textures = {
    map: loader.load(`${fullTextureDir}albedo.png`, onLoad, onProgress, (err) => onError({path: `${fullTextureDir}albedo.png`})),
    normalMap: loader.load(`${fullTextureDir}normal.png`, onLoad, onProgress, (err) => onError({path: `${fullTextureDir}normal.png`})),
    roughnessMap: loader.load(`${fullTextureDir}roughness.png`, onLoad, onProgress, (err) => onError({path: `${fullTextureDir}roughness.png`})),
    aoMap: loader.load(`${fullTextureDir}ao.png`, onLoad, onProgress, (err) => onError({path: `${fullTextureDir}ao.png`})),
  };

  for (const tex of Object.values(textures)) {
    if (tex) {
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(repeatU, repeatV);
    }
  }
  const material = new THREE.MeshStandardMaterial(textures);
  /* @tweakable Fallback color for materials if textures fail to load. */
  material.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <map_fragment>',
      `
      #if defined(USE_MAP)
        vec4 texelColor = texture2D(map, vUv);
        // If texture is black (likely failed to load), use a fallback color.
        if (all(equal(texelColor.rgb, vec3(0.0)))) {
            texelColor = vec4(0.5, 0.5, 0.5, 1.0); // Fallback to gray
        }
        diffuseColor *= texelColor;
      #endif
      `
    );
  };
  return material;
}