import * as THREE from 'three';

/**
 * A set of building blocks for creating simple houses.
 */
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

  function createFoundationSlab(w = 4, d = 4, t = 0.2, color = 0x7a7a7a) {
    return createBox(w, t, d, color);
  }

  function createExteriorWall(width, height, thickness = 0.12, color = 0xbfa27b) {
    return createBox(width, height, thickness, color);
  }

  function createRoofGable(span = 4, pitch = 0.4, depth = 4, color = 0x883333) {
    const group = new THREE.Group();
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
    
    geometry.center();
    roofMesh.position.y += pitch / 2;

    group.add(roofMesh);
    return group;
  }
  
  return {
      createFoundationSlab,
      createExteriorWall,
      createRoofGable,
  };
})();

/**
 * Creates a workshop building and adds it to the scene.
 * @param {THREE.Scene} scene The main scene.
 * @param {function(number, number): number} getHeight A function to get terrain height.
 * @returns {THREE.Group} The group object for the workshop.
 */
export function createWorkshop(scene, getHeight) {
  /* @tweakable The position of the workshop. */
  const workshopPosition = new THREE.Vector3(20.5, 0, -53.5);
  const workshopY = getHeight(workshopPosition.x, workshopPosition.z);
  workshopPosition.y = workshopY;
  
  /* @tweakable The color of the workshop's stone walls. */
  const wallColor = 0x888888;
  /* @tweakable The color of the workshop's wooden roof beams. */
  const roofColor = 0x5a4a3a;
  /* @tweakable The color of the workshop's foundation. */
  const foundationColor = 0x666666;
  /* @tweakable The color of the workshop's forge chimney. */
  const chimneyColor = 0x444444;

  /* @tweakable The width of the workshop building. */
  const workshopWidth = 18;
  /* @tweakable The depth of the workshop building. */
  const workshopDepth = 12;
  /* @tweakable The height of the workshop walls. */
  const wallHeight = 5;
  /* @tweakable The width of the large workshop door. */
  const doorWidth = 5;
  /* @tweakable The height of the large workshop door. */
  const doorHeight = 4;
  /* @tweakable The thickness of the workshop walls. */
  const wallThickness = 0.2;
  /* @tweakable The thickness of the foundation slab. */
  const foundationThickness = 0.3;
  /* @tweakable The pitch of the workshop roof. */
  const roofPitch = 1.2;
  /* @tweakable The width of the workshop chimney. */
  const chimneyWidth = 1.5;
  /* @tweakable The height of the workshop chimney. */
  const chimneyHeight = 4;

  const workshopGroup = new THREE.Group();
  workshopGroup.name = 'workshop';
  workshopGroup.position.copy(workshopPosition);
  scene.add(workshopGroup);

  const foundation = HouseBlocks.createFoundationSlab(workshopWidth, workshopDepth, foundationThickness, foundationColor);
  workshopGroup.add(foundation);

  const wallY = foundationThickness / 2 + wallHeight / 2;

  const backWall = HouseBlocks.createExteriorWall(workshopWidth, wallHeight, wallThickness, wallColor);
  backWall.position.set(0, wallY, -workshopDepth / 2 + wallThickness / 2);
  workshopGroup.add(backWall);

  const leftWall = HouseBlocks.createExteriorWall(workshopDepth, wallHeight, wallThickness, wallColor);
  leftWall.rotation.y = Math.PI / 2;
  leftWall.position.set(-workshopWidth / 2 + wallThickness / 2, wallY, 0);
  workshopGroup.add(leftWall);

  const rightWall = HouseBlocks.createExteriorWall(workshopDepth, wallHeight, wallThickness, wallColor);
  rightWall.rotation.y = Math.PI / 2;
  rightWall.position.set(workshopWidth / 2 - wallThickness / 2, wallY, 0);
  workshopGroup.add(rightWall);

  const sideWallWidth = (workshopWidth - doorWidth) / 2;

  const frontWallLeft = HouseBlocks.createExteriorWall(sideWallWidth, wallHeight, wallThickness, wallColor);
  frontWallLeft.position.set(-doorWidth / 2 - sideWallWidth / 2, wallY, workshopDepth / 2 - wallThickness / 2);
  workshopGroup.add(frontWallLeft);

  const frontWallRight = HouseBlocks.createExteriorWall(sideWallWidth, wallHeight, wallThickness, wallColor);
  frontWallRight.position.set(doorWidth / 2 + sideWallWidth / 2, wallY, workshopDepth / 2 - wallThickness / 2);
  workshopGroup.add(frontWallRight);

  const lintelHeight = wallHeight - doorHeight;
  const lintel = HouseBlocks.createExteriorWall(doorWidth, lintelHeight, wallThickness, wallColor);
  lintel.position.set(0, foundationThickness / 2 + doorHeight + lintelHeight / 2, workshopDepth / 2 - wallThickness / 2);
  workshopGroup.add(lintel);

  const roofGroup = HouseBlocks.createRoofGable(workshopWidth + 0.5, roofPitch, workshopDepth + 0.5, roofColor);
  roofGroup.position.y = wallHeight + foundationThickness / 2;
  workshopGroup.add(roofGroup);

  const chimneyMat = new THREE.MeshStandardMaterial({ color: chimneyColor });
  const chimneyGeo = new THREE.BoxGeometry(chimneyWidth, chimneyHeight, chimneyWidth);
  const chimney = new THREE.Mesh(chimneyGeo, chimneyMat);
  /* @tweakable The position of the chimney on the workshop roof. */
  chimney.position.set(workshopWidth / 4, wallHeight + roofPitch / 2, -workshopDepth / 4);
  workshopGroup.add(chimney);

  workshopGroup.traverse((child) => {
    if (child.isMesh) {
        child.userData.isBarrier = true;
        child.castShadow = true;
        child.receiveShadow = true;
    }
  });

  return workshopGroup;
}