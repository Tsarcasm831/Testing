import * as THREE from 'three';

class NPC {
  constructor(position) {
    this.position = position;
    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0x0000ff })
    );
    this.mesh.position.copy(this.position);
    this.dialogue = 'Hello, adventurer!';
  }

  update() {
    // AI behavior placeholder
  }
}

export default NPC;
