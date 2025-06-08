import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import nipplejs from 'nipplejs';

class BackroomsGame {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        
        this.clock = new THREE.Clock();
        this.keys = {};
        this.moveVector = new THREE.Vector3();
        this.lookSpeed = 0.002;
        this.lights = []; // Initialize lights array
        this.collidableMeshes = [];
        this.raycaster = new THREE.Raycaster();
        this.collisionDistance = 0.5; // radius around camera to check for collisions
        
        // Audio system
        this.audioListener = new THREE.AudioListener();
        this.footstepAudio = null;
        this.entityAmbientAudio = null;
        this.entityCloseAudio = null;
        this.lastFootstepTime = 0;
        this.footstepInterval = 500; // milliseconds between footsteps
        this.isMoving = false;
        this.entityTimer = 0;
        
        // Multiplayer setup
        this.room = new WebsimSocket();
        this.otherPlayers = new Map();
        this.playerMeshes = new Map();
        this.myPlayerId = null;
        
        // Safe spawn system
        this.safeSpawnPoints = [];
        this.currentSpawnIndex = 0;
        
        // Level system
        this.levels = [
            'assets/models/backrooms_again.glb',
            'assets/models/infinite_corridor.glb',
            'assets/models/interior_building_scene.glb',
            'assets/models/level.glb',
            'assets/models/liminal_space._whats_back_there.glb',
            'assets/models/eyes-dream_core.glb',
            'assets/models/dreamcore_liminal_space.glb',
            'assets/models/back_rooms_walk-thru_virtual_reality.glb',
            'assets/models/the_end.glb'
        ];
        this.currentLevel = 0;
        this.door = null;
        this.doorLight = null;
        
        // Mobile controls
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.joystick = null;
        this.lookPad = null;
        this.touchLook = { x: 0, y: 0 };
        
        // VR controls
        this.isVRMode = false;
        this.deviceOrientation = { alpha: 0, beta: 0, gamma: 0 };
        this.vrButton = null;
        
        // Chat system
        this.chatMessages = [];
        this.chatContainer = null;
        this.chatInput = null;
        this.isChatVisible = true;
        
        // Voice chat
        this.isVoiceChatActive = false;
        this.localStream = null;
        this.peerConnections = new Map();
        this.voiceButton = null;
        
        // Player settings
        this.moveSpeed = 5;
        this.playerHeight = 1.6;
        this.mouseSensitivity = 0.002;
        
        // UI visibility
        this.isUIVisible = true;
        
        /* @tweakable UI fade transition duration in seconds */
        this.uiFadeSpeed = 0.3;
        
        /* @tweakable whether to hide crosshair when UI is hidden */
        this.hideCrosshairWithUI = true;
        
        /* @tweakable whether to hide mobile controls when UI is hidden */
        this.hideMobileControlsWithUI = false;
        
        // Rotation limits
        this.minPolarAngle = 0;
        this.maxPolarAngle = Math.PI;
        this.phi = Math.PI / 2; // start looking straight ahead
        this.theta = 0; // horizontal rotation
        
        this.isPointerLocked = false;
        
        /* @tweakable walking speed multiplier */
        this.walkSpeed = 2.5;
        
        /* @tweakable camera bob intensity during walking */
        this.bobIntensity = 0.05;
        
        /* @tweakable camera bob frequency (how fast the bobbing) */
        this.bobFrequency = 8;
        
        /* @tweakable camera sway amount (side-to-side motion) */
        this.swayAmount = 0.02;
        
        // Walking motion variables
        this.walkTime = 0;
        this.baseY = this.playerHeight;
        this.isWalking = false;
        
        this.init();
    }
    
    async init() {
        this.setupRenderer();
        this.setupCamera();
        this.setupLighting();
        this.setupAudio();
        await this.initializeMultiplayer();
        this.loadBackroomsModel();
        this.setupControls();
        this.setupFullScreen();
        this.setupMobileControls();
        this.setupChat();
        this.setupVoiceChat();
        this.addEventListeners();
        this.animate();
        
        document.getElementById('loading').style.display = 'none';
    }
    
    setupAudio() {
        this.camera.add(this.audioListener);
        
        // Load footstep audio
        const audioLoader = new THREE.AudioLoader();
        
        /* @tweakable footstep volume level */
        this.footstepVolume = 0.8;
        
        /* @tweakable entity ambient sound volume */
        this.entityAmbientVolume = 0.6;
        
        /* @tweakable entity close sound volume */
        this.entityCloseVolume = 1.0;
        
        this.footstepAudio = new THREE.Audio(this.audioListener);
        audioLoader.load('assets/audio/footsteps.mp3', (buffer) => {
            this.footstepAudio.setBuffer(buffer);
            this.footstepAudio.setVolume(this.footstepVolume);
        });
        
        // Load entity ambient audio
        this.entityAmbientAudio = new THREE.Audio(this.audioListener);
        audioLoader.load('assets/audio/entity_ambient.mp3', (buffer) => {
            this.entityAmbientAudio.setBuffer(buffer);
            this.entityAmbientAudio.setVolume(this.entityAmbientVolume);
            this.entityAmbientAudio.setLoop(true);
        });
        
        // Load entity close audio
        this.entityCloseAudio = new THREE.Audio(this.audioListener);
        audioLoader.load('assets/audio/entity_close.mp3', (buffer) => {
            this.entityCloseAudio.setBuffer(buffer);
            this.entityCloseAudio.setVolume(this.entityCloseVolume);
        });
        
        // Start ambient entity sounds
        setTimeout(() => {
            if (this.entityAmbientAudio && this.entityAmbientAudio.buffer) {
                this.entityAmbientAudio.play();
            }
        }, 2000);
    }
    
    playFootstep() {
        const currentTime = Date.now();
        if (currentTime - this.lastFootstepTime > this.footstepInterval && this.footstepAudio && this.footstepAudio.buffer) {
            if (this.footstepAudio.isPlaying) {
                this.footstepAudio.stop();
            }
            this.footstepAudio.play();
            this.lastFootstepTime = currentTime;
        }
    }
    
    triggerEntitySound() {
        if (this.entityCloseAudio && this.entityCloseAudio.buffer) {
            if (this.entityCloseAudio.isPlaying) {
                this.entityCloseAudio.stop();
            }
            this.entityCloseAudio.play();
        }
    }
    
    async initializeMultiplayer() {
        await this.room.initialize();
        this.myPlayerId = this.room.clientId;
        
        // Set initial player state
        this.room.updatePresence({
            x: 0,
            y: this.playerHeight,
            z: 0,
            rotationY: 0,
            level: this.currentLevel,
            username: this.room.peers[this.myPlayerId]?.username || 'Anonymous'
        });
        
        // Subscribe to other players
        this.room.subscribePresence((presence) => {
            this.updateOtherPlayers(presence);
            this.updatePlayerCount();
        });
        
        // Handle level synchronization requests
        this.room.subscribePresenceUpdateRequests((updateRequest, fromClientId) => {
            if (updateRequest.type === 'level_sync' && updateRequest.level !== undefined) {
                // Sync to the requested level if we're behind
                if (updateRequest.level > this.currentLevel) {
                    this.currentLevel = updateRequest.level;
                    this.loadBackroomsModel();
                }
            }
        });
        
        // Handle chat and voice events
        this.room.onmessage = (event) => {
            const data = event.data;
            switch (data.type) {
                case "chat_message":
                    this.addChatMessage(data.username, data.message);
                    break;
                case "voice_offer":
                    this.handleVoiceOffer(data.offer, data.clientId);
                    break;
                case "voice_answer":
                    this.handleVoiceAnswer(data.answer, data.clientId);
                    break;
                case "voice_ice_candidate":
                    this.handleVoiceIceCandidate(data.candidate, data.clientId);
                    break;
            }
        };
    }
    
    updateOtherPlayers(presence) {
        // Remove disconnected players
        for (const [playerId, mesh] of this.playerMeshes) {
            if (!presence[playerId]) {
                this.scene.remove(mesh);
                this.playerMeshes.delete(playerId);
                this.otherPlayers.delete(playerId);
            }
        }
        
        // Update existing players and add new ones
        for (const [playerId, playerData] of Object.entries(presence)) {
            if (playerId === this.myPlayerId) continue;
            
            if (!this.playerMeshes.has(playerId)) {
                // Create new player mesh
                const playerMesh = this.createPlayerMesh(playerData.username);
                this.scene.add(playerMesh);
                this.playerMeshes.set(playerId, playerMesh);
            }
            
            // Update player position
            const mesh = this.playerMeshes.get(playerId);
            if (mesh && playerData.level === this.currentLevel) {
                mesh.position.set(playerData.x, playerData.y, playerData.z);
                mesh.rotation.y = playerData.rotationY;
                mesh.visible = true;
            } else if (mesh) {
                mesh.visible = false; // Hide players on different levels
            }
            
            this.otherPlayers.set(playerId, playerData);
        }
    }
    
    createPlayerMesh(username) {
        const group = new THREE.Group();
        
        // Player body (simple capsule)
        const bodyGeometry = new THREE.CapsuleGeometry(0.3, 1.4, 8, 16);
        const bodyMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x4444ff,
            emissive: 0x001122,
            emissiveIntensity: 0.3
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.7;
        group.add(body);
        
        // Name tag
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, 256, 64);
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(username || 'Player', 128, 35);
        
        const nameTexture = new THREE.CanvasTexture(canvas);
        const nameMaterial = new THREE.MeshBasicMaterial({ 
            map: nameTexture, 
            transparent: true 
        });
        const nameGeometry = new THREE.PlaneGeometry(2, 0.5);
        const nameTag = new THREE.Mesh(nameGeometry, nameMaterial);
        nameTag.position.y = 2.2;
        group.add(nameTag);
        
        return group;
    }
    
    updatePlayerCount() {
        const count = Object.keys(this.room.presence).length;
        document.getElementById('playerCount').textContent = `Players online: ${count}`;
    }
    
    findSafeSpawnPoints() {
        this.safeSpawnPoints = [];
        
        // Test spawn points in a grid pattern
        const gridSize = 20;
        const spacing = 2;
        const testHeight = this.playerHeight;
        
        for (let x = -gridSize; x <= gridSize; x += spacing) {
            for (let z = -gridSize; z <= gridSize; z += spacing) {
                const testPosition = new THREE.Vector3(x, testHeight, z);
                
                // Check if position is safe (no collisions in multiple directions)
                if (this.isPositionSafe(testPosition)) {
                    this.safeSpawnPoints.push(testPosition.clone());
                }
            }
        }
        
        // If no safe points found, add default fallback positions
        if (this.safeSpawnPoints.length === 0) {
            this.safeSpawnPoints = [
                new THREE.Vector3(0, testHeight, 0),
                new THREE.Vector3(2, testHeight, 2),
                new THREE.Vector3(-2, testHeight, 2),
                new THREE.Vector3(2, testHeight, -2),
                new THREE.Vector3(-2, testHeight, -2)
            ];
        }
    }
    
    isPositionSafe(position) {
        const directions = [
            new THREE.Vector3(0, -1, 0), // down
            new THREE.Vector3(0, 1, 0),  // up
            new THREE.Vector3(1, 0, 0),  // right
            new THREE.Vector3(-1, 0, 0), // left
            new THREE.Vector3(0, 0, 1),  // forward
            new THREE.Vector3(0, 0, -1)  // back
        ];
        
        for (const direction of directions) {
            this.raycaster.set(position, direction);
            const intersections = this.raycaster.intersectObjects(this.collidableMeshes, true);
            
            // Must have floor below (within reasonable distance)
            if (direction.y === -1 && (intersections.length === 0 || intersections[0].distance > 2)) {
                return false;
            }
            
            // Must not be inside walls (too close collision in other directions)
            if (direction.y !== -1 && intersections.length > 0 && intersections[0].distance < 1) {
                return false;
            }
        }
        
        return true;
    }
    
    getSafeSpawnPosition() {
        if (this.safeSpawnPoints.length === 0) {
            return new THREE.Vector3(0, this.playerHeight, 0);
        }
        
        // Get next spawn point in rotation to spread players out
        const spawnPoint = this.safeSpawnPoints[this.currentSpawnIndex % this.safeSpawnPoints.length];
        this.currentSpawnIndex++;
        
        return spawnPoint.clone();
    }
    
    setupRenderer() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.getElementById('gameContainer').appendChild(this.renderer.domElement);
    }
    
    setupCamera() {
        this.camera.position.set(0, this.playerHeight, 0);
        this.camera.rotation.order = 'YXZ';
    }
    
    setupLighting() {
        // Ambient light for the eerie backrooms feel
        const ambientLight = new THREE.AmbientLight(0xffff88, 0.6);
        this.scene.add(ambientLight);
        this.lights.push(ambientLight);
        
        // Main directional light
        const directionalLight = new THREE.DirectionalLight(0xffff88, 0.8);
        directionalLight.position.set(0, 10, 0);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
        this.lights.push(directionalLight);
        
        // Create door light
        this.doorLight = new THREE.PointLight(0x00ff88, 2, 10);
        this.doorLight.position.set(0, 2, 10);
        this.scene.add(this.doorLight);
        this.lights.push(this.doorLight);
    }
    
    loadBackroomsModel() {
        // Clear previous level
        this.collidableMeshes = [];
        if (this.door) {
            this.scene.remove(this.door);
        }
        
        // Remove previous model from scene
        const objectsToRemove = [];
        this.scene.traverse((child) => {
            if (child.userData.isLevelModel) {
                objectsToRemove.push(child);
            }
        });
        objectsToRemove.forEach(obj => this.scene.remove(obj));
        
        const loader = new GLTFLoader();
        const modelPath = this.levels[this.currentLevel];
        
        document.getElementById('loading').style.display = 'block';
        document.getElementById('loading').innerHTML = `Loading Level ${this.currentLevel + 1}/${this.levels.length}...`;
        
        loader.load(modelPath, (gltf) => {
            const model = gltf.scene;
            model.scale.set(1, 1, 1);
            model.position.set(0, 0, 0);
            model.userData.isLevelModel = true;
            
            // Enable shadows and add to collision meshes
            model.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    this.collidableMeshes.push(child);
                }
            });
            
            this.scene.add(model);
            
            // Find safe spawn points after model is loaded
            setTimeout(() => {
                this.findSafeSpawnPoints();
                const safePosition = this.getSafeSpawnPosition();
                this.camera.position.copy(safePosition);
                
                // Update player position in multiplayer
                this.room.updatePresence({
                    x: this.camera.position.x,
                    y: this.camera.position.y,
                    z: this.camera.position.z,
                    rotationY: this.theta,
                    level: this.currentLevel
                });
            }, 100);
            
            this.createDoor();
            this.updateLevelUI();
            document.getElementById('loading').style.display = 'none';
        }, undefined, (error) => {
            console.error('Error loading level model:', error);
            document.getElementById('loading').innerHTML = `Error loading level ${this.currentLevel + 1}`;
        });
    }
    
    createRoom(x, z, size, wallMaterial, floorMaterial, ceilingMaterial) {
        const wallHeight = 3;
        const wallThickness = 0.1;
        
        // Floor
        const floorGeometry = new THREE.PlaneGeometry(size, size);
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.set(x + size/2, 0, z + size/2);
        floor.receiveShadow = true;
        this.scene.add(floor);
        
        // Ceiling
        const ceiling = new THREE.Mesh(floorGeometry, ceilingMaterial);
        ceiling.rotation.x = Math.PI / 2;
        ceiling.position.set(x + size/2, wallHeight, z + size/2);
        this.scene.add(ceiling);
        
        // Walls (randomly place some walls to create maze)
        const walls = [
            { pos: [x, wallHeight/2, z + size/2], rot: [0, 0, 0], size: [wallThickness, wallHeight, size] }, // left
            { pos: [x + size, wallHeight/2, z + size/2], rot: [0, 0, 0], size: [wallThickness, wallHeight, size] }, // right
            { pos: [x + size/2, wallHeight/2, z], rot: [0, 0, 0], size: [size, wallHeight, wallThickness] }, // front
            { pos: [x + size/2, wallHeight/2, z + size], rot: [0, 0, 0], size: [size, wallHeight, wallThickness] } // back
        ];
        
        walls.forEach((wallConfig, index) => {
            // Randomly remove some walls to create passages
            if (Math.random() > 0.3) {
                const wallGeometry = new THREE.BoxGeometry(...wallConfig.size);
                const wall = new THREE.Mesh(wallGeometry, wallMaterial);
                wall.position.set(...wallConfig.pos);
                wall.castShadow = true;
                wall.receiveShadow = true;
                this.scene.add(wall);
            }
        });
    }
    
    createWallTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        
        // Create worn, stained wall texture
        ctx.fillStyle = '#d4d4aa';
        ctx.fillRect(0, 0, 256, 256);
        
        // Add stains and wear
        for (let i = 0; i < 20; i++) {
            ctx.fillStyle = `rgba(${120 + Math.random() * 40}, ${100 + Math.random() * 40}, ${60 + Math.random() * 40}, 0.3)`;
            ctx.fillRect(Math.random() * 256, Math.random() * 256, Math.random() * 50, Math.random() * 50);
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(4, 4);
        return texture;
    }
    
    createCarpetTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#8b8b6b';
        ctx.fillRect(0, 0, 256, 256);
        
        // Add carpet pattern
        for (let i = 0; i < 256; i += 4) {
            for (let j = 0; j < 256; j += 4) {
                if ((i + j) % 8 === 0) {
                    ctx.fillStyle = '#7a7a5c';
                    ctx.fillRect(i, j, 2, 2);
                }
            }
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(8, 8);
        return texture;
    }
    
    createCeilingTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#ffffcc';
        ctx.fillRect(0, 0, 256, 256);
        
        // Add ceiling tiles
        for (let i = 0; i < 256; i += 64) {
            for (let j = 0; j < 256; j += 64) {
                ctx.strokeStyle = '#ccccaa';
                ctx.lineWidth = 2;
                ctx.strokeRect(i, j, 64, 64);
            }
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(2, 2);
        return texture;
    }
    
    setupControls() {
        if (!this.isMobile) {
            this.renderer.domElement.addEventListener('click', () => {
                this.renderer.domElement.requestPointerLock();
            });
            
            document.addEventListener('pointerlockchange', () => {
                this.isPointerLocked = document.pointerLockElement === this.renderer.domElement;
            });
        }
    }
    
    setupFullScreen() {
        this.fsButton = document.getElementById('fsToggle');
        this.fsButton.addEventListener('click', () => this.toggleFullScreen());
        
        // Setup UI toggle
        this.uiToggleButton = document.getElementById('uiToggle');
        this.uiToggleHidden = document.getElementById('uiToggleHidden');
        this.uiToggleButton.addEventListener('click', () => this.toggleUI());
        this.uiToggleHidden.addEventListener('click', () => this.toggleUI());
        
        document.addEventListener('fullscreenchange', () => {
            if (document.fullscreenElement) {
                this.fsButton.textContent = 'Exit Fullscreen';
            } else {
                this.fsButton.textContent = 'Enter Fullscreen';
            }
        });
    }
    
    toggleFullScreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            document.exitFullscreen();
        }
    }
    
    setupMobileControls() {
        if (this.isMobile) {
            // Setup VR toggle button
            this.vrButton = document.getElementById('vrToggle');
            this.vrButton.style.display = 'block';
            this.vrButton.addEventListener('click', () => this.toggleVR());
            
            // Movement joystick
            this.joystick = nipplejs.create({
                zone: document.getElementById('joystick'),
                mode: 'static',
                position: { left: '50%', top: '50%' },
                color: 'white',
                size: 100
            });
            
            this.joystick.on('move', (evt, nipple) => {
                const forward = -nipple.vector.y;
                const right = nipple.vector.x;
                this.moveVector.set(right, 0, forward).normalize();
            });
            
            this.joystick.on('end', () => {
                this.moveVector.set(0, 0, 0);
            });
            
            // Look pad
            const lookPad = document.getElementById('lookPad');
            let isLooking = false;
            let lastTouch = { x: 0, y: 0 };
            
            lookPad.addEventListener('touchstart', (e) => {
                e.preventDefault();
                isLooking = true;
                const touch = e.touches[0];
                lastTouch.x = touch.clientX;
                lastTouch.y = touch.clientY;
            });
            
            lookPad.addEventListener('touchmove', (e) => {
                e.preventDefault();
                if (!isLooking) return;
                
                // Skip touch look if in VR mode
                if (this.isVRMode) return;
                
                const touch = e.touches[0];
                const deltaX = touch.clientX - lastTouch.x;
                const deltaY = touch.clientY - lastTouch.y;
                
                this.theta -= deltaX * this.lookSpeed;
                this.phi += deltaY * this.lookSpeed;
                this.phi = Math.max(0.1, Math.min(Math.PI - 0.1, this.phi));
                
                lastTouch.x = touch.clientX;
                lastTouch.y = touch.clientY;
            });
            
            lookPad.addEventListener('touchend', () => {
                isLooking = false;
            });
        }
    }
    
    async toggleVR() {
        if (!this.isVRMode) {
            // Request device orientation permission on iOS
            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                const permission = await DeviceOrientationEvent.requestPermission();
                if (permission !== 'granted') {
                    alert('Device orientation permission denied');
                    return;
                }
            }
            
            this.isVRMode = true;
            this.vrButton.textContent = 'Disable VR';
            
            // Hide look pad in VR mode
            document.getElementById('lookPad').style.display = 'none';
            
            // Add device orientation listener
            window.addEventListener('deviceorientation', (e) => this.onDeviceOrientation(e));
        } else {
            this.isVRMode = false;
            this.vrButton.textContent = 'Enable VR';
            
            // Show look pad
            document.getElementById('lookPad').style.display = 'block';
            
            // Remove device orientation listener
            window.removeEventListener('deviceorientation', this.onDeviceOrientation);
        }
    }
    
    onDeviceOrientation(event) {
        if (!this.isVRMode) return;
        
        // Convert device orientation to camera rotation
        const alpha = event.alpha ? THREE.MathUtils.degToRad(event.alpha) : 0; // Z axis
        const beta = event.beta ? THREE.MathUtils.degToRad(event.beta) : 0;   // X axis
        const gamma = event.gamma ? THREE.MathUtils.degToRad(event.gamma) : 0; // Y axis
        
        // Apply orientation to camera (adjust for landscape mode)
        this.theta = alpha;
        this.phi = Math.PI / 2 + beta;
        
        // Clamp vertical rotation
        this.phi = Math.max(0.1, Math.min(Math.PI - 0.1, this.phi));
    }
    
    addEventListeners() {
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Add hotkey for UI toggle
        document.addEventListener('keydown', (e) => {
            // Don't trigger UI toggle when typing in chat
            if (this.isChatFocused) return;
            
            if (e.key.toLowerCase() === 'u') {
                this.toggleUI();
            }
        });
        
        // Mouse look controls for desktop
        document.addEventListener('mousemove', (e) => {
            if (this.isPointerLocked && !this.isMobile) {
                /* @tweakable horizontal mouse look sensitivity */
                const horizontalSensitivity = 0.002;
                
                /* @tweakable vertical mouse look sensitivity */
                const verticalSensitivity = 0.002;
                
                this.theta -= e.movementX * horizontalSensitivity;
                this.phi += e.movementY * verticalSensitivity;
                
                // Clamp vertical rotation to prevent over-rotation
                this.phi = Math.max(0.1, Math.min(Math.PI - 0.1, this.phi));
            }
        });
        
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
        
        // Prevent movement when typing in chat
        document.addEventListener('keydown', (e) => {
            if (this.isChatFocused) {
                e.stopPropagation();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            if (this.isChatFocused) {
                e.stopPropagation();
            }
        });
    }
    
    updateControls() {
        const delta = this.clock.getDelta();
        
        // Don't process movement if typing in chat
        if (this.isChatFocused) return;
        
        if (!this.isMobile) {
            // Desktop movement
            this.moveVector.set(0, 0, 0);
            
            if (this.keys['w']) this.moveVector.z -= 1;
            if (this.keys['s']) this.moveVector.z += 1;
            if (this.keys['a']) this.moveVector.x -= 1;
            if (this.keys['d']) this.moveVector.x += 1;
            
            this.moveVector.normalize();
        }
        
        // Track if player is moving for footstep sounds
        this.isMoving = this.moveVector.length() > 0;
        this.isWalking = this.isMoving;
        
        // Apply movement with collision detection
        if (this.moveVector.length() > 0) {
            const moveDistance = this.walkSpeed * delta;
            
            // Get camera's forward and right vectors
            const cameraDirection = new THREE.Vector3();
            this.camera.getWorldDirection(cameraDirection);
            
            const cameraRight = new THREE.Vector3();
            cameraRight.crossVectors(cameraDirection, this.camera.up).normalize();
            
            // Calculate movement direction based on camera orientation
            const directionVec = new THREE.Vector3();
            directionVec.addScaledVector(cameraRight, this.moveVector.x);
            directionVec.addScaledVector(cameraDirection, -this.moveVector.z);
            directionVec.y = 0; // Keep movement horizontal
            directionVec.normalize();
            
            // Check for collisions ahead
            this.raycaster.set(this.camera.position, directionVec);
            const intersections = this.raycaster.intersectObjects(this.collidableMeshes, true);
            if (intersections.length === 0 || intersections[0].distance > moveDistance + this.collisionDistance) {
                // Safe to move
                this.camera.position.addScaledVector(directionVec, moveDistance);
                
                // Play footstep sound while moving
                this.playFootstep();
                
                // Update walk time for bobbing animation
                this.walkTime += delta * this.bobFrequency;
                
                // Update multiplayer position
                this.room.updatePresence({
                    x: this.camera.position.x,
                    y: this.camera.position.y,
                    z: this.camera.position.z,
                    rotationY: this.theta,
                    level: this.currentLevel
                });
            }
        }
        
        // Apply walking motion (camera bob and sway)
        this.updateWalkingMotion();
        
        // Check door collision
        this.checkDoorCollision();
        
        // Apply camera rotation
        this.camera.rotation.y = this.theta;
        this.camera.rotation.x = this.phi - Math.PI / 2;
    }
    
    updateWalkingMotion() {
        if (this.isWalking) {
            // Camera bobbing (vertical movement)
            const bobOffset = Math.sin(this.walkTime) * this.bobIntensity;
            this.camera.position.y = this.baseY + bobOffset;
            
            // Camera swaying (horizontal movement)
            const swayOffset = Math.cos(this.walkTime * 0.5) * this.swayAmount;
            
            // Apply sway to camera rotation for subtle side-to-side movement
            this.camera.rotation.z = swayOffset;
        } else {
            // Smoothly return to base position when not walking
            this.camera.position.y = THREE.MathUtils.lerp(this.camera.position.y, this.baseY, 0.1);
            this.camera.rotation.z = THREE.MathUtils.lerp(this.camera.rotation.z, 0, 0.1);
            this.walkTime = 0;
        }
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    toggleUI() {
        this.isUIVisible = !this.isUIVisible;
        
        const uiElements = [
            document.getElementById('instructions'),
            document.getElementById('chatContainer'),
            document.getElementById('voiceContainer')
        ];
        
        // Optional elements that might not exist
        const crosshair = document.getElementById('crosshair');
        const mobileControls = document.getElementById('mobileControls');
        
        if (this.isUIVisible) {
            // Show UI
            uiElements.forEach(element => {
                if (element) {
                    element.classList.remove('ui-hidden');
                    element.classList.add('ui-visible');
                }
            });
            
            if (crosshair && this.hideCrosshairWithUI) {
                crosshair.classList.remove('ui-hidden');
                crosshair.classList.add('ui-visible');
            }
            
            if (mobileControls && !this.hideMobileControlsWithUI) {
                mobileControls.classList.remove('ui-hidden');
                mobileControls.classList.add('ui-visible');
            }
            
            this.uiToggleButton.textContent = 'Hide UI';
            this.uiToggleHidden.style.display = 'none';
        } else {
            // Hide UI
            uiElements.forEach(element => {
                if (element) {
                    element.classList.remove('ui-visible');
                    element.classList.add('ui-hidden');
                }
            });
            
            if (crosshair && this.hideCrosshairWithUI) {
                crosshair.classList.remove('ui-visible');
                crosshair.classList.add('ui-hidden');
            }
            
            if (mobileControls && !this.hideMobileControlsWithUI) {
                mobileControls.classList.remove('ui-visible');
                mobileControls.classList.add('ui-hidden');
            }
            
            this.uiToggleButton.textContent = 'Show UI';
            this.uiToggleHidden.style.display = 'block';
        }
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        this.updateControls();
        
        // Entity sound effects timer
        this.entityTimer += this.clock.getDelta();
        if (this.entityTimer > 15 + Math.random() * 20) { // Random entity sounds every 15-35 seconds
            this.triggerEntitySound();
            this.entityTimer = 0;
        }
        
        // Add subtle light flickering for atmosphere
        this.lights.forEach(light => {
            if (light === this.doorLight) {
                // Make door light pulse
                light.intensity = 1.5 + Math.sin(Date.now() * 0.005) * 0.5;
            } else {
                light.intensity = 0.8 + Math.random() * 0.4;
            }
        });
        
        // Rotate door slightly for effect
        if (this.door) {
            this.door.rotation.y += 0.005;
        }
        
        // Update name tag orientations to face camera
        this.playerMeshes.forEach(mesh => {
            const nameTag = mesh.children.find(child => child.material && child.material.map);
            if (nameTag) {
                nameTag.lookAt(this.camera.position);
            }
        });
        
        this.renderer.render(this.scene, this.camera);
    }
    
    createDoor() {
        // Don't create door on the last level
        if (this.currentLevel >= this.levels.length - 1) return;
        
        // Create glowing door
        const doorGeometry = new THREE.BoxGeometry(1.5, 3, 0.2);
        const doorMaterial = new THREE.MeshStandardMaterial({
            color: 0x00ff88,
            emissive: 0x004422,
            emissiveIntensity: 0.5,
            metalness: 0.1,
            roughness: 0.3
        });
        
        this.door = new THREE.Mesh(doorGeometry, doorMaterial);
        this.door.position.set(0, 1.5, 10);
        this.door.userData.isDoor = true;
        this.scene.add(this.door);
        
        // Position door light
        this.doorLight.position.copy(this.door.position);
        this.doorLight.position.z += 1;
    }
    
    updateLevelUI() {
        const instructions = document.getElementById('instructions');
        const levelInfo = instructions.querySelector('.level-info') || document.createElement('div');
        levelInfo.className = 'level-info';
        levelInfo.innerHTML = `Level ${this.currentLevel + 1}/${this.levels.length}`;
        levelInfo.style.color = '#00ff88';
        levelInfo.style.fontSize = '16px';
        levelInfo.style.fontWeight = 'bold';
        if (!instructions.querySelector('.level-info')) {
            instructions.appendChild(levelInfo);
        }
    }
    
    checkDoorCollision() {
        if (!this.door) return;
        
        const distance = this.camera.position.distanceTo(this.door.position);
        if (distance < 2) {
            this.nextLevel();
        }
    }
    
    nextLevel() {
        if (this.currentLevel < this.levels.length - 1) {
            this.currentLevel++;
            const safePosition = this.getSafeSpawnPosition();
            this.camera.position.copy(safePosition);
            this.theta = 0; // Reset rotation
            this.phi = Math.PI / 2;
            
            // Request other players to sync to this level
            Object.keys(this.room.presence).forEach(playerId => {
                if (playerId !== this.myPlayerId) {
                    this.room.requestPresenceUpdate(playerId, {
                        type: 'level_sync',
                        level: this.currentLevel
                    });
                }
            });
            
            this.loadBackroomsModel();
        }
    }
    
    setupChat() {
        this.chatContainer = document.getElementById('chatContainer');
        this.chatInput = document.getElementById('chatInput');
        this.chatMessages = document.getElementById('chatMessages');
        
        const chatToggle = document.getElementById('chatToggle');
        chatToggle.addEventListener('click', () => this.toggleChat());
        
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && this.chatInput.value.trim()) {
                this.sendChatMessage(this.chatInput.value.trim());
                this.chatInput.value = '';
            }
        });
        
        // Prevent game controls when typing in chat
        this.chatInput.addEventListener('focus', () => {
            this.isChatFocused = true;
        });
        
        this.chatInput.addEventListener('blur', () => {
            this.isChatFocused = false;
        });
    }
    
    setupVoiceChat() {
        this.voiceButton = document.getElementById('voiceToggle');
        
        // Push to talk
        this.voiceButton.addEventListener('mousedown', () => this.startVoiceChat());
        this.voiceButton.addEventListener('mouseup', () => this.stopVoiceChat());
        this.voiceButton.addEventListener('touchstart', () => this.startVoiceChat());
        this.voiceButton.addEventListener('touchend', () => this.stopVoiceChat());
    }
    
    toggleChat() {
        this.isChatVisible = !this.isChatVisible;
        const chatToggle = document.getElementById('chatToggle');
        
        if (this.isChatVisible) {
            this.chatMessages.style.display = 'block';
            document.getElementById('chatInputContainer').style.display = 'flex';
            chatToggle.textContent = 'Hide Chat';
        } else {
            this.chatMessages.style.display = 'none';
            document.getElementById('chatInputContainer').style.display = 'none';
            chatToggle.textContent = 'Show Chat';
        }
    }
    
    sendChatMessage(message) {
        const username = this.room.peers[this.myPlayerId]?.username || 'Anonymous';
        
        // Send to all players
        this.room.send({
            type: 'chat_message',
            username: username,
            message: message,
            echo: true
        });
    }
    
    addChatMessage(username, message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'chat-message';
        messageElement.innerHTML = `<span class="username">${username}:</span> <span class="text">${message}</span>`;
        
        this.chatMessages.appendChild(messageElement);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        
        // Limit chat history to 50 messages
        while (this.chatMessages.children.length > 50) {
            this.chatMessages.removeChild(this.chatMessages.firstChild);
        }
    }
    
    async startVoiceChat() {
        if (this.isVoiceChatActive) return;
        
        try {
            this.localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.isVoiceChatActive = true;
            this.voiceButton.classList.add('active');
            this.voiceButton.textContent = '🎤 Speaking...';
            
            // Create peer connections for all other players
            Object.keys(this.room.presence).forEach(playerId => {
                if (playerId !== this.myPlayerId) {
                    this.createPeerConnection(playerId);
                }
            });
            
        } catch (error) {
            console.error('Error accessing microphone:', error);
            this.addChatMessage('System', 'Microphone access denied');
        }
    }
    
    stopVoiceChat() {
        if (!this.isVoiceChatActive) return;
        
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop());
            this.localStream = null;
        }
        
        // Close all peer connections
        this.peerConnections.forEach(pc => pc.close());
        this.peerConnections.clear();
        
        this.isVoiceChatActive = false;
        this.voiceButton.classList.remove('active');
        this.voiceButton.textContent = '🎤 Push to Talk';
    }
    
    async createPeerConnection(playerId) {
        const pc = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });
        
        this.peerConnections.set(playerId, pc);
        
        // Add local stream
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => {
                pc.addTrack(track, this.localStream);
            });
        }
        
        // Handle incoming stream
        pc.ontrack = (event) => {
            const audio = new Audio();
            audio.srcObject = event.streams[0];
            audio.play().catch(e => console.log('Audio autoplay failed:', e));
        };
        
        // Handle ICE candidates
        pc.onicecandidate = (event) => {
            if (event.candidate) {
                this.room.send({
                    type: 'voice_ice_candidate',
                    candidate: event.candidate,
                    targetId: playerId,
                    echo: false
                });
            }
        };
        
        // Create offer
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        
        this.room.send({
            type: 'voice_offer',
            offer: offer,
            targetId: playerId,
            echo: false
        });
    }
    
    async handleVoiceOffer(offer, fromClientId) {
        const pc = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });
        
        this.peerConnections.set(fromClientId, pc);
        
        // Handle incoming stream
        pc.ontrack = (event) => {
            const audio = new Audio();
            audio.srcObject = event.streams[0];
            audio.play().catch(e => console.log('Audio autoplay failed:', e));
        };
        
        // Handle ICE candidates
        pc.onicecandidate = (event) => {
            if (event.candidate) {
                this.room.send({
                    type: 'voice_ice_candidate',
                    candidate: event.candidate,
                    targetId: fromClientId,
                    echo: false
                });
            }
        };
        
        await pc.setRemoteDescription(offer);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        
        this.room.send({
            type: 'voice_answer',
            answer: answer,
            targetId: fromClientId,
            echo: false
        });
    }
    
    async handleVoiceAnswer(answer, fromClientId) {
        const pc = this.peerConnections.get(fromClientId);
        if (pc) {
            await pc.setRemoteDescription(answer);
        }
    }
    
    async handleVoiceIceCandidate(candidate, fromClientId) {
        const pc = this.peerConnections.get(fromClientId);
        if (pc) {
            await pc.addIceCandidate(candidate);
        }
    }
}

// Start the game
new BackroomsGame();