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
 * Creates a tavern building and adds it to the scene.
 * @param {THREE.Scene} scene The main scene.
 * @param {function(number, number): number} getHeight A function to get terrain height.
 * @returns {THREE.Group} The group object for the tavern.
 */
export function createTavern(scene, getHeight) {
  /* @tweakable The position of the tavern. */
  const tavernPosition = new THREE.Vector3(-1.25, 0, 81.25);
  const tavernY = getHeight(tavernPosition.x, tavernPosition.z);
  tavernPosition.y = tavernY;
  
  /* @tweakable The color of the tavern's walls. */
  const wallColor = 0x966F33; // Wood color
  /* @tweakable The color of the tavern's roof. */
  const roofColor = 0x5A4D41; // Dark slate color
  /* @tweakable The color of the tavern's foundation. */
  const foundationColor = 0x888888; // Stone color
  /* @tweakable The color of the tavern's chimney. */
  const chimneyColor = 0x665e56;

  /* @tweakable The width of the tavern building. */
  const tavernWidth = 15;
  /* @tweakable The depth of the tavern building. */
  const tavernDepth = 10;
  /* @tweakable The height of the tavern walls. */
  const wallHeight = 6;
  /* @tweakable The width of the tavern door. */
  const doorWidth = 2.0;
  /* @tweakable The height of the tavern door. */
  const doorHeight = 3.5;
  /* @tweakable The thickness of the tavern walls. */
  const wallThickness = 0.2;
  /* @tweakable The thickness of the tavern foundation. */
  const foundationThickness = 0.3;
  /* @tweakable The pitch of the tavern roof. */
  const roofPitch = 1.5;
  /* @tweakable The width of the tavern chimney. */
  const chimneyWidth = 1;
  /* @tweakable The height of the tavern chimney. */
  const chimneyHeight = 3;

  const tavernGroup = new THREE.Group();
  tavernGroup.position.copy(tavernPosition);
  scene.add(tavernGroup);

  const foundation = HouseBlocks.createFoundationSlab(tavernWidth, tavernDepth, foundationThickness, foundationColor);
  tavernGroup.add(foundation);

  const wallY = foundationThickness / 2 + wallHeight / 2;

  const backWall = HouseBlocks.createExteriorWall(tavernWidth, wallHeight, wallThickness, wallColor);
  backWall.position.set(0, wallY, -tavernDepth / 2 + wallThickness / 2);
  tavernGroup.add(backWall);

  const leftWall = HouseBlocks.createExteriorWall(tavernDepth, wallHeight, wallThickness, wallColor);
  leftWall.rotation.y = Math.PI / 2;
  leftWall.position.set(-tavernWidth / 2 + wallThickness / 2, wallY, 0);
  tavernGroup.add(leftWall);

  const rightWall = HouseBlocks.createExteriorWall(tavernDepth, wallHeight, wallThickness, wallColor);
  rightWall.rotation.y = Math.PI / 2;
  rightWall.position.set(tavernWidth / 2 - wallThickness / 2, wallY, 0);
  tavernGroup.add(rightWall);

  const sideWallWidth = (tavernWidth - doorWidth) / 2;

  const frontWallLeft = HouseBlocks.createExteriorWall(sideWallWidth, wallHeight, wallThickness, wallColor);
  frontWallLeft.position.set(-doorWidth / 2 - sideWallWidth / 2, wallY, tavernDepth / 2 - wallThickness / 2);
  tavernGroup.add(frontWallLeft);

  const frontWallRight = HouseBlocks.createExteriorWall(sideWallWidth, wallHeight, wallThickness, wallColor);
  frontWallRight.position.set(doorWidth / 2 + sideWallWidth / 2, wallY, tavernDepth / 2 - wallThickness / 2);
  tavernGroup.add(frontWallRight);

  const lintelHeight = wallHeight - doorHeight;
  const lintel = HouseBlocks.createExteriorWall(doorWidth, lintelHeight, wallThickness, wallColor);
  lintel.position.set(0, foundationThickness / 2 + doorHeight + lintelHeight / 2, tavernDepth / 2 - wallThickness / 2);
  tavernGroup.add(lintel);

  const roofGroup = HouseBlocks.createRoofGable(tavernWidth + 0.5, roofPitch, tavernDepth + 0.5, roofColor);
  roofGroup.position.y = wallHeight + foundationThickness / 2;
  tavernGroup.add(roofGroup);

  const chimneyMat = new THREE.MeshStandardMaterial({ color: chimneyColor });
  const chimneyGeo = new THREE.BoxGeometry(chimneyWidth, chimneyHeight, chimneyWidth);
  const chimney = new THREE.Mesh(chimneyGeo, chimneyMat);
  /* @tweakable The position of the chimney on the roof. */
  chimney.position.set(tavernWidth / 2 - 1.5, wallHeight + roofPitch / 2, -tavernDepth / 4);
  tavernGroup.add(chimney);

  tavernGroup.traverse((child) => {
    if (child.isMesh) {
        child.userData.isBarrier = true;
        child.castShadow = true;
        child.receiveShadow = true;
    }
  });

  return tavernGroup;
}