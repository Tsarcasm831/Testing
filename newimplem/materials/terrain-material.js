import * as THREE from 'three';
import { terrainVertexShader, terrainFragmentShader } from './terrain-shader.js';

let terrainMaterial = null;

function createTerrainMaterial(assets, sky) {
    if (!terrainMaterial) {
        terrainMaterial = new THREE.ShaderMaterial({
            uniforms: {
                sandTexture: { value: assets.sand },
                grassTexture: { value: assets.grass },
                dirtTexture: { value: assets.dirt },
                rockTexture: { value: assets.rock },
                snowTexture: { value: assets.snow },
                badlandsTexture: { value: assets.badlands },
                sandNormal: { value: assets.sand_normal },
                grassNormal: { value: assets.grass_normal },
                dirtNormal: { value: assets.dirt_normal },
                rockNormal: { value: assets.rock_normal },
                snowNormal: { value: assets.snow_normal },
                badlandsNormal: { value: assets.badlands_normal },
                sunDirection: { value: sky.dirLight.position.clone().normalize() },
                sunColor: { value: sky.dirLight.color.clone() },
                hemisphereSkyColor: { value: sky.hemiLight.color.clone() },
                textureScale: { value: 20.0 }
            },
            vertexShader: terrainVertexShader,
            fragmentShader: terrainFragmentShader,
            side: THREE.DoubleSide // Ensure collision works even if player passes through in one frame
        });
    }
    return terrainMaterial;
}

export { createTerrainMaterial, terrainMaterial };