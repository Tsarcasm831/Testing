import { BuildTool } from '../buildTool.js';
import { AdvancedBuildTool } from '../advancedBuildTool.js';
import { ObjectCreator } from '../objectCreator.js';

export function setupBuildTools(game, terrain) {
    const objectCreator = new ObjectCreator(game.scene, game.camera, game.room);

    game.buildTool = new BuildTool(game.scene, game.camera, game.playerControls, terrain);
    game.buildTool.setRoom(game.room);

    game.advancedBuildTool = new AdvancedBuildTool(game.scene, game.camera, game.renderer, game.buildTool, objectCreator);
    game.advancedBuildTool.setRoom(game.room);
    game.advancedBuildTool.setOrbitControls(game.playerControls.controls);
    objectCreator.buildTool = game.buildTool;

    if (game.room.roomState && game.room.roomState.buildObjects) {
        Object.values(game.room.roomState.buildObjects || {}).forEach(buildData => {
            if (buildData.isAdvanced) {
                game.advancedBuildTool.receiveBuildObject(buildData);
            } else {
                game.buildTool.receiveBuildObject(buildData);
            }
        });
    }
}
