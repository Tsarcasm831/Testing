import * as THREE from 'three';
import SimplexNoise from 'simplex-noise';
import BiomeManager from '../scenes/BiomeManager';

/**
 * Generates terrain meshes with biome-based height and textures.
 */
class TerrainGenerator {
  constructor() {
    this.simplex = new SimplexNoise();
    this.biomeManager = new BiomeManager();
  }

  /**
   * Create a chunk mesh at the given chunk coordinates.
   * @param {number} x
   * @param {number} z
   * @returns {THREE.Mesh}
   */
  generateChunk(x, z) {
    const chunkSize = 16;
    const geometry = new THREE.PlaneGeometry(chunkSize, chunkSize, 32, 32);
    const biome = this.biomeManager.getBiomeAt(x, z);
    const material = new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader().load(biome.texture),
    });

    const position = geometry.attributes.position;
    for (let i = 0; i < position.count; i++) {
      const worldX = x * chunkSize + position.getX(i);
      const worldZ = z * chunkSize + position.getZ(i);
      const height = this.simplex.noise2D(worldX / 10, worldZ / 10) * biome.heightScale;
      position.setY(i, height);
    }

    geometry.computeVertexNormals();
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(x * chunkSize, 0, z * chunkSize);

    this.biomeManager.populateChunk(mesh, x, z);
    return mesh;
  }
}

export default TerrainGenerator;
