import * as THREE from 'three';

/**
 * Creates a default deciduous/forest tree.
 * @param {MathRandom} rng - The random number generator.
 * @param {object} materials - Object containing trunk and leaves materials arrays.
 * @returns {THREE.Group} A group containing the tree.
 */
export function createForestTree(rng, materials) {
    const tree = new THREE.Group();
    const trunkMaterial = materials.trunk[Math.floor(rng.random() * materials.trunk.length)];
    const leavesMaterial = materials.leaves[Math.floor(rng.random() * materials.leaves.length)];

    const MIN_TRUNK_HEIGHT = 5;
    const RAND_TRUNK_HEIGHT = 7;
    const BASE_TRUNK_RADIUS = 0.3;
    const RAND_TRUNK_RADIUS = 0.3;
    const TRUNK_SEGMENTS = 12;
    const TRUNK_TAPER = 0.8;
    const MIN_BRANCHES = 3;
    const RAND_BRANCHES = 4;
    const LEAF_CLUSTER_RADIUS = 1.8;
    const LEAF_CLUSTER_SEGMENTS = 5;
    const MAX_BRANCH_DEPTH = 3;
    const BRANCH_SHRINK_FACTOR = 0.7;
    const BRANCH_ANGLE_Y = Math.PI / 3;
    const BRANCH_ANGLE_XZ = Math.PI * 2;
    const TRUNK_BEND_AMOUNT = 0.5;

    const trunkHeight = MIN_TRUNK_HEIGHT + rng.random() * RAND_TRUNK_HEIGHT;
    const trunkRadius = BASE_TRUNK_RADIUS + rng.random() * RAND_TRUNK_RADIUS;

    const trunkGeometry = new THREE.CylinderGeometry(trunkRadius * TRUNK_TAPER, trunkRadius, trunkHeight, TRUNK_SEGMENTS);
    trunkGeometry.translate(0, trunkHeight / 2, 0);

    for (let j = 0; j < trunkGeometry.attributes.position.count; j++) {
        const y = trunkGeometry.attributes.position.getY(j);
        const bendFactor = y / trunkHeight;
        const bendAmount = Math.sin(bendFactor * Math.PI) * trunkRadius * TRUNK_BEND_AMOUNT;
        trunkGeometry.attributes.position.setX(j, trunkGeometry.attributes.position.getX(j) + bendAmount);
    }

    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    tree.add(trunk);

    function createBranch(parent, position, radius, length, depth, trunkMat, leafMat) {
        if (depth > MAX_BRANCH_DEPTH) return;

        const branchGeometry = new THREE.CylinderGeometry(radius * TRUNK_TAPER, radius, length, Math.max(4, TRUNK_SEGMENTS - depth * 2));
        branchGeometry.translate(0, length / 2, 0);
        const branch = new THREE.Mesh(branchGeometry, trunkMat);
        branch.position.copy(position);

        const randomYAngle = (rng.random() - 0.2) * BRANCH_ANGLE_Y;
        const randomXZAngle = rng.random() * BRANCH_ANGLE_XZ;
        branch.rotation.set(Math.cos(randomXZAngle) * randomYAngle, rng.random() * Math.PI, Math.sin(randomXZAngle) * randomYAngle);

        parent.add(branch);

        const endPosition = new THREE.Vector3(0, length, 0);
        endPosition.applyQuaternion(branch.quaternion).add(branch.position);

        if (depth === MAX_BRANCH_DEPTH || rng.random() < 0.3) {
            const leafClusterGeometry = new THREE.IcosahedronGeometry(LEAF_CLUSTER_RADIUS, LEAF_CLUSTER_SEGMENTS - depth);
            const leafCluster = new THREE.Mesh(leafClusterGeometry, leafMat);
            leafCluster.position.copy(endPosition);
            leafCluster.castShadow = true;
            parent.add(leafCluster);
        } else {
            const subBranches = 1 + Math.floor(rng.random() * 2);
            for (let k = 0; k < subBranches; k++) {
                createBranch(parent, endPosition, radius * BRANCH_SHRINK_FACTOR, length * BRANCH_SHRINK_FACTOR, depth + 1, trunkMat, leafMat);
            }
        }
    }

    const numBranches = MIN_BRANCHES + Math.floor(rng.random() * RAND_BRANCHES);
    for (let j = 0; j < numBranches; j++) {
        const startHeight = trunkHeight * 0.4 + rng.random() * (trunkHeight * 0.6);
        createBranch(tree, new THREE.Vector3(0, startHeight, 0), trunkRadius * 0.8, trunkHeight * 0.4, 0, trunkMaterial, leavesMaterial);
    }

    return tree;
}
