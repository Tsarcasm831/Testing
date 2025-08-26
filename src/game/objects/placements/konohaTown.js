import * as THREE from 'three';
// NOTE: this file is at /src/game/objects/placements/, so we must go up THREE levels to reach /src/components/...
import { addRedBuildings } from '../../../components/game/objects/buildings.red.js';
import { addBlueBuildings } from '../../../components/game/objects/buildings.blue.js';
import { addYellowBuildings } from '../../../components/game/objects/buildings.yellow.js';
import { addGreenBuildings } from '../../../components/game/objects/buildings.green.js';
import { addDarkBuildings } from '../../../components/game/objects/buildings.dark.js';
// Building palette and helpers extracted into separate module
import { createKonohaBuildingKit } from './konohaBuildingKit.js';
import { createEnsureNotOnRoad } from './konohaTownRoads.js';
import { addObbProxy } from './konohaTownColliders.js';

// @tweakable global scale factor applied to all Konoha town buildings (1 = original size)
const KONOHA_TOWN_SCALE = 0.5;

// Build a cluster of Konoha town buildings and add them to the scene.
// Returns the group representing the town or null on failure.
export function placeKonohaTown(scene, objectGrid, settings, origin = new THREE.Vector3(-320, 0, -220)) {
  try {
    // Obtain palette, materials and building factory from helper module
    const kit = createKonohaBuildingKit(settings);

    const townGroup = new THREE.Group();
    townGroup.name = 'KonohaTown';

    addRedBuildings(townGroup,   { THREE, kit });
    addBlueBuildings(townGroup,  { THREE, kit });
    addYellowBuildings(townGroup,{ THREE, kit });
    addGreenBuildings(townGroup, { THREE, kit });
    addDarkBuildings(townGroup,  { THREE, kit });

    // Apply global town scale (affects visuals and spacing)
    townGroup.scale.setScalar(KONOHA_TOWN_SCALE);

    townGroup.position.copy(origin);
    scene.add(townGroup);

    const ensureNotOnRoad = createEnsureNotOnRoad(KONOHA_TOWN_SCALE);

    townGroup.children.forEach(colorGroup => {
      colorGroup.children?.forEach(building => {
        ensureNotOnRoad(building);
        addObbProxy(scene, objectGrid, building);
      });
    });

    return townGroup;
  } catch (e) {
    console.warn('Failed to integrate Konoha Buildings:', e);
    return null;
  }
}
