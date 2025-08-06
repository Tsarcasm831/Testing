import * as THREE from 'three';
import { ENABLE_SEATING_STAIRS, SEATING_STAIRS_COLLISION_ENABLED } from './amphi-seat-config.js';

export function createStairsToSeats(group, options) {
    if (!ENABLE_SEATING_STAIRS) return;

    const { startRadius, rowHeight, material } = options;
    const stairsGroup = new THREE.Group();

    /* @tweakable The number of steps for the amphitheater seating stairs. */
    const stairCount = 10;
    /* @tweakable The width of the amphitheater seating stairs. */
    const stairWidth = 8;
    /* @tweakable The total depth of the amphitheater seating staircase. */
    const totalStairDepth = 8;

    const stairHeight = rowHeight / stairCount;
    const stairDepth = totalStairDepth / stairCount;

    for (let i = 0; i < stairCount; i++) {
        const stepGeo = new THREE.BoxGeometry(stairWidth, stairHeight, stairDepth);
        const step = new THREE.Mesh(stepGeo, material);
        step.position.set(
            0,
            i * stairHeight + stairHeight / 2,
            -startRadius + totalStairDepth / 2 - i * stairDepth - stairDepth / 2
        );

        step.castShadow = true;
        step.receiveShadow = true;
        step.userData.isBarrier = SEATING_STAIRS_COLLISION_ENABLED;
        step.userData.isStair = SEATING_STAIRS_COLLISION_ENABLED;
        stairsGroup.add(step);
    }

    group.add(stairsGroup);
}
