import * as THREE from 'three';

/* @tweakable Set to true to enable collision for the amphitheater stage, stairs, and foundation. */
const AMPHITHEATRE_COLLISION_ENABLED = false;
/* @tweakable The color of the stage platform. */
const stageColor = 0x4a2a0a;
/* @tweakable Set to true to show a visible outline box for debugging stage collision. */
const DEBUG_STAGE_COLLISION_BOX = true;
/* @tweakable The color of the debug collision box for the stage. */
const DEBUG_STAGE_COLLISION_BOX_COLOR = 0x00ffff;
/* @tweakable Set to true to show a visible outline box for debugging stair collision. */
const DEBUG_STAIR_COLLISION_BOX = true;
/* @tweakable The color of the debug collision box for the stairs. */
const DEBUG_STAIR_COLLISION_BOX_COLOR = 0x00ff00;
/* @tweakable Set to true to show a visible outline box for debugging the stage foundation. */
const DEBUG_FOUNDATION_COLLISION_BOX = true;
/* @tweakable The color of the debug collision box for the stage foundation. */
const DEBUG_FOUNDATION_COLLISION_BOX_COLOR = 0xff00ff;

export function createStage(dimensions) {
    const stageGroup = new THREE.Group();
    const stageMaterial = new THREE.MeshStandardMaterial({ color: stageColor, roughness: 0.8, metalness: 0.1 });
    const stageGeometry = new THREE.BoxGeometry(dimensions.width, dimensions.height, dimensions.depth);
    const stage = new THREE.Mesh(stageGeometry, stageMaterial);
    stage.position.y = dimensions.height / 2;
    stage.castShadow = true;
    stage.receiveShadow = true;
    if (AMPHITHEATRE_COLLISION_ENABLED) {
        stage.userData.isBlock = true;
    }
    stageGroup.add(stage);

    if (DEBUG_STAGE_COLLISION_BOX) {
        const stageHelper = new THREE.BoxHelper(stage, DEBUG_STAGE_COLLISION_BOX_COLOR);
        stageHelper.userData.isDebugBorder = true;
        stageHelper.visible = false;
        stageGroup.add(stageHelper);
    }

    /* @tweakable The height of the foundation under the stage. */
    const foundationHeight = 2.0;
    /* @tweakable The color of the stage foundation. */
    const foundationColor = 0x331a00;
    const foundationMaterial = new THREE.MeshStandardMaterial({ color: foundationColor, roughness: 0.9, metalness: 0.1 });
    const foundationGeometry = new THREE.BoxGeometry(dimensions.width, foundationHeight, dimensions.depth);
    const foundation = new THREE.Mesh(foundationGeometry, foundationMaterial);
    foundation.position.y = -foundationHeight / 2;
    foundation.castShadow = true;
    foundation.receiveShadow = true;
    stageGroup.add(foundation);
    if (DEBUG_FOUNDATION_COLLISION_BOX) {
        const foundationHelper = new THREE.BoxHelper(foundation, DEBUG_FOUNDATION_COLLISION_BOX_COLOR);
        foundationHelper.userData.isDebugBorder = true;
        foundationHelper.visible = false;
        stageGroup.add(foundationHelper);
    }

    // Add stairs
    /* @tweakable The rotation of the stairs in degrees around the Y axis. */
    const stairRotationY = 0;
    const stairsGroup = new THREE.Group();
    stairsGroup.rotation.y = THREE.MathUtils.degToRad(stairRotationY);
    stageGroup.add(stairsGroup);

    /* @tweakable The number of stairs leading to the stage. */
    const stairCount = 4;
    const stairHeight = dimensions.height / stairCount;
    /* @tweakable The depth of each stair step. */
    const stairDepth = 0.5;
    /* @tweakable The starting Z position of the stairs relative to the stage's front edge. */
    const stairStartZ = -dimensions.depth / 2 - stairDepth / 2;

    for (let i = 0; i < stairCount; i++) {
        /* @tweakable The width of the stairs, which get narrower closer to the stage. */
        const stairWidth = dimensions.width * (0.4 - i * 0.05);
        const stairGeometry = new THREE.BoxGeometry(stairWidth, stairHeight, stairDepth);
        const stair = new THREE.Mesh(stairGeometry, stageMaterial);

        stair.position.set(
            0,
            i * stairHeight + stairHeight / 2,
            stairStartZ - (stairCount - 1 - i) * stairDepth
        );

        stair.castShadow = true;
        stair.receiveShadow = true;
        if (AMPHITHEATRE_COLLISION_ENABLED) {
            stair.userData.isBlock = true;
            stair.userData.isStair = true;
        }

        stairsGroup.add(stair);

        if (DEBUG_STAIR_COLLISION_BOX) {
            const stairHelper = new THREE.BoxHelper(stair, DEBUG_STAIR_COLLISION_BOX_COLOR);
            stairHelper.userData.isDebugBorder = true;
            stairHelper.visible = false;
            stairsGroup.add(stairHelper);
        }
    }
    return stageGroup;
}
