/* @tweakable The size of a single zone. Affects NPC spawning density. Reload required. */
export const ZONE_SIZE = 50;
/* @tweakable Number of zones along one side of a chunk. Reload required. */
export const ZONES_PER_CHUNK_SIDE = 5;
/* @tweakable Number of chunks along one side of a cluster. Affects total world size. Reload required. */
export const CHUNKS_PER_CLUSTER_SIDE = 2;

export const CHUNK_SIZE = ZONE_SIZE * ZONES_PER_CHUNK_SIDE;
export const CLUSTER_SIZE = CHUNK_SIZE * CHUNKS_PER_CLUSTER_SIDE;
export const SPAWN_SAFE_RADIUS = 10;

export const TERRAIN_AMPLITUDE = 10;
export const TERRAIN_SCALE = 80;
export const TERRAIN_TEXTURE_REPEAT_PER_ZONE = 50;
export const TERRAIN_SEGMENTS = 250;
/* @tweakable The number of barriers generated per zone. Lower for better performance. Reload required. */
export const BARRIERS_PER_ZONE = 0.3;
export const PILLARS_PER_ZONE = 0.2;
/* @tweakable The number of trees generated per zone. Lower for better performance. Reload required. */
export const TREES_PER_ZONE = 0.5;
/* @tweakable The total number of cloud groups to generate. Lower for better performance. Reload required. */
export const CLOUD_COUNT = 100;

/* @tweakable The radius around the amphitheater to keep clear of trees and barriers. Reload required on change. */
export const AMPHITHEATRE_CLEARING_RADIUS = 60;