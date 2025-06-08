import * as THREE from "three";

export class NPCBehavior {
  constructor(npc) {
    this.npc = npc;
    
    // Walking properties
    this.walkSpeed = 0.001 + Math.random() * 0.001; // Very slow speed
    this.walkDirection = new THREE.Vector3(Math.random() - 0.5, 0, Math.random() - 0.5).normalize();
    this.walkTimer = 0;

 
 
 
 
    this.walkDuration = 5000 + Math.random() * 5000;
    this.restDuration = 2000 + Math.random() * 3000;
    this.isWalking = Math.random() > 0.3;

    this.lastUpdate = performance.now();
    
    // Conversation properties
    this.isConversing = false;
    this.conversationPartner = null;
    this.conversationTimeout = null;
    this.lastConversationTime = 0;
    this.conversationCooldown = 30000 + Math.random() * 30000; // 30-60 sec cooldown between conversations
    
    // Following properties
    this.isFollowing = false;
    this.followTarget = null;
    this.followDistance = 2; // Distance to maintain from player
    this.followTimeout = null;
    this.followDuration = 120000; // Follow for 2 minutes by default
  }
  
  updatePosition() {
    // Don't update position if the NPC is being interacted with
    if (this.npc.isInteracting) {
      // Reset leg animation when not walking
      this.resetLegAnimation();
      return;
    }
    
    const now = performance.now();
    const deltaTime = now - this.lastUpdate;
    this.lastUpdate = now;
    
    // Handle following behavior
    if (this.isFollowing && this.followTarget) {
      this.updateFollowing(deltaTime);
      return;
    }
    
    // Don't move if conversing
    if (this.isConversing) {
      this.resetLegAnimation();
      return;
    }
    
    this.walkTimer += deltaTime;
    
    // Switch between walking and resting
    if (this.isWalking && this.walkTimer > this.walkDuration) {
      this.isWalking = false;
      this.walkTimer = 0;
      // Choose new random direction when resuming walk
      this.walkDirection = new THREE.Vector3(Math.random() - 0.5, 0, Math.random() - 0.5).normalize();
    } else if (!this.isWalking && this.walkTimer > this.restDuration) {
      this.isWalking = true;
      this.walkTimer = 0;
    }
    
    if (this.isWalking) {
      // Animate legs while walking
      this.animateLegs(now);
      
      // Check for obstacles before moving
      const moveAmount = this.walkSpeed * deltaTime;
      const nextPosition = this.npc.model.position.clone()
        .add(this.walkDirection.clone().multiplyScalar(moveAmount));
        
      // Basic collision with scene bounds - change direction if too far from center
      const distanceFromCenter = Math.sqrt(nextPosition.x * nextPosition.x + nextPosition.z * nextPosition.z);
      if (distanceFromCenter > 45) {
        // Turn back toward center
        this.walkDirection = new THREE.Vector3(-this.npc.model.position.x, 0, -this.npc.model.position.z)
          .normalize()
          .add(new THREE.Vector3(Math.random() - 0.5, 0, Math.random() - 0.5).multiplyScalar(0.2))
          .normalize();
      } else {
        // Random direction change occasionally
        if (Math.random() < 0.005) {
          this.walkDirection.add(new THREE.Vector3(Math.random() - 0.5, 0, Math.random() - 0.5).multiplyScalar(0.5))
            .normalize();
        }
        
        // Apply movement
        this.npc.model.position.add(this.walkDirection.clone().multiplyScalar(moveAmount));
      }
      
      // Rotate NPC in direction of movement
      this.npc.model.rotation.y = Math.atan2(this.walkDirection.x, this.walkDirection.z);
    } else {
      // Reset leg animation when not walking
      this.resetLegAnimation();
    }
  }
  
  animateLegs(now) {
    const leftLeg = this.npc.model.getObjectByName("leftLeg");
    const rightLeg = this.npc.model.getObjectByName("rightLeg");
    
    if (leftLeg && rightLeg) {
      const walkSpeed = 3;
      const walkAmplitude = 0.3;
      const animTime = now * 0.001 * walkSpeed;
      leftLeg.rotation.x = Math.sin(animTime) * walkAmplitude;
      rightLeg.rotation.x = Math.sin(animTime + Math.PI) * walkAmplitude;
    }
  }
  
  resetLegAnimation() {
    const leftLeg = this.npc.model.getObjectByName("leftLeg");
    const rightLeg = this.npc.model.getObjectByName("rightLeg");
    
    if (leftLeg && rightLeg) {
      leftLeg.rotation.x = 0;
      rightLeg.rotation.x = 0;
    }
  }
  
  updateFollowing(deltaTime) {
    if (!this.followTarget) return;
    
    // Get target position (player model)
    const targetPosition = this.followTarget.position.clone();
    
    // Calculate direction to target
    const direction = new THREE.Vector3()
      .subVectors(targetPosition, this.npc.model.position)
      .normalize();
    
    // Calculate distance to target
    const distance = this.npc.model.position.distanceTo(targetPosition);
    
    // Only move if we're too far from the target
    if (distance > this.followDistance) {
      // Animate legs while walking
      this.animateLegs(performance.now());
      
      // Move toward target but stop at follow distance
      const moveAmount = this.walkSpeed * deltaTime * 3; // Faster when following
      if (distance - moveAmount > this.followDistance) {
        this.npc.model.position.add(direction.clone().multiplyScalar(moveAmount));
      } else {
        this.npc.model.position.add(direction.clone().multiplyScalar(distance - this.followDistance));
      }
      
      // Rotate NPC to face direction of movement
      this.npc.model.rotation.y = Math.atan2(direction.x, direction.z);
    } else {
      // Reset leg animation when not walking
      this.resetLegAnimation();
    }
  }
  
  startFollowing() {
    // Get player model from the scene
    const playerModel = this.npc.npcManager?.getPlayerModel();
    
    if (playerModel) {
      this.isFollowing = true;
      this.followTarget = playerModel;
      
      // Clear any existing follow timeout
      if (this.followTimeout) {
        clearTimeout(this.followTimeout);
      }
    }
  }
  
  stopFollowing() {
    this.isFollowing = false;
    this.followTarget = null;
    
    if (this.followTimeout) {
      clearTimeout(this.followTimeout);
      this.followTimeout = null;
    }
    
    // Show notification
    if (this.npc.npcManager) {
      this.npc.npcManager.showNotification(`${this.npc.data.name} stopped following you.`);
    }
  }
  
  isPlayerNear(playerPosition) {
    const distance = playerPosition.distanceTo(this.npc.model.position);
    return distance < this.npc.interactionDistance;
  }
  
  checkForNearbyNPCs(npcs) {
    // Skip if already conversing or on cooldown
    if (this.isConversing || 
        this.npc.isInteracting || 
        this.isFollowing ||
        (performance.now() - this.lastConversationTime < this.conversationCooldown)) {
      return;
    }
    
 
    // Increase chance of initiating conversation (from 0.005 to 15)
    if (Math.random() > 15) {

      return;
    }
    
    // Increase interaction range (from 3 to 5)
    const interactionRange = 5;
    
    for (const otherNPC of npcs) {
      // Skip self and NPCs already in conversation
      if (otherNPC === this.npc || 
          otherNPC.behavior.isConversing || 
          otherNPC.behavior.isFollowing ||
          otherNPC.isInteracting) {
        continue;
      }
      
      // Check if NPCs are close enough
      const distance = this.npc.model.position.distanceTo(otherNPC.model.position);
      if (distance < interactionRange) {
        // Start conversation
        this.startConversationWith(otherNPC);
        break;
      }
    }
  }
  
  startConversationWith(otherNPC) {
    if (!otherNPC || otherNPC === this.npc || 
        otherNPC.behavior.isConversing || 
        otherNPC.isInteracting) {
      return false;
    }
    
    // Move toward the other NPC first
    this.moveTowardNPC(otherNPC, () => {
      this.startConversation(otherNPC);
    });
    
    return true;
  }
  
  moveTowardNPC(otherNPC, callback) {
    // Already close enough
    const distance = this.npc.model.position.distanceTo(otherNPC.model.position);
    if (distance < 3) {
      if (callback) callback();
      return;
    }
    
    // Set up temporary directed movement
    const originalWalking = this.isWalking;
    const originalDirection = this.walkDirection.clone();
    this.isWalking = true;
    
    // Calculate direction to other NPC
    const direction = new THREE.Vector3()
      .subVectors(otherNPC.model.position, this.npc.model.position)
      .normalize();
    this.walkDirection = direction;
    
    // Move until close enough
    const checkDistance = () => {
      const newDistance = this.npc.model.position.distanceTo(otherNPC.model.position);
      if (newDistance < 3) {
        // Reset to original state
        this.isWalking = originalWalking;
        this.walkDirection = originalDirection;
        
        if (callback) callback();
      } else {
        // Continue moving
        setTimeout(checkDistance, 100);
      }
    };
    
    checkDistance();
  }
  
  startConversation(otherNPC) {

    if (!otherNPC || otherNPC === this.npc || 
        otherNPC.behavior.isConversing || 
        otherNPC.isInteracting) {
      return false;
    }
    

    this.isConversing = true;
    this.conversationPartner = otherNPC;
    otherNPC.behavior.isConversing = true;
    otherNPC.behavior.conversationPartner = this.npc;
    
    // Face each other
    const direction = new THREE.Vector3()
      .subVectors(otherNPC.model.position, this.npc.model.position)
      .normalize();
    this.npc.model.rotation.y = Math.atan2(direction.x, direction.z);
    
    const reverseDirection = new THREE.Vector3()
      .subVectors(this.npc.model.position, otherNPC.model.position)
      .normalize();
    otherNPC.model.rotation.y = Math.atan2(reverseDirection.x, reverseDirection.z);
    
    // Show visual indicators
    this.npc.showConversationBubble();
    otherNPC.showConversationBubble();
    
    // Generate conversation dialog
    this.generateConversation(otherNPC);
    
    // Set timeout to end conversation

 
 
    const conversationDuration = 50000 + Math.random() * 10; // 1 minute ish

    this.conversationTimeout = setTimeout(() => {
      this.endConversation();
      otherNPC.behavior.endConversation();
    }, conversationDuration);
  }
  
  async generateConversation(otherNPC) {
    try {
      // Get previous conversations if they exist
      const previousConversations = this.npc.data.npcConversations?.[otherNPC.data.id] || [];
      
      // Get their relationships with the player and other NPCs for context
      const thisNPCPlayerHistory = this.npc.data.conversationHistory || [];
      const otherNPCPlayerHistory = otherNPC.data.conversationHistory || [];
      
      // Generate conversation dialog with AI
      const completion = await websim.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `Generate an engaging conversation between two NPCs:
            - ${this.npc.data.name} (${this.npc.data.personality})
            - ${otherNPC.data.name} (${otherNPC.data.personality})
            
            Previous conversations between them:
            ${previousConversations.map(conv => `${conv.timestamp}: ${JSON.stringify(conv.messages)}`).join('\n')}
            
            ${this.npc.data.name}'s recent interactions with player: ${thisNPCPlayerHistory.slice(-3).map(h => h.content).join('; ')}
            ${otherNPC.data.name}'s recent interactions with player: ${otherNPCPlayerHistory.slice(-3).map(h => h.content).join('; ')}
            
            Format: JSON with structure:
            {
              "messages": [
                {"speaker": "NPC1_NAME", "text": "Hello there!"},
                {"speaker": "NPC2_NAME", "text": "Oh, hi!"}
              ]
            }
            
            Important:
            1. Reference previous conversations and player interactions
            2. Show continuity in their relationship
            3. They might discuss the player character
            4. Keep it to 4-6 exchanges for threaded display
            5. Stay in character and be engaging`
          }
        ],
        json: true
      });
      
      // Parse the conversation
      const conversation = JSON.parse(completion.content);
      
      // Store the conversation in both NPCs' memory
      const timestamp = new Date().toISOString();
      
      // Initialize npcConversations if needed
      if (!this.npc.data.npcConversations) {
        this.npc.data.npcConversations = {};
      }
      if (!otherNPC.data.npcConversations) {
        otherNPC.data.npcConversations = {};
      }
      
      // Store in first NPC's memory
      if (!this.npc.data.npcConversations[otherNPC.data.id]) {
        this.npc.data.npcConversations[otherNPC.data.id] = [];
      }
      this.npc.data.npcConversations[otherNPC.data.id].push({
        timestamp,
        messages: conversation.messages
      });
      
      // Store in second NPC's memory
      if (!otherNPC.data.npcConversations[this.npc.data.id]) {
        otherNPC.data.npcConversations[this.npc.data.id] = [];
      }
      otherNPC.data.npcConversations[this.npc.data.id].push({
        timestamp,
        messages: conversation.messages
      });
      
      // Display the conversation
      if (conversation.messages && Array.isArray(conversation.messages)) {
        this.npc.displayNPCConversation(conversation.messages, otherNPC);
      }
      
      // Save conversation history to room state
      if (this.npc.npcManager && this.npc.npcManager.room) {
        const room = this.npc.npcManager.room;
        if (this.npc.data.id && otherNPC.data.id) {

          // Create new objects for the update to ensure reactivity
          const updatedNpc1Conversations = {
            ...room.roomState.npcs[this.npc.data.id]?.data?.npcConversations,
            [otherNPC.data.id]: [...(room.roomState.npcs[this.npc.data.id]?.data?.npcConversations?.[otherNPC.data.id] || []), { timestamp, messages: conversation.messages }]
          };

          const updatedNpc2Conversations = {
             ...room.roomState.npcs[otherNPC.data.id]?.data?.npcConversations,
             [this.npc.data.id]: [...(room.roomState.npcs[otherNPC.data.id]?.data?.npcConversations?.[this.npc.data.id] || []), { timestamp, messages: conversation.messages }]
          };


          room.updateRoomState({
            npcs: {
              [this.npc.data.id]: {
                ...room.roomState.npcs[this.npc.data.id],
                data: {

 
 
 
                  ...room.roomState.npcs[this.npc.data.id]?.data,
                  npcConversations: updatedNpc1Conversations

                }
              },
              [otherNPC.data.id]: {
                ...room.roomState.npcs[otherNPC.data.id],
                data: {

 
 
 
                  ...room.roomState.npcs[otherNPC.data.id]?.data,
                  npcConversations: updatedNpc2Conversations

                }
              }
            }
          });
        }
      }
      
    } catch (error) {
      console.error('Error generating NPC conversation:', error);
      this.endConversation();

 
 
      if (otherNPC.behavior.isConversing && otherNPC.behavior.conversationPartner === this.npc) {
         otherNPC.behavior.endConversation();
      }

    }
  }
  
  endConversation() {
    if (this.conversationTimeout) {
      clearTimeout(this.conversationTimeout);
      this.conversationTimeout = null;
    }
    
    this.isConversing = false;
    this.npc.hideConversationBubble();
    
    // Record the time this conversation ended
    this.lastConversationTime = performance.now();
    
    if (this.conversationPartner) {
      // Clean up partner if they haven't already done so
      if (this.conversationPartner.behavior.isConversing && 
          this.conversationPartner.behavior.conversationPartner === this.npc) {
        this.conversationPartner.behavior.isConversing = false;
        this.conversationPartner.hideConversationBubble();
        this.conversationPartner.behavior.lastConversationTime = performance.now();
      }
      this.conversationPartner = null;
    }
  }
}