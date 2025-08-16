/* @tweakable when true, use the expanded user defaults (includes all districts); when false, use the minimal defaults */
export const USE_EXPANDED_DISTRICTS = true;

import { DEFAULT_MODEL as DEFAULTS_MIN } from './defaults/index.js';
import { DEFAULT_MODEL as DEFAULTS_EXPANDED } from './user-defaults-data.js';

export const DEFAULT_MODEL = USE_EXPANDED_DISTRICTS ? DEFAULTS_EXPANDED : DEFAULTS_MIN;