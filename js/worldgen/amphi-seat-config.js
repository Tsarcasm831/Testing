import * as THREE from 'three'; // for any type hints needed in future

/* @tweakable Set to true to enable collision for amphitheater seats. */
export const SEAT_COLLISION_ENABLED = true;
/* @tweakable Set to true to spawn crowd NPCs in the amphitheater seats. NOTE: This may contribute to loading timeouts on some platforms. */
export const SPAWN_CROWD_NPCS = false;
/* @tweakable The number of segments to approximate the curve of each seat row. More segments are more accurate but less performant. */
export const SEAT_ROW_SEGMENTS = 20;
/* @tweakable Set to true to spawn crowd NPCs in the amphitheater seats. NOTE: This may contribute to loading timeouts on some platforms. */
export const SPAWN_CROWD_NPCS_DEPRECATED = true;
/* @tweakable Set to true to use simplified, low-poly models for crowd NPCs to improve performance. */
export const USE_SPECTATOR_MODELS = true;
/* @tweakable Set to true to enable collision for the foundation under the seats. */
export const SEAT_FOUNDATION_COLLISION_ENABLED = true;
/* @tweakable Set to true to show a visible outline box for debugging seat row collision. */
export const DEBUG_SEAT_COLLISION_BOX = true;
/* @tweakable The color of the debug collision box for seat rows. */
export const DEBUG_SEAT_COLLISION_BOX_COLOR = 0xffff00;
/* @tweakable Set to true to show a visible outline box for debugging the seat foundation collision. */
export const DEBUG_FOUNDATION_COLLISION_BOX = true;
/* @tweakable The color of the debug collision box for the seat foundation. */
export const DEBUG_FOUNDATION_COLLISION_BOX_COLOR = 0xff00ff;
/* @tweakable Set to true to show a visible outline box for debugging individual seats. */
export const DEBUG_INDIVIDUAL_SEAT_BOX = true;
/* @tweakable The color of the debug collision box for individual seats. */
export const DEBUG_INDIVIDUAL_SEAT_BOX_COLOR = 0xffa500;

/* @tweakable Vertical offset for simplified spectator NPCs to position them in a sitting posture on seats. */
export const spectatorNpcVerticalOffset = -0.4;
/* @tweakable Vertical offset for full-detail crowd NPCs to position them on seats. May require adjustment if they appear to float or sink. */
export const fullNpcVerticalOffset = 0;

/* @tweakable Set to true to add stairs leading to the amphitheater seats. */
export const ENABLE_SEATING_STAIRS = true;
/* @tweakable Set to true to enable collision on the amphitheater stairs. */
export const SEATING_STAIRS_COLLISION_ENABLED = true;
/* @tweakable The number of segments for the seating foundation's collision mesh. Higher values are more accurate but less performant. */
export const SEAT_FOUNDATION_COLLISION_SEGMENTS = 40;