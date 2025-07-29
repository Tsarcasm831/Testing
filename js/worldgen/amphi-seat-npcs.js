import * as THREE from 'three';
import { createPlayerModel } from '../playerModel.js';
import { NPC } from '../npc/NPC.js';
import { USE_SPECTATOR_MODELS, spectatorNpcVerticalOffset, fullNpcVerticalOffset } from './amphi-seat-config.js';

export function spawnCrowdNPCs(group, presets, transforms, npcManager, terrain, seatBaseHeight) {
    // Shuffle transforms for random seating
    for (let i = transforms.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [transforms[i], transforms[j]] = [transforms[j], transforms[i]];
    }

    const numToSpawn = Math.min(presets.length, transforms.length);

    for (let i = 0; i < numToSpawn; i++) {
        const preset = presets[i];
        const transform = transforms[i];

        const specToUse = USE_SPECTATOR_MODELS && preset.spectatorSpec ? preset.spectatorSpec : preset.spec;
        const model = createPlayerModel(THREE, preset.name, specToUse);

        model.position.copy(transform.position);
        model.rotation.copy(transform.rotation);

        // Adjust position to be on top of the seat.
        const verticalOffset = USE_SPECTATOR_MODELS ? spectatorNpcVerticalOffset : fullNpcVerticalOffset;
        model.position.y += seatBaseHeight + verticalOffset;

        model.userData.isNpc = true;
        model.name = preset.name;
        group.add(model);

        const npc = new NPC(model, preset.id, 'amphitheatre_crowd', false, model.position.clone(), terrain);

        // Override update to make them stationary
        npc.update = () => {
            if (model.userData.isAnimatedGLB && model.userData.mixer) {
                const delta = (performance.now() - (model.userData.lastMixerUpdate || performance.now())) / 1000;
                model.userData.mixer.update(delta);
                model.userData.lastMixerUpdate = performance.now();
            }
        };
        npcManager.addNpc(npc);
    }
}
