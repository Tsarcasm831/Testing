import { alienPreset } from './alien.js';
import { createSpectatorSpec } from './spectator.js';

export const crowdAlien4Preset = {
  id: 'crowd_alien_4',
  name: 'Crowd Alien 4',
  description: 'A generic crowd alien variant 4.',
  /* @tweakable The conversation chain for this alien spectator. */
  dialogue: [
    "My eye stalk gives me the best view!",
    "I can't believe I'm seeing this live.",
    "I wonder what the atmospheric composition of this place is.",
    "Simply out of this world!"
  ],
  spec: {
    customMode: true,
    features: [
      { // Body
        type: "cone",
        /* @tweakable The color of the alien's body */
        color: "#9370DB", // MediumPurple
        position: { x: 0, y: 0.8, z: 0 },
        scale: { x: 0.7, y: 1.2, z: 0.7 },
      },
      { // Head
        type: "sphere",
        color: "#8A63D2",
        position: { x: 0, y: 1.6, z: 0 },
        scale: { x: 0.5, y: 0.5, z: 0.5 },
      },
      { // Eye Stalk
        type: "cylinder",
        color: "#8A63D2",
        position: { x: 0, y: 1.9, z: 0 },
        scale: { x: 0.1, y: 0.4, z: 0.1 },
      },
       { // Eye on Stalk
        type: "sphere",
        color: "#FFFFFF",
        position: { x: 0, y: 2.1, z: 0 },
        scale: { x: 0.2, y: 0.2, z: 0.2 },
      },
      { // Left Leg
        type: "cylinder",
        name: "leftLeg",
        color: "#9370DB",
        position: { x: -0.25, y: 0, z: 0 },
        scale: { x: 0.15, y: 0.4, z: 0.15 },
      },
      { // Right Leg
        type: "cylinder",
        name: "rightLeg",
        color: "#9370DB",
        position: { x: 0.25, y: 0, z: 0 },
        scale: { x: 0.15, y: 0.4, z: 0.15 },
      },
    ],
  },
  spectatorSpec: createSpectatorSpec('#9370DB') // MediumPurple
};