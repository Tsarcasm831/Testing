import * as THREE from 'three';

/* @tweakable Set to true to enable collision for the amphitheater stage platform. */
const STAGE_COLLISION_ENABLED = true;
/* @tweakable Set to true to enable collision for the stairs leading to the stage. */
const STAIRS_COLLISION_ENABLED = true;
/* @tweakable Set to true to enable collision for the foundation under the stage. When enabled, a simplified collision box is created to match the pink debug box. */
const FOUNDATION_COLLISION_ENABLED = true;
/* @tweakable The color of the stage platform. */
const stageColor = 0x4a2a0a;
/* @tweakable Set to true to show a visible outline box for debugging stage collision. */
const DEBUG_STAGE_COLLISION_BOX = false;
/* @tweakable The color of the debug collision box for the stage. */
const DEBUG_STAGE_COLLISION_BOX_COLOR = 0x00ffff;
/* @tweakable Set to true to show a visible outline box for debugging stair collision. */
const DEBUG_STAIR_COLLISION_BOX = false;
/* @tweakable The color of the debug collision box for the stairs. */
const DEBUG_STAIR_COLLISION_BOX_COLOR = 0x00ff00;
/* @tweakable Set to true to show a visible outline box for debugging the stage foundation. This box represents the actual collision shape. */
const DEBUG_FOUNDATION_COLLISION_BOX = false;
/* @tweakable The color of the debug collision box for the stage foundation. */
const DEBUG_FOUNDATION_COLLISION_BOX_COLOR = 0xff00ff;
/* @tweakable Set to true to make stairs ascend towards the stage, false to ascend away. */
const STAIRS_ASCEND_TOWARDS_STAGE = true;

export function createStage(dimensions) {
    const stageGroup = new THREE.Group();
    const stageMaterial = new THREE.MeshStandardMaterial({ color: stageColor, roughness: 0.8, metalness: 0.1 });
    const stageGeometry = new THREE.BoxGeometry(dimensions.width, dimensions.height, dimensions.depth);
    const stage = new THREE.Mesh(stageGeometry, stageMaterial);
    stage.position.y = dimensions.height / 2;
    stage.castShadow = true;
    stage.receiveShadow = true;
    if (STAGE_COLLISION_ENABLED) {
        stage.userData.isBarrier = true;
        /* @tweakable Marking the stage as a stair allows the player to step onto it smoothly without jumping. Adjust STEP_HEIGHT in collisionManager.js if players can't get on stage. */
        stage.userData.isStair = true;
    }
    stageGroup.add(stage);

    if (DEBUG_STAGE_COLLISION_BOX) {
        const stageHelper = new THREE.BoxHelper(stage, DEBUG_STAGE_COLLISION_BOX_COLOR);
        stageHelper.userData.isDebugBorder = true;
        stageHelper.visible = false;
        stageGroup.add(stageHelper);
    }

    /* @tweakable The height of the foundation under the stage. This affects both the visual mesh and its collision box. */
    const foundationHeight = 2.0;
    /* @tweakable The color of the stage foundation. */
    const foundationColor = 0x331a00;
    const foundationMaterial = new THREE.MeshStandardMaterial({ color: foundationColor, roughness: 0.9, metalness: 0.1 });
    
    /* @tweakable The inner radius of the curved front of the stage foundation. */
    const foundationInnerRadius = 18;
    /* @tweakable The angle of the curve for the stage foundation, in degrees. */
    const foundationAngle = 160;
    const angleRad = THREE.MathUtils.degToRad(foundationAngle);
    const startAngle = -angleRad / 2;
    const endAngle = angleRad / 2;

    const foundationShape = new THREE.Shape();
    foundationShape.moveTo(foundationInnerRadius * Math.cos(startAngle), foundationInnerRadius * Math.sin(startAngle));
    foundationShape.absarc(0, 0, foundationInnerRadius, startAngle, endAngle, false);
    foundationShape.lineTo(dimensions.width / 2, 0);
    foundationShape.lineTo(dimensions.width / 2, -dimensions.depth);
    foundationShape.lineTo(-dimensions.width / 2, -dimensions.depth);
    foundationShape.lineTo(-dimensions.width / 2, 0);
    foundationShape.lineTo(foundationInnerRadius * Math.cos(startAngle), foundationInnerRadius * Math.sin(startAngle));
    
    const extrudeSettings = {
        steps: 1,
        depth: foundationHeight,
        bevelEnabled: false,
    };

    const foundationGeometry = new THREE.ExtrudeGeometry(foundationShape, extrudeSettings);
    foundationGeometry.translate(0, 0, -foundationHeight);
    foundationGeometry.rotateX(-Math.PI / 2);

    const foundation = new THREE.Mesh(foundationGeometry, foundationMaterial);
    foundation.position.y = 0;
    foundation.castShadow = true;
    foundation.receiveShadow = true;
    stageGroup.add(foundation);
    
    // Create segmented collision boxes for the curved part.
    if (FOUNDATION_COLLISION_ENABLED) {
        /* @tweakable The number of segments used for the curved part of the stage foundation collision. More segments improve accuracy but may reduce performance. */
        const foundationCollisionSegments = 16;
        const segmentAngleStep = angleRad / foundationCollisionSegments;
        /* @tweakable The thickness of the collision segments for the curved foundation. This should approximate the depth of the foundation. */
        const segmentDepth = 1.0; 

        for (let j = 0; j < foundationCollisionSegments; j++) {
            const currentAngle = startAngle + (j + 0.5) * segmentAngleStep;
            const segmentWidth = segmentAngleStep * foundationInnerRadius;

            const x = (foundationInnerRadius - segmentDepth / 2) * Math.cos(currentAngle);
            const z = (foundationInnerRadius - segmentDepth / 2) * Math.sin(currentAngle);

            const collisionGeo = new THREE.BoxGeometry(segmentWidth, foundationHeight, segmentDepth);
            const collisionMesh = new THREE.Mesh(collisionGeo, new THREE.MeshBasicMaterial({ visible: false, wireframe: true, color: DEBUG_FOUNDATION_COLLISION_BOX_COLOR, transparent: true, opacity: 0.5 }));
            collisionMesh.position.set(x, -foundationHeight / 2, z);
            collisionMesh.lookAt(0, -foundationHeight/2, 0);
            collisionMesh.userData.isBarrier = true;
            if(DEBUG_FOUNDATION_COLLISION_BOX){
                collisionMesh.userData.isDebugBorder = true;
                collisionMesh.visible = false;
            }
            stageGroup.add(collisionMesh);
        }

        // Add box colliders for the rectangular parts of the foundation.
        const backPartDepth = dimensions.depth;
        const backCollisionGeo = new THREE.BoxGeometry(dimensions.width, foundationHeight, backPartDepth);
        const backCollisionMesh = new THREE.Mesh(backCollisionGeo, new THREE.MeshBasicMaterial({ visible: false, wireframe: true, color: DEBUG_FOUNDATION_COLLISION_BOX_COLOR }));
        backCollisionMesh.position.set(0, -foundationHeight / 2, -backPartDepth / 2);
        backCollisionMesh.userData.isBarrier = true;
         if(DEBUG_FOUNDATION_COLLISION_BOX){
                backCollisionMesh.userData.isDebugBorder = true;
                backCollisionMesh.visible = false;
        }
        stageGroup.add(backCollisionMesh);
    }

    // Add stairs
    /* @tweakable The rotation of the stairs in degrees around the Y axis. */
    const stairRotationY = 0;
    const stairsGroup = new THREE.Group();
    stairsGroup.rotation.y = THREE.MathUtils.degToRad(stairRotationY);
    stageGroup.add(stairsGroup);

    /* @tweakable The number of stairs leading to the stage. */
    const stairCount = 6;
    const stairHeight = dimensions.height / stairCount;
    /* @tweakable The depth of each individual stair step. */
    const stairDepth = 0.4;
    /* @tweakable The width of the stair steps, as a factor of stage width. */
    const stairWidthFactor = 0.7;
    const stairWidth = dimensions.width * stairWidthFactor;

    // Build stairs from bottom to top
    for (let i = 0; i < stairCount; i++) {
        const stepGeometry = new THREE.BoxGeometry(stairWidth, stairHeight, stairDepth);
        const stair = new THREE.Mesh(stepGeometry, stageMaterial);

        // Position each step on top of the previous one
        const zOffset = STAIRS_ASCEND_TOWARDS_STAGE ? (stairCount - 1 - i) * stairDepth : i * stairDepth;
        stair.position.set(
            0,
            i * stairHeight + stairHeight / 2,
            -dimensions.depth / 2 - stairDepth / 2 - zOffset
        );

        stair.castShadow = true;
        stair.receiveShadow = true;
        if (STAIRS_COLLISION_ENABLED) {
            stair.userData.isBarrier = true;
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