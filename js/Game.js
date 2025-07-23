import * as THREE from "three";
import { PlayerControls } from "./playerControls.js";
import { createPlayerModel } from "./playerModel.js";
import { ZONE_SIZE, createBarriers, createTrees, createClouds } from "./worldGeneration.js";
import { BuildTool } from "./buildTool.js";
import { AdvancedBuildTool } from "./advancedBuildTool.js";
import { UIManager } from './uiManager.js';
import { CharacterCreator } from './characterCreator.js';
import { MultiplayerManager } from './multiplayerManager.js';
import { ObjectCreator } from './objectCreator.js';
import { InventoryManager } from './inventoryManager.js';
import { NPCManager } from './npcManager.js';
import { InteractionManager } from './interaction.js';
import { AssetReplacementManager } from './assetReplacementManager.js';
import { GridManager } from './gridManager.js';
import { VideoManager } from './videoManager.js';
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import { CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js';
import { Sky } from 'three/addons/objects/Sky.js';
import './npc/NPC.js';
import './npc/ZoneManager.js';
import './npc/NPCSpawner.js';
import { PreviewManager } from './previewManager.js'; 
import { FORCE_MOBILE_MODE } from './controls/constants.js';
import { World } from './world.js';
import { initYoutubePlayer, togglePlayPause, togglePlayPauseKey, setYoutubePlayerUrl, getPlayer } from './youtubePlayer.js';
import { CollisionManager } from './collisionManager.js';


/* @tweakable The target username for the special spawn location. */
const TARGET_SPAWN_USERNAME = "lordtsarcasm";
/* @tweakable The special spawn location coordinates. */
const SPECIAL_SPAWN_LOCATION = { x: 44.1, y: 13.7, z: 21.4 };
/* @tweakable The target username for the post-load teleport. */
const TELEPORT_USERNAME = "lordtsarcasm";
/* @tweakable The coordinates to teleport the user to after their special GLB model loads. */
const TELEPORT_LOCATION = { x: 53.8, y: 14, z: -3.0 };

function getYouTubeID(url) {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

export class Game {
    constructor() {
        this.room = null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.labelRenderer = null;
        this.css3dRenderer = null;
        this.playerControls = null;
        this.playerModel = null;
        this.npcManager = null;
        this.collisionManager = null;
        this.buildTool = null;
        this.advancedBuildTool = null;
        this.multiplayerManager = null;
        this.interactionManager = null;
        this.uiManager = null;
        this.gridManager = null;
        this.videoManager = null;
        this.dirLight = null;
        this.grass = null;
        this.sun = new THREE.Vector3();
    }

    async init() {
        this.room = new WebsimSocket();
        await this.room.initialize();

        const currentUser = await window.websim.getCurrentUser();
        const playerInfo = this.room.peers[this.room.clientId] || {};
        const playerName = playerInfo.username || `Player${Math.floor(Math.random() * 1000)}`;

        let initialPosition;
        if (currentUser && currentUser.username === TARGET_SPAWN_USERNAME) {
            initialPosition = SPECIAL_SPAWN_LOCATION;
        } else {
            initialPosition = { x: (Math.random() * 10) - 5, y: 0.70, z: (Math.random() * 10) - 5 };
        }

        this.setupScene();
        this.collisionManager = new CollisionManager(this.scene);
        this.setupPlayer(playerName, initialPosition);
        this.setupManagers();

        const assetReplacementManager = new AssetReplacementManager({
            playerControls: this.playerControls,
            npcManager: this.npcManager,
            onPlayerModelReplaced: (model) => {
                this.playerModel = model;
                if(this.videoManager) this.videoManager.setPlayerModel(model);
            }
        });

        /* @tweakable The username for which to preload the animated player model. */
        const preloadUsername = "lordtsarcasm";
        if (currentUser && currentUser.username === preloadUsername) {
            /* @tweakable If true, the default procedural model is hidden while the special GLB model loads. */
            const hideDefaultModelDuringLoad = true;
            if (hideDefaultModelDuringLoad) {
                this.playerModel.visible = false;
            }
            
            const loadingStatus = document.getElementById('loading-status');
            if (loadingStatus) loadingStatus.textContent = 'Loading special player model...';
            
            const statusElement = document.createElement('div');
            statusElement.style.marginTop = '10px';
            statusElement.id = 'preload-status';
            document.getElementById('loading-container').appendChild(statusElement);
            assetReplacementManager.setStatusElement(statusElement);

            await assetReplacementManager.preloadAndApplyPlayerModel();
            
            // Teleport after special model load
            if (currentUser.username === TELEPORT_USERNAME) {
                const playerModel = this.playerControls.getPlayerModel();
                playerModel.position.set(TELEPORT_LOCATION.x, TELEPORT_LOCATION.y, TELEPORT_LOCATION.z);
                this.playerControls.velocity.set(0, 0, 0); // Reset velocity
                this.playerControls.lastPosition.copy(playerModel.position);
            }
            
            statusElement.remove();
        }

        this.gridManager = new GridManager(this.scene);
        this.videoManager = new VideoManager(this.scene, this.camera, this.playerModel);

        const matsResponse = await fetch('mats.json');
        const matsData = await matsResponse.json();
        const world = new World(this.scene, this.npcManager, this.room, matsData);
        const worldObjects = world.generate();
        const terrain = worldObjects.terrain;
        this.grass = worldObjects.grass;

        this.playerControls.terrain = terrain;
        this.collisionManager.setTerrain(terrain);
        this.npcManager.initializeSpawner(terrain);

        this.gridManager.create(terrain);
        this.setupBuildTools(terrain);
        this.setupMultiplayer();
        this.setupUI(assetReplacementManager);
        this.setupEventListeners();
        initYoutubePlayer();
        
        this.room.subscribeRoomState((roomState) => {
            if (roomState && roomState.youtubeUrl) {
                setYoutubePlayerUrl(roomState.youtubeUrl);
            }
        });
        
        // Add this to initialize with the current room state
        const currentRoomState = this.room.roomState;
        if(currentRoomState) {
            this.handleRoomStateChange(currentRoomState);
        }

        this.start();

        // Hide loading screen after a short delay to ensure first frame has rendered
        /* @tweakable Delay in milliseconds before hiding the loading screen. */
        const loadingScreenHideDelay = 100;
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.style.display = 'none';
            }
        }, loadingScreenHideDelay);
    }

    setupScene() {
        this.scene = new THREE.Scene();

        // Realistic Sky
        const sky = new Sky();
        /* @tweakable The scale of the sky dome. It should be large enough to encompass the entire scene. */
        const skyScale = 5000;
        sky.scale.setScalar(skyScale);
        this.scene.add(sky);

        this.dirLight = new THREE.DirectionalLight(0xffffff, 3);
        this.dirLight.castShadow = true;
        this.dirLight.shadow.mapSize.width = 1024;
        this.dirLight.shadow.mapSize.height = 1024;
        this.dirLight.shadow.camera.near = 0.5;
        this.dirLight.shadow.camera.far = 500;
        this.dirLight.shadow.camera.left = -100;
        this.dirLight.shadow.camera.right = 100;
        this.dirLight.shadow.camera.top = 100;
        this.dirLight.shadow.camera.bottom = -100;
        this.scene.add(this.dirLight);
        this.scene.add(this.dirLight.target);
        
        const sun = this.sun;
        
        /* @tweakable The turbidity of the sky (haziness). */
        const turbidity = 10;
        /* @tweakable The Rayleigh scattering effect, affects the blue color of the sky. */
        const rayleigh = 2;
        /* @tweakable The Mie coefficient, for haze and light scattering. */
        const mieCoefficient = 0.005;
        /* @tweakable The Mie directional G, for how light scatters directionally. */
        const mieDirectionalG = 0.8;
        /* @tweakable The elevation of the sun in degrees (0 is horizon, 90 is directly overhead). */
        const elevation = 4;
        /* @tweakable The azimuth of the sun in degrees (direction, 0 is North). */
        const azimuth = 180;

        const phi = THREE.MathUtils.degToRad(90 - elevation);
        const theta = THREE.MathUtils.degToRad(azimuth);
        sun.setFromSphericalCoords(1, phi, theta);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.getElementById('game-container').appendChild(this.renderer.domElement);

        this.labelRenderer = new CSS2DRenderer();
        this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
        this.labelRenderer.domElement.style.position = 'absolute';
        this.labelRenderer.domElement.style.top = '0px';
        this.labelRenderer.domElement.style.pointerEvents = 'none';
        document.getElementById('label-container').appendChild(this.labelRenderer.domElement);
        
        this.css3dRenderer = new CSS3DRenderer();
        this.css3dRenderer.setSize(window.innerWidth, window.innerHeight);
        this.css3dRenderer.domElement.style.position = 'absolute';
        this.css3dRenderer.domElement.style.top = '0px';
        document.getElementById('css3d-container').appendChild(this.css3dRenderer.domElement);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const uniforms = sky.material.uniforms;
        uniforms['turbidity'].value = turbidity;
        uniforms['rayleigh'].value = rayleigh;
        uniforms['mieCoefficient'].value = mieCoefficient;
        uniforms['mieDirectionalG'].value = mieDirectionalG;
        uniforms['sunPosition'].value.copy(sun);
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    }

    setupPlayer(playerName, initialPosition) {
        this.playerModel = createPlayerModel(THREE, playerName);
        this.scene.add(this.playerModel);

        this.playerControls = new PlayerControls(this.scene, this.room, {
            renderer: this.renderer,
            initialPosition: initialPosition,
            playerModel: this.playerModel,
            terrain: null,
            collisionManager: this.collisionManager
        });

        this.camera = this.playerControls.getCamera();
        const listener = new THREE.AudioListener();
        this.camera.add(listener);
    }

    setupManagers() {
        this.npcManager = new NPCManager(this.scene, null, this.playerControls);
        this.npcManager.collisionManager = this.collisionManager;
        
        this.interactionManager = new InteractionManager({
            playerControls: this.playerControls,
            npcManager: this.npcManager,
            camera: this.camera,
            renderer: this.renderer
        });
        this.interactionManager.init();
    }

    setupBuildTools(terrain) {
        const objectCreator = new ObjectCreator(this.scene, this.camera, this.room);

        this.buildTool = new BuildTool(this.scene, this.camera, this.playerControls, terrain);
        this.buildTool.setRoom(this.room);
        
        this.advancedBuildTool = new AdvancedBuildTool(this.scene, this.camera, this.renderer, this.buildTool, objectCreator);
        this.advancedBuildTool.setRoom(this.room);
        this.advancedBuildTool.setOrbitControls(this.playerControls.controls);
        objectCreator.buildTool = this.buildTool;
        
        if (this.room.roomState && this.room.roomState.buildObjects) {
            Object.values(this.room.roomState.buildObjects || {}).forEach(buildData => {
                if (buildData.isAdvanced) {
                    this.advancedBuildTool.receiveBuildObject(buildData);
                } else {
                    this.buildTool.receiveBuildObject(buildData);
                }
            });
        }
    }

    setupMultiplayer() {
        this.multiplayerManager = new MultiplayerManager({
            room: this.room,
            scene: this.scene,
            camera: this.camera,
            renderer: this.renderer,
            buildTool: this.buildTool,
            advancedBuildTool: this.advancedBuildTool,
            createPlayerModel: (three, username, spec) => createPlayerModel(three, username, spec),
            playerControls: this.playerControls
        });
        this.multiplayerManager.init();
    }

    setupUI(assetReplacementManager) {
        const characterCreator = new CharacterCreator(
            THREE,
            this.room,
            this.playerControls,
            (newSpec) => {
                this.scene.remove(this.playerModel);
                this.playerModel = createPlayerModel(THREE, this.playerModel.name, newSpec);
                this.scene.add(this.playerModel);
                this.playerControls.playerModel = this.playerModel;
                this.videoManager.setPlayerModel(this.playerModel);
                return this.playerModel;
            }
        );
        
        const inventoryManager = new InventoryManager({ playerControls: this.playerControls });

        this.uiManager = new UIManager({
            playerControls: this.playerControls,
            buildTool: this.buildTool,
            advancedBuildTool: this.advancedBuildTool,
            characterCreator,
            objectCreator: this.advancedBuildTool.objectCreator,
            inventoryManager,
            multiplayerManager: this.multiplayerManager,
            npcManager: this.npcManager,
            assetReplacementManager,
            room: this.room,
            renderer: this.renderer,
            playerModel: this.playerModel,
            dirLight: this.dirLight,
            scene: this.scene,
            gridManager: this.gridManager
        });
        const { inventoryUI } = this.uiManager.init();
        
        inventoryManager.inventoryUI = inventoryUI;
        inventoryManager.init();
    }
    
    setupEventListeners() {
        window.addEventListener('keydown', (event) => {
            if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;

            const key = event.key.toLowerCase();

            if (key === 'g' && !this.advancedBuildTool.enabled) {
                this.gridManager.toggle(this.playerModel.position);
            }

            if (key === togglePlayPauseKey) {
                togglePlayPause();
            }
        });
    }

    start() {
        this.animate();
    }
    
    handleRoomStateChange(roomState) {
        this.videoManager.handleRoomStateChange(roomState);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        const time = performance.now() * 0.001;
        const currentTime = Date.now();
        
        this.playerControls.update();
        if (this.uiManager) this.uiManager.update();

        this.gridManager.update(this.playerModel.position);

        this.interactionManager.update();
        this.npcManager.update();

        if (this.playerModel && this.playerModel.userData.updateAnimations) {
            this.playerModel.userData.updateAnimations(time);
        }

        this.multiplayerManager.updatePlayerLabels();
        
        if (this.dirLight && this.dirLight.castShadow) {
            const lightTargetPosition = this.playerModel.position.clone();
            this.dirLight.position.copy(lightTargetPosition).add(this.sun.clone().multiplyScalar(200));
            this.dirLight.target.position.copy(lightTargetPosition);

            /* @tweakable The size of the area covered by directional light shadows. Smaller values produce sharper shadows but may cause shadows to disappear at the edge of the screen. */
            const shadowFrustumSize = 50;
            this.dirLight.shadow.camera.left = -shadowFrustumSize / 2;
            this.dirLight.shadow.camera.right = shadowFrustumSize / 2;
            this.dirLight.shadow.camera.top = shadowFrustumSize / 2;
            this.dirLight.shadow.camera.bottom = -shadowFrustumSize / 2;
            this.dirLight.shadow.camera.updateProjectionMatrix();
        }
        
        const expirationTime = 50 * 60 * 1000;
        this.buildTool.checkExpiredObjects(currentTime, expirationTime);
        this.advancedBuildTool.checkExpiredObjects(currentTime, expirationTime);
        
        this.videoManager.update();

        if (this.grass && this.grass.material.userData.uniforms) {
            this.grass.material.userData.uniforms.time.value = time;
        }

        this.renderer.render(this.scene, this.camera);
        this.labelRenderer.render(this.scene, this.camera);
        this.css3dRenderer.render(this.scene, this.camera);
    }
}