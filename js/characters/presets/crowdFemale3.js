import { nursePreset } from './nurse.js';
import { createSpectatorSpec } from './spectator.js';

export const crowdFemale3Preset = {
  id: 'crowd_female_3',
  name: 'Crowd Female 3',
  description: 'A generic crowd female variant 3.',
  spec: {
    customMode: true,
    features: [
      { // Torso
        type: "box",
        /* @tweakable The color of the character's top */
        color: "#FFC0CB", // Pink
        position: { x: 0, y: 0.85, z: 0 },
        scale: { x: 0.55, y: 0.6, z: 0.35 },
      },
      { // Skirt
        type: "cone",
        /* @tweakable The color of the character's skirt */
        color: "#FFB0BB",
        position: { x: 0, y: 0.4, z: 0 },
        scale: { x: 0.45, y: 0.7, z: 0.45 },
      },
      { // Head
        type: "sphere",
        /* @tweakable The skin color of the character */
        color: "#FAEBD7", // AntiqueWhite
        position: { x: 0, y: 1.35, z: 0 },
        scale: { x: 0.35, y: 0.35, z: 0.35 },
      },
      { // Left Leg
        type: "cylinder",
        name: "leftLeg",
        color: "#FAEBD7",
        position: { x: -0.1, y: 0, z: 0 },
        scale: { x: 0.12, y: 0.5, z: 0.12 },
      },
      { // Right Leg
        type: "cylinder",
        name: "rightLeg",
        color: "#FAEBD7",
        position: { x: 0.1, y: 0, z: 0 },
        scale: { x: 0.12, y: 0.5, z: 0.12 },
      },
    ],
  },
  spectatorSpec: createSpectatorSpec('#FFC0CB') // Pink
};