// @tweakable base path anchor for terrain imports (change only if your host serves /src under a different root)
import { WORLD_SIZE as WORLD_SIZE_CONST } from '/src/scene/terrain.js';
import { ObjectGrid } from './grid.js';
// @tweakable master switch to spawn legacy central wall geometry and colliders
const ENABLE_WALLS = false;
// @tweakable spawn Konoha Gates tied to the legacy wall opening
const ENABLE_WALL_GATES = false;
// @tweakable enable/disable the custom circular wall
const ENABLE_CUSTOM_RING_WALL = true;
/* @tweakable center grid label for the custom wall */
const CUSTOM_WALL_CENTER_LABEL = 'LE318';
/* @tweakable edge grid label used to compute wall radius (radius = distance(center, edge)) */
const CUSTOM_WALL_EDGE_LABEL = 'CN318';
/* @tweakable wall thickness in GRID CELLS (1 grid cell = 5 world units) */
const CUSTOM_WALL_WIDTH_GRIDS = 3;
/* @tweakable wall height (world units) */
const CUSTOM_WALL_HEIGHT = 30;
/* @tweakable wall circle segments (higher = smoother but more triangles) */
const CUSTOM_WALL_SEGMENTS = 140;
/* @tweakable collider spacing along circumference (world units between sphere proxies) */
const CUSTOM_WALL_COLLIDER_SPACING = 16;
/* @tweakable collider sphere radius (world units) */
const CUSTOM_WALL_COLLIDER_RADIUS = 10;
/* @tweakable wall color (hex integer) */
const CUSTOM_WALL_COLOR = 0xbfbfbf;
import { createCentralWallWithGate } from './walls/centralWall.js';
import { placeHokagePalace } from './placements/hokagePalace.js';
import { placeHokageMonument } from './placements/hokageMonument.js';
import { placeIchiraku } from './placements/ichiraku.js';
import { placeKonohaTown } from './placements/konohaTown.js';
import { placeKonohaGates } from './placements/konohaGates.js';
import { placeCitySlice } from './placements/citySlice.js';
import { WALL_RADIUS } from '../player/movement/constants.js';
import { parseGridLabel, posForCell } from './utils/gridLabel.js';

// Build all world objects and return { objects, grid }
export function updateObjects(scene, currentObjects, settings) {
  // Remove previously added objects
  currentObjects.forEach(obj => scene.remove(obj));

  const renderObjects = [];
  const worldSize = WORLD_SIZE_CONST;
  const objectGrid = new ObjectGrid(worldSize, 200);

  // Legacy central wall temporarily disabled (toggle ENABLE_WALLS to true to re-enable)
  if (ENABLE_WALLS) {
    const { group: wall, colliders } = createCentralWallWithGate({
      scene, worldSize, radius: WALL_RADIUS, height: 30, segments: 160,
      colliderSpacing: 18, colliderRadius: 12, color: 0xffffff, thickness: 5, openingAt: 'south'
    });
    renderObjects.push(wall);
    colliders.forEach(c => objectGrid.add(c));
  }

  // Gates depend on the wall opening; keep off while walls are disabled
  if (ENABLE_WALL_GATES && ENABLE_WALLS) {
    const gates = placeKonohaGates(scene, objectGrid, worldSize, settings, { openingAt: 'south', scale: 4 });
    if (gates) renderObjects.push(gates);
  }

  // NEW: Custom ring wall centered at a specific grid label, radius from another label
  if (ENABLE_CUSTOM_RING_WALL) {
    try {
      const { i: ci, j: cj } = parseGridLabel(CUSTOM_WALL_CENTER_LABEL);
      const { i: ei, j: ej } = parseGridLabel(CUSTOM_WALL_EDGE_LABEL);
      const center = posForCell(ci, cj, worldSize);
      const edge = posForCell(ei, ej, worldSize);
      const radius = Math.hypot(edge.x - center.x, edge.z - center.z);
      const thickness = Math.max(0.5, (CUSTOM_WALL_WIDTH_GRIDS || 1) * 5); // 1 grid cell = 5 world units

      const { group, colliders } = createCentralWallWithGate({
        scene,
        worldSize,
        radius,
        height: CUSTOM_WALL_HEIGHT,
        segments: CUSTOM_WALL_SEGMENTS,
        colliderSpacing: CUSTOM_WALL_COLLIDER_SPACING,
        colliderRadius: CUSTOM_WALL_COLLIDER_RADIUS,
        color: CUSTOM_WALL_COLOR,
        thickness,
        // Ensure no opening: choose labels that produce zero-length gap and set removeExactlyBetween=true
        gateFromLabel: CUSTOM_WALL_CENTER_LABEL,
        gateToLabel: CUSTOM_WALL_CENTER_LABEL,
        removeExactlyBetween: true,
        openingAt: null
      });

      // Offset the visual wall to the desired center
      group.position.set(center.x, 0, center.z);
      renderObjects.push(group);

      // Register world-space collider proxies into the spatial grid
      if (Array.isArray(colliders)) {
        colliders.forEach(localProxy => {
          const worldProxy = new THREE.Object3D();
          const wp = localProxy.position.clone().add(group.position);
          worldProxy.position.copy(wp);
          worldProxy.userData = {
            ...localProxy.userData,
            // ensure collider center reflects world position for AABB/OBB
            collider: localProxy.userData?.collider
              ? {
                  ...localProxy.userData.collider,
                  center: {
                    x: wp.x,
                    z: wp.z
                  }
                }
              : null
          };
          objectGrid.add(worldProxy);
          scene.add(worldProxy);
          renderObjects.push(worldProxy);
        });
      }
    } catch (e) {
      console.warn('Failed to create custom ring wall:', e);
    }
  }

  // Buildings
  const palace = placeHokagePalace(scene, objectGrid, worldSize, settings);
  if (palace) renderObjects.push(palace);

  const monument = placeHokageMonument(scene, objectGrid, worldSize, settings);
  if (monument) renderObjects.push(monument);

  const ichiraku = placeIchiraku(scene, objectGrid, worldSize, settings);
  if (ichiraku) renderObjects.push(ichiraku);

  const town = placeKonohaTown(scene, objectGrid, settings);
  if (town) renderObjects.push(town);

  const citySlice = placeCitySlice(scene, objectGrid, settings);
  if (citySlice) renderObjects.push(citySlice);

  return { objects: renderObjects, grid: objectGrid };
}