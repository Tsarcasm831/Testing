import * as THREE from 'three';
import { parseGridLabel, posForCell } from '../utils/gridLabel.js';
import { WALL_RADIUS } from '../../player/movement/constants.js';

/**
 * Lightweight gate builder adapted from components/game/objects/konohaGates.js
 * Returns a THREE.Group that can be added into the existing world scene.
 * Parameters:
 *  - scale: world scale multiplier (default 4 to match ~48u wall opening)
 *  - settings: { shadows: boolean }
 */
function buildKonohaGatesGroup({ scale = 4, settings = {} } = {}) {
  const group = new THREE.Group();
  const castRec = (obj) => { obj.castShadow = obj.receiveShadow = !!settings.shadows; return obj; };

  // Materials
  const stoneMat = new THREE.MeshStandardMaterial({ color: 0xb69a7a, roughness: 0.9 });
  const roofMat  = new THREE.MeshStandardMaterial({ color: 0xd88f38, roughness: 0.95 });
  const signMat  = new THREE.MeshBasicMaterial({ toneMapped: false }); // texture assigned below
  const woodMat  = new THREE.MeshStandardMaterial({ color: 0x86a688, roughness: 0.95 });
  const plankRim = new THREE.MeshStandardMaterial({ color: 0x2c3a2f, roughness: 0.95 });

  // Helpers to make simple canvas textures (no external files)
  function makePlankTexture({ w = 512, h = 1024, base = '#86a688', groove = '#2c3a2f', mark = 'あ' }) {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const ctx = c.getContext('2d');

    ctx.fillStyle = base; ctx.fillRect(0, 0, w, h);
    const plankW = w / 10; ctx.strokeStyle = groove; ctx.lineWidth = 3;
    for (let i = 0; i <= 10; i++) { ctx.beginPath(); ctx.moveTo(i * plankW, 0); ctx.lineTo(i * plankW, h); ctx.stroke(); }
    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    for (let i = 0; i < 6; i++) { const y = (i + 1) * (h / 7); ctx.fillRect(0, y - 3, w, 6); }
    ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = 12; ctx.strokeRect(6, 6, w - 12, h - 12);

    // Painted hiragana
    ctx.save();
    ctx.translate(w * 0.52, h * 0.60);
    ctx.rotate(mark === 'あ' ? -0.08 : 0.08);
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const fontSize = Math.floor(h * 0.72);
    ctx.font = `900 ${fontSize}px 'Yu Mincho','Hiragino Mincho Pro','Noto Serif JP','MS Mincho',serif`;
    ctx.lineWidth = Math.max(14, Math.floor(fontSize * 0.06));
    ctx.strokeStyle = '#7a1b16'; ctx.fillStyle = '#7a1b16';
    ctx.strokeText(mark, 0, 0);
    ctx.fillText(mark, 0, 0);
    ctx.restore();

    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = 4;
    return tex;
  }

  function makeLeafSignTexture(w = 1024, h = 256) {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const ctx = c.getContext('2d');

    ctx.fillStyle = '#efe9df'; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = '#2b2b2b'; ctx.lineWidth = 10; ctx.strokeRect(8, 8, w - 16, h - 16);

    ctx.fillStyle = '#2b2b2b'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = "bold 140px 'Yu Mincho','Hiragino Mincho Pro','Noto Serif JP','MS Mincho',serif";
    ctx.fillText('忍', w * 0.12, h * 0.55);
    ctx.fillText('忍', w * 0.88, h * 0.55);

    const cx = w * 0.5, cy = h * 0.53;
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(-0.05);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#2b2b2b'; ctx.fillStyle = '#2b2b2b'; ctx.lineWidth = 10;

    const R = 62, k = 26 / Math.PI, turns = 1.45 * Math.PI;
    ctx.beginPath();
    for (let t = 0; t <= turns; t += 0.02) {
      const r = R - k * t;
      const x = r * Math.cos(t), y = r * Math.sin(t);
      if (t === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    const tEnd = turns, rEnd = R - k * tEnd;
    const xEnd = rEnd * Math.cos(tEnd), yEnd = rEnd * Math.sin(tEnd);
    ctx.quadraticCurveTo(xEnd + 48, yEnd - 10, xEnd + 112, yEnd - 18);
    ctx.stroke();

    const ang = 2.1, tipLen = 22, baseW = 22;
    const bx = R * Math.cos(ang), by = R * Math.sin(ang);
    const tx = (R + tipLen) * Math.cos(ang), ty = (R + tipLen) * Math.sin(ang);
    const px = Math.cos(ang + Math.PI / 2) * (baseW / 2);
    const py = Math.sin(ang + Math.PI / 2) * (baseW / 2);
    ctx.beginPath();
    ctx.moveTo(bx + px, by + py); ctx.lineTo(tx, ty); ctx.lineTo(bx - px, by - py);
    ctx.closePath(); ctx.fill();
    ctx.restore();

    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = 4;
    return tex;
  }

  // Dimensions (same proportions as demo)
  const openingWidth = 12;
  const towerThickness = 4;
  const towerDepth = 8;
  const doorHeight = 8.8;
  const doorThickness = 0.3;
  const doorWidth = openingWidth / 2;

  // Towers
  const towerGeo = new THREE.BoxGeometry(towerThickness, 10, towerDepth);
  const leftTower = castRec(new THREE.Mesh(towerGeo, stoneMat));
  const rightTower = castRec(new THREE.Mesh(towerGeo, stoneMat));
  leftTower.position.set(-(openingWidth / 2 + towerThickness / 2), 5, 0);
  rightTower.position.set(+(openingWidth / 2 + towerThickness / 2), 5, 0);
  group.add(leftTower, rightTower);

  // Lintel
  const lintelWidth = openingWidth + towerThickness * 2 + 0.2;
  const lintel = castRec(new THREE.Mesh(new THREE.BoxGeometry(lintelWidth, 2.2, towerDepth + 0.2), stoneMat));
  lintel.position.set(0, 10.6, 0);
  group.add(lintel);

  // Signboard
  const signTex = makeLeafSignTexture();
  signMat.map = signTex;
  const sign = castRec(new THREE.Mesh(new THREE.PlaneGeometry(12, 2.6), signMat));
  sign.position.set(0, 11.4, towerDepth / 2 + 0.11);
  group.add(sign);

  // Roofs
  function addRoof(y, w, d, t, tilt) {
    const slabL = castRec(new THREE.Mesh(new THREE.BoxGeometry(w * 0.55, t, d), roofMat));
    slabL.position.set(-w * 0.22, y, 0); slabL.rotation.z = tilt;
    group.add(slabL);
  }
  const roofSpan = openingWidth + towerThickness * 2 + 10;
  addRoof(13.0, roofSpan, 12, 0.6, 0.22);
  addRoof(15.0, roofSpan - 6, 10, 0.6, 0.20);

  // Doors (hinged)
  const hingeZ = towerDepth / 2 + doorThickness / 2 + 0.02;
  const doorGroupL = new THREE.Group();
  const doorGroupR = new THREE.Group();
  doorGroupL.position.set(-openingWidth / 2, doorHeight / 2 + 0.5, hingeZ);
  doorGroupR.position.set(+(openingWidth / 2), doorHeight / 2 + 0.5, hingeZ);

  const plankTexL = makePlankTexture({ mark: 'あ' });
  const plankTexR = makePlankTexture({ mark: 'ん' });
  const doorMatL = new THREE.MeshStandardMaterial({ map: plankTexL, roughness: 0.95 });
  const doorMatR = new THREE.MeshStandardMaterial({ map: plankTexR, roughness: 0.95 });

  const doorMeshL = castRec(new THREE.Mesh(new THREE.BoxGeometry(doorWidth, doorHeight, doorThickness), doorMatL));
  const doorMeshR = castRec(new THREE.Mesh(new THREE.BoxGeometry(doorWidth, doorHeight, doorThickness), doorMatR));
  doorMeshL.position.set(doorWidth / 2, 0, 0);
  doorMeshR.position.set(-doorWidth / 2, 0, 0);
  doorGroupL.add(doorMeshL); doorGroupR.add(doorMeshR);
  group.add(doorGroupL, doorGroupR);

  // Scale whole assembly for world
  group.scale.setScalar(scale);

  // Collider proxies (two towers as OBBs)
  const colliders = [];
  const addOBB = (cx, cz, hx, hz, rotY, label) => {
    const p = new THREE.Object3D();
    p.position.set(cx, 0, cz);
    p.userData.collider = {
      type: 'obb',
      center: { x: cx, z: cz },
      halfExtents: { x: hx, z: hz },
      rotationY: rotY
    };
    p.userData.label = label;
    colliders.push(p);
  };
  // Tower OBBs in local, then we'll transform to world when placing
  // Half sizes (scale applied later when positioning)
  const tHX = (towerThickness / 2) * scale;
  const tHZ = (towerDepth / 2) * scale;
  const lTowerLocal = new THREE.Vector3((-(openingWidth / 2 + towerThickness / 2)) * scale, 0, 0);
  const rTowerLocal = new THREE.Vector3(((openingWidth / 2 + towerThickness / 2)) * scale, 0, 0);
  // Store local bounds; placeIchiraku style placement will convert to world
  group.userData._obbLocals = [
    { pos: lTowerLocal, hx: tHX, hz: tHZ, label: 'Konoha Gate Tower (L)' },
    { pos: rTowerLocal, hx: tHX, hz: tHZ, label: 'Konoha Gate Tower (R)' }
  ];

  // Expose door groups for optional animation (if needed later)
  group.userData.doors = { left: doorGroupL, right: doorGroupR };

  return { group, colliders };
}

/**
 * Place the Konoha Gates at the opening between two grid labels on the central wall.
 * The gate will be centered at WALL_RADIUS and oriented so its front faces outward.
 *
 * @param {THREE.Scene} scene
 * @param {ObjectGrid} objectGrid
 * @param {number} worldSize
 * @param {object} settings
 * @param {object} opts { gateFromLabel, gateToLabel, scale }
 */
export function placeKonohaGates(scene, objectGrid, worldSize, settings, opts = {}) {
  const {
    gateFromLabel = 'KX491',
    gateToLabel = 'KD491',
    scale = 4
  } = opts;

  // Compute opening midpoint angle from labels (same approach used by wall)
  const { i: i1, j: j1 } = parseGridLabel(gateFromLabel);
  const { i: i2, j: j2 } = parseGridLabel(gateToLabel);
  const p1 = posForCell(i1, j1, worldSize);
  const p2 = posForCell(i2, j2, worldSize);
  const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
  const theta = Math.atan2(mid.z, mid.x);

  // World position on wall radius
  const radius = WALL_RADIUS;
  const pos = new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius);

  // Build gates group
  const { group } = buildKonohaGatesGroup({ scale, settings });

  // Position at wall and orient so +Z faces outward (radial)
  group.position.copy(pos);
  // Make -Z face center so +Z points outward
  group.lookAt(0, group.position.y, 0);

  // Add to scene
  scene.add(group);

  // Build and register OBB colliders for both towers with world transform applied
  const worldQuat = new THREE.Quaternion();
  group.getWorldQuaternion(worldQuat);
  const eulerY = new THREE.Euler().setFromQuaternion(worldQuat, 'YXZ').y;

  (group.userData._obbLocals || []).forEach(({ pos: localPos, hx, hz, label }) => {
    const worldPos = localPos.clone().applyQuaternion(worldQuat).add(group.position);
    const proxy = new THREE.Object3D();
    proxy.position.set(worldPos.x, 0, worldPos.z);
    proxy.userData.collider = {
      type: 'obb',
      center: { x: worldPos.x, z: worldPos.z },
      halfExtents: { x: hx, z: hz },
      rotationY: eulerY
    };
    proxy.userData.label = label;
    objectGrid.add(proxy);
    scene.add(proxy);
  });

  group.name = 'KonohaGates';
  return group;
}
```

```src/game/objects/placements/konohaTown.js
import * as THREE from 'three';
import { parseGridLabel, posForCell } from '../utils/gridLabel.js';

// LIGHTWEIGHT: adapted from components/game/objects/konohaBuildings.js
export function placeKonohaTown(scene, objectGrid, settings) {
    const town = new THREE.Group(); town.name = "KonohaTown"; scene.add(town);
    const buildingPalette = {
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

    const M = {
        plaster: new THREE.MeshStandardMaterial({ color: buildingPalette.plaster, roughness:.95 }),
        trim:    new THREE.MeshStandardMaterial({ color: buildingPalette.trim,    roughness:.95 }),
        skirt:   new THREE.MeshStandardMaterial({ color: buildingPalette.skirt,   roughness:.95 }),
        wood:    new THREE.MeshStandardMaterial({ color: buildingPalette.wood,    roughness:.9 }),
        frame:   new THREE.MeshStandardMaterial({ color: buildingPalette.frame,   roughness:.9 }),
        glass:   new THREE.MeshStandardMaterial({ color: buildingPalette.glass,   roughness:.2, metalness:.1, emissive:0x111318}),
        roof: (c) => new THREE.MeshStandardMaterial({
            color: c, roughness:.9, metalness:.02,
            polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1
        })
    };

    // Helper functions
    function box(w, h, d, mat) {
        const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
        m.castShadow = m.receiveShadow = true;
        return m;
    }
    function cylinder(r, h, mat, radial = 32) {
        const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, radial), mat);
        m.castShadow = m.receiveShadow = true;
        return m;
    }
    function cone(r, h, mat, radial = 32) {
        const m = new THREE.Mesh(new THREE.ConeGeometry(r, h, radial), mat);
        m.castShadow = m.receiveShadow = true;
        return m;
    }
    function seamLines(mesh, color = 0x20242a, alpha = 0.28) {
        const g = new THREE.EdgesGeometry(mesh.geometry, 25);
        const m = new THREE.LineBasicMaterial({ color, transparent: true, opacity: alpha });
        const lines = new THREE.LineSegments(g, m);
        lines.position.copy(mesh.position);
        lines.rotation.copy(mesh.rotation);
        mesh.add(lines);
        return lines;
    }
    function makeWindow(w = 12, h = 10, depth = 1.2) {
        const g = new THREE.Group();
        const frame = box(w, h, depth, M.frame); frame.position.y = h / 2; g.add(frame);
        const glass = box(w - 2, h - 2, depth - 0.6, M.glass); glass.position.y = h / 2; glass.position.z = 0.3; g.add(glass);
        return g;
    }
    function makeDoor(w = 12, h = 18, depth = 1.6) {
        const g = new THREE.Group();
        const frame = box(w, h, depth, M.frame); frame.position.y = h / 2; g.add(frame);
        const panel = box(w - 2, h - 2, depth - 0.6, M.wood); panel.position.y = h / 2; panel.position.z = 0.4; g.add(panel);
        return g;
    }
    function makeBalcony(w = 30, d = 10, h = 3) {
        const g = new THREE.Group();
        const floor = box(w, 2, d, M.wood); floor.position.y = 1; g.add(floor);
        const rail = new THREE.Mesh(new THREE.BoxGeometry(w, h, 1.2), M.frame);
        rail.position.set(0, h / 2 + 2, d / 2 - 0.6); rail.castShadow = true; g.add(rail);
        const count = Math.floor((w - 4) / 3);
        for (let i = 0; i < count; i++) {
            const x = -w / 2 + 2 + i * 3;
            const pk = box(0.6, h - 0.8, 1.0, M.frame);
            pk.position.set(x, h / 2 + 2, d / 2 - 0.6); g.add(pk);
        }
        return g;
    }
    function makeSign(w = 22, h = 6) {
        const g = new THREE.Group();
        const slab = box(w, 2, h, M.wood); slab.position.set(0, 1, 0); g.add(slab);
        const plate = box(w - 2, 1.2, h - 1.6, M.frame); plate.position.set(0, 1.2, 0.1); g.add(plate);
        return g;
    }

    // Build buildings
    const buildings = new THREE.Group(); town.add(buildings);

    // Red buildings
    buildings.add(new THREE.Group({
        name: 'RedBuildings',
        children: [
            makeBuilding({
                w: 60,
                d: 40,
                floors: 2,
                roofType: 'gable',
                roofColor: buildingPalette.roofRed,
                balcony: true,
                sign: true,
                position: [-220, 0, -40],
                rotationY: Math.PI * 0.02
            }),
            makeBuilding({
                w: 58,
                d: 40,
                floors: 2,
                roofType: 'gable',
                roofColor: buildingPalette.roofRed,
                balcony: true,
                position: [60, 0, -40],
                rotationY: -0.06
            }),
            makeBuilding({
                w: 64,
                d: 44,
                floors: 2,
                roofType: 'gable',
                roofColor: buildingPalette.roofRed,
                position: [10, 0, 64]
            }),
            makeBuilding({
                w: 60,
                d: 44,
                floors: 2,
                roofType: 'gable',
                roofColor: buildingPalette.roofRed,
                sign: true,
                position: [-150, 0, 160]
            }),
            makeBuilding({
                w: 50,
                d: 36,
                floors: 2,
                roofType: 'gable',
                roofColor: buildingPalette.roofRed,
                position: [90, 0, 160]
            }),
        ]
    }));

    // Blue buildings
    buildings.add(new THREE.Group({
        name: 'BlueBuildings',
        children: [
            makeBuilding({
                w: 46,
                d: 34,
                floors: 2,
                roofType: 'gable',
                roofColor: buildingPalette.roofBlue,
                sign: true,
                position: [-150, 0, -30]
            }),
            makeBuilding({
                w: 70,
                d: 44,
                floors: 2,
                roofType: 'gable',
                roofColor: buildingPalette.roofBlue,
                position: [-220, 0, 60]
            }),
            makeBuilding({
                w: 70,
                d: 70,
                floors: 2,
                round: true,
                roofColor: buildingPalette.roofBlue,
                position: [-140, 0, 60]
            }),
            makeBuilding({
                w: 62,
                d: 40,
                floors: 2,
                roofType: 'gable',
                roofColor: buildingPalette.roofBlue,
                balcony: true,
                position: [-150, 0, 160]
            }),
            makeBuilding({
                w: 50,
                d: 36,
                floors: 2,
                roofType: 'gable',
                roofColor: buildingPalette.roofBlue,
                position: [90, 0, 160]
            }),
        ]
    }));

    // Yellow buildings
    buildings.add(new THREE.Group({
        name: 'YellowBuildings',
        children: [
            makeBuilding({
                w: 46,
                d: 34,
                floors: 2,
                roofType: 'hip',
                roofColor: buildingPalette.roofYellow,
                sign: true,
                position: [-150, 0, -30]
            }),
            makeBuilding({
                w: 70,
                d: 44,
                floors: 2,
                roofType: 'hip',
                roofColor: buildingPalette.roofYellow,
                position: [-220, 0, 60]
            }),
            makeBuilding({
                w: 70,
                d: 70,
                floors: 2,
                round: true,
                roofColor: buildingPalette.roofYellow,
                position: [-140, 0, 60]
            }),
            makeBuilding({
                w: 62,
                d: 40,
                floors: 2,
                roofType: 'gable',
                roofColor: buildingPalette.roofYellow,
                balcony: true,
                position: [-150, 0, 160]
            }),
            makeBuilding({
                w: 50,
                d: 36,
                floors: 2,
                roofType: 'gable',
                roofColor: buildingPalette.roofYellow,
                position: [90, 0, 160]
            }),
        ]
    }));

    // Green buildings
    buildings.add(new THREE.Group({
        name: 'GreenBuildings',
        children: [
            makeBuilding({
                w: 60,
                d: 40,
                floors: 2,
                roofType: 'hip',
                roofColor: buildingPalette.roofGreen,
                balcony: true,
                sign: true,
                position: [-220, 0, -40],
                rotationY: Math.PI * 0.02
            }),
            makeBuilding({
                w: 58,
                d: 40,
                floors: 2,
                roofType: 'hip',
                roofColor: buildingPalette.roofGreen,
                balcony: true,
                position: [60, 0, -40],
                rotationY: -0.06
            }),
            makeBuilding({
                w: 64,
                d: 44,
                floors: 2,
                roofType: 'hip',
                roofColor: buildingPalette.roofGreen,
                position: [10, 0, 64]
            }),
            makeBuilding({
                w: 60,
                d: 44,
                floors: 2,
                roofType: 'hip',
                roofColor: buildingPalette.roofGreen,
                sign: true,
                position: [-150, 0, 160]
            }),
            makeBuilding({
                w: 50,
                d: 36,
                floors: 2,
                roofType: 'hip',
                roofColor: buildingPalette.roofGreen,
                position: [90, 0, 160]
            }),
        ]
    }));

    // Dark buildings
    buildings.add(new THREE.Group({
        name: 'DarkBuildings',
        children: [
            makeBuilding({
                w: 52,
                d: 38,
                floors: 2,
                roofType: 'flat',
                roofColor: buildingPalette.roofDark,
                position: [-90, 0, -36]
            }),
        ]
    }));

    return town;
}

// Complex building factory
function makeBuilding(opts) {
    const {
        name = "bldg",
        w = 60, d = 40, floors = 2, floorH = 24,
        roofType = "hip", roofColor = buildingPalette.roofBlue,
        balcony = false, sign = false, door = true,
        round = false, cone = false,
        position = [0, 0, 0], rotationY = 0
    } = opts;

    const B = new THREE.Group(); B.name = name;
    const foundation = new THREE.Group(); foundation.name = "foundation"; B.add(foundation);
    const levels = new THREE.Group();     levels.name     = "levels";     B.add(levels);
    const details = new THREE.Group();    details.name    = "details";    B.add(details);
    const roof = new THREE.Group();       roof.name       = "roof";       B.add(roof);

    if (!round) {
        for (let f = 0; f < floors; f++) {
            const L = makeLevel({ w, d, h: floorH });
            L.position.y = f * floorH;
            levels.add(L);
            addWindowsRect(L, { w, d, h: floorH, y: floorH * 0.55 });
            if (f === 0 && door) {
                const Dr = makeDoor(14, 20, 2);
                Dr.position.set(0, 10, d / 2 + 1.1); Dr.rotation.y = Math.PI;
                L.add(Dr);
            }
            if (f === 1 && balcony) {
                const Bc = makeBalcony(Math.min(36, w - 12), 10, 6);
                Bc.position.set(0, floorH + 2, d / 2 + 5.6); L.add(Bc);
            }
        }
        const topY = floors * floorH;
        let roofMesh;
        if (roofType === "gable") roofMesh = makeGableRoof(w - 2, d - 2, 2, roofColor);
        else if (roofType === "flat") roofMesh = makeFlatRoof(w - 6, d - 6, 2.2, buildingPalette.roofDark);
        else roofMesh = makeHipRoof(w - 2, d - 2, 2, roofColor);
        roofMesh.position.y = topY + 1.4;
        roof.add(roofMesh);
        if (sign) {
            const s = makeSign(24, 6);
            s.position.set(-w / 2 - 2, floorH * 0.9, 0);
            s.rotation.y = Math.PI / 2;
            details.add(s);
        }
    } else {
        const radius = Math.max(w, d) * 0.45;
        for (let f = 0; f < floors; f++) {
            const drum = cylinder(radius * (1 - f * 0.05), floorH, M.plaster, 32);
            drum.position.y = floorH / 2 + f * floorH;
            levels.add(drum);
            for (let i = 0; i < 8; i++) {
                const a = (i / 8) * Math.PI * 2;
                const col = box(2.2, floorH, 2.2, M.trim);
                col.position.set(Math.cos(a) * radius * 0.98, floorH / 2 + f * floorH, Math.sin(a) * radius * 0.98);
                levels.add(col);
            }
            for (let i = 0; i < 6; i++) {
                const ang = (i / 6) * Math.PI * 2;
                const W = makeWindow(10, 9, 1.2);
                W.position.set(Math.cos(ang) * radius * 0.98, floorH * 0.55 + f * floorH, Math.sin(ang) * radius * 0.98);
                W.lookAt(0, W.position.y, 0);
                levels.add(W);
            }
        }
        const topY = floors * floorH;
        const cap = cone ? makeConeRoof(radius * 0.95, roofColor) : makeDomeRoof(radius * 0.95, roofColor);
        cap.position.y = topY + 2; roof.add(cap);
    }

    B.position.set(...position);
    B.rotation.y = rotationY;
    B.traverse((n) => {
        if (n.isMesh) {
            n.castShadow = true;
            n.receiveShadow = true;
        }
    });
    return B;
}

function addWindowsRect(grp, { w, d, h, y = 10, inset = 1.6, gap = 12, size = [10, 8] }) {
    const [ww, hh] = size;
    const countX = Math.floor((w - 16) / gap);
    for (let i = 0; i < countX; i++) {
        const x = -w / 2 + 8 + i * gap;
        const W1 = makeWindow(ww, hh, inset); W1.position.set(x, y,  d / 2 + 0.6); W1.rotation.y = Math.PI;   grp.add(W1);
        const W2 = makeWindow(ww, hh, inset); W2.position.set(x, y, -d / 2 - 0.6);                               grp.add(W2);
    }
    const countZ = Math.floor((d - 16) / gap);
    for (let i = 0; i < countZ; i++) {
        const z = -d / 2 + 8 + i * gap;
        const W1 = makeWindow(ww, hh, inset); W1.position.set( w / 2 + 0.6, y, z); W1.rotation.y = -Math.PI/2;  grp.add(W1);
        const W2 = makeWindow(ww, hh, inset); W2.position.set(-w / 2 - 0.6, y, z); W2.rotation.y =  Math.PI/2;  grp.add(W2);
    }
}

```

```src/game/objects/placements/konohaTown.js
import * as THREE from 'three';
import { parseGridLabel, posForCell } from '../utils/gridLabel.js';

export function placeKonohaTown(scene, objectGrid, settings) {
    const town = new THREE.Group(); town.name = "KonohaTown"; scene.add(town);
    const buildingPalette = {
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

    const M = {
        plaster: new THREE.MeshStandardMaterial({ color: buildingPalette.plaster, roughness:.95 }),
        trim:    new THREE.MeshStandardMaterial({ color: buildingPalette.trim,    roughness:.95 }),
        skirt:   new THREE.MeshStandardMaterial({ color: buildingPalette.skirt,   roughness:.95 }),
        wood:    new THREE.MeshStandardMaterial({ color: buildingPalette.wood,    roughness:.9 }),
        frame:   new THREE.MeshStandardMaterial({ color: buildingPalette.frame,   roughness:.9 }),
        glass:   new THREE.MeshStandardMaterial({ color: buildingPalette.glass,   roughness:.2, metalness:.1, emissive:0x111318}),
        roof: (c) => new THREE.MeshStandardMaterial({
            color: c, roughness:.9, metalness:.02,
            polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1
        })
    };

    // Helper functions
    function box(w, h, d, mat) {
        const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
        m.castShadow = m.receiveShadow = true;
        return m;
    }
    function cylinder(r, h, mat, radial = 32) {
        const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, radial), mat);
        m.castShadow = m.receiveShadow = true;
        return m;
    }
    function cone(r, h, mat, radial = 32) {
        const m = new THREE.Mesh(new THREE.ConeGeometry(r, h, radial), mat);
        m.castShadow = m.receiveShadow = true;
        return m;
    }
    function seamLines(mesh, color = 0x20242a, alpha = 0.28) {
        const g = new THREE.EdgesGeometry(mesh.geometry, 25);
        const m = new THREE.LineBasicMaterial({ color, transparent: true, opacity: alpha });
        const lines = new THREE.LineSegments(g, m);
        lines.position.copy(mesh.position);
        lines.rotation.copy(mesh.rotation);
        mesh.add(lines);
        return lines;
    }
    function makeWindow(w = 12, h = 10, depth = 1.2) {
        const g = new THREE.Group();
        const frame = box(w, h, depth, M.frame); frame.position.y = h / 2; g.add(frame);
        const glass = box(w - 2, h - 2, depth - 0.6, M.glass); glass.position.y = h / 2; glass.position.z = 0.3; g.add(glass);
        return g;
    }
    function makeDoor(w = 12, h = 18, depth = 1.6) {
        const g = new THREE.Group();
        const frame = box(w, h, depth, M.frame); frame.position.y = h / 2; g.add(frame);
        const panel = box(w - 2, h - 2, depth - 0.6, M.wood); panel.position.y = h / 2; panel.position.z = 0.4; g.add(panel);
        return g;
    }
    function makeBalcony(w = 30, d = 10, h = 3) {
        const g = new THREE.Group();
        const floor = box(w, 2, d, M.wood); floor.position.y = 1; g.add(floor);
        const rail = new THREE.Mesh(new THREE.BoxGeometry(w, h, 1.2), M.frame);
        rail.position.set(0, h / 2 + 2, d / 2 - 0.6); rail.castShadow = true; g.add(rail);
        const count = Math.floor((w - 4) / 3);
        for (let i = 0; i < count; i++) {
            const x = -w / 2 + 2 + i * 3;
            const pk = box(0.6, h - 0.8, 1.0, M.frame);
            pk.position.set(x, h / 2 + 2, d / 2 - 0.6); g.add(pk);
        }
        return g;
    }
    function makeSign(w = 22, h = 6) {
        const g = new THREE.Group();
        const slab = box(w, 2, h, M.wood); slab.position.set(0, 1, 0); g.add(slab);
        const plate = box(w - 2, 1.2, h - 1.6, M.frame); plate.position.set(0, 1.2, 0.1); g.add(plate);
        return g;
    }

    // Build buildings
    const buildings = new THREE.Group(); town.add(buildings);

    // Red buildings
    buildings.add(new THREE.Group({
        name: 'RedBuildings',
        children: [
            makeBuilding({
                w: 60,
                d: 40,
                floors: 2,
                roofType: 'gable',
                roofColor: buildingPalette.roofRed,
                balcony: true,
                sign: true,
                position: [-220, 0, -40],
                rotationY: Math.PI * 0.02
            }),
            makeBuilding({
                w: 58,
                d: 40,
                floors: 2,
                roofType: 'gable',
                roofColor: buildingPalette.roofRed,
                balcony: true,
                position: [60, 0, -40],
                rotationY: -0.06
            }),
            makeBuilding({
                w: 64,
                d: 44,
                floors: 2,
                roofType: 'gable',
                roofColor: buildingPalette.roofRed,
                position: [10, 0, 64]
            }),
            makeBuilding({
                w: 60,
                d: 44,
                floors: 2,
                roofType: 'gable',
                roofColor: buildingPalette.roofRed,
                sign: true,
                position: [-150, 0, 160]
            }),
            makeBuilding({
                w: 50,
                d: 36,
                floors: 2,
                roofType: 'gable',
                roofColor: buildingPalette.roofRed,
                position: [90, 0, 160]
            }),
        ]
    }));

    // Blue buildings
    buildings.add(new THREE.Group({
        name: 'BlueBuildings',
        children: [
            makeBuilding({
                w: 46,
                d: 34,
                floors: 2,
                roofType: 'gable',
                roofColor: buildingPalette.roofBlue,
                sign: true,
                position: [-150, 0, -30]
            }),
            makeBuilding({
                w: 70,
                d: 44,
                floors: 2,
                roofType: 'gable',
                roofColor: buildingPalette.roofBlue,
                position: [-220, 0, 60]
            }),
            makeBuilding({
                w: 70,
                d: 70,
                floors: 2,
                round: true,
                roofColor: buildingPalette.roofBlue,
                position: [-140, 0, 60]
            }),
            makeBuilding({
                w: 62,
                d: 40,
                floors: 2,
                roofType: 'gable',
                roofColor: buildingPalette.roofBlue,
                balcony: true,
                position: [-150, 0, 160]
            }),
            makeBuilding({
                w: 50,
                d: 36,
                floors: 2,
                roofType: 'gable',
                roofColor: buildingPalette.roofBlue,
                position: [90, 0, 160]
            }),
        ]
    }));

    // Yellow buildings
    buildings.add(new THREE.Group({
        name: 'YellowBuildings',
        children: [
            makeBuilding({
                w: 46,
                d: 34,
                floors: 2,
                roofType: 'hip',
                roofColor: buildingPalette.roofYellow,
                sign: true,
                position: [-150, 0, -30]
            }),
            makeBuilding({
                w: 70,
                d: 44,
                floors: 2,
                roofType: 'hip',
                roofColor: buildingPalette.roofYellow,
                position: [-220, 0, 60]
            }),
            makeBuilding({
                w: 70,
                d: 70,
                floors: 2,
                round: true,
                roofColor: buildingPalette.roofYellow,
                position: [-140, 0, 60]
            }),
            makeBuilding({
                w: 62,
                d: 40,
                floors: 2,
                roofType: 'gable',
                roofColor: buildingPalette.roofYellow,
                balcony: true,
                position: [-150, 0, 160]
            }),
            makeBuilding({
                w: 50,
                d: 36,
                floors: 2,
                roofType: 'gable',
                roofColor: buildingPalette.roofYellow,
                position: [90, 0, 160]
            }),
        ]
    }));

    // Green buildings
    buildings.add(new THREE.Group({
        name: 'GreenBuildings',
        children: [
            makeBuilding({
                w: 60,
                d: 40,
                floors: 2,
                roofType: 'hip',
                roofColor: buildingPalette.roofGreen,
                balcony: true,
                sign: true,
                position: [-220, 0, -40],
                rotationY: Math.PI * 0.02
            }),
            makeBuilding({
                w: 58,
                d: 40,
                floors: 2,
                roofType: 'hip',
                roofColor: buildingPalette.roofGreen,
                balcony: true,
                position: [60, 0, -40],
                rotationY: -0.06
            }),
            makeBuilding({
                w: 64,
                d: 44,
                floors: 2,
                roofType: 'hip',
                roofColor: buildingPalette.roofGreen,
                position: [10, 0, 64]
            }),
            makeBuilding({
                w: 60,
                d: 44,
                floors: 2,
                roofType: 'hip',
                roofColor: buildingPalette.roofGreen,
                sign: true,
                position: [-150, 0, 160]
            }),
            makeBuilding({
                w: 50,
                d: 36,
                floors: 2,
                roofType: 'hip',
                roofColor: buildingPalette.roofGreen,
                position: [90, 0, 160]
            }),
        ]
    }));

    // Dark buildings
    buildings.add(new THREE.Group({
        name: 'DarkBuildings',
        children: [
            makeBuilding({
                w: 52,
                d: 38,
                floors: 2,
                roofType: 'flat',
                roofColor: buildingPalette.roofDark,
                position: [-90, 0, -36]
            }),
        ]
    }));

    return town;
}

// Complex building factory
function makeBuilding(opts) {
    const {
        name = "bldg",
        w = 60, d = 40, floors = 2, floorH = 24,
        roofType = "hip", roofColor = buildingPalette.roofBlue,
        balcony = false, sign = false, door = true,
        round = false, cone = false,
        position = [0, 0, 0], rotationY = 0
    } = opts;

    const B = new THREE.Group(); B.name = name;
    const foundation = new THREE.Group(); foundation.name = "foundation"; B.add(foundation);
    const levels = new THREE.Group();     levels.name     = "levels";     B.add(levels);
    const details = new THREE.Group();    details.name    = "details";    B.add(details);
    const roof = new THREE.Group();       roof.name       = "roof";       B.add(roof);

    if (!round) {
        for (let f = 0; f < floors; f++) {
            const L = makeLevel({ w, d, h: floorH });
            L.position.y = f * floorH;
            levels.add(L);
            addWindowsRect(L, { w, d, h: floorH, y: floorH * 0.55 });
            if (f === 0 && door) {
                const Dr = makeDoor(14, 20, 2);
                Dr.position.set(0, 10, d / 2 + 1.1); Dr.rotation.y = Math.PI;
                L.add(Dr);
            }
            if (f === 1 && balcony) {
                const Bc = makeBalcony(Math.min(36, w - 12), 10, 6);
                Bc.position.set(0, floorH + 2, d / 2 + 5.6); L.add(Bc);
            }
        }
        const topY = floors * floorH;
        let roofMesh;
        if (roofType === "gable") roofMesh = makeGableRoof(w - 2, d - 2, 2, roofColor);
        else if (roofType === "flat") roofMesh = makeFlatRoof(w - 6, d - 6, 2.2, buildingPalette.roofDark);
        else roofMesh = makeHipRoof(w - 2, d - 2, 2, roofColor);
        roofMesh.position.y = topY + 1.4;
        roof.add(roofMesh);
        if (sign) {
            const s = makeSign(24, 6);
            s.position.set(-w / 2 - 2, floorH * 0.9, 0);
            s.rotation.y = Math.PI / 2;
            details.add(s);
        }
    } else {
        const radius = Math.max(w, d) * 0.45;
        for (let f = 0; f < floors; f++) {
            const drum = cylinder(radius * (1 - f * 0.05), floorH, M.plaster, 32);
            drum.position.y = floorH / 2 + f * floorH;
            levels.add(drum);
            for (let i = 0; i < 8; i++) {
                const ang = (i / 8) * Math.PI * 2;
                const col = box(2.2, floorH, 2.2, M.trim);
                col.position.set(Math.cos(ang) * radius * 0.98, floorH / 2 + f * floorH, Math.sin(ang) * radius * 0.98);
                levels.add(col);
            }
            for (let i = 0; i < 6; i++) {
                const ang = (i / 6) * Math.PI * 2;
                const W = makeWindow(10, 9, 1.2);
                W.position.set(Math.cos(ang) * radius * 0.98, floorH * 0.55 + f * floorH, Math.sin(ang) * radius * 0.98);
                W.lookAt(0, W.position.y, 0);
                levels.add(W);
            }
        }
        const topY = floors * floorH;
        const cap = cone ? makeConeRoof(radius * 0.95, roofColor) : makeDomeRoof(radius * 0.95, roofColor);
        cap.position.y = topY + 2; roof.add(cap);
    }

    B.position.set(...position);
    B.rotation.y = rotationY;
    B.traverse((n) => {
        if (n.isMesh) {
            n.castShadow = true;
            n.receiveShadow = true;
        }
    });
    return B;
}

function addWindowsRect(grp, { w, d, h, y = 10, inset = 1.6, gap = 12, size = [10, 8] }) {
    const [ww, hh] = size;
    const countX = Math.floor((w - 16) / gap);
    for (let i = 0; i < countX; i++) {
        const x = -w / 2 + 8 + i * gap;
        const W1 = makeWindow(ww, hh, inset); W1.position.set(x, y,  d / 2 + 0.6); W1.rotation.y = Math.PI;   grp.add(W1);
        const W2 = makeWindow(ww, hh, inset); W2.position.set(x, y, -d / 2 - 0.6);                               grp.add(W2);
    }
    const countZ = Math.floor((d - 16) / gap);
    for (let i = 0; i < countZ; i++) {
        const z = -d / 2 + 8 + i * gap;
        const W1 = makeWindow(ww, hh, inset); W1.position.set( w / 2 + 0.6, y, z); W1.rotation.y = -Math.PI/2;  grp.add(W1);
        const W2 = makeWindow(ww, hh, inset); W2.position.set(-w / 2 - 0.6, y, z); W2.rotation.y =  Math.PI/2;  grp.add(W2);
    }
}
```

```src/game/objects/updateObjects.js
import * as THREE from 'three';
import { updatePlayer } from '../player/index.js';
import { updatePlayerMovement, resolveCollisions } from '../player/movement/index.js';
import { placeKonohaGates } from './placements/konohaGates.js';
import { placeIchiraku } from './placements/ichiraku.js';
import { placeHokagePalace } from './placements/hokagePalace.js';
import { placeHokageMonument } from './placements/hokageMonument.js';
import { placeKonohaTown } from './placements/konohaTown.js';

export function updateObjects(scene, currentObjects, settings) {
  // Remove previously added objects
  currentObjects.forEach(obj => scene.remove(obj));

  const renderObjects = [];
  const worldSize = 3000;
  const objectGrid = new ObjectGrid(worldSize, 200);

  // Central wall with a removed section on the north side between KX491 and KD491
  const { group: wall, colliders } = createCentralWallWithGate({
    scene,
    worldSize,
    radius: 960,
    height: 30,
    segments: 160,
    colliderSpacing: 18,
    colliderRadius: 12,
    color: 0xffffff,
    thickness: 5,
    gateFromLabel: 'KX491',
    gateToLabel: 'KD491',
    removeExactlyBetween: true
  });
  renderObjects.push(wall);
  colliders.forEach(c => objectGrid.add(c));

  // Buildings
  const palace = placeHokagePalace(scene, objectGrid, worldSize, settings);
  if (palace) renderObjects.push(palace);

  const monument = placeHokageMonument(scene, objectGrid, worldSize, settings);
  if (monument) renderObjects.push(monument);

  const ichiraku = placeIchiraku(scene, objectGrid, worldSize, settings);
  if (ichiraku) renderObjects.push(ichiraku);

  const konohaTown = placeKonohaTown(scene, objectGrid, settings);
  if (konohaTown) renderObjects.push(konohaTown);

  const konohaGates = placeKonohaGates(scene, objectGrid, worldSize, settings);
  if (konohaGates) renderObjects.push(konohaGates);

  // Update player position based on movement
  const player = scene.find("player");
  if (player) {
    const playerPosition = new THREE.Vector3();
    playerPosition.copy(player.position);
    playerPosition.y = 0;
    const playerVelocity = new THREE.Vector3();
    playerVelocity.copy(player.userData.velocity);
    playerVelocity.y = 0;
    const delta = 0.05;
    playerPosition.x += playerVelocity.x * delta;
    playerPosition.z += playerVelocity.z * delta;
    const collision = resolveCollisions(playerPosition, playerRadius, objectGrid);
    if (collision) {
      playerPosition.copy(collision);
    }
    player.position.copy(playerPosition);
    const oldPosition = playerPosition.clone();
    oldPosition.y = player.position.y;
    player.userData.velocity = new THREE.Vector3();
    player.userData.velocity.copy(playerVelocity);
    player.userData.velocity.y = 0;
    updatePlayerMovement(player, {}, {}, delta, objectGrid, playerPosition.x, playerPosition.z, 0);
  }

  return { objects: renderObjects, grid: objectGrid };
}
```

```src/hooks/useMinimap.js
import { useState, useEffect, useRef } from "react";
import { useThreeScene } from "./hooks/useThreeScene.js";

export const useMinimap = ({ playerRef, worldObjects, zoomRef }) => {
  const minimapState = useState({
    left: window.innerWidth - 16 - 128,
    top: 16,
    width: 128,
    height: 128
  });
  const posXRef = useRef(null);
  const posZRef = useRef(null);
  const zoomLevelRef = useRef(null);
  const biomeRef = useRef(null);

  const handleInteractionStart = (e, type) => {
    e.preventDefault();
    if (type === "move") {
      // Update minimap position on click
      const rect = e.currentTarget.getBoundingClientRect();
      const minimapLeft = rect.left;
      const minimapTop = rect.top;
      const minimapWidth = rect.width;
      const minimapHeight = rect.height;
      minimapState.left = window.innerWidth - minimapLeft - minimapWidth;
      minimapState.top = minimapTop;
      minimapState.width = minimapWidth;
      minimapState.height = minimapHeight;
    }
  };

  useEffect(() => {
    const updateHudElements = () => {
      if (playerRef.current) {
        const { x, z } = playerRef.current.position;
        posXRef.current.textContent = `X: ${Math.round(x)}`;
        posZRef.current.textContent = `Z: ${Math.round(z)}`;
        zoomLevelRef.current.textContent = `Zoom Level: ${zoomRef.current}`;
        biomeRef.current.textContent = `Biome: Unknown`;
      }
    };

    useEffect(() => {
      if (playerRef.current) {
        updateHudElements();
      }
    }, [playerRef.current]);

    return { minimapState, minimapCanvasRef: useRef(null), posXRef, posZRef, zoomLevelRef, biomeRef, handleInteractionStart };
  };
}
```

```src/hooks/useJoystick.js
import { useState, useEffect, useRef } from "react";
import nipplejs from "nipplejs";

export const useJoystick = (joystickRef, visible) => {
  const zoneRef = useRef(null);
  const joystick = useRef(null);
  const smoothedRef = useRef({ force: 0, angle: { radian: 0 } });
  const targetRef = useRef({ force: 0, angle: { radian: 0 } });
  const rafRef = useRef(null);

  useEffect(() => {
    if (!zoneRef.current) return;
    const preventDefault = (e) => {
      if (e.cancelable) e.preventDefault();
    };
    const handleMouseMove = (e) => {
      if (e.target && e.target.tagName === 'canvas') {
        preventDefault(e);
        const rect = zoneRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const scale = 0.008;
        smoothedRef.current.force += scale * (x + y);
        smoothedRef.current.angle.radian += scale * (x - y);
      }
    };
    const handleMouseUp = () => {
      targetRef.current = smoothedRef.current;
    };
    zoneRef.current.addEventListener('mousemove', handleMouseMove);
    zoneRef.current.addEventListener('mouseup', handleMouseUp);
    const joystick = new nipplejs("canvas");
    joystickRef.current = joystick;
  }, [zoneRef, joystickRef, visible]);

  useEffect(() => {
    const tick = () => {
      const s = smoothedRef.current;
      const t = targetRef.current;
      smoothedRef.current = {
        force: s.force + (t.force - s.force) * 0.5,
        angle: { radian: s.angle.radian + (t.angle.radian - s.angle.radian) * 0.5 }
      };
      joystickRef.current.set(s.smoothedForce, s.smoothedAngle);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [smoothedRef, targetRef, joystickRef]);

  useEffect(() => {
    if (!joystickRef.current) return;
    joystickRef.current.destroy();
    zoneRef.current.removeEventListener('mousemove', handleMouseMove);
    zoneRef.current.removeEventListener('mouseup', handleMouseUp);
  }, [zoneRef]);

  return zoneRef;
};
```

```src/scene/initScene.js
import * as THREE from 'three';
import { createPlayer } from '../game/player/index.js';
import { setupGridLabels } from './gridLabels.js';
import { setupObjectTooltips } from './objectTooltips.js';

export const initScene = ({
    mountEl, 
    settings, 
    createPlayer, 
    onReady 
}) => {
    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);

    // Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth/innerHeight, 0.1, 2000);
    camera.position.set(520, 300, 520);
    const controls = new THREE.OrbitControls(camera, document.getElementById('root'));
    controls.target.set(520, 100, 520);
    controls.enableDamping = true;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: settings.antialiasing });
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, settings.maxPixelRatio));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = settings.shadows;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040,0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff,1.0);
    directionalLight.position.set(30, 80, 40);
    directionalLight.castShadow = settings.shadows;

    const shadowMapSize = { low: 512, medium: 1024, high: 2048 }[settings.shadowQuality] || 1024;
    directionalLight.shadow.mapSize.width = shadowMapSize;
    directionalLight.shadow.mapSize.height = shadowMapSize;
    scene.add(directionalLight);
    directionalLight.target.position.set(0, 0, 0);

    // Ground labels (virtualized)
    const gridLabelsGroupRef = useRef(null);
    const gridLabelsArrayRef = useRef(null); // kept for backward compatibility; unused with virtualization
    const visibleLabelsRef = useRef(new Set()); // kept for backward compatibility; unused with virtualization
    const gridLabelsUpdateRef = useRef(null); // new: function ref to call per-frame
    const gridLabelsGroup = new THREE.Group();
    gridLabelsGroup.visible = settings.grid;
    scene.add(gridLabelsGroup);
    const gridLabelsUpdate = setupGridLabels(scene, worldSize, settings, groundContainerRef);
    gridLabelsUpdateRef.current = gridLabelsUpdate;
    gridLabelsGroupRef.current = gridLabelsGroup;

    // Object tooltips
    const objectTooltipsGroupRef = useRef(null);
    const updateObjectTooltips = setupObjectTooltips(scene, { maxVisible: 20, distance: 45 });
    objectTooltipsUpdateRef.current = updateObjectTooltips;
    objectTooltipsGroupRef.current = objectTooltipsGroupRef.current;

    return {
        scene, 
        renderer, 
        camera, 
        light: directionalLight, 
        gridLabelsGroupRef, 
        gridLabelsUpdateRef, 
        objectTooltipsGroupRef, 
        objectTooltipsUpdateRef, 
        playerRef: createPlayer(scene, settings, onReady)
    };
};
```

``` src/hooks/useThreeScene.js
import React, { useState, useCallback } from 'react';
import * as THREE from 'three';
import { resetPlayerState } from '../game/player/index.js';
import { updateObjects } from '../game/objects.js';
import { usePlayerControls } from './usePlayerControls.js';
import { startAnimationLoop } from '../scene/animationLoop.js';

export const initThreeScene = ({
    mountRef,
    settings,
    onReadyRef,
    sceneRef,
    rendererRef,
    cameraRef,
    lightRef,
    groundContainerRef,
    gridHelperRef,
    gridLabelsGroupRef,
    gridLabelsUpdateRef,
    playerRef,
    objectTooltipsGroupRef,
    objectTooltipsUpdateRef,
    interactPromptRef
}) => {
  if (!mountRef.current) return;
  const initialize = useCallback(() => {
    initThreeScene({
      mountEl: mountRef.current,
      settings: {
        antialiasing: settings.antialiasing,
        shadows: settings.shadows,
        grid: settings.grid
      },
      createPlayer,
      onReady: () => {
        try { onReadyRef.current && onReadyRef.current(); } catch (_) {}
      }
    });

    const throttledSetPlayerPosition = useCallback(() => {
      // Use throttled function to update React state, reducing re-renders
      const setPosition = (pos) => {
        if (playerRef.current) {
          playerRef.current.position.set(pos.x, 0, pos.z);
        }
      };
      return setPosition;
    };

    useEffect(() => {
      initialize();

      // Start main loop
      const animationStopRef = useRef(null);
      animationStopRef.current = startAnimationLoop({
        sceneRef,
        cameraRef,
        rendererRef,
        lightRef,
        playerRef,
        objectGridRef: updateObjects(sceneRef.current, [], settings),
        randomObjectsRef: [],
        keysRef: usePlayerControls({ uiState: { setShowCharacter, setShowInventory, setShowWorldMap, setShowSettings, setShowAnimations, gameState, setSettings }),
        throttledSetPlayerPosition,
        joystickRef: useJoystick({ joystickRef, keysRef, zoomRef }),
        cameraOrbitRef: useRef(0),
        cameraPitchRef: useRef(0),
        firstPersonRef: useRef(false),
        fpsLimit: settings.fpsLimit,
        gridLabelsGroupRef,
        gridLabelsArrayRef,
        visibleLabelsRef,
        gridLabelsUpdateRef,
        objectTooltipsUpdateRef,
        interactPromptRef
      });

      // Object density updates (per settings)
      useEffect(() => {
        const { objects, grid } = updateObjects(sceneRef.current, [], settings);
        playerRef.current.userData.model.scale.setScalar(settings.objectDensity);
        objectGridRef.current = grid;
      }, [settings.objectDensity]);

      // Resize
      const handleResize = () => {
        const { w, h } = document.getElementById('root').getBoundingClientRect();
        rendererRef.current.setSize(w, h);
        cameraRef.current.aspect = w / h;
        cameraRef.current.updateProjectionMatrix();
      };
      window.addEventListener('resize', handleResize);

      // Mobile: Pinch-to-zoom
      useEffect(() => {
        if (!document.getElementById('root')) return;
        const handlePinch = (e) => {
          if (e.touches.length === 2) {
            const { width, height } = document.getElementById('root').getBoundingClientRect();
            const scale = Math.min(1, 1 + (e.scale * 0.05));
            zoomRef.current = Math.max(0.2, Math.min(2.5, zoomRef.current * scale));
          }
        };
        document.getElementById('root').addEventListener('touchstart', handlePinch, { passive: false });
        document.getElementById('root').addEventListener('touchmove', handlePinch, { passive: false });
        document.getElementById('root').addEventListener('touchend', () => {
          handlePinch({ scale: 1 });
        });
      }, [zoomRef]);

      // Cleanup
      return () => {
        animationStopRef.current && animationStopRef.current();
        controls.dispose();
        rendererRef.current.dispose();
        sceneRef.current.traverse(obj => {
          if (obj.isMesh) {
            obj.geometry?.dispose?.();
            if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose?.());
            else obj.material?.dispose?.();
          }
        });
        objectGridRef.current.clear();
      };
    }, [initialize, animationStopRef, zoomRef, playerRef]);

    // Cleanup scene when unmounting
    useEffect(() => {
      return () => {
        cleanupScene({
          mountRef,
          rendererRef,
          sceneRef,
          animationStopRef,
          interactPromptRef,
          groundContainerRef,
          gridLabelsGroupRef,
          gridLabelsArrayRef,
          visibleLabelsRef,
          randomObjectsRef,
          objectGridRef
        });
      };
    }, [mountRef]);

    return {
      sceneRef,
      cameraRef,
      playerRef,
      zoomRef,
      cameraOrbitRef,
      cameraPitchRef,
      firstPersonRef
    };
  };
}
```

```src/hooks/sceneLifecycle.js
import { useState, useEffect, useCallback } from 'react';
import { initThreeScene, cleanupThreeScene } from './sceneLifecycle.js';

export const initThreeScene = (props) => {
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const groundContainerRef = useRef(null);
  const gridHelperRef = useRef(null);
  const gridLabelsGroupRef = useRef(null);
  const gridLabelsUpdateRef = useRef(null);
  const playerRef = useRef(null);
  const objectTooltipsGroupRef = useRef(null);
  const objectTooltipsUpdateRef = useRef(null);
  const interactPromptRef = useRef(null);
  const animationStopRef = useRef(null);

  useEffect(() => {
    initThreeScene(props);
  }, [props]);

  const cleanupScene = useCallback(() => {
    cleanupThreeScene({
      mountRef: props.mountRef,
      rendererRef,
      sceneRef,
      animationStopRef,
      interactPromptRef,
      groundContainerRef,
      gridLabelsGroupRef,
      gridLabelsArrayRef,
      visibleLabelsRef,
      randomObjectsRef,
      objectGridRef
    });
  }, [props.mountRef]);

  return {
    initThreeScene,
    cleanupScene,
    sceneRef,
    cameraRef,
    rendererRef,
    groundContainerRef,
    gridHelperRef,
    gridLabelsGroupRef,
    gridLabelsUpdateRef,
    playerRef,
    objectTooltipsGroupRef,
    objectTooltipsUpdateRef,
    interactPromptRef,
    animationStopRef
  };
};
```

```src/components/UI/LoadingScreen.jsx
import React from 'react';
import { useEffect, useState } from 'react';

const LoadingScreen = ({ progress }) => {
  useEffect(() => {
    if (progress === 100) {
      // Hide loading screen after 1 second when progress reaches 100%
      setTimeout(() => {
        const loadingScreen = document.getElementById('loading');
        if (loadingScreen) {
          loadingScreen.style.display = 'none';
        }
      }, 1000);
    }
  }, [progress]);

  return (
    <div className="w-full h-full relative">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <h2 className="text-4xl font-bold text-yellow-400 mb-4">Loading Game Assets...</h2>
        <div className="text-sm text-gray-400">Please wait, this may take a moment.</div>
        <div className="w-1/2 max-w-2xl bg-gray-700 border-2 border-gray-600 rounded-lg p-3">
          <div className="bg-yellow-500 h-2 rounded-full transition-all duration-500 ease-out">
            <div className="h-full w-full bg-gray-700 border-2 border-gray-600 rounded-lg">
              <div className="h-full w-full bg-gray-700 rounded-full border-2 border-gray-600"></div>
            </div>
          </div>
          <div className="text-sm text-white text-center">{progress}%</div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
```

```src/components/UI/SettingsPanel.jsx
import { useState, useEffect } from 'react';
import React from 'react/jsx-dev-runtime.js';

export const SettingsPanel = ({ settings, setSettings, onClose }) => {
  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({ ...prev, [setting]: value });
  };

  const [showControl, setShowControl] = useState(true);
  const handleToggle = (setting) => {
    setShowControl(prev => !prev);
  };

  useEffect(() => {
    // Hide the panel when settings change
    if (settings) {
      setShowControl(false);
    }
  }, [settings]);

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 text-white border-2 border-yellow-600 rounded-lg shadow-2xl z-50 w-96 text-sm">
      {/* Header */}
      <div className="bg-gray-700 px-4 py-2 rounded-t-lg border-b-1 border-gray-600 flex justify-between items-center">
        <h4 className="text-yellow-400 font-bold text-md">Settings</h4>
        <button 
          onClick={onClose}
          className="text-red-400 hover:text-red-300 text-xxl font-bold w-12 h-8 bg-gray-700 border-2 border-gray-600 rounded-lg text-sm shadow-lg active:scale-95 transition-all duration-200"
        >
          Close
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <label htmlFor="shadows-toggle">Enable Shadows</label>
          <input
            type="checkbox"
            id="shadows-toggle"
            checked={settings.shadows}
            onChange={(e) => handleSettingChange('shadows', e.target.checked)}
            className="form-checkbox h-5 w-5 text-yellow-500 bg-gray-700 border-gray-500 rounded-full shadow-lg"
          />
        </div>
        <div className="flex justify-between items-center">
          <label>Object Density</label>
          <div className="text-sm text-gray-400">Choose the density of objects in the game world.</div>
          <div className="flex space-x-2">
            <button
              onClick={() => handleSettingChange('objectDensity', 'low')}
              className="bg-gray-700 text-sm text-yellow-500 border-2 border-gray-600 rounded-lg w-24 h-8 shadow-lg"
            > Low</button>
            <button
              onClick={() => handleSettingChange('objectDensity', 'medium')}
              className="bg-gray-700 text-sm text-yellow-500 border-2 border-gray-600 rounded-lg w-24 h-8 shadow-lg"
            > Medium</button>
            <button
              onClick={() => handleSettingChange('objectDensity', 'high')}
              className="bg-gray-700 text-sm text-yellow-500 border-2 border-gray-600 rounded-lg w-24 h-8 shadow-lg"
            > High</button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <label>Render Scale</label>
          <div className="text-sm text-gray-400">Limit rendering to improve FPS; adjustable in Settings.</div>
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => handleSettingChange('maxPixelRatio', 0.75)}
              className="px-2 py-1 bg-yellow-500 text-sm text-black border-2 border-yellow-300 rounded-full shadow-lg"
              title="Limit rendering to 0.75x device pixel ratio"
            > 0.75x</button>
            <button
              onClick={() => handleSettingChange('maxPixelRatio', 1.0)}
              className="px-2 py-1 bg-yellow-500 text-sm text-black border-2 border-yellow-300 rounded-full shadow-lg"
              title="Limit rendering to 1.0x device pixel ratio"
            > 1.0x</button>
            <button
              onClick={() => handleSettingChange('maxPixelRatio', 1.25)}
              className="px-2 py-1 bg-yellow-500 text-sm text-black border-2 border-yellow-300 rounded-full shadow-lg"
              title="Limit rendering to 1.25x device pixel ratio"
            > 1.25x</button>
            <button
              onClick={() => handleSettingChange('maxPixelRatio', 1.5)}
              className="px-2 py-1 bg-yellow-500 text-sm text-black border-2 border-yellow-300 rounded-full shadow-lg"
              title="Limit rendering to 1.5x device pixel ratio"
            > 1.5x</button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <label>Object Density</label>
          <div className="text-sm text-gray-400">Choose the density of objects in the game world.</div>
          <div className="flex space-x-2">
            <button
              onClick={() => handleSettingChange('objectDensity', 'low')}
              className="bg-gray-700 text-sm text-yellow-500 border-2 border-gray-600 rounded-lg w-24 h-8 shadow-lg"
            > Low</button>
            <button
              onClick={() => handleSettingChange('objectDensity', 'medium')}
              className="bg-gray-700 text-sm text-yellow-500 border-2 border-gray-600 rounded-lg w-24 h-8 shadow-lg"
            > Medium</button>
            <button
              onClick={() => handleSettingChange('objectDensity', 'high')}
              className="bg-gray-700 text-sm text-yellow-500 border-2 border-gray-600 rounded-lg w-24 h-8 shadow-lg"
            > High</button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <label>Chakra Natures</label>
          <div className="text-sm text-gray-400">Choose the ninjas' chakra nature.</div>
          <div className="flex space-x-2">
            <button
              onClick={() => handleSettingChange('chakraNature', 'fire')}
              className="bg-yellow-500 text-sm text-black border-2 border-yellow-300 rounded-lg w-24 h-8 shadow-lg"
            > Fire</button>
            <button
              onClick={() => handleSettingChange('chakraNature', 'water')}
              className="bg-blue-500 text-sm text-black border-2 border-blue-300 rounded-lg w-24 h-8 shadow-lg"
            > Water</button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <label>Framerate Limit</label>
          <div className="text-sm text-gray-400">Choose the frame rate limit.</div>
          <div className="flex space-x-2">
            <button
              onClick={() => handleSettingChange('fpsLimit', 'Unlimited')}
              className="px-2 py-1 bg-gray-700 text-sm text-black border-2 border-gray-600 rounded-full shadow-lg"
              title="Unlimited framerate"
            > Unlimited</button>
            <button
              onClick={() => handleSettingChange('fpsLimit', '60 FPS')}
              className="px-2 py-1 bg-gray-700 text-sm text-black border-2 border-gray-600 rounded-full shadow-lg"
              title="Limit to 60 FPS"
            > 60 FPS</button>
            <button
              onClick={() => handleSettingChange('fpsLimit', '30 FPS')}
              className="px-2 py-1 bg-gray-700 text-sm text-black border-2 border-gray-600 rounded-full shadow-lg"
              title="Limit to 30 FPS"
            > 30 FPS</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
```

``` src/components/UI/CharacterPanel.jsx
import { useState, useEffect } from 'react';

export const CharacterPanel = ({ playerStats, onClose }) => {
  // Merge provided stats with some defaults in case they are missing
  const defaultStats = {
    name: 'Adventurer',
    level: 1,
    health: 85,
    maxHealth: 100,
    chakra: 60,
    maxChakra: 80,
    experience: 0,
    maxExperience: 1000,
    gold: 150,

    // Core Stats
    strength: 10,
    dexterity: 10,
    vitality: 10,
    energy: 10,
    
    // Combat Stats
    stamina: 95,
    maxStamina: 110,
    
    // Attack Stats
    attackRating: 150,
    minDamage: 12,
    maxDamage: 18,
    
    // Defense Stats
    defense: 45,
    
    // Resistances
    fireResist: 5,
    coldResist: 10,
    lightResist: -5,
    poisonResist: 8,
    
    // Available Points
    statPoints: 3,
    skillPoints: 1
  };

  const stats = { ...defaultStats, ...playerStats };

  const StatRow = ({ label, value, maxValue = null, showPlus = false }) => (
    <div className="flex items-center space-y-1">
      <span className="text-gray-300">{label}</span>
      <div className="flex items-center">
        <span className="text-white font-mono text-sm">{maxValue ? `${value}/${maxValue}` : value}</span>
        {showPlus && stats.statPoints > 0 && maxValue && value < maxValue}
          ? <button className="w-4 h-4 bg-red-600 hover:bg-red-500 text-sm text-black border-2 border-gray-500 rounded-lg"
            onClick={() => handleSettingChange('statPoints', stats.statPoints - 1)}
            title={`Use 1 stat point to upgrade ${label}`}
          />
        </div>
    </div>
  );

  const StatBlock = ({ title, children }) => (
    <div className="mb-4">
      <h4 className="text-yellow-300 font-bold text-md border-b-1 border-gray-600 pb-1">
        {title}
      </h4>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({ ...prev, [setting]: value });
  };

  const handleStatPointUse = (statPoint) => {
    handleSettingChange('statPoints', stats.statPoints - 1);
    if (statPoint === 'health') {
      stats.health += 10;
    } else if (statPoint === 'strength') {
      stats.strength += 1;
    } else if (statPoint === 'dexterity') {
      stats.dexterity += 1;
    } else if (statPoint === 'vitality') {
      stats.vitality += 1;
    } else if (statPoint === 'energy') {
      stats.energy += 1;
    } else if (statPoint === 'attack') {
      stats.attackRating += 5;
    } else if (statPoint === 'defense') {
      stats.defense += 5;
    }
  };

  const onStatPointClick = (e) => {
    // Prevent right-click for context menu
    e.preventDefault();
    handleStatPointUse(e.target.dataset.statpoint);
  };

  useEffect(() => {
    if (!playerStats) return;
    if (playerStats.statPoints > 0) {
      const statPointButtons = document.querySelectorAll('.statpoint');
      statPointButtons.forEach(button => button.addEventListener('click', onStatPointClick));
    }
  }, [playerStats]);

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/70 text-white border-2 border-gray-600 rounded-lg shadow-2xl z-50 w-96 text-sm">
      {/* Header */}
      <div className="bg-gray-700 px-4 py-2 rounded-t-lg border-b-1 border-gray-600 flex justify-between items-center">
        <h4 className="text-yellow-400 font-bold text-md">Character</h4>
        <button 
          onClick={onClose}
          className="text-red-400 hover:text-red-300 text-xxl font-bold w-12 h-8 bg-gray-700 border-2 border-gray-600 rounded-lg shadow-lg active:scale-95 transition-all duration-200"
        >
          Close
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4">
        <StatBlock title="Attributes">
          <StatRow label="Strength" value={stats.strength} showPlus />
          <StatRow label="Dexterity" value={stats.dexterity} showPlus />
          <StatRow label="Vitality" value={stats.vitality} showPlus />
          <StatRow label="Energy" value={stats.energy} showPlus />
        </StatBlock>

        <StatBlock title="Combat">
          <StatRow label="Attack" value={stats.attackRating} showPlus />
          <StatRow label="Defense" value={stats.defense} showPlus />
        </StatBlock>

        <StatBlock title="Status">
          <StatRow label="Health" value={stats.health} maxValue={stats.maxHealth} showPlus />
          <StatRow label="Chakra" value={stats.chakra} maxValue={stats.maxChakra} showPlus />
          <StatRow label="Gold" value={stats.gold} />
        </StatBlock>

        <StatBlock title="Progression">
          <StatRow label="Experience" value={stats.experience} maxValue={stats.maxExperience} />
          <StatRow label="Level" value={stats.level} />
        </StatBlock>
      </div>

      {/* Stat Points */}
      <div className="flex justify-between items-center">
        <label>Stat Points</label>
        <div className="text-sm text-gray-400">Use stat points to upgrade attributes.</div>
        {stats.statPoints > 0 && (
          <button
            className="w-4 h-4 bg-red-600 hover:bg-red-500 text-sm text-black border-2 border-gray-500 rounded-lg
            onClick={() => handleStatPointUse('health')}
            title="Spend 1 point to increase health by 10"
          />
          || <button
            className="w-4 h-4 bg-red-600 hover:bg-red-500 text-sm text-black border-2 border-gray-500 rounded-lg
            onClick={() => handleStatPointUse('strength')}
            title="Spend 1 point to increase strength by 1"
          />
          || <button
            className="w-4 h-4 bg-red-600 hover:bg-red-500 text-sm text-black border-2 border-gray-500 rounded-lg
            onClick={() => handleStatPointUse('dexterity')}
            title="Spend 1 point to increase dexterity by 1"
          />
          || <button
            className="w-4 h-4 bg-red-600 hover:bg-red-500 text-sm text-black border-2 border-gray-500 rounded-lg
            onClick={() => handleStatPointUse('vitality')}
            title="Spend 1 point to increase vitality by 1"
          />
          || <button
            className="w-4 h-4 bg-red-600 hover:bg-red-500 text-sm text-black border-2 border-gray-500 rounded-lg
            onClick={() => handleStatPointUse('energy')}
            title="Spend 1 point to increase energy by 1"
          />
          || <button
            className="w-4 h-4 bg-red-600 hover:bg-red-500 text-sm text-black border-2 border-gray-500 rounded-lg
            onClick={() => handleStatPointUse('attack')}
            title="Spend 1 point to increase attack by 5"
          />
          || <button
            className="w-4 h-4 bg-red-600 hover:bg-red-500 text-sm text-black border-2 border-gray-500 rounded-lg
            onClick={() => handleStatPointUse('defense')}
            title="Spend 1 point to increase defense by 5"
          />
        </div>
      </div>
    </div>
  );
};

export default CharacterPanel;
```

``` src/components/UI/InventoryPanel.jsx
import { useState, useEffect } from 'react';
import React from 'react';

export const InventoryPanel = ({ inventory, setInventory, onClose }) => {
  const [showControl, setShowControl] = useState(true);
  const handleToggle = (setting) => {
    setShowControl(prev => !prev);
  };

  const handleItemUse = (item) => {
    console.log("Using potion:", item.name);
    const newInventory = JSON.parse(JSON.stringify(inventory)); // deep copy
    const itemIndex = newInventory.potions.findIndex(p => p.id === item.id);
    if(itemIndex !== -1) {
      newInventory.potions[itemIndex].count--;
      if(newInventory.potions[itemIndex].count <= 0) {
        newInventory.potions.splice(itemIndex, 1);
      }
      setInventory(newInventory);
    }
  };

  useEffect(() => {
    if (!inventory) return;
    if (inventory.potions.length > 0) {
      const potionButtons = document.querySelectorAll('.potion');
      potionButtons.forEach(button => button.addEventListener('click', () => handleItemUse(inventory.potions[itemIndex]));
    }
  }, [inventory]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 pointer-events-none">
      {/* Header */}
      <div className="bg-gray-700 px-4 py-2 rounded-t-lg border-b-1 border-gray-600 flex justify-between items-center">
        <h4 className="text-yellow-400 font-bold text-md">Inventory</h4>
        <button 
          onClick={onClose}
          className="text-red-400 hover:text-red-300 text-xxl font-bold w-12 h-8 bg-gray-700 border-2 border-gray-600 rounded-lg shadow-lg active:scale-95 transition-all duration-200"
        >
          Close
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4">
        {/* Equipment Layout */}
        <div className="bg-gray-900 bg-opacity-40 border-4 border-yellow-500 rounded-lg p-4">
          <h3 className="text-yellow-300 font-bold text-md text-center">Equipment</h3>
          <div className="grid grid-cols-2 gap-2">
            {inventory.equipment && inventory.equipment.helmet && (
              <div position="absolute top-0 left-1/2 transform -translate-x-1/2" className="w-16 h-16 bg-gray-700 border-2 border-gray-600 rounded-lg shadow-lg">
                <div className="text-4xl text-yellow-500 font-bold text-center"> Helmet</div>
              </div>
            )}
            {inventory.equipment && inventory.equipment.armor && (
              <div position="absolute top-0 left-1/2 transform -translate-x-1/2" className="w-96 h-96 bg-gray-700 border-2 border-gray-600 rounded-lg shadow-lg">
                <div className="text-sm text-yellow-500 text-center"> Armor</div>
              </div>
            )}
            {inventory.equipment && inventory.equipment.weapon && (
              <div position="absolute top-0 left-1/2 transform -translate-x-1/2" className="w-16 h-24 bg-gray-700 border-2 border-gray-600 rounded-lg shadow-lg">
                <div className="text-sm text-yellow-500 text-center"> Weapon</div>
              </div>
            )}
            {inventory.equipment && inventory.equipment.shield && (
              <div position="absolute top-0 left-1/2 transform -translate-x-1/2" className="w-16 h-16 bg-gray-700 border-2 border-gray-600 rounded-lg shadow-lg">
                <div className="text-sm text-yellow-500 text-center"> Shield</div>
              </div>
            )}
            {inventory.equipment && inventory.equipment.ring1 && (
              <div position="absolute top-0 left-1/2 transform -translate-x-1/2" className="w-16 h-16 bg-gray-700 border-2 border-gray-600 rounded-lg shadow-lg">
                <div className="text-sm text-yellow-500 text-center"> Ring</div>
              </div>
            )}
            {inventory.equipment && inventory.equipment.ring2 && (
              <div position="absolute top-0 left-1/2 transform -translate-x-1/2" className="w-16 h-16 bg-gray-700 border-2 border-gray-600 rounded-lg shadow-lg">
                <div className="text-sm text-yellow-500 text-center"> Ring</div>
              </div>
            )}
            {inventory.equipment && inventory.equipment.amulet && (
              <div position="absolute top-0 left-1/2 transform -translate-x-1/2" className="w-16 h-16 bg-gray-700 border-2 border-gray-600 rounded-lg shadow-lg">
                <div className="text-sm text-yellow-500 text-center"> Amulet</div>
              </div>
            )}
          </div>

          {/* Storage */}
          <div className="bg-gray-900 bg-opacity-40 border-4 border-yellow-600 rounded-lg p-4">
            <h3 className="text-yellow-300 font-bold text-md text-center">Storage</h3>
            <div className="grid grid-cols-8 gap-2">
              {inventory.storage.filter(item => item !== null).map((item, index) => (
                <div key={index} className="bg-gray-700 border-2 border-gray-600 rounded-lg shadow-lg">
                  <div className="text-sm text-yellow-500 text-center">{item.name}</div>
                </div>
              ))
            }
          </div>
        </div>

        {/* Potions */}
        <div className="bg-gray-900 bg-opacity-40 border-4 border-yellow-500 rounded-lg p-4">
          <h3 className="text-yellow-300 font-bold text-md text-center">Potions</h3>
          {inventory.potions.map((potion, index) => (
            <div key={index} className="bg-gray-700 border-2 border-gray-600 rounded-lg shadow-lg">
              <div className="text-sm text-yellow-500 text-center">{potion.name}</div>
            </div>
          ))
        </div>
      </div>
    </div>
  );
};

export default InventoryPanel;
```

```src/components/UI/ZoomControls.jsx
import React from 'react';

const ZoomControls = ({ onZoomIn, onZoomOut }) => (
  <div className="flex flex-col gap-4 mb-2">
    <button onTouchStart={onZoomIn}
      onMouseDown={onZoomIn}
      className="w-12 h-12 rounded-full border-2 shadow-lg text-sm text-red-400 bg-black/60 text-white border-gray-500 active:scale-95 transition-all duration-200"
      title="Zoom In"
    />
    <button onTouchStart={onZoomOut}
      onMouseDown={onZoomOut}
      className="w-12 h-12 rounded-full border-2 shadow-lg text-sm text-red-400 bg-black/60 text-white border-gray-500 transition-all duration-200"
      title="Zoom Out"
    />
  </div>
);

export default ZoomControls;
```

```src/components/UI/ActionButtons.jsx
import React from 'react';

const ActionButtons = ({ holdRun, onRunDown, onRunUp, onInteract, onJump, onAttack, onDodge }) => (
  <div className="flex gap-3">
    <button
      onTouchStart={onRunDown}
      onMouseDown={onRunDown}
      className="w-16 h-16 rounded-full border-2 shadow-lg text-sm text-black bg-gray-700 border-gray-500"
      title="Run"
    />
    <button
      onTouchStart={onJump}
      onMouseDown={onJump}
      className="w-16 h-16 rounded-full border-2 shadow-lg text-sm text-green-400 bg-gray-700 border-gray-500"
      title="Jump"
    />
    <button
      onTouchStart={onAttack}
      onMouseDown={onAttack}
      className="w-20 h-20 rounded-full border-2 shadow-2xl text-sm text-red-500 bg-black/60 text-white border-gray-500 transition-all duration-200"
      title="Attack"
    />
    <button
      onTouchStart={onDodge}
      onMouseDown={onDodge}
      className="w-16 h-16 rounded-full border-2 shadow-lg text-sm text-purple-300 bg-gray-700 border-gray-500"
      title="Dodge"
    />
    <button
      onTouchStart={onInteract}
      onMouseDown={onInteract}
      className="w-16 h-16 rounded-full border-2 shadow-lg text-sm text-blue-500 bg-gray-700 border-gray-500"
      title="Interact"
    />
  </div>
);

export default ActionButtons;
```

```src/components/UI/ChangelogPanel.jsx
import React from 'react';

const changelogData = [
    { version: '0.004.0', date: '2025-08-11', changes: [
        'Movement: W now always moves the player forward relative to the direction they are facing.',
        'Movement: A and D are strafe-only and no longer rotate the player.',
        'Movement: Player now faces the direction of travel; fixed D moving opposite/right issues.',
        'Camera: Player rotation and camera orbit are unified to feel consistent.',
        'Feature: First‑person view toggle (V). Uses pointer lock with mouse‑look.',
        'UX: Interaction prompt shows “Press F to interact (Name)” for nearby objects.',
        'World: Ichiraku Ramen is now placed in the world at LF480 (with collider).',
        'World: Hokage Palace placed at KN182 with detailed colliders.',
        'World: Hokage Monument GLB placed at KN129 and scaled up.',
        'World: Konoha town placed with a gate at the wall.',
    ]},
    { version: '0.003.9', date: '2025-08-11', changes: [
        'Version bump to 0.003.9.',
        'Added Ichiraku Ramen shop prototype (ichiraku.js) — file only, not yet integrated into the world.'
    ]},
    { version: '0.002.51', date: '2025-08-09', changes: [
        'Performance: Capped renderer pixel ratio via Settings → Render Scale (default 1.25x).',
        'Performance: Minimap/HUD updates throttled to ~12 FPS.',
        'Performance: Central wall details (crenellations, buttresses) converted to InstancedMesh (massive draw-call reduction).',
        'Performance: Slightly reduced wall segment count for smoother rendering.',
        'Quality: Settings panel exposes Render Scale control.'
    ]},
    { version: '0.002.5', date: '2025-08-09', changes: [
        'Version bump and new changelog entry.',
        'Jump animation now immediately transitions to walk/run/idle upon landing.',
        'Grid labels are bound to terrain height and grid cell size is locked.',
        'Second loading overlay stays visible until the 3D scene and player are fully ready.',
        'Prevented scene re-initialization when moving (no reload on movement).',
        'Updated splash and main menu backgrounds; added Credits modal.'
    ]},
    { version: '0.001.6', date: 'Upcoming', changes: ['Added Main Menu with game start, options, and changelog.', 'Implemented asset pre-loading for smoother game start.'] },
    { version: '0.001.5', date: '2024-05-22', changes: [
        'Implemented asset downloader and caching system.',
        'Added diverse terrain types (sand, snow, rocky, forest).',
        'Player can now jump with Spacebar and gravity feels more responsive.',
        'Added mobile joystick controls (toggle with Z key).',
        'Unified movement speed for both keyboard and joystick.',
        'Fixed inverted vertical axis on joystick.',
    ]},
    { version: '0.001.4', date: '2024-05-21', changes: [
        'Added character panel (C), inventory (I), map (M), and settings (P) panels.',
        'Renamed MP to Chakra across all UI elements.',
        'Added character panel (C), inventory (I), map (M), and settings (P) panels.',
    ]},
    { version: '0.001.3', date: '2024-05-20', changes: [
        'Moved Character Panel, Inventory, and Settings panels into main UI tree.',
        'Renamed MP to Chakra across all UI elements.'
    ]},
    { version: '0.002.1', date: 'Upcoming', changes: ['Added basic combat moves: Attack (F) and Dodge (Ctrl).', 'Animation system now handles one-shot actions, preventing movement during attacks/dodges.', 'Integrated a wider range of animations to make the player more dynamic.'] },
    { version: '0.001.6', date: 'Upcoming', changes: ['Added Main Menu with game start, options, and changelog.', 'Implemented asset pre-loading for smoother game start.'] },
    { version: '0.001.5', date: '2024-05-22', changes: ['Added diverse terrain types (sand, snow, rocky, forest).', 'Player can now jump with Spacebar and gravity feels more responsive.', 'Added mobile joystick controls (toggle with Z key).', 'Unified movement speed for both keyboard and joystick.', 'Fixed inverted vertical axis on joystick.'] },
    { version: '0.001.4', date: '2024-05-21', changes: ['Added character panel (C), inventory (I), map (M), and settings (P) panels.', 'Renamed MP to Chakra across all UI elements.', 'Moved Character Panel, Inventory, and Settings panels into main UI tree.'] },
    { version: '0.002.1', date: '2024-05-20', changes: ['Added basic combat moves: Attack (F) and Dodge (Ctrl).', 'Animation system now handles one-shot actions, preventing movement during attacks/dodges.', 'Integrated a wider range of animations to make the player more dynamic.'] },
    { version: '0.002.51', date: '2025-08-09', changes: [
        'Performance: Capped renderer pixel ratio via Settings → Render Scale (default 1.25x).',
        'Performance: Minimap/HUD updates throttled to ~12 FPS.',
        'Performance: Central wall details (crenellations, buttresses) converted to InstancedMesh (massive draw-call reduction).',
        'Performance: Slightly reduced wall segment count for smoother rendering.',
        'Quality: Settings panel exposes Render Scale control.'
    ]},
    { version: '0.002.5', date: '2025-08-09', changes: [
        'Version bump and new changelog entry.',
        'Jump animation now immediately transitions to walk/run/idle upon landing.',
        'Grid labels are bound to terrain height and grid cell size is locked.',
        'Second loading overlay stays visible until the 3D scene and player are fully ready.',
        'Prevented scene re-initialization when moving (no reload on movement).',
        'Updated splash and main menu backgrounds; added Credits modal.'
    ]},
    { version: '0.001.6', date: 'Upcoming', changes: ['Added Main Menu with game start, options, and changelog.', 'Implemented asset pre-loading for smoother game start.'] },
    { version: '0.001.5', date: '2024-05-22', changes: ['Added diverse terrain types (sand, snow, rocky, forest).', 'Player can now jump with Spacebar and gravity feels more responsive.', 'Added mobile joystick controls (toggle with Z key).', 'Unified movement speed for both keyboard and joystick.', 'Fixed inverted vertical axis on joystick.', 'Renamed MP to Chakra across all UI elements.'] },
    { version: '0.001.4', date: '2024-05-21', changes: ['Added character panel (C), inventory (I), map (M), and settings (P) panels.', 'Renamed MP to Chakra across all UI elements.', 'Moved Character Panel, Inventory, and Settings panels into main UI tree.'] },
    { version: '0.002.1', date: 'Upcoming', changes: ['Added basic combat moves: Attack (F) and Dodge (Ctrl).', 'Animation system now handles one-shot actions, preventing movement during attacks/dodges.', 'Integrated a wider range of animations to make the player more dynamic.'] },
};

export const ChangelogPanel = ({ onClose }) => {
    return (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 bg-opacity-98 border-2 border-gray-600 rounded-lg shadow-2xl z-50 w-[500px] text-white">
          {/* Header */}
          <div className="bg-gray-700 px-4 py-2 rounded-t-lg border-b-1 border-gray-600 flex justify-between items-center">
            <h2 className="text-yellow-300 font-bold text-lg">Changelog</h2>
            <button
              onClick={onClose}
              className="text-red-400 hover:text-red-300 text-xl font-bold w-12 h-8 bg-gray-700 border-2 border-gray-600 rounded-lg shadow-lg active:scale-95 transition-all duration-200"
            >
              Close
            </button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
            {changelogData.map(entry => (
                <div key={entry.version} className="bg-gray-900 p-3 rounded-lg border border-gray-600">
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="text-yellow-300 font-bold text-md">Version {entry.version}</h3>
                    <p className="text-sm text-gray-400">{entry.date}</p>
                  </div>
                  <ul className="list-disc list-inside text-sm space-y-1 text-gray-300">
                    {entry.changes.map((change, index) => (
                        <li>{change}</li>
                    ))}
                  </ul>
                </div>
            ))}
          </div>
        </div>
    );
};

export default ChangelogPanel;
```

```src/components/UI/Minimap.jsx
import React from 'react';
import { useMinimap } from '../hooks/useMinimap.js';

export const Minimap = ({ playerRef, worldObjects, zoomRef }) => {
  const { minimapState, minimapCanvasRef, posXRef, posZRef, zoomLevelRef, biomeRef, handleInteractionStart } = useMinimap({ playerRef, worldObjects, zoomRef });

  return (
    <div className="absolute top-4 right-4 z-10 flex items-center pointer-events-none">
      {/* Minimap */}
      <canvas
        ref={minimapCanvasRef}
        width={minimapState.width}
        height={minimapState.height}
        className="w-full h-full bg-black/70 border-2 border-gray-600 rounded-lg shadow-2xl"
        style={{ transform: `translateX(-100%) rotateX(0) scale(1) translateZ(-50%)`}}
      />
      {/* Position display */}
      <div className="bg-black bg-opacity-70 text-white p-2 rounded-lg border border-gray-600 shadow-lg">
        <div ref={posXRef}>X: 0</div>
        <div ref={posZRef}>Z: 0</div>
        <div ref={zoomLevelRef}>Zoom Level: 1</div>
        <div ref={biomeRef}>Biome: Unknown</div>
      </div>
      {/* Axis legend per spec */}
      <div className="text-blue-300 opacity-80">(-z =N • +z =S • -x =W • +x=E • y = 0</div>
    </div>
  </div>
);
```

``` src/hooks/sceneLifecycle.js
import { useState, useEffect, useCallback } from 'react';
import { initThreeScene, cleanupThreeScene } from './sceneLifecycle.js';

export const initThreeScene = ({ mountRef, settings, onReadyRef, sceneRef, rendererRef, cameraRef, lightRef, groundContainerRef, gridHelperRef, gridLabelsGroupRef, gridLabelsUpdateRef, playerRef, objectTooltipsGroupRef, objectTooltipsUpdateRef, interactPromptRef }) => {
  const [visible, setVisible] = useState(true);
  const joystickRef = useRef(null);
  const playerControlsRef = useRef(null);
  const settingsRef = useRef(settings);
  const rendererRef = useRef(rendererRef);
  const sceneRef = useRef(sceneRef);
  const cameraRef = useRef(cameraRef);
  const lightRef = useRef(lightRef);
  const groundContainerRef = useRef(groundContainerRef);
  const gridHelperRef = useRef(gridHelperRef);
  const gridLabelsGroupRef = useRef(gridLabelsGroupRef);
  const gridLabelsUpdateRef = useRef(gridLabelsUpdateRef);
  const playerRef = useRef(playerRef);
  const objectTooltipsGroupRef = useRef(objectTooltipsGroupRef);
  const objectTooltipsUpdateRef = useRef(objectTooltipsUpdateRef);
  const interactPromptRef = useRef(interactPromptRef);

  const initialize = useCallback(() => {
    initThreeScene({
      mountEl: mountRef.current,
      settings: settingsRef.current,
      createPlayer,
      onReady: onReadyRef.current
    });
  });

  useEffect(() => {
    if (!mountRef.current) return;
    initialize();
    // start main loop
    const animationStopRef = useRef(null);
    animationStopRef.current = startAnimationLoop({
      sceneRef,
      cameraRef,
      rendererRef,
      lightRef,
      playerRef,
      objectGridRef: updateObjects(sceneRef.current, [], settingsRef.current),
      randomObjectsRef: [],
      keysRef: playerControlsRef.current,
      throttledSetPlayerPosition: setVisible ? throttledSetPlayerPosition : null,
      joystickRef: joystickRef.current,
      cameraOrbitRef: 0,
      cameraPitchRef: 0,
      firstPersonRef: false,
      fpsLimit: settingsRef.current.fpsLimit,
      gridLabelsGroupRef,
      gridLabelsArrayRef,
      visibleLabelsRef,
      gridLabelsUpdateRef,
      objectTooltipsUpdateRef,
      interactPromptRef
    });

    const resizeObs = new ResizeObserver(() => {
      const w = mountRef.current.clientWidth || innerWidth;
      const h = mountRef.current.clientHeight || innerHeight;
      rendererRef.current.setSize(w, h, false);
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      if (gridLabelsGroupRef.current) {
        gridLabelsUpdateRef.current(playerRef.current.position);
      }
    });
    resizeObs.observe(mountRef.current);
    const rafId = useRef(null);
    const running = true;
    (function loop() {
      if (!running) return;
      animationStopRef.current();
      rafId.current = requestAnimationFrame(loop);
    })();

    // Cleanup helper
    const cleanupScene = useCallback(() => {
      animationStopRef.current = null;
      cancelAnimationFrame(rafId.current);
      resizeObs.unobserve(mountRef.current);
      cleanupThreeScene({
        mountRef,
        rendererRef,
        sceneRef,
        animationStopRef,
        interactPromptRef,
        groundContainerRef,
        gridLabelsGroupRef,
        gridLabelsArrayRef,
        visibleLabelsRef,
        randomObjectsRef,
        objectGridRef
    });
  }, [mountRef]);

  useEffect(() => {
    if (!visible) {
      // Hide settings panel when not visible
      setVisible(true);
    }
  }, [visible]);

  return {
    initThreeScene,
    cleanupScene,
    sceneRef,
    cameraRef,
    rendererRef,
    groundContainerRef,
    gridHelperRef,
    gridLabelsGroupRef,
    gridLabelsUpdateRef,
    playerRef,
    objectTooltipsGroupRef,
    objectTooltipsUpdateRef,
    interactPromptRef
  };
};

export default useSceneLifecycle;
```

```src/components/UI/hud/Compass.jsx
import { useState, useEffect } from 'react';
import { bearingToLabel } from '../game/player/movement/index.js';
import { playAnimation } from '../game/player/animations.js';
import { resolveCollisions } from '../game/player/movement/collision.js';
import * as THREE from 'three';

export const Compass = ({ playerRef }) => {
  const [bearingDeg, setBearingDeg] = useState(0);
  const [dir, setDir] = useState('N');

  useEffect(() => {
    if (!playerRef.current) return;
    const yaw = playerRef.current.userData.model.rotation.y || 0;
    const sin = Math.sin(yaw);
    const cos = Math.cos(yaw);
    const forward = Math.cos(yaw);
    const bearing = Math.atan2(cos, sin);
    setBearingDeg(bearing);
    const direction = bearingToLabel(bearingDeg);
    setDir(direction);
  }, [playerRef]);

  const handleInteractionStart = (e) => {
    // Show controls modal
    if (e.target.tagName === 'canvas') {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const angle = Math.atan2((y - 50), (x - 100)) * Math.PI / 360;
      setBearingDeg(angle);
      setDir('S');
      const proxy = new THREE.Object3D();
      proxy.position.set(x, 0, y);
      const group = new THREE.Group();
      group.position.copy(proxy.position);
      scene.add(group); // placeholder scene
    }
  };

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/70 border-2 border-gray-600 rounded-lg shadow-2xl flex items-center>
      {/* Dial */}
      <div className="relative w-28 rounded-full border-2 border-gray-600 bg-black/70">
        {/* Labels */}
        <div className="absolute inset-0 bg-green-500 border-2 border-gray-500 rounded-lg shadow-lg">
          {/* North */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2">N</div>
          {/* East */}
          <div className="absolute top-4 right-1/2 transform -translate-x-1/2">E</div>
          {/* South */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">S</div>
          {/* West */}
          <div className="absolute bottom-4 right-1/2 transform -translate-x-1/2">W</div>
        </div>
      </div>
      {/* Needle */}
      <div className="absolute inset-0 w-4 h-4 rounded-full border-2 border-gray-500 shadow-lg">
        {/* Rotation */}
        <div className="absolute inset-0 bg-amber-500 border-2 border-yellow-300 rounded-full shadow-lg">
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
            {/* Triangle needle */}
            <div
              className="absolute w-6 h-6 bg-black/60 border-2 border-gray-600 rounded-full border-b-1 border-gray-600 shadow-lg
              ref={handleInteractionStart}
            > 
              /* @__PURE__ */jsxDEV>
              {/* Triangle */}
              <div className="absolute w-6 h-6 bg-amber-500 border-2 border-yellow-300 rounded-full shadow-lg">
                {/* Center */}
                <div className="absolute w-2 h-2 bg-black/60 border-