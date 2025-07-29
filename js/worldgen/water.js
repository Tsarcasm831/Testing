import * as THREE from 'three';
import { Water } from 'three/addons/objects/Water.js';
import { CLUSTER_SIZE } from './constants.js';

export function createWater(scene, sun, terrain) {
    if (!terrain || !terrain.userData || !terrain.userData.isWater || !terrain.userData.getHeight) {
        console.warn('createWater requires terrain with isWater and getHeight functions');
        return [];
    }

    const isWater = terrain.userData.isWater;
    const getHeight = terrain.userData.getHeight;

    const poolSize = 10;
    const waterGeometry = new THREE.PlaneGeometry(poolSize, poolSize);

    const waterNormals = new THREE.TextureLoader().load('https://threejs.org/examples/textures/waternormals.jpg', texture => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    });

    const waters = [];
    for (let x = -CLUSTER_SIZE / 2; x < CLUSTER_SIZE / 2; x += poolSize) {
        for (let z = -CLUSTER_SIZE / 2; z < CLUSTER_SIZE / 2; z += poolSize) {
            const cx = x + poolSize / 2;
            const cz = z + poolSize / 2;
            if (!isWater(cx, cz)) {
                continue;
            }

            const water = new Water(
                waterGeometry,
                {
                    textureWidth: 512,
                    textureHeight: 512,
                    waterNormals: waterNormals,
                    sunDirection: sun.clone().negate(),
                    sunColor: 0xffffff,
                    /* @tweakable The color of the water. */
                    waterColor: 0x001e0f,
                    /* @tweakable How much the water distorts reflections. */
                    distortionScale: 3.7,
                    fog: scene.fog !== undefined
                }
            );

            water.rotation.x = -Math.PI / 2;
            const waterHeight = getHeight(cx, cz) + 1.0;
            water.position.set(cx, waterHeight, cz);
            scene.add(water);
            waters.push(water);
        }
    }

    return waters;
}

