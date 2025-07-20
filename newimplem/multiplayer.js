import * as THREE from 'three';
import { OtherPlayer } from './other-player.js';
import { onlinePlayersUI } from './online-players-ui.js';

export class MultiplayerManager {
    constructor(scene, localPlayer) {
        this.scene = scene;
        this.localPlayer = localPlayer;
        this.otherPlayers = new Map();
        this.room = null;
    }

    getRoom() {
        return this.room;
    }

    setRoom(room) {
        this.room = room;
        // If we set the room manually, also set it on the player.
        this.localPlayer.setRoom(room);
        // And do an initial UI update.
        onlinePlayersUI.updatePlayerList();
    }

    async initialize(shouldCreateRoom = true) {
        if (typeof WebsimSocket === 'undefined') {
            console.warn("Multiplayer is not available (WebsimSocket not found).");
            return;
        }
        
        if (shouldCreateRoom) {
            this.room = new WebsimSocket();
        } else if (!this.room) {
             console.log("MultiplayerManager waiting for room to be set.");
             return;
        }
        
        try {
            if (shouldCreateRoom) {
                await this.room.initialize();
                this.localPlayer.setRoom(this.room);
            }

            // Set initial presence
            const initialPos = this.localPlayer.position;
            const initialQuat = this.localPlayer.camera.quaternion;
            this.room.updatePresence({
                position: { x: initialPos.x, y: initialPos.y, z: initialPos.z },
                quaternion: { x: initialQuat.x, y: initialQuat.y, z: initialQuat.z, w: initialQuat.w },
                username: this.room.peers[this.room.clientId]?.username || 'Player'
            });

            this.room.subscribePresence(this.handlePresenceUpdate.bind(this));
            console.log("Multiplayer initialized. Client ID:", this.room.clientId);
            
            // Initial update for the UI
            onlinePlayersUI.updatePlayerList();
            
        } catch (error) {
            console.error("Failed to initialize multiplayer:", error);
        }
    }

    handlePresenceUpdate() {
        const currentPeerIds = Object.keys(this.room.peers);

        // Add or update players
        for (const clientId of currentPeerIds) {
            if (clientId === this.room.clientId) continue;

            const presenceState = this.room.presence[clientId];
            const peerInfo = this.room.peers[clientId];
            if (!presenceState || !peerInfo) continue;

            if (this.otherPlayers.has(clientId)) {
                // Update existing player
                const otherPlayer = this.otherPlayers.get(clientId);
                if (presenceState.position && presenceState.quaternion) {
                    otherPlayer.setData(presenceState);
                }
            } else {
                // Add new player
                console.log(`Player ${peerInfo.username} (${clientId}) joined.`);
                const otherPlayer = new OtherPlayer(peerInfo, this.scene);
                this.otherPlayers.set(clientId, otherPlayer);
                if (presenceState.position && presenceState.quaternion) {
                    otherPlayer.setData(presenceState, true); // True to teleport on first appearance
                }
            }
        }

        // Remove disconnected players
        for (const [clientId, otherPlayer] of this.otherPlayers.entries()) {
            if (!currentPeerIds.includes(clientId)) {
                console.log(`Player ${otherPlayer.peerInfo.username} (${clientId}) left.`);
                otherPlayer.dispose();
                this.otherPlayers.delete(clientId);
            }
        }
        
        onlinePlayersUI.updatePlayerList();
    }

    update(delta) {
        for (const player of this.otherPlayers.values()) {
            player.update(delta);
        }
    }
}