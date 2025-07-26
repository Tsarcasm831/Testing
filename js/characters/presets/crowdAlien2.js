import { alienPreset } from './alien.js';
import { createSpectatorSpec } from './spectator.js';

export const crowdAlien2Preset = {
  id: 'crowd_alien_2',
  name: 'Crowd Alien 2',
  description: 'A generic crowd alien variant 2.',
  /* @tweakable The conversation chain for this alien spectator. */
  dialogue: [
    "Three eyes are better than one for watching this show.",
    "This is much better than the holo-dramas on my home world.",
    "I hope they sell snacks. I'm craving a nutrient paste.",
    "Fascinating... simply fascinating."
  ],
  spec: {
    customMode: true,
    features: [
      { // Body
        type: "box",
        /* @tweakable The color of the alien's body */
        color: "#48D1CC", // MediumTurquoise
        position: { x: 0, y: 0.7, z: 0 },
        scale: { x: 0.5, y: 1.0, z: 0.5 },
      },
      { // Head
        type: "box",
        color: "#40C0B8",
        position: { x: 0, y: 1.4, z: 0 },
        scale: { x: 0.7, y: 0.4, z: 0.7 },
      },
      { // Eyes (3)
        type: "sphere",
        color: "#FFFFFF",
        position: { x: 0, y: 1.5, z: 0.3 },
        scale: { x: 0.2, y: 0.2, z: 0.2 },
      },
      {
        type: "sphere",
        color: "#FFFFFF",
        position: { x: -0.25, y: 1.5, z: 0.25 },
        scale: { x: 0.15, y: 0.15, z: 0.15 },
      },
      {
        type: "sphere",
        color: "#FFFFFF",
        position: { x: 0.25, y: 1.5, z: 0.25 },
        scale: { x: 0.15, y: 0.15, z: 0.15 },
      },
      { // Left Leg
        type: "cylinder",
        name: "leftLeg",
        color: "#48D1CC",
        position: { x: -0.2, y: 0, z: 0 },
        scale: { x: 0.15, y: 0.4, z: 0.15 },
      },
      { // Right Leg
        type: "cylinder",
        name: "rightLeg",
        color: "#48D1CC",
        position: { x: 0.2, y: 0, z: 0 },
        scale: { x: 0.15, y: 0.4, z: 0.15 },
      },
    ],
  },
  spectatorSpec: createSpectatorSpec('#48D1CC') // MediumTurquoise
};