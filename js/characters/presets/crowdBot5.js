import { robotsPreset } from './robots.js';
import { createSpectatorSpec } from './spectator.js';

export const crowdBot5Preset = {
  id: 'crowd_bot_5',
  name: 'Crowd Bot 5',
  description: 'A generic crowd robot variant 5.',
  /* @tweakable The conversation chain for this robot spectator. */
  dialogue: [
    "My optical sensors are fully engaged.",
    "Processing... this is... fun.",
    "The performers are operating at peak efficiency.",
    "Initiating 'wave hands in the air' protocol."
  ],
  spec: {
    customMode: true,
    features: [
      {
        type: "cone",
        /* @tweakable The color of the bot's body */
        color: "#A9A9A9",
        position: { x: 0, y: 0.9, z: 0 },
        /* @tweakable The scale of the bot's body */
        scale: { x: 0.7, y: 1.4, z: 0.7 },
        roughness: 0.3,
        metalness: 0.7,
      },
      {
        type: "sphere",
        /* @tweakable The color of the bot's head */
        color: "#CCCCCC",
        position: { x: 0, y: 1.8, z: 0 },
        scale: { x: 0.3, y: 0.3, z: 0.3 },
        roughness: 0.2,
        metalness: 0.8,
      },
      {
        type: "cylinder",
        name: "leftLeg",
        color: "#888888",
        position: { x: -0.2, y: 0, z: 0 },
        scale: { x: 0.1, y: 0.4, z: 0.1 },
      },
      {
        type: "cylinder",
        name: "rightLeg",
        color: "#888888",
        position: { x: 0.2, y: 0, z: 0 },
        scale: { x: 0.1, y: 0.4, z: 0.1 },
      },
    ],
  },
  spectatorSpec: createSpectatorSpec('#A9A9A9') // DarkGray
};