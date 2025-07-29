/* @tweakable The size of a single zone. Affects NPC spawning density. Reload required. */
export const ZONE_SIZE = 50;
/* @tweakable Number of zones along one side of a chunk. Affects total world size. Reload required. */
export const ZONES_PER_CHUNK_SIDE = 5;
/* @tweakable Number of chunks along one side of a cluster. Affects total world size. Reload required. */
export const CHUNKS_PER_CLUSTER_SIDE = 16;

export const CHUNK_SIZE = ZONE_SIZE * ZONES_PER_CHUNK_SIDE;
export const CLUSTER_SIZE = CHUNK_SIZE * CHUNKS_PER_CLUSTER_SIDE;
export const SPAWN_SAFE_RADIUS = 10;

export const TERRAIN_AMPLITUDE = 10;
export const TERRAIN_SCALE = 80;
/* @tweakable The number of times the ground texture repeats within a zone. Lower values increase perceived texture resolution but may show tiling. Higher values decrease resolution. */
export const TERRAIN_TEXTURE_REPEAT_PER_ZONE = 50;
/* @tweakable The number of segments for the terrain geometry. Lower for better performance. A reload is required for this to take effect. */
export const TERRAIN_SEGMENTS = 200;
/* @tweakable The number of barriers generated per zone. Lower for better performance. Reload required. */
export const BARRIERS_PER_ZONE = 0.0025;
/* @tweakable The number of pillars generated per zone. Lower for better performance. Reload required. */
export const PILLARS_PER_ZONE = 0.001;
/* @tweakable The number of trees generated per zone. Lower for better performance. Reload required. */
export const TREES_PER_ZONE = 0.005;
/* @tweakable The total number of cloud groups to generate. Lower for better performance. A reload is required for this to take effect. */
export const CLOUD_COUNT = 20;

/* @tweakable The radius around the amphitheater to keep clear of trees and barriers. Reload required on change. */
export const AMPHITHEATRE_CLEARING_RADIUS = 60;

/* @tweakable The water level (y-coordinate) for bodies of water. Terrain below this level will be submerged. */
export const WATER_LEVEL = -2.0;

/* @tweakable The filename of the ground texture to use. Files live in
   `assets/ground_textures/`. Options: ground_texture.png,
   ground_texture_sand.png, ground_texture_dirt.png, ground_texture_stone.png,
   ground_texture_snow.png, ground_texture_forest.png */
export const GROUND_TEXTURE_FILENAME = 'assets/ground_textures/ground_texture.png';

/* @tweakable The radius of the central grass biome before it starts blending into other biomes. */
export const GRASS_RADIUS = 80.0;
/* @tweakable The width of the blend from the central grass biome to other biomes. */
export const GRASS_BLEND_WIDTH = 20.0;
/* @tweakable The width of the blend between biomes. Higher values create a smoother transition. */
export const BIOME_BLEND_WIDTH = 40.0;
/* @tweakable The starting height for stone to appear in the dirt/stone biome. */
export const STONE_START_HEIGHT = 2.0;
/* @tweakable The height range over which stone fully replaces dirt. */
export const STONE_TRANSITION_HEIGHT = 8.0;