import * as THREE from 'three';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { CLUSTER_SIZE, GRID_CELL_SIZE } from './worldgen/constants.js';

/* @tweakable The size (in world units) of the dynamic grid rendered around the player. Smaller is better for performance. */
const DYNAMIC_GRID_SIZE = 200;
/* @tweakable How many frames to wait before updating the grid geometry. Higher values improve performance. */
const GRID_UPDATE_INTERVAL = 5;
/* @tweakable The maximum distance from the player at which grid labels are fully visible. */
export const GRID_LABEL_VISIBILITY_DISTANCE = 7;
/* @tweakable The distance at which grid labels begin to thin out (Level of Detail). */
export const GRID_LABEL_LOD_DISTANCE = 30;
/* @tweakable The step interval for thinning out labels at a distance (e.g., a value of 10 shows every 10th label). */
export const GRID_LABEL_LOD_STEP = 10;
/* @tweakable How many frames to wait before updating grid labels. Higher values improve performance but reduce responsiveness. */
export const LABEL_UPDATE_INTERVAL = 10;
/* @tweakable Set to true to link debug border visibility to grid visibility. */
const TOGGLE_DEBUG_BORDERS_WITH_GRID = true;

function toBase26(num) {
    let result = '';
    do {
        result = String.fromCharCode(65 + (num % 26)) + result;
        num = Math.floor(num / 26) - 1;
    } while (num >= 0);
    return result;
}

/**
 * Converts world coordinates to a grid cell identifier (e.g., A1, VVI801).
 * @param {THREE.Vector3} position - The world position (x, z).
 * @param {number} clusterSize - The total size of the world.
 * @param {number} cellSize - The size of a single grid cell.
 * @returns {string} The grid cell identifier.
 */
export function worldToGrid(position, clusterSize, cellSize) {
    const halfSize = clusterSize / 2;
    const colIndex = Math.floor((position.x + halfSize) / cellSize);
    const rowIndex = Math.floor((position.z + halfSize) / cellSize) + 1;
    const colName = toBase26(colIndex);
    return `${colName}${rowIndex}`;
}

export class GridManager {
    constructor(scene) {
        this.scene = scene;
        this.gridGroup = null;
        this.gridLines = null;
        this.labelsGroup = null;
        this.activeLabels = new Map();
        this.labelUpdateCounter = 0;
        this.gridUpdateCounter = 0;
        this.lastPlayerGridPos = new THREE.Vector2(Infinity, Infinity);
        this.terrain = null;
    }

    create(terrain) {
        this.terrain = terrain;
        this.gridGroup = new THREE.Group();
        this.gridGroup.visible = false;
        
        const divisions = DYNAMIC_GRID_SIZE / GRID_CELL_SIZE;
        const maxVertices = 2 * (divisions + 1) * divisions * 2; // Pre-allocate buffer
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(maxVertices * 3), 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(maxVertices * 3), 3));
        
        const material = new THREE.LineBasicMaterial({ vertexColors: true, depthTest: false });
        this.gridLines = new THREE.LineSegments(geometry, material);
        this.gridLines.renderOrder = 1; // Render grid on top of terrain
        this.gridGroup.add(this.gridLines);

        this.labelsGroup = new THREE.Group();
        this.labelsGroup.name = 'grid-labels-group';
        this.gridGroup.add(this.labelsGroup);

        this.scene.add(this.gridGroup);
    }
    
    toggle(playerPosition) {
        if (!this.gridGroup) return;
        this.gridGroup.visible = !this.gridGroup.visible;
        
        if (this.gridGroup.visible) {
            this.lastPlayerGridPos.set(Infinity, Infinity); // Force update
            this.updateGridGeometry(playerPosition);
            this.updateLabels(playerPosition);
        } else {
            this.clearLabels();
        }

        if (TOGGLE_DEBUG_BORDERS_WITH_GRID) {
            const newVisibility = this.gridGroup.visible;
            this.scene.traverse((obj) => {
                if (obj.userData.isDebugBorder) {
                    obj.visible = newVisibility;
                }
            });
        }

        this.scene.traverse((obj) => {
            if (obj.userData.isSeatLabel) {
                obj.visible = this.gridGroup.visible;
            }
        });
    }
    
    update(playerPosition) {
        if (!this.gridGroup || !this.gridGroup.visible) return;

        this.gridUpdateCounter++;
        if (this.gridUpdateCounter >= GRID_UPDATE_INTERVAL) {
            this.gridUpdateCounter = 0;
            this.updateGridGeometry(playerPosition);
        }

        this.labelUpdateCounter++;
        if (this.labelUpdateCounter >= LABEL_UPDATE_INTERVAL) {
            this.labelUpdateCounter = 0;
            this.updateLabels(playerPosition);
        }
    }
    
    updateGridGeometry(playerPosition) {
        if (!this.terrain) return;

        const playerGridX = Math.round(playerPosition.x / GRID_CELL_SIZE);
        const playerGridZ = Math.round(playerPosition.z / GRID_CELL_SIZE);
        
        if (this.lastPlayerGridPos.x === playerGridX && this.lastPlayerGridPos.y === playerGridZ) {
            return;
        }
        this.lastPlayerGridPos.set(playerGridX, playerGridZ);
        
        const vertices = [];
        const colors = [];
        
        const center_x = playerGridX * GRID_CELL_SIZE;
        const center_z = playerGridZ * GRID_CELL_SIZE;
        
        const halfGridSize = DYNAMIC_GRID_SIZE / 2;
        const divisions = DYNAMIC_GRID_SIZE / GRID_CELL_SIZE;
        const step = GRID_CELL_SIZE;

        const colorCenter = new THREE.Color(0xffffff);
        const colorGridLines = new THREE.Color(0xcccccc);
        const worldHalfSize = CLUSTER_SIZE / 2;
        const gridOffsetY = 0.05;

        for (let i = 0; i <= divisions; i++) {
            const x = center_x - halfGridSize + i * step;
            if (x < -worldHalfSize || x > worldHalfSize) continue;

            for (let j = 0; j < divisions; j++) {
                const z1 = center_z - halfGridSize + j * step;
                const z2 = z1 + step;
                if (Math.max(z1, z2) < -worldHalfSize || Math.min(z1, z2) > worldHalfSize) continue;
                
                const clampedZ1 = Math.max(-worldHalfSize, Math.min(worldHalfSize, z1));
                const clampedZ2 = Math.max(-worldHalfSize, Math.min(worldHalfSize, z2));

                const y1 = this.terrain.userData.getHeight(x, clampedZ1) + gridOffsetY;
                const y2 = this.terrain.userData.getHeight(x, clampedZ2) + gridOffsetY;

                vertices.push(x, y1, clampedZ1, x, y2, clampedZ2);
                const color = Math.abs(x) < step / 2 ? colorCenter : colorGridLines;
                colors.push(color.r, color.g, color.b, color.r, color.g, color.b);
            }
        }

        for (let i = 0; i <= divisions; i++) {
            const z = center_z - halfGridSize + i * step;
            if (z < -worldHalfSize || z > worldHalfSize) continue;

            for (let j = 0; j < divisions; j++) {
                const x1 = center_x - halfGridSize + j * step;
                const x2 = x1 + step;
                if (Math.max(x1, x2) < -worldHalfSize || Math.min(x1, x2) > worldHalfSize) continue;

                const clampedX1 = Math.max(-worldHalfSize, Math.min(worldHalfSize, x1));
                const clampedX2 = Math.max(-worldHalfSize, Math.min(worldHalfSize, x2));
                
                const y1 = this.terrain.userData.getHeight(clampedX1, z) + gridOffsetY;
                const y2 = this.terrain.userData.getHeight(clampedX2, z) + gridOffsetY;
                vertices.push(clampedX1, y1, z, clampedX2, y2, z);

                const color = Math.abs(z) < step / 2 ? colorCenter : colorGridLines;
                colors.push(color.r, color.g, color.b, color.r, color.g, color.b);
            }
        }

        const positionAttribute = this.gridLines.geometry.getAttribute('position');
        const colorAttribute = this.gridLines.geometry.getAttribute('color');
        
        positionAttribute.array.fill(0);
        positionAttribute.set(vertices, 0);
        positionAttribute.needsUpdate = true;
        
        colorAttribute.array.fill(0);
        colorAttribute.set(colors, 0);
        colorAttribute.needsUpdate = true;
        
        this.gridLines.geometry.setDrawRange(0, vertices.length / 3);
        this.gridLines.geometry.computeBoundingSphere();
    }
    
    updateLabels(playerPosition) {
        if (!this.terrain) return;
        const fullDist = GRID_LABEL_VISIBILITY_DISTANCE;
        const lodDist = GRID_LABEL_LOD_DISTANCE;
        const lodStep = GRID_LABEL_LOD_STEP;
        
        const step = GRID_CELL_SIZE;
        const worldHalfSize = CLUSTER_SIZE / 2;
        const worldDivisions = CLUSTER_SIZE / step;
        const labelOffsetY = 0.2;
        
        const cellRadius = Math.ceil(lodDist / step);
        const playerCellI = Math.floor((playerPosition.x + worldHalfSize) / step);
        const playerCellJ = Math.floor((playerPosition.z + worldHalfSize) / step);

        const visibleKeys = new Set();

        for (let i = playerCellI - cellRadius; i <= playerCellI + cellRadius; i++) {
            if (i < 0 || i >= worldDivisions) continue;
            for (let j = playerCellJ - cellRadius; j <= playerCellJ + cellRadius; j++) {
                if (j < 0 || j >= worldDivisions) continue;

                const x = -worldHalfSize + (i + 0.5) * step;
                const z = -worldHalfSize + (j + 0.5) * step;
                
                const dx = x - playerPosition.x;
                const dz = z - playerPosition.z;
                const distance = Math.sqrt(dx * dx + dz * dz);

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
                        const y = this.terrain.userData.getHeight(x, z) + labelOffsetY;

                        const labelDiv = document.createElement('div');
                        labelDiv.className = 'grid-label';
                        labelDiv.textContent = `${toBase26(i)}${j + 1}`;

                        label = new CSS2DObject(labelDiv);
                        label.position.set(x, y, z);
                        this.labelsGroup.add(label);
                        this.activeLabels.set(key, label);
                    }
                    label.visible = true;
                }
            }
        }
        
        for (const [key, label] of this.activeLabels.entries()) {
            if (!visibleKeys.has(key)) {
                label.visible = false;
            }
        }
    }
    
    clearLabels() {
        for (const label of this.activeLabels.values()) {
            this.labelsGroup.remove(label);
            if (label.element && label.element.parentNode) {
                label.element.remove();
            }
        }
        this.activeLabels.clear();
    }
}