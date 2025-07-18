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
const INTERACTION_CHECK_DELAY = 250; // ms

export class InteractionManager {
    constructor(dependencies) {
        this.playerControls = dependencies.playerControls;
        this.npcManager = dependencies.npcManager;
        this.camera = dependencies.camera;
        this.renderer = dependencies.renderer;
        
        this.isDesktop = !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.interactionPrompt = null;
        this.conversationModal = null;
        this.targetNpc = null;
        this.lastCheckTime = 0;
    }

    init() {
        if (!this.isDesktop) return;

        // Create interaction prompt UI
        const promptEl = document.createElement('div');
        promptEl.id = 'interaction-prompt';
        promptEl.style.display = 'none';
        promptEl.innerHTML = `
            <div class="interaction-npc-name"></div>
            <div class="interaction-instruction"></div>
        `;
        document.getElementById('game-container').appendChild(promptEl);
        this.interactionPrompt = promptEl;

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
        if (!this.isDesktop || this.conversationModal.style.display === 'flex' || (now - this.lastCheckTime < INTERACTION_CHECK_DELAY)) {
            if (this.conversationModal.style.display === 'flex' && this.interactionPrompt.style.display !== 'none') {
                this.interactionPrompt.style.display = 'none';
                this.targetNpc = null;
            }
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
            this.updatePromptPosition();
            const nameEl = this.interactionPrompt.querySelector('.interaction-npc-name');
            const instructionEl = this.interactionPrompt.querySelector('.interaction-instruction');
            
            nameEl.innerText = this.targetNpc.model.name || 'NPC';
            instructionEl.innerText = 'Press F to talk';
            
            nameEl.style.fontSize = NPC_NAME_FONT_SIZE;
            instructionEl.style.fontSize = INSTRUCTION_FONT_SIZE;

        } else if (this.interactionPrompt.style.display !== 'none') {
            this.interactionPrompt.style.display = 'none';
        }
    }

    updatePromptPosition() {
        if (!this.targetNpc) return;

        const pos = this.targetNpc.model.position.clone();
        pos.y += PROMPT_VERTICAL_OFFSET;

        const screenPos = this._getScreenPosition(pos);
        if (screenPos && screenPos.visible) {
            this.interactionPrompt.style.left = `${screenPos.x}px`;
            this.interactionPrompt.style.top = `${screenPos.y}px`;
            this.interactionPrompt.style.transform = 'translate(-50%, -50%)';
            this.interactionPrompt.style.display = 'block';
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

    async startConversation() {
        if (!this.targetNpc) return;

        this.npcManager.setInteracting(this.targetNpc, true);

        this.openModal("Thinking...", this.targetNpc);
        
        try {
            const dialogue = await this.generateDialogue(this.targetNpc);
            const dialogueTextEl = this.conversationModal.querySelector('#npc-dialogue');
            dialogueTextEl.innerText = dialogue;
        } catch(e) {
            console.error("Failed to generate NPC dialogue:", e);
            const dialogueTextEl = this.conversationModal.querySelector('#npc-dialogue');
            dialogueTextEl.innerText = "I... don't have much to say right now.";
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
        this.interactionPrompt.style.display = 'none';
    }

    closeModal() {
        this.conversationModal.style.display = 'none';
        this.playerControls.enabled = true;
        if (this.targetNpc) {
            this.npcManager.setInteracting(this.targetNpc, false);
        }
    }
}