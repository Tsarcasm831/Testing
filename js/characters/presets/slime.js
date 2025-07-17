export const slimePreset = {
  id: "slime",
  name: "Jiggly Slime",
  description: "A wobbly, translucent slime.",
  spec: {
    customMode: true,
    features: [
      // Main Body
      {
        type: "sphere",
        /* @tweakable The color of the slime. */
        color: "#87CEEB",
        position: { x: 0, y: 0.5, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        transparent: true,
        opacity: 0.6,
        animation: { type: "jiggly" },
      },
      // Eyes
      {
        type: "sphere",
        color: "#000000",
        position: { x: -0.2, y: 0.7, z: 0.4 },
        scale: { x: 0.1, y: 0.1, z: 0.1 },
      },
      {
        type: "sphere",
        color: "#000000",
        position: { x: 0.2, y: 0.7, z: 0.4 },
        scale: { x: 0.1, y: 0.1, z: 0.1 },
      },
      // Internal Bubble
      {
        type: "sphere",
        color: "#FFFFFF",
        position: { x: 0, y: 0.4, z: 0 },
        scale: { x: 0.3, y: 0.3, z: 0.3 },
        transparent: true,
        opacity: 0.3,
        animation: { type: "bobUpDown" },
      },
    ],
  },
};
