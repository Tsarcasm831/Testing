import * as THREE from 'three';

/**
 * Creates a pine tree, with an option for snow.
 * @param {MathRandom} rng - The random number generator.
 * @param {boolean} snowy - Whether the tree should have snow.
 * @returns {THREE.Group} A group containing the tree.
 */
export function createPineTree(rng, snowy = false) {
    const tree = new THREE.Group();
    const pineTrunkMaterial = new THREE.MeshStandardMaterial({ color: 0x694E33, roughness: 0.9, metalness: 0.1 });
    const pineLeavesMaterial = new THREE.MeshStandardMaterial({ color: 0x1A472A, roughness: 0.8, metalness: 0.0 });
    const snowMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFAFA, roughness: 0.9, metalness: 0.0 });

    const baseTrunkHeight = 6;
    const randTrunkHeight = 8;
    const trunkHeight = baseTrunkHeight + rng.random() * randTrunkHeight;
    const baseTrunkRadius = 0.3;
    const randTrunkRadius = 0.2;
    const trunkRadius = baseTrunkRadius + rng.random() * randTrunkRadius;

    const trunkGeometry = new THREE.CylinderGeometry(trunkRadius * 0.5, trunkRadius, trunkHeight, 8);
    trunkGeometry.translate(0, trunkHeight / 2, 0);
    const trunk = new THREE.Mesh(trunkGeometry, pineTrunkMaterial);
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    tree.add(trunk);

    const minLeafLayers = 4;
    const randLeafLayers = 3;
    const numLeafLayers = minLeafLayers + Math.floor(rng.random() * randLeafLayers);
    const baseFoliageRadius = 2.5 + rng.random();
    const foliageLayerHeight = 2 + rng.random();

    for(let i = 0; i < numLeafLayers; i++) {
        const layerRatio = (numLeafLayers - i) / numLeafLayers;
        const radius = baseFoliageRadius * layerRatio * (1 + (rng.random() - 0.5) * 0.2);
        const y = trunkHeight * 0.2 + i * (trunkHeight * 0.8 / numLeafLayers);

        const foliageGeom = new THREE.ConeGeometry(radius, foliageLayerHeight, 8);
        const foliage = new THREE.Mesh(foliageGeom, pineLeavesMaterial);
        foliage.position.y = y;
        foliage.castShadow = true;
        tree.add(foliage);

        if (snowy) {
            const snowCoverage = 0.5 + rng.random() * 0.5;
            if (rng.random() < snowCoverage) {
                const snowGeom = new THREE.ConeGeometry(radius * 0.95, foliageLayerHeight, 8);
                const snow = new THREE.Mesh(snowGeom, snowMaterial);
                snow.position.y = y + 0.2 * foliageLayerHeight;
                tree.add(snow);
            }
        }
    }

    return tree;
}
