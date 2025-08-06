export function createSpectatorSpec(color = '#cccccc') {
  /* @tweakable The color of the simplified spectator model. */
  const spectatorColor = color;
  return {
    customMode: true,
    features: [
      // Body
      {
        type: "box",
        color: spectatorColor,
        position: { x: 0, y: 0.45, z: 0 },
        scale: { x: 0.6, y: 0.9, z: 0.4 },
        roughness: 0.9,
        metalness: 0.1
      },
      // Head
      {
        type: "sphere",
        color: spectatorColor,
        position: { x: 0, y: 1.1, z: 0 },
        scale: { x: 0.4, y: 0.4, z: 0.4 },
        roughness: 0.9,
        metalness: 0.1
      },
    ],
  };
}

