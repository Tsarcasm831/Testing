import * as THREE from 'three';

/* =========================================================================
 *  HouseBlocks.js ― a building-blocks kit for houses
 * ------------------------------------------------------------------------- */
const HouseBlocks = (() => {
  function createBox(
    w = 1, h = 1, d = 1,
    color = 0xffffff,
    matOpts = {},
  ) {
    const geo = new THREE.BoxGeometry(w, h, d);
    const mat = new THREE.MeshStandardMaterial({ color, ...matOpts });
    return new THREE.Mesh(geo, mat);
  }

  function createCylinder(
    rTop = 0.5, rBot = 0.5, height = 1,
    radialSeg = 12,
    color = 0xffffff,
    matOpts = {},
  ) {
    const geo = new THREE.CylinderGeometry(rTop, rBot, height, radialSeg);
    const mat = new THREE.MeshStandardMaterial({ color, ...matOpts });
    return new THREE.Mesh(geo, mat);
  }

  function createFoundationSlab(w = 4, d = 4, t = 0.2) {
    return createBox(w, t, d, 0x7a7a7a);
  }

  function createExteriorWall(width, height, thickness = 0.12) {
    return createBox(width, height, thickness, 0xbfa27b);
  }

  function createRoofGable(span = 4, pitch = 0.4, depth = 4, color = 0x883333) {
    const group = new THREE.Group();
    // A triangular prism shape is better for a gable roof section.
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(span / 2, pitch);
    shape.lineTo(span, 0);
    shape.lineTo(0, 0);

    const extrudeSettings = {
      steps: 1,
      depth: depth,
      bevelEnabled: false,
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const material = new THREE.MeshStandardMaterial({ color: color, side: THREE.DoubleSide });
    const roofMesh = new THREE.Mesh(geometry, material);
    
    // Adjust pivot to be at the center bottom
    geometry.center();
    roofMesh.position.y += pitch/2;

    group.add(roofMesh);
    return group;
  }
  
  return {
      createFoundationSlab,
      createExteriorWall,
      createRoofGable,
  };
})();


export function createStarterHouse(scene, getHeight) {
  /* @tweakable The position of the starter house. You may need to reload if you move it far. */
  const housePosition = new THREE.Vector3(-0.5, 0, 40.5);
  const houseY = getHeight(housePosition.x, housePosition.z);
  housePosition.y = houseY;

  /* @tweakable The width of the starter house. */
  const houseWidth = 10;
  /* @tweakable The depth of the starter house. */
  const houseDepth = 12;
  /* @tweakable The height of the walls in the starter house. */
  const wallHeight = 5;
  /* @tweakable The width of the door in the starter house. */
  const doorWidth = 1.7;
  /* @tweakable The height of the door in the starter house. */
  const doorHeight = 3.0;
  /* @tweakable The thickness of the walls in the starter house. */
  const wallThickness = 0.15;
  /* @tweakable The thickness of the foundation slab. */
  const foundationThickness = 0.2;

  const addPart = (mesh) => {
    mesh.position.add(housePosition);
    mesh.userData.isBarrier = true;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
  };

  const houseGroup = new THREE.Group();
  houseGroup.position.copy(housePosition);
  scene.add(houseGroup);

  const foundation = HouseBlocks.createFoundationSlab(houseWidth, houseDepth, foundationThickness);
  houseGroup.add(foundation);
  foundation.userData.isBarrier = true;
  foundation.castShadow = true;
  foundation.receiveShadow = true;

  // The y-position for the center of the walls. They sit on top of the foundation.
  const wallY = foundationThickness / 2 + wallHeight / 2;

  const backWall = HouseBlocks.createExteriorWall(houseWidth, wallHeight, wallThickness);
  backWall.position.set(0, wallY, -houseDepth / 2 + wallThickness / 2);
  houseGroup.add(backWall);

  const leftWall = HouseBlocks.createExteriorWall(houseDepth, wallHeight, wallThickness);
  leftWall.rotation.y = Math.PI / 2;
  leftWall.position.set(-houseWidth / 2 + wallThickness / 2, wallY, 0);
  houseGroup.add(leftWall);

  const rightWall = HouseBlocks.createExteriorWall(houseDepth, wallHeight, wallThickness);
  rightWall.rotation.y = Math.PI / 2;
  rightWall.position.set(houseWidth / 2 - wallThickness / 2, wallY, 0);
  houseGroup.add(rightWall);

  const sideWallWidth = (houseWidth - doorWidth) / 2;

  const frontWallLeft = HouseBlocks.createExteriorWall(sideWallWidth, wallHeight, wallThickness);
  frontWallLeft.position.set(-doorWidth / 2 - sideWallWidth / 2, wallY, houseDepth / 2 - wallThickness / 2);
  houseGroup.add(frontWallLeft);

  const frontWallRight = HouseBlocks.createExteriorWall(sideWallWidth, wallHeight, wallThickness);
  frontWallRight.position.set(doorWidth / 2 + sideWallWidth / 2, wallY, houseDepth / 2 - wallThickness / 2);
  houseGroup.add(frontWallRight);

  const lintelHeight = wallHeight - doorHeight;
  const lintel = HouseBlocks.createExteriorWall(doorWidth, lintelHeight, wallThickness);
  lintel.position.set(0, foundationThickness / 2 + doorHeight + lintelHeight / 2, houseDepth / 2 - wallThickness / 2);
  houseGroup.add(lintel);

  const roofGroup = HouseBlocks.createRoofGable(houseWidth + 0.5, 1.2, houseDepth + 0.5);
  roofGroup.position.y = wallHeight + foundationThickness / 2;
  houseGroup.add(roofGroup);

  houseGroup.traverse((child) => {
    if(child.isMesh) {
        child.userData.isBarrier = true;
        child.castShadow = true;
        child.receiveShadow = true;
    }
  });

  return houseGroup;
}