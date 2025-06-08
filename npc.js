import * as THREE from "three";
import { getScreenPosition } from './screenUtils.js';
import { NPCRenderer } from './npcRenderer.js';
import { NPCBehavior } from './npcBehavior.js';
import { NPCInteraction } from './npcInteraction.js';

// NPC class to manage NPC creation and interaction
export class NPC {
  constructor(scene, position, npcData) {
    this.scene = scene;
    this.position = position;
    this.data = npcData;
    this.interactionDistance = 3;
    this.isInteracting = false;
    this.spawnBeacon = null;
    this.spawnTime = Date.now();
    this.npcManager = null;
    this.conversationBubbles = [];
    
    /* message display duration in milliseconds */
    this.messageDisplayDuration = 3000;
    /* delay between messages in milliseconds */
    this.messageDelay = 3500;
    /* maximum number of visible bubbles */
    this.maxVisibleBubbles = 2;
    /* distance at which bubbles start scaling down */
    this.scaleStartDistance = 10;
    /* minimum scale for distant bubbles */
    this.minBubbleScale = 0.5;
    
    // Create the model using custom code or default renderer
    if (npcData.modelCode) {
      this.model = this.createCustomModel(npcData.modelCode);
    } else {
      this.model = NPCRenderer.createModel(position, npcData);
    }

    this.model.userData.npcObject = this;

    // Initialize behavior and interaction components
    this.behavior = new NPCBehavior(this);
    this.interaction = new NPCInteraction(this);

    // Create name label
    this.nameLabel = document.createElement('div');
    this.nameLabel.className = 'player-name';
    this.nameLabel.textContent = this.data.name;
    document.getElementById('game-container').appendChild(this.nameLabel);
  }

  createCustomModel(modelCode) {
    try {
      // Create a safe function from the code
      const createCharacterFunc = new Function('THREE', `
        ${modelCode}
        return createCharacter(THREE);
      `);

      // Execute the function with Three.js
      const characterGroup = createCharacterFunc(THREE);

      // Position the model at the specified position
      characterGroup.position.copy(this.position);

      return characterGroup;
    } catch (error) {
      console.error("Error creating NPC from custom model code:", error);
      // Fallback to default model
      return NPCRenderer.createModel(this.position, this.data);
    }
  }

  addToScene() {
    this.scene.add(this.model);
  }

  // Calls the behavior's updatePosition method
  updatePosition() {
    this.behavior.updatePosition();

    // Update the beacon if it exists
    if (this.spawnBeacon) {
      // Position the beacon above the NPC
      this.spawnBeacon.position.x = this.model.position.x;
      this.spawnBeacon.position.z = this.model.position.z;

      // Animate the beacon
      const beaconAge = Date.now() - this.spawnTime;
      const beaconLifetime = 15000; // 15 seconds

      if (beaconAge > beaconLifetime) {
        // Remove beacon after lifetime
        this.scene.remove(this.spawnBeacon);
        this.spawnBeacon = null;
      } else {
        // Animate beacon height and opacity
        const normalizedAge = beaconAge / beaconLifetime;
        const pulseFrequency = 2.0;
        const pulseValue = 0.5 + 0.5 * Math.sin(normalizedAge * Math.PI * 2 * pulseFrequency);

        // Make the beacon pulse
        this.spawnBeacon.scale.y = 1 + pulseValue * 0.5;

        // Fade out over time
        const opacity = 1 - normalizedAge;
        this.spawnBeacon.material.opacity = opacity;
      }
    }
  }

  updateLabel(camera, renderer) {
    this.updatePosition();

    if (this.nameLabel) {
      const screenPosition = getScreenPosition(this.model.position, camera, renderer);
      if (screenPosition && screenPosition.visible) {
        this.nameLabel.style.left = `${screenPosition.x}px`;
        this.nameLabel.style.top = `${screenPosition.y - 20}px`;
        this.nameLabel.style.display = 'block';
      } else {
        this.nameLabel.style.display = 'none';
      }
    }

    // Update all conversation bubbles positions with distance-based scaling
    this.conversationBubbles.forEach((bubble, index) => {
      if (bubble.style.display !== 'none') {
        // Calculate distance from camera for scaling
        const cameraPosition = camera.position;
        const npcPosition = this.model.position;
        const distance = cameraPosition.distanceTo(npcPosition);
        
        // Calculate scale based on distance
        let scale = 1;
        if (distance > this.scaleStartDistance) {
          const scaleProgress = Math.min((distance - this.scaleStartDistance) / this.scaleStartDistance, 1);
          scale = 1 - (scaleProgress * (1 - this.minBubbleScale));
        }
        
        const bubblePosition = getScreenPosition(
          new THREE.Vector3(
            this.model.position.x,
            this.model.position.y + (2.5 * (this.data.height || 1.0)) + (index * 0.8 * scale),
            this.model.position.z
          ),
          camera,
          renderer
        );

        if (bubblePosition && bubblePosition.visible) {
          bubble.style.left = `${bubblePosition.x}px`;
          bubble.style.top = `${bubblePosition.y - (index * 40 * scale)}px`;
          bubble.style.transform = `translate(-50%, -50%) scale(${scale})`;
          bubble.style.zIndex = 1000 - index; // Ensure proper layering
        } else {
          bubble.style.display = 'none';
        }
      }
    });
  }

  // Methods for NPC-to-NPC conversations with threaded bubbles
  showConversationBubble() {
    // Create a new bubble instead of reusing
    const bubble = document.createElement('div');
    bubble.className = 'npc-conversation-bubble';
    bubble.textContent = '...';
    bubble.style.display = 'block';
    document.getElementById('game-container').appendChild(bubble);
    this.conversationBubbles.push(bubble);
  }

  hideConversationBubble() {
    // Hide all bubbles for this NPC
    this.conversationBubbles.forEach(bubble => {
      if (bubble.parentNode) {
        bubble.parentNode.removeChild(bubble);
      }
    });
    this.conversationBubbles = [];
  }

  displayNPCConversation(messages, otherNPC) {
    if (!messages || !Array.isArray(messages) || messages.length === 0) return;

    // Clear existing bubbles
    this.hideConversationBubble();
    otherNPC.hideConversationBubble();

    let currentIndex = 0;

    const showNextMessage = () => {
      if (!this.behavior.isConversing || !otherNPC.behavior.isConversing) {
        this.hideConversationBubble();
        otherNPC.hideConversationBubble();
        return;
      }

      if (currentIndex >= messages.length) {
        return;
      }

      const message = messages[currentIndex];
      let currentSpeakerNPC = message.speaker === this.data.name ? this : otherNPC;
      
      // Create new bubble
      const bubble = document.createElement('div');
      bubble.className = 'npc-conversation-bubble';
      bubble.textContent = message.text;
      
      bubble.style.display = 'block';
      document.getElementById('game-container').appendChild(bubble);
      currentSpeakerNPC.conversationBubbles.push(bubble);

      // Remove old bubbles if we exceed the limit
      if (currentSpeakerNPC.conversationBubbles.length > this.maxVisibleBubbles) {
        const oldBubble = currentSpeakerNPC.conversationBubbles.shift();
        if (oldBubble.parentNode) {
          oldBubble.parentNode.removeChild(oldBubble);
        }
      }

      currentIndex++;

      // Schedule next message with delay
      if (currentIndex < messages.length && this.behavior.isConversing && otherNPC.behavior.isConversing) {
        setTimeout(showNextMessage, this.messageDelay);
      }
    };

    // Start the conversation with a small initial delay
    setTimeout(showNextMessage, 500);
  }

  // Add a visual beacon above the NPC to make it easier to find
  addSpawnBeacon() {
    // Create a cylindrical beacon that points upward
    const beaconGeometry = new THREE.CylinderGeometry(0.2, 0.1, 8, 8);
    const beaconMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ffff, // Cyan color
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide
    });

    this.spawnBeacon = new THREE.Mesh(beaconGeometry, beaconMaterial);

    // Position the beacon above the NPC
    this.spawnBeacon.position.set(
      this.model.position.x,
      this.model.position.y + 4, // Half the beacon height
      this.model.position.z
    );

    // Add the beacon to the scene
    this.scene.add(this.spawnBeacon);

    // Record spawn time for animations
    this.spawnTime = Date.now();
  }

  // Forwards to behavior component
  isPlayerNear(playerPosition) {
    return this.behavior.isPlayerNear(playerPosition);
  }

  // Forwards to interaction component
  interact() {
    this.interaction.interact();
  }

  // Forwards to interaction component
  async continueConversation(userMessage) {
    await this.interaction.continueConversation(userMessage);
  }

  // Forwards to interaction component
  endInteraction() {
    this.interaction.endInteraction();
  }

  remove() {
    if (this.model) {
      this.scene.remove(this.model);
    }
    if (this.nameLabel) {
      document.getElementById('game-container').removeChild(this.nameLabel);
    }
    this.hideConversationBubble();
    if (this.spawnBeacon) {
      this.scene.remove(this.spawnBeacon);
    }
  }
}