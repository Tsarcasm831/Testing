import { BASE_GROUND_Y, WALL_RADIUS, WALL_THICKNESS, WALL_HEIGHT } from './constants.js';

/**
 * Checks whether the given XZ position is over the top of the central wall.
 */
export function isOverWallTop(x, z) {
    const r = Math.sqrt(x * x + z * z);
    const inner = WALL_RADIUS - WALL_THICKNESS / 2;
    const outer = WALL_RADIUS + WALL_THICKNESS / 2;
    return r >= inner && r <= outer;
}

/**
 * Computes the ground Y at a given XZ position, accounting for wall surfaces.
 */
export function getGroundYAt(x, z) {
    if (isOverWallTop(x, z)) {
        return WALL_HEIGHT;
    }
    return BASE_GROUND_Y;
}
