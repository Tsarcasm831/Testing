export const plantCreaturePreset = {
  id: "plant_creature",
  name: "Forest Sprite",
  description: "A being of leaf and vine.",
  /* @tweakable The plant creature's conversation chain. */
  dialogue: [
    "*rustling leaves*",
    "The forest speaks... do you listen?",
    "We are all connected... root and branch.",
    "Feel the life of the world around you."
  ],
  spec: {
    customMode: true,
    features: [
      // Body (Vine)
      {
        type: "cylinder",
        /* @tweakable The color of the Forest Sprite's vine body. */
        color: "#4A3728",
        position: { x: 0, y: 0.7, z: 0 },
        scale: { x: 0.2, y: 1.4, z: 0.2 },
      },
      // Head
      {
        type: "sphere",
        /* @tweakable The color of the Forest Sprite's head. */
        color: "#6B8E23",
        position: { x: 0, y: 1.5, z: 0 },
        scale: { x: 0.4, y: 0.4, z: 0.4 },
      },
      // Flower on head
      {
        type: "cone",
        /* @tweakable The color of the flower on the Forest Sprite's head. */
        color: "#FFD700",
        position: { x: 0, y: 1.8, z: 0 },
        scale: { x: 0.3, y: 0.2, z: 0.3 },
        rotation: { x: Math.PI, y: 0, z: 0 },
      },
      // Legs
      {
        type: "cylinder",
        name: "leftLeg",
        color: "#4A3728",
        position: { x: -0.1, y: 0, z: 0 },
        scale: { x: 0.1, y: 0.6, z: 0.1 },
        roughness: 0.9,
        metalness: 0.1,
      },
      {
        type: "cylinder",
        name: "rightLeg",
        color: "#4A3728",
        position: { x: 0.1, y: 0, z: 0 },
        scale: { x: 0.1, y: 0.6, z: 0.1 },
        roughness: 0.9,
        metalness: 0.1,
      },
      // Leaves
      {
        type: "box",
        color: "#228B22",
        position: { x: -0.3, y: 1, z: 0 },
        scale: { x: 0.6, y: 0.1, z: 0.4 },
        rotation: { x: 0, y: 0.5, z: 0.3 },
      },
      {
        type: "box",
        color: "#228B22",
        position: { x: 0.3, y: 0.8, z: 0 },
        scale: { x: 0.6, y: 0.1, z: 0.4 },
        rotation: { x: 0, y: -0.5, z: -0.3 },
      },
    ],
  },
};