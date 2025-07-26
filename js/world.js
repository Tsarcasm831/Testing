import * as THREE from 'three';
import { createTerrain, createBarriers, createTrees, createClouds, createStarterHouse, createShopkeeper, createAmphitheatre, createHospital, createTavern, createWorkshop, createNurse, createTavernkeep, createGrass } from './worldGeneration.js';

export class World {
    constructor(scene, npcManager, room, matsData) {
        this.scene = scene;
        this.npcManager = npcManager;
        this.terrain = null;
        this.room = room;
        this.matsData = matsData;
    }

    generate() {
        this.terrain = createTerrain(this.scene);
        createBarriers(this.scene, this.terrain.userData.getHeight);
        createTrees(this.scene, this.terrain.userData.getHeight);
        createClouds(this.scene);
        const house = createStarterHouse(this.scene, this.terrain.userData.getHeight, this.matsData);
        createShopkeeper(this.scene, this.terrain, this.npcManager, house.position);
        createAmphitheatre(this.scene, this.terrain.userData.getHeight, this.npcManager, this.terrain);
        const hospital = createHospital(this.scene, this.terrain.userData.getHeight);
        const tavern = createTavern(this.scene, this.terrain.userData.getHeight);
        createWorkshop(this.scene, this.terrain.userData.getHeight);
        createNurse(this.scene, this.terrain, this.npcManager, hospital.position);
        createTavernkeep(this.scene, this.terrain, this.npcManager, tavern.position);
        const grass = createGrass(this.scene, this.terrain);
        return { terrain: this.terrain, grass: grass };
    }
}