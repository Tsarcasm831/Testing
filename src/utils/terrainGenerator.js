import * as THREE from 'three';
import SimplexNoise from 'simplex-noise';

class TerrainGenerator {
  constructor() {
    this.simplex = new SimplexNoise();
  }

  generateChunk(x, z) {
    const chunkSize = 16;
    const geometry = new THREE.PlaneGeometry(chunkSize, chunkSize, 32, 32);
    const material = new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load('assets/textures/grass.jpg'),
    });

    for (let i = 0; i < geometry.vertices.length; i++) {
      const vertex = geometry.vertices[i];
      const worldX = x * chunkSize + vertex.x;
      const worldZ = z * chunkSize + vertex.z;
      vertex.y = this.simplex.noise2D(worldX / 10, worldZ / 10) * 5;
    }

    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(x * chunkSize, 0, z * chunkSize);
    return mesh;
  }
}

export default TerrainGenerator;
