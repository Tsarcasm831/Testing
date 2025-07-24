import { NPCManager } from '../npcManager.js';
import { InteractionManager } from '../interaction.js';

export function setupManagers(game) {
    game.npcManager = new NPCManager(game.scene, null, game.playerControls);
    game.npcManager.collisionManager = game.collisionManager;

    game.interactionManager = new InteractionManager({
        playerControls: game.playerControls,
        npcManager: game.npcManager,
        camera: game.camera,
        renderer: game.renderer
    });
    game.interactionManager.init();
}
