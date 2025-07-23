import * as THREE from 'three';

/* @tweakable The material ID for the house foundation from mats.json. */
const foundationMaterialID = 'struct_concrete';
/* @tweakable The material ID for the house walls from mats.json. */
const wallMaterialID = 'siding_wood';
/* @tweakable The material ID for the house roof from mats.json. */
const roofMaterialID = 'roof_asphalt';
/* @tweakable Texture repetitions for house walls. [horizontal, vertical] */
const wallTextureRepeat = [4, 2];
/* @tweakable Texture repetitions for house roof. [horizontal, vertical] */
const roofTextureRepeat = [4, 4];
/* @tweakable Texture repetitions for house foundation. [horizontal, vertical] */
const foundationTextureRepeat = [4, 4];

function findMaterial(materialID, matsData) {
    for (const category of matsData.materials) {
        const item = category.items.find(i => i.materialID === materialID);
        if (item) return item;
    }
    return null;
}

const textureLoader = new THREE.TextureLoader();

function createPBRMaterial(matInfo, repeatU, repeatV) {
    if (!matInfo) return new THREE.MeshStandardMaterial({ color: 0xcccccc });

    const textureDir = matInfo.textureDir;
    
    const props = {
        map: textureLoader.load(`${textureDir}albedo.png`),
        normalMap: textureLoader.load(`${textureDir}normal.png`),
        roughnessMap: textureLoader.load(`${textureDir}roughness.png`),
        aoMap: textureLoader.load(`${textureDir}ao.png`),
    };
    
    for (const tex of Object.values(props)) {
        if (tex) {
            tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
            tex.repeat.set(repeatU, repeatV);
        }
    }
    
    return new THREE.MeshStandardMaterial(props);
}

/* =========================================================================
 *  HouseBlocks.js ― a building-blocks kit for houses
 * ------------------------------------------------------------------------- */
const HouseBlocks = (() => {
  function createBox(
    w = 1, h = 1, d = 1,
    material,
  ) {
    const geo = new THREE.BoxGeometry(w, h, d);
    return new THREE.Mesh(geo, material);
  }

  function createFoundationSlab(w = 4, d = 4, t = 0.2, material) {
    return createBox(w, t, d, material);
  }

  function createExteriorWall(width, height, thickness = 0.12, material) {
    return createBox(width, height, thickness, material);
  }

  function createRoofGable(span = 4, pitch = 0.4, depth = 4, material) {
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


export function createStarterHouse(scene, getHeight, matsData) {
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

  const foundationMatInfo = findMaterial(foundationMaterialID, matsData);
  const wallMatInfo = findMaterial(wallMaterialID, matsData);
  const roofMatInfo = findMaterial(roofMaterialID, matsData);

  const foundationMaterial = createPBRMaterial(foundationMatInfo, foundationTextureRepeat[0], foundationTextureRepeat[1]);
  const wallMaterial = createPBRMaterial(wallMatInfo, wallTextureRepeat[0], wallTextureRepeat[1]);
  const roofMaterial = createPBRMaterial(roofMatInfo, roofTextureRepeat[0], roofTextureRepeat[1]);

  const houseGroup = new THREE.Group();
  houseGroup.position.copy(housePosition);
  scene.add(houseGroup);

  const foundation = HouseBlocks.createFoundationSlab(houseWidth, houseDepth, foundationThickness, foundationMaterial);
  houseGroup.add(foundation);
  foundation.userData.isBarrier = true;
  foundation.castShadow = true;
  foundation.receiveShadow = true;

  // The y-position for the center of the walls. They sit on top of the foundation.
  const wallY = foundationThickness / 2 + wallHeight / 2;

  const backWall = HouseBlocks.createExteriorWall(houseWidth, wallHeight, wallThickness, wallMaterial);
  backWall.position.set(0, wallY, -houseDepth / 2 + wallThickness / 2);
  houseGroup.add(backWall);

  const leftWall = HouseBlocks.createExteriorWall(houseDepth, wallHeight, wallThickness, wallMaterial);
  leftWall.rotation.y = Math.PI / 2;
  leftWall.position.set(-houseWidth / 2 + wallThickness / 2, wallY, 0);
  houseGroup.add(leftWall);

  const rightWall = HouseBlocks.createExteriorWall(houseDepth, wallHeight, wallThickness, wallMaterial);
  rightWall.rotation.y = Math.PI / 2;
  rightWall.position.set(houseWidth / 2 - wallThickness / 2, wallY, 0);
  houseGroup.add(rightWall);

  const sideWallWidth = (houseWidth - doorWidth) / 2;

  const frontWallLeft = HouseBlocks.createExteriorWall(sideWallWidth, wallHeight, wallThickness, wallMaterial);
  frontWallLeft.position.set(-doorWidth / 2 - sideWallWidth / 2, wallY, houseDepth / 2 - wallThickness / 2);
  houseGroup.add(frontWallLeft);

  const frontWallRight = HouseBlocks.createExteriorWall(sideWallWidth, wallHeight, wallThickness, wallMaterial);
  frontWallRight.position.set(doorWidth / 2 + sideWallWidth / 2, wallY, houseDepth / 2 - wallThickness / 2);
  houseGroup.add(frontWallRight);

  const lintelHeight = wallHeight - doorHeight;
  const lintel = HouseBlocks.createExteriorWall(doorWidth, lintelHeight, wallThickness, wallMaterial);
  lintel.position.set(0, foundationThickness / 2 + doorHeight + lintelHeight / 2, houseDepth / 2 - wallThickness / 2);
  houseGroup.add(lintel);

  const roofGroup = HouseBlocks.createRoofGable(houseWidth + 0.5, 1.2, houseDepth + 0.5, roofMaterial);
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