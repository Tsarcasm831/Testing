/* @tweakable A flag to enable a workaround for a Three.js bug related to frustum culling. Disable this if you upgrade Three.js to a version higher than r160. */
export const FIX_FRUSTUM_CULLING_BUG = true;
/* @tweakable Use bounding box for frustum culling on complex models like robots. May improve performance and fix crashes. */
export const USE_BOUNDING_BOX_CULLING = true;
/* @tweakable NPC movement speed. */
export const NPC_SPEED = 0.03;
/* @tweakable How far the NPC wanders from its initial spawn point. */
export const WANDER_RADIUS = 20;
/* @tweakable Minimum time in seconds the NPC waits before wandering to a new spot. */
export const MIN_WANDER_WAIT_SECONDS = 5;
/* @tweakable Maximum time in seconds the NPC waits before wandering to a new spot. */
export const MAX_WANDER_WAIT_SECONDS = 15;
/* @tweakable The chance (from 0 to 1) that a spawned NPC will be a robot when animated robots are enabled. */
export const ROBOT_SPAWN_CHANCE = 0.25;
/* @tweakable The chance (from 0 to 1) that a spawned NPC will be an eyebot when eyebots are enabled. */
export const EYEBOT_SPAWN_CHANCE = 0.35;
/* @tweakable Adjectives to describe NPCs. An adjective is randomly picked from this list. */
export const NPC_ADJECTIVES = ["Wandering", "Mysterious", "Lost", "Curious", "Silent", "Ancient", "Jolly", "Grumpy"];
/* @tweakable Min NPCs per zone. */
export const MIN_NPCS_PER_ZONE = 1;
/* @tweakable Max NPCs per zone. This has a large impact on performance. */
export const MAX_NPCS_PER_ZONE = 4;
/* @tweakable Radius of active zones around player (in zones). 1 = 3x3 grid. */
export const ACTIVE_ZONE_RADIUS = 1;
/* @tweakable When an NPC is being interacted with, this is how long they will remain idle after the conversation ends. */
export const POST_INTERACTION_IDLE_SECONDS = 5;
/* @tweakable The scale of the animated robot NPCs. */
export const ROBOT_NPC_SCALE = 0.3;
/* @tweakable The scale of the animated chicken NPCs. */
export const CHICKEN_NPC_SCALE = 1.0;
/* @tweakable The scale of the animated wireframe NPCs. */
export const WIREFRAME_NPC_SCALE = 0.8;
/* @tweakable The scale of the animated alien NPCs. */
export const ALIEN_NPC_SCALE = 1.0;
/* @tweakable The scale of the eyebot NPCs. */
export const EYEBOT_NPC_SCALE = 0.5;
/* @tweakable Base height of eyebots above terrain. */
export const EYEBOT_FLY_HEIGHT = 2.0;
/* @tweakable Variation in eyebot flying height when wandering. */
export const EYEBOT_HEIGHT_VARIATION = 3.0;
/* @tweakable Minimum height for eyebots above terrain */
export const MIN_FLY_HEIGHT = 1.5;