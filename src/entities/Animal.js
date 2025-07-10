import * as THREE from 'three';
import { Vector3 } from 'three';

/**
 * Basic wandering animal with simple movement.
 */
class Animal {
  constructor(position) {
    this.position = position.clone();
    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({ color: 0x00ff00 })
    );
    this.mesh.position.copy(this.position);
    this.direction = new Vector3();
  }

  /**
   * Simple wander update.
   */
  update(delta) {
    if (Math.random() < 0.01) {
      this.direction.set((Math.random() - 0.5) * 0.5, 0, (Math.random() - 0.5) * 0.5);
    }
    this.position.addScaledVector(this.direction, delta);
    this.mesh.position.copy(this.position);
  }
}

export default Animal;
