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
    const KPalette = {
      plaster: 0xe8efc9,
      trim: 0xb7c097,
      skirt: 0x66705d,
      wood: 0x6d5433,
      frame: 0x3b3f45,
      glass: 0x8db1c6,
      roofRed: 0xd7413a,
      roofBlue: 0x5570b7,
      roofYellow: 0xd6c14e,
      roofGreen: 0x3e8048,
      roofDark: 0x2f3338
    };

    const KMats = {
      plaster: new THREE.MeshStandardMaterial({ color: KPalette.plaster, roughness: 0.95, metalness: 0.02 }),
      trim:    new THREE.MeshStandardMaterial({ color: KPalette.trim,    roughness: 0.95, metalness: 0.02 }),
      skirt:   new THREE.MeshStandardMaterial({ color: KPalette.skirt,   roughness: 0.95, metalness: 0.02 }),
      wood:    new THREE.MeshStandardMaterial({ color: KPalette.wood,    roughness: 0.9,  metalness: 0.03 }),
      frame:   new THREE.MeshStandardMaterial({ color: KPalette.frame,   roughness: 0.9,  metalness: 0.02 }),
      glass:   new THREE.MeshStandardMaterial({ color: KPalette.glass,   roughness: 0.2,  metalness: 0.02, emissive: 0x111111 }),
      roof: (c) => new THREE.MeshStandardMaterial({
        color: c, roughness: 0.9, metalness: 0.02,
        polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1
      })
    };

    const box = (w,h,d,mat) => { const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d), mat); m.castShadow=m.receiveShadow=!!settings.shadows; return m; };
    const cylinder = (r,h,mat,radial=24) => { const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,radial), mat); m.castShadow=m.receiveShadow=!!settings.shadows; return m; };
    const cone = (r,h,mat,radial=24) => { const m=new THREE.Mesh(new THREE.ConeGeometry(r,h,radial), mat); m.castShadow=m.receiveShadow=!!settings.shadows; return m; };

    function makeWindow(w=12,h=10,depth=1.2) {
      const g = new THREE.Group();
      const frame = box(w, h, depth, KMats.frame); frame.position.y = h/2; g.add(frame);
      const glass = box(w-2, h-2, depth-0.6, KMats.glass); glass.position.y = h/2; glass.position.z = 0.3; g.add(glass);
      return g;
    }
    function makeDoor(w=12,h=18,depth=1.6) {
      const g = new THREE.Group();
      const frame = box(w, h, depth, KMats.frame); frame.position.y = h/2; g.add(frame);
      const panel = box(w-2, h-2, depth-0.6, KMats.wood); panel.position.y = h/2; panel.position.z = 0.4; g.add(panel);
      return g;
    }
    function makeBalcony(w=30,d=10,h=3) {
      const g = new THREE.Group();
      const floor = box(w, 2, d, KMats.wood); floor.position.y = 1; g.add(floor);
      const rail = box(w, h, 1.2, KMats.frame); rail.position.set(0, h/2+2, d/2-0.6); g.add(rail);
      const count = Math.floor((w-4)/3);
      for (let i=0;i<count;i++) {
        const x = -w/2 + 2 + i*3;
        const pk = box(0.6, h-0.8, 1.0, KMats.frame);
        pk.position.set(x, h/2+2, d/2-0.6); g.add(pk);
      }
      return g;
    }
    function makeSign(w=22,h=6) {
      const g = new THREE.Group();
      const slab = box(w, 2, h, KMats.wood); slab.position.set(0, 1, 0); g.add(slab);
      const plate = box(w-2, 1.2, h-1.6, KMats.frame); plate.position.set(0, 1.2, 0.1); g.add(plate);
      return g;
    }

    function makeGableRoof(w,d,thickness,color) {
      const grp = new THREE.Group();
      const t = thickness ?? 2;
      const slopeH = Math.max(w,d) * 0.18;
      const baseY = t/2;
      const s1 = box(w, t, d/2, KMats.roof(color)); s1.position.set(0, baseY, -d/4);
      const s2 = box(w, t, d/2, KMats.roof(color)); s2.position.set(0, baseY,  d/4);
      const ang = Math.atan2(slopeH, d/2);
      s1.rotation.x =  ang; s2.rotation.x = -ang;
      const ridge = box(w + 1.0, t*0.8, 1.4, KMats.roof(KPalette.roofDark));
      ridge.position.set(0, baseY + Math.sin(ang)*(d/2), 0);
      grp.add(s1,s2,ridge);
      return grp;
    }
    function makeHipRoof(w,d,t,color) {
      const grp = new THREE.Group();
      const base = box(w, t ?? 2, d, KMats.roof(color)); base.position.y = (t ?? 2)/2; grp.add(base);
      const cap = box(Math.max(6, w*0.18), 1.6, Math.max(6,d*0.18), KMats.roof(KPalette.roofDark));
      cap.position.y = (t ?? 2)/2 + Math.max(w,d)*0.22 + 0.2; grp.add(cap);
      return grp;
    }
    function makeFlatRoof(w,d,t=2,color=KPalette.roofDark) { const slab = box(w, t, d, KMats.roof(color)); return slab; }
    function makeDomeRoof(radius,color) {
      const grp = new THREE.Group();
      const drum = cylinder(radius*0.95, 10, KMats.roof(KPalette.roofDark), 36); drum.position.y = 5; grp.add(drum);
      const dome = new THREE.Mesh(new THREE.SphereGeometry(radius, 36, 24, 0, Math.PI*2, 0, Math.PI/2), KMats.roof(color));
      dome.position.y = 5; dome.castShadow=dome.receiveShadow=!!settings.shadows; grp.add(dome);
      const cap = cone(radius*0.18, 8, KMats.roof(KPalette.roofDark), 24); cap.position.y = 5 + radius*0.98; grp.add(cap);
      return grp;
    }
    function makeConeRoof(radius,color) {
      const grp = new THREE.Group();
      const eave = cylinder(radius*1.05, 3, KMats.roof(KPalette.roofDark), 32); eave.position.y = 1.5; grp.add(eave);
      const con = cone(radius, radius*1.2, KMats.roof(color), 32); con.position.y = 1.5 + radius*0.6; grp.add(con);
      return grp;
    }

    function makeLevel({ w=60,d=40,h=24, withSkirt=true }={}) {
      const grp = new THREE.Group();
      const body = box(w,h,d,KMats.plaster); body.position.y = h/2; grp.add(body);
      const t = 2.2;
      const corners = [
        [-w/2 + t/2, h/2, -d/2 + t/2], [ w/2 - t/2, h/2, -d/2 + t/2],
        [-w/2 + t/2, h/2,  d/2 - t/2], [ w/2 - t/2, h/2,  d/2 - t/2]
      ];
      corners.forEach(p => { const c = box(t, h, t, KMats.trim); c.position.set(...p); grp.add(c); });
      if (withSkirt) { const sk = box(w+2, 6, d+2, KMats.skirt); sk.position.y = 3; grp.add(sk); }
      return grp;
    }
    function addWindowsRect(grp, { w,d, h, y=10, inset=1.6, gap=12, size=[10,8] }) {
      const [ww,hh] = size;
      const countX = Math.floor((w-16)/gap);
      for (let i=0;i<countX;i++) {
        const x = -w/2 + 8 + i*gap;
        const W1 = makeWindow(ww,hh,inset); W1.position.set(x, y,  d/2 + 0.6); W1.rotation.y = Math.PI; grp.add(W1);
        const W2 = makeWindow(ww,hh,inset); W2.position.set(x, y, -d/2 - 0.6);                grp.add(W2);
      }
      const countZ = Math.floor((d-16)/gap);
      for (let i=0;i<countZ;i++) {
        const z = -d/2 + 8 + i*gap;
        const W1 = makeWindow(ww,hh,inset); W1.position.set( w/2 + 0.6, y, z); W1.rotation.y = -Math.PI/2; grp.add(W1);
        const W2 = makeWindow(ww,hh,inset); W2.position.set(-w/2 - 0.6, y, z); W2.rotation.y =  Math.PI/2; grp.add(W2);
      }
    }

    function makeBuilding(opts) {
      const {
        name="bldg",
        w=60, d=40, floors=2, floorH=24,
        roofType="hip", roofColor=KPalette.roofBlue,
        balcony=false, sign=false, door=true,
        round=false, cone=false,
        position=[0,0,0], rotationY=0
      } = opts;

      const B = new THREE.Group(); B.name = name;
      const levels = new THREE.Group(); B.add(levels);
      const roof = new THREE.Group(); B.add(roof);
      const details = new THREE.Group(); B.add(details);

      if (!round) {
        for (let f=0; f<floors; f++) {
          const L = makeLevel({ w, d, h: floorH });
          L.position.y = f*floorH;
          levels.add(L);
          addWindowsRect(L, { w, d, h: floorH, y: floorH*0.55 });
          if (f === 0 && door) {
            const Dr = makeDoor(14, 20, 2);
            Dr.position.set(0, 10, d/2 + 1.1); Dr.rotation.y = Math.PI;
            L.add(Dr);
          }
          if (f === 1 && balcony) {
            const Bc = makeBalcony(Math.min(36, w-12), 10, 6);
            Bc.position.set(0, floorH + 2, d/2 + 5.6); L.add(Bc);
          }
        }
        const topY = floors * floorH;
        let roofMesh;
        if (roofType === 'gable') roofMesh = makeGableRoof(w-2, d-2, 2, roofColor);
        else if (roofType === 'flat') roofMesh = makeFlatRoof(w-6, d-6, 2.2, KPalette.roofDark);
        else roofMesh = makeHipRoof(w-2, d-2, 2, roofColor);
        roofMesh.position.y = topY + 1.4;
        roof.add(roofMesh);
        if (sign) {
          const s = makeSign(24, 6);
          s.position.set(-w/2 - 2, floorH*0.9, 0);
          s.rotation.y = Math.PI/2;
          details.add(s);
        }
      } else {
        const radius = Math.max(w, d) * 0.45;
        for (let f=0; f<floors; f++) {
          const drum = cylinder(radius * (1 - f*0.05), floorH, KMats.plaster, 32);
          drum.position.y = floorH/2 + f*floorH;
          levels.add(drum);
          for (let i=0;i<8;i++) {
            const ang = (i/8)*Math.PI*2;
            const col = box(2.2, floorH, 2.2, KMats.trim);
            col.position.set(Math.cos(ang)*radius*0.98, floorH/2 + f*floorH, Math.sin(ang)*radius*0.98);
            levels.add(col);
          }
          for (let i=0;i<6;i++) {
            const ang = (i/6)*Math.PI*2;
            const W = makeWindow(10, 9, 1.2);
            W.position.set(Math.cos(ang)*radius*0.98, floorH*0.55 + f*floorH, Math.sin(ang)*radius*0.98);
            W.lookAt(0, W.position.y, 0);
            levels.add(W);
          }
        }
        const topY = floors * floorH;
        const cap = cone ? makeConeRoof(radius*0.95, roofColor) : makeDomeRoof(radius*0.95, roofColor);
        cap.position.y = topY + 2; roof.add(cap);
        // Mark as round and store collider radius for placement
        B.userData.round = true;
        B.userData.roundRadius = radius;
      }

      B.position.set(...position);
      B.rotation.y = rotationY;
      B.traverse(n => { if (n.isMesh) { n.castShadow = !!settings.shadows; n.receiveShadow = !!settings.shadows; }});
      return B;
    }

    const townGroup = new THREE.Group();
    townGroup.name = 'KonohaTown';
    const kit = { THREE, Palette: KPalette, M: KMats, makeBuilding };

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