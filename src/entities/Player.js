import * as THREE from 'three';

class Player {
  constructor() {
    this.position = new THREE.Vector3(0, 0.5, 0);
    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    this.mesh.position.copy(this.position);
    this.health = 100;
  }

  update() {
    // Movement logic placeholder
  }
}

export default Player;
