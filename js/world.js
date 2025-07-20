import * as THREE from 'three';
import { createTerrain, createBarriers, createTrees, createClouds, createStarterHouse, createShopkeeper, createAmphitheatre, createHospital, createTavern, createWorkshop, createNurse, createTavernkeep } from './worldGeneration.js';

export class World {
    constructor(scene, npcManager, room) {
        this.scene = scene;
        this.npcManager = npcManager;
        this.terrain = null;
        this.room = room;
    }

    generate() {
        this.terrain = createTerrain(this.scene);
        createBarriers(this.scene, this.terrain.userData.getHeight);
        createTrees(this.scene, this.terrain.userData.getHeight);
        createClouds(this.scene);
        const house = createStarterHouse(this.scene, this.terrain.userData.getHeight);
        createShopkeeper(this.scene, this.terrain, this.npcManager, house.position);
        createAmphitheatre(this.scene, this.terrain.userData.getHeight);
        const hospital = createHospital(this.scene, this.terrain.userData.getHeight);
        const tavern = createTavern(this.scene, this.terrain.userData.getHeight);
        createWorkshop(this.scene, this.terrain.userData.getHeight);
        createNurse(this.scene, this.terrain, this.npcManager, hospital.position);
        createTavernkeep(this.scene, this.terrain, this.npcManager, tavern.position);
        return this.terrain;
    }
}