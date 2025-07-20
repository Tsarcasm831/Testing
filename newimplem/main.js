import * as THREE from 'three';
import { Terrain } from './terrain.js';
import { Player } from './player.js';
import { Sky } from './sky.js';
import { Water } from 'three/addons/objects/Water.js';
import { initScene, camera, scene, renderer, css2drenderer, onWindowResize } from './scene.js';
import { CHUNK_SIZE, RENDER_DISTANCE } from './config.js';
import { terrainMaterial } from './materials/terrain-material.js';
import { loadProjectMetadata } from './metadata.js';
import { HUD } from './hud.js';
import { MultiplayerManager } from './multiplayer.js';
import { onlinePlayersUI } from './online-players-ui.js';
import { settings } from './settings.js';
import { mapRenderer } from './map-renderer.js';

let player, terrain, water, sky, hud, multiplayerManager, uiManager;
const loadedAssets = {};
const clock = new THREE.Clock();
const MAX_DELTA = 0.05; // Corresponds to 20 FPS

const loadingScreen = document.getElementById('loading-screen');
const loadingText = document.getElementById('loading-text');
const progressBar = document.getElementById('progress-bar');
const blocker = document.getElementById('blocker');
const underwaterOverlay = document.getElementById('underwater-overlay');
const projectTitleEl = document.getElementById('project-title');
const projectDescriptionEl = document.getElementById('project-description');

const loadingManager = new THREE.LoadingManager();

function createStage() {
    const stageGroup = new THREE.Group();
    stageGroup.name = 'stage_group';

    const stageMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.8, metalness: 0.1 });

    // Platform
    const platformGeo = new THREE.BoxGeometry(20, 1, 30);
    const platform = new THREE.Mesh(platformGeo, stageMaterial);
    platform.position.y = 0.5; // The group's origin is the bottom of the platform
    platform.name = 'stage_platform';
    platform.castShadow = true;
    platform.receiveShadow = true;
    stageGroup.add(platform);

    // Backdrop
    const backdropGeo = new THREE.BoxGeometry(20, 8, 0.5);
    const backdrop = new THREE.Mesh(backdropGeo, stageMaterial);
    backdrop.position.set(0, 5, -14.75); // Y = 1 (platform height) + 4 (half backdrop height)
    backdrop.name = 'stage_backdrop';
    backdrop.castShadow = true;
    backdrop.receiveShadow = true;
    stageGroup.add(backdrop);
    
    // Roof
    const roofGeo = new THREE.BoxGeometry(22, 0.5, 32);
    const roof = new THREE.Mesh(roofGeo, stageMaterial);
    roof.position.set(0, 9.25, 0); // Y = 9 (top of backdrop) + 0.25 (half roof height)
    roof.name = 'stage_roof';
    roof.castShadow = true;
    roof.receiveShadow = true;
    stageGroup.add(roof);

    // Support Pillars
    const pillarGeo = new THREE.CylinderGeometry(0.5, 0.5, 8, 16);
    const pillarPositions = [
        {x: 10.5, z: 15.5},
        {x: -10.5, z: 15.5},
        {x: 10.5, z: -15.5},
        {x: -10.5, z: -15.5},
    ];
    pillarPositions.forEach(pos => {
        const pillar = new THREE.Mesh(pillarGeo, stageMaterial);
        pillar.position.set(pos.x, 5, pos.z); // Center Y = 1 (platform height) + 4 (half pillar height)
        pillar.name = 'stage_pillar';
        pillar.castShadow = true;
        pillar.receiveShadow = true;
        stageGroup.add(pillar);
    });

    return stageGroup;
}

loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
    progressBar.style.width = `${(itemsLoaded / itemsTotal) * 100}%`;
};

loadingManager.onLoad = async () => {
    loadingText.textContent = 'Initializing World...';
    progressBar.style.width = '0%';

    // Initialize core components before terrain generation
    initScene();
    sky = new Sky(scene); // Sky needs to be created before terrain for material uniforms
    
    let room = null;
    let username = null;

    if (typeof WebsimSocket !== 'undefined') {
        try {
            room = new WebsimSocket();
            await room.initialize();
            username = room.peers[room.clientId]?.username;
        } catch (e) {
            console.error("Could not get username for spawn check", e);
        }
    }

    player = new Player(camera, scene, loadedAssets, username);
    terrain = new Terrain(scene, loadedAssets, sky);
    hud = new HUD(player, camera);
    multiplayerManager = new MultiplayerManager(scene, player);
    if(room) multiplayerManager.setRoom(room); // Pass pre-initialized room

    mapRenderer.init(player, multiplayerManager);

    onlinePlayersUI.setMultiplayerManager(multiplayerManager);
    
    // UIManager is created inside PlayerControls, so we get the instance from there.
    uiManager = player.controls.uiManager; 
    
    player.controls.setOnlinePlayersUI(onlinePlayersUI);

    loadingText.textContent = 'Pre-rendering Map...';
    await mapRenderer.pregenerateMap();
    progressBar.style.width = '50%';
    
    loadingText.textContent = 'Generating Terrain...';
    
    // The slab needs to be known by the terrain *before* chunks are generated.
    const slabGeometry = new THREE.BoxGeometry(40, 0.5, 100);
    const slabMaterial = new THREE.MeshStandardMaterial({
        map: loadedAssets.concrete,
        normalMap: loadedAssets.concrete_normal,
        normalScale: new THREE.Vector2(0.5, 0.5),
        roughness: 0.9,
        metalness: 0.1,
    });
    const concreteSlab = new THREE.Mesh(slabGeometry, slabMaterial);
    concreteSlab.castShadow = true;
    concreteSlab.receiveShadow = true;
    concreteSlab.name = 'concrete_slab';
    
    const stage = createStage();
    // Position the stage group on top of the concrete slab, at the far end
    stage.position.set(121.0, 9.75, 9.0 - (30 / 2) - 1);

    terrain.setSpecialObjects({ 
        concrete_slab: concreteSlab,
        stage: stage 
    });

    terrain.preloadInitialChunks(player.position, () => {
        progressBar.style.width = '100%';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            uiManager.showBlocker();
            hud.init(); // Show HUD when game starts
            initWorld();
            animate();
            multiplayerManager.initialize(room === null); // Initialize only if not already done
        }, 100);
    });
};

loadingManager.onError = (url) => {
    console.error('There was an error loading ' + url);
    loadingText.textContent = `Error loading. Please refresh.`;
};

function startLoading() {
    loadProjectMetadata();
    const textureLoader = new THREE.TextureLoader(loadingManager);
    const audioLoader = new THREE.AudioLoader(loadingManager);

    const makeSeamless = (texture) => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    };
    
    loadedAssets.waterNormals = textureLoader.load('waternormals.png', makeSeamless);
    loadedAssets.sand = textureLoader.load('sand.png', makeSeamless);
    loadedAssets.sand_normal = textureLoader.load('sand_normal.png', makeSeamless);
    loadedAssets.grass = textureLoader.load('grass.png', makeSeamless);
    loadedAssets.grass_normal = textureLoader.load('grass_normal.png', makeSeamless);
    loadedAssets.dirt = textureLoader.load('dirt.png', makeSeamless);
    loadedAssets.dirt_normal = textureLoader.load('dirt_normal.png', makeSeamless);
    loadedAssets.rock = textureLoader.load('rock.png', makeSeamless);
    loadedAssets.rock_normal = textureLoader.load('rock_normal.png', makeSeamless);
    loadedAssets.snow = textureLoader.load('snow.png', makeSeamless);
    loadedAssets.snow_normal = textureLoader.load('snow_normal.png', makeSeamless);
    loadedAssets.grass_blade = textureLoader.load('grass_blade.png');
    loadedAssets.palm_trunk = textureLoader.load('palm_trunk.png', makeSeamless);
    loadedAssets.palm_leaf = textureLoader.load('palm_leaf.png');
    loadedAssets.aspen_trunk = textureLoader.load('aspen_trunk.png', makeSeamless);
    loadedAssets.aspen_leaf = textureLoader.load('aspen_leaf.png');
    // The scatter_rock png is no longer used for the main rocks, but we'll leave it
    // loaded in case it's useful for smaller pebbles or other details later.
    loadedAssets.scatter_rock = textureLoader.load('scatter_rock.png');
    loadedAssets.badlands = textureLoader.load('badlands.png', makeSeamless);
    loadedAssets.badlands_normal = textureLoader.load('badlands_normal.png', makeSeamless);
    loadedAssets.pine_trunk = textureLoader.load('pine_trunk.png', makeSeamless);
    loadedAssets.pine_leaf = textureLoader.load('pine_leaf.png');
    loadedAssets.oak_trunk = textureLoader.load('oak_trunk.png', makeSeamless);
    loadedAssets.oak_leaf = textureLoader.load('oak_leaf.png');

    // Load new concrete assets
    loadedAssets.concrete = textureLoader.load('concrete.png', makeSeamless);
    loadedAssets.concrete_normal = textureLoader.load('concrete_normal.png', makeSeamless);

    audioLoader.load('/footstep.mp3', (buffer) => {
        loadedAssets.footstep = buffer;
    });

    audioLoader.load('/wind.mp3', (buffer) => {
        loadedAssets.wind = buffer;
    });
}

function initWorld() {
    // Sky and lighting
    // sky = new Sky(scene, renderer); // Moved to before terrain preload

    // Terrain is preloaded

    // The concrete slab is now created and passed to terrain before chunk generation.
    // This function is now mainly for setting up things that depend on the preloaded world.

    // Water
    const waterViewRadius = RENDER_DISTANCE * CHUNK_SIZE;
    
    // Optimize water for mobile
    const waterSegments = settings.isMobile ? 32 : 128;
    const waterTextureResolution = settings.isMobile ? 512 : 1024;
    
    // Increased segments for wave geometry
    const waterGeometry = new THREE.PlaneGeometry(waterViewRadius * 2, waterViewRadius * 2, waterSegments, waterSegments);
    water = new Water(
        waterGeometry,
        {
            textureWidth: waterTextureResolution,
            textureHeight: waterTextureResolution,
            waterNormals: loadedAssets.waterNormals,
            sunDirection: sky.dirLight.position.clone().normalize(),
            sunColor: sky.dirLight.color,
            waterColor: 0x07243b,
            distortionScale: 3.0,
            fog: scene.fog !== undefined,
            clipBias: 0.05 // Add a small bias to prevent reflection artifacts near the water surface
        }
    );
    water.rotation.x = - Math.PI / 2;
    water.position.y = -21.5;
    scene.add(water);

    // Player is already created

    // Event Listeners
    window.addEventListener('resize', onWindowResize);
}

let lastHudUpdateTime = 0;
const HUD_UPDATE_INTERVAL = 100; // ms

function animate() {
    requestAnimationFrame(animate);
    const time = performance.now();
    const elapsedTime = clock.getElapsedTime();
    const delta = Math.min(clock.getDelta(), MAX_DELTA);
    
    // Underwater check
    const isUnderwater = camera.position.y < water.position.y;
    sky.setUnderwater(isUnderwater, camera.position.y, water.position.y);
    underwaterOverlay.style.display = isUnderwater ? 'block' : 'none';

    player.update(time, terrain, isUnderwater);
    multiplayerManager.update(delta);
    const playerPosition = player.position;

    hud.update(time, sky);
    
    terrain.update(playerPosition);
    sky.update(playerPosition, elapsedTime, water, terrain);
    
    if (terrain.grassMaterial) {
        terrain.grassMaterial.uniforms.time.value = elapsedTime;
    }
    if (terrain.palmLeafMaterial) {
        terrain.palmLeafMaterial.uniforms.time.value = elapsedTime;
    }
    if (terrain.aspenLeafMaterial) {
        terrain.aspenLeafMaterial.uniforms.time.value = elapsedTime;
    }
    if (terrain.pineLeafMaterial) {
        terrain.pineLeafMaterial.uniforms.time.value = elapsedTime;
    }

    // Make water follow the player
    if (water) {
        water.position.x = playerPosition.x;
        water.position.z = playerPosition.z;
        // Update Water's time uniform for wave animation
        water.material.uniforms[ 'time' ].value += clock.getDelta();
    }

    renderer.render(scene, camera);
    css2drenderer.render(scene, camera);
}

startLoading();