import { parseGridLabel, posForCell } from '../utils/gridLabel.js';
import { createIchiraku } from '../houses/ichiraku.js';
import * as THREE from 'three';

// Place the Ichiraku ramen shop at a specific grid label.
export function placeIchiraku(scene, objectGrid, worldSize, settings, label = 'LF480') {
  try {
    const { i, j } = parseGridLabel(label);
    const pos = posForCell(i, j, worldSize);
    pos.y = 0;

    const { group, colliderProxy } = createIchiraku({ position: pos, settings });
    scene.add(group);

    if (colliderProxy) {
      scene.add(colliderProxy);
      objectGrid.add(colliderProxy);
    }

    return group;
  } catch (e) {
    console.warn(`Failed to place Ichiraku at ${label}:`, e);
    return null;
  }
}
