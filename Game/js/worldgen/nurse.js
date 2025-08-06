import * as THREE from 'three';
import { createPlayerModel } from '../playerModel.js';
import { NPC } from '../npc/NPC.js';
import { presetCharacters } from '../characters/presets.js';

/**
 * Creates a stationary nurse NPC inside the hospital.
 * @param {THREE.Scene} scene The main scene.
 * @param {THREE.Mesh} terrain The terrain mesh.
 * @param {NPCManager} npcManager The NPC manager to register the new NPC.
 * @param {THREE.Vector3} hospitalPosition The position of the hospital to place the nurse in.
 */
export function createNurse(scene, terrain, npcManager, hospitalPosition) {
    /* @tweakable Set to false to prevent the nurse from spawning. */
    const shouldSpawnNurse = true;
    if (!shouldSpawnNurse) return;

    /* @tweakable The relative position of the nurse inside the hospital. Fine-tune to place them correctly. */
    const nurseRelativePos = new THREE.Vector3(5, 0, -3);
    const nursePosition = new THREE.Vector3().copy(hospitalPosition).add(nurseRelativePos);

    // Adjust Y position to be on top of the terrain/hospital floor
    const groundY = terrain.userData.getHeight(nursePosition.x, nursePosition.z); 
    nursePosition.y = groundY + 0.2;

    const preset = presetCharacters.find(p => p.id === 'nurse');
    if (!preset) {
        console.error("Nurse preset ('nurse') not found.");
        return;
    }

    const model = createPlayerModel(THREE, "Nurse", preset.spec);
    model.position.copy(nursePosition);
    model.userData.isNpc = true;
    model.name = "Nurse";
    scene.add(model);
    
    // Make the nurse face towards the center of the room
    model.rotation.y = -Math.PI / 2;

    // Create an NPC instance for interaction logic
    const nurseNpc = new NPC(model, preset.id, 'hospital_zone', false, nursePosition.clone(), terrain);

    // Override the default NPC behavior to make them stationary
    nurseNpc.update = (delta, isVisible) => {
        if (!isVisible) return;
        // The base NPC update handles animation, we just need to prevent movement
    };
    
    // Add the new NPC to the manager to make it interactive
    npcManager.addNpc(nurseNpc);
}