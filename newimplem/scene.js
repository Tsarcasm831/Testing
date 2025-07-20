import * as THREE from 'three';
import { RENDER_DISTANCE, CHUNK_SIZE } from './config.js';
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import { settings } from './settings.js';

export let scene, camera, renderer, css2drenderer;

export function initScene() {
    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, (RENDER_DISTANCE * CHUNK_SIZE) * 1.5);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    
    // Optimize pixel ratio for mobile
    const pixelRatio = settings.isMobile ? Math.min(window.devicePixelRatio, 1.5) : window.devicePixelRatio;
    renderer.setPixelRatio(pixelRatio);

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    document.body.appendChild(renderer.domElement);
    
    // CSS2D Renderer for labels
    css2drenderer = new CSS2DRenderer();
    css2drenderer.setSize(window.innerWidth, window.innerHeight);
    css2drenderer.domElement.style.position = 'absolute';
    css2drenderer.domElement.style.top = '0px';
    css2drenderer.domElement.style.pointerEvents = 'none'; // So it doesn't block pointer lock
    document.body.appendChild(css2drenderer.domElement);
}

export function onWindowResize() {
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        css2drenderer.setSize(window.innerWidth, window.innerHeight);
    }
}