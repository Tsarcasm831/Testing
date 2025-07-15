export class ChatUI {
    constructor(dependencies) {
        this.playerControls = dependencies.playerControls;
        this.room = dependencies.room;
        this.multiplayerManager = dependencies.multiplayerManager;

        this.chatContainer = null;
        this.chatLog = null;
        this.chatInput = null;
        this.chatButton = null;

        this.isOpen = false;
        this.inputFocused = false;
        this.lastMessageTime = 0;
        /* @tweakable Time in milliseconds for the chat window to stay visible after a message. */
        this.visibilityTimeoutDuration = 8000;
        this.visibilityTimeout = null;

        if (this.multiplayerManager) {
            this.multiplayerManager.setChatLogMessageHandler((messageData) => this.addMessageToLog(messageData));
        }
    }

    create() {
        const uiContainer = document.getElementById('ui-container');

        this.chatContainer = document.createElement('div');
        this.chatContainer.id = 'chat-ui-container';
        uiContainer.appendChild(this.chatContainer);

        this.chatLog = document.createElement('div');
        this.chatLog.id = 'chat-log';
        this.chatContainer.appendChild(this.chatLog);

        const chatInputContainer = document.createElement('div');
        chatInputContainer.id = 'chat-input-container';
        
        this.chatInput = document.createElement('input');
        this.chatInput.id = 'chat-input';
        this.chatInput.type = 'text';
        this.chatInput.maxLength = 100;
        this.chatInput.placeholder = 'Press / to chat';
        chatInputContainer.appendChild(this.chatInput);
        
        this.chatContainer.appendChild(chatInputContainer);
        
        this.chatButton = document.createElement('div');
        this.chatButton.id = 'chat-button';
        this.chatButton.classList.add('circle-button');
        this.chatButton.setAttribute('data-tooltip', 'Toggle Chat');
        this.chatButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M4.929 19.071c-1.243-1.243-1.95-2.925-1.95-4.707C2.979 9.58 7.56 5.02 12.368 5.02c4.787 0 9.39 4.54 9.39 9.344 0 4.804-4.583 9.364-9.39 9.364a13.9 13.9 0 01-3.64-.563L4.929 19.07z"/></svg>`;
        uiContainer.appendChild(this.chatButton);

        this.setupEventListeners();
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.key === '/' && !this.inputFocused) {
                e.preventDefault();
                this.openChatInput();
            } else if (e.key === 'Escape' && this.inputFocused) {
                this.closeChatInput();
            } else if (e.key === 'Enter' && this.inputFocused) {
                this.sendChatMessage();
            }
        });

        this.chatInput.addEventListener('focus', () => {
            this.inputFocused = true;
            this.playerControls.enabled = false;
            this.showChatWindow(true); // Keep window open while typing
        });
        
        this.chatInput.addEventListener('blur', () => {
            this.inputFocused = false;
            if (this.playerControls) this.playerControls.enabled = true;
            this.resetVisibilityTimeout();
        });
        
        this.chatButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleChatWindow();
        });
    }

    openChatInput() {
        this.showChatWindow();
        this.chatInput.focus();
    }

    closeChatInput() {
        this.chatInput.value = '';
        this.chatInput.blur();
        this.hideChatWindow();
    }

    sendChatMessage() {
        const message = this.chatInput.value.trim();
        if (message) {
            this.room.updatePresence({ chat: { message, timestamp: Date.now() } });
            if (this.multiplayerManager) {
                this.multiplayerManager.displayChatMessage(this.room.clientId, message);
            }
        }
        this.closeChatInput();
    }

    addMessageToLog({clientId, username, message}) {
        const entry = document.createElement('div');
        entry.className = 'chat-log-entry';
        
        const isLocal = clientId === this.room.clientId;
        entry.classList.add(isLocal ? 'local-user' : 'other-user');
        
        const usernameSpan = document.createElement('span');
        usernameSpan.className = 'username';
        /* @tweakable User color for the local player's name in chat. */
        const localUsernameColor = '#44aaff';
        /* @tweakable User color for other players' names in chat. */
        const otherUsernameColor = '#ff8888';
        usernameSpan.style.color = isLocal ? localUsernameColor : otherUsernameColor;
        usernameSpan.textContent = isLocal ? 'You: ' : `${username}: `;
        
        const messageNode = document.createTextNode(message);
        
        entry.appendChild(usernameSpan);
        entry.appendChild(messageNode);
        
        this.chatLog.appendChild(entry);
        this.chatLog.scrollTop = this.chatLog.scrollHeight;
        
        this.showChatWindow();
    }

    showChatWindow(keepOpen = false) {
        this.isOpen = true;
        this.chatContainer.classList.add('visible');
        this.lastMessageTime = Date.now();
        if(this.visibilityTimeout) clearTimeout(this.visibilityTimeout);
        if(!keepOpen) {
            this.resetVisibilityTimeout();
        }
    }

    hideChatWindow() {
        if (this.inputFocused) return;
        this.isOpen = false;
        this.chatContainer.classList.remove('visible');
        if (this.visibilityTimeout) clearTimeout(this.visibilityTimeout);
    }
    
    toggleChatWindow() {
        if(this.isOpen) this.hideChatWindow();
        else this.showChatWindow(true); // Keep open when manually toggled
    }

    resetVisibilityTimeout() {
        if (this.visibilityTimeout) clearTimeout(this.visibilityTimeout);
        this.visibilityTimeout = setTimeout(() => {
            if (!this.inputFocused) {
                this.hideChatWindow();
            }
        }, this.visibilityTimeoutDuration);
    }
    
    update() {
        if (this.isOpen && !this.inputFocused && (Date.now() - this.lastMessageTime > this.visibilityTimeoutDuration)) {
            // This logic is now handled by the timeout
        }
    }
}