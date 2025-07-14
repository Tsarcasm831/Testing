import * as THREE from "three";
import { SPEED, MOBILE_SPEED_MULTIPLIER } from "./constants.js";

/* @tweakable Multiplier for movement joystick sensitivity on mobile. */
const MOVE_JOYSTICK_SENSITIVITY = 1.0;
/* @tweakable Multiplier for camera joystick sensitivity on mobile. */
const CAMERA_JOYSTICK_SENSITIVITY = 0.8;

export class InputManager {
  constructor(isMobile) {
    this.isMobile = isMobile;
    this.keysPressed = new Set();
    this.moveJoystick = null;
    this.cameraJoystick = null;
    this.moveForward = 0;
    this.moveRight = 0;
    this.cameraX = 0;
    this.cameraY = 0;
    this.jumpRequested = false;

    if (this.isMobile) {
      this.initializeMobileInput();
    } else {
      this.initializeDesktopInput();
    }
  }

  initializeDesktopInput() {
    document.addEventListener("keydown", (e) => {
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
        return;
      }
      this.keysPressed.add(e.key.toLowerCase());
    });

    document.addEventListener("keyup", (e) => {
      this.keysPressed.delete(e.key.toLowerCase());
    });
  }

  initializeMobileInput() {
    const moveJoystickContainer = document.getElementById('joystick-container');
    const cameraJoystickContainer = document.getElementById('camera-joystick-container');
    if (!moveJoystickContainer || !cameraJoystickContainer) {
      console.error("Joystick container not found!");
      return;
    }

    this.moveJoystick = nipplejs.create({
      zone: moveJoystickContainer,
      mode: 'static',
      position: { left: '50%', top: '50%' },
      color: 'rgba(255, 255, 255, 0.5)',
      size: 120
    });

    this.cameraJoystick = nipplejs.create({
      zone: cameraJoystickContainer,
      mode: 'static',
      position: { left: '50%', top: '50%' },
      color: 'rgba(255, 255, 255, 0.5)',
      size: 120
    });

    this.moveJoystick.on('move', (evt, data) => {
      const force = Math.min(data.force, 1.0) * MOVE_JOYSTICK_SENSITIVITY;
      const angle = data.angle.radian;
      this.moveForward = Math.sin(angle) * force;
      this.moveRight = Math.cos(angle) * force * -1; // Inverted joystick fix
    });

    this.moveJoystick.on('end', () => {
      this.moveForward = 0;
      this.moveRight = 0;
    });

    this.cameraJoystick.on('move', (evt, data) => {
      const force = Math.min(data.force, 1.0) * CAMERA_JOYSTICK_SENSITIVITY;
      const angle = data.angle.radian;
      this.cameraX = Math.cos(angle) * force;
      this.cameraY = Math.sin(angle) * force;
    });
    
    this.cameraJoystick.on('end', () => {
        this.cameraX = 0;
        this.cameraY = 0;
    });

    const jumpButton = document.getElementById('jump-button');
    if (jumpButton) {
      jumpButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.jumpRequested = true;
      });
      jumpButton.addEventListener('touchend', (e) => {
        e.preventDefault();
        this.jumpRequested = false;
      });
    }
  }

  getMovementDirection() {
    const moveDirection = new THREE.Vector3(0, 0, 0);

    if (this.isMobile) {
        // z becomes forward/backward, x becomes left/right
        moveDirection.z = this.moveForward;
        moveDirection.x = this.moveRight;
    } else {
      if (this.keysPressed.has("w") || this.keysPressed.has("arrowup")) {
        moveDirection.z = 1;
      } else if (this.keysPressed.has("s") || this.keysPressed.has("arrowdown")) {
        moveDirection.z = -1;
      }

      if (this.keysPressed.has("a") || this.keysPressed.has("arrowleft")) {
        moveDirection.x = 1;
      } else if (this.keysPressed.has("d") || this.keysPressed.has("arrowright")) {
        moveDirection.x = -1;
      }

       if (moveDirection.length() > 0) {
        moveDirection.normalize();
      }
    }

    return moveDirection;
  }
  
  getCameraMovement() {
      return { x: this.cameraX, y: this.cameraY };
  }

  isJumping() {
    if (this.isMobile) {
      const shouldJump = this.jumpRequested;
      if (shouldJump) {
        this.jumpRequested = false; // Consume the jump request
      }
      return shouldJump;
    }
    return this.keysPressed.has(" ");
  }

  isRunning() {
    if (this.isMobile) {
      // For now, mobile users can't run. This can be expanded with a run button.
      return false;
    }
    return this.keysPressed.has("shift");
  }

  resetJump() {
    // This method is no longer needed for mobile jump logic
    // but we keep it in case it's used elsewhere or for future features.
    if (this.isMobile) {
        this.jumpRequested = false;
    }
  }
}