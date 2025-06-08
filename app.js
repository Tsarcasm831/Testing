import * as THREE from "three";
import { PlayerControls } from "./controls.js";
import { createPlayerModel } from "./player.js";
import { createTrees, createClouds } from "./worldGeneration.js"; 
import { NPC } from "./npc.js";
import { NPCManager } from "./NPCManager.js";
import { UIManager } from "./ui.js";
import { GameManager } from "./gameManager.js";
import { CharacterGenerator } from "./characterGenerator.js";
import { JournalInterface } from "./journal.js";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

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

async function main() {
  // Initialize WebsimSocket for multiplayer functionality
  const room = new WebsimSocket();
  await room.initialize();

  // Generate a random player name if not available
  const playerInfo = room.peers[room.clientId] || {};
  const playerName = playerInfo.username || `Player${Math.floor(Math.random() * 1000)}`;

  // Initialize player character description
  let characterDescription = "Human";

  // Check if we already have characterDescription in presence
  if (room.presence[room.clientId] && room.presence[room.clientId].characterDescription) {
    characterDescription = room.presence[room.clientId].characterDescription;
  } else {
    // Set default character description in presence
    room.updatePresence({
      characterDescription: characterDescription
    });
  }

  // Setup Three.js scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87CEEB); // Light sky blue background

  // Create trees and clouds
  createTrees(scene);
  createClouds(scene);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.getElementById('game-container').appendChild(renderer.domElement);

  // Create player model
  const playerModel = createPlayerModel(THREE, playerName);
  scene.add(playerModel);

  // Initialize player controls - will be updated with correct initial position after town loads
  const playerControls = new PlayerControls(scene, room, {
    renderer: renderer,
    // Use a placeholder initial position, will adjust after loading town
    initialPosition: { x: 0, y: 50, z: 0 },
    playerModel: playerModel
  });
  const camera = playerControls.getCamera();

  // Initialize world lighting
  setupLighting(scene);
  
//castle.glb
  // Load the Town model as the new ground and collision
  const loader = new GLTFLoader();
  loader.load(
    '/Town.glb',
    function (gltf) {
      const townModel = gltf.scene;

      // Position the town model at Y=0 (adjust if model origin is different)
      townModel.position.set(0, -1.5, 0);

      // Scale the model if needed
     townModel.scale.set(.45, .29, .45);

      townModel.receiveShadow = true; // Allow town to receive shadows

      // Traverse the model and add isBarrier userData to all meshes for basic collision
      townModel.traverse((child) => {
        if (child.isMesh) {
          child.userData.isBarrier = false;
          child.receiveShadow = true; // Ensure all parts receive shadows
        }
      });

      scene.add(townModel);
      console.log('Town model loaded successfully and set as barrier!');
      
      // Set initial player position *after* the town model is loaded
      // Find a safe starting spot on the town ground
      const initialPlayerY = 1.0; // Assuming the ground is at Y=0 and player height starts around 1.0
      const initialPlayerX = (Math.random() * 20) - 10; // Random start within a reasonable area of the town
      const initialPlayerZ = (Math.random() * 20) - 10;

      playerModel.position.set(initialPlayerX, initialPlayerY, initialPlayerZ);
      playerControls.lastPosition.set(initialPlayerX, initialPlayerY, initialPlayerZ);
      playerControls.playerX = initialPlayerX;
      playerControls.playerY = initialPlayerY;
      playerControls.playerZ = initialPlayerZ;

      // Update camera target
      const newTarget = new THREE.Vector3(playerModel.position.x, playerModel.position.y + 1, playerModel.position.z);
      if (playerControls.controls) {
        playerControls.controls.target.copy(newTarget);
        playerControls.controls.update(); // Ensure controls are updated with new target
      }
      // Update camera position based on offset from new target
      playerControls.camera.position.copy(newTarget).add(playerControls.cameraOffset);
      playerControls.camera.lookAt(newTarget);


      // Update presence with correct initial position
      if (room) {
        room.updatePresence({
          x: initialPlayerX,
          y: initialPlayerY,
          z: initialPlayerZ,
          rotation: 0,
          moving: false,
          characterDescription: characterDescription // Ensure character description is also updated/sent
        });
      }

    },
    undefined, // Optional: called while loading is progressing
    function (error) {
      console.error('Error loading Town model:', error);
      // Fallback: If town fails to load, place player at default position and maybe add simple ground plane
      const fallbackPlayerX = (Math.random() * 10) - 5;
      const fallbackPlayerZ = (Math.random() * 10) - 5;
      const fallbackPlayerY = 0.5;
      playerModel.position.set(fallbackPlayerX, fallbackPlayerY, fallbackPlayerZ);
      playerControls.lastPosition.set(fallbackPlayerX, fallbackPlayerY, fallbackPlayerZ);
      playerControls.playerX = fallbackPlayerX;
      playerControls.playerY = fallbackPlayerY;
      playerControls.playerZ = fallbackPlayerZ;

      // Update camera target and position
      const newTarget = new THREE.Vector3(playerModel.position.x, playerModel.position.y + 1, playerModel.position.z);
       if (playerControls.controls) {
        playerControls.controls.target.copy(newTarget);
        playerControls.controls.update();
      }
      playerControls.camera.position.copy(newTarget).add(playerControls.cameraOffset);
      playerControls.camera.lookAt(newTarget);

      if (room) {
         room.updatePresence({
          x: fallbackPlayerX,
          y: fallbackPlayerY,
          z: fallbackPlayerZ,
          rotation: 0,
          moving: false,
          characterDescription: characterDescription
        });
      }

      // Add a simple fallback ground plane
      const groundGeometry = new THREE.PlaneGeometry(100, 100);
      const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x8FBC8F, side: THREE.DoubleSide });
      const ground = new THREE.Mesh(groundGeometry, groundMaterial);
      ground.rotation.x = Math.PI / 2;
      ground.receiveShadow = true;
      ground.userData.isBarrier = true; // Make fallback ground collidable
      scene.add(ground);
       console.warn("Town model failed to load, using fallback ground.");
    }
  );

  // Load the Estranged model
  // Keeping Estranged model load but placing it high up to avoid interfering with the town
  loader.load(
    '/the_estranged.glb',
    function (gltf) {
      const model = gltf.scene;
      // Position the model high up to avoid conflicting with the town layout
      model.position.set(-10, 27.5, -280); // High above the town
      model.scale.set(.1, .1, .1); // Adjust scale if needed
      scene.add(model);
      console.log('Estranged model loaded successfully!');
    },
    undefined, // Optional: called while loading is progressing
    function (error) {
      console.error('Error loading Estranged model:', error);
    }
  );

  // Initialize game manager
  const gameManager = new GameManager({
    scene,
    room,
    camera,
    renderer,
    playerModel,
    playerName,
    clientId: room.clientId
  });

  // Set player controls in game manager
  gameManager.setPlayerControls(playerControls);

  // Initialize NPC manager
  const npcManager = new NPCManager(scene, room, playerModel);

  // Make NPC manager globally available 
  window.npcManager = npcManager;

  // Assign npcManager to gameManager
  gameManager.npcManager = npcManager;

  // Initialize UI manager
  const uiManager = new UIManager(gameManager, npcManager);

  // Initialize character generator
  const characterGenerator = new CharacterGenerator(scene, room, playerModel, playerControls, gameManager);

  // Initialize journal interface
  const journalInterface = new JournalInterface(room, npcManager);
  
  // Make journal interface globally available for cast management
  window.journalInterface = journalInterface;

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    playerControls.update();

    gameManager.update();
    npcManager.update(camera, renderer, playerModel.position);
    uiManager.update(camera, renderer);

    renderer.render(scene, camera);
  }

  animate();
}

// Helper functions
function setupLighting(scene) {
  // Ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // Directional light (sun)
  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(5, 10, 5);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 4096; 
  dirLight.shadow.mapSize.height = 4096; 
  dirLight.shadow.camera.near = 0.5;
  dirLight.shadow.camera.far = 100; 
  dirLight.shadow.camera.left = -50; 
  dirLight.shadow.camera.right = 50; 
  dirLight.shadow.camera.top = 50;   
  dirLight.shadow.camera.bottom = -50; 
  scene.add(dirLight);

  // Optional: Add a slight directional light from another angle for better shading
  const backLight = new THREE.DirectionalLight(0xffffff, 0.2);
  backLight.position.set(-5, 10, -5);
  scene.add(backLight);
}

main();