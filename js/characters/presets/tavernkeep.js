export const tavernkeepPreset = {
  id: "tavernkeep",
  name: "Tavernkeep",
  description: "A friendly tavernkeep.",
  /* @tweakable The tavernkeep's conversation chain. */
  dialogue: [
    "Welcome, traveler! Pull up a chair and rest your weary feet.",
    "What can I get for you? We've got the best digital grog this side of the server!",
    "Heard any interesting tales on your travels? This old tavern has heard them all.",
    "Don't cause any trouble, now. We like to keep things peaceful here."
  ],
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
        /* @tweakable Set to false if the invisible collision base for the tavernkeep should not be rendered, even if transparent. */
        visible: false,
        transparent: true,
        opacity: 0,
      },
    ],
  },
};