// Refactored aggregator for game objects.
// Exposes focused modules to keep external imports stable.

export { createCentralWall, createCentralWallWithGate } from './walls/centralWall.js';
export { updateObjects } from './updateObjects.js';
export { ObjectGrid } from './grid.js';

