import * as THREE from 'three';

/* @tweakable Set to false to disable collision for the microphone stand on the stage. */
const MIC_STAND_COLLISION_ENABLED = false;
/* @tweakable Set to true to show a visible outline box for debugging microphone collision. */
const DEBUG_MIC_COLLISION_BOX = false;
/* @tweakable The color of the debug collision box for the microphone. */
const DEBUG_MIC_COLLISION_BOX_COLOR = 0xff0000;

export function createMicrophoneStand() {
    const standGroup = new THREE.Group();

    /* @tweakable The color of the microphone stand. */
    const standColor = 0x333333;
    /* @tweakable The color of the microphone head. */
    const micColor = 0x111111;

    const standMaterial = new THREE.MeshStandardMaterial({ color: standColor, roughness: 0.4, metalness: 0.8 });
    const micMaterial = new THREE.MeshStandardMaterial({ color: micColor, roughness: 0.6, metalness: 0.2 });

    // Base
    /* @tweakable The radius of the microphone stand base. */
    const baseRadius = 0.3;
    /* @tweakable The height of the microphone stand base. */
    const baseHeight = 0.05;
    const baseGeometry = new THREE.CylinderGeometry(baseRadius, baseRadius, baseHeight, 16);
    const base = new THREE.Mesh(baseGeometry, standMaterial);
    base.position.y = baseHeight / 2;
    standGroup.add(base);
    if (DEBUG_MIC_COLLISION_BOX) {
        const micHelper = new THREE.BoxHelper(base, DEBUG_MIC_COLLISION_BOX_COLOR);
        micHelper.userData.isDebugBorder = true;
        micHelper.visible = false;
        standGroup.add(micHelper);
    }

    // Pole
    /* @tweakable The height of the microphone stand pole. */
    const poleHeight = 1.5;
    /* @tweakable The radius of the microphone stand pole. */
    const poleRadius = 0.02;
    const poleGeometry = new THREE.CylinderGeometry(poleRadius, poleRadius, poleHeight, 8);
    const pole = new THREE.Mesh(poleGeometry, standMaterial);
    pole.position.y = baseHeight + poleHeight / 2;
    standGroup.add(pole);
    if (DEBUG_MIC_COLLISION_BOX) {
        const poleHelper = new THREE.BoxHelper(pole, DEBUG_MIC_COLLISION_BOX_COLOR);
        poleHelper.userData.isDebugBorder = true;
        poleHelper.visible = false;
        standGroup.add(poleHelper);
    }

    // Mic head
    /* @tweakable The size of the microphone head. */
    const micHeadRadius = 0.08;
    const micHeadGeometry = new THREE.SphereGeometry(micHeadRadius, 16, 16);
    const micHead = new THREE.Mesh(micHeadGeometry, micMaterial);
    micHead.position.y = baseHeight + poleHeight + micHeadRadius * 0.8;
    standGroup.add(micHead);
    if (DEBUG_MIC_COLLISION_BOX) {
        const micHeadHelper = new THREE.BoxHelper(micHead, DEBUG_MIC_COLLISION_BOX_COLOR);
        micHeadHelper.userData.isDebugBorder = true;
        micHeadHelper.visible = false;
        standGroup.add(micHeadHelper);
    }

    standGroup.traverse(child => {
        if (child.isMesh) {
            child.castShadow = true;
            // Explicitly set collidable status based on the tweakable constant
            child.userData.isBarrier = MIC_STAND_COLLISION_ENABLED;
            /* @tweakable When collision is disabled, setting this to false prevents the collision manager from checking it at all. */
            child.userData.isCollidable = MIC_STAND_COLLISION_ENABLED;
        }
    });

    return standGroup;
}