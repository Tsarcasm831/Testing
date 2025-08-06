import { robotsPreset } from './robots.js';
import { createSpectatorSpec } from './spectator.js';

export const crowdBot3Preset = {
  id: 'crowd_bot_3',
  name: 'Crowd Bot 3',
  description: 'A generic crowd robot variant 3.',
  /* @tweakable The conversation chain for this robot spectator. */
  dialogue: [
    "Logical. The performance is proceeding as anticipated.",
    "My power levels are stable, but my interest is peaking.",
    "I have recorded this event for future analysis.",
    "Statement: This is a satisfactory recreational activity."
  ],
  spec: {
    customMode: true,
    features: [
      {
        type: "sphere",
        /* @tweakable The color of the bot's body */
        color: "#999999",
        position: { x: 0, y: 0.9, z: 0 },
        /* @tweakable The scale of the bot's body */
        scale: { x: 0.8, y: 0.8, z: 0.8 },
        roughness: 0.1,
        metalness: 0.9,
      },
      {
        type: "cylinder",
        /* @tweakable The color of the bot's head */
        color: "#AAAAAA",
        position: { x: 0, y: 1.5, z: 0 },
        scale: { x: 0.4, y: 0.4, z: 0.4 },
        roughness: 0.2,
        metalness: 0.8,
      },
      {
        type: "cylinder",
        name: "leftLeg",
        color: "#777777",
        position: { x: -0.3, y: 0, z: 0 },
        scale: { x: 0.1, y: 1.0, z: 0.1 },
      },
      {
        type: "cylinder",
        name: "rightLeg",
        color: "#777777",
        position: { x: 0.3, y: 0, z: 0 },
        scale: { x: 0.1, y: 1.0, z: 0.1 },
      },
    ],
  },
  spectatorSpec: createSpectatorSpec('#999999') // Lighter grey
};