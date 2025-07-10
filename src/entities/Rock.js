import * as THREE from 'three';

class Rock {
  constructor(position) {
    this.position = position;
    this.mesh = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.5),
      new THREE.MeshBasicMaterial({ color: 0x808080 })
    );
    this.mesh.position.copy(this.position);
  }

  update() {}
}

export default Rock;
