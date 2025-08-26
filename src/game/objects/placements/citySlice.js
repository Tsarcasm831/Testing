import * as THREE from 'three';
// NOTE: this file is at /src/game/objects/placements/, so we must go up THREE levels to reach /src/components/...
import { addKonohaCitySlice } from '../../../components/game/objects/citySlice.js';
import { WORLD_SIZE } from '/src/scene/terrain.js';
import { DEFAULT_DISTRICTS } from '../../../../map/defaults/parts/districts.js';

// Global scale factor for the city slice buildings
const CITY_SLICE_SCALE = 0.5;

// Precompute district polygons in world coordinates for quick point-in-poly tests.
const DISTRICT_POLYGONS = Object.values(DEFAULT_DISTRICTS).map(d =>
  d.points.map(([px, py]) => ({
    x: (px / 100) * WORLD_SIZE - WORLD_SIZE / 2,
    z: (py / 100) * WORLD_SIZE - WORLD_SIZE / 2
  }))
);

function pointInPolygon(point, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x, zi = polygon[i].z;
    const xj = polygon[j].x, zj = polygon[j].z;
    const intersect = ((zi > point.z) !== (zj > point.z)) &&
      (point.x < ((xj - xi) * (point.z - zi)) / (zj - zi + 1e-7) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

function isBuildingInsideDistricts(building) {
  building.updateWorldMatrix(true, false);
  const box = new THREE.Box3().setFromObject(building);
  const corners = [
    { x: box.min.x, z: box.min.z },
    { x: box.max.x, z: box.min.z },
    { x: box.max.x, z: box.max.z },
    { x: box.min.x, z: box.max.z }
  ];
  return DISTRICT_POLYGONS.some(poly =>
    corners.every(corner => pointInPolygon(corner, poly))
  );
}

// Build the Konoha city slice and add it to the scene with collision proxies.
// Returns the slice group or null on failure.
export function placeCitySlice(scene, objectGrid, settings, origin = new THREE.Vector3(300, 0, 300)) {
  try {
    // Build the slice into a temporary root
    const root = new THREE.Group();
    const { slice } = addKonohaCitySlice(root, { rows: 6, cols: 5 });

    // Apply global scale and position
    slice.scale.setScalar(CITY_SLICE_SCALE);
    slice.position.copy(origin);
    scene.add(slice);

    // Helper to create OBB collider proxies for each building
    const addObbProxy = (building) => {
      building.updateWorldMatrix(true, false);

      const box = new THREE.Box3().setFromObject(building);
      const center = new THREE.Vector3();
      const size = new THREE.Vector3();
      box.getCenter(center);
      box.getSize(size);

      const quat = new THREE.Quaternion();
      building.getWorldQuaternion(quat);
      const euler = new THREE.Euler().setFromQuaternion(quat, 'YXZ');

      const proxy = new THREE.Object3D();
      proxy.position.set(center.x, 0, center.z);
      proxy.userData = {
        label: building.name || 'SliceBuilding',
        collider: {
          type: 'obb',
          center: { x: center.x, z: center.z },
          halfExtents: {
            x: Math.max(2, size.x / 2),
            z: Math.max(2, size.z / 2)
          },
          rotationY: euler.y
        }
      };
      objectGrid.add(proxy);
      scene.add(proxy);
    };

    // Register proxies for all buildings that lie inside a district
    slice.children.slice().forEach((building) => {
      if (isBuildingInsideDistricts(building)) {
        addObbProxy(building);
      } else {
        console.warn('Removing building outside district bounds:', building.name || building.id);
        slice.remove(building);
      }
    });

    return slice;
  } catch (e) {
    console.warn('Failed to place city slice:', e);
    return null;
  }
}
