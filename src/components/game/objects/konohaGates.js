// Minimal, syntax-safe Konoha Gates demo module.
// This replaces the previous version that was throwing a syntax error.
// It is self-contained and safe to import as an ES module in the browser.

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function createKonohaGates(container = document.body, {
  background = 0xbfe6ff,
  pixelRatioMax = 2,
  ui = true
} = {}) {
  // Ensure container can hold overlay text if needed
  const prevPos = getComputedStyle(container).position;
  if (prevPos === 'static') container.style.position = 'relative';

  // Renderer / Scene / Camera
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: background == null });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, pixelRatioMax));
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  if (background != null) scene.background = new THREE.Color(background);

  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 2000);
  camera.position.set(16, 10, 26);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 6, 0);
  controls.enableDamping = true;

  // Lights
  const sun = new THREE.DirectionalLight(0xffffff, 1.2);
  sun.position.set(20, 30, 10);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  scene.add(sun, new THREE.AmbientLight(0xffffff, 0.35));

  // Ground
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 200),
    new THREE.MeshLambertMaterial({ color: 0xd9c39b })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // Simple gate geometry (two towers, a lintel, two doors)
  const openingWidth = 12;
  const towerThickness = 4;
  const towerDepth = 8;
  const doorHeight = 8.8;
  const doorThickness = 0.3;
  const doorWidth = openingWidth / 2;

  const stoneMat = new THREE.MeshStandardMaterial({ color: 0xb69a7a, roughness: 0.9 });
  const roofMat  = new THREE.MeshStandardMaterial({ color: 0xd88f38, roughness: 0.95 });

  const gate = new THREE.Group();
  scene.add(gate);

  // Towers
  const towerGeo = new THREE.BoxGeometry(towerThickness, 10, towerDepth);
  const leftTower = new THREE.Mesh(towerGeo, stoneMat);
  const rightTower = new THREE.Mesh(towerGeo, stoneMat);
  leftTower.position.set(-(openingWidth / 2 + towerThickness / 2), 5, 0);
  rightTower.position.set(+(openingWidth / 2 + towerThickness / 2), 5, 0);
  leftTower.castShadow = leftTower.receiveShadow = true;
  rightTower.castShadow = rightTower.receiveShadow = true;
  gate.add(leftTower, rightTower);

  // Lintel
  const lintelWidth = openingWidth + towerThickness * 2 + 0.2;
  const lintel = new THREE.Mesh(new THREE.BoxGeometry(lintelWidth, 2.2, towerDepth + 0.2), stoneMat);
  lintel.position.set(0, 10.6, 0);
  lintel.castShadow = lintel.receiveShadow = true;
  gate.add(lintel);

  // Roof slabs
  const addRoof = (y, w, d, t, tilt) => {
    const slabL = new THREE.Mesh(new THREE.BoxGeometry(w * 0.55, t, d), roofMat);
    const slabR = slabL.clone();
    slabL.position.set(-w * 0.22, y, 0);
    slabR.position.set(+w * 0.22, y, 0);
    slabL.rotation.z = tilt;
    slabR.rotation.z = -tilt;
    slabL.castShadow = slabL.receiveShadow = true;
    slabR.castShadow = slabR.receiveShadow = true;
    gate.add(slabL, slabR);
  };
  const roofSpan = openingWidth + towerThickness * 2 + 10;
  addRoof(13.0, roofSpan, 12, 0.6, 0.22);
  addRoof(15.0, roofSpan - 6, 10, 0.6, 0.20);

  // Doors (hinged)
  const hingeZ = towerDepth / 2 + doorThickness / 2 + 0.02;
  const doorGroupL = new THREE.Group();
  const doorGroupR = new THREE.Group();
  doorGroupL.position.set(-openingWidth / 2, doorHeight / 2 + 0.5, hingeZ);
  doorGroupR.position.set(+openingWidth / 2, doorHeight / 2 + 0.5, hingeZ);

  const doorMeshL = new THREE.Mesh(new THREE.BoxGeometry(doorWidth, doorHeight, doorThickness), stoneMat);
  const doorMeshR = new THREE.Mesh(new THREE.BoxGeometry(doorWidth, doorHeight, doorThickness), stoneMat);
  doorMeshL.position.set(doorWidth / 2, 0, 0);
  doorMeshR.position.set(-doorWidth / 2, 0, 0);
  doorGroupL.add(doorMeshL);
  doorGroupR.add(doorMeshR);
  gate.add(doorGroupL, doorGroupR);

  // Door control API
  const DOOR_OPEN_ANGLE = THREE.MathUtils.degToRad(115);
  let targetL = -DOOR_OPEN_ANGLE;
  let targetR = +DOOR_OPEN_ANGLE;

  function setGateOpenFraction(f) {
    const clamped = THREE.MathUtils.clamp(f, 0, 1);
    targetL = THREE.MathUtils.lerp(0, -DOOR_OPEN_ANGLE, clamped);
    targetR = THREE.MathUtils.lerp(0, +DOOR_OPEN_ANGLE, clamped);
  }
  function openGates() { setGateOpenFraction(1); }
  function closeGates() { setGateOpenFraction(0); }
  function toggleGates() {
    const closed = Math.abs(targetL) < 1e-3 && Math.abs(targetR) < 1e-3;
    setGateOpenFraction(closed ? 1 : 0);
  }

  // Overlay
  let overlay = null;
  if (ui) {
    overlay = document.createElement('div');
    overlay.textContent = 'Drag to orbit • O=open C=close T=toggle';
    Object.assign(overlay.style, {
      position: 'absolute',
      left: '12px',
      top: '12px',
      padding: '8px 10px',
      color: '#eaeaea',
      background: 'rgba(0,0,0,.55)',
      border: '1px solid #333',
      borderRadius: '10px',
      font: '12px system-ui,-apple-system,Segoe UI,Roboto',
      backdropFilter: 'blur(4px)',
      userSelect: 'none',
      pointerEvents: 'none',
      zIndex: 10
    });
    container.appendChild(overlay);
  }

  // Keyboard bindings (optional)
  const onKeyDown = (e) => {
    const k = e.key.toLowerCase();
    if (k === 'o') openGates();
    if (k === 'c') closeGates();
    if (k === 't') toggleGates();
  };
  window.addEventListener('keydown', onKeyDown);

  // Resize
  const resize = () => {
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = Math.max(0.0001, w / Math.max(1, h));
    camera.updateProjectionMatrix();
  };
  const ro = 'ResizeObserver' in window ? new ResizeObserver(resize) : null;
  if (ro) ro.observe(container);
  window.addEventListener('resize', resize);
  resize();

  // Animate
  const clock = new THREE.Clock();
  let raf = 0;
  const loop = () => {
    const dt = clock.getDelta();
    controls.update();
    doorGroupL.rotation.y = THREE.MathUtils.damp(doorGroupL.rotation.y, targetL, 6, dt);
    doorGroupR.rotation.y = THREE.MathUtils.damp(doorGroupR.rotation.y, targetR, 6, dt);
    renderer.render(scene, camera);
    raf = requestAnimationFrame(loop);
  };
  loop();

  function dispose() {
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', resize);
    window.removeEventListener('keydown', onKeyDown);
    if (ro) ro.disconnect();

    controls.dispose();
    scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.geometry?.dispose?.();
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => {
            m.map?.dispose?.();
            m.dispose?.();
          });
        } else {
          obj.material?.map?.dispose?.();
          obj.material?.dispose?.();
        }
      }
    });
    renderer.dispose();
    renderer.domElement?.remove?.();
    if (overlay && overlay.parentNode === container) container.removeChild(overlay);
  }

  const api = { openGates, closeGates, toggleGates, setGateOpenFraction, scene, camera, renderer, dispose };
  // Optional global helper for quick testing in dev consoles
  if (typeof window !== 'undefined') window.createKonohaGates = api;

  return api;
}