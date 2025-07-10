import * as THREE from 'three';
import TerrainGenerator from '../utils/terrainGenerator';
import Player from '../entities/Player';
import EntityManager from '../entities/EntityManager';

class WorldScene {
  constructor(scene) {
    this.scene = scene;
    this.terrainGenerator = new TerrainGenerator();
    this.entityManager = new EntityManager();
    this.player = new Player();

    this.generateTerrain();
    this.scene.add(this.player.mesh);
    this.entityManager.addEntity(this.player);
  }

  generateTerrain() {
    const chunkSize = 16;
    const renderDistance = 5;
    for (let x = -renderDistance; x <= renderDistance; x++) {
      for (let z = -renderDistance; z <= renderDistance; z++) {
        const chunkX = Math.floor(this.player.position.x / chunkSize) + x;
        const chunkZ = Math.floor(this.player.position.z / chunkSize) + z;
        const chunk = this.terrainGenerator.generateChunk(chunkX, chunkZ);
        this.scene.add(chunk);
      }
    }
  }

  update() {
    this.player.update();
    this.entityManager.update();
  }
}

export default WorldScene;
