// citySliceBuildings.js
// Usage (minimal HTML):
// -------------------------------------------------------
// <script type="importmap">
// {
//   "imports": {
//     "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
//     "three/examples/jsm/controls/OrbitControls.js":
//       "https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js"
//   }
// }
// </script>
// <script type="module" src="./citySliceBuildings.js"></script>
// -------------------------------------------------------

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { addKonohaCitySlice } from "./citySlice.js";

/* -------------------------------------------------------
   Scene / Renderer / Camera
------------------------------------------------------- */
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa8c7ff);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 6000);
camera.position.set(1100, 620, 1200);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 80, 0);
controls.enableDamping = true;

/* -------------------------------------------------------
   Lights
------------------------------------------------------- */
scene.add(new THREE.HemisphereLight(0xffffff, 0x4b5563, 0.65));
const sun = new THREE.DirectionalLight(0xffffff, 1.2);
sun.position.set(1600, 1300, 500);
sun.castShadow = true;
sun.shadow.mapSize.set(4096, 4096);
sun.shadow.camera.left = -2200; sun.shadow.camera.right = 2200;
sun.shadow.camera.top = 1500;   sun.shadow.camera.bottom = -1500;
sun.shadow.camera.near = 50;    sun.shadow.camera.far = 4500;
sun.shadow.bias = -0.0002;      sun.shadow.normalBias = 1.2;
scene.add(sun);

/* -------------------------------------------------------
   City Slice
------------------------------------------------------- */
const root = new THREE.Group();
scene.add(root);
addKonohaCitySlice(root, { rows: 6, cols: 5, withGround: true });

/* -------------------------------------------------------
   Resize / Render loop
------------------------------------------------------- */
addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
(function loop() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
})();
