import { WORLD_SIZE as WORLD_SIZE_CONST } from '../../scene/terrain.js';
import { ObjectGrid } from './grid.js';
import { createCentralWallWithGate } from './walls/centralWall.js';
import { createHokagePalace } from './houses/HokagePalace.js';
import { createIchiraku } from './houses/ichiraku.js';
import { parseGridLabel, posForCell } from './utils/gridLabel.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three'; // FIX: Needed for THREE.Group and vector ops

// NEW: bring in color-set builders used by konohaBuildings.js (but don't import its standalone scene)
import { addRedBuildings } from '../../components/game/objects/buildings.red.js';
import { addBlueBuildings } from '../../components/game/objects/buildings.blue.js';
import { addYellowBuildings } from '../../components/game/objects/buildings.yellow.js';
import { addGreenBuildings } from '../../components/game/objects/buildings.green.js';
import { addDarkBuildings } from '../../components/game/objects/buildings.dark.js';

// Populate the spatial grid with the given objects (kept for future expansion)
function populateGrid(grid, objects) {
  objects.forEach(obj => grid.add(obj));
}

// Helper: Create an overlay with an iframe to run a standalone building demo module.
// We use srcdoc to avoid navigating away; an import map is included for modules that expect it.
function openModuleIframe({ title = 'Building', modulePath, callDefault = true }) {
  // Overlay container
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.inset = '0';
  overlay.style.background = 'rgba(0,0,0,0.85)';
  overlay.style.zIndex = '1000';
  overlay.style.display = 'flex';
  overlay.style.flexDirection = 'column';

  // Header bar
  const header = document.createElement('div');
  header.style.flex = '0 0 auto';
  header.style.display = 'flex';
  header.style.alignItems = 'center';
  header.style.justifyContent = 'space-between';
  header.style.padding = '8px 12px';
  header.style.background = 'rgba(20,20,20,0.9)';
  header.style.borderBottom = '1px solid rgba(255,255,255,0.15)';
  header.style.color = '#f5f5f5';
  header.style.fontFamily = 'system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif';
  header.innerHTML = `<div style="font-weight:700;letter-spacing:.5px">${title}</div>`;
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '×';
  Object.assign(closeBtn.style, {
    background: '#ef4444', color: '#000', border: 'none', borderRadius: '6px',
    fontWeight: '900', width: '32px', height: '28px', cursor: 'pointer'
  });
  closeBtn.onclick = () => document.body.removeChild(overlay);
  header.appendChild(closeBtn);

  // Iframe (fills remainder)
  const frame = document.createElement('iframe');
  frame.style.flex = '1 1 auto';
  frame.style.width = '100%';
  frame.style.border = '0';
  frame.style.background = '#000';

  // srcdoc content: minimal HTML with import map and module bootstrap
  // Most modules export default(). A few auto-execute when imported (like konohaBuildings.js).
  const html = `
<!doctype html>
<html>
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<style>
  html,body{margin:0;height:100%;background:#000;}
  #app{position:relative;width:100%;height:100%;}
  canvas{display:block}
</style>
<script type="importmap">
{
  "imports": {
    "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
    "three/examples/jsm/controls/OrbitControls.js":
      "https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js"
  }
}
</script>
</head>
<body>
<div id="app"></div>
${callDefault ? `
<script type="module">
  import mod from "${modulePath}";
  // Many modules accept a container; if not, they mount to body by default.
  try {
    // Try common signatures:
    // - function(containerEl?)
    // - function(options?) with container/mount
    const app = document.getElementById('app');
    const arg = { container: app, mount: app, background: 0x1a2027, withUI: true, ui: true };
    const ret = typeof mod === 'function' ? mod(app || arg, arg) : (mod?.default ? mod.default(app || arg, arg) : null);
    // Expose for debugging
    window._buildingAPI = ret || null;
  } catch (e) {
    console.error('Failed to init module:', e);
  }
</script>` : `
<script type="module" src="${modulePath}"></script>`}
</body>
</html>`.trim();

  frame.srcdoc = html;

  overlay.appendChild(header);
  overlay.appendChild(frame);
  document.body.appendChild(overlay);
}

// Helper: add a simple portal pedestal with interaction that opens an iframe overlay for the building demo.
function createPortal({ THREE, name, modulePath, position, color = 0xffcc00, callDefault = true }) {
  const group = new THREE.Group();
  group.position.copy(position);

  // Pedestal
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(3, 3, 1, 24),
    new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 1 })
  );
  base.position.y = 0.5;
  base.castShadow = base.receiveShadow = true;
  group.add(base);

  // Pillar
  const pillar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.5, 5, 12),
    new THREE.MeshStandardMaterial({ color, roughness: 0.6, metalness: 0.1 })
  );
  pillar.position.y = 3;
  pillar.castShadow = pillar.receiveShadow = true;
  group.add(pillar);

  // Orb
  const orb = new THREE.Mesh(
    new THREE.SphereGeometry(1.1, 16, 12),
    new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.35, roughness: 0.4 })
  );
  orb.position.y = 5.6;
  orb.castShadow = orb.receiveShadow = true;
  group.add(orb);

  // Interaction proxy (slightly larger than visual)
  const proxy = new THREE.Object3D();
  proxy.position.copy(position);
  proxy.userData.collider = { type: 'sphere', radius: 6 };
  proxy.userData.label = `${name} (Portal)`;
  proxy.userData.onInteract = () => {
    openModuleIframe({ title: name, modulePath, callDefault });
  };

  return { group, proxy };
}

// ──────────────────────────────────────────────────────────────────────────
// NOTE: Removed portal overlay/iframe helpers and portal pedestals.
// We will be integrating standalone building modules directly into the main
// game world one by one instead of opening separate demo scenes.
// ──────────────────────────────────────────────────────────────────────────

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

  // Place Hokage Palace at KN182
  try {
    const targetLabel = 'KN182';
    const { i, j } = parseGridLabel(targetLabel);
    const pos = posForCell(i, j, worldSize);
    pos.y = 0;

    const { group: palace, colliderProxies } = createHokagePalace({ position: pos, settings });
    scene.add(palace);
    renderObjects.push(palace);

    if (Array.isArray(colliderProxies)) {
      colliderProxies.forEach(proxy => {
        scene.add(proxy);
        objectGrid.add(proxy);
      });
    }
  } catch (e) {
    console.warn('Failed to place Hokage Palace at KN182:', e);
  }

  // Place Hokage Monument GLB at KN129
  try {
    const monumentLabel = 'KN129';
    const { i: mi, j: mj } = parseGridLabel(monumentLabel);
    const mPos = posForCell(mi, mj, worldSize);
    mPos.y = 0;

    const monumentGroup = new THREE.Group();
    monumentGroup.name = 'HokageMonument';
    monumentGroup.position.copy(mPos);
    scene.add(monumentGroup);
    renderObjects.push(monumentGroup);

    const monumentProxy = new THREE.Object3D();
    monumentProxy.position.set(mPos.x, mPos.y, mPos.z);
    monumentProxy.userData = {
      label: 'Hokage Monument',
      collider: { type: 'sphere', radius: 180 }
    };
    objectGrid.add(monumentProxy);

    const loader = new GLTFLoader();
    loader.load(
      '/src/assets/Hokage_Monument.glb',
      (gltf) => {
        const model = gltf.scene || gltf.scenes?.[0];
        if (!model) return;
        model.scale.set(54, 54, 54);
        model.traverse((n) => {
          if (n.isMesh) {
            n.castShadow = !!settings.shadows;
            n.receiveShadow = !!settings.shadows;
          }
        });
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

  // Place Ichiraku Ramen at LF480
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

  // ──────────────────────────────────────────────────────────────────────────
  // NEW: Integrate the Konoha Buildings set directly into the world.
  // We reuse the color-set modules from /components/... and provide a lightweight
  // "kit" that mimics konohaBuildings.js's makeBuilding API.
  // ──────────────────────────────────────────────────────────────────────────
  try {
    const townOrigin = new THREE.Vector3(-320, 0, -220); // inside wall, away from palace/monument
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

    // Materials
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

    // Helpers
    const box = (w,h,d,mat) => { const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d), mat); m.castShadow=m.receiveShadow=!!settings.shadows; return m; };
    const cylinder = (r,h,mat,radial=24) => { const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,radial), mat); m.castShadow=m.receiveShadow=!!settings.shadows; return m; };
    const cone = (r,h,mat,radial=24) => { const m=new THREE.Mesh(new THREE.ConeGeometry(r,h,radial), mat); m.castShadow=m.receiveShadow=!!settings.shadows; return m; };

    // Facades
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

    // Roofs
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

    // Rect/floor level piece + window placement
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

    // Core factory used by the color-set modules
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
      }

      // Final transforms and shadow flags
      B.position.set(...position);
      B.rotation.y = rotationY;
      B.traverse(n => { if (n.isMesh) { n.castShadow = !!settings.shadows; n.receiveShadow = !!settings.shadows; }});
      return B;
    }

    // Build the town into a single group
    const townGroup = new THREE.Group();
    townGroup.name = 'KonohaTown';
    const kit = { THREE, Palette: KPalette, M: KMats, makeBuilding };

    addRedBuildings(townGroup,   { THREE, kit });
    addBlueBuildings(townGroup,  { THREE, kit });
    addYellowBuildings(townGroup,{ THREE, kit });
    addGreenBuildings(townGroup, { THREE, kit });
    addDarkBuildings(townGroup,  { THREE, kit });

    // Position whole cluster
    townGroup.position.copy(townOrigin);
    scene.add(townGroup);
    renderObjects.push(townGroup);

    // Colliders: approximate each immediate child "building" by its bounding box
    const bbox = new THREE.Box3();
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();

    const addAabbProxy = (worldCenter, halfX, halfZ, label='House') => {
      const proxy = new THREE.Object3D();
      proxy.position.set(worldCenter.x, 0, worldCenter.z);
      proxy.userData.collider = {
        type: 'aabb',
        center: { x: worldCenter.x, z: worldCenter.z },
        halfExtents: { x: halfX, z: halfZ }
      };
      proxy.userData.label = label;
      objectGrid.add(proxy);
      scene.add(proxy);
    };

    // Iterate only 1st-level children (each building added by makeBuilding)
    townGroup.children.forEach(colorGroup => {
      colorGroup.children?.forEach(building => {
        bbox.setFromObject(building);
        bbox.getCenter(center);
        bbox.getSize(size);
        // Shrink slightly to avoid being too sticky
        const hx = Math.max(2, size.x * 0.48);
        const hz = Math.max(2, size.z * 0.48);
        // center is in townGroup space -> convert to world
        const worldCenter = center.clone().applyMatrix4(building.parent.matrixWorld);
        addAabbProxy(worldCenter, hx, hz, building.name || 'House');
      });
    });
  } catch (e) {
    console.warn('Failed to integrate Konoha Buildings:', e);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Portals removed — future steps will place each building directly into the
  // world with proper geometry and colliders.
  // ──────────────────────────────────────────────────────────────────────────

  return { objects: renderObjects, grid: objectGrid };
}