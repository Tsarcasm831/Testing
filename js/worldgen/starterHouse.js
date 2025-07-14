import * as THREE from 'three';
import './HouseBlocks.js';

export function createStarterHouse(scene, getHeight) {
  const housePosition = new THREE.Vector3(15, 0, 15);
  const houseY = getHeight(housePosition.x, housePosition.z);
  housePosition.y = houseY;

  const houseWidth = 5;
  const houseDepth = 6;
  const wallHeight = 2.5;
  const doorWidth = 1.2;
  const doorHeight = 2.0;
  const wallThickness = 0.15;

  const addPart = (mesh) => {
    mesh.position.add(housePosition);
    mesh.userData.isBarrier = true;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
  };

  const foundation = createFoundationSlab(houseWidth, houseDepth, 0.2);
  addPart(foundation);

  const backWall = createExteriorWall(houseWidth, wallHeight, wallThickness);
  backWall.position.set(0, wallHeight / 2, -houseDepth / 2 + wallThickness / 2);
  addPart(backWall);

  const leftWall = createExteriorWall(houseDepth, wallHeight, wallThickness);
  leftWall.rotation.y = Math.PI / 2;
  leftWall.position.set(-houseWidth / 2 + wallThickness / 2, wallHeight / 2, 0);
  addPart(leftWall);

  const rightWall = createExteriorWall(houseDepth, wallHeight, wallThickness);
  rightWall.rotation.y = Math.PI / 2;
  rightWall.position.set(houseWidth / 2 - wallThickness / 2, wallHeight / 2, 0);
  addPart(rightWall);

  const sideWallWidth = (houseWidth - doorWidth) / 2;

  const frontWallLeft = createExteriorWall(sideWallWidth, wallHeight, wallThickness);
  frontWallLeft.position.set(-doorWidth / 2 - sideWallWidth / 2, wallHeight / 2, houseDepth / 2 - wallThickness / 2);
  addPart(frontWallLeft);

  const frontWallRight = createExteriorWall(sideWallWidth, wallHeight, wallThickness);
  frontWallRight.position.set(doorWidth / 2 + sideWallWidth / 2, wallHeight / 2, houseDepth / 2 - wallThickness / 2);
  addPart(frontWallRight);

  const lintelHeight = wallHeight - doorHeight;
  const lintel = createExteriorWall(doorWidth, lintelHeight, wallThickness);
  lintel.position.set(0, doorHeight + lintelHeight / 2, houseDepth / 2 - wallThickness / 2);
  addPart(lintel);

  const roofGroup = createRoofGable(houseWidth + 0.5, 1.2, houseDepth + 0.5);
  roofGroup.position.y = wallHeight;
  roofGroup.position.add(housePosition);
  roofGroup.updateWorldMatrix(true, true);

  const roofMeshes = [];
  roofGroup.traverse((child) => {
    if (child.isMesh) {
      roofMeshes.push(child);
    }
  });

  roofMeshes.forEach((mesh) => {
    scene.attach(mesh);
    mesh.userData.isBarrier = true;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
  });
}
