import { parseGridLabel, posForCell } from '../utils/gridLabel.js';
import * as THREE from 'three';
import { createHokagePalace } from '../houses/HokagePalace.js';

/* @tweakable grid label where the Hokage Palace is placed */
const HOKAGE_PALACE_LABEL = 'LB117';

/* @tweakable toggle: when true, place only a reconstruction marker instead of the full palace */
const HOKAGE_PLACE_MARKER_ONLY = false;
/* @tweakable label text shown in tooltips and interaction prompt */
const HOKAGE_MARKER_LABEL = 'Hokage Palace — Reconstruction Site';
/* @tweakable marker color (hex) */
const HOKAGE_MARKER_COLOR = 0xeab308; // amber-500
/* @tweakable marker size (world units): { radius, height } */
const HOKAGE_MARKER_SIZE = { radius: 4, height: 10 };
/* @tweakable additional world offset applied to the palace position (fine tune placement) */
const HOKAGE_OFFSET = { x: 0, y: 0, z: 0 };
/* @tweakable Y-axis rotation (radians) applied to the palace root */
const HOKAGE_ROTATE_Y = 0;

// Place the Hokage Palace at a grid label.
// Returns the created THREE.Group or null on failure.
export function placeHokagePalace(scene, objectGrid, worldSize, settings, label = HOKAGE_PALACE_LABEL) {
  try {
    const { i, j } = parseGridLabel(label);
    const pos = posForCell(i, j, worldSize);
    pos.y = 0;

    // Place only a reconstruction marker (no palace geometry)
    if (HOKAGE_PLACE_MARKER_ONLY) {
      const markerGroup = new THREE.Group();
      markerGroup.name = 'HokagePalaceMarker';
      markerGroup.position.copy(pos);
      // Simple pillar + ring cap to stand out
      const pillar = new THREE.Mesh(
        new THREE.CylinderGeometry(HOKAGE_MARKER_SIZE.radius * 0.6, HOKAGE_MARKER_SIZE.radius * 0.6, HOKAGE_MARKER_SIZE.height, 24),
        new THREE.MeshStandardMaterial({ color: HOKAGE_MARKER_COLOR, roughness: 0.75 })
      );
      pillar.position.y = HOKAGE_MARKER_SIZE.height / 2;
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(HOKAGE_MARKER_SIZE.radius, 0.5, 12, 36),
        new THREE.MeshStandardMaterial({ color: HOKAGE_MARKER_COLOR, roughness: 0.85 })
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.y = HOKAGE_MARKER_SIZE.height + 0.75;
      markerGroup.add(pillar, ring);
      // Add a small proxy so tooltips/interaction work
      const proxy = new THREE.Object3D();
      proxy.position.set(pos.x, 0, pos.z);
      proxy.userData = {
        label: HOKAGE_MARKER_LABEL,
        collider: { type: 'sphere', radius: Math.max(6, HOKAGE_MARKER_SIZE.radius + 2) }
      };
      scene.add(markerGroup, proxy);
      objectGrid.add(proxy);
      return markerGroup;
    }

    // Place the full Hokage Palace using the dedicated builder
    const { group, colliderProxy, colliderProxies } = createHokagePalace({
      position: new THREE.Vector3(pos.x + HOKAGE_OFFSET.x, pos.y + HOKAGE_OFFSET.y, pos.z + HOKAGE_OFFSET.z),
      settings
    });
    if (HOKAGE_ROTATE_Y) group.rotation.y = HOKAGE_ROTATE_Y;
    scene.add(group);
    // Register colliders
    if (colliderProxy) { scene.add(colliderProxy); objectGrid.add(colliderProxy); }
    (colliderProxies || []).forEach(p => { scene.add(p); objectGrid.add(p); });
    return group;

  } catch (e) {
    console.warn(`Failed to place Hokage Palace at ${label}:`, e);
    return null;
  }
}