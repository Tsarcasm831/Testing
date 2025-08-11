import { WORLD_SIZE as WORLD_SIZE_CONST } from '../../scene/terrain.js';
import { ObjectGrid } from './grid.js';
import { createCentralWallWithGate } from './walls/centralWall.js';
import { createHokagePalace } from './houses/HokagePalace.js';
import { createIchiraku } from './houses/ichiraku.js';
import { parseGridLabel, posForCell } from './utils/gridLabel.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three'; // FIX: Needed for THREE.Group and vector ops

// Populate the spatial grid with the given objects (kept for future expansion)
function populateGrid(grid, objects) {
  objects.forEach(obj => grid.add(obj));
}

// Lean world: only the central wall ring with colliders, plus key landmarks.
export function updateObjects(scene, currentObjects, settings) {
  // Remove previously added objects
  currentObjects.forEach(obj => scene.remove(obj));

  const renderObjects = [];
  const worldSize = WORLD_SIZE_CONST;

  // Create spatial grid
  const objectGrid = new ObjectGrid(worldSize, 200);

  // Central wall with a gap removed exactly between KJ493 and KW493
  const { group, colliders } = createCentralWallWithGate({
    scene,
    worldSize,
    radius: 960,
    height: 30,
    segments: 160,
    colliderSpacing: 18,
    colliderRadius: 12,
    color: 0xffffff, // white
    thickness: 5,    // 5 grids thick
    gateFromLabel: 'KJ493',
    gateToLabel: 'KW493',
    removeExactlyBetween: true
  });

  renderObjects.push(group);

  // Populate grid with colliders so interaction and avoidance still work
  colliders.forEach(c => objectGrid.add(c));

  // NEW: Place Hokage Palace at KN182
  try {
    const targetLabel = 'KN182';
    const { i, j } = parseGridLabel(targetLabel);
    const pos = posForCell(i, j, worldSize);
    // Place on ground level Y=0
    pos.y = 0;

    const { group: palace, colliderProxies } = createHokagePalace({ position: pos, settings });
    scene.add(palace);
    renderObjects.push(palace);

    // Add all fine-grained collider proxies to scene and grid for precise avoidance
    if (Array.isArray(colliderProxies)) {
      colliderProxies.forEach(proxy => {
        scene.add(proxy);
        objectGrid.add(proxy);
      });
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Failed to place Hokage Palace at KN182:', e);
  }

  // NEW: Place Hokage Monument GLB at KN129
  try {
    const monumentLabel = 'KN129';
    const { i: mi, j: mj } = parseGridLabel(monumentLabel);
    const mPos = posForCell(mi, mj, worldSize);
    mPos.y = 0;

    // Wrapper group so we can cleanly remove it later
    const monumentGroup = new THREE.Group();
    monumentGroup.name = 'HokageMonument';
    monumentGroup.position.copy(mPos);
    scene.add(monumentGroup);
    renderObjects.push(monumentGroup);

    // Also add a lightweight proxy to the spatial grid so it shows on minimap/tooltips
    const monumentProxy = new THREE.Object3D();
    monumentProxy.position.set(mPos.x, mPos.y, mPos.z);
    monumentProxy.userData = {
      label: 'Hokage Monument',
      // Scale collider to roughly match the new 3× larger monument size
      collider: { type: 'sphere', radius: 180 }
    };
    objectGrid.add(monumentProxy);

    const loader = new GLTFLoader();
    loader.load(
      '/src/assets/Hokage_Monument.glb',
      (gltf) => {
        const model = gltf.scene || gltf.scenes?.[0];
        if (!model) return;
        // 3x bigger than current (previously 18)
        model.scale.set(54, 54, 54);
        model.traverse((n) => {
          if (n.isMesh) {
            n.castShadow = !!settings.shadows;
            n.receiveShadow = !!settings.shadows;
          }
        });
        // Ensure it's not sunk below ground (in case origin differs)
        model.position.y = 0;
        monumentGroup.add(model);
      },
      undefined,
      (err) => {
        console.error('Failed to load Hokage Monument GLB:', err);
      }
    );
  } catch (e) {
    console.warn('Failed to place Hokage Monument at KN129:', e);
  }

  // NEW: Place Ichiraku Ramen at LF480
  try {
    const ichirakuLabel = 'LF480';
    const { i: ii, j: ij } = parseGridLabel(ichirakuLabel);
    const iPos = posForCell(ii, ij, worldSize);
    iPos.y = 0;

    const { group: ichiraku, colliderProxy: ichirakuCollider } = createIchiraku({ position: iPos, settings });
    scene.add(ichiraku);
    renderObjects.push(ichiraku);

    if (ichirakuCollider) {
      scene.add(ichirakuCollider);
      objectGrid.add(ichirakuCollider);
    }
  } catch (e) {
    console.warn('Failed to place Ichiraku at LF480:', e);
  }

  return { objects: renderObjects, grid: objectGrid };
}