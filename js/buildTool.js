import * as THREE from 'three';
import { AIBuilder } from './aiBuilder.js';
import { LifespanExtender } from './lifespanExtender.js';
import { PreviewManager } from './previewManager.js';

export class BuildTool {
  constructor(scene, camera, controls, terrain, assetManager) {
    this.scene = scene;
    this.camera = camera;
    this.controls = controls;
    this.terrain = terrain;
    this.assetManager = assetManager;
    this.enabled = false;
    this.lastTapTime = 0;
    this.buildMaterials = this.createBuildMaterials();
    this.buildObjects = [];
    this.mousePosition = new THREE.Vector2();
    this.touchStarted = false;
    this.touchStartTime = 0;
    this.touchStartPos = { x: 0, y: 0 };
    this.room = null; // Will be set from app.js
    this.aiBuilding = false; // Track if AI is currently building
    this.extendingLifespan = false; // Track if lifespan extender is active

    this.previewManager = new PreviewManager(scene, camera, this.buildMaterials, this.terrain);
    this.aiBuilder = new AIBuilder(this);
    this.lifespanExtender = new LifespanExtender(scene, this);

    // Bind event handlers
    /* @tweakable The number of milliseconds to wait between clicks/taps to register a double-click/tap for placing an object. */
    this.doubleTapThreshold = 300;
    this.boundOnMouseMove = this.onMouseMove.bind(this);
    this.boundOnClick = this.onClick.bind(this);
    this.boundOnTouchStart = this.onTouchStart.bind(this);
    this.boundOnTouchMove = this.onTouchMove.bind(this);
    this.boundOnTouchEnd = this.onTouchEnd.bind(this);
    this.boundOnMouseDown = this.onMouseDown.bind(this);

    // Setup event listeners
    this.setupEventListeners();
  }

  createBuildMaterials() {
    // This now just creates placeholder materials. The actual materials with textures
    // will be created on-demand when needed, using the assetManager.
    return [
      new THREE.MeshStandardMaterial({ 
        color: 0xff4444, roughness: 0.7, metalness: 0.3
      }),
      new THREE.MeshStandardMaterial({ 
        color: 0x44ff44, roughness: 0.7, metalness: 0.3
      }),
      new THREE.MeshStandardMaterial({ 
        color: 0x4444ff, roughness: 0.7, metalness: 0.3
      }),
      new THREE.MeshStandardMaterial({ 
        color: 0xffff44, roughness: 0.7, metalness: 0.3
      }),
      new THREE.MeshStandardMaterial({ 
        color: 0xff44ff, roughness: 0.7, metalness: 0.3
      }),
      new THREE.MeshStandardMaterial({ 
        color: 0x44ffff, roughness: 0.7, metalness: 0.3
      })
    ];
  }

  setupEventListeners() {
    // Mouse events for desktop
    document.addEventListener('mousemove', this.boundOnMouseMove);
    document.addEventListener('click', this.boundOnClick);

    // Touch events for mobile
    document.addEventListener('touchstart', this.boundOnTouchStart);
    document.addEventListener('touchmove', this.boundOnTouchMove);
    document.addEventListener('touchend', this.boundOnTouchEnd);

    // Listen for shift+click for height adjustment
    document.addEventListener('mousedown', this.boundOnMouseDown);
  }

  destroy() {
    document.removeEventListener('mousemove', this.boundOnMouseMove);
    document.removeEventListener('click', this.boundOnClick);
    document.removeEventListener('touchstart', this.boundOnTouchStart);
    document.removeEventListener('touchmove', this.boundOnTouchMove);
    document.removeEventListener('touchend', this.boundOnTouchEnd);
    document.removeEventListener('mousedown', this.boundOnMouseDown);
    
    if (this.previewMesh) {
        this.scene.remove(this.previewMesh);
        this.previewMesh = null;
    }
  }

  onMouseMove(event) {
    if (!this.enabled) return;

    // Calculate mouse position in normalized device coordinates (-1 to +1)
    this.mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mousePosition.y = - (event.clientY / window.innerHeight) * 2 + 1;

    this.previewManager.updatePosition(this.mousePosition, this.buildObjects);
  }

  onClick(event) {
    if (!this.enabled || this.aiBuilding) return;

    // Don't process clicks when advanced build tool is enabled
    if (document.getElementById('advanced-build-controls') && 
        document.getElementById('advanced-build-controls').style.display === 'flex') {
      return;
    }
    
    // Place object on single click instead of double click
    this.placeBuildObject();
  }

  onTouchStart(event) {
    if (!this.enabled || this.aiBuilding) return;

    // Don't process touches when advanced build tool is enabled
    if (document.getElementById('advanced-build-controls') && 
        document.getElementById('advanced-build-controls').style.display === 'flex') {
      return;
    }

    this.touchStarted = true;
    this.touchStartTime = performance.now();
    const touch = event.touches[0];
    this.touchStartPos = { x: touch.clientX, y: touch.clientY };

    // Calculate touch position in normalized device coordinates (-1 to +1)
    this.mousePosition.x = (touch.clientX / window.innerWidth) * 2 - 1;
    this.mousePosition.y = - (touch.clientY / window.innerHeight) * 2 + 1;

    this.previewManager.updatePosition(this.mousePosition, this.buildObjects);
  }

  onTouchMove(event) {
    if (!this.enabled || !this.touchStarted) return;

    const touch = event.touches[0];

    // Calculate touch position in normalized device coordinates (-1 to +1)
    this.mousePosition.x = (touch.clientX / window.innerWidth) * 2 - 1;
    this.mousePosition.y = - (touch.clientY / window.innerHeight) * 2 + 1;

    this.previewManager.updatePosition(this.mousePosition, this.buildObjects);
  }

  onTouchEnd(event) {
    if (!this.enabled || !this.touchStarted) return;
        
    const touchDuration = performance.now() - this.touchStartTime;
    const touch = event.changedTouches[0];
    const dist = Math.sqrt(
        Math.pow(touch.clientX - this.touchStartPos.x, 2) +
        Math.pow(touch.clientY - this.touchStartPos.y, 2)
    );
    
    /* @tweakable Max duration in ms for a touch to be considered a tap. */
    const TAP_DURATION_THRESHOLD = 200;
    /* @tweakable Max distance in pixels for a touch to be considered a tap. */
    const TAP_DISTANCE_THRESHOLD = 10;
    
    if (touchDuration < TAP_DURATION_THRESHOLD && dist < TAP_DISTANCE_THRESHOLD) {
        this.placeBuildObject();
    }

    this.touchStarted = false;
  }

  placeBuildObject() {
    const previewMesh = this.previewManager.getMesh();
    if (!previewMesh || !this.enabled) return;

    if (this.isLocationOccupiedByPlayer(previewMesh.position)) return;

    // Create a new object at the preview position
    const buildGeometry = previewMesh.geometry.clone();
    const materialIndex = this.previewManager.getCurrentMaterialIndex();
    const buildMaterial = this.buildMaterials[materialIndex].clone();
    const buildObject = new THREE.Mesh(buildGeometry, buildMaterial);

    buildObject.position.copy(previewMesh.position);
    buildObject.scale.copy(previewMesh.scale);
    buildObject.rotation.copy(previewMesh.rotation);

    buildObject.castShadow = true;
    buildObject.receiveShadow = true;
    buildObject.userData.isBarrier = true;

    // Generate a unique ID for this object
    const objectId = 'build_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    buildObject.userData.id = objectId;
    buildObject.userData.createdAt = Date.now(); // Store creation time

    this.scene.add(buildObject);
    this.buildObjects.push(buildObject);

    // Sync build object with other players if room is available
    if (this.room) {
      // Get geometry type
      const geometryType = previewMesh.userData.shapeName || buildObject.geometry.type;

      // Create build object data
      const buildData = {
        objectId: objectId,
        position: {
          x: buildObject.position.x,
          y: buildObject.position.y,
          z: buildObject.position.z
        },
        scale: {
          x: buildObject.scale.x,
          y: buildObject.scale.y,
          z: buildObject.scale.z
        },
        rotation: {
          x: buildObject.rotation.x,
          y: buildObject.rotation.y,
          z: buildObject.rotation.z
        },
        materialIndex: materialIndex,
        geometryType: geometryType,
        createdAt: Date.now() // Store creation time
      };

      // Send to current players
      this.room.send({
        type: 'build_object',
        ...buildData
      });

      // Store in room state for future players
      const updatedBuildObjects = { ...(this.room.roomState.buildObjects || {}) };
      updatedBuildObjects[objectId] = buildData;
      this.room.updateRoomState({
        buildObjects: updatedBuildObjects
      });
    }
  }

  // Method to handle receiving build objects from other players
  receiveBuildObject(buildData) {
    if (!buildData) return;

    // Check if object already exists (by ID)
    const existingObject = this.buildObjects.find(obj => 
      obj.userData.id === buildData.objectId
    );

    if (existingObject) return; // Skip if already exists

    // Create appropriate geometry based on type
    let geometry;
    switch (buildData.geometryType) {
      case 'BoxGeometry':
        geometry = new THREE.BoxGeometry(1, 1, 1);
        break;
      case 'SphereGeometry':
        geometry = new THREE.SphereGeometry(0.5, 16, 16);
        break;
      case 'CylinderGeometry':
        geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 16);
        break;
      case 'ConeGeometry':
        geometry = new THREE.ConeGeometry(0.5, 1, 16);
        break;
      case 'TorusGeometry':
        geometry = new THREE.TorusGeometry(0.5, 0.2, 16, 32);
        break;
      case 'Pyramid':
        geometry = new THREE.ConeGeometry(0.5, 1, 4);
        break;
      default:
        geometry = new THREE.BoxGeometry(1, 1, 1);
    }

    // Create material
    const materialIndex = Math.min(
      buildData.materialIndex || 0,
      this.buildMaterials.length - 1
    );
    const material = this.buildMaterials[materialIndex].clone();

    // Create mesh
    const buildObject = new THREE.Mesh(geometry, material);
    buildObject.position.set(
      buildData.position.x,
      buildData.position.y,
      buildData.position.z
    );

    if (this.isLocationOccupiedByPlayer(buildObject.position)) return;
    buildObject.scale.set(
      buildData.scale.x,
      buildData.scale.y,
      buildData.scale.z
    );
    buildObject.rotation.set(
      buildData.rotation.x,
      buildData.rotation.y,
      buildData.rotation.z
    );

    buildObject.castShadow = true;
    buildObject.receiveShadow = true;
    buildObject.userData.isBarrier = true;
    buildObject.userData.id = buildData.objectId;
    buildObject.userData.createdAt = buildData.createdAt || Date.now(); // Use provided time or current time

    this.scene.add(buildObject);
    this.buildObjects.push(buildObject);
  }

  // Set the room for multiplayer build syncing
  setRoom(room) {
    this.room = room;
  }

  isLocationOccupiedByPlayer(position, radius = 1) {
    let occupied = false;
    this.scene.traverse((obj) => {
      if (obj.userData && obj.userData.isPlayer) {
        const playerPos = new THREE.Vector3();
        obj.getWorldPosition(playerPos);
        if (playerPos.distanceTo(position) < radius) occupied = true;
      }
    });
    return occupied;
  }

  toggleBuildMode() {
    this.enabled = !this.enabled;

    if (this.enabled) {
      this.previewManager.show();

      // Create height indicator
      if (!document.getElementById('height-indicator')) {
        const heightIndicator = document.createElement('div');
        heightIndicator.id = 'height-indicator';
        heightIndicator.textContent = `Height: ${this.previewManager.currentHeight.toFixed(1)}`;
        document.getElementById('game-container').appendChild(heightIndicator);
      }
      document.getElementById('height-indicator').style.display = 'block';

      // Reset lifespan extender mode
      this.extendingLifespan = false;

    } else {
      this.previewManager.hide();
      if (document.getElementById('height-indicator')) {
        document.getElementById('height-indicator').style.display = 'none';
      }

      // Reset lifespan extender mode when exiting build mode
      if (this.extendingLifespan) {
        this.extendingLifespan = false;
        this.hideLifespanNotification();

        // Reset the button if it exists and has the active class
        const extenderButton = document.getElementById('lifespan-extender-button');
        if (extenderButton) {
          extenderButton.classList.remove('active');
        }
      }
    }

    return this.enabled;
  }

  changeShape() {
    this.previewManager.changeShape();
    this.previewManager.updatePosition(this.mousePosition, this.buildObjects);
  }

  changeMaterial() {
    this.previewManager.changeMaterial();
  }

  changeSize() {
    this.previewManager.changeSize();
    this.previewManager.updatePosition(this.mousePosition, this.buildObjects);
  }

  rotatePreview() {
    this.previewManager.rotate();
  }

  undoLastObject() {
    if (this.buildObjects.length === 0) return;
    const lastObject = this.buildObjects.pop();
    this.scene.remove(lastObject);
    if (this.room && this.room.roomState.buildObjects && lastObject.userData.id) {
      const updatedBuildObjects = { ...(this.room.roomState.buildObjects) };
      delete updatedBuildObjects[lastObject.userData.id];
      this.room.updateRoomState({
        buildObjects: updatedBuildObjects
      });
      this.room.send({
        type: 'delete_build_object',
        objectId: lastObject.userData.id
      });
    }
  }

  onMouseDown(event) {
    if (!this.enabled || !this.previewManager.getMesh()) return;

    // Check if shift key is pressed
    if (event.shiftKey) {
      let newHeight;
      if (event.button === 0) { // Left click
        // Increase height
        newHeight = this.previewManager.adjustHeight(0.5);
      } else if (event.button === 2) { // Right click
        // Decrease height
        newHeight = this.previewManager.adjustHeight(-0.5);
      }

      // Update height indicator
      const heightIndicator = document.getElementById('height-indicator');
      if (heightIndicator) {
        heightIndicator.textContent = `Height: ${newHeight.toFixed(1)}`;
      }

      event.preventDefault();
    }
  }

  checkExpiredObjects(currentTime, expirationTime) {
    const objectsToRemove = [];

    // Check each build object
    for (let i = 0; i < this.buildObjects.length; i++) {
      const object = this.buildObjects[i];
      if (object.userData.createdAt && !object.userData.extendedUntil && 
          (currentTime - object.userData.createdAt > expirationTime)) {
        objectsToRemove.push(object);
      } else if (object.userData.extendedUntil && currentTime > object.userData.extendedUntil) {
        // For objects with extended lifespan, check if extension has expired
        objectsToRemove.push(object);
      }
    }

    // Remove expired objects
    for (const object of objectsToRemove) {
      // Remove from scene
      this.scene.remove(object);

      // Remove from build objects array
      const index = this.buildObjects.indexOf(object);
      if (index !== -1) {
        this.buildObjects.splice(index, 1);
      }

      // Remove from room state if available
      if (this.room && this.room.roomState.buildObjects && object.userData.id) {
        const updatedBuildObjects = { ...(this.room.roomState.buildObjects) };
        delete updatedBuildObjects[object.userData.id];
        this.room.updateRoomState({
          buildObjects: updatedBuildObjects
        });
      }
    }

    if (objectsToRemove.length > 0) {
      console.log(`Removed ${objectsToRemove.length} expired build objects`);
    }
  }

  // AI-powered building generation
  aiGenerateStructure(prompt) {
    this.aiBuilder.generateStructure(prompt);
  }

  toggleLifespanExtender() {
    this.extendingLifespan = this.lifespanExtender.toggle();

    if (this.extendingLifespan) {
      this.previewManager.hide();
    } else {
      if (this.enabled) {
        this.previewManager.show();
      }
    }

    return this.extendingLifespan;
  }

  extendObjectLifespans(playerPosition) {
    if (!this.extendingLifespan) return;
    this.lifespanExtender.extendObjects(playerPosition, this.buildObjects);
  }

  showExtensionEffect(position) {
    this.lifespanExtender.showExtensionEffect(position);
  }

  showLifespanNotification(message, isComplete = false) {
    this.lifespanExtender.showNotification(message, isComplete);
  }

  hideLifespanNotification() {
    this.lifespanExtender.hideNotification();
  }

  receiveLifespanExtension(extensionData) {
    const object = this.buildObjects.find(obj => obj.userData.id === extensionData.objectId);
    if (object) {
      this.lifespanExtender.receiveExtension(object, extensionData);
    }
  }
}