export const alienPreset = {
  id: "alien",
  name: "Alien",
  description: "A colorful alien character",
  spec: {
    customMode: true,
    features: [
      // Main alien body
      {
        type: "sphere",
        /* @tweakable The color of the alien's body. */
        color: "#FF6B6B",
        position: { x: 0, y: 0.6, z: 0 },
        scale: { x: 0.6, y: 0.9, z: 0.6 },
        roughness: 0.9,
        metalness: 0.1
      },
      // Bottom part (slightly larger)
      {
        type: "sphere",
        /* @tweakable The color of the alien's lower body. */
        color: "#FF6B6B",
        position: { x: 0, y: 0.3, z: 0 },
        scale: { x: 0.7, y: 0.5, z: 0.7 },
        roughness: 0.9,
        metalness: 0.1
      },
      // Eyes (white part)
      {
        type: "sphere",
        color: "#FFFFFF",
        position: { x: -0.2, y: 0.8, z: 0.4 },
        scale: { x: 0.2, y: 0.2, z: 0.1 },
        roughness: 0.5,
        metalness: 0
      },
      {
        type: "sphere",
        color: "#FFFFFF",
        position: { x: 0.2, y: 0.8, z: 0.4 },
        scale: { x: 0.2, y: 0.2, z: 0.1 },
        roughness: 0.5,
        metalness: 0
      },
      // Pupils
      {
        type: "sphere",
        color: "#000000",
        position: { x: -0.2, y: 0.8, z: 0.5 },
        scale: { x: 0.1, y: 0.1, z: 0.05 },
        roughness: 0.5,
        metalness: 0
      },
      {
        type: "sphere",
        color: "#000000",
        position: { x: 0.2, y: 0.8, z: 0.5 },
        scale: { x: 0.1, y: 0.1, z: 0.05 },
        roughness: 0.5,
        metalness: 0
      },
      // Stubby legs
      {
        type: "cylinder",
        /* @tweakable The color of the alien's legs. */
        color: "#FF6B6B",
        position: { x: -0.3, y: 0, z: 0 },
        scale: { x: 0.15, y: 0.3, z: 0.15 },
        roughness: 0.9,
        metalness: 0.1,
        name: "leftLeg"
      },
      {
        type: "cylinder",
        /* @tweakable The color of the alien's legs. */
        color: "#FF6B6B",
        position: { x: 0.3, y: 0, z: 0 },
        scale: { x: 0.15, y: 0.3, z: 0.15 },
        roughness: 0.9,
        metalness: 0.1,
        name: "rightLeg"
      }
    ],
    description: "A cute alien character with stubby legs"
  }
};