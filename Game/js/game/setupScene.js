import * as THREE from 'three';
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import { CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js';
import { Sky } from 'three/addons/objects/Sky.js';

export function setupScene(game) {
    game.scene = new THREE.Scene();

    // Realistic Sky
    const sky = new Sky();
    game.sky = sky;
    /* @tweakable The scale of the sky dome. It should be large enough to encompass the entire scene. */
    const skyScale = 5000;
    sky.scale.setScalar(skyScale);
    game.scene.add(sky);

    game.dirLight = new THREE.DirectionalLight(0xffffff, 3);
    game.dirLight.castShadow = true;
    game.dirLight.shadow.mapSize.width = 1024;
    game.dirLight.shadow.mapSize.height = 1024;
    game.dirLight.shadow.camera.near = 0.5;
    game.dirLight.shadow.camera.far = 500;
    game.dirLight.shadow.camera.left = -100;
    game.dirLight.shadow.camera.right = 100;
    game.dirLight.shadow.camera.top = 100;
    game.dirLight.shadow.camera.bottom = -100;
    game.scene.add(game.dirLight);
    game.scene.add(game.dirLight.target);

    const sun = game.sun;

    /* @tweakable The turbidity of the sky (haziness). */
    const turbidity = 10;
    /* @tweakable The Rayleigh scattering effect, affects the blue color of the sky. */
    const rayleigh = 2;
    /* @tweakable The Mie coefficient, for haze and light scattering. */
    const mieCoefficient = 0.005;
    /* @tweakable The Mie directional G, for how light scatters directionally. */
    const mieDirectionalG = 0.8;
    /* @tweakable The elevation of the sun in degrees (0 is horizon, 90 is directly overhead). */
    const elevation = 4;
    /* @tweakable The azimuth of the sun in degrees (direction, 0 is North). */
    const azimuth = 180;

    const phi = THREE.MathUtils.degToRad(90 - elevation);
    const theta = THREE.MathUtils.degToRad(azimuth);
    sun.setFromSphericalCoords(1, phi, theta);

    game.renderer = new THREE.WebGLRenderer({ antialias: true });
    game.renderer.setSize(window.innerWidth, window.innerHeight);
    game.renderer.shadowMap.enabled = true;
    game.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.getElementById('game-container').appendChild(game.renderer.domElement);

    game.labelRenderer = new CSS2DRenderer();
    game.labelRenderer.setSize(window.innerWidth, window.innerHeight);
    game.labelRenderer.domElement.style.position = 'absolute';
    game.labelRenderer.domElement.style.top = '0px';
    game.labelRenderer.domElement.style.pointerEvents = 'none';
    document.getElementById('label-container').appendChild(game.labelRenderer.domElement);

    game.css3dRenderer = new CSS3DRenderer();
    game.css3dRenderer.setSize(window.innerWidth, window.innerHeight);
    game.css3dRenderer.domElement.style.position = 'absolute';
    game.css3dRenderer.domElement.style.top = '0px';
    document.getElementById('css3d-container').appendChild(game.css3dRenderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    game.scene.add(ambientLight);
    game.ambientLight = ambientLight;

    const uniforms = sky.material.uniforms;
    uniforms['turbidity'].value = turbidity;
    uniforms['rayleigh'].value = rayleigh;
    uniforms['mieCoefficient'].value = mieCoefficient;
    uniforms['mieDirectionalG'].value = mieDirectionalG;
    uniforms['sunPosition'].value.copy(sun);
    game.renderer.toneMapping = THREE.ACESFilmicToneMapping;
}
