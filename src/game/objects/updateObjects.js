import { WORLD_SIZE as WORLD_SIZE_CONST } from '../../scene/terrain.js';
import { ObjectGrid } from './grid.js';
import { createCentralWallWithGate } from './walls/centralWall.js';
import { placeHokagePalace } from './placements/hokagePalace.js';
import { placeHokageMonument } from './placements/hokageMonument.js';
import { placeIchiraku } from './placements/ichiraku.js';
import { placeKonohaTown } from './placements/konohaTown.js';
import { placeKonohaGates } from './placements/konohaGates.js';

// Build all world objects and return { objects, grid }
export function updateObjects(scene, currentObjects, settings) {
  // Remove previously added objects
  currentObjects.forEach(obj => scene.remove(obj));

  const renderObjects = [];
  const worldSize = WORLD_SIZE_CONST;
  const objectGrid = new ObjectGrid(worldSize, 200);

  // Central wall with a removed section on the north side between KX491 and KD491
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
    gateFromLabel: 'KX491',
    gateToLabel: 'KD491',
    removeExactlyBetween: true
  });
  renderObjects.push(wall);
  colliders.forEach(c => objectGrid.add(c));

  // NEW: Place the animated Konoha Gates model right in the opening we cut out
  const gates = placeKonohaGates(scene, objectGrid, worldSize, settings, {
    gateFromLabel: 'KX491',
    gateToLabel: 'KD491',
    // Scale the standalone gate to roughly fill the ~48u opening we left in the wall
    scale: 4
  });
  if (gates) renderObjects.push(gates);

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