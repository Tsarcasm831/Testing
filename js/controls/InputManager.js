import * as THREE from "three";
import { SPEED, MOBILE_SPEED_MULTIPLIER } from "./constants.js";

/* @tweakable Multiplier for movement joystick sensitivity on mobile. */
const MOVE_JOYSTICK_SENSITIVITY = 1.2;
/* @tweakable Multiplier for camera touch sensitivity on mobile. */
const CAMERA_TOUCH_SENSITIVITY = 1.0;
/* @tweakable The exponent for joystick input curve. >1 for slower start, <1 for faster start. */
const JOYSTICK_INPUT_CURVE = 1.2;

export class InputManager {
  constructor(isMobile, cameraTouchElement, playerControls = null) {
    this.isMobile = isMobile;
    this.keysPressed = new Set();
    this.moveJoystick = null;
    this.cameraJoystick = null;
    this.cameraTouchElement = cameraTouchElement;
    this.playerControls = playerControls;
    this.moveForward = 0;
    this.moveRight = 0;
    this.cameraX = 0;
    this.cameraY = 0;
    this.jumpRequested = false;
    this.cameraMoving = false;
    this.lastTouchX = 0;
    this.lastTouchY = 0;

    // Event handlers
    this.keydownHandler = (e) => {
        if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
            return;
        }
        this.keysPressed.add(e.key.toLowerCase());
    };
    this.keyupHandler = (e) => {
        this.keysPressed.delete(e.key.toLowerCase());
    };
    this.joystickMoveHandler = (evt, data) => {
        const baseForce = Math.min(data.force, 1.0);
        const force = Math.pow(baseForce, JOYSTICK_INPUT_CURVE) * MOVE_JOYSTICK_SENSITIVITY;
        const angle = data.angle.radian;
        this.moveForward = Math.sin(angle) * force;
        this.moveRight = Math.cos(angle) * force;
    };
    this.joystickEndHandler = () => {
        this.moveForward = 0;
        this.moveRight = 0;
    };
    this.cameraJoystickMoveHandler = (evt, data) => {
        const force = Math.min(data.force, 1.0);
        const angle = data.angle.radian;
        /* @tweakable Multiplier for camera joystick sensitivity on mobile. */
        const CAMERA_JOYSTICK_SENSITIVITY = 1.5;
        this.cameraX = Math.cos(angle) * force * CAMERA_JOYSTICK_SENSITIVITY;
        this.cameraY = -Math.sin(angle) * force * CAMERA_JOYSTICK_SENSITIVITY;
        this.cameraMoving = true;
    };
    this.cameraJoystickEndHandler = () => {
        this.cameraX = 0;
        this.cameraY = 0;
        this.cameraMoving = false;
    };
    this.touchStartHandler = (e) => {
        if (this.playerControls && !this.playerControls.enabled) return;
        if (e.touches.length === 1) {
            this.lastTouchX = e.touches[0].clientX;
            this.lastTouchY = e.touches[0].clientY;
            this.cameraMoving = true;
        }
    };
    this.touchMoveHandler = (e) => {
        if (this.playerControls && !this.playerControls.enabled) return;
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            this.cameraX = (touch.clientX - this.lastTouchX) * CAMERA_TOUCH_SENSITIVITY;
            this.cameraY = (touch.clientY - this.lastTouchY) * CAMERA_TOUCH_SENSITIVITY;
            this.lastTouchX = touch.clientX;
            this.lastTouchY = touch.clientY;
        }
    };
    this.touchEndHandler = () => {
        this.cameraX = 0;
        this.cameraY = 0;
        this.cameraMoving = false;
    };
    this.jumpTouchStartHandler = (e) => {
        e.preventDefault();
        this.jumpRequested = true;
    };
    this.jumpTouchEndHandler = (e) => {
        e.preventDefault();
        this.jumpRequested = false;
    };

    if (this.isMobile) {
      this.initializeMobileInput();
    } else {
      this.initializeDesktopInput();
    }
  }

  initializeDesktopInput() {
    document.addEventListener("keydown", this.keydownHandler);
    document.addEventListener("keyup", this.keyupHandler);
  }

  initializeMobileInput() {
    const moveJoystickContainer = document.getElementById('joystick');
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

    this.moveJoystick.on('move', this.joystickMoveHandler);
    this.moveJoystick.on('end', this.joystickEndHandler);

    /* @tweakable Set to true to use a second joystick for camera controls on mobile. */
    const useCameraJoystick = true;

    if (useCameraJoystick) {
        const cameraJoystickContainer = document.getElementById('camera-joystick-container');
        if (cameraJoystickContainer) {
            this.cameraJoystick = nipplejs.create({
                zone: cameraJoystickContainer,
                mode: 'static',
                position: { left: '50%', top: '50%' },
                color: 'rgba(255, 255, 255, 0.5)',
                size: 120
            });
            this.cameraJoystick.on('move', this.cameraJoystickMoveHandler);
            this.cameraJoystick.on('end', this.cameraJoystickEndHandler);
        }
    } else if (this.cameraTouchElement) {
        this.cameraTouchElement.addEventListener('touchstart', this.touchStartHandler);
        this.cameraTouchElement.addEventListener('touchmove', this.touchMoveHandler);
        this.cameraTouchElement.addEventListener('touchend', this.touchEndHandler);
    }

    const jumpButton = document.getElementById('jump-button');
    if (jumpButton) {
      jumpButton.addEventListener('touchstart', this.jumpTouchStartHandler);
      jumpButton.addEventListener('touchend', this.jumpTouchEndHandler);
    }
  }
  
  destroy() {
    document.removeEventListener("keydown", this.keydownHandler);
    document.removeEventListener("keyup", this.keyupHandler);
    
    if (this.moveJoystick) {
        this.moveJoystick.destroy();
        this.moveJoystick = null;
    }
    
    if (this.cameraJoystick) {
        this.cameraJoystick.destroy();
        this.cameraJoystick = null;
    }

    if (this.cameraTouchElement) {
        this.cameraTouchElement.removeEventListener('touchstart', this.touchStartHandler);
        this.cameraTouchElement.removeEventListener('touchmove', this.touchMoveHandler);
        this.cameraTouchElement.removeEventListener('touchend', this.touchEndHandler);
    }
    const jumpButton = document.getElementById('jump-button');
    if (jumpButton) {
      jumpButton.removeEventListener('touchstart', this.jumpTouchStartHandler);
      jumpButton.removeEventListener('touchend', this.jumpTouchEndHandler);
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
          /* @tweakable Decay factor for camera movement on touch release. Lower is slower. */
          const cameraMoveDecay = 0.5;
          this.cameraX *= cameraMoveDecay;
          this.cameraY *= cameraMoveDecay;
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