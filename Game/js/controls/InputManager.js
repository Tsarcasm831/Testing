import * as THREE from "three";
import { SPEED, MOBILE_SPEED_MULTIPLIER } from "./constants.js";

/* @tweakable Multiplier for movement joystick sensitivity on mobile. */
const MOVE_JOYSTICK_SENSITIVITY = 1.2;
/* @tweakable Multiplier for camera touch sensitivity on mobile. */
const CAMERA_TOUCH_SENSITIVITY = 1.0;
/* @tweakable The exponent for joystick input curve. >1 for slower start, <1 for faster start. */
const JOYSTICK_INPUT_CURVE = 1.2;
/* @tweakable The size of the joystick nipple when using mobile controls on a desktop. */
const DESKTOP_NIPPLE_SIZE = 120;

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
    /* @tweakable The maximum distance in pixels the cursor can move between mousedown and mouseup for it to be considered a click. */
    this.clickThreshold = 10;
    this.mouseDownPos = { x: 0, y: 0 };
    this.isDragging = false;

    /* @tweakable A list of CSS selectors for UI elements that should not trigger camera movement when clicked/tapped in mobile mode. */
    this.clickableSelectors = ['button', '.circle-button', '[data-tooltip]'];

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
        
        // Check if the event target is a clickable UI element
        if (e.target && this.clickableSelectors.some(selector => e.target.closest(selector))) {
            return; // Don't start camera movement if a button is clicked
        }

        const touch = e.type.startsWith('touch') ? e.touches[0] : e;
        if (touch) {
            this.lastTouchX = touch.clientX;
            this.lastTouchY = touch.clientY;
            this.mouseDownPos.x = touch.clientX;
            this.mouseDownPos.y = touch.clientY;
            this.cameraMoving = true;
            this.isDragging = false; // Reset dragging flag
        }
    };
    this.touchMoveHandler = (e) => {
        if (this.playerControls && !this.playerControls.enabled) return;
        const touch = e.type.startsWith('touch') ? e.touches[0] : e;
        if (touch && this.cameraMoving) {
            const dx = touch.clientX - this.mouseDownPos.x;
            const dy = touch.clientY - this.mouseDownPos.y;
            if (Math.sqrt(dx * dx + dy * dy) > this.clickThreshold) {
                this.isDragging = true;
            }

            if (this.isDragging) {
              this.cameraX = (touch.clientX - this.lastTouchX) * CAMERA_TOUCH_SENSITIVITY;
              this.cameraY = (touch.clientY - this.lastTouchY) * CAMERA_TOUCH_SENSITIVITY;
            }
            this.lastTouchX = touch.clientX;
            this.lastTouchY = touch.clientY;
        }
    };
    this.touchEndHandler = () => {
        this.cameraX = 0;
        this.cameraY = 0;
        this.cameraMoving = false;
        this.isDragging = false;
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
      size: this.isMobile ? Math.min(moveJoystickContainer.clientWidth, moveJoystickContainer.clientHeight) : DESKTOP_NIPPLE_SIZE
    });

    this.moveJoystick.on('move', this.joystickMoveHandler);
    this.moveJoystick.on('end', this.joystickEndHandler);

    /* @tweakable Set to true to use a second joystick for camera controls on mobile. */
    const useCameraJoystick = false;

    if (useCameraJoystick) {
        const cameraJoystickContainer = document.getElementById('camera-joystick-container');
        if (cameraJoystickContainer) {
            this.cameraJoystick = nipplejs.create({
                zone: cameraJoystickContainer,
                mode: 'static',
                position: { left: '50%', top: '50%' },
                color: 'rgba(255, 255, 255, 0.5)',
                size: this.isMobile ? Math.min(cameraJoystickContainer.clientWidth, cameraJoystickContainer.clientHeight) : DESKTOP_NIPPLE_SIZE
            });
            this.cameraJoystick.on('move', this.cameraJoystickMoveHandler);
            this.cameraJoystick.on('end', this.cameraJoystickEndHandler);
        }
    } else if (this.cameraTouchElement) {
        this.cameraTouchElement.addEventListener('touchstart', this.touchStartHandler);
        this.cameraTouchElement.addEventListener('touchmove', this.touchMoveHandler);
        this.cameraTouchElement.addEventListener('touchend', this.touchEndHandler);

        // Add mouse events for desktop "mobile" mode
        this.cameraTouchElement.addEventListener('mousedown', this.touchStartHandler);
        this.cameraTouchElement.addEventListener('mousemove', this.touchMoveHandler);
        this.cameraTouchElement.addEventListener('mouseup', this.touchEndHandler);
        this.cameraTouchElement.addEventListener('mouseleave', this.touchEndHandler);
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
        this.cameraTouchElement.removeEventListener('mousedown', this.touchStartHandler);
        this.cameraTouchElement.removeEventListener('mousemove', this.touchMoveHandler);
        this.cameraTouchElement.removeEventListener('mouseup', this.touchEndHandler);
        this.cameraTouchElement.removeEventListener('mouseleave', this.touchEndHandler);
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
        /* @tweakable Invert horizontal movement if controls feel wrong. Use 1 (normal) or -1 (inverted). */
        const horizontalDirection = 1;
        moveDirection.x = this.moveRight * horizontalDirection;
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

  isSprinting() {
    if (this.isMobile) {
        return false;
    }
    return this.keysPressed.has("control");
  }

  resetJump() {
    // This method is no longer needed for mobile jump logic
    // but we keep it in case it's used elsewhere or for future features.
    if (this.isMobile) {
        this.jumpRequested = false;
    }
  }
}