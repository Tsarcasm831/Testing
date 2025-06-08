import * as THREE from "three";
import { NPC } from "./npc.js";

export class NPCManager {
  constructor(scene, room, playerModel) {
    this.scene = scene;
    this.room = room;
    this.playerModel = playerModel;
    this.npcs = [];
    this.nearbyNPC = null;
    this.currentInteractingNPC = null;
    this.lastCreatedNPC = null;
    this.directionIndicator = null;
    
    // Create interaction prompt
    this.interactionPrompt = document.createElement('div');
    this.interactionPrompt.id = 'interaction-prompt';
    this.interactionPrompt.textContent = 'Press E to talk';
    document.getElementById('game-container').appendChild(this.interactionPrompt);
    
    // Create directional indicator for newly spawned NPCs
    this.createDirectionalIndicator();
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Subscribe to room state
    this.subscribeToRoomState();
  }
  
  getPlayerModel() {
    return this.playerModel;
  }
  
  createDirectionalIndicator() {
    this.directionIndicator = document.createElement('div');
    this.directionIndicator.id = 'npc-direction-indicator';
    this.directionIndicator.innerHTML = '⬆';
    document.getElementById('game-container').appendChild(this.directionIndicator);
    // Hide initially
    this.directionIndicator.style.display = 'none';
  }
  
  setupEventListeners() {
    // NPC Creator functionality
    const addNpcBtn = document.getElementById('add-npc-btn');
    const npcPrompt = document.getElementById('npc-prompt');
    const closeDialogueBtn = document.getElementById('close-dialogue-btn');
    const npcSendBtn = document.getElementById('npc-send-btn');
    const npcConversationInput = document.getElementById('npc-conversation-input');
    
    if (addNpcBtn && npcPrompt) {
      addNpcBtn.addEventListener('click', async () => {
        const prompt = npcPrompt.value.trim();
        if (prompt) {
          // Use the new createNPCFromPromptWithModel function
          this.createNPCFromPromptWithModel(prompt);
          npcPrompt.value = '';
        }
      });
    }
    
    if (closeDialogueBtn) {
      closeDialogueBtn.addEventListener('click', () => {
        document.getElementById('npc-dialogue-container').style.display = 'none';
        if (this.currentInteractingNPC) {
          this.currentInteractingNPC.endInteraction();
          this.currentInteractingNPC = null;
        }
      });
    }
    
    // Send button for continuing conversation
    if (npcSendBtn && npcConversationInput) {
      npcSendBtn.addEventListener('click', () => {
        this.sendNPCResponse();
      });
      
      // Enter key to send response
      npcConversationInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.sendNPCResponse();
        }
      });
    }
    
    // Enhanced keyboard event handler for NPC interaction
    document.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 'e' && this.nearbyNPC) {
        this.interactWithNPC(this.nearbyNPC);
      }
    });
  }
  
  sendNPCResponse() {
    const input = document.getElementById('npc-conversation-input');
    const message = input.value.trim();
    
    if (message && this.currentInteractingNPC) {
      this.currentInteractingNPC.continueConversation(message);
      input.value = '';
    }
  }
  
  interactWithNPC(npc) {
    this.currentInteractingNPC = npc;
    npc.interact();
  }
  
  findNearestNPC(excludeNPC) {
    let nearestNPC = null;
    let minDistance = Infinity;
    
    // Get current NPC position
    const position = excludeNPC.model.position;
    
    for (const npc of this.npcs) {
      // Skip the NPC we're excluding
      if (npc === excludeNPC) continue;
      
      // Skip NPCs that are already interacting or conversing
      if (npc.isInteracting || npc.behavior.isConversing || npc.behavior.isFollowing) continue;
      
      const distance = position.distanceTo(npc.model.position);
      if (distance < minDistance) {
        minDistance = distance;
        nearestNPC = npc;
      }
    }
    
    return nearestNPC;
  }
  
  async createNPCFromPromptWithModel(prompt, modelCode = null) {
    // Create NPC position near the player (random spot within a radius)
    const playerPosition = this.room.presence[this.room.clientId] || { x: 0, z: 0 };
    const angle = Math.random() * Math.PI * 2;
    const distance = 5 + Math.random() * 5;
    const npcPosition = new THREE.Vector3(
      playerPosition.x + Math.cos(angle) * distance,
      0.5,
      playerPosition.z + Math.sin(angle) * distance
    );
    
    try {
      // Generate NPC data using AI with enhanced request for more detailed personality
      const completion = await websim.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are a personality expert. Create an NPC for a 3D game based on the user's description.
            Return ONLY a JSON object with these properties:
            {
              "name": "NPC name",
              "color": "hexadecimal color code like #FF5733 (no quotes)",
              "dialogue": "What the NPC says when talked to (1-3 sentences)",
              "personality": "Detailed personality description (at least 3-4 sentences) including background, motivations, quirks, speech patterns, and emotional tendencies",
              "personalityDescription": "The original prompt used to create this NPC",
              "height": number between 0.6 and 1.4 (1.0 is normal height),
              "features": [
                {
                  "type": "hat" or "accessory" or "clothing" or "bodyShape",
                  "description": "Detailed description of this feature",
                  "color": "hexadecimal color (optional)"
                }
              ],
              "headShape": "round" or "square" or "triangular",
              "bodyType": "thin" or "average" or "stout"
            }`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        json: true
      });
      
      // Parse the response
      const npcData = JSON.parse(completion.content);
      
      // Store original prompt
      npcData.personalityDescription = prompt;
      
      // Convert hex color to three.js format
      if (npcData.color && npcData.color.startsWith('#')) {
        npcData.color = parseInt(npcData.color.substring(1), 16);
      } else {
        // Default color if invalid
        npcData.color = 0xFF5733;
      }
      
      // Convert any feature colors
      if (npcData.features && Array.isArray(npcData.features)) {
        npcData.features.forEach(feature => {
          if (feature.color && feature.color.startsWith('#')) {
            feature.color = parseInt(feature.color.substring(1), 16);
          }
        });
      }
      
      // Generate a unique ID for this NPC
      const npcId = `npc-${Date.now()}-${this.room.clientId}`;
      npcData.id = npcId;
      
      // Add custom model code if provided
      if (modelCode) {
        npcData.modelCode = modelCode;
      }
      
      // Create and add NPC
      const npc = new NPC(this.scene, npcPosition, npcData);
      npc.npcManager = this; // Set reference to the manager
      npc.addToScene();
      this.npcs.push(npc);
      
      // Set as last created NPC and show directional indicator
      this.lastCreatedNPC = npc;
      this.showNPCDirectionalIndicator(npc);
      
      // Add visual beacon to the NPC
      npc.addSpawnBeacon();
      
      // Broadcast NPC creation to other players
      const npcStateData = {
        position: {x: npcPosition.x, y: npcPosition.y, z: npcPosition.z},
        data: {
          name: npcData.name,
          color: npcData.color,
          dialogue: npcData.dialogue,
          personality: npcData.personality,
          personalityDescription: npcData.personalityDescription,
          id: npcId,
          createdBy: this.room.clientId,
          height: npcData.height || 1.0,
          features: npcData.features || [],
          headShape: npcData.headShape || "square",
          bodyType: npcData.bodyType || "average"
        }
      };
      
      // Add model code to data if provided
      if (modelCode) {
        npcStateData.data.modelCode = modelCode;
      }
      
      this.room.updateRoomState({
        npcs: {
          [npcId]: npcStateData
        }
      });
      
      // Show notification about NPC creation
      this.showNotification(`${npcData.name} has arrived! Look for the beacon.`);
      
      return npc;
      
    } catch (error) {
      console.error('Error creating NPC:', error);
      throw error;
    }
  }
  
  showNotification(message) {
    const notificationElement = document.getElementById('notification-message') || 
                                 this.createNotificationElement();
    
    notificationElement.textContent = message;
    notificationElement.classList.add('show');
    
    setTimeout(() => {
      notificationElement.classList.remove('show');
    }, 5000);
  }
  
  createNotificationElement() {
    const notificationElement = document.createElement('div');
    notificationElement.id = 'notification-message';
    document.getElementById('game-container').appendChild(notificationElement);
    return notificationElement;
  }
  
  showNPCDirectionalIndicator(npc) {
    if (!this.directionIndicator) return;
    
    // Show the indicator
    this.directionIndicator.style.display = 'block';
    
    // Set up a timer to update the indicator and eventually hide it
    let indicatorTime = 0;
    const indicatorDuration = 10000; // 10 seconds
    
    const updateIndicator = () => {
      if (!npc || !npc.model || indicatorTime >= indicatorDuration) {
        this.directionIndicator.style.display = 'none';
        return;
      }
      
      const screenPos = this.getScreenPositionFromPlayer(npc.model.position);
      if (screenPos) {
        // Update position
        this.directionIndicator.style.left = `${screenPos.x}px`;
        this.directionIndicator.style.top = `${screenPos.y}px`;
        
        // Update arrow direction - point toward NPC
        const angle = Math.atan2(screenPos.y - window.innerHeight/2, screenPos.x - window.innerWidth/2);
        this.directionIndicator.style.transform = `rotate(${angle + Math.PI/2}rad)`;
      }
      
      indicatorTime += 16; // Approximate time between frames
      requestAnimationFrame(updateIndicator);
    };
    
    updateIndicator();
  }
  
  getScreenPositionFromPlayer(position) {
    // Simple indicator at the edge of the screen pointing toward the NPC
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    // Calculate angle from screen center to NPC
    const dx = position.x - (this.room.presence[this.room.clientId]?.x || 0);
    const dz = position.z - (this.room.presence[this.room.clientId]?.z || 0);
    const angle = Math.atan2(dz, dx);
    
    // Calculate position on circle at edge of screen
    const radius = Math.min(centerX, centerY) * 0.7;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    
    return { x, y };
  }
  
  subscribeToRoomState() {
    this.room.subscribeRoomState((roomState) => {
      if (roomState.npcs) {
        for (const [npcId, npcInfo] of Object.entries(roomState.npcs)) {
          // Check if NPC already exists
          const existingNpc = this.npcs.find(npc => npc.data.id === npcId);
          
          // Only create NPC if it doesn't exist yet AND wasn't created by current client
          if (!existingNpc && npcInfo.position && npcInfo.data && npcInfo.data.createdBy !== this.room.clientId) {
            const npcPosition = new THREE.Vector3(
              npcInfo.position.x,
              npcInfo.position.y,
              npcInfo.position.z
            );
            
            // Preserve conversation history if it exists
            if (npcInfo.data.conversationHistory) {
              npcInfo.data.conversationHistory = npcInfo.data.conversationHistory;
            }
            
            // Create and add NPC
            const npc = new NPC(this.scene, npcPosition, npcInfo.data);
            npc.npcManager = this; // Set reference to the manager
            npc.addToScene();
            this.npcs.push(npc);
            
            // Add visual beacon if it's a new NPC from another player
            npc.addSpawnBeacon();
            
            // Show notification about NPC creation
            this.showNotification(`${npcInfo.data.name} has been created by another player!`);
          }
          
          // Update existing NPC if memory changes
          else if (existingNpc && npcInfo.data && npcInfo.data.conversationHistory) {
            // Update the NPC's conversation history if it changed
            existingNpc.data.conversationHistory = npcInfo.data.conversationHistory;
            if (existingNpc.interaction) {
              existingNpc.interaction.conversationHistory = npcInfo.data.conversationHistory;
            }
          }
        }
      }
    });
  }
  
  update(camera, renderer, playerPosition) {
    // Update NPC labels
    this.npcs.forEach(npc => {
      npc.updateLabel(camera, renderer);
    });
    
    // Check for nearby NPCs - use playerModel.position if available
    const effectivePlayerPosition = this.playerModel ? this.playerModel.position : playerPosition;
    this.nearbyNPC = null;
    for (const npc of this.npcs) {
      if (npc.isPlayerNear(effectivePlayerPosition) && !npc.isInteracting && !npc.behavior.isConversing) {
        this.nearbyNPC = npc;
        break;
      }
    }
    
    // Show/hide interaction prompt (only if we're not currently in a conversation)
    if (this.nearbyNPC && !this.currentInteractingNPC) {
      this.interactionPrompt.style.display = 'block';
    } else {
      this.interactionPrompt.style.display = 'none';
    }
    
    // Check for NPC-to-NPC conversations
    // Only run this check occasionally to improve performance
    if (Math.random() < 0.02) { // roughly every 50 frames
      for (const npc of this.npcs) {
        npc.behavior.checkForNearbyNPCs(this.npcs);
      }
    }
  }
}