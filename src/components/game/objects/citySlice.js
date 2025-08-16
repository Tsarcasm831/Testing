// citySlice.js
// Entry point for creating the 6x5 (30) building city slice as modules.
// This is designed to "plug into the game": you pass in a THREE.Group or Scene.
// It DOES NOT create an HTML page or its own renderer; it's headless by default.
//
// Usage inside your game:
//   import * as THREE from "three";
//   import { addKonohaCitySlice } from "./citySlice.js";
//   const root = new THREE.Group();
//   scene.add(root);
//   addKonohaCitySlice(root, { rows:6, cols:5 }); // returns the slice group
//
// For a quick standalone browser demo, see the comment at the bottom.

import * as THREE from "three";
import { createKit } from "./citySlice.kit.js";
import { createExotics } from "./citySlice.exotics.js";
import { buildOriginals } from "./citySlice.originals.js";
import { buildMore } from "./citySlice.more.js";

export function addKonohaCitySlice(target, opts = {}) {
  const {
    rows = 6, cols = 5,
    spacingX = 300, spacingZ = 280,
    jitter = 0.14,
    withGround = false, groundColor = 0x74ad66,
    center = [0, 0, 0]
  } = opts;

  const kit = createKit(THREE);
  const ex  = createExotics(THREE, kit);
  const slice = new THREE.Group(); slice.name = "KonohaCitySlice";
  target.add(slice);

  if (withGround) {
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(cols * spacingX + 800, rows * spacingZ + 800),
      new THREE.MeshStandardMaterial({ color: groundColor, roughness: 1 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    slice.add(ground);
  }

  // Make the 30 buildings
  const originals = buildOriginals(THREE, kit, ex);
  const more      = buildMore(THREE, kit, ex);
  const builds    = originals.concat(more);

  const [cx, cy, cz] = center;
  const X0 = cx - (cols - 1) * spacingX / 2;
  const Z0 = cz - (rows - 1) * spacingZ / 2;

  let idx = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (idx >= builds.length) break;
      const b = builds[idx++];
      b.position.set(X0 + c * spacingX, 0, Z0 + r * spacingZ);
      b.rotation.y = (Math.random() - 0.5) * jitter;
      slice.add(b);
    }
  }

  // shadow flags
  slice.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  return { slice, kit, ex };
}

/* -------------------------------------------------------
   OPTIONAL: tiny standalone viewer for quick eyeballing.
   Uncomment to use in a blank HTML file with an importmap
   for "three". (Keep this commented in-game.)
------------------------------------------------------- */
/*
if (typeof window !== "undefined" && !window.__CITY_SLICE_DEMO__) {
  window.__CITY_SLICE_DEMO__ = true;
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(innerWidth, innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.VSMShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  document.body.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa8c7ff);

  const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 6000);
  camera.position.set(1100, 620, 1200);

  const controlsMod = await import("three/examples/jsm/controls/OrbitControls.js");
  const controls = new controlsMod.OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 80, 0);
  controls.enableDamping = true;

  // light
  scene.add(new THREE.HemisphereLight(0xffffff, 0x4b5563, .65));
  const sun = new THREE.DirectionalLight(0xffffff, 1.2);
  sun.position.set(1600, 1300, 500);
  sun.castShadow = true;
  sun.shadow.mapSize.set(4096,4096);
  sun.shadow.camera.left=-2200; sun.shadow.camera.right=2200;
  sun.shadow.camera.top=1500;   sun.shadow.camera.bottom=-1500;
  sun.shadow.camera.near=50;    sun.shadow.camera.far=4500;
  sun.shadow.bias=-0.0002;      sun.shadow.normalBias=1.2;
  scene.add(sun);

  const root = new THREE.Group(); scene.add(root);
  addKonohaCitySlice(root, { rows:6, cols:5, withGround:true });

  addEventListener("resize", ()=>{
    camera.aspect = innerWidth/innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
  (function loop(){
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  })();
}
*/
