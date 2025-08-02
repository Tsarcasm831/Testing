import * as THREE from 'three';
import { createTerrain, createBarriers, createTrees, createClouds, createStarterHouse, createShopkeeper, createAmphitheatre, createHospital, createTavern, createWorkshop, createNurse, createTavernkeep, createGrass, createWater } from './worldGeneration.js';

export class World {
    constructor(scene, npcManager, room, matsData, assetManager) {
        this.scene = scene;
        this.npcManager = npcManager;
        this.terrain = null;
        this.room = room;
        this.matsData = matsData;
        this.assetManager = assetManager;
    }

    async generate(sun) {
        this.terrain = await createTerrain(this.scene, this.assetManager);
        createWater(this.scene, sun);
        createBarriers(this.scene, this.terrain);
        createTrees(this.scene, this.terrain);
        createClouds(this.scene);
        const house = await createStarterHouse(this.scene, this.terrain.userData.getHeight, this.matsData, this.assetManager);
        createShopkeeper(this.scene, this.terrain, this.npcManager, house.position);
        const amphiData = await createAmphitheatre(this.scene, this.terrain.userData.getHeight, this.npcManager, this.terrain, this.assetManager);
        const interactableSeats = amphiData.interactableSeats;
        const hospital = createHospital(this.scene, this.terrain.userData.getHeight);
        const tavern = createTavern(this.scene, this.terrain.userData.getHeight);
        createWorkshop(this.scene, this.terrain.userData.getHeight);
        createNurse(this.scene, this.terrain, this.npcManager, hospital.position);
        createTavernkeep(this.scene, this.terrain, this.npcManager, tavern.position);
        const grass = createGrass(this.scene, this.terrain);
        return { terrain: this.terrain, grass: grass, interactableSeats };
    }
}