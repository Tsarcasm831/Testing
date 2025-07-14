import * as THREE from 'three';
import { createTerrain, createBarriers, createTrees, createClouds, createStarterHouse } from './worldGeneration.js';

export class World {
    constructor(scene) {
        this.scene = scene;
        this.terrain = null;
    }

    generate() {
        this.terrain = createTerrain(this.scene);
        createBarriers(this.scene, this.terrain.userData.getHeight);
        createTrees(this.scene, this.terrain.userData.getHeight);
        createClouds(this.scene);
        createStarterHouse(this.scene, this.terrain.userData.getHeight);
        return this.terrain;
    }
}