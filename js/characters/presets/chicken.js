export const chickenPreset = {
  id: "chicken",
  name: "Chicken",
  description: "A cartoonish chicken",
  spec: {
    customMode: true,
    features: [
      // Body
      {
        type: "sphere",
        /* @tweakable Color of the chicken's body */
        color: "#ffffff",
        position: { x: 0, y: 0.5, z: 0 },
        scale: { x: 0.8, y: 0.6, z: 1 },
        roughness: 0.9,
        metalness: 0
      },
      // Head
      {
        type: "sphere",
        color: "#ffffff",
        position: { x: 0, y: 0.9, z: 0.5 },
        scale: { x: 0.5, y: 0.5, z: 0.5 },
        roughness: 0.9,
        metalness: 0
      },
      // Beak
      {
        type: "cone",
        /* @tweakable Color of the chicken's beak */
        color: "#ffa500",
        position: { x: 0, y: 0.85, z: 0.9 },
        scale: { x: 0.15, y: 0.4, z: 0.15 },
        rotation: { x: -Math.PI/2, y: 0, z: 0 },
        roughness: 0.7,
        metalness: 0
      },
      // Eyes
      {
        type: "sphere",
        color: "#000000",
        position: { x: -0.15, y: 1, z: 0.7 },
        scale: { x: 0.08, y: 0.08, z: 0.08 },
        roughness: 0.5,
        metalness: 0
      },
      {
        type: "sphere",
        color: "#000000",
        position: { x: 0.15, y: 1, z: 0.7 },
        scale: { x: 0.08, y: 0.08, z: 0.08 },
        roughness: 0.5,
        metalness: 0
      },
      // Wings
      {
        type: "box",
        /* @tweakable Color of the chicken's wings */
        color: "#eeeeee",
        position: { x: -0.7, y: 0.5, z: 0 },
        scale: { x: 0.8, y: 0.1, z: 0.6 },
        rotation: { x: 0, y: 0, z: -0.3 },
        roughness: 0.9,
        metalness: 0
      },
      {
        type: "box",
        color: "#eeeeee",
        position: { x: 0.7, y: 0.5, z: 0 },
        scale: { x: 0.8, y: 0.1, z: 0.6 },
        rotation: { x: 0, y: 0, z: 0.3 },
        roughness: 0.9,
        metalness: 0
      },
      // Legs
      {
        type: "cylinder",
        color: "#ffa500",
        position: { x: -0.2, y: 0, z: 0 },
        scale: { x: 0.08, y: 0.4, z: 0.08 },
        roughness: 0.7,
        metalness: 0,
        name: "leftLeg"
      },
      {
        type: "cylinder",
        color: "#ffa500",
        position: { x: 0.2, y: 0, z: 0 },
        scale: { x: 0.08, y: 0.4, z: 0.08 },
        roughness: 0.7,
        metalness: 0,
        name: "rightLeg"
      },
      // Tail
      {
        type: "box",
        color: "#eeeeee",
        position: { x: 0, y: 0.5, z: -0.6 },
        scale: { x: 0.4, y: 0.1, z: 0.3 },
        roughness: 0.9,
        metalness: 0
      }
    ],
    description: "A cartoonish chicken with animated legs"
  }
};