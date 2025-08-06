import * as THREE from 'three';
import { createPlayerModel } from '../playerModel.js';
import { NPC } from '../npc/NPC.js';
import { presetCharacters } from '../characters/presets.js';

/**
 * Creates a stationary shopkeeper NPC inside the house.
 * @param {THREE.Scene} scene The main scene.
 * @param {THREE.Mesh} terrain The terrain mesh.
 * @param {NPCManager} npcManager The NPC manager to register the new NPC.
 * @param {THREE.Vector3} housePosition The position of the house to place the shopkeeper in.
 */
export function createShopkeeper(scene, terrain, npcManager, housePosition) {
    /* @tweakable Set to false to prevent the shopkeeper from spawning. */
    const shouldSpawnShopkeeper = true;
    if (!shouldSpawnShopkeeper) return;

    /* @tweakable The relative position of the shopkeeper inside the house. Fine-tune to place them correctly. */
    const shopkeeperRelativePos = new THREE.Vector3(0, 0, -3);
    const shopkeeperPosition = new THREE.Vector3().copy(housePosition).add(shopkeeperRelativePos);

    // Adjust Y position to be on top of the terrain/house floor
    const groundY = terrain.userData.getHeight(shopkeeperPosition.x, shopkeeperPosition.z); 
    shopkeeperPosition.y = groundY + 0.2;

    const preset = presetCharacters.find(p => p.id === 'shopkeeper');
    if (!preset) {
        console.error("Shopkeeper preset ('shopkeeper') not found.");
        return;
    }

    const model = createPlayerModel(THREE, "Shopkeeper", preset.spec);
    model.position.copy(shopkeeperPosition);
    model.userData.isNpc = true;
    model.name = "Shopkeeper";
    scene.add(model);
    
    // Make the shopkeeper face the door (positive Z direction)
    model.rotation.y = Math.PI;

    // Create an NPC instance for interaction logic
    const shopkeeperNpc = new NPC(model, preset.id, 'shopkeeper_zone', false, shopkeeperPosition.clone(), terrain);

    // Override the default NPC behavior to make them stationary
    shopkeeperNpc.update = (delta, isVisible) => {
        if (!isVisible) return;
        // The base NPC update handles animation, we just need to prevent movement
    };
    
    // Add the new NPC to the manager to make it interactive
    npcManager.addNpc(shopkeeperNpc);
}