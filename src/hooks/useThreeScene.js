import React, { useEffect, useRef, useCallback, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { useThrottle } from './useThrottle.js';
import { createPlayer, updatePlayer, resetPlayerState } from '../game/player.js';
import { updateObjects } from '../game/objects.js';

// Rename existing texture and add new ones.
const terrainFiles = {
    grass: 'grass_texture.png',
    sand: 'sand_texture.png',
    dirt: 'dirt_path_texture.png',
    rocky: 'rocky_ground_texture.png',
    snow: 'snow_texture.png',
    forest: 'forest_floor_texture.png',
};

const geometries = [
    new THREE.BoxGeometry(5, 5, 5),
    new THREE.ConeGeometry(3, 8, 8),
    new THREE.SphereGeometry(3, 8, 8)
];
const materials = [0xFF6B6B, 0x4ECDC4, 0x45B7D1, 0x96CEB4, 0xFECA57].map(color => new THREE.MeshLambertMaterial({ color }));

export const useThreeScene = ({ mountRef, keysRef, joystickRef, setPlayerPosition, settings, setWorldObjects, isPlaying, onPlayerLoaded }) => {
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const cameraRef = useRef(null);
    const playerRef = useRef(null);
    const animationIdRef = useRef(null);
    const lastPositionUpdateRef = useRef(0);
    const moveStopTimerRef = useRef(null);
    const lightRef = useRef(null);
    const randomObjectsRef = useRef([]);
    const objectGridRef = useRef(null);
    const gridHelperRef = useRef(null);
    const clockRef = useRef(new THREE.Clock());
    const lastFrameTimeRef = useRef(0);
    const groundContainerRef = useRef(null);
    const [isSceneReady, setIsSceneReady] = useState(false);

    const throttledSetPlayerPosition = useThrottle(setPlayerPosition, 250);

    const cleanupScene = useCallback(() => {
        if (animationIdRef.current) {
            cancelAnimationFrame(animationIdRef.current);
            animationIdRef.current = null;
        }
        if (rendererRef.current) {
            rendererRef.current.dispose();
            if (mountRef.current && rendererRef.current.domElement) {
                // Check if the child exists before trying to remove it
                if (mountRef.current.contains(rendererRef.current.domElement)) {
                    mountRef.current.removeChild(rendererRef.current.domElement);
                }
            }
            rendererRef.current = null;
        }
        if (sceneRef.current) {
             while(sceneRef.current.children.length > 0){
                sceneRef.current.remove(sceneRef.current.children[0]);
            }
            sceneRef.current = null;
        }
        groundContainerRef.current = null;
        randomObjectsRef.current = [];
        if (objectGridRef.current) objectGridRef.current.clear();
        setIsSceneReady(false);
        playerRef.current = null;
    }, [mountRef]);

    const initScene = useCallback(async () => {
        if (!mountRef.current) return;

        // --- Asset Loading ---
        const gltfLoader = new GLTFLoader();
        const textureLoader = new THREE.TextureLoader();

        const animFiles = {
            idle: '/src/components/local/character/Kakashi/Animation_Idle_11_withSkin.glb',
            walk: '/src/components/local/character/Kakashi/Animation_Walking_withSkin.glb',
            run: '/src/components/local/character/Kakashi/Animation_Running_withSkin.glb',
            jump: '/src/components/local/character/Kakashi/Animation_Regular_Jump_withSkin.glb'
        };

        try {
            // Load the main model (from the idle animation file)
            const idleGltf = await gltfLoader.loadAsync(animFiles.idle);
            const playerModel = idleGltf.scene;
            const animations = { idle: idleGltf.animations[0] };

            // Load other animations
            const animPromises = Object.keys(animFiles)
                .filter(key => key !== 'idle')
                .map(async key => {
                    const gltf = await gltfLoader.loadAsync(animFiles[key]);
                    animations[key] = gltf.animations[0];
                });
            
            await Promise.all(animPromises);
            
            // Name the animation clips for easier access
            animations.idle.name = 'idle';
            animations.walk.name = 'walk';
            animations.run.name = 'run';
            animations.jump.name = 'jump';

            // --- Scene Setup ---
            const scene = new THREE.Scene();
            scene.background = new THREE.Color(0x87CEEB);
            sceneRef.current = scene;

            // Camera setup
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
            camera.position.set(0, 50, 50);
            cameraRef.current = camera;

            // Renderer setup
            const renderer = new THREE.WebGLRenderer({ antialias: settings.antialiasing });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.shadowMap.enabled = settings.shadows;
            renderer.shadowMap.type = THREE.PCFShadowMap; // More performant than PCFSoftShadowMap
            rendererRef.current = renderer;
            mountRef.current.appendChild(renderer.domElement);

            // Lighting
            const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
            scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
            directionalLight.position.set(30, 80, 40); // Initial position, will be updated to follow player
            directionalLight.castShadow = settings.shadows;
            
            // Shadow map resolution based on quality setting
            const shadowMapSize = { low: 512, medium: 1024, high: 2048 }[settings.shadowQuality] || 1024;
            directionalLight.shadow.mapSize.width = shadowMapSize;
            directionalLight.shadow.mapSize.height = shadowMapSize;
            
            // Optimize shadow camera frustum
            directionalLight.shadow.camera.near = 10;
            directionalLight.shadow.camera.far = 400;
            const frustumSize = 160;
            directionalLight.shadow.camera.left = -frustumSize;
            directionalLight.shadow.camera.right = frustumSize;
            directionalLight.shadow.camera.top = frustumSize;
            directionalLight.shadow.camera.bottom = -frustumSize;
            
            scene.add(directionalLight);
            lightRef.current = directionalLight;

            // Set initial light target to player start position
            directionalLight.target.position.set(0, 0, 0);
            scene.add(directionalLight.target);

            // Ground plane is now a container for tiles
            groundContainerRef.current = new THREE.Group();
            scene.add(groundContainerRef.current);
            const groundContainer = groundContainerRef.current;

            // Terrain Generation
            const textureLoader = new THREE.TextureLoader();
            const worldSize = 2000;
            const tileSize = 200;
            const numTiles = worldSize / tileSize;

            // One texture repeat covers 20x20 world units, so for a 200x200 tile, it repeats 10 times.
            const textureRepeat = tileSize / 20;

            const terrainMaterials = {};
            for (const key in terrainFiles) {
                const texture = textureLoader.load(terrainFiles[key]);
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(textureRepeat, textureRepeat);
                terrainMaterials[key] = new THREE.MeshLambertMaterial({ map: texture });
            }
            
            const getTerrainType = (x, z) => {
                // x and z are tile indices from -numTiles/2 to numTiles/2
                if (x >= 3) return 'sand';     // Desert to the East
                if (x <= -3) return 'rocky';   // Mountains to the West
                if (z <= -3) return 'snow';    // Snow to the North (further from camera)
                if (z >= 3 && Math.abs(x) < 3) return 'forest'; // Forest to the South
                return 'grass'; // Default central grassland
            };

            const groundGeometry = new THREE.PlaneGeometry(tileSize, tileSize);
            
            for (let i = 0; i < numTiles; i++) {
                for (let j = 0; j < numTiles; j++) {
                    const x = (i - numTiles / 2) * tileSize + tileSize / 2;
                    const z = (j - numTiles / 2) * tileSize + tileSize / 2;
                    
                    const tileX = i - numTiles / 2;
                    const tileZ = j - numTiles / 2;

                    const terrainType = getTerrainType(tileX, tileZ);
                    const material = terrainMaterials[terrainType] || terrainMaterials.grass;

                    const groundTile = new THREE.Mesh(groundGeometry, material);
                    groundTile.position.set(x, 0, z);
                    groundTile.rotation.x = -Math.PI / 2;
                    groundTile.receiveShadow = settings.shadows;
                    groundContainer.add(groundTile);
                }
            }

            // Grid overlay
            const gridHelper = new THREE.GridHelper(2000, 80, 0x334433, 0x334433);
            gridHelper.material.opacity = 0.2;
            gridHelper.material.transparent = true;
            gridHelper.visible = settings.grid;
            scene.add(gridHelper);
            gridHelperRef.current = gridHelper;

            // Player
            playerRef.current = createPlayer(playerModel, Object.values(animations), settings);
            scene.add(playerRef.current);

            setIsSceneReady(true);
            if(onPlayerLoaded) onPlayerLoaded();

        } catch (error) {
            console.error("Failed to load player assets:", error);
            // Handle loading error, maybe show an error message to the user.
        }

    }, [settings.antialiasing, onPlayerLoaded]);

    // Initialize or re-initialize scene on mount or antialias change
    useEffect(() => {
        if (!isPlaying) {
            cleanupScene();
            return;
        }

        initScene();
        
        return cleanupScene;
    }, [isPlaying, initScene, cleanupScene]);
    
    // Update settings that don't require a full re-render
    useEffect(() => {
        if (!rendererRef.current || !lightRef.current || !playerRef.current || !gridHelperRef.current || !groundContainerRef.current) return;
        
        // Shadows
        rendererRef.current.shadowMap.enabled = settings.shadows;
        lightRef.current.castShadow = settings.shadows;
        
        groundContainerRef.current.children.forEach(tile => {
            tile.receiveShadow = settings.shadows;
        });

        if (playerRef.current) {
            playerRef.current.traverse(node => {
                if (node.isMesh) {
                    node.castShadow = settings.shadows;
                }
            });
        }

        // Update shadow map size when quality changes
        const shadowMapSize = { low: 512, medium: 1024, high: 2048 }[settings.shadowQuality] || 1024;
        if (lightRef.current.shadow.mapSize.width !== shadowMapSize) {
            lightRef.current.shadow.mapSize.width = shadowMapSize;
            lightRef.current.shadow.mapSize.height = shadowMapSize;
            // The shadow map needs to be recreated
            lightRef.current.shadow.map = null;
        }

        // Object shadows are now handled dynamically in updatePlayer loop
        rendererRef.current.shadowMap.needsUpdate = true;
        
        // Grid
        gridHelperRef.current.visible = settings.grid;

    }, [settings.shadows, settings.grid, settings.objectDensity, settings.shadowQuality]);
    
    // Handle Object Density
    useEffect(() => {
         if (!sceneRef.current || !isPlaying) return;
        // When objects are recreated, we must reset the player module's state
        // to avoid trying to update shadows on old, removed objects.
        resetPlayerState();
        const { objects, grid } = updateObjects(sceneRef.current, randomObjectsRef.current, settings);
        randomObjectsRef.current = objects;
        objectGridRef.current = grid;
        if (setWorldObjects) {
            setWorldObjects(objects.map(obj => ({
                position: obj.position.clone(),
                color: obj.children[0]?.material.color.getHexString() ?? 'ffffff'
            })));
        }
    }, [settings.objectDensity, settings.shadows, initScene, isPlaying]); // Re-run when density or scene changes

    // Animation loop
    useEffect(() => {
        const fpsIntervals = {
            'Unlimited': 0,
            '60 FPS': 1000 / 60,
            '30 FPS': 1000 / 30,
        };
        const fpsInterval = fpsIntervals[settings.fpsLimit] || 0;

        const animate = (timestamp) => {
            animationIdRef.current = requestAnimationFrame(animate);

            const elapsed = timestamp - lastFrameTimeRef.current;
            if (fpsInterval > 0 && elapsed < fpsInterval) {
                return;
            }
            lastFrameTimeRef.current = timestamp - (elapsed % fpsInterval);

            if (!isSceneReady || !playerRef.current || !cameraRef.current || !rendererRef.current || !sceneRef.current || !objectGridRef.current) return;
            
            const delta = clockRef.current.getDelta();

            // Update LODs before rendering
            for (const obj of randomObjectsRef.current) {
                if (obj.isLOD) {
                    obj.update(cameraRef.current);
                }
            }

            updatePlayer(
                playerRef.current, 
                keysRef.current, 
                cameraRef.current, 
                lightRef.current, 
                throttledSetPlayerPosition,
                objectGridRef.current,
                delta,
                joystickRef.current
            );

            rendererRef.current.render(sceneRef.current, cameraRef.current);
        };

        // Start animation only when playing and scene is ready
        if (isPlaying && isSceneReady && rendererRef.current) {
            animate(0);
        }

        return () => {
            if (animationIdRef.current) {
                cancelAnimationFrame(animationIdRef.current);
                animationIdRef.current = null;
            }
            throttledSetPlayerPosition.cancel();
        };
    }, [isPlaying, isSceneReady, keysRef, throttledSetPlayerPosition, rendererRef, settings.fpsLimit, joystickRef]); // Depend on rendererRef.current and fpsLimit

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            if (!cameraRef.current || !rendererRef.current) return;

            cameraRef.current.aspect = window.innerWidth / window.innerHeight;
            cameraRef.current.updateProjectionMatrix();
            rendererRef.current.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return { playerRef };
};