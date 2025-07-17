export const shopkeeperPreset = {
  id: "shopkeeper",
  name: "Shopkeeper",
  description: "A friendly shopkeeper.",
  spec: {
    customMode: true,
    features: [
      // Body
      {
        type: "box",
        color: "#5a4a3a",
        position: { x: 0, y: 0.7, z: 0 },
        scale: { x: 0.6, y: 0.8, z: 0.4 },
      },
      // Head
      {
        type: "sphere",
        color: "#f2d6b5",
        position: { x: 0, y: 1.3, z: 0 },
        scale: { x: 0.4, y: 0.4, z: 0.4 },
      },
      // Legs
      {
        type: "cylinder",
        color: "#4a3a2a",
        position: { x: -0.15, y: 0.3, z: 0 },
        scale: { x: 0.15, y: 0.6, z: 0.15 },
        name: "leftLeg",
      },
      {
        type: "cylinder",
        color: "#4a3a2a",
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
