import * as THREE from 'three';

/* @tweakable The distance in world units within which player can interact with an NPC. */
const INTERACTION_RADIUS = 3;
/* @tweakable The vertical offset for the interaction prompt above the NPC's head. */
const PROMPT_VERTICAL_OFFSET = 2.5;
/* @tweakable Font size for the NPC's name in the interaction prompt. */
const NPC_NAME_FONT_SIZE = '16px';
/* @tweakable Font size for the instruction text in the interaction prompt. */
const INSTRUCTION_FONT_SIZE = '14px';
/* @tweakable The delay in milliseconds between checks for interactable NPCs. Higher values improve performance but reduce responsiveness. */
const INTERACTION_CHECK_DELAY = 251; // ms

export class InteractionManager {
    constructor(dependencies) {
        this.playerControls = dependencies.playerControls;
        this.npcManager = dependencies.npcManager;
        this.camera = dependencies.camera;
        this.renderer = dependencies.renderer;
        this.presetCharacters = dependencies.presetCharacters;
        
        this.isDesktop = !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.interactionPrompt = null;
        this.mobileInteractionButton = null;
        this.conversationModal = null;
        this.targetNpc = null;
        this.lastCheckTime = 0;
    }

    init() {
        // Create interaction prompt UI for desktop
        if (this.isDesktop) {
            const promptEl = document.createElement('div');
            promptEl.id = 'interaction-prompt';
            promptEl.style.display = 'none';
            promptEl.innerHTML = `
                <div class="interaction-npc-name"></div>
                <div class="interaction-instruction"></div>
            `;
            document.getElementById('game-container').appendChild(promptEl);
            this.interactionPrompt = promptEl;
        }

        // Create mobile interaction button
        if (this.isMobile) {
            const mobileButton = document.createElement('div');
            mobileButton.id = 'mobile-interaction-button';
            mobileButton.textContent = 'Talk';
            mobileButton.style.display = 'none';
            document.getElementById('ui-container').appendChild(mobileButton);
            this.mobileInteractionButton = mobileButton;
            this.mobileInteractionButton.addEventListener('click', this.handleMobileInteraction.bind(this));
        }

        // Create conversation modal UI
        const modalEl = document.createElement('div');
        modalEl.id = 'npc-conversation-modal';
        modalEl.style.display = 'none';
        modalEl.innerHTML = `
            <div id="npc-conversation-content">
                <h3 id="npc-name"></h3>
                <p id="npc-dialogue"></p>
                <button id="close-conversation">Close</button>
            </div>
        `;
        document.getElementById('game-container').appendChild(modalEl);
        this.conversationModal = modalEl;

        // Add event listeners
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        modalEl.querySelector('#close-conversation').addEventListener('click', this.closeModal.bind(this));
    }

    update() {
        const now = performance.now();
        if (this.conversationModal && this.conversationModal.style.display === 'flex') {
             if (this.interactionPrompt && this.interactionPrompt.style.display !== 'none') {
                this.interactionPrompt.style.display = 'none';
            }
            if (this.mobileInteractionButton && this.mobileInteractionButton.style.display !== 'none') {
                this.mobileInteractionButton.style.display = 'none';
            }
            this.targetNpc = null;
            return;
        }
        
        if (now - this.lastCheckTime < INTERACTION_CHECK_DELAY) {
            return;
        }

        this.lastCheckTime = now;

        const playerPos = this.playerControls.getPlayerModel().position;
        let closestNpc = null;
        let minDistance = INTERACTION_RADIUS;

        this.npcManager.npcs.forEach(npc => {
            const distance = playerPos.distanceTo(npc.model.position);
            if (distance < minDistance) {
                minDistance = distance;
                closestNpc = npc;
            }
        });

        this.targetNpc = closestNpc;

        if (this.targetNpc) {
            if (this.isDesktop) {
                this.updatePromptPosition();
            } else if (this.mobileInteractionButton) {
                this.mobileInteractionButton.style.display = 'flex';
            }
        } else {
            if (this.isDesktop && this.interactionPrompt && this.interactionPrompt.style.display !== 'none') {
                this.interactionPrompt.style.display = 'none';
            }
            if (this.isMobile && this.mobileInteractionButton && this.mobileInteractionButton.style.display !== 'none') {
                this.mobileInteractionButton.style.display = 'none';
            }
        }
    }

    updatePromptPosition() {
        if (!this.targetNpc || !this.interactionPrompt) return;

        const pos = this.targetNpc.model.position.clone();
        pos.y += PROMPT_VERTICAL_OFFSET;

        const screenPos = this._getScreenPosition(pos);
        if (screenPos && screenPos.visible) {
            this.interactionPrompt.style.left = `${screenPos.x}px`;
            this.interactionPrompt.style.top = `${screenPos.y}px`;
            this.interactionPrompt.style.transform = 'translate(-50%, -50%)';
            this.interactionPrompt.style.display = 'block';

            const nameEl = this.interactionPrompt.querySelector('.interaction-npc-name');
            const instructionEl = this.interactionPrompt.querySelector('.interaction-instruction');
            
            nameEl.innerText = this.targetNpc.model.name || 'NPC';
            instructionEl.innerText = 'Press F to talk';
            
            nameEl.style.fontSize = NPC_NAME_FONT_SIZE;
            instructionEl.style.fontSize = INSTRUCTION_FONT_SIZE;

        } else {
            this.interactionPrompt.style.display = 'none';
        }
    }
    
    _getScreenPosition(position) {
        const vector = new THREE.Vector3();
        vector.copy(position);
        vector.project(this.camera);

        const widthHalf = this.renderer.domElement.width / 2;
        const heightHalf = this.renderer.domElement.height / 2;

        return {
            x: (vector.x * widthHalf) + widthHalf,
            y: -(vector.y * heightHalf) + heightHalf,
            visible: vector.z < 1
        };
    }

    handleKeyDown(event) {
        if (event.key.toLowerCase() === 'f' && this.targetNpc && this.conversationModal.style.display === 'none') {
            this.startConversation();
        }
    }

    handleMobileInteraction() {
        if (this.targetNpc && this.conversationModal.style.display === 'none') {
            this.startConversation();
        }
    }

    async startConversation() {
        if (!this.targetNpc) return;

        this.npcManager.setInteracting(this.targetNpc, true);

        const preset = this.presetCharacters.find(p => p.id === this.targetNpc.presetId);
        let dialogue;

        if (preset && preset.dialogue && preset.dialogue.length > 0) {
            dialogue = preset.dialogue[this.targetNpc.dialogueIndex];
            this.targetNpc.dialogueIndex = (this.targetNpc.dialogueIndex + 1) % preset.dialogue.length;
            this.openModal(dialogue, this.targetNpc);
        } else if (this.targetNpc.model.userData.characterSpec) {
            // Fallback to AI generation
            this.openModal("Thinking...", this.targetNpc);
            try {
                dialogue = await this.generateDialogue(this.targetNpc);
                const dialogueTextEl = this.conversationModal.querySelector('#npc-dialogue');
                dialogueTextEl.innerText = dialogue; // Update text after generation
            } catch(e) {
                console.error("Failed to generate NPC dialogue:", e);
                const dialogueTextEl = this.conversationModal.querySelector('#npc-dialogue');
                dialogueTextEl.innerText = "I... don't have much to say right now.";
            }
        }
    }

    async generateDialogue(npc) {
        const characterSpec = npc.model.userData.characterSpec;
        const description = characterSpec?.description || "a mysterious figure";

        const messages = [
            {
                role: "system",
                content: `You are an NPC in a 3D world. Your appearance is described as: "${description}". You are a clone of the player's character. Generate a short, in-character, one-paragraph dialogue for when a player interacts with you for the first time. Be welcoming, maybe a little curious. Do not break character. Respond with only the dialogue text.`
            },
            {
                role: "user",
                content: "Hello there!"
            }
        ];
        
        const completion = await websim.chat.completions.create({ messages });
        return completion.content;
    }

    openModal(text, npc) {
        this.conversationModal.querySelector('#npc-name').innerText = npc.model.name || 'NPC';
        this.conversationModal.querySelector('#npc-dialogue').innerText = text;
        this.conversationModal.style.display = 'flex';
        this.playerControls.enabled = false;
        if (this.interactionPrompt) this.interactionPrompt.style.display = 'none';
        if (this.mobileInteractionButton) this.mobileInteractionButton.style.display = 'none';
    }

    closeModal() {
        this.conversationModal.style.display = 'none';
        this.playerControls.enabled = true;
        if (this.targetNpc) {
            this.npcManager.setInteracting(this.targetNpc, false);
        }
    }
}