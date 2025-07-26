import { alienPreset } from './alien.js';
import { createSpectatorSpec } from './spectator.js';

export const crowdAlien1Preset = {
  id: 'crowd_alien_1',
  name: 'Crowd Alien 1',
  description: 'A generic crowd alien variant 1.',
  /* @tweakable The conversation chain for this alien spectator. */
  dialogue: [
    "What a performance!",
    "I've traveled light-years to see this.",
    "My single eye has never witnessed such a spectacle.",
    "Is this what you Earthlings call 'entertainment'?"
  ],
  spec: {
    customMode: true,
    features: [
      { // Body
        type: "sphere",
        /* @tweakable The color of the alien's body */
        color: "#FF6B6B",
        position: { x: 0, y: 0.7, z: 0 },
        scale: { x: 0.8, y: 1.0, z: 0.8 },
      },
      { // Head/Eye
        type: "sphere",
        color: "#FFFFFF",
        position: { x: 0, y: 1.4, z: 0.2 },
        scale: { x: 0.6, y: 0.6, z: 0.6 },
      },
      { // Pupil
        type: "sphere",
        color: "#000000",
        position: { x: 0, y: 1.4, z: 0.5 },
        scale: { x: 0.3, y: 0.3, z: 0.1 },
      },
      { // Left Leg
        type: "cylinder",
        name: "leftLeg",
        color: "#FF6B6B",
        position: { x: -0.3, y: 0, z: 0 },
        scale: { x: 0.2, y: 0.4, z: 0.2 },
      },
      { // Right Leg
        type: "cylinder",
        name: "rightLeg",
        color: "#FF6B6B",
        position: { x: 0.3, y: 0, z: 0 },
        scale: { x: 0.2, y: 0.4, z: 0.2 },
      },
    ],
  },
  spectatorSpec: createSpectatorSpec('#FF6B6B') // Alien body color
};