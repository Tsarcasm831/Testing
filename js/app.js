import { Game } from './Game.js';

async function main() {
  const startMenu = document.getElementById('start-menu');
  const startButton = document.getElementById('start-button');
  const loadingScreen = document.getElementById('loading-screen');

  startButton.addEventListener('click', async () => {
    startMenu.style.display = 'none';
    loadingScreen.style.display = 'flex';

    const game = new Game();
    await game.init();
  }, { once: true });
}

main();

