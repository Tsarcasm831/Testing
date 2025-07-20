export const tavernkeepPreset = {
  id: "tavernkeep",
  name: "Tavernkeep",
  description: "A friendly tavernkeep.",
  spec: {
    customMode: true,
    features: [
      // Body (shirt)
      {
        type: "box",
        /* @tweakable Color of the tavernkeep's shirt. */
        color: "#F5DEB3", // Wheat
        position: { x: 0, y: 0.7, z: 0 },
        scale: { x: 0.6, y: 0.8, z: 0.4 },
      },
      // Apron
      {
        type: "box",
        /* @tweakable Color of the tavernkeep's apron. */
        color: "#FFFFFF",
        position: { x: 0, y: 0.6, z: 0.21 },
        scale: { x: 0.5, y: 0.6, z: 0.02 },
      },
      // Head
      {
        type: "sphere",
        /* @tweakable Color of the tavernkeep's skin. */
        color: "#f2d6b5",
        position: { x: 0, y: 1.3, z: 0 },
        scale: { x: 0.4, y: 0.4, z: 0.4 },
      },
      // Legs (trousers)
      {
        type: "cylinder",
        /* @tweakable Color of the tavernkeep's trousers. */
        color: "#8B4513", // SaddleBrown
        position: { x: -0.15, y: 0.3, z: 0 },
        scale: { x: 0.15, y: 0.6, z: 0.15 },
        name: "leftLeg",
      },
      {
        type: "cylinder",
        color: "#8B4513",
        position: { x: 0.15, y: 0.3, z: 0 },
        scale: { x: 0.15, y: 0.6, z: 0.15 },
        name: "rightLeg",
      },
      // Base for collision
      {
        type: "box",
        color: "#666666",
        position: { x: 0, y: 0, z: 0 },
        scale: { x: 0.5, y: 0.1, z: 0.3 },
        transparent: true,
        opacity: 0,
      },
    ],
  },
};