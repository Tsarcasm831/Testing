export const wireframePreset = {
  id: "wireframe",
  name: "Wireframe",
  description: "A walking wireframe character",
  spec: {
    customMode: true,
    features: [
      // Wireframe head
      {
        type: "sphere",
        /* @tweakable Color of the wireframe character */
        color: "#00ff00",
        position: { x: 0, y: 1.5, z: 0 },
        scale: { x: 0.5, y: 0.5, z: 0.5 },
        roughness: 0.2,
        metalness: 0.8,
        transparent: true,
        opacity: 0.8
      },
      // Wireframe body
      {
        type: "box",
        color: "#00ff00",
        position: { x: 0, y: 0.9, z: 0 },
        scale: { x: 0.6, y: 0.8, z: 0.3 },
        roughness: 0.2,
        metalness: 0.8,
        transparent: true,
        opacity: 0.8
      },
      // Arms
      {
        type: "cylinder",
        color: "#00ff00",
        position: { x: -0.5, y: 1, z: 0 },
        scale: { x: 0.1, y: 0.6, z: 0.1 },
        rotation: { x: 0, y: 0, z: Math.PI/2 },
        roughness: 0.2,
        metalness: 0.8,
        transparent: true,
        opacity: 0.8
      },
      {
        type: "cylinder",
        color: "#00ff00",
        position: { x: 0.5, y: 1, z: 0 },
        scale: { x: 0.1, y: 0.6, z: 0.1 },
        rotation: { x: 0, y: 0, z: Math.PI/2 },
        roughness: 0.2,
        metalness: 0.8,
        transparent: true,
        opacity: 0.8
      },
      // Legs
      {
        type: "cylinder",
        color: "#00ff00",
        position: { x: -0.2, y: 0.2, z: 0 },
        scale: { x: 0.1, y: 0.8, z: 0.1 },
        roughness: 0.2,
        metalness: 0.8,
        transparent: true,
        opacity: 0.8,
        name: "leftLeg"
      },
      {
        type: "cylinder",
        color: "#00ff00",
        position: { x: 0.2, y: 0.2, z: 0 },
        scale: { x: 0.1, y: 0.8, z: 0.1 },
        roughness: 0.2,
        metalness: 0.8,
        transparent: true,
        opacity: 0.8,
        name: "rightLeg"
      },
      // Base for collision
      {
        type: "box",
        color: "#00ff00",
        position: { x: 0, y: 0, z: 0 },
        scale: { x: 0.5, y: 0.1, z: 0.3 },
        roughness: 0.2,
        metalness: 0.8,
        transparent: true,
        opacity: 0.8
      }
    ],
    description: "A glowing green wireframe character"
  }
};
