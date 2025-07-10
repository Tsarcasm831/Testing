import * as THREE from 'three';

/**
 * Simple raycaster helper for mouse interaction.
 */
class Raycaster {
  constructor(camera, scene) {
    this.raycaster = new THREE.Raycaster();
    this.camera = camera;
    this.scene = scene;
  }

  /**
   * Return the first object intersected by the mouse event.
   * @param {MouseEvent} event
   * @param {THREE.Object3D[]} objects
   * @returns {THREE.Object3D|undefined}
   */
  getIntersectingObject(event, objects) {
    const rect = event.target.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );
    this.raycaster.setFromCamera(mouse, this.camera);
    return this.raycaster.intersectObjects(objects)[0]?.object;
  }
}

export default Raycaster;
