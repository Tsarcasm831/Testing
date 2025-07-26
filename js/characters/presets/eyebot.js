export const eyebotPreset = {
  id: "eyebot",
  name: "Eyebot",
  description: "A walking eyebot character.",
  spec: {
    customMode: true,
    features: [
      // Eyebot Eye
      {
        type: "sphere",
        /* @tweakable Color of the eyebot's sclera */
        color: "#ffffff",
        position: { x: 0, y: 1.5, z: 0 },
        scale: { x: 0.5, y: 0.5, z: 0.5 },
        roughness: 0.2,
        metalness: 0.1,
      },
      // Eyebot Pupil
      {
        type: "sphere",
        /* @tweakable Color of the eyebot's pupil */
        color: "#000000",
        position: { x: 0, y: 1.5, z: 0.2 },
        scale: { x: 0.2, y: 0.2, z: 0.1 },
        roughness: 0.1,
        metalness: 0.1,
      },
      // Eyebot body
      {
        type: "box",
        /* @tweakable Color of the eyebot's body */
        color: "#cccccc",
        position: { x: 0, y: 0.9, z: 0 },
        scale: { x: 0.6, y: 0.8, z: 0.3 },
        roughness: 0.2,
        metalness: 0.8,
      },
      // Arms
      {
        type: "cylinder",
        /* @tweakable Color of the eyebot's arms */
        color: "#aaaaaa",
        position: { x: -0.5, y: 1, z: 0 },
        scale: { x: 0.1, y: 0.6, z: 0.1 },
        rotation: { x: 0, y: 0, z: Math.PI/2 },
        roughness: 0.2,
        metalness: 0.8,
      },
      {
        type: "cylinder",
        color: "#aaaaaa",
        position: { x: 0.5, y: 1, z: 0 },
        scale: { x: 0.1, y: 0.6, z: 0.1 },
        rotation: { x: 0, y: 0, z: Math.PI/2 },
        roughness: 0.2,
        metalness: 0.8,
      },
      // Legs
      {
        type: "cylinder",
        /* @tweakable Color of the eyebot's legs */
        color: "#888888",
        position: { x: -0.2, y: 0.2, z: 0 },
        scale: { x: 0.1, y: 0.8, z: 0.1 },
        roughness: 0.2,
        metalness: 0.8,
        name: "leftLeg",
      },
      {
        type: "cylinder",
        color: "#888888",
        position: { x: 0.2, y: 0.2, z: 0 },
        scale: { x: 0.1, y: 0.8, z: 0.1 },
        roughness: 0.2,
        metalness: 0.8,
        name: "rightLeg",
      },
      // Base for collision
      {
        type: "box",
        color: "#666666",
        position: { x: 0, y: 0, z: 0 },
        scale: { x: 0.5, y: 0.1, z: 0.3 },
        roughness: 0.2,
        metalness: 0.8,
        /* @tweakable Set to false to make the eyebot's collision base invisible in previews. */
        visible: false,
        transparent: true,
        opacity: 0
      },
    ],
    description: "A metallic eyebot character.",
  },
};