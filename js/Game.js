import * as THREE from "three";
import { PlayerControls } from "./playerControls.js";
import { createPlayerModel } from "./playerModel.js";
import { ZONE_SIZE, createBarriers, createTrees, createClouds, createGroundGrid } from "./worldGeneration.js";
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
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import { CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js';
import './npc/NPC.js';
import './npc/ZoneManager.js';
import './npc/NPCSpawner.js';
import { PreviewManager } from './previewManager.js'; 
import { FORCE_MOBILE_MODE } from './controls/constants.js';
import { World } from './world.js';
import { initYoutubePlayer, togglePlayPause, togglePlayPauseKey, setYoutubePlayerUrl, getPlayer } from './youtubePlayer.js';
import { CollisionManager } from './collisionManager.js';

/* @tweakable A small buffer distance for the video screen occlusion check to prevent flickering when the camera is very close to an occluding object. */
const OCCLUSION_BUFFER = 1.0;
/* @tweakable The maximum distance at which grid labels are visible at full density. Lower values can improve performance. */
const GRID_LABEL_VISIBILITY_DISTANCE = 7;
/* @tweakable The distance at which to switch to a more sparse set of grid labels to reduce visual clutter and improve performance. */
const GRID_LABEL_LOD_DISTANCE = 30;
/* @tweakable The step rate for showing labels at the LOD distance. e.g., a value of 10 shows every 10th label. */
const GRID_LABEL_LOD_STEP = 10;
/* @tweakable How frequently to update grid label visibility (in frames). Larger numbers reduce lag but also decrease label responsiveness. */
const LABEL_UPDATE_INTERVAL = 10;
/* @tweakable The target username for the special spawn location. */
const TARGET_SPAWN_USERNAME = "lordtsarcasm";
/* @tweakable The special spawn location coordinates. */
const SPECIAL_SPAWN_LOCATION = { x: 44.1, y: 13.7, z: 21.4 };
/* @tweakable How frequently to check for video screen occlusion (in frames). Larger numbers reduce lag but also decrease occlusion responsiveness. */
const VIDEO_OCCLUSION_CHECK_INTERVAL = 10;
/* @tweakable How frequently to update video audio volume (in frames). Larger numbers reduce processing but also decrease responsiveness. */
const VIDEO_AUDIO_UPDATE_INTERVAL = 10;

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
        this.playerControls = null;
        this.playerModel = null;
        this.npcManager = null;
        this.collisionManager = null;
        this.buildTool = null;
        this.advancedBuildTool = null;
        this.multiplayerManager = null;
        this.interactionManager = null;
        this.uiManager = null;
        this.gridHelper = null;
        this.dirLight = null;
        this.labelUpdateCounter = 0;
        this.videoOcclusionCheckCounter = 0;
        this.videoAudioUpdateCounter = 0;
        this.currentYoutubeUrl = null;
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

        const world = new World(this.scene, this.npcManager, this.room);
        const terrain = world.generate();

        this.playerControls.terrain = terrain;
        this.collisionManager.setTerrain(terrain);
        
        this.npcManager.initializeSpawner(terrain);

        this.setupGrid(terrain);
        this.setupBuildTools(terrain);
        this.setupMultiplayer();
        this.setupUI();
        this.setupEventListeners();
        initYoutubePlayer();

        this.labelUpdateCounter = 0;
        this.videoOcclusionCheckCounter = 0;
        this.videoAudioUpdateCounter = 0;
        
        this.room.subscribeRoomState(this.handleRoomStateChange.bind(this));
        
        // Add this to initialize with the current room state
        const currentRoomState = this.room.roomState;
        if(currentRoomState) {
            this.handleRoomStateChange(currentRoomState);
        }

        this.start();
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB);

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

        this.dirLight = null;
        this.labelUpdateCounter = 0;
        this.videoOcclusionCheckCounter = 0;
        this.videoAudioUpdateCounter = 0;
        this.currentYoutubeUrl = null;
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

    setupGrid(terrain) {
        const gridHelperSize = 200;
        const gridHelperDivisions = 200;
        const gridHelperColorCenterLine = 0xffffff;
        const gridHelperColorGrid = 0xcccccc;
        this.gridHelper = createGroundGrid(terrain, gridHelperSize, gridHelperDivisions, gridHelperColorCenterLine, gridHelperColorGrid);
        this.gridHelper.visible = false;
        const initialLabelsGroup = this.gridHelper.getObjectByName('grid-labels-group');
        if (initialLabelsGroup) {
            initialLabelsGroup.visible = false;
        }
        this.scene.add(this.gridHelper);
    }

    setupBuildTools(terrain) {
        this.buildTool = new BuildTool(this.scene, this.camera, this.playerControls, terrain);
        this.buildTool.setRoom(this.room);
        
        const objectCreator = new ObjectCreator(this.scene, this.camera, this.room, this.buildTool);
        this.advancedBuildTool = new AdvancedBuildTool(this.scene, this.camera, this.renderer, this.buildTool, objectCreator);
        this.advancedBuildTool.setRoom(this.room);
        this.advancedBuildTool.setOrbitControls(this.playerControls.controls);
        
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

    setupUI() {
        const assetReplacementManager = new AssetReplacementManager({
            playerControls: this.playerControls,
            npcManager: this.npcManager,
            onPlayerModelReplaced: (model) => { this.playerModel = model; }
        });

        const characterCreator = new CharacterCreator(
            THREE,
            this.room,
            this.playerControls,
            (newSpec) => {
                this.scene.remove(this.playerModel);
                this.playerModel = createPlayerModel(THREE, this.playerModel.name, newSpec);
                this.scene.add(this.playerModel);
                this.playerControls.playerModel = this.playerModel;
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
            scene: this.scene
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
                this.gridHelper.visible = !this.gridHelper.visible;
                const labelsGroup = this.gridHelper.getObjectByName('grid-labels-group');
                if (labelsGroup) labelsGroup.visible = this.gridHelper.visible;
                if (!this.gridHelper.visible) {
                    this.gridHelper.userData.clearLabels();
                } else {
                    this.gridHelper.userData.updateLabels(this.playerModel.position, GRID_LABEL_VISIBILITY_DISTANCE, GRID_LABEL_LOD_DISTANCE, GRID_LABEL_LOD_STEP);
                }
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
        if (roomState && roomState.youtubeUrl && roomState.youtubeUrl !== this.currentYoutubeUrl) {
            this.currentYoutubeUrl = roomState.youtubeUrl;
            setYoutubePlayerUrl(this.currentYoutubeUrl);
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        const time = performance.now() * 0.001;
        const currentTime = Date.now();
        
        this.playerControls.update();
        if (this.uiManager) this.uiManager.update();

        this.labelUpdateCounter++;
        if (this.labelUpdateCounter >= LABEL_UPDATE_INTERVAL) {
            this.labelUpdateCounter = 0;
            if (this.gridHelper.visible) {
                this.gridHelper.userData.updateLabels(
                    this.playerModel.position,
                    GRID_LABEL_VISIBILITY_DISTANCE,
                    GRID_LABEL_LOD_DISTANCE,
                    GRID_LABEL_LOD_STEP
                );
            }
        }

        this.interactionManager.update();
        this.npcManager.update();

        if (this.playerModel && this.playerModel.userData.updateAnimations) {
            this.playerModel.userData.updateAnimations(time);
        }

        this.multiplayerManager.updatePlayerLabels();
        
        if (this.dirLight && this.dirLight.castShadow) {
            const lightOffset = new THREE.Vector3(30, 40, 25);
            this.dirLight.position.copy(this.playerModel.position).add(lightOffset);
            this.dirLight.target.position.copy(this.playerModel.position);
        }
        
        const expirationTime = 50 * 60 * 1000;
        this.buildTool.checkExpiredObjects(currentTime, expirationTime);
        this.advancedBuildTool.checkExpiredObjects(currentTime, expirationTime);
        
        this.videoOcclusionCheckCounter++;
        if (this.videoOcclusionCheckCounter >= VIDEO_OCCLUSION_CHECK_INTERVAL) {
            this.videoOcclusionCheckCounter = 0;
            this.checkVideoOcclusion();
        }

        this.videoAudioUpdateCounter++;
        if (this.videoAudioUpdateCounter >= VIDEO_AUDIO_UPDATE_INTERVAL) {
            this.videoAudioUpdateCounter = 0;
            this.updateVideoAudio();
        }

        this.renderer.render(this.scene, this.camera);
        this.labelRenderer.render(this.scene, this.camera);
    }

    checkVideoOcclusion() {
        const videoMesh = this.scene.getObjectByName('amphitheatre-video-screen');

        if (videoMesh) {
            const screenCenter = new THREE.Vector3();
            videoMesh.getWorldPosition(screenCenter);
            
            const cameraPosition = new THREE.Vector3();
            this.camera.getWorldPosition(cameraPosition);

            const direction = screenCenter.clone().sub(cameraPosition).normalize();
            const raycaster = new THREE.Raycaster(cameraPosition, direction);

            const intersects = raycaster.intersectObjects(this.scene.children, true);
            
            let occluded = false;
            const distanceToScreen = cameraPosition.distanceTo(screenCenter);

            for (const intersect of intersects) {
                if (intersect.object === videoMesh || intersect.object.userData.isPlayer || intersect.object.userData.isGridHelper) {
                    continue;
                }
                if (intersect.distance < distanceToScreen - OCCLUSION_BUFFER) {
                    occluded = true;
                    break;
                }
            }
            // Toggle visibility of the parent group to hide both video and backing
            if(videoMesh.parent) videoMesh.parent.visible = !occluded;
        }
    }

    updateVideoAudio() {
        const videoMesh = this.scene.getObjectByName('amphitheatre-video-screen');
        const videoEl = getPlayer();

        if (videoMesh && videoEl && this.playerModel) {
            const screenCenter = new THREE.Vector3();
            videoMesh.getWorldPosition(screenCenter);

            const playerPosition = this.playerModel.position;
            const distance = playerPosition.distanceTo(screenCenter);
            
            /* @tweakable Maximum distance to hear video audio. */
            const maxAudioDistance = 60;
            /* @tweakable Distance at which video audio is at full volume. */
            const minAudioDistance = 5;

            if (distance < maxAudioDistance && videoMesh.parent && videoMesh.parent.visible) {
                videoEl.muted = false;
                const volume = 1.0 - THREE.MathUtils.smoothstep(distance, minAudioDistance, maxAudioDistance);
                /* @tweakable A global volume multiplier for the video. */
                const globalVideoVolume = 0.5;
                // Using Math.pow for a more natural falloff (ease-in)
                videoEl.volume = Math.pow(volume, 2) * globalVideoVolume;
            } else {
                videoEl.volume = 0;
            }
        }
    }
}