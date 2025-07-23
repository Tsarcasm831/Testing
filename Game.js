import * as THREE from "three";
import { createPlayerModel } from "./playerModel.js";
import { ZONE_SIZE, createBarriers, createTrees, createClouds } from "./worldGeneration.js";
import { BuildTool } from "./buildTool.js";
import { AdvancedBuildTool } from "./advancedBuildTool.js";
import { UIManager } from "./uiManager.js";
import { CharacterCreator } from "./characterCreator.js";
import { MultiplayerManager } from "./multiplayerManager.js";
import { ObjectCreator } from "./objectCreator.js";
import { InventoryManager } from "./inventoryManager.js";
import { NPCManager } from "./npcManager.js";
import { InteractionManager } from "./interaction.js";
import { AssetReplacementManager } from "./assetReplacementManager.js";
import { GridManager } from "./gridManager.js";
import { VideoManager } from "./videoManager.js";
import { initYoutubePlayer, togglePlayPause, setYoutubePlayerUrl, getPlayer } from "./youtubePlayer.js";
import { CollisionManager } from "./collisionManager.js";
import { World } from "./world.js";

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
  }

  async init() {
    this.room = new WebsimSocket();
    await this.room.initialize();

    const currentUser = await window.websim.getCurrentUser();
    const playerInfo = this.room.peers[this.room.clientId] || {};
    const playerName = playerInfo.username || `Player${Math.floor(Math.random() * 1000)}`;

    let initialPosition;
    if (currentUser && currentUser.username === "lordtsarcasm") {
      initialPosition = {
        x: 44.1,
        y: 13.7,
        z: 21.4
      };
    } else {
      initialPosition = {
        x: (Math.random() * 10) - 5,
        y: 0.70,
        z: (Math.random() * 10) - 5
      };
    }

    this.setupScene();
    this.collisionManager = new CollisionManager(this.scene);
    this.setupPlayer(playerName, initialPosition);
    this.setupManagers();
    this.gridManager = new GridManager(this.scene);
    this.setupBuildTools(initialPosition);
    this.setupMultiplayer();
    this.setupUI();
    this.setupEventListeners();
    initYoutubePlayer();
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
    document.getElementById('label-container').appendChild(this.labelRenderer.domElement);
        
    this.css3dRenderer = new CSS3DRenderer();
    this.css3dRenderer.setSize(window.innerWidth, window.innerHeight);
    this.css3dRenderer.domElement.style.position = 'absolute';
    this.css3dRenderer.domElement.style.top = '0px';
    document.getElementById('css3d-container').appendChild(this.css3dRenderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    this.dirLight = null;
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

  setupUI() {
    const assetReplacementManager = new AssetReplacementManager({
      playerControls: this.playerControls,
      npcManager: this.npcManager,
      onPlayerModelReplaced: (model) => {
        this.playerModel = model;
        this.videoManager.setPlayerModel(model);
      }
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
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
        return;
      }
      if (event.key.toLowerCase() === 'g' && !this.advancedBuildTool.enabled) {
        this.gridManager.toggle(this.playerModel.position);
      }
    });
  }

  start() {
    this.animate();
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

    this.videoManager.update();

    if (this.dirLight && this.dirLight.castShadow) {
      const lightOffset = new THREE.Vector3(30, 40, 25);
      this.dirLight.position.copy(this.playerModel.position).add(lightOffset);
      this.dirLight.target.position.copy(this.playerModel.position);
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
```
</output>