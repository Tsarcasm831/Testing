import { robotsPreset } from './robots.js';
import { createSpectatorSpec } from './spectator.js';

export const crowdBot2Preset = {
  id: 'crowd_bot_2',
  name: 'Crowd Bot 2',
  description: 'A generic crowd robot variant 2.',
  spec: {
    customMode: true,
    features: [
      {
        type: "cylinder",
        /* @tweakable The color of the bot's body */
        color: "#666666",
        position: { x: 0, y: 0.8, z: 0 },
        scale: { x: 0.5, y: 1.2, z: 0.5 },
        roughness: 0.2,
        metalness: 0.8,
      },
      {
        type: "box",
        /* @tweakable The color of the bot's head */
        color: "#888888",
        position: { x: 0, y: 1.6, z: 0 },
        scale: { x: 0.6, y: 0.4, z: 0.6 },
        roughness: 0.3,
        metalness: 0.7,
      },
      {
        type: "cylinder",
        name: "leftLeg",
        color: "#555555",
        position: { x: -0.25, y: 0, z: 0 },
        scale: { x: 0.15, y: 0.8, z: 0.15 },
      },
      {
        type: "cylinder",
        name: "rightLeg",
        color: "#555555",
        position: { x: 0.25, y: 0, z: 0 },
        scale: { x: 0.15, y: 0.8, z: 0.15 },
      },
    ],
  },
  spectatorSpec: createSpectatorSpec('#666666') // Mid grey
};