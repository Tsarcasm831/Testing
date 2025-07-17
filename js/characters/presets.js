// Preset character collection
export const presetCharacters = [
  {
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
  },
  {
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
  },
  {
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
          name: "leftLeg"
        },
        {
          type: "cylinder",
          color: "#888888",
          position: { x: 0.2, y: 0.2, z: 0 },
          scale: { x: 0.1, y: 0.8, z: 0.1 },
          roughness: 0.2,
          metalness: 0.8,
          name: "rightLeg"
        },
        // Base for collision
        {
          type: "box",
          color: "#666666",
          position: { x: 0, y: 0, z: 0 },
          scale: { x: 0.5, y: 0.1, z: 0.3 },
          roughness: 0.2,
          metalness: 0.8,
        }
      ],
      description: "A metallic eyebot character."
    }
  },
  {
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
  },
  {
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
  },
  {
    id: "shopkeeper",
    name: "Shopkeeper",
    description: "A friendly shopkeeper.",
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
          position: { x: 0, y: 1.3, z: 0 },
          scale: { x: 0.4, y: 0.4, z: 0.4 },
        },
        // Legs
        {
          type: "cylinder",
          color: "#4a3a2a",
          position: { x: -0.15, y: 0.3, z: 0 },
          scale: { x: 0.15, y: 0.6, z: 0.15 },
          name: "leftLeg"
        },
        {
          type: "cylinder",
          color: "#4a3a2a",
          position: { x: 0.15, y: 0.3, z: 0 },
          scale: { x: 0.15, y: 0.6, z: 0.15 },
          name: "rightLeg"
        },
         // Base for collision
        {
          type: "box",
          color: "#666666",
          position: { x: 0, y: 0, z: 0 },
          scale: { x: 0.5, y: 0.1, z: 0.3 },
          transparent: true,
          opacity: 0,
        }
      ]
    }
  },
  {
    id: "golem",
    name: "Stone Golem",
    description: "A creature of rock and crystal.",
    spec: {
      customMode: true,
      features: [
        // Body
        {
          type: "box",
          /* @tweakable The main color of the golem's stone body. */
          color: "#8B8A88",
          position: { x: 0, y: 0.8, z: 0 },
          scale: { x: 1, y: 1.2, z: 0.8 },
          roughness: 0.9,
          metalness: 0.1
        },
        // Head
        {
          type: "box",
          /* @tweakable The color of the golem's head. */
          color: "#7D7C7A",
          position: { x: 0, y: 1.7, z: 0 },
          scale: { x: 0.7, y: 0.7, z: 0.7 },
          roughness: 0.9,
          metalness: 0.1
        },
        // Legs
        {
          type: "box",
          name: "leftLeg",
          color: "#7D7C7A",
          position: { x: -0.3, y: 0, z: 0 },
          scale: { x: 0.4, y: 0.8, z: 0.4 }
        },
        {
          type: "box",
          name: "rightLeg",
          color: "#7D7C7A",
          position: { x: 0.3, y: 0, z: 0 },
          scale: { x: 0.4, y: 0.8, z: 0.4 }
        },
        // Arms
        {
          type: "box",
          color: "#7D7C7A",
          position: { x: -0.8, y: 1.0, z: 0 },
          scale: { x: 0.4, y: 1.0, z: 0.4 },
          rotation: {x: 0, y: 0, z: 0.2}
        },
        {
          type: "box",
          color: "#7D7C7A",
          position: { x: 0.8, y: 1.0, z: 0 },
          scale: { x: 0.4, y: 1.0, z: 0.4 },
          rotation: {x: 0, y: 0, z: -0.2}
        },
        // Crystal Core
        {
          type: "cone",
          /* @tweakable The glowing color of the golem's crystal core. */
          color: "#2EFFF7",
          position: { x: 0, y: 1.2, z: 0.3 },
          scale: { x: 0.2, y: 0.3, z: 0.2 },
          roughness: 0.1,
          metalness: 0.5
        }
      ]
    }
  },
  {
    id: "plant_creature",
    name: "Forest Sprite",
    description: "A being of leaf and vine.",
    spec: {
      customMode: true,
      features: [
        // Body (Vine)
        {
          type: "cylinder",
          /* @tweakable The color of the Forest Sprite's vine body. */
          color: "#4A3728",
          position: { x: 0, y: 0.7, z: 0 },
          scale: { x: 0.2, y: 1.4, z: 0.2 }
        },
        // Head
        {
          type: "sphere",
          /* @tweakable The color of the Forest Sprite's head. */
          color: "#6B8E23",
          position: { x: 0, y: 1.5, z: 0 },
          scale: { x: 0.4, y: 0.4, z: 0.4 }
        },
        // Flower on head
        {
          type: "cone",
          /* @tweakable The color of the flower on the Forest Sprite's head. */
          color: "#FFD700",
          position: { x: 0, y: 1.8, z: 0 },
          scale: { x: 0.3, y: 0.2, z: 0.3 },
          rotation: {x: Math.PI, y: 0, z: 0}
        },
        // Legs
        {
          type: "cylinder",
          name: "leftLeg",
          color: "#4A3728",
          position: { x: -0.1, y: 0, z: 0 },
          scale: { x: 0.1, y: 0.6, z: 0.1 }
        },
        {
          type: "cylinder",
          name: "rightLeg",
          color: "#4A3728",
          position: { x: 0.1, y: 0, z: 0 },
          scale: { x: 0.1, y: 0.6, z: 0.1 }
        },
        // Leaves
        {
          type: "box",
          color: "#228B22",
          position: { x: -0.3, y: 1, z: 0 },
          scale: { x: 0.6, y: 0.1, z: 0.4 },
          rotation: {x: 0, y: 0.5, z: 0.3}
        },
        {
          type: "box",
          color: "#228B22",
          position: { x: 0.3, y: 0.8, z: 0 },
          scale: { x: 0.6, y: 0.1, z: 0.4 },
          rotation: {x: 0, y: -0.5, z: -0.3}
        }
      ]
    }
  },
  {
    id: "slime",
    name: "Jiggly Slime",
    description: "A wobbly, translucent slime.",
    spec: {
      customMode: true,
      features: [
        // Main Body
        {
          type: "sphere",
          /* @tweakable The color of the slime. */
          color: "#87CEEB",
          position: { x: 0, y: 0.5, z: 0 },
          scale: { x: 1, y: 1, z: 1 },
          transparent: true,
          opacity: 0.6,
          animation: { type: "jiggly" }
        },
        // Eyes
        {
          type: "sphere",
          color: "#000000",
          position: { x: -0.2, y: 0.7, z: 0.4 },
          scale: { x: 0.1, y: 0.1, z: 0.1 }
        },
        {
          type: "sphere",
          color: "#000000",
          position: { x: 0.2, y: 0.7, z: 0.4 },
          scale: { x: 0.1, y: 0.1, z: 0.1 }
        },
        // Internal Bubble
        {
            type: "sphere",
            color: "#FFFFFF",
            position: { x: 0, y: 0.4, z: 0 },
            scale: { x: 0.3, y: 0.3, z: 0.3 },
            transparent: true,
            opacity: 0.3,
            animation: { type: "bobUpDown" }
        }
      ]
    }
  },
  {
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
          animation: { type: "bobUpDown" }
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
        }
      ]
    }
  },
  {
    id: "knight",
    name: "Armored Knight",
    description: "A knight in shining armor.",
    spec: {
      customMode: true,
      features: [
        // Torso
        {
          type: "box",
          /* @tweakable The color of the knight's armor. */
          color: "#C0C0C0",
          position: { x: 0, y: 0.8, z: 0 },
          scale: { x: 0.7, y: 1.0, z: 0.5 },
          roughness: 0.2,
          metalness: 0.9
        },
        // Helmet
        {
          type: "sphere",
          color: "#C0C0C0",
          position: { x: 0, y: 1.5, z: 0 },
          scale: { x: 0.5, y: 0.5, z: 0.5 },
          roughness: 0.2,
          metalness: 0.9
        },
        // Helmet Plume
        {
            type: "cone",
            /* @tweakable The color of the knight's helmet plume. */
            color: "#FF0000",
            position: { x: 0, y: 1.8, z: 0 },
            scale: { x: 0.1, y: 0.4, z: 0.1 },
        },
        // Legs
        {
          type: "cylinder",
          name: "leftLeg",
          color: "#A9A9A9",
          position: { x: -0.2, y: 0, z: 0 },
          scale: { x: 0.2, y: 0.8, z: 0.2 },
          roughness: 0.3,
          metalness: 0.8
        },
        {
          type: "cylinder",
          name: "rightLeg",
          color: "#A9A9A9",
          position: { x: 0.2, y: 0, z: 0 },
          scale: { x: 0.2, y: 0.8, z: 0.2 },
          roughness: 0.3,
          metalness: 0.8
        },
        // Arms
        {
          type: "cylinder",
          color: "#A9A9A9",
          position: { x: -0.5, y: 1.0, z: 0 },
          scale: { x: 0.15, y: 0.9, z: 0.15 },
          roughness: 0.3,
          metalness: 0.8
        },
        {
          type: "cylinder",
          color: "#A9A9A9",
          position: { x: 0.5, y: 1.0, z: 0 },
          scale: { x: 0.15, y: 0.9, z: 0.15 },
          roughness: 0.3,
          metalness: 0.8
        }
      ]
    }
  }
];

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

// Available animation properties for AI character creator
export const availableAnimations = [
  {
    id: "jiggly",
    name: "Jiggly",
    description: "Makes the feature jiggle randomly"
  },
  {
    id: "bobUpDown",
    name: "Bob Up & Down",
    description: "Makes the feature move up and down smoothly"
  },
  {
    id: "spinY",
    name: "Spin Y",
    description: "Rotates the feature around the Y axis"
  },
  {
    id: "spinX",
    name: "Spin X",
    description: "Rotates the feature around the X axis"
  },
  {
    id: "spinZ",
    name: "Spin Z",
    description: "Rotates the feature around the Z axis"
  },
  {
    id: "pulse",
    name: "Pulse",
    description: "Makes the feature grow and shrink"
  }
];