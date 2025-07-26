import { alienPreset } from './alien.js';
import { createSpectatorSpec } from './spectator.js';

export const crowdAlien3Preset = {
  id: 'crowd_alien_3',
  name: 'Crowd Alien 3',
  description: 'A generic crowd alien variant 3.',
  /* @tweakable The conversation chain for this alien spectator. */
  dialogue: [
    "My antennae are tingling with excitement!",
    "I'm picking up strange frequencies from the stage. Is that part of the show?",
    "Do you think they'll sign autographs after?",
    "This is worth the price of admission."
  ],
  spec: {
    customMode: true,
    features: [
      { // Body
        type: "cylinder",
        /* @tweakable The color of the alien's body */
        color: "#C71585", // MediumVioletRed
        position: { x: 0, y: 0.6, z: 0 },
        scale: { x: 0.6, y: 0.8, z: 0.6 },
      },
      { // Head
        type: "sphere",
        color: "#D02090",
        position: { x: 0, y: 1.2, z: 0 },
        scale: { x: 0.5, y: 0.5, z: 0.5 },
      },
      { // Antennae
        type: "cylinder",
        color: "#B01075",
        position: { x: -0.15, y: 1.5, z: 0 },
        scale: { x: 0.05, y: 0.4, z: 0.05 },
        rotation: {x: 0, y: 0, z: 0.3}
      },
      {
        type: "cylinder",
        color: "#B01075",
        position: { x: 0.15, y: 1.5, z: 0 },
        scale: { x: 0.05, y: 0.4, z: 0.05 },
        rotation: {x: 0, y: 0, z: -0.3}
      },
      { // Left Leg
        type: "cylinder",
        name: "leftLeg",
        color: "#C71585",
        position: { x: -0.2, y: 0, z: 0 },
        scale: { x: 0.18, y: 0.4, z: 0.18 },
      },
      { // Right Leg
        type: "cylinder",
        name: "rightLeg",
        color: "#C71585",
        position: { x: 0.2, y: 0, z: 0 },
        scale: { x: 0.18, y: 0.4, z: 0.18 },
      },
    ],
  },
  spectatorSpec: createSpectatorSpec('#C71585') // MediumVioletRed
};