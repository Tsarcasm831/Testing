import * as THREE from 'three';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

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
    /* @tweakable The number of grid cells to skip between rendering labels. Higher values improve performance. */
    const labelSkip = 8;

    for (let i = 0; i < divisions; i += labelSkip) {
        for (let j = 0; j < divisions; j += labelSkip) {
            const x = -halfSize + (i + 0.5 * labelSkip) * step;
            const z = -halfSize + (j + 0.5 * labelSkip) * step;
            const y = terrain.userData.getHeight(x, z) + labelOffsetY;

            const labelText = `${String.fromCharCode(65 + i)}${j + 1}`;
            
            const labelDiv = document.createElement('div');
            labelDiv.className = 'grid-label';
            labelDiv.textContent = labelText;
            
            const label = new CSS2DObject(labelDiv);
            label.position.set(x, y, z);
            labelsGroup.add(label);
        }
    }
    group.add(labelsGroup);
    group.userData.isGridHelper = true;

    return group;
}