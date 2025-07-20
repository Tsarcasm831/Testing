import { settings } from './settings.js';

export const CHUNK_SIZE = 32;
export const WORLD_HEIGHT = 100;
export const RENDER_DISTANCE = settings.get('renderDistance'); // In chunks