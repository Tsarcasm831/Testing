import { togglePlayPause, togglePlayPauseKey } from '../youtubePlayer.js';

export function setupEventListeners(game) {
    window.addEventListener('keydown', (event) => {
        if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;

        const key = event.key.toLowerCase();

        if (key === 'g' && !game.advancedBuildTool.enabled) {
            game.gridManager.toggle(game.playerModel.position);
        }

        if (key === togglePlayPauseKey) {
            togglePlayPause();
        }
    });
}
