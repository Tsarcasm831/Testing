export const ogrePreset = {
  id: "ogre",
  name: "Ogre",
  description: "A big, burly ogre.",
  spec: {
    customMode: true,
    features: [
      // Body
      {
        type: "sphere",
        /* @tweakable The color of the ogre's skin. */
        color: "#9E9478",
        position: { x: 0, y: 0.8, z: 0 },
        scale: { x: 1.2, y: 1.4, z: 1 },
      },
      // Head
      {
        type: "sphere",
        color: "#9E9478",
        position: { x: 0, y: 1.8, z: 0 },
        scale: { x: 0.8, y: 0.8, z: 0.8 },
      },
      // Eyes
      {
        type: "sphere",
        color: "#FFFF00",
        position: { x: -0.2, y: 1.9, z: 0.35 },
        scale: { x: 0.1, y: 0.1, z: 0.1 },
      },
      {
        type: "sphere",
        color: "#FFFF00",
        position: { x: 0.2, y: 1.9, z: 0.35 },
        scale: { x: 0.1, y: 0.1, z: 0.1 },
      },
      // Tusks
      {
        type: "cone",
        color: "#F0E68C",
        position: { x: -0.15, y: 1.6, z: 0.4 },
        scale: { x: 0.1, y: 0.3, z: 0.1 },
        rotation: { x: 0.5, y: 0, z: -0.2 },
      },
      {
        type: "cone",
        color: "#F0E68C",
        position: { x: 0.15, y: 1.6, z: 0.4 },
        scale: { x: 0.1, y: 0.3, z: 0.1 },
        rotation: { x: 0.5, y: 0, z: 0.2 },
      },
      // Legs
      {
        type: "cylinder",
        name: "leftLeg",
        color: "#9E9478",
        position: { x: -0.4, y: 0, z: 0 },
        scale: { x: 0.4, y: 0.8, z: 0.4 },
      },
      {
        type: "cylinder",
        name: "rightLeg",
        color: "#9E9478",
        position: { x: 0.4, y: 0, z: 0 },
        scale: { x: 0.4, y: 0.8, z: 0.4 },
      },
    ],
  },
};