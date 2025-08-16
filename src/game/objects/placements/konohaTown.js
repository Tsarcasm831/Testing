import * as THREE from 'three';
// NOTE: this file is at /src/game/objects/placements/, so we must go up THREE levels to reach /src/components/...
import { addRedBuildings } from '../../../components/game/objects/buildings.red.js';
import { addBlueBuildings } from '../../../components/game/objects/buildings.blue.js';
import { addYellowBuildings } from '../../../components/game/objects/buildings.yellow.js';
import { addGreenBuildings } from '../../../components/game/objects/buildings.green.js';
import { addDarkBuildings } from '../../../components/game/objects/buildings.dark.js';
/* @tweakable world-size used to convert map percent coords to world units (keep in sync with terrain.js) */
import { WORLD_SIZE } from '/src/scene/terrain.js';
/* @tweakable roads definition source for collision avoidance */
import { DEFAULT_ROADS } from '../../../../map/defaults/parts/roads.js';
// Building palette and helpers extracted into separate module
import { createKonohaBuildingKit } from './konohaBuildingKit.js';

// @tweakable global scale factor applied to all Konoha town buildings (1 = original size)
const KONOHA_TOWN_SCALE = 0.5;
/* @tweakable base road avoidance buffer in world units (distance from road centerline) */
const ROAD_AVOID_BUFFER = 8;
/* @tweakable additional padding proportional to building size (multiplied by half-diagonal in XZ) */
const ROAD_AVOID_SIZE_FACTOR = 0.25;
/* @tweakable max attempts to nudge a building off a road before giving up */
const ROAD_AVOID_MAX_ATTEMPTS = 24;
/* @tweakable nudge step size per attempt in world units */
const ROAD_AVOID_STEP = 5;
/* @tweakable road width mapping: world units per map width unit (e.g., width=3 -> 3*4=12 world units total) */
const ROAD_COLLISION_UNITS_PER_WIDTH = 4;
/* @tweakable extra world-units padding added to computed road half-width during collision checks */
const ROAD_COLLISION_EXTRA_PAD = 2;

// Build a cluster of Konoha town buildings and add them to the scene.
// Returns the group representing the town or null on failure.
export function placeKonohaTown(scene, objectGrid, settings, origin = new THREE.Vector3(-320, 0, -220)) {
    try {
      // Obtain palette, materials and building factory from helper module
      const kit = createKonohaBuildingKit(settings);

      const townGroup = new THREE.Group();
      townGroup.name = 'KonohaTown';

      addRedBuildings(townGroup,   { THREE, kit });
      addBlueBuildings(townGroup,  { THREE, kit });
      addYellowBuildings(townGroup,{ THREE, kit });
      addGreenBuildings(townGroup, { THREE, kit });
      addDarkBuildings(townGroup,  { THREE, kit });

    // Apply global town scale (affects visuals and spacing)
    townGroup.scale.setScalar(KONOHA_TOWN_SCALE);

    townGroup.position.copy(origin);
    scene.add(townGroup);

    // helper: precompute road segments in world space
    const roadSegments = (() => {
      const segs = [];
      const toWorld = (xPct, yPct) => ({
        x: (xPct / 100) * WORLD_SIZE - WORLD_SIZE / 2,
        z: (yPct / 100) * WORLD_SIZE - WORLD_SIZE / 2
      });
      for (const r of DEFAULT_ROADS) {
        const pts = r.points || [];
        for (let i = 0; i < pts.length - 1; i++) {
          const a = toWorld(pts[i][0], pts[i][1]);
          const b = toWorld(pts[i + 1][0], pts[i + 1][1]);
          const widthUnits = (r.width || 3) * ROAD_COLLISION_UNITS_PER_WIDTH;
          segs.push({ a, b, half: Math.max(1, widthUnits * 0.5 + ROAD_COLLISION_EXTRA_PAD) });
        }
      }
      return segs;
    })();

    // Build an OBB approximating a building's footprint in world space
    function getBuildingOBB(building) {
      building.updateWorldMatrix(true, true);
      const box = new THREE.Box3().setFromObject(building);
      const center = new THREE.Vector3(), size = new THREE.Vector3();
      box.getCenter(center); box.getSize(size);
      const quat = new THREE.Quaternion(); building.getWorldQuaternion(quat);
      const eulerY = new THREE.Euler().setFromQuaternion(quat, 'YXZ').y;
      return { center: { x: center.x, z: center.z }, hx: Math.max(1, size.x/2), hz: Math.max(1, size.z/2), rotY: eulerY };
    }

    // 2D helpers for segment vs OBB distance (projected on XZ)
    /* @tweakable enable segment-rectangle intersection short-circuit (0 distance if intersecting) */
    const ROAD_SEG_INTERSECT_SHORTCIRCUIT = true;

    function pointInAABB(p, hx, hz) { return Math.abs(p.x) <= hx && Math.abs(p.z) <= hz; }

    function segSegIntersect2D(p1, p2, q1, q2) {
      const o = (a,b,c)=>Math.sign((b.z-a.z)*(c.x-b.x)-(b.x-a.x)*(c.z-b.z));
      const o1=o(p1,p2,q1), o2=o(p1,p2,q2), o3=o(q1,q2,p1), o4=o(q1,q2,p2);
      return (o1!==o2) && (o3!==o4);
    }

    function distancePointAABB(p, hx, hz) {
      const dx = Math.max(0, Math.abs(p.x) - hx);
      const dz = Math.max(0, Math.abs(p.z) - hz);
      return Math.hypot(dx, dz);
    }

    function distanceSegAABB_Local(p0, p1, hx, hz) {
      // Early exit if any endpoint inside
      if (pointInAABB(p0, hx, hz) || pointInAABB(p1, hx, hz)) return 0;
      // Check intersection with each rectangle edge
      if (ROAD_SEG_INTERSECT_SHORTCIRCUIT) {
        const verts = [{x:-hx,z:-hz},{x:hx,z:-hz},{x:hx,z:hz},{x:-hx,z:hz}];
        for (let i=0;i<4;i++){
          const a = verts[i], b = verts[(i+1)%4];
          if (segSegIntersect2D(p0,p1,a,b)) return 0;
        }
      }
      // Otherwise min distance: endpoints -> box, and box vertices -> segment
      let best = Math.min(distancePointAABB(p0,hx,hz), distancePointAABB(p1,hx,hz));
      const verts = [{x:-hx,z:-hz},{x:hx,z:-hz},{x:hx,z:hz},{x:-hx,z:hz}];
      const segV = { x: p1.x - p0.x, z: p1.z - p0.z };
      const segLen2 = Math.max(1e-8, segV.x*segV.x + segV.z*segV.z);
      for (let v of verts) {
        const t = Math.max(0, Math.min(1, ((v.x - p0.x)*segV.x + (v.z - p0.z)*segV.z)/segLen2));
        const cx = p0.x + segV.x*t, cz = p0.z + segV.z*t;
        const dx = v.x - cx, dz = v.z - cz;
        best = Math.min(best, Math.hypot(dx,dz));
      }
      return best;
    }

    function distanceSegOBB2D(seg, obb) {
      // Transform into OBB local space
      const c = obb.center, ang = -obb.rotY;
      const cos = Math.cos(ang), sin = Math.sin(ang);
      const toLocal = ({x,z}) => ({ x: (x - c.x)*cos - (z - c.z)*sin, z: (x - c.x)*sin + (z - c.z)*cos });
      const p0 = toLocal(seg.a), p1 = toLocal(seg.b);
      return distanceSegAABB_Local(p0, p1, obb.hx, obb.hz);
    }

    // test if a building OBB overlaps any road segment given its half-width
    function obbOverlapsAnyRoad(obb) {
      for (let i = 0; i < roadSegments.length; i++) {
        const seg = roadSegments[i];
        const d = distanceSegOBB2D(seg, obb);
        if (d <= seg.half) return true;
      }
      return false;
    }

    // nudge a building locally (townGroup space) until not on road using OBB collision
    function ensureNotOnRoad(building) {
      const localStep = ROAD_AVOID_STEP / KONOHA_TOWN_SCALE;
      const obb0 = getBuildingOBB(building);
      // early out
      if (!obbOverlapsAnyRoad(obb0)) return;

      const dirs = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]];
      const orig = building.position.clone();
      for (let k = 1; k <= ROAD_AVOID_MAX_ATTEMPTS; k++) {
        for (let d = 0; d < dirs.length; d++) {
          building.position.set(orig.x + dirs[d][0]*localStep*k, orig.y, orig.z + dirs[d][1]*localStep*k);
          const obb = getBuildingOBB(building);
          if (!obbOverlapsAnyRoad(obb)) return;
        }
      }
      building.position.copy(orig); // give up: restore original
    }

    const addObbProxy = (building) => {
      // Ensure world matrices reflect current parent scale/transform
      building.updateWorldMatrix(true, false);

      // Compute world-space bounding box (includes scaling and rotation)
      const box = new THREE.Box3().setFromObject(building);
      const center = new THREE.Vector3();
      const size = new THREE.Vector3();
      box.getCenter(center);
      box.getSize(size);

      // World rotation (Y) for OBB orientation
      const quat = new THREE.Quaternion();
      building.getWorldQuaternion(quat);
      const euler = new THREE.Euler().setFromQuaternion(quat, 'YXZ');

      const proxy = new THREE.Object3D();
      proxy.position.set(center.x, 0, center.z);

      // For round buildings, scale the stored radius by world scale (uniform assumed)
      if (building.userData?.round && building.userData?.roundRadius) {
        const scl = new THREE.Vector3();
        building.matrixWorld.decompose(new THREE.Vector3(), new THREE.Quaternion(), scl);
        const avgXZ = (Math.abs(scl.x) + Math.abs(scl.z)) * 0.5;
        proxy.userData.collider = {
          type: 'sphere',
          radius: building.userData.roundRadius * avgXZ
        };
      } else {
        const hx = Math.max(2, size.x / 2);
        const hz = Math.max(2, size.z / 2);
        proxy.userData.collider = {
          type: 'obb',
          center: { x: center.x, z: center.z },
          halfExtents: { x: hx, z: hz },
          rotationY: euler.y
        };
      }

      proxy.userData.label = building.name || 'House';
      objectGrid.add(proxy);
      scene.add(proxy);
    };

    townGroup.children.forEach(colorGroup => {
      colorGroup.children?.forEach(building => {
        ensureNotOnRoad(building);
        addObbProxy(building);
      });
    });

    return townGroup;
  } catch (e) {
    console.warn('Failed to integrate Konoha Buildings:', e);
    return null;
  }
}