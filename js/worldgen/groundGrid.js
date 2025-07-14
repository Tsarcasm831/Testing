import * as THREE from 'three';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

/**
 * Converts a number to a base-26 alphabetical representation (A, B, ..., Z, AA, AB, ...).
 * @param {number} num - The number to convert (0-indexed).
 * @returns {string} The alphabetical representation.
 */
function toBase26(num) {
    let result = '';
    do {
        result = String.fromCharCode(65 + (num % 26)) + result;
        num = Math.floor(num / 26) - 1;
    } while (num >= 0);
    return result;
}

/**
 * Creates a grid that conforms to the terrain's elevation, with labels.
 * @param {THREE.Mesh} terrain - The terrain mesh, with a `userData.getHeight` function.
 * @param {number} size - The total width and depth of the grid.
 * @param {number} divisions - The number of grid cells along each axis.
 * @param {THREE.Color | number | string} colorCenterLine - The color of the center grid lines.
 * @param {THREE.Color | number | string} colorGrid - The color of the other grid lines.
 * @returns {THREE.Group} A group containing the grid lines and labels.
 */
export function createGroundGrid(terrain, size, divisions, colorCenterLine, colorGrid) {
    const group = new THREE.Group();
    const vertices = [];
    const colors = [];

    const center = divisions / 2;
    const step = size / divisions;
    const halfSize = size / 2;
    /* @tweakable The vertical offset of the grid from the ground to prevent z-fighting. */
    const gridOffsetY = 0.05;
    /* @tweakable Number of subdivisions per grid line for better terrain conformity. Higher is more accurate but less performant. */
    const lineSubdivisions = 4;

    const colorCenter = new THREE.Color(colorCenterLine);
    const colorGridLines = new THREE.Color(colorGrid);
    
    const subStep = step / lineSubdivisions;

    for (let i = 0; i <= divisions; i++) {
        // lines in z direction (parallel to z-axis)
        for (let j = 0; j < divisions; j++) {
            const x = -halfSize + i * step;
            for (let k = 0; k < lineSubdivisions; k++) {
                const z1 = -halfSize + j * step + k * subStep;
                const z2 = -halfSize + j * step + (k + 1) * subStep;

                const y1 = terrain.userData.getHeight(x, z1) + gridOffsetY;
                const y2 = terrain.userData.getHeight(x, z2) + gridOffsetY;

                vertices.push(x, y1, z1, x, y2, z2);

                const color = i === center ? colorCenter : colorGridLines;
                colors.push(color.r, color.g, color.b, color.r, color.g, color.b);
            }
        }

        // lines in x direction (parallel to x-axis)
        for (let j = 0; j < divisions; j++) {
            const z = -halfSize + i * step;
             for (let k = 0; k < lineSubdivisions; k++) {
                const x1 = -halfSize + j * step + k * subStep;
                const x2 = -halfSize + j * step + (k + 1) * subStep;
                
                const y1 = terrain.userData.getHeight(x1, z) + gridOffsetY;
                const y2 = terrain.userData.getHeight(x2, z) + gridOffsetY;

                vertices.push(x1, y1, z, x2, y2, z);

                const color = i === center ? colorCenter : colorGridLines;
                colors.push(color.r, color.g, color.b, color.r, color.g, color.b);
            }
        }
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.LineBasicMaterial({ vertexColors: true });
    
    const lines = new THREE.LineSegments(geometry, material);
    group.add(lines);

    /* @tweakable The vertical offset of grid labels from the ground. */
    const labelOffsetY = 0.2;

    const labelsGroup = new THREE.Group();
    labelsGroup.name = 'grid-labels-group'; // Add name for easy lookup
    group.add(labelsGroup);

    group.userData.isGridHelper = true;

    // Store data needed for dynamic label generation
    group.userData.terrain = terrain;
    group.userData.size = size;
    group.userData.divisions = divisions;
    group.userData.step = step;
    group.userData.halfSize = halfSize;
    group.userData.labelOffsetY = labelOffsetY;
    group.userData.labelsGroup = labelsGroup;
    group.userData.activeLabels = new Map();

    /**
     * Dynamically update which grid labels are displayed based on the
     * player's position. Labels are created only when needed and removed
     * when out of range to avoid excessive DOM nodes.
     *
     * @param {THREE.Vector3} playerPosition - The current player position.
     * @param {number} fullDist - Distance for full label density.
     * @param {number} lodDist - Distance for level-of-detail label density.
     * @param {number} lodStep - Step interval used when applying the LOD rule.
     */
    group.userData.updateLabels = function(playerPosition, fullDist, lodDist, lodStep) {
        const step = this.step;
        const halfSize = this.halfSize;
        const divisions = this.divisions;
        const labelOffsetY = this.labelOffsetY;
        const terrain = this.terrain;
        const cellRadius = Math.ceil(lodDist / step);
        const centerI = Math.floor((playerPosition.x + halfSize) / step);
        const centerJ = Math.floor((playerPosition.z + halfSize) / step);
        const visibleKeys = new Set();

        for (let i = centerI - cellRadius; i <= centerI + cellRadius; i++) {
            if (i < 0 || i >= divisions) continue;
            for (let j = centerJ - cellRadius; j <= centerJ + cellRadius; j++) {
                if (j < 0 || j >= divisions) continue;

                const x = -halfSize + (i + 0.5) * step;
                const z = -halfSize + (j + 0.5) * step;
                const y = terrain.userData.getHeight(x, z) + labelOffsetY;

                const dx = x - playerPosition.x;
                const dy = y - playerPosition.y;
                const dz = z - playerPosition.z;
                const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

                let visible = false;
                if (distance < fullDist) {
                    visible = true;
                } else if (distance < lodDist) {
                    visible = (i % lodStep === 0) && (j % lodStep === 0);
                }

                if (visible) {
                    const key = `${i},${j}`;
                    visibleKeys.add(key);
                    let label = this.activeLabels.get(key);
                    if (!label) {
                        const labelDiv = document.createElement('div');
                        labelDiv.className = 'grid-label';
                        labelDiv.textContent = `${toBase26(i)}${j + 1}`;

                        label = new CSS2DObject(labelDiv);
                        label.userData.gridIndices = { i, j };
                        this.labelsGroup.add(label);
                        this.activeLabels.set(key, label);
                    }
                    label.position.set(x, y, z);
                    label.visible = true;
                }
            }
        }

        // Remove labels that are no longer visible
        for (const [key, label] of this.activeLabels.entries()) {
            if (!visibleKeys.has(key)) {
                this.labelsGroup.remove(label);
                if (label.element && label.element.parentNode) {
                    label.element.remove();
                }
                this.activeLabels.delete(key);
            }
        }
    };

    /**
     * Remove all active labels and DOM elements.
     */
    group.userData.clearLabels = function() {
        for (const label of this.activeLabels.values()) {
            this.labelsGroup.remove(label);
            if (label.element && label.element.parentNode) {
                label.element.remove();
            }
        }
        this.activeLabels.clear();
    };

    return group;
}