import { knightPreset } from './knight.js';
import { createSpectatorSpec } from './spectator.js';

export const crowdMale2Preset = {
  id: 'crowd_male_2',
  name: 'Crowd Male 2',
  description: 'A generic crowd male variant 2.',
  spec: {
    customMode: true,
    features: [
      { // Torso
        type: "box",
        /* @tweakable The color of the character's shirt */
        color: "#8B4513", // SaddleBrown
        position: { x: 0, y: 0.75, z: 0 },
        scale: { x: 0.8, y: 0.8, z: 0.5 },
      },
      { // Head
        type: "sphere",
        /* @tweakable The skin color of the character */
        color: "#C68642",
        position: { x: 0, y: 1.4, z: 0 },
        scale: { x: 0.45, y: 0.45, z: 0.45 },
      },
      { // Left Leg
        type: "cylinder",
        name: "leftLeg",
        /* @tweakable The color of the character's pants */
        color: "#2F4F4F", // DarkSlateGray
        position: { x: -0.2, y: 0, z: 0 },
        scale: { x: 0.22, y: 0.7, z: 0.22 },
      },
      { // Right Leg
        type: "cylinder",
        name: "rightLeg",
        color: "#2F4F4F",
        position: { x: 0.2, y: 0, z: 0 },
        scale: { x: 0.22, y: 0.7, z: 0.22 },
      },
    ],
  },
  spectatorSpec: createSpectatorSpec('#8B4513') // SaddleBrown
};