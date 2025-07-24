import * as THREE from "three";
import {
  SPEED,
  GRAVITY,
  JUMP_FORCE,
  MOBILE_SPEED_MULTIPLIER,
  FORCE_MOBILE_MODE,
  RUN_SPEED_MULTIPLIER,
  SPRINT_SPEED_MULTIPLIER,
} from "./controls/constants.js";
import { InputManager } from "./controls/InputManager.js";
import {
  mobileCameraRotateSpeed,
  mobileMinZoom,
  mobileMaxZoom,
  PLAYER_COLLISION_RADIUS,
  PLAYER_COLLISION_HEIGHT,
  MOBILE_CONTROLS_STORAGE_KEY,
  DEFAULT_FAR_PLANE,
} from "./player/constants.js";
import { initializeControls as initControls } from "./player/setupControls.js";
import { setupEventListeners as initEvents } from "./player/setupEventListeners.js";
import { processMovement as movementHandler } from "./player/processMovement.js";

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
    this.instructionsDiv = null;
    
    // Player state
    this.velocity = new THREE.Vector3();
    this.canJump = true;

    // Load control preference from localStorage
    const currentUser = options.currentUser;
    const savedControlMode = localStorage.getItem(MOBILE_CONTROLS_STORAGE_KEY);
    if (savedControlMode !== null) {
      this.isMobile = savedControlMode === 'true';
    } else {
      this.isMobile = FORCE_MOBILE_MODE || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || ('ontouchstart' in window || navigator.maxTouchPoints > 0);
    }
    
    /* @tweakable The username to default to desktop controls for. */
    const desktopDefaultUsername = "lordtsarcasm";

    // Override for specific user
    if (currentUser && currentUser.username === desktopDefaultUsername) {
        this.isMobile = false;
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

  showInstructions() {
    if (this.isMobile || !this.instructionsDiv) return;

    this.instructionsDiv.style.display = 'block';

    const createHelpButton = () => {
      let helpButton = document.getElementById('help-button');
      if (helpButton) {
        helpButton.style.display = 'flex';
        return;
      }

      helpButton = document.createElement('div');
      helpButton.id = 'help-button';
      helpButton.classList.add('circle-button');
      helpButton.setAttribute('data-tooltip', 'Help');
      /* @tweakable The URL for the help icon. */
      const helpIconUrl = "https://file.garden/Zy7B0LkdIVpGyzA1/Public/Images/Icons/help_icon.png";
      /* @tweakable The size of the help icon. */
      const helpIconSize = "28px";
      helpButton.innerHTML = `<img src="${helpIconUrl}" alt="Help" style="width: ${helpIconSize}; height: ${helpIconSize};">`;
      document.getElementById('ui-container').appendChild(helpButton);

      helpButton.addEventListener('click', () => {
        this.instructionsDiv.style.display = this.instructionsDiv.style.display === 'none' ? 'block' : 'none';
      });

      this.instructionsDiv.addEventListener('click', () => {
        this.instructionsDiv.style.display = 'none';
      });
    };

    /* @tweakable Delay in milliseconds before automatically hiding the instructions after they appear. */
    const autoHideInstructionsDelay = 2000;
    setTimeout(() => {
      if (this.instructionsDiv) {
        this.instructionsDiv.style.display = 'none';
      }
      if(this.createHelpButton) this.createHelpButton();
    }, autoHideInstructionsDelay);
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
    initControls(this);
  }

  setupEventListeners() {
    initEvents(this);
  }
  
  processMovement(delta) {
    movementHandler(this, delta);
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