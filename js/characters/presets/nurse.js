export const nursePreset = {
  id: "nurse",
  name: "Nurse",
  description: "A helpful nurse.",
  /* @tweakable The nurse's conversation chain. */
  dialogue: [
    "Feeling under the weather? You've come to the right place.",
    "Remember to stay hydrated out there. The world can be draining.",
    "If you see anyone injured, send them my way. I'll patch them right up.",
    "Take care of yourself!"
  ],
  spec: {
    customMode: true,
    features: [
      // Body
      {
        type: "box",
        /* @tweakable Color of the nurse's uniform. */
        color: "#FFFFFF",
        position: { x: 0, y: 0.7, z: 0 },
        scale: { x: 0.6, y: 0.8, z: 0.4 },
      },
      // Red Cross on body
      {
        type: "box",
        /* @tweakable Color of the cross on the nurse's uniform. */
        color: "#FF0000",
        position: { x: 0, y: 0.9, z: 0.21 },
        scale: { x: 0.15, y: 0.05, z: 0.01 },
      },
      {
        type: "box",
        color: "#FF0000",
        position: { x: 0, y: 0.9, z: 0.21 },
        scale: { x: 0.05, y: 0.15, z: 0.01 },
      },
      // Head
      {
        type: "sphere",
        /* @tweakable Color of the nurse's skin. */
        color: "#f2d6b5",
        position: { x: 0, y: 1.3, z: 0 },
        scale: { x: 0.4, y: 0.4, z: 0.4 },
      },
      // Legs
      {
        type: "cylinder",
        color: "#FFFFFF",
        position: { x: -0.15, y: 0.3, z: 0 },
        scale: { x: 0.15, y: 0.6, z: 0.15 },
        name: "leftLeg",
      },
      {
        type: "cylinder",
        color: "#FFFFFF",
        position: { x: 0.15, y: 0.3, z: 0 },
        scale: { x: 0.15, y: 0.6, z: 0.15 },
        name: "rightLeg",
      },
      // Base for collision
      {
        type: "box",
        color: "#666666",
        position: { x: 0, y: 0.3, z: 0 },
        /* @tweakable The size of the nurse's collision volume. */
        scale: { x: 0.6, y: 0.6, z: 0.4 },
        /* @tweakable Set to false if the invisible collision base for the nurse should not be rendered, even if transparent. */
        visible: false,
        transparent: true,
        opacity: 0,
      },
    ],
  },
};