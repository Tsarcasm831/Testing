import { robotsPreset } from './robots.js';
import { createSpectatorSpec } from './spectator.js';

export const crowdBot1Preset = {
  id: 'crowd_bot_1',
  name: 'Crowd Bot 1',
  description: 'A generic crowd robot variant 1.',
  /* @tweakable The conversation chain for this robot spectator. */
  dialogue: [
    "ANALYZING PERFORMANCE... RATING: 9.8/10.",
    "My auditory sensors are pleased.",
    "This is more stimulating than my prime directive.",
    "Calculating optimal applause trajectory."
  ],
  spec: {
    customMode: true,
    features: [
      {
        type: "box",
        /* @tweakable The color of the bot's body */
        color: "#555555",
        position: { x: 0, y: 0.7, z: 0 },
        scale: { x: 0.8, y: 1.0, z: 0.6 },
        roughness: 0.4,
        metalness: 0.6,
      },
      {
        type: "sphere",
        /* @tweakable The color of the bot's head */
        color: "#777777",
        /* @tweakable The vertical position of the character's head. */
        position: { x: 0, y: 1.9, z: 0 },
        scale: { x: 0.5, y: 0.5, z: 0.5 },
        roughness: 0.3,
        metalness: 0.7,
      },
      {
        type: "cylinder",
        name: "leftLeg",
        color: "#444444",
        position: { x: -0.2, y: 0, z: 0 },
        scale: { x: 0.2, y: 0.6, z: 0.2 },
      },
      {
        type: "cylinder",
        name: "rightLeg",
        color: "#444444",
        position: { x: 0.2, y: 0, z: 0 },
        scale: { x: 0.2, y: 0.6, z: 0.2 },
      },
    ],
  },
  spectatorSpec: createSpectatorSpec('#555555') // Darker grey
};