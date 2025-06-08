import { getScreenPosition } from './screenUtils.js';

export class UIManager {
  constructor(gameManager, npcManager) {
    this.gameManager = gameManager;
    this.npcManager = npcManager;
    this.chatInputContainer = null;
    this.chatInput = null;
    this.chatButton = null;
    
    this.createUI();
    this.setupEventListeners();
  }
  
  createUI() {
    // Create chat input container
    this.chatInputContainer = document.createElement('div');
    this.chatInputContainer.id = 'chat-input-container';
    
    this.chatInput = document.createElement('input');
    this.chatInput.id = 'chat-input';
    this.chatInput.type = 'text';
    this.chatInput.maxLength = 100;
    this.chatInput.placeholder = 'Type a message...';
    this.chatInputContainer.appendChild(this.chatInput);
    
    // Add close button for chat input
    const closeChat = document.createElement('div');
    closeChat.id = 'close-chat';
    closeChat.innerHTML = '✕';
    this.chatInputContainer.appendChild(closeChat);
    
    document.getElementById('game-container').appendChild(this.chatInputContainer);
    
    // Create chat button for all devices
    this.chatButton = document.createElement('div');
    this.chatButton.id = 'chat-button';
    this.chatButton.innerText = 'CHAT';
    document.getElementById('game-container').appendChild(this.chatButton);
  }
  
  setupEventListeners() {
    // Chat event listeners
    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && this.chatInputContainer.style.display !== 'block') {
        e.preventDefault();
        this.openChatInput();
      } else if (e.key === 'Escape' && this.chatInputContainer.style.display === 'block') {
        this.closeChatInput();
      } else if (e.key === 'Enter' && this.chatInputContainer.style.display === 'block') {
        this.sendChatMessage();
      }
    });
    
    document.getElementById('close-chat').addEventListener('click', () => {
      this.closeChatInput();
    });
    
    this.chatButton.addEventListener('click', (e) => {
      e.preventDefault();
      if (this.chatInputContainer.style.display === 'block') {
        this.closeChatInput();
      } else {
        this.openChatInput();
      }
    });
    
    this.chatInput.addEventListener('keydown', (e) => {
      e.stopPropagation(); // Prevent movement keys from triggering while typing
      if (e.key === 'Enter') {
        this.sendChatMessage();
      } else if (e.key === 'Escape') {
        this.closeChatInput();
      }
    });
  }
  
  openChatInput() {
    this.chatInputContainer.style.display = 'block';
    this.chatInput.focus();
    
    // Disable player controls while chatting
    this.gameManager.setControlsEnabled(false);
  }
  
  closeChatInput() {
    this.chatInputContainer.style.display = 'none';
    this.chatInput.value = '';
    
    // Re-enable player controls
    this.gameManager.setControlsEnabled(true);
  }
  
  sendChatMessage() {
    const message = this.chatInput.value.trim();
    if (message) {
      // Send chat message to all players through the game manager
      this.gameManager.sendChatMessage(message);
      
      // Clear and close input
      this.chatInput.value = '';
      this.closeChatInput();
    }
  }
  
  update(camera, renderer) {
    // Update UI elements that need camera position
    this.gameManager.updateLabelsAndChatMessages(camera, renderer);
  }
}