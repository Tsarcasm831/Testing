export const robotsPreset = {
  id: "robots",
  name: "Robots",
  description: "A walking robot.",
  spec: {
    customMode: true,
    features: [
      {
        type: "box",
        /* @tweakable Color of the robot's base */
        color: "#777777",
        position: { x: 0, y: 0.5, z: 0 },
        scale: { x: 1.2, y: 1, z: 1.2 },
        roughness: 0.8,
        metalness: 0.5,
        name: "base"
      },
      // Vertical bars
      {
        type: "cylinder",
        /* @tweakable Color of the robot's frame bars */
        color: "#333333",
        position: { x: -0.5, y: 0.5, z: -0.5 },
        scale: { x: 0.1, y: 2, z: 0.1 },
        roughness: 0.5,
        metalness: 0.8
      },
      {
        type: "cylinder",
        color: "#333333",
        position: { x: 0.5, y: 0.5, z: -0.5 },
        scale: { x: 0.1, y: 2, z: 0.1 },
        roughness: 0.5,
        metalness: 0.8
      },
      {
        type: "cylinder",
        color: "#333333",
        position: { x: -0.5, y: 0.5, z: 0.5 },
        scale: { x: 0.1, y: 2, z: 0.1 },
        roughness: 0.5,
        metalness: 0.8
      },
      {
        type: "cylinder",
        color: "#333333",
        position: { x: 0.5, y: 0.5, z: 0.5 },
        scale: { x: 0.1, y: 2, z: 0.1 },
        roughness: 0.5,
        metalness: 0.8
      },
      // Horizontal bars
      {
        type: "cylinder",
        color: "#333333",
        position: { x: 0, y: 0, z: -0.5 },
        scale: { x: 0.1, y: 1, z: 0.1 },
        rotation: { x: 0, y: 0, z: Math.PI/2 },
        roughness: 0.5,
        metalness: 0.8
      },
      {
        type: "cylinder",
        color: "#333333",
        position: { x: 0, y: 1, z: -0.5 },
        scale: { x: 0.1, y: 1, z: 0.1 },
        rotation: { x: 0, y: 0, z: Math.PI/2 },
        roughness: 0.5,
        metalness: 0.8
      },
      // Legs that will animate
      {
        type: "cylinder",
        /* @tweakable Color of the robot's legs */
        color: "#555555",
        position: { x: -0.3, y: 0, z: 0 },
        scale: { x: 0.1, y: 0.5, z: 0.1 },
        roughness: 0.7,
        metalness: 0.6,
        name: "leftLeg"
      },
      {
        type: "cylinder",
        color: "#555555",
        position: { x: 0.3, y: 0, z: 0 },
        scale: { x: 0.1, y: 0.5, z: 0.1 },
        roughness: 0.7,
        metalness: 0.6,
        name: "rightLeg"
      }
    ],
    description: "A walking robot with metallic parts"
  }
};
