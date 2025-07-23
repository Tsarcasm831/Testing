import * as THREE from 'three';
import { PlayerControls } from '../playerControls.js';
import { createPlayerModel } from '../playerModel.js';

export function setupPlayer(game, playerName, initialPosition) {
    game.playerModel = createPlayerModel(THREE, playerName);
    game.scene.add(game.playerModel);

    game.playerControls = new PlayerControls(game.scene, game.room, {
        renderer: game.renderer,
        initialPosition: initialPosition,
        playerModel: game.playerModel,
        terrain: null,
        collisionManager: game.collisionManager
    });

    game.camera = game.playerControls.getCamera();
    const listener = new THREE.AudioListener();
    game.camera.add(listener);
}
