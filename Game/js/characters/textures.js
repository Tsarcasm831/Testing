// Available texture materials for AI character creator
export const availableTextures = [
  {
    id: "brick",
    name: "Brick Wall",
    textureUrl: "https://threejs.org/examples/textures/brick_diffuse.jpg",
    normalMap: "https://threejs.org/examples/textures/brick_normal.jpg",
    roughness: 0.8,
    metalness: 0.1
  },
  {
    id: "wood",
    name: "Wood",
    textureUrl: "https://threejs.org/examples/textures/hardwood2_diffuse.jpg",
    normalMap: "https://threejs.org/examples/textures/hardwood2_normal.jpg",
    roughness: 0.7,
    metalness: 0.0
  },
  {
    id: "skin",
    name: "Skin",
    color: "#FFD6C4",
    roughness: 0.6,
    metalness: 0.0,
    subsurface: 0.3
  },
  {
    id: "metal",
    name: "Metal",
    color: "#AAAAAA",
    roughness: 0.2,
    metalness: 0.9,
    envMap: true
  },
  {
    id: "water",
    name: "Water",
    color: "#4444FF",
    roughness: 0.1,
    metalness: 0.3,
    transparent: true,
    opacity: 0.7
  },
  {
    id: "glass",
    name: "Glass",
    color: "#FFFFFF",
    roughness: 0.0,
    metalness: 0.1,
    transparent: true,
    opacity: 0.3,
    envMap: true
  }
];