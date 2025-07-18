import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { SPEED, GRAVITY, JUMP_FORCE, MOBILE_SPEED_MULTIPLIER, FORCE_MOBILE_MODE, RUN_SPEED_MULTIPLIER } from "./controls/constants.js";
import { InputManager } from "./controls/InputManager.js";
import { CollisionManager } from "./collisionManager.js";

/* @tweakable Speed of camera rotation with the joystick on mobile. */
const mobileCameraRotateSpeed = 0.05;
/* @tweakable Minimum camera zoom distance on mobile */
const mobileMinZoom = 2;
/* @tweakable Maximum camera zoom distance on mobile */
const mobileMaxZoom = 10;
/* @tweakable The radius of the player's collision shape. */
const PLAYER_COLLISION_RADIUS = 0.3;
/* @tweakable The height of the player's collision shape. */
const PLAYER_COLLISION_HEIGHT = 1.8;

export class PlayerControls {
  constructor(scene, room, options = {}) {
    this.scene = scene;
    this.room = room;
    this.camera = options.camera || new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = options.renderer;
    this.domElement = this.renderer ? this.renderer.domElement : document.body;
    this.playerModel = options.playerModel;
    this.terrain = options.terrain;
    this.lastPosition = new THREE.Vector3();
    this.isMoving = false;
    this.wasMoving = false;
    this.isRunning = false;
    this.wasRunning = false;
    this.lastUpdateTime = 0;
    this.currentAction = 'idle';
    
    // Player state
    this.velocity = new THREE.Vector3();
    this.canJump = true;
    this.isMobile = FORCE_MOBILE_MODE || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Add mobile-device class to body for CSS styling
    if (this.isMobile) {
      document.body.classList.add('mobile-device');
    }

    // Input manager
    this.inputManager = new InputManager(this.isMobile, this.isMobile ? document.getElementById('right-side-touch-area') : this.domElement);
    this.collisionManager = new CollisionManager(scene);

    // Initial player position
    const initialPos = options.initialPosition || {};
    this.playerX = initialPos.x || (Math.random() * 10) - 5;
    this.playerY = initialPos.y || 0.20;
    this.playerZ = initialPos.z || (Math.random() * 10) - 5;
    
    // Set initial player model position if it exists
    if (this.playerModel) {
      this.setPlayerModel(this.playerModel);
    }
    
    // Set camera to third-person perspective
    const targetY = this.playerModel ? this.playerModel.position.y + 1 : this.playerY + 1;
    this.camera.position.set(this.playerX, targetY + 2, this.playerZ + 5);
    this.camera.lookAt(this.playerX, targetY, this.playerZ);
    // Store the initial camera offset (relative to player's target position)
    this.cameraOffset = new THREE.Vector3();
    this.cameraOffset.copy(this.camera.position).sub(new THREE.Vector3(this.playerX, targetY, this.playerZ));
    
    // Initialize controls
    this.initializeControls();
    
    // Setup event listeners
    this.setupEventListeners();
    
    // If room is provided, initialize multiplayer presence
    if (this.room) {
      // Initialize player presence in the room - include characterSpec if available
      const presenceData = {
        x: this.playerX,
        y: this.playerY,
        z: this.playerZ,
        rotation: 0,
        moving: false,
        running: false
      };
      if (this.playerModel && this.playerModel.userData.characterSpec) {
        presenceData.characterSpec = this.playerModel.userData.characterSpec;
      }
      this.room.updatePresence(presenceData);
    }
    
    this.enabled = true; // Add enabled flag for chat input
  }
  
  setPlayerModel(model) {
    this.playerModel = model;
    if (this.terrain) {
        const terrainHeight = this.terrain.userData.getHeight(this.playerX, this.playerZ);
        this.playerModel.position.set(this.playerX, terrainHeight + this.playerY, this.playerZ);
    } else {
        this.playerModel.position.set(this.playerX, this.playerY, this.playerZ);
    }
    this.lastPosition.copy(this.playerModel.position);
  }

  getGroundHeight(x, z) {
    if (!this.terrain) return 0;

    const raycaster = new THREE.Raycaster();
    /* @tweakable The starting height of the raycast used to detect ground collision. Should be higher than the highest point in the world. */
    const rayOriginHeight = 50;
    const rayOrigin = new THREE.Vector3(x, rayOriginHeight, z);
    const rayDirection = new THREE.Vector3(0, -1, 0);
    raycaster.set(rayOrigin, rayDirection);

    // Only check for intersection with the terrain object
    const intersects = raycaster.intersectObject(this.terrain);

    if (intersects.length > 0) {
      return intersects[0].point.y; // Return the precise intersection point's y-coordinate
    }

    // Fallback to the noise function if raycast fails for some reason
    return this.terrain.userData.getHeight(x, z);
  }

  initializeControls() {
    // Use OrbitControls for third-person view on both platforms
    this.controls = new OrbitControls(this.camera, this.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.1;
    this.controls.maxPolarAngle = Math.PI * 0.9; // Prevent going below ground
    this.controls.minDistance = this.isMobile ? mobileMinZoom : 3; // Minimum zoom distance
    this.controls.maxDistance = this.isMobile ? mobileMaxZoom : 10; // Maximum zoom distance
    
    // Update camera offset when controls change
    this.controls.addEventListener('change', () => {
      this.cameraOffset.copy(this.camera.position).sub(this.controls.target);
    });

    if (this.isMobile) {
      // The jump button is created in app.js.
      // The event listener is handled by InputManager.js.
    } else {
      // Add instructions for desktop
      const instructionsDiv = document.createElement('div');
      instructionsDiv.className = "instructions";
      instructionsDiv.innerHTML = "Click to begin. <br>Use WASD to move, Space to jump.";
      document.getElementById('game-container').appendChild(instructionsDiv);
      
      // Hide instructions on first click
      document.addEventListener('click', () => {
        if (document.querySelector(".instructions")) {
          document.querySelector(".instructions").style.display = 'none';
        }
      }, { once: true });
    }
  }

  setupEventListeners() {
    // Listen for jump key on desktop
    document.addEventListener("keydown", (e) => {
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
          return;
      }
      if (this.inputManager.isJumping() && this.canJump && !this.isMobile) {
        this.velocity.y = JUMP_FORCE;
        this.canJump = false;
      }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      if (this.renderer) {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
      }
    });
  }
  
  processMovement() {
    // Skip movement processing if controls are disabled
    if (!this.enabled) return;

    if (this.isMobile && this.inputManager.isJumping() && this.canJump) {
      this.velocity.y = JUMP_FORCE;
      this.canJump = false;
    }
    
    const x = this.playerModel.position.x;
    const y = this.playerModel.position.y;
    const z = this.playerModel.position.z;
    
    const moveDirection = this.inputManager.getMovementDirection();
    const isRunning = this.inputManager.isRunning();
    
    const cameraDirection = new THREE.Vector3();
    this.camera.getWorldDirection(cameraDirection);
    cameraDirection.y = 0; 
    cameraDirection.normalize();
    
    const rightVector = new THREE.Vector3();
    rightVector.crossVectors(this.camera.up, cameraDirection).normalize();
    
    const movement = new THREE.Vector3();
    if (this.isMobile) {
        // For mobile, moveDirection.z is forward/backward from joystick
        // moveDirection.x is left/right from joystick
        movement.addScaledVector(cameraDirection, moveDirection.z);
        // rightVector points left relative to the camera, so invert for correct orientation
        movement.addScaledVector(rightVector, moveDirection.x * -1);
    } else {
        if (moveDirection.z !== 0) {
            movement.add(cameraDirection.clone().multiplyScalar(moveDirection.z));
        }
        if (moveDirection.x !== 0) {
            movement.add(rightVector.clone().multiplyScalar(moveDirection.x * -1)); // Invert for desktop standard
        }
    }
    
    if (movement.length() > 0) {
        let moveSpeed = this.isMobile ? SPEED * MOBILE_SPEED_MULTIPLIER : SPEED;
        if (isRunning) {
          moveSpeed *= RUN_SPEED_MULTIPLIER;
        }
        movement.normalize().multiplyScalar(moveSpeed);
    }

    this.velocity.y -= GRAVITY;
    
    let newX = x + movement.x;
    let newY = y + this.velocity.y;
    let newZ = z + movement.z;
    
    // Use the CollisionManager to check for collisions
    const { finalPosition, finalVelocity, canJump, standingOnBlock } = this.collisionManager.checkCollisions(
        this.playerModel.position,
        new THREE.Vector3(newX, newY, newZ),
        this.velocity,
        PLAYER_COLLISION_RADIUS,
        PLAYER_COLLISION_HEIGHT
    );
    
    newX = finalPosition.x;
    newY = finalPosition.y;
    newZ = finalPosition.z;
    this.velocity.copy(finalVelocity);
    
    if (canJump) {
        this.canJump = true;
    }
    
    // Ground collision logic moved here to always check against terrain after object collision
    const terrainHeight = this.getGroundHeight(newX, newZ);
    /* @tweakable The vertical offset of the player model from the ground to prevent clipping. */
    const groundOffset = 0;
    const groundLevel = terrainHeight + groundOffset;

    // If standing on a block, the newY is already set by the collision manager.
    // We just need to make sure we don't fall through it to the terrain below.
    if (standingOnBlock) {
        if (newY < groundLevel) {
            // This case is unlikely but handles situations where a block might be slightly below terrain
            newY = groundLevel;
            this.velocity.y = 0;
            this.canJump = true;
        }
    } else {
        // Not standing on a block, so check against terrain.
        // Apply gravity.
        this.velocity.y -= GRAVITY;
        newY = this.playerModel.position.y + this.velocity.y;

        if (newY < groundLevel) {
            newY = groundLevel;
            this.velocity.y = 0;
            this.canJump = true;
        }
    }
    
    const isMovingNow = movement.length() > 0.001;
    this.isMoving = isMovingNow;
    
    if (this.playerModel) {
      this.playerModel.position.set(newX, newY, newZ);
      
      if (isMovingNow) {
        const angle = Math.atan2(movement.x, movement.z);
        const offset = this.playerModel.userData.isAnimatedGLB ? (this.playerModel.userData.rotationOffset || 0) : 0;
        this.playerModel.rotation.y = angle - offset; 
      }
      
      // Handle animations
      if (this.playerModel.userData.isAnimatedGLB) {
        const actions = this.playerModel.userData.actions;
        const fadeDuration = this.playerModel.userData.animationFadeDuration || 0.5;
        
        let newActionName = 'idle';
        if (isMovingNow) {
          newActionName = isRunning ? 'run' : 'walk';
        }
        
        if (this.currentAction !== newActionName) {
            const from = actions[this.currentAction];
            const to = actions[newActionName];
            if(from && to) {
                from.fadeOut(fadeDuration);
                to.reset().fadeIn(fadeDuration).play();
            }
            this.currentAction = newActionName;
        }
      } else {
        if (isMovingNow) {
            const leftLeg = this.playerModel.getObjectByName("leftLeg");
            const rightLeg = this.playerModel.getObjectByName("rightLeg");
            
            if (leftLeg && rightLeg) {
              /* @tweakable Speed of the procedural leg swing animation. */
              const walkSpeed = 5; 
              /* @tweakable Amplitude of the procedural leg swing animation. */
              const walkAmplitude = 0.3;
              leftLeg.rotation.x = Math.sin(this.time * walkSpeed) * walkAmplitude;
              rightLeg.rotation.x = Math.sin(this.time * walkSpeed + Math.PI) * walkAmplitude;
            }
        } else {
            const leftLeg = this.playerModel.getObjectByName("leftLeg");
            const rightLeg = this.playerModel.getObjectByName("rightLeg");
            
            if (leftLeg && rightLeg) {
              leftLeg.rotation.x = 0;
              rightLeg.rotation.x = 0;
            }
        }
      }
      
      const newTarget = new THREE.Vector3(this.playerModel.position.x, this.playerModel.position.y + 1, this.playerModel.position.z);
      if (this.controls) this.controls.target.copy(newTarget);
      this.camera.position.copy(newTarget).add(this.cameraOffset);
      
      if (this.room && (
          Math.abs(this.lastPosition.x - newX) > 0.01 ||
          Math.abs(this.lastPosition.y - newY) > 0.01 ||
          Math.abs(this.lastPosition.z - newZ) > 0.01 ||
          this.isMoving !== this.wasMoving ||
          isRunning !== this.wasRunning
        )) {
        
        const offset = this.playerModel.userData.rotationOffset || 0;
        const presenceData = {
          x: newX,
          y: newY,
          z: newZ,
          rotation: this.playerModel.rotation.y - offset,
          moving: this.isMoving,
          running: isRunning,
        };

        if (this.playerModel.userData.isGLB) {
          presenceData.isGLB = true;
        } else if (this.playerModel.userData.characterSpec) {
          presenceData.characterSpec = this.playerModel.userData.characterSpec;
        }
        
        this.room.updatePresence(presenceData);
        
        this.lastPosition.set(newX, newY, newZ);
        this.wasMoving = this.isMoving;
        this.wasRunning = isRunning;
      }
    }
    
    this.controls.update();
  }
  
  update() {
    const now = performance.now();
    const delta = (now - (this.lastUpdateTime || now)) / 1000;
    this.lastUpdateTime = now;

    this.time = (now * 0.01) % 1000;
    
    if (this.enabled) {
      this.processMovement();
    } else {
        // Still update controls for camera movement when player movement is disabled
        if (this.controls) this.controls.update();
    }

    if (this.isMobile) {
      this.controls.enabled = !this.inputManager.isCameraMoving();
      const cameraMove = this.inputManager.getCameraMovement();
      if (cameraMove.x !== 0 || cameraMove.y !== 0) {
        const rotateSpeed = mobileCameraRotateSpeed;
        this.controls.rotateLeft(-cameraMove.x * rotateSpeed);
        this.controls.rotateUp(-cameraMove.y * rotateSpeed);
      }
    }
    
    // Update animation mixer if it exists
    if (this.playerModel && this.playerModel.userData.mixer) {
        this.playerModel.userData.mixer.update(delta);
    }
  }
  
  getCamera() {
    return this.camera;
  }
  
  getPlayerModel() {
    return this.playerModel;
  }
}