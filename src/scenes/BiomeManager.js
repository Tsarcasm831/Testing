import * as THREE from 'three';
import Tree from '../entities/Tree';
import Rock from '../entities/Rock';
import Animal from '../entities/Animal';
import SimplexNoise from 'simplex-noise';

/**
 * Manages biome selection and entity placement based on world position.
 */
class BiomeManager {
  constructor() {
    this.simplex = new SimplexNoise();
    this.biomes = {
      forest: { texture: 'assets/textures/grass.jpg', heightScale: 5, entities: [Tree, Rock, Animal] },
      desert: { texture: 'assets/textures/sand.jpg', heightScale: 2, entities: [Rock] },
      ocean: { texture: 'assets/textures/water.jpg', heightScale: 0.5, entities: [] },
    };
  }

  /**
   * Returns biome configuration for the given world coordinates.
   * @param {number} x
   * @param {number} z
   * @returns {object}
   */
  getBiomeAt(x, z) {
    const value = this.simplex.noise2D(x / 50, z / 50);
    if (value > 0.5) return this.biomes.forest;
    if (value > 0) return this.biomes.desert;
    return this.biomes.ocean;
  }

  /**
   * Populate a chunk with random entities for the biome at the given position.
   * @param {THREE.Object3D} chunk
   * @param {number} x
   * @param {number} z
   */
  populateChunk(chunk, x, z) {
    const biome = this.getBiomeAt(x, z);
    if (biome.entities.length === 0) return;
    for (let i = 0; i < 5; i++) {
      const EntityClass = biome.entities[Math.floor(Math.random() * biome.entities.length)];
      const pos = new THREE.Vector3(
        x * 16 + Math.random() * 16,
        0,
        z * 16 + Math.random() * 16
      );
      const entity = new EntityClass(pos);
      if (entity.mesh) {
        entity.mesh.userData.entity = entity;
        chunk.add(entity.mesh);
      }
    }
  }
}

export default BiomeManager;
