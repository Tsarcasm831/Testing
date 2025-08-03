export const shopkeeperPreset = {
  id: "shopkeeper",
  name: "Shopkeeper",
  description: "A friendly shopkeeper.",
  /* @tweakable The shopkeeper's conversation chain. */
  dialogue: [
    "Welcome to my humble shop! Feel free to browse my wares.",
    "Looking for anything in particular? I've got a bit of everything.",
    "Some say my prices are high, but quality has its cost, wouldn't you agree?",
    "Come back anytime!"
  ],
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
        /* @tweakable The vertical position of the character's head. */
        position: { x: 0, y: 1.8, z: 0 },
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
        visible: false,
        transparent: true,
        opacity: 0,
      },
    ],
  },
};