import { Game } from './Game.js';

async function main() {
  const startMenu = document.getElementById('start-menu');
  const startButton = document.getElementById('start-button');
  const loadingScreen = document.getElementById('loading-screen');
  const preloadAssetsCheckbox = document.getElementById('preload-assets-checkbox');

  /* @tweakable Whether to preload all assets by default. */
  const preloadAssetsByDefault = false;
  preloadAssetsCheckbox.checked = preloadAssetsByDefault;

  startButton.addEventListener('click', async () => {
    startMenu.style.display = 'none';
    loadingScreen.style.display = 'flex';

    const shouldPreloadAssets = preloadAssetsCheckbox.checked;
    const game = new Game();
    await game.init(shouldPreloadAssets);
  }, { once: true });
}

main();

