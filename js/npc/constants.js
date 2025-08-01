/* @tweakable A flag to enable a workaround for a Three.js bug related to frustum culling. Disable this if you upgrade Three.js to a version higher than r160. */
export const FIX_FRUSTUM_CULLING_BUG = true;
/* @tweakable Use bounding box for frustum culling on complex models. May improve performance and fix crashes. Set to false for debugging culling issues. */
export const USE_BOUNDING_BOX_CULLING = true;
/* @tweakable NPC movement speed in units per second. */
export const NPC_SPEED = 1.8;
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
/* @tweakable The chance (from 0 to 1) that a spawned NPC will be an ogre when animated ogres are enabled. */
export const OGRE_SPAWN_CHANCE = 0.15;
/* @tweakable The chance (from 0 to 1) that a spawned NPC will be a knight when animated knights are enabled. */
export const KNIGHT_SPAWN_CHANCE = 0.15;
/* @tweakable Adjectives to describe NPCs. An adjective is randomly picked from this list. */
/* @tweakable The chance (from 0 to 1) that a spawned NPC will be a sprite when animated sprites are enabled. */
export const SPRITE_SPAWN_CHANCE = 0.2;
export const NPC_ADJECTIVES = ["Wandering", "Mysterious", "Lost", "Curious", "Silent", "Ancient", "Jolly", "Grumpy"];
/* @tweakable Min NPCs per zone. */
export const MIN_NPCS_PER_ZONE = 0;
/* @tweakable Max NPCs per zone. This has a large impact on performance. */
export const MAX_NPCS_PER_ZONE = 1;
/* @tweakable Radius of active zones around player (in zones). 0 = 1x1 grid, 1 = 3x3 grid. A lower number improves performance by having fewer active NPCs. */
export const ACTIVE_ZONE_RADIUS = 0;
/* @tweakable When an NPC is being interacted with, this is how long they will remain idle after the conversation ends. */
export const POST_INTERACTION_IDLE_SECONDS = 5;
/* @tweakable The scale of the animated robot NPCs. */
export const ROBOT_NPC_SCALE = 0.3;
/* @tweakable The scale of the animated chicken NPCs. */
export const CHICKEN_NPC_SCALE = 1.0;
/* @tweakable The scale of the animated wireframe NPCs. */
export const WIREFRAME_NPC_SCALE = 0.8;
/* @tweakable The vertical offset for wireframe NPCs to adjust their grounding. Negative values lower them. */
export const WIREFRAME_Y_OFFSET = -0.3;
/* @tweakable The scale of the animated alien NPCs. */
export const ALIEN_NPC_SCALE = 1.0;
/* @tweakable The scale of the animated shopkeeper NPC. */
export const SHOPKEEPER_NPC_SCALE = 1.0;
/* @tweakable The scale of the animated ogre NPCs. */
export const OGRE_NPC_SCALE = 1.2;
/* @tweakable The scale of the animated knight NPCs. */
export const KNIGHT_NPC_SCALE = 1.0;
/* @tweakable The scale of the animated sprite NPCs. */
export const SPRITE_NPC_SCALE = 1.0;
/* @tweakable The scale of the eyebot NPCs. */
export const EYEBOT_NPC_SCALE = 0.25;
/* @tweakable Base height of eyebots above terrain. */
export const EYEBOT_FLY_HEIGHT = 2.0;
/* @tweakable Variation in eyebot flying height when wandering. */
export const EYEBOT_HEIGHT_VARIATION = 3.0;
/* @tweakable Minimum height for eyebots above terrain */
export const MIN_FLY_HEIGHT = 1.5;