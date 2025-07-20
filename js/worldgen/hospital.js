import * as THREE from 'three';

/**
 * Creates a hospital building.
 * @param {THREE.Scene} scene The main scene.
 * @param {function(number, number): number} getHeight A function to get terrain height at a given x, z.
 * @returns {THREE.Group} The hospital group object.
 */
export function createHospital(scene, getHeight) {
    /* @tweakable The position of the hospital. */
    const hospitalPosition = new THREE.Vector3(30, 0, 30);
    const hospitalY = getHeight(hospitalPosition.x, hospitalPosition.z);
    hospitalPosition.y = hospitalY;

    const hospitalGroup = new THREE.Group();
    hospitalGroup.position.copy(hospitalPosition);
    scene.add(hospitalGroup);

    /* @tweakable The main color of the hospital walls. */
    const wallColor = 0xf5f5f5;
    /* @tweakable The color of the red cross symbol. */
    const crossColor = 0xff0000;
    /* @tweakable The color of the hospital roof. */
    const roofColor = 0x777777;

    /* @tweakable The width of the hospital building. */
    const buildingWidth = 20;
    /* @tweakable The height of the hospital building. */
    const buildingHeight = 8;
    /* @tweakable The depth of the hospital building. */
    const buildingDepth = 15;
    /* @tweakable The width of the hospital door. */
    const doorWidth = 3;
    /* @tweakable The height of the hospital door. */
    const doorHeight = 4;
    /* @tweakable The thickness of the hospital walls. */
    const wallThickness = 0.5;

    const buildingMat = new THREE.MeshStandardMaterial({ color: wallColor, roughness: 0.9 });
    
    // Foundation
    const foundationGeo = new THREE.BoxGeometry(buildingWidth, wallThickness, buildingDepth);
    const foundationMat = new THREE.MeshStandardMaterial({color: 0x7a7a7a});
    const foundation = new THREE.Mesh(foundationGeo, foundationMat);
    foundation.position.y = wallThickness / 2;
    hospitalGroup.add(foundation);

    const wallY = buildingHeight / 2 + wallThickness;

    // Back wall
    const backWallGeo = new THREE.BoxGeometry(buildingWidth, buildingHeight, wallThickness);
    const backWall = new THREE.Mesh(backWallGeo, buildingMat);
    backWall.position.set(0, wallY, -buildingDepth / 2 + wallThickness / 2);
    hospitalGroup.add(backWall);

    // Side walls
    const sideWallGeo = new THREE.BoxGeometry(buildingDepth, buildingHeight, wallThickness);
    const leftWall = new THREE.Mesh(sideWallGeo, buildingMat);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-buildingWidth / 2 + wallThickness / 2, wallY, 0);
    hospitalGroup.add(leftWall);

    const rightWall = new THREE.Mesh(sideWallGeo.clone(), buildingMat);
    rightWall.rotation.y = Math.PI / 2;
    rightWall.position.set(buildingWidth / 2 - wallThickness / 2, wallY, 0);
    hospitalGroup.add(rightWall);

    // Front wall with doorway
    const frontWallSideWidth = (buildingWidth - doorWidth) / 2;
    const frontWallSideGeo = new THREE.BoxGeometry(frontWallSideWidth, buildingHeight, wallThickness);
    
    const leftFrontWall = new THREE.Mesh(frontWallSideGeo, buildingMat);
    leftFrontWall.position.set(-doorWidth / 2 - frontWallSideWidth / 2, wallY, buildingDepth / 2 - wallThickness / 2);
    hospitalGroup.add(leftFrontWall);

    const rightFrontWall = new THREE.Mesh(frontWallSideGeo.clone(), buildingMat);
    rightFrontWall.position.set(doorWidth / 2 + frontWallSideWidth / 2, wallY, buildingDepth / 2 - wallThickness / 2);
    hospitalGroup.add(rightFrontWall);

    // Lintel above door
    const lintelHeight = buildingHeight - doorHeight;
    const lintelGeo = new THREE.BoxGeometry(doorWidth, lintelHeight, wallThickness);
    const lintel = new THREE.Mesh(lintelGeo, buildingMat);
    lintel.position.set(0, doorHeight + lintelHeight / 2 + wallThickness, buildingDepth / 2 - wallThickness / 2);
    hospitalGroup.add(lintel);

    // Roof
    const roofGeo = new THREE.BoxGeometry(buildingWidth, wallThickness, buildingDepth);
    const roofMat = new THREE.MeshStandardMaterial({color: roofColor});
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = buildingHeight + wallThickness * 1.5;
    hospitalGroup.add(roof);

    // Red Cross Symbol
    /* @tweakable The size of the red cross symbol. */
    const crossSize = 2;
    /* @tweakable The thickness of the red cross symbol bars. */
    const crossThickness = 0.5;
    const crossMat = new THREE.MeshStandardMaterial({ color: crossColor, emissive: crossColor, emissiveIntensity: 0.2 });
    
    const verticalCrossGeo = new THREE.BoxGeometry(crossThickness, crossSize, crossThickness / 2);
    const horizontalCrossGeo = new THREE.BoxGeometry(crossSize, crossThickness, crossThickness / 2);

    // Cross on front wall (lintel)
    const frontCross = new THREE.Group();
    const frontV = new THREE.Mesh(verticalCrossGeo, crossMat);
    const frontH = new THREE.Mesh(horizontalCrossGeo, crossMat);
    frontCross.add(frontV, frontH);
    frontCross.position.set(0, doorHeight + lintelHeight / 2 + wallThickness, buildingDepth / 2 - wallThickness / 2 + 0.01);
    hospitalGroup.add(frontCross);

    hospitalGroup.traverse((child) => {
        if (child.isMesh) {
            child.userData.isBarrier = true;
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    return hospitalGroup;
}