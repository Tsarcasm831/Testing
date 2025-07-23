import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { SPEED, GRAVITY, JUMP_FORCE, MOBILE_SPEED_MULTIPLIER, FORCE_MOBILE_MODE, RUN_SPEED_MULTIPLIER, SPRINT_SPEED_MULTIPLIER } from "./controls/constants.js";
import { InputManager } from "./controls/InputManager.js";

/* @tweakable Speed of camera rotation with the joystick on mobile. */
const mobileCameraRotateSpeed = 0.002;
/* @tweakable Minimum camera zoom distance on mobile */
const mobileMinZoom = 2;
/* @tweakable Maximum camera zoom distance on mobile */
const mobileMaxZoom = 10;
/* @tweakable The radius of the player's collision shape. */
const PLAYER_COLLISION_RADIUS = 0.3;
/* @tweakable The height of the player's collision shape. */
const PLAYER_COLLISION_HEIGHT = 1.8;
/* @tweakable Key for storing mobile controls preference in localStorage. */
const MOBILE_CONTROLS_STORAGE_KEY = 'websim-force-mobile-controls';
/* @tweakable The camera's default maximum view distance. Lower values improve performance. */
const DEFAULT_FAR_PLANE = 150;

export class PlayerControls {
  constructor(scene, room, options = {}) {
    this.scene = scene;
    this.room = room;
    this.camera = options.camera || new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, DEFAULT_FAR_PLANE);
    this.renderer = options.renderer;
    this.domElement = this.renderer ? this.renderer.domElement : document.body;
    this.playerModel = options.playerModel;
    this.terrain = options.terrain;
    this.lastPosition = new THREE.Vector3();
    this.isMoving = false;
    this.wasMoving = false;
    this.isRunning = false;
    this.wasRunning = false;
    this.isSprinting = false;
    this.wasSprinting = false;
    this.lastUpdateTime = 0;
    this.currentAction = 'idle';
    this.isFlying = false;
    this.wasFlying = false;
    this.lastSpacebarTime = 0;
    /* @tweakable The time in milliseconds between spacebar presses to trigger flight mode. */
    this.doubleTapThreshold = 300;
    
    // Player state
    this.velocity = new THREE.Vector3();
    this.canJump = true;

    // Load control preference from localStorage
    const savedControlMode = localStorage.getItem(MOBILE_CONTROLS_STORAGE_KEY);
    if (savedControlMode !== null) {
      this.isMobile = savedControlMode === 'true';
    } else {
      this.isMobile = FORCE_MOBILE_MODE || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || ('ontouchstart' in window || navigator.maxTouchPoints > 0);
    }
    
    // Add mobile-device class to body for CSS styling
    if (this.isMobile) {
      document.body.classList.add('mobile-device');
    }

    // Input manager
    this.inputManager = new InputManager(this.isMobile, this.isMobile ? document.getElementById('lookPad') : this.domElement, this);
    this.collisionManager = options.collisionManager;

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
        running: false,
        flying: false
      };
      if (this.playerModel && this.playerModel.userData.characterSpec) {
        presenceData.characterSpec = this.playerModel.userData.characterSpec;
      }
      this.room.updatePresence(presenceData);
    }
    
    this.enabled = true; // Add enabled flag for chat input
  }
  
  toggleFlightMode() {
    this.isFlying = !this.isFlying;
    if (this.isFlying) {
        this.velocity.y = 0; // Stop any falling/jumping momentum
        this.canJump = false; 
    }
  }

  toggleMobileControls() {
    this.isMobile = !this.isMobile;
    localStorage.setItem(MOBILE_CONTROLS_STORAGE_KEY, this.isMobile);

    this.inputManager.destroy();
    this.inputManager = new InputManager(this.isMobile, this.isMobile ? document.getElementById('lookPad') : this.domElement, this);

    if (this.isMobile) {
        document.body.classList.add('mobile-device');
    } else {
        document.body.classList.remove('mobile-device');
    }
    
    // Update orbit controls properties
    this.controls.minDistance = this.isMobile ? mobileMinZoom : 3;
    this.controls.maxDistance = this.isMobile ? mobileMaxZoom : 10;
    
    const instructions = document.querySelector(".instructions");
    if (instructions && this.isMobile) {
        instructions.style.display = 'none';
    }
  }

  setPlayerModel(model) {
    this.playerModel = model;
    if (this.terrain) {
        const terrainHeight = this.collisionManager.getGroundHeight(this.playerX, this.playerZ);
        this.playerModel.position.set(this.playerX, terrainHeight + this.playerY, this.playerZ);
    } else {
        this.playerModel.position.set(this.playerX, this.playerY, this.playerZ);
    }
    this.lastPosition.copy(this.playerModel.position);
  }

  initializeControls() {
    // Use OrbitControls for third-person view on both platforms
    this.controls = new OrbitControls(this.camera, this.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.1;
    this.controls.maxPolarAngle = Math.PI * 0.9; // Prevent going below ground
    this.controls.minDistance = this.isMobile ? mobileMinZoom : 3; // Minimum zoom distance
    this.controls.maxDistance = this.isMobile ? mobileMaxZoom : 10; // Maximum zoom distance
    /* @tweakable The rotation speed of the camera. */
    this.controls.rotateSpeed = 0.5;
     /* @tweakable The zoom speed of the camera. */
    this.controls.zoomSpeed = 0.8;
    
    // Update camera offset when controls change
    this.controls.addEventListener('change', () => {
      this.cameraOffset.copy(this.camera.position).sub(this.controls.target);
    });

    if (this.isMobile) {
      // The InputManager handles the creation of joysticks and touch listeners.
      // We just need to make sure the UI elements are visible.
      document.getElementById('joystick').style.display = 'block';
      document.getElementById('jump-button').style.display = 'block';
    } else {
      // Add instructions for desktop
      const instructionsDiv = document.createElement('div');
      instructionsDiv.className = "instructions";

      /* @tweakable The title for the instructions popup. */
      const instructionsTitle = "Welcome to the World!";
      /* @tweakable The content for the instructions popup. Can include HTML. */
      const instructionsContent = `
        <div class="instructions-section">
            <strong>Controls:</strong>
            <ul>
                <li><b>WASD:</b> Move</li>
                <li><b>Space:</b> Jump/Double tap to fly</li>
                <li><b>Shift:</b> Run</li>
                <li><b>Ctrl:</b> Sprint</li>
                <li><b>F:</b> Interact with NPCs</li>
                <li><b>/:</b> Open Chat</li>
            </ul>
        </div>
        <div class="instructions-section">
            <strong>Features:</strong>
            <ul>
                <li>Explore four distinct biomes with unique trees and structures.</li>
                <li>Use the <b>Build Mode</b> (hammer icon) to create your own structures.</li>
                <li>Customize your character with the <b>Character Creator</b> (top-left icon).</li>
                <li>Chat and build with other players online!</li>
            </ul>
        </div>
        <p class="click-to-begin"><b>Click anywhere to begin your adventure.</b></p>
      `;

      instructionsDiv.innerHTML = `<h2>${instructionsTitle}</h2>${instructionsContent}`;

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
    // Listen for jump/flight key on desktop
    document.addEventListener("keydown", (e) => {
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
          return;
      }
      if (e.key === " " && !this.isMobile) {
        if (e.repeat) return; // Ignore holding down space
        const now = performance.now();
        if (now - this.lastSpacebarTime < this.doubleTapThreshold) {
            this.toggleFlightMode();
            this.lastSpacebarTime = 0; // Reset after double tap
        } else {
            this.lastSpacebarTime = now;
        }
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
  
  processMovement(delta) {
    // Skip movement processing if controls are disabled
    if (!this.enabled) return;

    if (this.isFlying) {
        /* @tweakable The speed of the player while flying. */
        const flightSpeed = SPEED * 4;
        this.velocity.y = 0;

        const cameraDirection = new THREE.Vector3();
        this.camera.getWorldDirection(cameraDirection);

        const rightVector = new THREE.Vector3();
        rightVector.crossVectors(this.camera.up, cameraDirection).normalize();
        
        const moveDir = this.inputManager.getMovementDirection();
        
        const movement = new THREE.Vector3();
        movement.addScaledVector(cameraDirection, moveDir.z * flightSpeed);
        movement.addScaledVector(rightVector, -moveDir.x * flightSpeed);
        
        if (this.inputManager.keysPressed.has(" ")) { // Go up
            movement.y += flightSpeed;
        }
        /* @tweakable Key used to fly down. */
        const flyDownKey = "shift";
        if (this.inputManager.keysPressed.has(flyDownKey)) { // Go down
            movement.y -= flightSpeed;
        }
        
        this.playerModel.position.add(movement);

        const isMovingNow = moveDir.lengthSq() > 0.001 || Math.abs(movement.y) > 0.001;
        this.isMoving = isMovingNow;

        if (this.playerModel) {
            if (moveDir.lengthSq() > 0.001) {
                const horizontalMovement = new THREE.Vector3(cameraDirection.x, 0, cameraDirection.z).normalize();
                const angle = Math.atan2(horizontalMovement.x, horizontalMovement.z);
                const offset = this.playerModel.userData.isAnimatedGLB ? (this.playerModel.userData.rotationOffset || 0) : 0;
                this.playerModel.rotation.y = angle - offset;
            }

            if (this.playerModel.userData.isAnimatedGLB) {
                const actions = this.playerModel.userData.actions;
                const fadeDuration = this.playerModel.userData.animationFadeDuration || 0.5;
                /* @tweakable The animation to play while flying. Options: 'idle', 'walk', 'run'. */
                const flyAnimation = 'run';
                let newActionName = isMovingNow ? flyAnimation : 'idle';
                
                if (this.currentAction !== newActionName) {
                    const from = actions[this.currentAction];
                    const to = actions[newActionName];
                    if(from && to) {
                        from.fadeOut(fadeDuration);
                        to.reset().fadeIn(fadeDuration).play();
                    } else if (to) {
                        to.reset().fadeIn(fadeDuration).play();
                    }
                    this.currentAction = newActionName;
                }
            } else {
                const leftLeg = this.playerModel.getObjectByName("leftLeg");
                const rightLeg = this.playerModel.getObjectByName("rightLeg");
                if (leftLeg && rightLeg) {
                    leftLeg.rotation.x = 0;
                    rightLeg.rotation.x = 0;
                }
            }
            
            const newTarget = new THREE.Vector3(this.playerModel.position.x, this.playerModel.position.y + 1, this.playerModel.position.z);
            if (this.controls) this.controls.target.copy(newTarget);
            this.camera.position.copy(newTarget).add(this.cameraOffset);
            
            if (this.room && (
                this.lastPosition.distanceTo(this.playerModel.position) > 0.01 ||
                this.isMoving !== this.wasMoving ||
                this.isFlying !== this.wasFlying
              )) {
              
              const offset = this.playerModel.userData.rotationOffset || 0;
              const presenceData = {
                x: this.playerModel.position.x,
                y: this.playerModel.position.y,
                z: this.playerModel.position.z,
                rotation: this.playerModel.rotation.y - offset,
                moving: this.isMoving,
                running: false,
                sprinting: false,
                flying: this.isFlying
              };
              
              if (this.playerModel.userData.isGLB) {
                presenceData.isGLB = true;
              } else if (this.playerModel.userData.characterSpec) {
                presenceData.characterSpec = this.playerModel.userData.characterSpec;
              }
              
              this.room.updatePresence(presenceData);
              
              this.lastPosition.copy(this.playerModel.position);
              this.wasMoving = this.isMoving;
              this.wasFlying = this.isFlying;
            }
        }
        
        if (this.controls) this.controls.update();

        if (this.isMobile) {
          // Mobile camera logic is now event-driven in initializeControls
        }
    } else {

      if (this.inputManager.isJumping() && this.canJump) {
        this.velocity.y = JUMP_FORCE;
        this.canJump = false;
      }
      
      const x = this.playerModel.position.x;
      const y = this.playerModel.position.y;
      const z = this.playerModel.position.z;
      
      const moveDir = this.inputManager.getMovementDirection();
      this.isRunning = this.inputManager.isRunning();
      this.isSprinting = this.inputManager.isSprinting();
      
      const cameraDirection = new THREE.Vector3();
      this.camera.getWorldDirection(cameraDirection);
      cameraDirection.y = 0; 
      cameraDirection.normalize();
      
      const rightVector = new THREE.Vector3();
      rightVector.crossVectors(this.camera.up, cameraDirection).normalize();
      
      const movement = new THREE.Vector3();
      movement.addScaledVector(cameraDirection, moveDir.z);
      movement.addScaledVector(rightVector, -moveDir.x);
      
      if (movement.length() > 0) {
          let moveSpeed = this.isMobile ? SPEED * MOBILE_SPEED_MULTIPLIER : SPEED;
          if (this.isSprinting) {
              moveSpeed *= SPRINT_SPEED_MULTIPLIER;
          } else if (this.isRunning) {
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
      const terrainHeight = this.collisionManager.getGroundHeight(newX, newZ);
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
            newActionName = this.isSprinting ? 'sprint' : this.isRunning ? 'run' : 'walk';
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
            this.isRunning !== this.wasRunning ||
            this.isSprinting !== this.wasSprinting ||
            this.isFlying !== this.wasFlying
          )) {
          
          const offset = this.playerModel.userData.rotationOffset || 0;
          const presenceData = {
            x: newX,
            y: newY,
            z: newZ,
            rotation: this.playerModel.rotation.y - offset,
            moving: this.isMoving,
            running: this.isRunning,
            sprinting: this.isSprinting,
            flying: this.isFlying
          };
  
          if (this.playerModel.userData.isGLB) {
            presenceData.isGLB = true;
          } else if (this.playerModel.userData.characterSpec) {
            presenceData.characterSpec = this.playerModel.userData.characterSpec;
          }
          
          this.room.updatePresence(presenceData);
          
          this.lastPosition.set(newX, newY, newZ);
          this.wasMoving = this.isMoving;
          this.wasRunning = this.isRunning;
          this.wasSprinting = this.isSprinting;
          this.wasFlying = this.isFlying;
        }
      }
      
      // Still update controls for camera movement when player movement is disabled
      if (this.controls) {
          // Mobile camera rotation is now handled by OrbitControls directly.
          this.controls.update();
      }

      if (this.isMobile) {
        // Mobile camera logic is now event-driven in initializeControls
      }
      
      // Update animation mixer if it exists
      if (this.playerModel && this.playerModel.userData.mixer) {
          this.playerModel.userData.mixer.update(delta);
      }
    }
  }
  
  update() {
    const now = performance.now();
    const delta = (now - (this.lastUpdateTime || now)) / 1000;
    this.lastUpdateTime = now;

    this.time = (now * 0.01) % 1000;
    
    if (this.enabled) {
      this.processMovement(delta);
    } else {
        // Still update controls for camera movement when player movement is disabled
        if (this.controls) {
            this.controls.update();
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