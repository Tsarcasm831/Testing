export class NPCInteraction {
  constructor(npc) {
    this.npc = npc;
    this.conversationHistory = [];
    // Load any saved conversation history from the NPC's data
    if (this.npc.data.conversationHistory && Array.isArray(this.npc.data.conversationHistory)) {
      this.conversationHistory = this.npc.data.conversationHistory;
    }
  }
  
  async interact() {
    const dialogueContainer = document.getElementById('npc-dialogue-container');
    const dialogueElement = document.getElementById('npc-dialogue');
    const nameElement = document.getElementById('npc-name');
    const conversationContainer = document.getElementById('npc-conversation-container');
    const historyContainer = document.getElementById('npc-conversation-history');
    
    // Set NPC to interacting state to stop movement
    this.npc.isInteracting = true;
    
    // Clear previous conversation history display
    historyContainer.innerHTML = '';
    
    // If this is a new interaction (not resuming), add initial NPC dialogue if not already added
    if (!dialogueContainer.style.display || dialogueContainer.style.display === 'none') {
      // Only add initial dialogue if conversation history is empty
      if (this.conversationHistory.length === 0) {
        // Get player character description if available
        const playerCharacterDescription = this.getPlayerCharacterDescription();
        let initialDialogue = this.npc.data.dialogue;
        
        // If we have a player character description, generate a custom greeting
        if (playerCharacterDescription) {
          try {
            const customGreeting = await this.generateCustomGreeting(playerCharacterDescription);
            if (customGreeting) {
              initialDialogue = customGreeting;
            }
          } catch (error) {
            console.error("Error generating custom greeting:", error);
          }
        }
        
        this.conversationHistory.push({
          role: "assistant",
          content: initialDialogue,
          timestamp: Date.now()
        });
        
        // Save conversation history to NPC's data
        this.saveConversationHistory();
      }
    }
    
    // Display the conversation history
    this.displayConversationHistory();
    
    nameElement.textContent = this.npc.data.name;
    dialogueElement.textContent = this.conversationHistory[this.conversationHistory.length - 1]?.content || this.npc.data.dialogue;
    conversationContainer.style.display = 'flex';
    dialogueContainer.style.display = 'block';
    
    // Focus on input field
    document.getElementById('npc-conversation-input').focus();
  }
  
  getPlayerCharacterDescription() {
    // Get the player's character description from the room presence
    if (this.npc.npcManager && this.npc.npcManager.room) {
      const room = this.npc.npcManager.room;
      const clientId = room.clientId;
      if (room.presence[clientId] && room.presence[clientId].characterDescription) {
        return room.presence[clientId].characterDescription;
      }
    }
    return null;
  }
  
  async generateCustomGreeting(playerDescription) {
    try {
      const completion = await websim.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are ${this.npc.data.name}, a ${this.npc.data.name} with the personality: ${this.npc.data.personality}. 
            The player character is ${playerDescription}.
            Create an initial greeting that acknowledges and reacts to the player's appearance and role.
            Keep your response concise (1-3 sentences). Stay in character.`
          }
        ]
      });
      
      return completion.content;
    } catch (error) {
      console.error("Error generating custom greeting:", error);
      return null;
    }
  }
  
  displayConversationHistory() {
    const historyContainer = document.getElementById('npc-conversation-history');
    historyContainer.innerHTML = '';
    
    // Generate HTML for conversation history
    this.conversationHistory.forEach((entry) => {
      const entryDiv = document.createElement('div');
      entryDiv.className = 'conversation-entry ' + (entry.role === 'user' ? 'player-message' : 'npc-message');
      
      const speakerDiv = document.createElement('div');
      speakerDiv.className = 'entry-speaker';
      speakerDiv.textContent = entry.role === 'user' ? 'You' : this.npc.data.name;
      entryDiv.appendChild(speakerDiv);
      
      const textDiv = document.createElement('div');
      textDiv.className = 'entry-text';
      textDiv.textContent = entry.content;
      entryDiv.appendChild(textDiv);
      
      if (entry.timestamp) {
        const timestampDiv = document.createElement('div');
        timestampDiv.className = 'timestamp';
        const date = new Date(entry.timestamp);
        timestampDiv.textContent = date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        entryDiv.appendChild(timestampDiv);
      }
      
      historyContainer.appendChild(entryDiv);
    });
    
    // Scroll to bottom
    historyContainer.scrollTop = historyContainer.scrollHeight;
  }
  
  saveConversationHistory() {
    // Save conversation history to NPC's data
    this.npc.data.conversationHistory = [...this.conversationHistory];
    
    // If NPC has an ID, save to room state
    if (this.npc.data.id && this.npc.npcManager && this.npc.npcManager.room) {
      // Get existing NPC data from room state
      const room = this.npc.npcManager.room;
      const npcId = this.npc.data.id;
      
      if (room.roomState.npcs && room.roomState.npcs[npcId]) {
        // Update just the conversation history in the NPC data
        room.updateRoomState({
          npcs: {
            [npcId]: {
              ...room.roomState.npcs[npcId],
              data: {
                ...room.roomState.npcs[npcId].data,
                conversationHistory: this.conversationHistory
              }
            }
          }
        });
      }
    }
  }
  
  async continueConversation(userMessage) {
    const dialogueElement = document.getElementById('npc-dialogue');
    
    // Update conversation history with user's message
    this.conversationHistory.push({
      role: "user",
      content: userMessage,
      timestamp: Date.now()
    });
    
    // Update the history display
    this.displayConversationHistory();
    
    // Handle special queries about other NPCs
    if (userMessage.toLowerCase().includes("tell me about") || 
        userMessage.toLowerCase().includes("what do you think of") ||
        userMessage.toLowerCase().includes("know about")) {
      
      // Check if user is asking about another NPC
      const npcManager = this.npc.npcManager;
      if (npcManager) {
        for (const otherNPC of npcManager.npcs) {
          if (otherNPC !== this.npc && 
              userMessage.toLowerCase().includes(otherNPC.data.name.toLowerCase())) {
            
            // Get conversation history with that NPC
            const npcConversations = this.npc.data.npcConversations?.[otherNPC.data.id] || [];
            
            try {
              const completion = await websim.chat.completions.create({
                messages: [
                  {
                    role: "system",
                    content: `You are ${this.npc.data.name} with personality: ${this.npc.data.personality}. 
                    The player is asking about ${otherNPC.data.name} (${otherNPC.data.personality}).
                    
                    Your conversation history with ${otherNPC.data.name}:
                    ${npcConversations.map(conv => 
                      conv.messages?.map(msg => `${msg.speaker}: ${msg.text}`).join('\n')
                    ).join('\n')}
                    
                    Respond based on your actual interactions and memories with ${otherNPC.data.name}.
                    If you haven't interacted much, say so. Stay in character.`
                  },
                  {
                    role: "user",
                    content: userMessage
                  }
                ],
              });
              
              dialogueElement.textContent = completion.content;
              
              this.conversationHistory.push({
                role: "assistant",
                content: completion.content,
                timestamp: Date.now()
              });
              
              this.displayConversationHistory();
              this.saveConversationHistory();
              return;
              
            } catch (error) {
              console.error('Error generating NPC relationship response:', error);
            }
          }
        }
      }
    }

    // Handle special commands
    if (userMessage.toLowerCase().includes("follow me")) {
      dialogueElement.textContent = "I'll follow you!";
      this.npc.behavior.startFollowing();
      
      // Add to conversation history
      this.conversationHistory.push({
        role: "assistant",
        content: "I'll follow you!",
        timestamp: Date.now()
      });
      
      // Save conversation history
      this.saveConversationHistory();
      
      return;
    }
    
    if (userMessage.toLowerCase().includes("have a conversation")) {
      const npcManager = this.npc.npcManager;
      if (npcManager) {
        const nearbyNpc = npcManager.findNearestNPC(this.npc);
        if (nearbyNpc) {
          dialogueElement.textContent = `I'll go talk to ${nearbyNpc.data.name}!`;
          // End current interaction and initiate NPC-to-NPC conversation
          setTimeout(() => {
            this.npc.isInteracting = false;
            this.npc.behavior.startConversationWith(nearbyNpc);
            document.getElementById('npc-dialogue-container').style.display = 'none';
          }, 1500);
          
          // Add to conversation history
          this.conversationHistory.push({
            role: "assistant",
            content: `I'll go talk to ${nearbyNpc.data.name}!`,
            timestamp: Date.now()
          });
          
          // Save conversation history
          this.saveConversationHistory();
          
          return;
        } else {
          dialogueElement.textContent = "I don't see anyone else nearby to talk to.";
          
          // Add to conversation history
          this.conversationHistory.push({
            role: "assistant",
            content: "I don't see anyone else nearby to talk to.",
            timestamp: Date.now()
          });
          
          // Save conversation history
          this.saveConversationHistory();
          
          return;
        }
      }
    }
    
    // Display loading message
    dialogueElement.textContent = "Thinking...";
    
    try {
      // Get player character description if available
      const playerDescription = this.getPlayerCharacterDescription() || "unknown appearance";
      
      // Enhanced context with NPC relationships
      let relationshipContext = "";
      if (this.npc.data.npcConversations) {
        const npcManager = this.npc.npcManager;
        for (const [npcId, conversations] of Object.entries(this.npc.data.npcConversations)) {
          if (npcManager) {
            const otherNPC = npcManager.npcs.find(n => n.data.id === npcId);
            if (otherNPC && conversations.length > 0) {
              relationshipContext += `\nRelationship with ${otherNPC.data.name}: ${conversations.length} past conversations. Recent topics: ${conversations.slice(-2).map(c => c.messages?.map(m => m.text).join(', ')).join('; ')}`;
            }
          }
        }
      }
      
      // Generate NPC response using AI with enhanced context
      const completion = await websim.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are ${this.npc.data.name}, with the personality: ${this.npc.data.personality}. 
            The player character is ${playerDescription}.
            
            Your relationships with other NPCs:${relationshipContext}
            
            Remember to:
            1. React appropriately to the player's appearance and role.
            2. Stay true to your personality: ${this.npc.data.personality}
            3. Reference your relationships with other NPCs when relevant
            4. Keep your responses concise (1-3 sentences)
            5. You have a persistent memory and remember all previous conversations.`
          },
          ...this.conversationHistory
        ]
      });
      
      // Add NPC response to conversation history
      this.conversationHistory.push({
        role: "assistant",
        content: completion.content,
        timestamp: Date.now()
      });
      
      // Update dialogue with NPC response
      dialogueElement.textContent = completion.content;
      
      // Update the history display
      this.displayConversationHistory();
      
      // Save conversation history
      this.saveConversationHistory();
      
    } catch (error) {
      console.error('Error generating NPC response:', error);
      dialogueElement.textContent = "Sorry, I couldn't understand that.";
    }
  }
  
  endInteraction() {
    this.npc.isInteracting = false;
  }
}