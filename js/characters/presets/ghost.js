export const ghostPreset = {
  id: "ghost",
  name: "Wandering Spirit",
  description: "A spectral apparition.",
  spec: {
    customMode: true,
    features: [
      // Body
      {
        type: "sphere",
        /* @tweakable The color of the ghost. */
        color: "#E0FFFF",
        position: { x: 0, y: 1.2, z: 0 },
        scale: { x: 0.8, y: 1.5, z: 0.8 },
        transparent: true,
        opacity: 0.7,
        animation: { type: "bobUpDown" },
      },
      // Tail
      {
        type: "sphere",
        color: "#E0FFFF",
        position: { x: 0, y: 0.5, z: 0 },
        scale: { x: 0.6, y: 0.6, z: 0.6 },
        transparent: true,
        opacity: 0.5,
      },
      // Eyes
      {
        type: "sphere",
        color: "#000000",
        position: { x: -0.2, y: 1.5, z: 0.35 },
        scale: { x: 0.1, y: 0.1, z: 0.05 },
        transparent: true,
        opacity: 0.8,
      },
      {
        type: "sphere",
        color: "#000000",
        position: { x: 0.2, y: 1.5, z: 0.35 },
        scale: { x: 0.1, y: 0.1, z: 0.05 },
        transparent: true,
        opacity: 0.8,
      },
       // Base for collision
      {
        type: "box",
        color: "#666666",
        position: { x: 0, y: 0, z: 0 },
        scale: { x: 0.5, y: 0.1, z: 0.3 },
        /* @tweakable Set to false if the invisible collision base for the ghost should not be rendered, even if transparent. */
        visible: false,
        transparent: true,
        opacity: 0,
      },
    ],
  },
};