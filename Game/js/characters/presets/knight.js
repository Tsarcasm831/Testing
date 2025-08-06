export const knightPreset = {
  id: "knight",
  name: "Armored Knight",
  description: "A knight in shining armor.",
  /* @tweakable The knight's conversation chain. */
  dialogue: [
    "Halt! State your business, citizen.",
    "The roads are dangerous. Keep your wits about you.",
    "I've sworn an oath to protect the innocent. A noble calling, wouldn't you say?",
    "Justice will prevail!"
  ],
  spec: {
    customMode: true,
    features: [
      // Torso
      {
        type: "box",
        /* @tweakable The color of the knight's armor. */
        color: "#C0C0C0",
        position: { x: 0, y: 0.8, z: 0 },
        scale: { x: 0.7, y: 1.0, z: 0.5 },
        roughness: 0.2,
        metalness: 0.9,
      },
      // Helmet
      {
        type: "sphere",
        color: "#C0C0C0",
        /* @tweakable The vertical position of the character's head. */
        position: { x: 0, y: 2.0, z: 0 },
        scale: { x: 0.5, y: 0.5, z: 0.5 },
        roughness: 0.2,
        metalness: 0.9,
      },
      // Helmet Plume
      {
        type: "cone",
        /* @tweakable The color of the knight's helmet plume. */
        color: "#FF0000",
        /* @tweakable The vertical position of the character's helmet plume. */
        position: { x: 0, y: 2.3, z: 0 },
        scale: { x: 0.1, y: 0.4, z: 0.1 },
      },
      // Legs
      {
        type: "cylinder",
        name: "leftLeg",
        color: "#A9A9A9",
        position: { x: -0.2, y: 0, z: 0 },
        scale: { x: 0.2, y: 0.8, z: 0.2 },
        roughness: 0.3,
        metalness: 0.8,
      },
      {
        type: "cylinder",
        name: "rightLeg",
        color: "#A9A9A9",
        position: { x: 0.2, y: 0, z: 0 },
        scale: { x: 0.2, y: 0.8, z: 0.2 },
        roughness: 0.3,
        metalness: 0.8,
      },
      // Arms
      {
        type: "cylinder",
        color: "#A9A9A9",
        position: { x: -0.5, y: 1.0, z: 0 },
        scale: { x: 0.15, y: 0.9, z: 0.15 },
        roughness: 0.3,
        metalness: 0.8,
      },
      {
        type: "cylinder",
        color: "#A9A9A9",
        position: { x: 0.5, y: 1.0, z: 0 },
        scale: { x: 0.15, y: 0.9, z: 0.15 },
        roughness: 0.3,
        metalness: 0.8,
      },
    ],
  },
};