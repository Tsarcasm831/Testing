import { parseGridLabel, posForCell } from '../utils/gridLabel.js';
import { createHokagePalace } from '../houses/HokagePalace.js';
import * as THREE from 'three';

/* @tweakable grid label where the Hokage Palace is placed */
const HOKAGE_PALACE_LABEL = 'LB117';

// Place the Hokage Palace at a grid label.
// Returns the created THREE.Group or null on failure.
export function placeHokagePalace(scene, objectGrid, worldSize, settings, label = HOKAGE_PALACE_LABEL) {
  try {
    const { i, j } = parseGridLabel(label);
    const pos = posForCell(i, j, worldSize);
    pos.y = 0;

    const { group, colliderProxies } = createHokagePalace({ position: pos, settings });
    scene.add(group);

    if (Array.isArray(colliderProxies)) {
      colliderProxies.forEach(proxy => {
        scene.add(proxy);
        objectGrid.add(proxy);
      });
    }

    return group;
  } catch (e) {
    console.warn(`Failed to place Hokage Palace at ${label}:`, e);
    return null;
  }
}