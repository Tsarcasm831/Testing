import { nursePreset } from './nurse.js';
import { createSpectatorSpec } from './spectator.js';

export const crowdFemale2Preset = {
  id: 'crowd_female_2',
  name: 'Crowd Female 2',
  description: 'A generic crowd female variant 2.',
  spec: {
    customMode: true,
    features: [
      { // Torso
        type: "box",
        /* @tweakable The color of the character's top */
        color: "#DC143C", // Crimson
        position: { x: 0, y: 0.75, z: 0 },
        scale: { x: 0.65, y: 0.8, z: 0.4 },
      },
      { // Skirt
        type: "cone",
        /* @tweakable The color of the character's skirt */
        color: "#D01030",
        position: { x: 0, y: 0.3, z: 0 },
        scale: { x: 0.5, y: 0.6, z: 0.5 },
      },
      { // Head
        type: "sphere",
        /* @tweakable The skin color of the character */
        color: "#8B4513", // SaddleBrown
        position: { x: 0, y: 1.4, z: 0 },
        scale: { x: 0.4, y: 0.4, z: 0.4 },
      },
      { // Left Leg
        type: "cylinder",
        name: "leftLeg",
        color: "#8B4513",
        position: { x: -0.15, y: 0, z: 0 },
        scale: { x: 0.15, y: 0.4, z: 0.15 },
      },
      { // Right Leg
        type: "cylinder",
        name: "rightLeg",
        color: "#8B4513",
        position: { x: 0.15, y: 0, z: 0 },
        scale: { x: 0.15, y: 0.4, z: 0.15 },
      },
    ],
  },
  spectatorSpec: createSpectatorSpec('#DC143C') // Crimson
};