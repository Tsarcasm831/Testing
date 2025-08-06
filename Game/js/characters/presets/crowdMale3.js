import { knightPreset } from './knight.js';
import { createSpectatorSpec } from './spectator.js';

export const crowdMale3Preset = {
  id: 'crowd_male_3',
  name: 'Crowd Male 3',
  description: 'A generic crowd male variant 3.',
  /* @tweakable The conversation chain for this male spectator. */
  dialogue: [
    "What a performance!",
    "This is way better than staying home.",
    "I'm impressed.",
    "I wonder if they sell merchandise."
  ],
  spec: {
    customMode: true,
    features: [
      { // Torso
        type: "box",
        /* @tweakable The color of the character's shirt */
        color: "#556B2F", // DarkOliveGreen
        position: { x: 0, y: 0.7, z: 0 },
        scale: { x: 0.6, y: 1.0, z: 0.4 },
      },
      { // Head
        type: "sphere",
        /* @tweakable The skin color of the character */
        color: "#FFE4C4", // Bisque
        /* @tweakable The vertical position of the character's head. */
        position: { x: 0, y: 1.9, z: 0 },
        scale: { x: 0.4, y: 0.4, z: 0.4 },
      },
      { // Left Leg
        type: "cylinder",
        name: "leftLeg",
        /* @tweakable The color of the character's pants */
        color: "#465945",
        position: { x: -0.15, y: 0, z: 0 },
        scale: { x: 0.18, y: 0.8, z: 0.18 },
      },
      { // Right Leg
        type: "cylinder",
        name: "rightLeg",
        color: "#465945",
        position: { x: 0.15, y: 0, z: 0 },
        scale: { x: 0.18, y: 0.8, z: 0.18 },
      },
    ],
  },
  spectatorSpec: createSpectatorSpec('#556B2F') // DarkOliveGreen
};