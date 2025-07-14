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
import './npc/NPC.js';
import './npc/ZoneManager.js';
import './npc/NPCSpawner.js';
import './previewManager.js'; // Ensure it's part of the context
import { FORCE_MOBILE_MODE } from './controls/constants.js';
import { World } from './world.js';

// Simple seeded random number generator
class MathRandom {
  constructor(seed) {
    this.seed = seed;
  }
  
  random() {
    const x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }
}

let collectedRemotes = {};

async function main() {
  // Initialize WebsimSocket for multiplayer functionality
  const room = new WebsimSocket();
  await room.initialize();
  
  // Generate a player name if not available
  const playerInfo = room.peers[room.clientId] || {};
  const playerName = playerInfo.username || `Player${Math.floor(Math.random() * 1000)}`;
  
  // Safe initial position values
  const playerX = (Math.random() * 10) - 5;
  const playerZ = (Math.random() * 10) - 5;

  // Setup Three.js scene
  const scene = new THREE.Scene();
  /* @tweakable The color of the sky. */
  scene.background = new THREE.Color(0x87CEEB); // Light sky blue background
  
  // Create world
  const world = new World(scene);
  const terrain = world.generate();
  
  // Create barriers, trees, clouds and platforms
  createBarriers(scene, terrain.userData.getHeight);
  createTrees(scene, terrain.userData.getHeight);
  createClouds(scene);
  
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap; // PCFSoftShadowMap is more expensive
  document.getElementById('game-container').appendChild(renderer.domElement);
  
  // Add mobile mode toggle button
  const isMobileModeForced = localStorage.getItem('forceMobileMode') === 'true';
  const mobileToggleButton = document.createElement('button');
  mobileToggleButton.textContent = isMobileModeForced ? 'View Desktop' : 'View Mobile';
  mobileToggleButton.id = 'mobile-toggle-button';
  document.body.appendChild(mobileToggleButton);

  mobileToggleButton.addEventListener('click', () => {
    const currentMode = localStorage.getItem('forceMobileMode') === 'true';
    localStorage.setItem('forceMobileMode', String(!currentMode));
    location.reload();
  });

  // Create UI containers for mobile controls
  if (FORCE_MOBILE_MODE || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    // joystick containers are now in index.html, we just need the jump button
    const jumpButton = document.createElement('div');
    jumpButton.id = 'jump-button';
    jumpButton.innerText = 'JUMP';
    document.body.appendChild(jumpButton);
  }

  // Create player model with default appearance
  let playerModel = createPlayerModel(THREE, playerName);
  scene.add(playerModel);
  
  // Initialize player controls
  const playerControls = new PlayerControls(scene, room, {
    renderer: renderer,
    initialPosition: {
      x: playerX,
      y: 0.70,
      z: playerZ
    },
    playerModel: playerModel,
    terrain: terrain,
  });
  const camera = playerControls.getCamera();
  
  // Initialize build tool
  const buildTool = new BuildTool(scene, camera, playerControls, terrain);
  buildTool.setRoom(room); // Pass room to buildTool for multiplayer sync
  
  // Initialize advanced build tool
  const objectCreator = new ObjectCreator(scene, camera, room, buildTool);
  const advancedBuildTool = new AdvancedBuildTool(scene, camera, renderer, buildTool, objectCreator);
  advancedBuildTool.setRoom(room);
  advancedBuildTool.setOrbitControls(playerControls.controls);
  
  // Load existing build objects from room state
  if (room.roomState && room.roomState.buildObjects) {
    Object.values(room.roomState.buildObjects || {}).forEach(buildData => {
      if (buildData.isAdvanced) {
        advancedBuildTool.receiveBuildObject(buildData);
      } else {
        buildTool.receiveBuildObject(buildData);
      }
    });
  }

  const multiplayerManager = new MultiplayerManager({
    room,
    scene,
    camera,
    renderer,
    buildTool,
    advancedBuildTool,
    createPlayerModel: (three, username, spec) => createPlayerModel(three, username, spec),
    playerControls
  });
  multiplayerManager.init();

  const npcManager = new NPCManager(scene, terrain, playerControls);

  const assetReplacementManager = new AssetReplacementManager({
    playerControls,
    npcManager,
  });

  const characterCreator = new CharacterCreator(
    THREE,
    room,
    playerControls,
    (newSpec) => {
      // Remove old player model
      scene.remove(playerModel);
      
      // Create new player model with the character spec
      playerModel = createPlayerModel(THREE, playerName, newSpec);
      scene.add(playerModel);
      
      // Update player controls with new model
      playerControls.playerModel = playerModel;

      return playerModel;
    }
  );

  const interactionManager = new InteractionManager({
    playerControls,
    npcManager,
    camera,
    renderer
  });
  interactionManager.init();

  const inventoryManager = new InventoryManager({ playerControls });

  // Ambient light
  /* @tweakable The intensity of the ambient light. */
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  
  // Directional light (sun)
  /* @tweakable The intensity of the directional light. */
  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  /* @tweakable The position of the sun (directional light). */
  dirLight.position.set(5, 10, 5);
  dirLight.castShadow = true;
  /* @tweakable Shadow map resolution. Higher values are more detailed but slower. */
  dirLight.shadow.mapSize.width = 1024;
  /* @tweakable Shadow map resolution. Higher values are more detailed but slower. */
  dirLight.shadow.mapSize.height = 1024;
  /* @tweakable The size of the area around the player that casts shadows. Larger values can reduce shadow quality but extend shadow range. */
  const shadowFrustumSize = 50;
  dirLight.shadow.camera.near = 0.5;
  /* @tweakable The maximum distance for shadows from the light source. Affects shadow precision. */
  dirLight.shadow.camera.far = 100;
  dirLight.shadow.camera.left = -shadowFrustumSize / 2;
  dirLight.shadow.camera.right = shadowFrustumSize / 2;
  dirLight.shadow.camera.top = shadowFrustumSize / 2;
  dirLight.shadow.camera.bottom = -shadowFrustumSize / 2;
  scene.add(dirLight);
  scene.add(dirLight.target);

  const uiManager = new UIManager({
      playerControls,
      buildTool,
      advancedBuildTool,
      characterCreator,
      objectCreator,
      inventoryManager,
      multiplayerManager,
      npcManager,
      assetReplacementManager,
      room,
      renderer,
      playerModel,
      dirLight,
      scene
  });
  const { inventoryUI, mapUI } = uiManager.init();
  
  inventoryManager.inventoryUI = inventoryUI;
  inventoryManager.init();
  
  // Grid helper for better spatial awareness
  const gridHelper = new THREE.GridHelper(ZONE_SIZE, ZONE_SIZE);
  gridHelper.visible = false; // Hidden by default
  scene.add(gridHelper);
  
  // Add a global keydown listener for toggling the grid
  window.addEventListener('keydown', (event) => {
    // Prevent toggling if an input is focused
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
        return;
    }
    // Toggle grid visibility with 'G' key
    if (event.key.toLowerCase() === 'g' && !advancedBuildTool.enabled) {
      gridHelper.visible = !gridHelper.visible;
    }
  });

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    const time = performance.now() * 0.001; // Current time in seconds
    const currentTime = Date.now(); // Current time in milliseconds
    
    playerControls.update();
    
    if(mapUI) mapUI.update();

    interactionManager.update();
    npcManager.update();

    // Update custom animations for player model
    if (playerModel && playerModel.userData.updateAnimations) {
        playerModel.userData.updateAnimations(time);
    }

    multiplayerManager.updatePlayerLabels();
    
    // Move shadow camera with player for global shadows
    if (dirLight.castShadow) {
        /* @tweakable The offset of the sun from the player, determining shadow direction. */
        const lightOffset = new THREE.Vector3(20, 35, 20);
        dirLight.position.copy(playerModel.position).add(lightOffset);
        dirLight.target.position.copy(playerModel.position);
    }
    
    // Check for remote collisions
    const playerPositionForCollision = playerModel.position.clone();
    scene.traverse((object) => {
      if (object.userData && object.userData.isRemote) {
        const worldPosition = new THREE.Vector3();
        object.getWorldPosition(worldPosition);
        
        const distance = playerPositionForCollision.distanceTo(worldPosition);
        if (distance < 1 && !multiplayerManager.collectedRemotes[object.userData.remoteId]) {
          multiplayerManager.collectRemote(object.userData.remoteId, object);
        }
      }
    });
    
    // Check for expired build objects (older than 50 minutes)
    const expirationTime = 50 * 60 * 1000; // 50 minutes in milliseconds
    buildTool.checkExpiredObjects(currentTime, expirationTime);
    advancedBuildTool.checkExpiredObjects(currentTime, expirationTime);
    
    // render uiManager related components
    if(uiManager) uiManager.update();
    
    renderer.render(scene, camera);
  }
  
  animate();
}

main();