import * as THREE from 'three';

/**
 * Creates a sparse, bare tree.
 * @param {MathRandom} rng - The random number generator.
 * @returns {THREE.Group} A group containing the tree.
 */
export function createSparseTree(rng) {
    const tree = new THREE.Group();
    const sparseTrunkMaterial = new THREE.MeshStandardMaterial({ color: 0x5D5C61, roughness: 0.9, metalness: 0.1 });

    const baseTrunkHeight = 5;
    const randTrunkHeight = 5;
    const trunkHeight = baseTrunkHeight + rng.random() * randTrunkHeight;
    const baseTrunkRadius = 0.2;
    const randTrunkRadius = 0.2;
    const trunkRadius = baseTrunkRadius + rng.random() * randTrunkRadius;

    const trunkGeometry = new THREE.CylinderGeometry(trunkRadius * 0.7, trunkRadius, trunkHeight, 6);
    trunkGeometry.translate(0, trunkHeight / 2, 0);
    const trunk = new THREE.Mesh(trunkGeometry, sparseTrunkMaterial);
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    tree.add(trunk);

    const minBranches = 4;
    const randBranches = 5;
    const numBranches = minBranches + Math.floor(rng.random() * randBranches);
    const baseBranchLength = trunkHeight * 0.5;

    for (let i = 0; i < numBranches; i++) {
        const branchLength = baseBranchLength * (0.5 + rng.random() * 0.5);
        const branchRadius = trunkRadius * 0.4 * (1 - (i / numBranches));
        const branchGeometry = new THREE.CylinderGeometry(branchRadius * 0.5, branchRadius, branchLength, 5);
        branchGeometry.translate(0, branchLength / 2, 0);
        const branch = new THREE.Mesh(branchGeometry, sparseTrunkMaterial);

        branch.position.y = trunkHeight * 0.3 + rng.random() * (trunkHeight * 0.7);

        const randomYAngle = Math.PI / 3 + (rng.random() - 0.5) * Math.PI / 4;
        const randomXZAngle = rng.random() * Math.PI * 2;
        branch.rotation.set(Math.cos(randomXZAngle) * randomYAngle, rng.random() * Math.PI, Math.sin(randomXZAngle) * randomYAngle);

        branch.castShadow = true;
        tree.add(branch);
    }
    return tree;
}
