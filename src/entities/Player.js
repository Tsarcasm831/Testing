import * as THREE from 'three';
import InputHandler from '../utils/inputHandler';

/**
 * Player entity controlled via keyboard.
 */
class Player {
  constructor() {
    this.position = new THREE.Vector3(0, 0.5, 0);
    this.velocity = new THREE.Vector3();
    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({ color: 0xff0000 })
    );
    this.mesh.position.copy(this.position);
    this.health = 100;
    this.inputHandler = new InputHandler();
    this.speed = 5;
  }

  /**
   * Update player position based on input.
   * @param {number} delta
   */
  update(delta) {
    const move = new THREE.Vector3();
    if (this.inputHandler.keys['w']) move.z -= 1;
    if (this.inputHandler.keys['s']) move.z += 1;
    if (this.inputHandler.keys['a']) move.x -= 1;
    if (this.inputHandler.keys['d']) move.x += 1;

    move.normalize().multiplyScalar(this.speed * delta);
    this.position.add(move);
    this.mesh.position.copy(this.position);
  }
}

export default Player;
