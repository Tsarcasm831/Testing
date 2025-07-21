import * as THREE from 'three';
import { leafVertexShader, leafFragmentShader, trunkVertexShader, trunkFragmentShader } from './tree-shaders.js';

export function createPalmLeafMaterial(assets, sky) {
    const material = new THREE.ShaderMaterial({
        uniforms: {
            map: { value: assets.palm_leaf },
            time: { value: 0 },
            sunDirection: { value: sky.dirLight.position.clone().normalize() },
            sunColor: { value: sky.dirLight.color.clone() },
            hemisphereSkyColor: { value: sky.hemiLight.color.clone() },
            fogColor: { value: sky.scene.fog.color },
            fogNear: { value: sky.scene.fog.near },
            fogFar: { value: sky.scene.fog.far },
        },
        vertexShader: leafVertexShader,
        fragmentShader: leafFragmentShader,
        side: THREE.DoubleSide,
        transparent: false,
        alphaTest: 0.5,
    });

    sky.onLightUpdate((dirLight, hemiLight) => {
        material.uniforms.sunDirection.value.copy(dirLight.position).normalize();
        material.uniforms.sunColor.value.copy(dirLight.color);
        material.uniforms.hemisphereSkyColor.value.copy(hemiLight.color);
    });

    sky.onFogUpdate((fog) => {
        material.uniforms.fogColor.value.copy(fog.color);
        material.uniforms.fogNear.value = fog.near;
        material.uniforms.fogFar.value = fog.far;
    });

    return material;
}

export function createPalmTrunkMaterial(assets, sky) {
    const material = new THREE.ShaderMaterial({
        uniforms: {
            trunkTexture: { value: assets.palm_trunk },
            sunDirection: { value: sky.dirLight.position.clone().normalize() },
            sunColor: { value: sky.dirLight.color.clone() },
            hemisphereSkyColor: { value: sky.hemiLight.color.clone() },
            fogColor: { value: sky.scene.fog.color },
            fogNear: { value: sky.scene.fog.near },
            fogFar: { value: sky.scene.fog.far },
        },
        vertexShader: trunkVertexShader,
        fragmentShader: trunkFragmentShader,
        side: THREE.DoubleSide
    });

    sky.onLightUpdate((dirLight, hemiLight) => {
        material.uniforms.sunDirection.value.copy(dirLight.position).normalize();
        material.uniforms.sunColor.value.copy(dirLight.color);
        material.uniforms.hemisphereSkyColor.value.copy(hemiLight.color);
    });

    sky.onFogUpdate((fog) => {
        material.uniforms.fogColor.value.copy(fog.color);
        material.uniforms.fogNear.value = fog.near;
        material.uniforms.fogFar.value = fog.far;
    });

    return material;
}

export function createAspenLeafMaterial(assets, sky) {
    const material = new THREE.ShaderMaterial({
        uniforms: {
            map: { value: assets.aspen_leaf },
            time: { value: 0 },
            sunDirection: { value: sky.dirLight.position.clone().normalize() },
            sunColor: { value: sky.dirLight.color.clone() },
            hemisphereSkyColor: { value: sky.hemiLight.color.clone() },
            fogColor: { value: sky.scene.fog.color },
            fogNear: { value: sky.scene.fog.near },
            fogFar: { value: sky.scene.fog.far },
        },
        vertexShader: leafVertexShader,
        fragmentShader: leafFragmentShader,
        side: THREE.DoubleSide,
        transparent: false,
        alphaTest: 0.5,
    });

    sky.onLightUpdate((dirLight, hemiLight) => {
        material.uniforms.sunDirection.value.copy(dirLight.position).normalize();
        material.uniforms.sunColor.value.copy(dirLight.color);
        material.uniforms.hemisphereSkyColor.value.copy(hemiLight.color);
    });

    sky.onFogUpdate((fog) => {
        material.uniforms.fogColor.value.copy(fog.color);
        material.uniforms.fogNear.value = fog.near;
        material.uniforms.fogFar.value = fog.far;
    });

    return material;
}

export function createAspenTrunkMaterial(assets, sky) {
    const material = new THREE.ShaderMaterial({
        uniforms: {
            trunkTexture: { value: assets.aspen_trunk },
            sunDirection: { value: sky.dirLight.position.clone().normalize() },
            sunColor: { value: sky.dirLight.color.clone() },
            hemisphereSkyColor: { value: sky.hemiLight.color.clone() },
            fogColor: { value: sky.scene.fog.color },
            fogNear: { value: sky.scene.fog.near },
            fogFar: { value: sky.scene.fog.far },
        },
        vertexShader: trunkVertexShader,
        fragmentShader: trunkFragmentShader,
        side: THREE.DoubleSide
    });

    sky.onLightUpdate((dirLight, hemiLight) => {
        material.uniforms.sunDirection.value.copy(dirLight.position).normalize();
        material.uniforms.sunColor.value.copy(dirLight.color);
        material.uniforms.hemisphereSkyColor.value.copy(hemiLight.color);
    });

    sky.onFogUpdate((fog) => {
        material.uniforms.fogColor.value.copy(fog.color);
        material.uniforms.fogNear.value = fog.near;
        material.uniforms.fogFar.value = fog.far;
    });

    return material;
}

export function createPineLeafMaterial(assets, sky) {
    const material = new THREE.ShaderMaterial({
        uniforms: {
            map: { value: assets.pine_leaf },
            time: { value: 0 },
            sunDirection: { value: sky.dirLight.position.clone().normalize() },
            sunColor: { value: sky.dirLight.color.clone() },
            hemisphereSkyColor: { value: sky.hemiLight.color.clone() },
            fogColor: { value: sky.scene.fog.color },
            fogNear: { value: sky.scene.fog.near },
            fogFar: { value: sky.scene.fog.far },
        },
        vertexShader: leafVertexShader,
        fragmentShader: leafFragmentShader,
        side: THREE.DoubleSide,
        transparent: false,
        alphaTest: 0.5,
    });

    sky.onLightUpdate((dirLight, hemiLight) => {
        material.uniforms.sunDirection.value.copy(dirLight.position).normalize();
        material.uniforms.sunColor.value.copy(dirLight.color);
        material.uniforms.hemisphereSkyColor.value.copy(hemiLight.color);
    });

    sky.onFogUpdate((fog) => {
        material.uniforms.fogColor.value.copy(fog.color);
        material.uniforms.fogNear.value = fog.near;
        material.uniforms.fogFar.value = fog.far;
    });

    return material;
}

export function createPineTrunkMaterial(assets, sky) {
    const material = new THREE.ShaderMaterial({
        uniforms: {
            trunkTexture: { value: assets.pine_trunk },
            sunDirection: { value: sky.dirLight.position.clone().normalize() },
            sunColor: { value: sky.dirLight.color.clone() },
            hemisphereSkyColor: { value: sky.hemiLight.color.clone() },
            fogColor: { value: sky.scene.fog.color },
            fogNear: { value: sky.scene.fog.near },
            fogFar: { value: sky.scene.fog.far },
        },
        vertexShader: trunkVertexShader,
        fragmentShader: trunkFragmentShader,
        side: THREE.DoubleSide
    });

    sky.onLightUpdate((dirLight, hemiLight) => {
        material.uniforms.sunDirection.value.copy(dirLight.position).normalize();
        material.uniforms.sunColor.value.copy(dirLight.color);
        material.uniforms.hemisphereSkyColor.value.copy(hemiLight.color);
    });

    sky.onFogUpdate((fog) => {
        material.uniforms.fogColor.value.copy(fog.color);
        material.uniforms.fogNear.value = fog.near;
        material.uniforms.fogFar.value = fog.far;
    });

    return material;
}

export function createOakLeafMaterial(assets, sky) {
    const material = new THREE.ShaderMaterial({
        uniforms: {
            map: { value: assets.oak_leaf },
            time: { value: 0 },
            sunDirection: { value: sky.dirLight.position.clone().normalize() },
            sunColor: { value: sky.dirLight.color.clone() },
            hemisphereSkyColor: { value: sky.hemiLight.color.clone() },
            fogColor: { value: sky.scene.fog.color },
            fogNear: { value: sky.scene.fog.near },
            fogFar: { value: sky.scene.fog.far },
        },
        vertexShader: leafVertexShader,
        fragmentShader: leafFragmentShader,
        side: THREE.DoubleSide,
        transparent: false,
        alphaTest: 0.5,
    });

    sky.onLightUpdate((dirLight, hemiLight) => {
        material.uniforms.sunDirection.value.copy(dirLight.position).normalize();
        material.uniforms.sunColor.value.copy(dirLight.color);
        material.uniforms.hemisphereSkyColor.value.copy(hemiLight.color);
    });

    sky.onFogUpdate((fog) => {
        material.uniforms.fogColor.value.copy(fog.color);
        material.uniforms.fogNear.value = fog.near;
        material.uniforms.fogFar.value = fog.far;
    });

    return material;
}

export function createOakTrunkMaterial(assets, sky) {
    const material = new THREE.ShaderMaterial({
        uniforms: {
            trunkTexture: { value: assets.oak_trunk },
            sunDirection: { value: sky.dirLight.position.clone().normalize() },
            sunColor: { value: sky.dirLight.color.clone() },
            hemisphereSkyColor: { value: sky.hemiLight.color.clone() },
            fogColor: { value: sky.scene.fog.color },
            fogNear: { value: sky.scene.fog.near },
            fogFar: { value: sky.scene.fog.far },
        },
        vertexShader: trunkVertexShader,
        fragmentShader: trunkFragmentShader,
        side: THREE.DoubleSide
    });

    sky.onLightUpdate((dirLight, hemiLight) => {
        material.uniforms.sunDirection.value.copy(dirLight.position).normalize();
        material.uniforms.sunColor.value.copy(dirLight.color);
        material.uniforms.hemisphereSkyColor.value.copy(hemiLight.color);
    });

    sky.onFogUpdate((fog) => {
        material.uniforms.fogColor.value.copy(fog.color);
        material.uniforms.fogNear.value = fog.near;
        material.uniforms.fogFar.value = fog.far;
    });

    return material;
}

