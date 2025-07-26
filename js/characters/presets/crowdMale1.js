import { knightPreset } from './knight.js';
import { createSpectatorSpec } from './spectator.js';

export const crowdMale1Preset = {
  id: 'crowd_male_1',
  name: 'Crowd Male 1',
  description: 'A generic crowd male variant 1.',
  /* @tweakable The conversation chain for this male spectator. */
  dialogue: [
    "Pretty good show, huh?",
    "I've seen them before, they're always great.",
    "Hope the weather holds up.",
    "Can you see okay from here?"
  ],
  spec: {
    customMode: true,
    features: [
      { // Torso
        type: "box",
        /* @tweakable The color of the character's shirt */
        color: "#4682B4", // SteelBlue
        position: { x: 0, y: 0.7, z: 0 },
        scale: { x: 0.7, y: 0.9, z: 0.4 },
      },
      { // Head
        type: "sphere",
        /* @tweakable The skin color of the character */
        color: "#F0D8C0",
        position: { x: 0, y: 1.35, z: 0 },
        scale: { x: 0.4, y: 0.4, z: 0.4 },
      },
      { // Left Leg
        type: "cylinder",
        name: "leftLeg",
        /* @tweakable The color of the character's pants */
        color: "#333333",
        position: { x: -0.18, y: 0, z: 0 },
        scale: { x: 0.2, y: 0.7, z: 0.2 },
      },
      { // Right Leg
        type: "cylinder",
        name: "rightLeg",
        color: "#333333",
        position: { x: 0.18, y: 0, z: 0 },
        scale: { x: 0.2, y: 0.7, z: 0.2 },
      },
    ],
  },
  spectatorSpec: createSpectatorSpec('#4682B4') // SteelBlue
};