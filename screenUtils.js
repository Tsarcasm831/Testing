import * as THREE from "three";

// Helper function to convert 3D position to screen coordinates
export function getScreenPosition(position, camera, renderer) {
  const vector = new THREE.Vector3();
  const widthHalf = renderer.domElement.width / 2;
  const heightHalf = renderer.domElement.height / 2;
  
  // Get the position adjusted to account for player height
  vector.copy(position);
  vector.y += 1.5; // Position above the player's head
  
  // Project to screen space
  vector.project(camera);
  
  // Calculate whether object is in front of the camera
  const isInFront = vector.z < 1;
  
  // Convert to screen coordinates
  return {
    x: (vector.x * widthHalf) + widthHalf,
    y: -(vector.y * heightHalf) + heightHalf,
    visible: isInFront
  };
}