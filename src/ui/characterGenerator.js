import * as THREE from "three";

export class CharacterGenerator {
  constructor(scene, room, playerModel, playerControls, gameManager) {
    this.scene = scene;
    this.room = room;
    this.playerModel = playerModel;
    this.playerControls = playerControls;
    this.gameManager = gameManager;
    this.isGeneratingCharacter = false;
    this.generationQueue = []; 
    this.currentEditingNPC = null;
    this.npcList = [];
    
    this.setupUI();
  }
  
  setupUI() {
    // Character Creator UI elements
    this.openCreatorBtn = document.getElementById('open-creator-btn');
    this.characterCreator = document.getElementById('character-creator');
    this.closeCreatorBtn = document.getElementById('close-creator-btn');
    this.playerPrompt = document.getElementById('player-prompt');
    this.createPlayerBtn = document.getElementById('create-player-btn');
    this.characterNpcPrompt = document.getElementById('character-npc-prompt');
    this.createCharacterNpcBtn = document.getElementById('create-character-npc-btn');
    this.loadingOverlay = document.getElementById('loading-overlay');
    this.npcListContainer = document.getElementById('npc-list-container');
    
    // Hide the original NPC creator
    const npcCreator = document.getElementById('npc-creator');
    if (npcCreator) {
      npcCreator.style.display = 'none';
    }
    
    // Event listeners for character creator
    this.openCreatorBtn.addEventListener('click', () => this.openCharacterCreator());
    this.closeCreatorBtn.addEventListener('click', () => this.closeCharacterCreator());
    this.createPlayerBtn.addEventListener('click', () => this.createPlayerCharacter());
    this.createCharacterNpcBtn.addEventListener('click', () => this.createNpcCharacter());
    
    // Get existing NPCs from NPCManager if available
    setTimeout(() => {
      const npcManager = this.gameManager.npcManager || window.npcManager;
      if (npcManager && npcManager.npcs) {
        this.npcList = [...npcManager.npcs];
        this.updateNPCList();
      }
    }, 1000);
  }
  
  openCharacterCreator() {
    this.characterCreator.style.display = 'block';
    // Disable player controls while creator is open
    this.gameManager.setControlsEnabled(false);
    // Update NPC list
    this.updateNPCList();
  }
  
  closeCharacterCreator() {
    this.characterCreator.style.display = 'none';
    this.exitEditMode();
    // Re-enable player controls
    this.gameManager.setControlsEnabled(true);
  }
  
  updateNPCList() {
    if (!this.npcListContainer) return;
    
    // Clear the container
    this.npcListContainer.innerHTML = '';
    
    // Get NPCs from the manager
    const npcManager = this.gameManager.npcManager || window.npcManager;
    if (npcManager && npcManager.npcs && npcManager.npcs.length > 0) {
      this.npcList = [...npcManager.npcs];
    }
    
    if (this.npcList.length === 0) {
      const emptyMessage = document.createElement('div');
      emptyMessage.textContent = 'No NPCs created yet';
      emptyMessage.style.padding = '10px';
      emptyMessage.style.fontStyle = 'italic';
      this.npcListContainer.appendChild(emptyMessage);
      return;
    }
    
    // Add each NPC to the list
    this.npcList.forEach(npc => {
      const npcItem = document.createElement('div');
      npcItem.className = 'npc-list-item';
      
      const npcName = document.createElement('div');
      npcName.className = 'npc-name';
      npcName.textContent = npc.data.name || 'Unnamed NPC';
      
      const buttonsContainer = document.createElement('div');
      
      const editBtn = document.createElement('button');
      editBtn.className = 'npc-edit-btn';
      editBtn.textContent = 'Edit';
      editBtn.addEventListener('click', () => this.editNPC(npc));
      
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'npc-delete-btn';
      deleteBtn.textContent = 'Delete';
      deleteBtn.addEventListener('click', () => this.deleteNPC(npc));
      
      buttonsContainer.appendChild(editBtn);
      buttonsContainer.appendChild(deleteBtn);
      
      npcItem.appendChild(npcName);
      npcItem.appendChild(buttonsContainer);
      
      this.npcListContainer.appendChild(npcItem);
    });
  }
  
  editNPC(npc) {
    this.currentEditingNPC = npc;
    
    // Set the prompt text to the NPC's description
    this.characterNpcPrompt.value = npc.data.personalityDescription || 
                                    npc.data.personality || 
                                    `${npc.data.name} - ${npc.data.dialogue}`;
    
    // Add a visual indicator that we're in edit mode
    this.characterNpcPrompt.parentElement.classList.add('editing-mode');
    
    // Change the button text
    this.createCharacterNpcBtn.textContent = 'Update NPC';
    
    // Add cancel button if it doesn't exist
    if (!document.getElementById('cancel-edit-btn')) {
      const editControls = document.createElement('div');
      editControls.id = 'edit-controls';
      
      const cancelBtn = document.createElement('button');
      cancelBtn.id = 'cancel-edit-btn';
      cancelBtn.textContent = 'Cancel Edit';
      cancelBtn.style.backgroundColor = '#888';
      cancelBtn.style.color = 'white';
      cancelBtn.style.border = 'none';
      cancelBtn.style.borderRadius = '5px';
      cancelBtn.style.padding = '8px 12px';
      cancelBtn.style.cursor = 'pointer';
      cancelBtn.addEventListener('click', () => this.exitEditMode());
      
      editControls.appendChild(cancelBtn);
      this.characterNpcPrompt.parentElement.appendChild(editControls);
    }
  }
  
  exitEditMode() {
    this.currentEditingNPC = null;
    this.characterNpcPrompt.value = '';
    this.characterNpcPrompt.parentElement.classList.remove('editing-mode');
    this.createCharacterNpcBtn.textContent = 'Create NPC';
    
    const editControls = document.getElementById('edit-controls');
    if (editControls) {
      editControls.remove();
    }
  }
  
  deleteNPC(npc) {
    const npcManager = this.gameManager.npcManager || window.npcManager;
    if (npcManager) {
      // Ask for confirmation
      if (confirm(`Are you sure you want to delete "${npc.data.name}"?`)) {
        // Remove the NPC
        npc.remove();
        // Remove from NPCManager's list
        const index = npcManager.npcs.indexOf(npc);
        if (index > -1) {
          npcManager.npcs.splice(index, 1);
        }
        // Update our list
        this.npcList = [...npcManager.npcs];
        this.updateNPCList();
        
        // If we were editing this NPC, exit edit mode
        if (this.currentEditingNPC === npc) {
          this.exitEditMode();
        }
        
        // Delete from room state if it has an ID
        if (npc.data.id && this.room) {
          this.room.updateRoomState({
            npcs: {
              [npc.data.id]: null
            }
          });
        }
        
        this.showNotification(`${npc.data.name} has been deleted`);
      }
    }
  }
  
  showLoading(show) {
    this.loadingOverlay.style.display = show ? 'flex' : 'none';
    // Don't disable controls - allow free movement during generation
  }
  
  async createPlayerCharacter() {
    const userPrompt = this.playerPrompt.value.trim();
    if (!userPrompt) return;
    
    if (this.isGeneratingCharacter) {
      alert("Please wait while your character is being generated.");
      return;
    }
    
    this.isGeneratingCharacter = true;
    this.showLoading(true);
    // Keep player controls enabled during generation
    
    try {
      // Generate character model code
      const characterCode = await this.generateCharacterCode(userPrompt);
      
      // Store current position and rotation before removing the old character
      const currentPosition = { 
        x: this.playerModel.position.x, 
        y: this.playerModel.position.y, 
        z: this.playerModel.position.z 
      };
      const currentRotation = { y: this.playerModel.rotation.y };
      
      // Remove old character
      this.scene.remove(this.playerModel);
      
      // Create new character from code
      const newPlayerModel = this.createCharacterFromCode(characterCode);
      
      // Apply stored position and rotation to new character
      newPlayerModel.position.set(currentPosition.x, currentPosition.y, currentPosition.z);
      newPlayerModel.rotation.y = currentRotation.y;
      
      // Add to scene and update player model references
      this.scene.add(newPlayerModel);
      this.playerModel = newPlayerModel;
      
      // Update references in all necessary places
      if (this.playerControls) {
        this.playerControls.playerModel = newPlayerModel;
      }
      
      if (this.gameManager) {
        this.gameManager.playerModel = newPlayerModel;
        
        // Update the playerModel reference in the npcManager as well
        if (this.gameManager.npcManager) {
          this.gameManager.npcManager.playerModel = newPlayerModel;
        }
      }
      
      // Store current code
      this.currentPlayerCode = characterCode;
      
      // Update presence with character description
      if (this.room) {
        this.room.updatePresence({
          characterDescription: userPrompt
        });
      }
      
      // Success notification
      this.showNotification("Player character created successfully!");
      
      // Clear input and close creator
      this.playerPrompt.value = '';
      this.closeCharacterCreator();
      
    } catch (error) {
      console.error("Error generating player character:", error);
      alert("Failed to generate player character. Please try again.");
    } finally {
      this.isGeneratingCharacter = false;
      this.showLoading(false);
      // Controls remain enabled throughout
    }
  }
  
  async createNpcCharacter() {
    const npcPrompt = this.characterNpcPrompt.value.trim();
    if (!npcPrompt) return;
    
    // Add to queue instead of blocking
    const requestId = Date.now();
    this.generationQueue.push({
      id: requestId,
      prompt: npcPrompt,
      isEdit: !!this.currentEditingNPC,
      editingNPC: this.currentEditingNPC
    });
    
    // Clear input immediately to allow new requests
    if (!this.currentEditingNPC) {
      this.characterNpcPrompt.value = '';
    }
    
    // Show notification about queue position
    if (this.generationQueue.length > 1) {
      this.showNotification(`NPC added to generation queue (position ${this.generationQueue.length})`);
    }
    
    // Process queue if not already processing
    if (!this.isGeneratingCharacter) {
      this.processGenerationQueue();
    }
  }
  
  async processGenerationQueue() {
    if (this.generationQueue.length === 0) return;
    
    this.isGeneratingCharacter = true;
    this.showLoading(true);
    // Keep player controls enabled
    
    while (this.generationQueue.length > 0) {
      const request = this.generationQueue.shift();
      
      try {
        // Update loading text with current operation
        const loadingText = document.querySelector('.loading-text');
        if (loadingText) {
          loadingText.textContent = `Generating character... (${this.generationQueue.length} remaining)`;
        }
        
        // Get NPC Manager
        const npcManager = this.gameManager.npcManager || window.npcManager;
        if (!npcManager) {
          throw new Error("NPC Manager not found");
        }
        
        if (request.isEdit && request.editingNPC) {
          // Handle editing existing NPC
          const conversationHistory = request.editingNPC.data.conversationHistory || [];
          const modelCode = await this.generateCharacterCode(request.prompt);
          const currentPosition = new THREE.Vector3(
            request.editingNPC.model.position.x,
            request.editingNPC.model.position.y,
            request.editingNPC.model.position.z
          );
          const npcId = request.editingNPC.data.id;
          
          request.editingNPC.remove();
          const updatedNPC = await npcManager.createNPCFromPromptWithModel(request.prompt, modelCode);
          updatedNPC.data.conversationHistory = conversationHistory;
          updatedNPC.interaction.conversationHistory = conversationHistory;
          
          if (npcId) {
            updatedNPC.data.id = npcId;
          }
          
          updatedNPC.model.position.copy(currentPosition);
          
          if (npcId && npcManager.room) {
            npcManager.room.updateRoomState({
              npcs: {
                [npcId]: {
                  position: {
                    x: currentPosition.x, 
                    y: currentPosition.y, 
                    z: currentPosition.z
                  },
                  data: updatedNPC.data
                }
              }
            });
          }
          
          this.exitEditMode();
          this.updateNPCList();
          this.showNotification(`${updatedNPC.data.name} updated successfully!`);
        } else {
          // Handle creating new NPC
          const modelCode = await this.generateCharacterCode(request.prompt);
          await npcManager.createNPCFromPromptWithModel(request.prompt, modelCode);
          this.updateNPCList();
        }
      } catch (error) {
        console.error("Error generating NPC character:", error);
        this.showNotification("Failed to generate character. Continuing with queue...");
      }
    }
    
    this.isGeneratingCharacter = false;
    this.showLoading(false);
    // Controls remain enabled throughout
  }
  
  async generateCharacterCode(userPrompt) {
    try {
      const prompt = `Create Three.js code for a character model based on this description: ${userPrompt}

The code should be a valid JavaScript function that follows this format:
function createCharacter(THREE) {
    const group = new THREE.Group();
    
    // Your generated code goes here
    // Add objects to the group
    
    return group;
}

Important requirements:
1. The character should be centered at origin (0,0,0)
2. Keep the character proportional to a human (about 1.7 units tall)
3. Use only Three.js built-in geometries and materials
4. Return a THREE.Group containing all objects
5. Make sure the code is safe (no fetch, eval, etc.)
6. Be creative with colors and shapes to match the description`;

      const completion = await websim.chat.completions.create({
        messages: [
          { role: "system", content: "You are an expert Three.js developer who creates visually appealing 3D character models." },
          { role: "user", content: prompt }
        ]
      });

      const codeResponse = completion.content;
      
      // Extract just the function from the response
      const functionMatch = codeResponse.match(/function createCharacter\(THREE\) \{[\s\S]*return group;[\s\S]*\}/);
      if (!functionMatch) {
        throw new Error("Could not find valid function in generated code");
      }
      
      return functionMatch[0];
    } catch (error) {
      console.error("Error generating character code:", error);
      throw error;
    }
  }
  
  createCharacterFromCode(code) {
    try {
      // Create a safe function from the code
      const createCharacterFunc = new Function('THREE', `
        ${code}
        return createCharacter(THREE);
      `);
      
      // Execute the function with Three.js
      const characterGroup = createCharacterFunc(THREE);
      
      // Add name label and chat billboard (for consistent player features)
      this.addStandardPlayerFeatures(characterGroup);
      
      return characterGroup;
    } catch (error) {
      console.error("Error creating character from code:", error);
      throw error;
    }
  }
  
  addStandardPlayerFeatures(characterGroup) {
    // Add chat billboard
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const context = canvas.getContext('2d');
    context.fillStyle = 'rgba(0, 0, 0, 0)'; // Transparent background
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    
    const chatMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    
    const chatGeometry = new THREE.PlaneGeometry(1, 0.25);
    const chatMesh = new THREE.Mesh(chatGeometry, chatMaterial);
    chatMesh.position.y = 2.3; 
    chatMesh.rotation.x = Math.PI / 12;
    chatMesh.visible = false;
    chatMesh.name = "chatBillboard";
    characterGroup.add(chatMesh);
    
    return characterGroup;
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
}