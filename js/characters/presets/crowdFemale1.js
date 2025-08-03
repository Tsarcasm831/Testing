import { nursePreset } from './nurse.js';
import { createSpectatorSpec } from './spectator.js';

export const crowdFemale1Preset = {
  id: 'crowd_female_1',
  name: 'Crowd Female 1',
  description: 'A generic crowd female variant 1.',
  /* @tweakable The conversation chain for this female spectator. */
  dialogue: [
    "I can't believe how good this is!",
    "I'm so glad we came.",
    "Do you think they'll play my favorite song?",
    "What a lovely day for a show."
  ],
  spec: {
    customMode: true,
    features: [
      { // Torso
        type: "box",
        /* @tweakable The color of the character's top */
        color: "#ADD8E6", // LightBlue
        position: { x: 0, y: 0.8, z: 0 },
        scale: { x: 0.6, y: 0.7, z: 0.4 },
      },
      { // Skirt
        type: "cone",
        /* @tweakable The color of the character's skirt */
        color: "#A0D0E0",
        position: { x: 0, y: 0.35, z: 0 },
        scale: { x: 0.4, y: 0.5, z: 0.4 },
      },
      { // Head
        type: "sphere",
        /* @tweakable The skin color of the character */
        color: "#F5DEB3", // Wheat
        /* @tweakable The vertical position of the character's head. */
        position: { x: 0, y: 1.85, z: 0 },
        scale: { x: 0.4, y: 0.4, z: 0.4 },
      },
      { // Left Leg
        type: "cylinder",
        name: "leftLeg",
        color: "#F5DEB3",
        position: { x: -0.15, y: 0, z: 0 },
        scale: { x: 0.15, y: 0.4, z: 0.15 },
      },
      { // Right Leg
        type: "cylinder",
        name: "rightLeg",
        color: "#F5DEB3",
        position: { x: 0.15, y: 0, z: 0 },
        scale: { x: 0.15, y: 0.4, z: 0.15 },
      },
    ],
  },
  spectatorSpec: createSpectatorSpec('#ADD8E6') // LightBlue
};