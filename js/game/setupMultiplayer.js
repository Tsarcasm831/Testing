import { MultiplayerManager } from '../multiplayerManager.js';
import { createPlayerModel } from '../playerModel.js';

export function setupMultiplayer(game) {
    game.multiplayerManager = new MultiplayerManager({
        room: game.room,
        scene: game.scene,
        camera: game.camera,
        renderer: game.renderer,
        buildTool: game.buildTool,
        advancedBuildTool: game.advancedBuildTool,
        createPlayerModel: (three, username, spec) => createPlayerModel(three, username, spec),
        playerControls: game.playerControls
    });
    game.multiplayerManager.init();
}
