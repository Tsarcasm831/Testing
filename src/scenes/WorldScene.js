import TerrainGenerator from '../utils/terrainGenerator';
import Player from '../entities/Player';
import EntityManager from '../entities/EntityManager';

class WorldScene {
  constructor(scene) {
    this.scene = scene;
    this.terrainGenerator = new TerrainGenerator();
    this.entityManager = new EntityManager();
    this.player = new Player();
    this.chunks = new Map();

    this.scene.add(this.player.mesh);
    this.entityManager.addEntity(this.player);
    this.updateChunks();
  }

  updateChunks() {
    const chunkSize = 16;
    const renderDistance = 5;
    const playerChunkX = Math.floor(this.player.position.x / chunkSize);
    const playerChunkZ = Math.floor(this.player.position.z / chunkSize);

    for (const [key, chunk] of this.chunks) {
      const [x, z] = key.split(',').map(Number);
      if (Math.abs(x - playerChunkX) > renderDistance || Math.abs(z - playerChunkZ) > renderDistance) {
        this.scene.remove(chunk);
        this.chunks.delete(key);
      }
    }

    for (let x = -renderDistance; x <= renderDistance; x++) {
      for (let z = -renderDistance; z <= renderDistance; z++) {
        const chunkX = playerChunkX + x;
        const chunkZ = playerChunkZ + z;
        const key = `${chunkX},${chunkZ}`;
        if (!this.chunks.has(key)) {
          const chunk = this.terrainGenerator.generateChunk(chunkX, chunkZ);
          this.scene.add(chunk);
          this.chunks.set(key, chunk);
        }
      }
    }
  }

  update(delta) {
    this.player.update(delta);
    this.entityManager.update(delta);
    this.updateChunks();
  }
}

export default WorldScene;
