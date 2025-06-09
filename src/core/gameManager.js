import * as THREE from "three";
import { getScreenPosition } from '../utils/screenUtils.js';

export class GameManager {
  constructor(options) {
    this.scene = options.scene;
    this.room = options.room;
    this.camera = options.camera;
    this.renderer = options.renderer;
    this.playerModel = options.playerModel;
    this.playerName = options.playerName;
    this.clientId = options.clientId;
    
    // Object to store other players
    this.otherPlayers = {};
    this.playerLabels = {};
    this.chatMessages = {};
    this.playerControls = null;
    
    // Initialize player chat message
    this.createChatMessageForLocalPlayer();
    
    // Subscribe to presence updates
    this.subscribeToPresenceUpdates();
  }
  
  setPlayerControls(controls) {
    this.playerControls = controls;
  }
  
  setControlsEnabled(enabled) {
    if (this.playerControls) {
      this.playerControls.enabled = enabled;
    }
  }
  
  createPlayerLabel(playerId, username) {
    const label = document.createElement('div');
    label.className = 'player-name';
    label.textContent = username;
    document.getElementById('game-container').appendChild(label);
    return label;
  }
  
  createChatMessage(playerId) {
    const message = document.createElement('div');
    message.className = 'chat-message';
    message.style.display = 'none';
    document.getElementById('game-container').appendChild(message);
    return message;
  }
  
  createChatMessageForLocalPlayer() {
    this.chatMessages[this.clientId] = this.createChatMessage(this.clientId);
  }
  
  subscribeToPresenceUpdates() {
    this.room.subscribePresence((presence) => {
      for (const clientId in presence) {
        if (clientId === this.clientId) continue; // Skip self
        
        const playerData = presence[clientId];
        if (!playerData) continue;
        
        // Create new player if needed
        if (!this.otherPlayers[clientId] && playerData.x !== undefined && playerData.z !== undefined) {
          const peerInfo = this.room.peers[clientId] || {};
          const peerName = peerInfo.username || `Player${clientId.substring(0, 4)}`;
          
          const playerModel = this.createRemotePlayerModel(peerName);
          playerModel.position.set(playerData.x, playerData.y || 0.5, playerData.z);
          if (playerData.rotation !== undefined) {
            playerModel.rotation.y = playerData.rotation;
          }
          this.scene.add(playerModel);
          this.otherPlayers[clientId] = playerModel;
          
          // Create name label
          this.playerLabels[clientId] = this.createPlayerLabel(clientId, peerName);
          
          // Create chat message element
          this.chatMessages[clientId] = this.createChatMessage(clientId);
        }
        
        // Update existing player
        else if (this.otherPlayers[clientId] && playerData.x !== undefined && playerData.z !== undefined) {
          this.updateRemotePlayer(clientId, playerData);
        }
      }
      
      // Remove disconnected players
      this.removeDisconnectedPlayers(presence);
    });
  }
  
  createRemotePlayerModel(username) {
    // Import and use createPlayerModel from player.js
    const playerGroup = new THREE.Group();
    
    // Generate consistent color from username
    const hash = username.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
    }, 0);
    
    // Create a rectangular body instead of capsule
    const bodyGeometry = new THREE.BoxGeometry(0.6 * 0.7, 1.8 * 0.7, 0.3 * 0.7);
    const color = new THREE.Color(Math.abs(hash) % 0xffffff);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 1.3 * 0.7; 
    body.castShadow = true;
    playerGroup.add(body);
    
    // Add eyes, legs, etc.
    // (Simplified version from player.js)
    
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
    chatMesh.position.y = 2.3 * 0.7; 
    chatMesh.rotation.x = Math.PI / 12;
    chatMesh.visible = false;
    chatMesh.name = "chatBillboard";
    playerGroup.add(chatMesh);
    
    return playerGroup;
  }
  
  updateRemotePlayer(clientId, playerData) {
    this.otherPlayers[clientId].position.set(playerData.x, playerData.y || 0, playerData.z);
    if (playerData.rotation !== undefined) {
      this.otherPlayers[clientId].rotation.y = playerData.rotation;
    }
    
    // Animate legs if moving
    if (playerData.moving) {
      const leftLeg = this.otherPlayers[clientId].getObjectByName("leftLeg");
      const rightLeg = this.otherPlayers[clientId].getObjectByName("rightLeg");
      
      if (leftLeg && rightLeg) {
        const walkSpeed = 5;
        const walkAmplitude = 0.3;
        const animationPhase = performance.now() * 0.01 * walkSpeed; // Use performance.now() for consistent timing
        leftLeg.rotation.x = Math.sin(animationPhase) * walkAmplitude;
        rightLeg.rotation.x = Math.sin(animationPhase + Math.PI) * walkAmplitude;
      }
    } else {
      // Reset legs when standing still
      const leftLeg = this.otherPlayers[clientId].getObjectByName("leftLeg");
      const rightLeg = this.otherPlayers[clientId].getObjectByName("rightLeg");
      
      if (leftLeg && rightLeg) {
        leftLeg.rotation.x = 0;
        rightLeg.rotation.x = 0;
      }
    }
    
    // Update chat message if present
    if (playerData.chat && playerData.chat.message) {
      this.chatMessages[clientId].textContent = playerData.chat.message;
      this.chatMessages[clientId].style.display = 'block';
      
      // Hide message after 5 seconds
      setTimeout(() => {
        if (this.chatMessages[clientId]) {
          this.chatMessages[clientId].style.display = 'none';
        }
      }, 5000);
    }
  }
  
  removeDisconnectedPlayers(presence) {
    for (const clientId in this.otherPlayers) {
      if (!presence[clientId]) {
        this.scene.remove(this.otherPlayers[clientId]);
        delete this.otherPlayers[clientId];
        
        if (this.playerLabels[clientId]) {
          document.getElementById('game-container').removeChild(this.playerLabels[clientId]);
          delete this.playerLabels[clientId];
        }
        
        if (this.chatMessages[clientId]) {
          document.getElementById('game-container').removeChild(this.chatMessages[clientId]);
          delete this.chatMessages[clientId];
        }
      }
    }
  }
  
  sendChatMessage(message) {
    // Send chat message to all players
    this.room.updatePresence({
      chat: {
        message: message,
        timestamp: Date.now()
      }
    });
    
    // Show message for local player too
    this.chatMessages[this.clientId].textContent = message;
    this.chatMessages[this.clientId].style.display = 'block';
    
    // Hide message after 5 seconds
    setTimeout(() => {
      if (this.chatMessages[this.clientId]) {
        this.chatMessages[this.clientId].style.display = 'none';
      }
    }, 5000);
  }
  
  updateLabelsAndChatMessages(camera, renderer) {
    // Update name labels and chat messages for all players
    for (const clientId in this.otherPlayers) {
      if (this.playerLabels[clientId] && this.otherPlayers[clientId]) {
        const screenPosition = getScreenPosition(this.otherPlayers[clientId].position, camera, renderer);
        if (screenPosition) {
          this.playerLabels[clientId].style.left = `${screenPosition.x}px`;
          this.playerLabels[clientId].style.top = `${screenPosition.y - 20}px`;
          this.playerLabels[clientId].style.display = screenPosition.visible ? 'block' : 'none';
          
          // Position chat message above name label
          if (this.chatMessages[clientId]) {
            this.chatMessages[clientId].style.left = `${screenPosition.x}px`;
            this.chatMessages[clientId].style.top = `${screenPosition.y - 45}px`;
            // Only show if visible and has content
            if (this.chatMessages[clientId].textContent && screenPosition.visible) {
              this.chatMessages[clientId].style.display = 'block';
            }
          }
        } else {
          this.playerLabels[clientId].style.display = 'none';
          if (this.chatMessages[clientId]) {
            this.chatMessages[clientId].style.display = 'none';
          }
        }
      }
    }
    
    // Update local player's chat message position
    if (this.chatMessages[this.clientId] && this.playerModel) {
      const screenPosition = getScreenPosition(this.playerModel.position, camera, renderer);
      if (screenPosition && this.chatMessages[this.clientId].textContent) {
        this.chatMessages[this.clientId].style.left = `${screenPosition.x}px`;
        this.chatMessages[this.clientId].style.top = `${screenPosition.y - 45}px`;
        this.chatMessages[this.clientId].style.display = screenPosition.visible ? 'block' : 'none';
      } else {
        this.chatMessages[this.clientId].style.display = 'none';
      }
    }
  }
  
  update() {
    // Any per-frame updates for the game manager
  }
}