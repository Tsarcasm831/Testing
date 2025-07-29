import * as THREE from 'three';

/**
 * Creates a palm tree.
 * @param {MathRandom} rng - The random number generator.
 * @returns {THREE.Group} A group containing the tree.
 */
export function createPalmTree(rng) {
    const tree = new THREE.Group();
    const palmTrunkMaterial = new THREE.MeshStandardMaterial({ color: 0xAC8B67, roughness: 0.9, metalness: 0.1 });
    const palmLeavesMaterial = new THREE.MeshStandardMaterial({ color: 0x2E8B57, roughness: 0.8, metalness: 0.0, side: THREE.DoubleSide });

    const baseTrunkHeight = 8;
    const randTrunkHeight = 4;
    const trunkHeight = baseTrunkHeight + rng.random() * randTrunkHeight;
    const baseTrunkRadius = 0.2;
    const randTrunkRadius = 0.1;
    const trunkRadius = baseTrunkRadius + rng.random() * randTrunkRadius;

    const trunkGeometry = new THREE.CylinderGeometry(trunkRadius * 0.8, trunkRadius, trunkHeight, 8);
    trunkGeometry.translate(0, trunkHeight / 2, 0);

    for (let j = 0; j < trunkGeometry.attributes.position.count; j++) {
        const y = trunkGeometry.attributes.position.getY(j);
        const bendFactor = Math.sin((y / trunkHeight) * Math.PI / 2);
        const bendAmountMultiplier = 2;
        const bendAmount = bendFactor * trunkRadius * bendAmountMultiplier;
        trunkGeometry.attributes.position.setX(j, trunkGeometry.attributes.position.getX(j) + bendAmount);
    }

    const trunk = new THREE.Mesh(trunkGeometry, palmTrunkMaterial);
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    tree.add(trunk);

    const minLeaves = 6;
    const randLeaves = 4;
    const numLeaves = minLeaves + Math.floor(rng.random() * randLeaves);
    const baseLeafLength = 3;
    const randLeafLength = 2;
    const palmLeafLength = baseLeafLength + rng.random() * randLeafLength;
    const baseLeafWidth = 0.5;
    const randLeafWidth = 0.3;
    const palmLeafWidth = baseLeafWidth + rng.random() * randLeafWidth;

    for(let i = 0; i < numLeaves; i++) {
        const leafGeom = new THREE.BoxGeometry(palmLeafLength, 0.05, palmLeafWidth);
        leafGeom.translate(palmLeafLength / 2, 0, 0);
        const leaf = new THREE.Mesh(leafGeom, palmLeavesMaterial);

        const angle = (i / numLeaves) * Math.PI * 2 + rng.random() * 0.2;
        const tilt = -Math.PI / 3 - rng.random() * Math.PI / 4;

        leaf.rotation.y = angle;
        leaf.rotation.z = tilt;

        leaf.position.y = trunkHeight - 0.5;

        leaf.castShadow = true;
        tree.add(leaf);
    }

    return tree;
}
