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
import { CollisionManager } from './collisionManager.js';
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import './npc/NPC.js';
import './npc/ZoneManager.js';
import './npc/NPCSpawner.js';
import './previewManager.js'; // Ensure it's part of the context
import { FORCE_MOBILE_MODE } from './controls/constants.js';
import { World } from './world.js';

/* @tweakable The maximum distance at which grid labels are visible at full density. Lower values can improve performance. */
const GRID_LABEL_VISIBILITY_DISTANCE = 7;
/* @tweakable The distance at which to switch to a more sparse set of grid labels to reduce visual clutter and improve performance. */
const GRID_LABEL_LOD_DISTANCE = 30;
/* @tweakable The step rate for showing labels at the LOD distance. e.g., a value of 10 shows every 10th label. */
const GRID_LABEL_LOD_STEP = 10;
/* @tweakable How frequently to update grid label visibility (in frames). Larger numbers reduce lag but also decrease label responsiveness. */
const LABEL_UPDATE_INTERVAL = 10;

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
  
  // Get current user for special spawn logic
  const currentUser = await window.websim.getCurrentUser();

  // Generate a player name if not available
  const playerInfo = room.peers[room.clientId] || {};
  const playerName = playerInfo.username || `Player${Math.floor(Math.random() * 1000)}`;
  
  // --- Special Spawn Logic ---
  /* @tweakable The target username for the special spawn location. */
  const targetUsername = "lordtsarcasm";
  /* @tweakable The special spawn location coordinates. */
  const specialSpawnLocation = { x: 44.1, y: 13.7, z: 21.4 };

  let initialPosition;
  if (currentUser && currentUser.username === targetUsername) {
    initialPosition = specialSpawnLocation;
  } else {
    // Default random position
    initialPosition = {
      x: (Math.random() * 10) - 5,
      y: 0.70, // Default Y
      z: (Math.random() * 10) - 5
    };
  }
  
  // Safe initial position values
  const playerX = initialPosition.x;
  const playerY = initialPosition.y;
  const playerZ = initialPosition.z;

  // Setup Three.js scene
  const scene = new THREE.Scene();
  /* @tweakable The color of the sky. */
  scene.background = new THREE.Color(0x87CEEB); // Light sky blue background
  
  // Create renderer before it is used by other components
  /* @tweakable Enable antialiasing for smoother edges. Can impact performance. */
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // PCFSoftShadowMap for softer shadows
  document.getElementById('game-container').appendChild(renderer.domElement);
  
  // Create player model with default appearance. It will be passed to controls.
  let playerModel = createPlayerModel(THREE, playerName);
  scene.add(playerModel);

  // Create managers and controls. We will set the terrain on them after it's generated.
  const playerControls = new PlayerControls(scene, room, {
    renderer: renderer,
    initialPosition: {
      x: playerX,
      y: playerY,
      z: playerZ
    },
    playerModel: playerModel,
    terrain: null, // Terrain will be set after generation
  });

  const npcManager = new NPCManager(scene, null, playerControls);
  
  // Get camera after playerControls is fully initialized
  const camera = playerControls.getCamera();
  const listener = new THREE.AudioListener();
  camera.add(listener);

  // Create world, which generates the terrain
  const world = new World(scene, npcManager);
  const terrain = world.generate(listener);
  
  // Now that terrain exists, set it on the managers that need it.
  playerControls.terrain = terrain;
  npcManager.terrain = terrain;
  // Initialize NPC Spawner with terrain
  npcManager.initializeSpawner(terrain);

  // Create barriers, trees, and clouds which depend on the terrain
  createBarriers(scene, terrain.userData.getHeight);
  createTrees(scene, terrain.userData.getHeight);
  createClouds(scene);
  
  // Setup label renderer
  const labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.domElement.style.position = 'absolute';
  labelRenderer.domElement.style.top = '0px';
  labelRenderer.domElement.style.pointerEvents = 'none';
  document.getElementById('label-container').appendChild(labelRenderer.domElement);
  
  // Add dev button to toggle mobile/desktop mode
  const isMobileModeForced = localStorage.getItem('forceMobileMode') === 'true';
  const devToggleButton = document.createElement('button');
  devToggleButton.textContent = 'Toggle View';
  devToggleButton.id = 'dev-toggle-button';
  devToggleButton.setAttribute('data-tooltip', isMobileModeForced ? 'Switch to Desktop View' : 'Switch to Mobile View');
  document.body.appendChild(devToggleButton);

  devToggleButton.addEventListener('click', () => {
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

  const assetReplacementManager = new AssetReplacementManager({
    playerControls,
    npcManager,
    onPlayerModelReplaced: (model) => { playerModel = model; }
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
  const shadowFrustumSize = 100;
  dirLight.shadow.camera.near = 0.5;
  /* @tweakable The maximum distance for shadows from the light source. Affects shadow precision. */
  dirLight.shadow.camera.far = 500;
  dirLight.shadow.camera.left = -shadowFrustumSize / 2;
  dirLight.shadow.camera.right = shadowFrustumSize / 2;
  dirLight.shadow.camera.top = shadowFrustumSize / 2;
  dirLight.shadow.camera.bottom = -shadowFrustumSize / 2;
  /* @tweakable Shadow bias to prevent shadow acne. */
  dirLight.shadow.bias = -0.0001;
  /* @tweakable Shadow radius for softer shadows (PCFSoftShadowMap). */
  dirLight.shadow.radius = 1.5;
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
  /* @tweakable The total size of the grid (width and depth). */
  const gridHelperSize = 200;
  /* @tweakable The number of divisions across the grid. */
  const gridHelperDivisions = 200;
  /* @tweakable The color of the lines at the center of the grid. */
  const gridHelperColorCenterLine = 0xffffff;
  /* @tweakable The color of the main grid lines. */
  const gridHelperColorGrid = 0xcccccc;
  const gridHelper = createGroundGrid(terrain, gridHelperSize, gridHelperDivisions, gridHelperColorCenterLine, gridHelperColorGrid);
  gridHelper.visible = false; // Hidden by default
  // Ensure grid labels follow the grid's visibility state
  const initialLabelsGroup = gridHelper.getObjectByName('grid-labels-group');
  if (initialLabelsGroup) {
    initialLabelsGroup.visible = false;
  }
  scene.add(gridHelper);
  
  // Add a global keydown listener for toggling the grid
  window.addEventListener('keydown', (event) => {
    // Prevent toggling if an input is focused
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
        return;
    }
    // Toggle grid visibility with 'G' key
    if (event.key.toLowerCase() === 'g' && !advancedBuildTool.enabled) {
      /* @tweakable Whether the grid helper is visible or not. This is toggled by the 'G' key. */
      gridHelper.visible = !gridHelper.visible;
      const labelsGroup = gridHelper.getObjectByName('grid-labels-group');
      if (labelsGroup) {
        labelsGroup.visible = gridHelper.visible;
      }
      if (!gridHelper.visible) {
        gridHelper.userData.clearLabels();
      } else {
        gridHelper.userData.updateLabels(playerModel.position, GRID_LABEL_VISIBILITY_DISTANCE, GRID_LABEL_LOD_DISTANCE, GRID_LABEL_LOD_STEP);
      }
    }
  });

  let labelUpdateCounter = 0;
  /* @tweakable How frequently to update grid label visibility (in frames). Larger numbers reduce lag but also decrease label responsiveness. */
  const labelUpdateInterval = LABEL_UPDATE_INTERVAL;

  // Video screen occlusion logic
  const raycaster = new THREE.Raycaster();

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    const time = performance.now() * 0.001; // Current time in seconds
    const currentTime = Date.now(); // Current time in milliseconds
    
    playerControls.update();
    
    // render uiManager related components
    if(uiManager) uiManager.update();

    labelUpdateCounter++;
    if (labelUpdateCounter >= labelUpdateInterval) {
        labelUpdateCounter = 0;
        if (gridHelper.visible) {
            gridHelper.userData.updateLabels(
                playerModel.position,
                GRID_LABEL_VISIBILITY_DISTANCE,
                GRID_LABEL_LOD_DISTANCE,
                GRID_LABEL_LOD_STEP
            );
        }
    }

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
        const lightOffset = new THREE.Vector3(30, 40, 25);
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
    
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
  }
  
  animate();
}

main();