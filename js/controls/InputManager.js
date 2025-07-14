import * as THREE from "three";
import { SPEED, MOBILE_SPEED_MULTIPLIER } from "./constants.js";

/* @tweakable Multiplier for movement joystick sensitivity on mobile. */
const MOVE_JOYSTICK_SENSITIVITY = 1.2;
/* @tweakable Multiplier for camera touch sensitivity on mobile. */
const CAMERA_TOUCH_SENSITIVITY = 0.005;
/* @tweakable The exponent for joystick input curve. >1 for slower start, <1 for faster start. */
const JOYSTICK_INPUT_CURVE = 1.2;

export class InputManager {
  constructor(isMobile, cameraTouchElement) {
    this.isMobile = isMobile;
    this.keysPressed = new Set();
    this.moveJoystick = null;
    this.cameraTouchElement = cameraTouchElement;
    this.moveForward = 0;
    this.moveRight = 0;
    this.cameraX = 0;
    this.cameraY = 0;
    this.jumpRequested = false;
    this.cameraMoving = false;

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
    if (!moveJoystickContainer) {
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

    this.moveJoystick.on('move', (evt, data) => {
      const baseForce = Math.min(data.force, 1.0);
      /* @tweakable Adjusts the sensitivity curve of the movement joystick. Higher values mean more precision at low intensity. */
      const force = Math.pow(baseForce, JOYSTICK_INPUT_CURVE) * MOVE_JOYSTICK_SENSITIVITY;
      const angle = data.angle.radian;
      this.moveForward = Math.sin(angle) * force;
      this.moveRight = Math.cos(angle) * force;
    });

    this.moveJoystick.on('end', () => {
      this.moveForward = 0;
      this.moveRight = 0;
    });

    if (this.cameraTouchElement) {
        let lastTouchX = 0;
        let lastTouchY = 0;

        this.cameraTouchElement.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                lastTouchX = e.touches[0].clientX;
                lastTouchY = e.touches[0].clientY;
                this.cameraMoving = true;
            }
        });

        this.cameraTouchElement.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1) {
                const touch = e.touches[0];
                this.cameraX = (touch.clientX - lastTouchX) * CAMERA_TOUCH_SENSITIVITY;
                this.cameraY = (touch.clientY - lastTouchY) * CAMERA_TOUCH_SENSITIVITY;
                lastTouchX = touch.clientX;
                lastTouchY = touch.clientY;
            }
        });
        
        this.cameraTouchElement.addEventListener('touchend', () => {
            this.cameraX = 0;
            this.cameraY = 0;
            this.cameraMoving = false;
        });
    }

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
        moveDirection.x = -1;
      } else if (this.keysPressed.has("d") || this.keysPressed.has("arrowright")) {
        moveDirection.x = 1;
      }

       if (moveDirection.length() > 0) {
        moveDirection.normalize();
      }
    }

    return moveDirection;
  }
  
  getCameraMovement() {
      const movement = { x: this.cameraX, y: this.cameraY };
      if (this.isMobile) {
          // decay movement for smoother stop
          this.cameraX *= 0.5;
          this.cameraY *= 0.5;
      }
      return movement;
  }
  
  isCameraMoving() {
      return this.cameraMoving;
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