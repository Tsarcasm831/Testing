import React, { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { useThrottle } from './useThrottle.js';
import { createPlayer, updatePlayer, resetPlayerState } from '../game/player.js';
import { updateObjects } from '../game/objects.js';

const geometries = [
    new THREE.BoxGeometry(5, 5, 5),
    new THREE.ConeGeometry(3, 8, 8),
    new THREE.SphereGeometry(3, 8, 8)
];
const materials = [0xFF6B6B, 0x4ECDC4, 0x45B7D1, 0x96CEB4, 0xFECA57].map(color => new THREE.MeshLambertMaterial({ color }));

export const useThreeScene = ({ mountRef, keysRef, setPlayerPosition, settings, setWorldObjects }) => {
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

    const throttledSetPlayerPosition = useThrottle(setPlayerPosition, 250);

    const cleanupScene = useCallback(() => {
        if (animationIdRef.current) {
            cancelAnimationFrame(animationIdRef.current);
            animationIdRef.current = null;
        }
        if (rendererRef.current) {
            rendererRef.current.dispose();
            if (mountRef.current && rendererRef.current.domElement) {
                mountRef.current.removeChild(rendererRef.current.domElement);
            }
            rendererRef.current = null;
        }
        if (sceneRef.current) {
             while(sceneRef.current.children.length > 0){
                sceneRef.current.remove(sceneRef.current.children[0]);
            }
            sceneRef.current = null;
        }
        randomObjectsRef.current = [];
        if (objectGridRef.current) objectGridRef.current.clear();
    }, [mountRef]);

    const initScene = useCallback(() => {
        if (!mountRef.current) return;

        // Scene setup
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
        directionalLight.shadow.camera.far = 200;
        const frustumSize = 80;
        directionalLight.shadow.camera.left = -frustumSize;
        directionalLight.shadow.camera.right = frustumSize;
        directionalLight.shadow.camera.top = frustumSize;
        directionalLight.shadow.camera.bottom = -frustumSize;
        
        scene.add(directionalLight);
        lightRef.current = directionalLight;

        // Set initial light target to player start position
        directionalLight.target.position.set(0, 0, 0);
        scene.add(directionalLight.target);

        // Ground plane
        const textureLoader = new THREE.TextureLoader();
        const groundTexture = textureLoader.load('ground_texture.png');
        groundTexture.wrapS = THREE.RepeatWrapping;
        groundTexture.wrapT = THREE.RepeatWrapping;
        groundTexture.repeat.set(100, 100);

        const groundGeometry = new THREE.PlaneGeometry(2000, 2000, 1, 1);
        const groundMaterial = new THREE.MeshLambertMaterial({ map: groundTexture });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = settings.shadows;
        scene.add(ground);

        // Grid overlay
        const gridHelper = new THREE.GridHelper(2000, 80, 0x334433, 0x334433);
        gridHelper.material.opacity = 0.2;
        gridHelper.material.transparent = true;
        gridHelper.visible = settings.grid;
        scene.add(gridHelper);
        gridHelperRef.current = gridHelper;

        // Player
        playerRef.current = createPlayer(settings);
        scene.add(playerRef.current);

    }, [settings.antialiasing]);

    // Initialize or re-initialize scene on mount or antialias change
    useEffect(() => {
        cleanupScene();
        initScene();
        
        // This effect should re-run if initScene changes, which it does if antialiasing changes.
        return cleanupScene;
    }, [initScene, cleanupScene]);
    
    // Update settings that don't require a full re-render
    useEffect(() => {
        if (!rendererRef.current || !lightRef.current || !playerRef.current || !gridHelperRef.current) return;
        
        const ground = sceneRef.current.children.find(c => c.type === "Mesh" && c.geometry.type === "PlaneGeometry");

        // Shadows
        rendererRef.current.shadowMap.enabled = settings.shadows;
        lightRef.current.castShadow = settings.shadows;
        if(ground) ground.receiveShadow = settings.shadows;
        playerRef.current.castShadow = settings.shadows;

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
         if (!sceneRef.current) return;
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
    }, [settings.objectDensity, settings.shadows, initScene]); // Re-run when density or scene changes

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

            if (!playerRef.current || !cameraRef.current || !rendererRef.current || !sceneRef.current || !objectGridRef.current) return;
            
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
                delta
            );

            rendererRef.current.render(sceneRef.current, cameraRef.current);
        };

        // This needs to be started after the scene is initialized.
        // The dependencies ensure it restarts if the scene is recreated.
        if (rendererRef.current) {
            animate(0);
        }

        return () => {
            if (animationIdRef.current) {
                cancelAnimationFrame(animationIdRef.current);
                animationIdRef.current = null;
            }
            throttledSetPlayerPosition.cancel();
        };
    }, [keysRef, throttledSetPlayerPosition, rendererRef.current, settings.fpsLimit]); // Depend on rendererRef.current and fpsLimit

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