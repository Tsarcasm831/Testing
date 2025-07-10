import * as THREE from 'three';

class Animal {
  constructor(position) {
    this.position = position;
    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    );
    this.mesh.position.copy(this.position);
  }

  update() {
    // Basic AI placeholder
  }
}

export default Animal;
