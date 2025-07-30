import * as THREE from "three";
import { AssetReplacementManager } from './assetReplacementManager.js';
import { GridManager } from './gridManager.js';
import { VideoManager } from './videoManager.js';
import './npc/NPC.js';
import './npc/ZoneManager.js';
import './npc/NPCSpawner.js';
import { FORCE_MOBILE_MODE } from './controls/constants.js';
import { World } from './world.js';
import { initYoutubePlayer, togglePlayPause, togglePlayPauseKey, setYoutubePlayerUrl } from './youtubePlayer.js';
import { CollisionManager } from './collisionManager.js';
import { TARGET_SPAWN_USERNAME, SPECIAL_SPAWN_LOCATION, TELEPORT_USERNAME, TELEPORT_LOCATION } from './game/constants.js';
import { setupScene } from './game/setupScene.js';
import { setupPlayer } from './game/setupPlayer.js';
import { setupManagers } from './game/setupManagers.js';
import { setupBuildTools } from './game/setupBuildTools.js';
import { setupMultiplayer } from './game/setupMultiplayer.js';
import { setupUI } from './game/setupUI.js';
import { setupEventListeners } from './game/setupEventListeners.js';
import { updateDayNightCycle } from './game/updateDayNightCycle.js';
import { cacheAssetLists } from './assetListCache.js';

/* @tweakable The lifespan of built objects in milliseconds. Default is 50 minutes. */
const OBJECT_EXPIRATION_MS = 50 * 60 * 1000;

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
        this.sky = null;
        this.ambientLight = null;
    }

    async init(shouldPreloadAssets = true) {
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
        this.setupPlayer(playerName, initialPosition, currentUser);
        this.setupManagers();

        await cacheAssetLists([
            'assets/external_lists/claddingAndSiding.json',
            'assets/external_lists/interior.json',
            'assets/external_lists/roofing.json',
            'assets/external_lists/structural.json',
            'assets/external_lists/walls.json'
        ]);

        const assetReplacementManager = new AssetReplacementManager({
            playerControls: this.playerControls,
            npcManager: this.npcManager,
            onPlayerModelReplaced: (model) => {
                this.playerModel = model;
                if(this.videoManager) this.videoManager.setPlayerModel(model);
            }
        });

        const loadingStatus = document.getElementById('loading-status');
        const progressBar = document.getElementById('progress-bar');
        assetReplacementManager.setStatusElement(loadingStatus, progressBar);

        /* @tweakable This is now controlled by a checkbox on the start screen. */
        if (shouldPreloadAssets) {
            await assetReplacementManager.preloadAllGameAssets();
        }

        /* @tweakable The username for which to preload the animated player model. */
        const preloadUsername = "lordtsarcasm";
        if (currentUser && currentUser.username === preloadUsername) {
            /* @tweakable If true, the default procedural model is hidden while the special GLB model loads. */
            const hideDefaultModelDuringLoad = true;
            if (hideDefaultModelDuringLoad) {
                this.playerModel.visible = false;
            }
            
            if (loadingStatus) loadingStatus.textContent = 'Loading special player model...';
            
            await assetReplacementManager.preloadAndApplyPlayerModel();
            
            // Teleport after special model load
            if (currentUser.username === TELEPORT_USERNAME) {
                const playerModel = this.playerControls.getPlayerModel();
                playerModel.position.set(TELEPORT_LOCATION.x, TELEPORT_LOCATION.y, TELEPORT_LOCATION.z);
                this.playerControls.velocity.set(0, 0, 0); // Reset velocity
                this.playerControls.lastPosition.copy(playerModel.position);
            }
        }

        this.gridManager = new GridManager(this.scene);
        this.videoManager = new VideoManager(this.scene, this.camera, this.playerModel, this.room);

        const matsResponse = await fetch('json/mats.json');
        const matsData = await matsResponse.json();
        const world = new World(this.scene, this.npcManager, this.room, matsData, assetReplacementManager);
        const worldObjects = await world.generate(this.sun);
        const terrain = worldObjects.terrain;
        this.grass = worldObjects.grass;
        const interactableSeats = worldObjects.interactableSeats;

        this.playerControls.terrain = terrain;
        this.collisionManager.setTerrain(terrain);
        this.npcManager.initializeSpawner(terrain);

        this.gridManager.create(terrain);
        this.setupBuildTools(terrain);
        this.setupMultiplayer();
        this.setupUI(assetReplacementManager);

        if (interactableSeats) {
            interactableSeats.forEach(seatBase => {
                const worldPosition = new THREE.Vector3();
                seatBase.getWorldPosition(worldPosition);
                seatBase.userData.seatCoordinates = worldPosition;
                this.interactionManager.addInteractableObject(seatBase);
            });
        }

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
        setupScene(this);
    }

    setupPlayer(playerName, initialPosition, currentUser) {
        setupPlayer(this, playerName, initialPosition, currentUser);
    }

    setupManagers() {
        setupManagers(this);
    }

    setupBuildTools(terrain) {
        setupBuildTools(this, terrain);
    }

    setupMultiplayer() {
        setupMultiplayer(this);
    }

    setupUI(assetReplacementManager) {
        setupUI(this, assetReplacementManager);
    }
    
    setupEventListeners() {
        setupEventListeners(this);
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

        updateDayNightCycle(this);
        
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
        
        this.buildTool.checkExpiredObjects(currentTime, OBJECT_EXPIRATION_MS);
        this.advancedBuildTool.checkExpiredObjects(currentTime, OBJECT_EXPIRATION_MS);
        
        this.videoManager.update();

        if (this.grass && this.grass.material.userData.uniforms) {
            this.grass.material.userData.uniforms.time.value = time;
        }

        this.renderer.render(this.scene, this.camera);
        this.labelRenderer.render(this.scene, this.camera);
        this.css3dRenderer.render(this.scene, this.camera);
    }
}