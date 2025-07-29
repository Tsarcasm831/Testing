# World Grid and Coordinate System

## Introduction

This document provides a detailed explanation of the world's coordinate system, its boundaries, and the grid overlay used for orientation and object placement. Understanding these concepts is crucial for both manual building and programmatic world generation.

## World Coordinates

The world uses a right-handed 3D Cartesian coordinate system:
-   **X-axis**: Represents East (positive) and West (negative).
-   **Z-axis**: Represents South (positive) and North (negative).
-   **Y-axis**: Represents vertical height (Up/Down). The ground level is not flat; its Y-coordinate varies across the terrain.

## World Boundaries

The world is a large, square area with defined limits to ensure performance and prevent players from getting lost.

-   **Total Size**: The world is **4000x4000** units wide. This can be configured in `js/worldgen/constants.js`.
-   **Coordinate Range**:
    -   The **X-axis** ranges from **-2000** to **+2000**.
    -   The **Z-axis** ranges from **-2000** to **+2000**.
-   **Boundary Walls**: The world is enclosed by invisible walls. Players and physics-enabled objects cannot move beyond these boundaries.

## The Grid System

To aid in navigation and object placement, a grid overlay can be toggled by pressing the **'G' key**.

-   **Cell Naming**: The grid uses a spreadsheet-style naming convention. Columns are identified by letters (A, B, ..., Z, AA, AB, ...), and rows are identified by numbers. For example, `A1`, `DH41`.
-   **Cell Size**: Each grid cell is **50x50** world units. This value can be adjusted via the `GRID_CELL_SIZE` constant in `js/gridManager.js`.
-   **Grid Dimensions**: The entire world is covered by an **80x80** grid of these cells (4000 units / 50 units per cell = 80 divisions).

## Coordinate Conversion

It's often useful to convert between world coordinates (X, Z) and grid cell identifiers.

### World to Grid

To find the grid cell for a given world coordinate `(x, z)`:

```javascript
import { CLUSTER_SIZE } from './js/worldgen/constants.js';
import { GRID_CELL_SIZE } from './js/gridManager.js';

function toBase26(num) {
    let result = '';
    do {
        result = String.fromCharCode(65 + (num % 26)) + result;
        num = Math.floor(num / 26) - 1;
    } while (num >= 0);
    return result;
}

function worldToGrid(x, z) {
    const halfSize = CLUSTER_SIZE / 2;
    const colIndex = Math.floor((x + halfSize) / GRID_CELL_SIZE);
    const rowIndex = Math.floor((z + halfSize) / GRID_CELL_SIZE) + 1;
    const colName = toBase26(colIndex);
    return `${colName}${rowIndex}`;
}

// Example:
console.log(worldToGrid(0, 0)); // "DH41" - Center of the world
console.log(worldToGrid(-2000, -2000)); // "A1" - Top-left corner

