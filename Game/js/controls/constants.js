/* @tweakable Base movement speed for the player. */
export const SPEED = 0.08;
/* @tweakable Gravity force applied to the player. */
export const GRAVITY = 0.01;
/* @tweakable The upward force applied when jumping. */
export const JUMP_FORCE = 0.25;
/* @tweakable The upward force applied when jumping on mobile. */
export const MOBILE_JUMP_FORCE = 0.25;
/* @tweakable Speed multiplier for mobile joystick controls. */
export const MOBILE_SPEED_MULTIPLIER = 1.0;
/* @tweakable Multiplier for player speed when running. */
export const RUN_SPEED_MULTIPLIER = 1.8;

/* @tweakable Multiplier for player speed when sprinting (super-running). This is applied on top of the base speed. */
export const SPRINT_SPEED_MULTIPLIER = 3.6;

/* @tweakable Force mobile controls for testing on desktop. Reload is required. */
export const FORCE_MOBILE_MODE = false;