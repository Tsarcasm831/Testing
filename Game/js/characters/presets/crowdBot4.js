import { robotsPreset } from './robots.js';
import { createSpectatorSpec } from './spectator.js';

export const crowdBot4Preset = {
  id: 'crowd_bot_4',
  name: 'Crowd Bot 4',
  description: 'A generic crowd robot variant 4.',
  /* @tweakable The conversation chain for this robot spectator. */
  dialogue: [
    "Observation: The crowd's enthusiasm is infectious.",
    "My programming did not prepare me for this level of auditory stimulation.",
    "Would it be illogical to dance?",
    "Conclusion: This is a positive experience."
  ],
  spec: {
    customMode: true,
    features: [
      {
        type: "box",
        /* @tweakable The color of the bot's body */
        color: "#777777",
        position: { x: 0, y: 0.6, z: 0 },
        /* @tweakable The scale of the bot's body */
        scale: { x: 1.0, y: 0.8, z: 0.8 },
        roughness: 0.5,
        metalness: 0.5,
      },
      {
        type: "box",
        /* @tweakable The color of the bot's head */
        color: "#999999",
        position: { x: 0, y: 1.2, z: 0 },
        scale: { x: 0.4, y: 0.4, z: 0.4 },
        roughness: 0.4,
        metalness: 0.6,
      },
      {
        type: "cylinder",
        name: "leftLeg",
        color: "#666666",
        position: { x: -0.3, y: 0, z: 0 },
        scale: { x: 0.25, y: 0.4, z: 0.25 },
      },
      {
        type: "cylinder",
        name: "rightLeg",
        color: "#666666",
        position: { x: 0.3, y: 0, z: 0 },
        scale: { x: 0.25, y: 0.4, z: 0.25 },
      },
    ],
  },
  spectatorSpec: createSpectatorSpec('#777777') // Robot base color
};