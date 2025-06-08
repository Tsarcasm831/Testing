import * as THREE from "three";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// Movement constants
const SPEED = 0.08;
const GRAVITY = 0.01;
const JUMP_FORCE = 0.25;
const MOBILE_SPEED_MULTIPLIER = 1.0;

export class PlayerControls {
  constructor(scene, room, options = {}) {
    this.scene = scene;
    this.room = room;
    this.camera = options.camera || new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = options.renderer;
    this.domElement = this.renderer ? this.renderer.domElement : document.body;
    this.playerModel = options.playerModel;
    this.lastPosition = new THREE.Vector3();
    this.isMoving = false;
    
    // Player state
    this.velocity = new THREE.Vector3();
    this.canJump = true;
    this.keysPressed = new Set();
    this.isMobile = /Android|webOS|iPhone|iPad|Pod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Mobile control variables
    this.joystick = null;
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchSensitivity = 0.005;
    this.moveVector = { x: 0, z: 0 };
    this.jumpButtonPressed = false;
    this.moveForward = 0;
    this.moveRight = 0;
    
    // Initial player position
    const initialPos = options.initialPosition || { x: 0, y: 1.0, z: 0 }; 
    this.playerX = initialPos.x;
    this.playerY = initialPos.y;
    this.playerZ = initialPos.z;
    
    // Set initial player model position if it exists
    if (this.playerModel) {
      this.playerModel.position.set(this.playerX, this.playerY, this.playerZ);
      this.lastPosition.set(this.playerX, this.playerY, this.playerZ);
    }
    
    // Set camera to third-person perspective
    this.camera.position.set(this.playerX, this.playerY + 2, this.playerZ + 5);
    this.camera.lookAt(this.playerX, this.playerY + 1, this.playerZ);
    this.cameraOffset = new THREE.Vector3();
    this.cameraOffset.copy(this.camera.position).sub(new THREE.Vector3(this.playerX, this.playerY + 1, this.playerZ));
    
    // Initialize controls based on device
    this.initializeControls();
    
    // Setup event listeners
    this.setupEventListeners();
    
    // If room is provided, initialize multiplayer presence
    if (this.room) {
      this.room.updatePresence({
        x: this.playerX,
        y: this.playerY,
        z: this.playerZ,
        rotation: 0,
        moving: false
      });
    }
    
    this.enabled = true; 
  }
  
  initializeControls() {
    if (this.isMobile) {
      this.initializeMobileControls();
    } else {
      this.initializeDesktopControls();
    }
  }
  
  initializeDesktopControls() {
    this.controls = new OrbitControls(this.camera, this.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.1;
    this.controls.maxPolarAngle = Math.PI * 0.9; 
    this.controls.minDistance = 3; 
    this.controls.maxDistance = 10; 
    
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isSafari) {
      this.controls.rotateSpeed = 2.0; 
    }
    
    const instructionsDiv = document.createElement("div");
    instructionsDiv.className = "instructions";
    instructionsDiv.innerHTML = "Click to begin. <br>Use WASD to move, Space to jump.";
    document.getElementById('game-container').appendChild(instructionsDiv);
    
    document.addEventListener('click', () => {
      if (document.querySelector(".instructions")) {
        document.querySelector(".instructions").style.display = 'none';
      }
    }, { once: true });
    
    this.controls.addEventListener('change', () => {
      this.cameraOffset.copy(this.camera.position).sub(this.controls.target);
    });
  }
  
  initializeMobileControls() {
    this.camera.position.set(this.playerX, this.playerY + 2, this.playerZ + 5);
    this.camera.lookAt(this.playerX, this.playerY + 1, this.playerZ);
    
    this.controls = new OrbitControls(this.camera, this.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.1;
    this.controls.maxPolarAngle = Math.PI * 0.9; 
    this.controls.minDistance = 3; 
    this.controls.maxDistance = 10; 
    
    this.cameraOffset = new THREE.Vector3();
    this.cameraOffset.copy(this.camera.position).sub(new THREE.Vector3(this.playerX, this.playerY + 1, this.playerZ));
    
    this.controls.addEventListener('change', () => {
      this.cameraOffset.copy(this.camera.position).sub(this.controls.target);
    });
    
    const joystickContainer = document.getElementById('joystick-container');
    if (!joystickContainer) {
      const newJoystickContainer = document.createElement('div');
      newJoystickContainer.id = 'joystick-container';
      document.body.appendChild(newJoystickContainer);
    }
    
    const jumpButton = document.getElementById('jump-button');
    if (!jumpButton) {
      const newJumpButton = document.createElement('div');
      newJumpButton.id = 'jump-button';
      newJumpButton.innerText = 'JUMP';
      document.body.appendChild(newJumpButton);
    }
    
    document.getElementById('jump-button').addEventListener('touchstart', (event) => {
      this.jumpButtonPressed = true;
      if (this.canJump) {
        this.velocity.y = JUMP_FORCE;
        this.canJump = false;
      }
      event.preventDefault();
    });
    
    document.getElementById('jump-button').addEventListener('touchend', (event) => {
      this.jumpButtonPressed = false;
      event.preventDefault();
    });
    
    this.joystick = nipplejs.create({
      zone: document.getElementById('joystick-container'),
      mode: 'static',
      position: { left: '50%', top: '50%' },
      color: 'rgba(255, 255, 255, 0.5)',
      size: 120
    });
    
    this.joystick.on('move', (evt, data) => {
      const force = Math.min(data.force, 1); 
      const angle = data.angle.radian;
      
      this.moveForward = -Math.sin(angle) * force * SPEED * 5; 
      this.moveRight = Math.cos(angle) * force * SPEED * 5;    
    });
    
    this.joystick.on('end', () => {
      console.log('Joystick released');
      this.moveForward = 0;
      this.moveRight = 0;
    });
  }
  
  setupEventListeners() {
    document.addEventListener("keydown", (e) => {
      this.keysPressed.add(e.key.toLowerCase());
      
      if (e.key === " " && this.canJump) {
        this.velocity.y = JUMP_FORCE;
        this.canJump = false;
      }
    });

    document.addEventListener("keyup", (e) => {
      this.keysPressed.delete(e.key.toLowerCase());
    });
    
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      if (this.renderer) {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
      }
    });
  }
  
  processMovement() {
    if (!this.enabled) return;
    
    let x = this.playerModel ? this.playerModel.position.x : this.camera.position.x;
    let y = this.playerModel ? this.playerModel.position.y : (this.camera.position.y - 1.2);
    let z = this.playerModel ? this.playerModel.position.z : this.camera.position.z;
    
    const moveDirection = new THREE.Vector3(0, 0, 0);
    
    if (this.isMobile) {
      if (this.moveForward !== 0 || this.moveRight !== 0) {
        const forward = new THREE.Vector3();
        this.camera.getWorldDirection(forward);
        forward.y = 0;
        forward.normalize();
        
        const right = new THREE.Vector3(-forward.z, 0, forward.x);
        
        moveDirection.addScaledVector(forward, -this.moveForward); 
        moveDirection.addScaledVector(right, this.moveRight);
        moveDirection.normalize().multiplyScalar(SPEED * MOBILE_SPEED_MULTIPLIER); 
      }
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
    }
    
    if (!this.isMobile && moveDirection.length() > 0) {
      moveDirection.normalize();
    }
    
    const cameraDirection = new THREE.Vector3();
    this.camera.getWorldDirection(cameraDirection);
    cameraDirection.y = 0; 
    cameraDirection.normalize();
    
    const rightVector = new THREE.Vector3();
    rightVector.crossVectors(this.camera.up, cameraDirection).normalize();
    
    const movement = new THREE.Vector3();
    if (!this.isMobile) {
      if (moveDirection.z !== 0) {
        movement.add(cameraDirection.clone().multiplyScalar(moveDirection.z));
      }
      if (moveDirection.x !== 0) {
        movement.add(rightVector.clone().multiplyScalar(moveDirection.x));
      }
      
      if (movement.length() > 0) {
        movement.normalize().multiplyScalar(SPEED);
      }
    } else {
      movement.copy(moveDirection);
    }
    
    this.velocity.y -= GRAVITY;
    
    let newX = x + movement.x;
    let newY = y + this.velocity.y;
    let newZ = z + movement.z;
    
    const barrierObjects = [];
    this.scene.traverse((child) => {
        if (child.userData && child.userData.isBarrier) {
            barrierObjects.push(child);
        }
    });

    const playerRadius = 0.3;
    const playerHeight = 1.8;
    
    let standingOnBlock = false;
    
    barrierObjects.forEach(barrier => {
        const barrierBox = new THREE.Box3().setFromObject(barrier);
        const barrierSize = new THREE.Vector3();
        barrierBox.getSize(barrierSize);

        if (
            Math.abs(newX - barrier.position.x) < (barrierSize.x / 2 + playerRadius) &&
            Math.abs(newZ - barrier.position.z) < (barrierSize.z / 2 + playerRadius) &&
            newY < barrier.position.y + barrierSize.y / 2 + playerHeight / 2 && 
            newY + playerHeight > barrier.position.y - barrierSize.y / 2 
        ) {
            if (this.velocity.y <= 0 && Math.abs(y - (barrier.position.y + barrierSize.y / 2)) < 0.2) {
                 standingOnBlock = true;
                 newY = barrier.position.y + barrierSize.y / 2 + 0.01; 
                 this.velocity.y = 0;
                 this.canJump = true;
             }
             else if (Math.abs(y - (barrier.position.y + barrierSize.y / 2)) >= 0.2) { 
                if (Math.abs(movement.x) > 0 && Math.abs(newX - barrier.position.x) < (barrierSize.x / 2 + playerRadius)) {
                   newX = x; 
                }
                if (Math.abs(movement.z) > 0 && Math.abs(newZ - barrier.position.z) < (barrierSize.z / 2 + playerRadius)) {
                   newZ = z; 
                }
            }
        }
    });
    
    if (newY < -5) {
        newX = this.playerX;
        newY = this.playerY;
        newZ = this.playerZ;
        this.velocity.y = 0;
        this.canJump = true;
        console.warn("Player fell out of bounds, resetting position.");
    } else if (newY <= 0.01 && !standingOnBlock) { 
        newY = 0.01; 
        this.velocity.y = 0;
        this.canJump = true;
    }

    
    const isMovingNow = movement.length() > 0;
    this.isMoving = isMovingNow;
    
    if (this.playerModel) {
      this.playerModel.position.set(newX, newY, newZ);
      
      if (movement.length() > 0) {
        const angle = Math.atan2(movement.x, movement.z);
        this.playerModel.rotation.y = angle;
        
        const leftLeg = this.playerModel.getObjectByName("leftLeg");
        const rightLeg = this.playerModel.getObjectByName("rightLeg");
        
        if (leftLeg && rightLeg) {
          const walkSpeed = 5; 
          const walkAmplitude = 0.3;
          this.time = (performance.now() * 0.01) % 1000; 
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
      
      const newTarget = new THREE.Vector3(this.playerModel.position.x, this.playerModel.position.y + 1, this.playerModel.position.z);
      if (this.controls) {
        this.controls.target.copy(newTarget);
      }
      this.camera.position.copy(newTarget).add(this.cameraOffset);
      
      if (this.room && (
          Math.abs(this.lastPosition.x - newX) > 0.01 ||
          Math.abs(this.lastPosition.y - newY) > 0.01 ||
          Math.abs(this.lastPosition.z - newZ) > 0.01 ||
          this.isMoving !== this.wasMoving
        )) {
        this.room.updatePresence({
          x: newX,
          y: newY,
          z: newZ,
          rotation: this.playerModel.rotation.y,
          moving: this.isMoving
        });
        
        this.lastPosition.set(newX, newY, newZ);
        this.wasMoving = this.isMoving;
      }
    } else {
      this.camera.position.set(newX, newY + 1.2, newZ);
    }
    
    if (this.isMobile && this.controls) {
      this.controls.target.set(newX, newY + 1, newZ);
      this.controls.update();
    } else if (!this.isMobile && this.controls) {
      this.controls.update();
    }
  }
  
  update() {
    if (this.enabled) {
      this.processMovement();
    }
    
    if (this.controls) {
      this.controls.update();
    }
  }
  
  getCamera() {
    return this.camera;
  }
  
  getPlayerModel() {
    return this.playerModel;
  }
}