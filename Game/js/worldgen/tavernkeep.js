import * as THREE from 'three';
import { createPlayerModel } from '../playerModel.js';
import { NPC } from '../npc/NPC.js';
import { presetCharacters } from '../characters/presets.js';

/**
 * Creates a stationary tavernkeep NPC inside the tavern.
 * @param {THREE.Scene} scene The main scene.
 * @param {THREE.Mesh} terrain The terrain mesh.
 * @param {NPCManager} npcManager The NPC manager to register the new NPC.
 * @param {THREE.Vector3} tavernPosition The position of the tavern to place the tavernkeep in.
 */
export function createTavernkeep(scene, terrain, npcManager, tavernPosition) {
    /* @tweakable Set to false to prevent the tavernkeep from spawning. */
    const shouldSpawnTavernkeep = true;
    if (!shouldSpawnTavernkeep) return;

    /* @tweakable The relative position of the tavernkeep inside the tavern. Fine-tune to place them correctly. */
    const tavernkeepRelativePos = new THREE.Vector3(-2, 0.4, -3);
    const tavernkeepPosition = new THREE.Vector3().copy(tavernPosition).add(tavernkeepRelativePos);

    // Adjust Y position to be on top of the terrain/tavern floor
    const groundY = terrain.userData.getHeight(tavernkeepPosition.x, tavernkeepPosition.z); 
    tavernkeepPosition.y = groundY + 0.2;

    const preset = presetCharacters.find(p => p.id === 'tavernkeep');
    if (!preset) {
        console.error("Tavernkeep preset ('tavernkeep') not found.");
        return;
    }

    const model = createPlayerModel(THREE, "Tavernkeep", preset.spec);
    model.position.copy(tavernkeepPosition);
    model.userData.isNpc = true;
    model.name = "Tavernkeep";
    scene.add(model);
    
    // Make the tavernkeep face towards the center of the room
    model.rotation.y = Math.PI / 4;

    // Create an NPC instance for interaction logic
    const tavernkeepNpc = new NPC(model, preset.id, 'tavern_zone', false, tavernkeepPosition.clone(), terrain);

    // Override the default NPC behavior to make them stationary
    tavernkeepNpc.update = (delta, isVisible) => {
        if (!isVisible) return;
        // The base NPC update handles animation, we just need to prevent movement
    };
    
    // Add the new NPC to the manager to make it interactive
    npcManager.addNpc(tavernkeepNpc);
}