import * as THREE from 'three';

class Tree {
  constructor(position) {
    this.position = position;
    this.mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.5, 2),
      new THREE.MeshBasicMaterial({ color: 0x8B4513 })
    );
    this.mesh.position.copy(this.position);
  }

  update() {}
}

export default Tree;
