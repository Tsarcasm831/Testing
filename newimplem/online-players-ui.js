class OnlinePlayersUI {
    constructor() {
        this.screenElement = document.getElementById('online-players-screen');
        this.listElement = document.getElementById('online-players-list');
        this.closeButton = document.getElementById('close-online-players-button');
        this.multiplayerManager = null;
        this.isVisible = false;
    }

    setMultiplayerManager(manager) {
        this.multiplayerManager = manager;
    }

    show() {
        if (!this.screenElement || this.isVisible) return;
        this.updatePlayerList();
        this.screenElement.style.display = 'flex';
        this.isVisible = true;
    }

    hide() {
        if (!this.screenElement || !this.isVisible) return;
        this.screenElement.style.display = 'none';
        this.isVisible = false;
    }

    updatePlayerList() {
        if (!this.multiplayerManager || !this.listElement) return;

        const room = this.multiplayerManager.getRoom();
        if (!room || !room.peers) {
            this.listElement.innerHTML = '<li>Connecting to server...</li>';
            return;
        }
        
        const peers = Object.values(room.peers);
        
        if (peers.length === 0) {
             this.listElement.innerHTML = '<li>Waiting for players...</li>';
             return;
        }
        
        this.listElement.innerHTML = ''; // Clear existing list

        peers.sort((a, b) => a.username.localeCompare(b.username));

        for (const peer of peers) {
            const listItem = document.createElement('li');
            
            const avatar = document.createElement('img');
            avatar.src = peer.avatarUrl || `https://images.websim.com/avatar/${peer.username}`;
            avatar.className = 'player-avatar';

            const username = document.createElement('span');
            username.textContent = peer.username || 'Player';
            username.className = 'player-username';

            listItem.appendChild(avatar);
            listItem.appendChild(username);
            this.listElement.appendChild(listItem);
        }
    }
}

export const onlinePlayersUI = new OnlinePlayersUI();