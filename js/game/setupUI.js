import * as THREE from 'three';
import { UIManager } from '../uiManager.js';
import { CharacterCreator } from '../characterCreator.js';
import { InventoryManager } from '../inventoryManager.js';
import { createPlayerModel } from '../playerModel.js';

export function setupUI(game, assetReplacementManager) {
    const characterCreator = new CharacterCreator(
        THREE,
        game.room,
        game.playerControls,
        (newSpec) => {
            game.scene.remove(game.playerModel);
            game.playerModel = createPlayerModel(THREE, game.playerModel.name, newSpec);
            game.scene.add(game.playerModel);
            game.playerControls.playerModel = game.playerModel;
            game.videoManager.setPlayerModel(game.playerModel);
            return game.playerModel;
        }
    );

    const inventoryManager = new InventoryManager({ playerControls: game.playerControls });

    game.uiManager = new UIManager({
        playerControls: game.playerControls,
        buildTool: game.buildTool,
        advancedBuildTool: game.advancedBuildTool,
        characterCreator,
        objectCreator: game.advancedBuildTool.objectCreator,
        inventoryManager,
        multiplayerManager: game.multiplayerManager,
        npcManager: game.npcManager,
        assetReplacementManager,
        room: game.room,
        renderer: game.renderer,
        playerModel: game.playerModel,
        dirLight: game.dirLight,
        scene: game.scene,
        gridManager: game.gridManager
    });
    const { inventoryUI } = game.uiManager.init();

    inventoryManager.inventoryUI = inventoryUI;
    inventoryManager.init();
}
