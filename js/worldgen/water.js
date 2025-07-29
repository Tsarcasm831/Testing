import * as THREE from 'three';
import { Water } from 'three/addons/objects/Water.js';
import { CLUSTER_SIZE, WATER_LEVEL } from './constants.js';

export function createWater(scene, sun) {
    /* @tweakable The size of the water plane. Should be large enough to cover the world. */
    const waterPlaneSize = CLUSTER_SIZE;
    const waterGeometry = new THREE.PlaneGeometry(waterPlaneSize, waterPlaneSize);

    const water = new Water(
        waterGeometry,
        {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: new THREE.TextureLoader().load('https://threejs.org/examples/textures/waternormals.jpg', function (texture) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            }),
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
    water.position.y = WATER_LEVEL;

    scene.add(water);
    return water;
}