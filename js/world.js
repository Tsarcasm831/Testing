import * as THREE from 'three';
import { createTerrain, createBarriers, createTrees, createClouds, createStarterHouse, createShopkeeper, createAmphitheatre } from './worldGeneration.js';

export class World {
    constructor(scene, npcManager) {
        this.scene = scene;
        this.npcManager = npcManager;
        this.terrain = null;
    }

    generate(listener) {
        this.terrain = createTerrain(this.scene);
        createBarriers(this.scene, this.terrain.userData.getHeight);
        createTrees(this.scene, this.terrain.userData.getHeight);
        createClouds(this.scene);
        const house = createStarterHouse(this.scene, this.terrain.userData.getHeight);
        createShopkeeper(this.scene, this.terrain, this.npcManager, house.position);
        createAmphitheatre(this.scene, this.terrain.userData.getHeight, listener);
        return this.terrain;
    }
}

