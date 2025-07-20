import { Game } from './Game.js';

async function main() {
  const game = new Game();
  await game.init();
}

main();