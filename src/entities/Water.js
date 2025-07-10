import * as THREE from 'three';

class Water {
  constructor(position) {
    this.position = position.clone();
    const geometry = new THREE.PlaneGeometry(16, 16);
    const material = new THREE.MeshStandardMaterial({
      color: 0x3366ff,
      transparent: true,
      opacity: 0.6,
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.rotation.x = -Math.PI / 2;
    this.mesh.position.copy(this.position);
  }

  update() {}
}

export default Water;
