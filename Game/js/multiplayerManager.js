import * as THREE from 'three';

/* @tweakable The smoothing factor for remote player rotation. Lower is smoother but has more latency. */
const REMOTE_PLAYER_ROTATION_SMOOTHING = 0.1;

export class MultiplayerManager {
    constructor(dependencies) {
        this.room = dependencies.room;
        this.scene = dependencies.scene;
        this.camera = dependencies.camera;
        this.renderer = dependencies.renderer;
        this.buildTool = dependencies.buildTool;
        this.advancedBuildTool = dependencies.advancedBuildTool;
        this.createPlayerModel = dependencies.createPlayerModel;
        this.playerControls = dependencies.playerControls;

        this.otherPlayers = {};
        this.playerLabels = {};
        this.chatMessages = {};
        this.collectedRemotes = {};
        this.chatLogMessageHandler = null;
    }

    init() {
        this.subscribeToPresence();
        this.subscribeToMessages();
        this.subscribeToRoomState();
        this.chatMessages[this.room.clientId] = this._createChatMessageElement(this.room.clientId);
    }
    
    setChatLogMessageHandler(handler) {
        this.chatLogMessageHandler = handler;
    }

    subscribeToPresence() {
        this.room.subscribePresence((presence) => {
            for (const clientId in presence) {
                if (clientId === this.room.clientId) {
                    this.handleLocalPlayerChat(presence[clientId]);
                    continue;
                };

                const playerData = presence[clientId];
                if (!playerData) continue;

                if (!this.otherPlayers[clientId] && playerData.x !== undefined) {
                    this.addPlayer(clientId, playerData);
                } else if (this.otherPlayers[clientId] && playerData.x !== undefined) {
                    this.updatePlayer(clientId, playerData);
                }
            }

            for (const clientId in this.otherPlayers) {
                if (!presence[clientId]) {
                    this.removePlayer(clientId);
                }
            }
        });
    }

    handleLocalPlayerChat(playerData) {
        if (playerData.chat && this.chatMessages[this.room.clientId]?.lastTimestamp !== playerData.chat.timestamp) {
            this.chatMessages[this.room.clientId].lastTimestamp = playerData.chat.timestamp;
            this.displayChatMessage(this.room.clientId, playerData.chat.message);
        }
    }

    subscribeToMessages() {
        this.room.onmessage = (event) => {
            try {
                const data = event.data;
                if (!data || !data.type) return; // Add guard against empty/malformed messages

                switch(data.type) {
                    case 'build_object':
                        if (data.isAdvanced) this.advancedBuildTool.receiveBuildObject(data);
                        else this.buildTool.receiveBuildObject(data);
                        break;
                    case 'transform_object': this.advancedBuildTool.receiveObjectTransform(data); break;
                    case 'delete_build_object': this.advancedBuildTool.receiveDeleteObject(data.objectId); break;
                    case 'color_object': this.advancedBuildTool.receiveObjectColor(data); break;
                    case 'extend_lifespan': this.buildTool.receiveLifespanExtension(data); break;
                }
            } catch (error) {
                /* @tweakable Set to true to see detailed logs for WebSocket message handling errors. */
                const enableWebSocketErrorLogging = true;
                if (enableWebSocketErrorLogging) {
                    console.error("Error handling incoming WebSocket message:", error, event.data);
                }
            }
        };
    }
    
    subscribeToRoomState() {
        this.room.subscribeRoomState((roomState) => {
            if (roomState.collectedRemotes) {
                this.collectedRemotes = {...roomState.collectedRemotes};
                this.scene.traverse((object) => {
                    if (object.userData.isRemote && this.collectedRemotes[object.userData.remoteId]) {
                        object.visible = false;
                    }
                });
                if (Object.keys(this.collectedRemotes).length > 0 && document.getElementById('useless-button')) {
                    document.getElementById('useless-button').style.display = 'block';
                }
            }
        });
    }

    addPlayer(clientId, playerData) {
        const peerInfo = this.room.peers[clientId] || {};
        /* @tweakable The prefix to use for player names when a username is not available. */
        const fallbackNamePrefix = 'Player';
        const peerName = peerInfo.username || `${fallbackNamePrefix}${clientId.substring(0, 4)}`;
        
        const playerModel = this.createPlayerModel(THREE, peerName, playerData.characterSpec);
        playerModel.position.set(playerData.x, playerData.y || 0.5, playerData.z);
        if (playerData.rotation) {
             const offset = playerModel.userData.isAnimatedGLB ? (playerModel.userData.rotationOffset || 0) : 0;
             playerModel.rotation.y = playerData.rotation + offset;
        }
        this.scene.add(playerModel);
        this.otherPlayers[clientId] = playerModel;
        
        this.playerLabels[clientId] = this._createPlayerLabelElement(clientId, peerName);
        this.chatMessages[clientId] = this._createChatMessageElement(clientId);
    }

    updatePlayer(clientId, playerData) {
        const playerModel = this.otherPlayers[clientId];
        if (playerData.characterSpec && JSON.stringify(playerModel.userData.characterSpec) !== JSON.stringify(playerData.characterSpec)) {
            this.scene.remove(playerModel);
            this.addPlayer(clientId, playerData);
        } else {
            playerModel.position.set(playerData.x, playerData.y || 0, playerData.z);
            if (playerData.rotation !== undefined) {
                const offset = playerModel.userData.isAnimatedGLB ? (playerModel.userData.rotationOffset || 0) : 0;
                const targetQuaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), playerData.rotation - offset);
                playerModel.quaternion.slerp(targetQuaternion, REMOTE_PLAYER_ROTATION_SMOOTHING);
            }
        }

        const leftLeg = playerModel.getObjectByName("leftLeg");
        const rightLeg = playerModel.getObjectByName("rightLeg");
        if (playerData.moving && leftLeg && rightLeg) {
            const animPhase = performance.now() * 0.05;
            leftLeg.rotation.x = Math.sin(animPhase) * 0.3;
            rightLeg.rotation.x = Math.sin(animPhase + Math.PI) * 0.3;
        } else if(leftLeg && rightLeg) {
            leftLeg.rotation.x = 0;
            rightLeg.rotation.x = 0;
        }
        
        if (playerData.chat && this.chatMessages[clientId].lastTimestamp !== playerData.chat.timestamp) {
            this.chatMessages[clientId].lastTimestamp = playerData.chat.timestamp;
            this.displayChatMessage(clientId, playerData.chat.message);
        }

        // Handle animation state for GLB models
        if (playerModel.userData.isAnimatedGLB) {
            const actions = playerModel.userData.actions;
            const fadeDuration = playerModel.userData.animationFadeDuration || 0.5;
            let newActionName = 'idle';

            if (playerData.flying) {
                /* @tweakable Animation to play for other flying players. Options: 'idle', 'walk', 'run'. */
                const remoteFlyAnimation = 'run';
                newActionName = playerData.moving ? remoteFlyAnimation : 'idle';
            } else if (playerData.moving) {
                newActionName = playerData.sprinting ? 'run' : (playerData.running ? 'run' : 'walk');
            }

            const currentActionName = playerModel.userData.currentAction || 'idle';
            if (currentActionName !== newActionName) {
                const from = actions[currentActionName];
                const to = actions[newActionName];
                if (from && to) {
                    from.fadeOut(fadeDuration);
                    to.reset().fadeIn(fadeDuration).play();
                }
                playerModel.userData.currentAction = newActionName;
            }
        }
    }

    displayChatMessage(clientId, message) {
        const bubble = this.chatMessages[clientId];
        bubble.textContent = message;
        bubble.style.display = 'block';
        bubble.style.opacity = '1';
        bubble.classList.remove('fade-out');

        if (this.chatLogMessageHandler) {
            const peerInfo = this.room.peers[clientId] || {};
            const name = peerInfo.username || `Player${clientId.substring(0, 4)}`;
            this.chatLogMessageHandler({ clientId, username: name, message });
        }
        
        setTimeout(() => {
            if (bubble) {
                const endHandler = () => {
                    bubble.style.display = 'none';
                    bubble.removeEventListener('transitionend', endHandler);
                };
                bubble.addEventListener('transitionend', endHandler, { once: true });
                bubble.classList.add('fade-out');
            }
        }, 5000);
    }

    removePlayer(clientId) {
        this.scene.remove(this.otherPlayers[clientId]);
        delete this.otherPlayers[clientId];
        
        document.getElementById('game-container').removeChild(this.playerLabels[clientId]);
        delete this.playerLabels[clientId];

        document.getElementById('game-container').removeChild(this.chatMessages[clientId]);
        delete this.chatMessages[clientId];
    }
    
    collectRemote(remoteId, remoteObject) {
        this.collectedRemotes[remoteId] = true;
        remoteObject.visible = false;
        document.getElementById('useless-button').style.display = 'block';
        
        const updatedRemotes = { ...(this.room.roomState.collectedRemotes || {}) };
        updatedRemotes[remoteId] = true;
        this.room.updateRoomState({ collectedRemotes: updatedRemotes });
        console.log("Remote collected! Useless button unlocked!");
    }

    updatePlayerLabels() {
        const playerModel = this.playerControls.getPlayerModel();
        const time = performance.now() * 0.001;

        for (const clientId in this.otherPlayers) {
            const model = this.otherPlayers[clientId];
            const label = this.playerLabels[clientId];
            const chatBubble = this.chatMessages[clientId];
            if (model && model.userData.updateAnimations) {
                model.userData.updateAnimations(time);
            }
            if (label && model) {
                this.updateLabelPosition(model, label, chatBubble);
            }
        }

        const localChatBubble = this.chatMessages[this.room.clientId];
        if (localChatBubble && playerModel) {
            this.updateLabelPosition(playerModel, null, localChatBubble);
        }
    }
    
    updateLabelPosition(model, label, chatBubble) {
        const screenPos = this._getScreenPosition(model.position);
        if (screenPos) {
            if (label) {
                label.style.left = `${screenPos.x}px`;
                label.style.top = `${screenPos.y - 20}px`;
                label.style.display = screenPos.visible ? 'block' : 'none';
            }
            if (chatBubble) {
                chatBubble.style.left = `${screenPos.x}px`;
                chatBubble.style.top = `${screenPos.y - 45}px`;
                if (chatBubble.textContent && screenPos.visible) {
                    chatBubble.style.display = 'block';
                }
            }
        } else {
            if (label) label.style.display = 'none';
            if (chatBubble) chatBubble.style.display = 'none';
        }
    }

    _createPlayerLabelElement(clientId, username) {
        const label = document.createElement('div');
        label.className = 'player-name';
        label.textContent = username;
        document.getElementById('game-container').appendChild(label);
        return label;
    }

    _createChatMessageElement(clientId) {
        const message = document.createElement('div');
        message.className = 'chat-message';
        message.style.display = 'none';
        document.getElementById('game-container').appendChild(message);
        return message;
    }

    _getScreenPosition(position) {
        const vector = new THREE.Vector3();
        vector.copy(position);
        vector.y += 1.5;
        vector.project(this.camera);

        const widthHalf = this.renderer.domElement.width / 2;
        const heightHalf = this.renderer.domElement.height / 2;

        return {
            x: (vector.x * widthHalf) + widthHalf,
            y: -(vector.y * heightHalf) + heightHalf,
            visible: vector.z < 1
        };
    }
}