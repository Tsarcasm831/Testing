import * as THREE from 'three';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { CLUSTER_SIZE } from './worldgen/constants.js';
import { ColorManager } from './advancedBuild/colorManager.js';

export class AdvancedBuildTool {
  constructor(scene, camera, renderer, buildTool, objectCreator) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.buildTool = buildTool; 
    this.objectCreator = objectCreator;
    this.enabled = false;
    this.room = null;
    this.selectedObject = null;
    
    this.transformControl = new TransformControls(camera, renderer.domElement);
    this.transformControl.addEventListener('dragging-changed', (event) => {
      if (this.orbitControls) {
        this.orbitControls.enabled = !event.value;
      }
      if (!event.value) { // Dragging ended
        this.updateObjectTransform();
      }
    });
    scene.add(this.transformControl);
    
    this.transformMode = 'translate';
    this.advancedBuildObjects = [];
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.colorManager = new ColorManager(this);
    
    this.boundOnPointerDown = this.onPointerDown.bind(this);
    this.boundOnKeyDown = this.onKeyDown.bind(this);

    this.setupEventListeners();
  }
  
  setupEventListeners() {
    this.renderer.domElement.addEventListener('pointerdown', this.boundOnPointerDown);
    window.addEventListener('keydown', this.boundOnKeyDown);
  }

  destroy() {
    this.renderer.domElement.removeEventListener('pointerdown', this.boundOnPointerDown);
    window.removeEventListener('keydown', this.boundOnKeyDown);
    if(this.transformControl) {
        this.transformControl.dispose();
        this.scene.remove(this.transformControl);
    }
  }
  
  onKeyDown(event) {
    if (!this.enabled) return;
    
    if (event.key === 'g') {
      this.setTransformMode('translate');
    } else if (event.key === 'r') {
      this.setTransformMode('rotate');
    } else if (event.key === 's') {
      this.setTransformMode('scale');
    } else if (event.key === 'Delete' || event.key === 'Backspace') {
      this.deleteSelectedObject();
    } else if (event.key === 'd' && event.ctrlKey) {
      // Add Ctrl+D shortcut for duplicate
      event.preventDefault();
      this.duplicateSelectedObject();
    }
  }
  
  onPointerDown(event) {
    if (!this.enabled) return;
    
    // Stop event propagation to prevent buildTool from processing the same click
    event.stopPropagation();
    
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects([...this.buildTool.buildObjects, ...this.advancedBuildObjects], false);
    
    // Check if color picker is active
    if (this.colorManager.active && intersects.length > 0) {
      this.pickColorFromObject(intersects[0].object);
      return;
    }
    
    // Don't deselect if the transform controls are being used
    if (event.target === this.renderer.domElement) {
      if (intersects.length > 0) {
        this.selectObject(intersects[0].object);
      } else if (!this.transformControl.dragging) {
        this.deselectObject();
      }
    }
  }
  
  selectObject(object) {
    this.deselectObject();
    this.selectedObject = object;
    this.transformControl.attach(object);
    
    const originalMaterial = object.material;
    object.userData.originalMaterial = originalMaterial;
    const highlightMaterial = originalMaterial.clone();
    highlightMaterial.emissive = new THREE.Color(0x333333);
    object.material = highlightMaterial;
    
    document.getElementById('selection-controls').style.display = 'flex';
  }
  
  deselectObject() {
    if (this.selectedObject) {
      if (this.selectedObject.userData.originalMaterial) {
        this.selectedObject.material = this.selectedObject.userData.originalMaterial;
        delete this.selectedObject.userData.originalMaterial;
      }
      
      this.transformControl.detach();
      this.selectedObject = null;
      document.getElementById('selection-controls').style.display = 'none';
    }
  }
  
  setTransformMode(mode) {
    this.transformMode = mode;
    this.transformControl.setMode(mode);
    
    document.querySelectorAll('.transform-button').forEach(button => {
      button.classList.remove('active');
    });
    document.getElementById(`${mode}-button`).classList.add('active');
  }
  
  deleteSelectedObject() {
    if (!this.selectedObject) return;
    
    this.scene.remove(this.selectedObject);
    
    const basicBuildIndex = this.buildTool.buildObjects.indexOf(this.selectedObject);
    if (basicBuildIndex !== -1) {
      this.buildTool.buildObjects.splice(basicBuildIndex, 1);
    }
    
    const advancedBuildIndex = this.advancedBuildObjects.indexOf(this.selectedObject);
    if (advancedBuildIndex !== -1) {
      this.advancedBuildObjects.splice(advancedBuildIndex, 1);
    }
    
    if (this.room && this.room.roomState.buildObjects && this.selectedObject.userData.id) {
      const updatedBuildObjects = { ...(this.room.roomState.buildObjects) };
      delete updatedBuildObjects[this.selectedObject.userData.id];
      this.room.updateRoomState({
        buildObjects: updatedBuildObjects
      });
      this.room.send({
        type: 'delete_build_object',
        objectId: this.selectedObject.userData.id
      });
    }
    
    this.transformControl.detach();
    this.selectedObject = null;
    document.getElementById('selection-controls').style.display = 'none';
  }
  
  duplicateSelectedObject() {
    if (!this.selectedObject) return;
    
    const duplicatedObject = this.objectCreator.duplicateObject(this.selectedObject);
    if(duplicatedObject) {
        this.advancedBuildObjects.push(duplicatedObject);
        this.selectObject(duplicatedObject);
    }
  }
  
  createObjectFromLibrary(objectType) {
    const newObject = this.objectCreator.createObject(objectType);
    if (newObject) {
      this.advancedBuildObjects.push(newObject);
      this.selectObject(newObject);
    }
  }
  
  syncObjectWithRoom(object) {
    this.objectCreator.syncObjectWithRoom(object);
  }
  
  updateObjectTransform() {
    if (!this.selectedObject || !this.room) return;
    
    const transformData = {
      type: 'transform_object',
      objectId: this.selectedObject.userData.id,
      position: {
        x: this.selectedObject.position.x,
        y: this.selectedObject.position.y,
        z: this.selectedObject.position.z
      },
      rotation: {
        x: this.selectedObject.rotation.x,
        y: this.selectedObject.rotation.y,
        z: this.selectedObject.rotation.z
      },
      scale: {
        x: this.selectedObject.scale.x,
        y: this.selectedObject.scale.y,
        z: this.selectedObject.scale.z
      }
    };
    
    this.room.send(transformData);
    
    if (this.room.roomState.buildObjects && this.selectedObject.userData.id) {
      const updatedBuildObjects = { ...(this.room.roomState.buildObjects) };
      if (updatedBuildObjects[this.selectedObject.userData.id]) {
        updatedBuildObjects[this.selectedObject.userData.id] = {
          ...updatedBuildObjects[this.selectedObject.userData.id],
          position: transformData.position,
          rotation: transformData.rotation,
          scale: transformData.scale
        };
        this.room.updateRoomState({
          buildObjects: updatedBuildObjects
        });
      }
    }
  }
  
  receiveObjectTransform(transformData) {
    if (!transformData || !transformData.objectId) return;
    
    const object = [...this.buildTool.buildObjects, ...this.advancedBuildObjects].find(
      obj => obj.userData.id === transformData.objectId
    );
    
    if (object) {
      object.position.set(
        transformData.position.x,
        transformData.position.y,
        transformData.position.z
      );
      
      object.rotation.set(
        transformData.rotation.x,
        transformData.rotation.y,
        transformData.rotation.z
      );
      
      object.scale.set(
        transformData.scale.x,
        transformData.scale.y,
        transformData.scale.z
      );
    }
  }
  
  receiveBuildObject(buildData) {
    if (!buildData) return;
    
    const existingObject = [...this.buildTool.buildObjects, ...this.advancedBuildObjects].find(
      obj => obj.userData.id === buildData.objectId
    );
    
    if (existingObject) return; 
    
    const buildObject = this.objectCreator.createFromData(buildData);
    
    if (!buildObject) return;

    this.scene.add(buildObject);
    
    if (buildData.isAdvanced) {
      this.advancedBuildObjects.push(buildObject);
    } else {
      this.buildTool.buildObjects.push(buildObject);
    }
  }
  
  receiveDeleteObject(objectId) {
    if (!objectId) return;
    
    const object = [...this.buildTool.buildObjects, ...this.advancedBuildObjects].find(
      obj => obj.userData.id === objectId
    );
    
    if (object) {
      this.scene.remove(object);
      
      const basicBuildIndex = this.buildTool.buildObjects.indexOf(object);
      if (basicBuildIndex !== -1) {
        this.buildTool.buildObjects.splice(basicBuildIndex, 1);
      }
      
      const advancedBuildIndex = this.advancedBuildObjects.indexOf(object);
      if (advancedBuildIndex !== -1) {
        this.advancedBuildObjects.splice(advancedBuildIndex, 1);
      }
      
      if (this.selectedObject === object) {
        this.deselectObject();
      }
    }
  }
  
  setRoom(room) {
    this.room = room;
  }
  
  setOrbitControls(controls) {
    this.orbitControls = controls;
  }
  
  toggleAdvancedBuildMode() {
    this.enabled = !this.enabled;
    
    if (this.enabled) {
      document.getElementById('advanced-build-controls').style.display = 'flex';
      document.getElementById('object-library').style.display = 'flex';
      
      if (document.getElementById('build-controls')) {
        document.getElementById('build-controls').style.display = 'none';
      }
      
      this.buildTool.previewManager.hide();
      
      // Remove existing listener first to avoid duplicates
      this.transformControl.removeEventListener('objectChange', this.onTransformChanged.bind(this));
      this.transformControl.addEventListener('objectChange', this.onTransformChanged.bind(this));
      
      // Make buildTool disabled in advanced mode
      this.buildTool.enabled = false;
    } else {
      document.getElementById('advanced-build-controls').style.display = 'none';
      document.getElementById('object-library').style.display = 'none';
      document.getElementById('selection-controls').style.display = 'none';
      document.getElementById('color-picker').style.display = 'none';
      
      // Remove color picker message if exists
      const message = document.getElementById('color-picker-message');
      if (message) message.remove();
      
      this.colorManager.active = false;
      this.deselectObject();
      
      this.transformControl.removeEventListener('objectChange', this.onTransformChanged.bind(this));
    }
    
    return this.enabled;
  }
  
  onTransformChanged() {
    if (this.selectedObject) {
        /* @tweakable The padding from the edge of the world where object placement is disallowed during transformation. */
        const transformBoundaryPadding = 1.0;
        const halfSize = CLUSTER_SIZE / 2;
        this.selectedObject.position.x = Math.max(-halfSize + transformBoundaryPadding, Math.min(halfSize - transformBoundaryPadding, this.selectedObject.position.x));
        this.selectedObject.position.z = Math.max(-halfSize + transformBoundaryPadding, Math.min(halfSize - transformBoundaryPadding, this.selectedObject.position.z));
    }
    this.updateObjectTransform();
  }
  
  checkExpiredObjects(currentTime, expirationTime) {
    const objectsToRemove = [];
    
    for (let i = 0; i < this.advancedBuildObjects.length; i++) {
      const object = this.advancedBuildObjects[i];
      if (object.userData.createdAt && !object.userData.extendedUntil && 
          (currentTime - object.userData.createdAt > expirationTime)) {
        objectsToRemove.push(object);
      } else if (object.userData.extendedUntil && currentTime > object.userData.extendedUntil) {
        // For objects with extended lifespan, check if extension has expired
        objectsToRemove.push(object);
      }
    }
    
    for (const object of objectsToRemove) {
      this.scene.remove(object);
      
      const index = this.advancedBuildObjects.indexOf(object);
      if (index !== -1) {
        this.advancedBuildObjects.splice(index, 1);
      }
      
      if (this.room && this.room.roomState.buildObjects && object.userData.id) {
        const updatedBuildObjects = { ...(this.room.roomState.buildObjects) };
        delete updatedBuildObjects[object.userData.id];
        this.room.updateRoomState({
          buildObjects: updatedBuildObjects
        });
      }
      
      if (this.selectedObject === object) {
        this.deselectObject();
      }
    }
    
    if (objectsToRemove.length > 0) {
      console.log(`Removed ${objectsToRemove.length} expired advanced build objects`);
    }
  }
  
  toggleColorPicker() {
    this.colorManager.toggleColorPicker();
  }

  pickColorFromObject(object) {
    this.colorManager.pickColorFromObject(object);
  }

  changeObjectColor(color) {
    this.colorManager.changeObjectColor(color);
  }

  receiveObjectColor(colorData) {
    this.colorManager.receiveObjectColor(colorData);
  }

  updateColorPreview() {
    this.colorManager.updateColorPreview();
  }
}
