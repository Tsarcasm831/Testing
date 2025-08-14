import { WORLD_SIZE as WORLD_SIZE_CONST } from '../../scene/terrain.js';
import { ObjectGrid } from './grid.js';
import { createCentralWallWithGate } from './walls/centralWall.js';
import { placeHokagePalace } from './placements/hokagePalace.js';
import { placeHokageMonument } from './placements/hokageMonument.js';
import { placeIchiraku } from './placements/ichiraku.js';
import { placeKonohaTown } from './placements/konohaTown.js';

// Build all world objects and return { objects, grid }
export function updateObjects(scene, currentObjects, settings) {
  // Remove previously added objects
  currentObjects.forEach(obj => scene.remove(obj));

  const renderObjects = [];
  const worldSize = WORLD_SIZE_CONST;
  const objectGrid = new ObjectGrid(worldSize, 200);

  // Central wall with a gate between KJ493 and KW493
  const { group: wall, colliders } = createCentralWallWithGate({
    scene,
    worldSize,
    radius: 960,
    height: 30,
    segments: 160,
    colliderSpacing: 18,
    colliderRadius: 12,
    color: 0xffffff,
    thickness: 5,
    gateFromLabel: 'KJ493',
    gateToLabel: 'KW493',
    removeExactlyBetween: true
  });
  renderObjects.push(wall);
  colliders.forEach(c => objectGrid.add(c));

  // Buildings
  const palace = placeHokagePalace(scene, objectGrid, worldSize, settings);
  if (palace) renderObjects.push(palace);

  const monument = placeHokageMonument(scene, objectGrid, worldSize, settings);
  if (monument) renderObjects.push(monument);

  const ichiraku = placeIchiraku(scene, objectGrid, worldSize, settings);
  if (ichiraku) renderObjects.push(ichiraku);

  const town = placeKonohaTown(scene, objectGrid, settings);
  if (town) renderObjects.push(town);

  return { objects: renderObjects, grid: objectGrid };
}
