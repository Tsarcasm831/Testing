export const golemPreset = {
  id: "golem",
  name: "Stone Golem",
  description: "A creature of rock and crystal.",
  spec: {
    customMode: true,
    features: [
      // Body
      {
        type: "box",
        /* @tweakable The main color of the golem's stone body. */
        color: "#8B8A88",
        position: { x: 0, y: 0.8, z: 0 },
        scale: { x: 1, y: 1.2, z: 0.8 },
        roughness: 0.9,
        metalness: 0.1,
      },
      // Head
      {
        type: "box",
        /* @tweakable The color of the golem's head. */
        color: "#7D7C7A",
        position: { x: 0, y: 1.7, z: 0 },
        scale: { x: 0.7, y: 0.7, z: 0.7 },
        roughness: 0.9,
        metalness: 0.1,
      },
      // Legs
      {
        type: "box",
        name: "leftLeg",
        color: "#7D7C7A",
        position: { x: -0.3, y: 0, z: 0 },
        scale: { x: 0.4, y: 0.8, z: 0.4 },
        roughness: 0.9,
        metalness: 0.1,
      },
      {
        type: "box",
        name: "rightLeg",
        color: "#7D7C7A",
        position: { x: 0.3, y: 0, z: 0 },
        scale: { x: 0.4, y: 0.8, z: 0.4 },
        roughness: 0.9,
        metalness: 0.1,
      },
      // Arms
      {
        type: "box",
        color: "#7D7C7A",
        position: { x: -0.8, y: 1.0, z: 0 },
        scale: { x: 0.4, y: 1.0, z: 0.4 },
        rotation: { x: 0, y: 0, z: 0.2 },
      },
      {
        type: "box",
        color: "#7D7C7A",
        position: { x: 0.8, y: 1.0, z: 0 },
        scale: { x: 0.4, y: 1.0, z: 0.4 },
        rotation: { x: 0, y: 0, z: -0.2 },
      },
      // Crystal Core
      {
        type: "cone",
        /* @tweakable The glowing color of the golem's crystal core. */
        color: "#2EFFF7",
        position: { x: 0, y: 1.2, z: 0.3 },
        scale: { x: 0.2, y: 0.3, z: 0.2 },
        roughness: 0.1,
        metalness: 0.5,
      },
    ],
  },
};