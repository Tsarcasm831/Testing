import { createPlayerModel } from "./playerModel.js";
import { presetCharacters } from "./characters/presets.js";

export class CharacterCreator {
    constructor(THREE, room, playerControls, onApplyCharacter) {
        this.THREE = THREE;
        this.room = room;
        this.playerControls = playerControls;
        this.onApplyCharacter = onApplyCharacter;

        this.characterCollection = this.room.collection('characters');
        this.modal = null;
        this.previewContainer = null;
        this.statusEl = null;
        this.descriptionInput = null;

        this.previewScene = null;
        this.previewCamera = null;
        this.previewRenderer = null;
        this.previewModel = null;
        this.previewAnimationId = null;

        this.currentCharacterDescription = "";
        window.tempCharacterSpec = null;
        window.referenceImageUrl = null;
    }

    updateStatus(message, progress) {
        if (!this.statusEl) return;
        
        /* @tweakable The height of the progress bar in pixels. */
        const progressBarHeight = "8px";
        /* @tweakable The background color of the progress bar track. */
        const progressBarTrackColor = "rgba(255, 255, 255, 0.2)";
        /* @tweakable The color of the progress bar fill. */
        const progressBarFillColor = "#2196F3";

        const progressHtml = `
            <div style="margin-bottom: 8px;">${message}</div>
            <div class="character-progress" style="height: ${progressBarHeight}; background-color: ${progressBarTrackColor};">
                <div class="character-progress-bar" style="width: ${progress}%; background-color: ${progressBarFillColor};"></div>
            </div>
        `;
        this.statusEl.innerHTML = progressHtml;
    }

    open() {
        this.modal = document.getElementById('character-creator-modal');
        this.previewContainer = document.getElementById('character-preview');
        this.statusEl = document.getElementById('character-status');
        this.descriptionInput = document.getElementById('character-description');

        if (!this.modal) {
            console.error("Character creator modal not found in DOM!");
            return;
        }

        this.modal.style.display = 'flex';
        this.descriptionInput.value = this.currentCharacterDescription;

        document.getElementById('reference-preview').innerHTML = '';
        document.getElementById('reference-image').value = '';
        window.referenceImageUrl = null;

        if (this.playerControls) {
            this.playerControls.enabled = false;
        }

        this.setupPreviewRenderer();
        this.populatePresetCharacters();
        this.loadCommunityCharacters();
    }

    close() {
        if (!this.modal) return;
        this.modal.style.display = 'none';
        this.stopPreviewAnimation();
        if (this.playerControls) {
            this.playerControls.enabled = true;
        }
    }

    setupPreviewRenderer() {
        this.previewContainer.innerHTML = '';
        this.previewScene = new this.THREE.Scene();
        this.previewScene.background = new this.THREE.Color(0x333333);

        this.previewCamera = new this.THREE.PerspectiveCamera(50, 2, 0.1, 1000);
        this.previewCamera.position.set(0, 1, 3);
        this.previewCamera.lookAt(0, 0.5, 0);

        this.previewRenderer = new this.THREE.WebGLRenderer({ antialias: true });
        this.previewRenderer.setSize(this.previewContainer.clientWidth, 150);
        this.previewRenderer.shadowMap.enabled = true;
        this.previewContainer.appendChild(this.previewRenderer.domElement);

        const ambLight = new this.THREE.AmbientLight(0xffffff, 0.5);
        this.previewScene.add(ambLight);
        const dirLight = new this.THREE.DirectionalLight(0xffffff, 1);
        dirLight.position.set(5, 5, 5);
        this.previewScene.add(dirLight);
        
        const grid = new this.THREE.GridHelper(4, 4);
        this.previewScene.add(grid);
    }

    animatePreview() {
        if (!this.previewScene || !this.previewCamera || !this.previewRenderer) return;

        const time = performance.now() * 0.001;
        this.previewAnimationId = requestAnimationFrame(this.animatePreview.bind(this));

        if (this.previewModel) {
            this.previewModel.rotation.y += 0.01;
            if (this.previewModel.userData.updateAnimations) {
                this.previewModel.userData.updateAnimations(time);
            }
        }
        this.previewRenderer.render(this.previewScene, this.previewCamera);
    }

    stopPreviewAnimation() {
        if (this.previewAnimationId !== null) {
            cancelAnimationFrame(this.previewAnimationId);
            this.previewAnimationId = null;
        }
    }

    updatePreviewModel(characterSpec) {
        if (this.previewModel) {
            this.previewScene.remove(this.previewModel);
        }
        this.previewModel = createPlayerModel(this.THREE, "preview", characterSpec);
        this.previewModel.position.set(0, 0, 0);
        this.previewScene.add(this.previewModel);

        if (this.previewAnimationId === null) {
            this.animatePreview();
        }
    }
    
    async handleReferenceImageUpload(event) {
        const file = event.target.files[0];
        if (!file || !file.type.startsWith('image/')) return;

        const previewDiv = document.getElementById('reference-preview');
        previewDiv.innerHTML = '<p>Uploading image...</p>';

        try {
            const imageUrl = await websim.upload(file);
            previewDiv.innerHTML = `
                <img src="${imageUrl}" alt="Reference" id="reference-image-preview">
                <button id="remove-reference-image">Remove</button>
            `;
            window.referenceImageUrl = imageUrl;

            document.getElementById('remove-reference-image').addEventListener('click', () => {
                previewDiv.innerHTML = ''; window.referenceImageUrl = null; document.getElementById('reference-image').value = '';
            });

        } catch (error) {
            console.error('Error uploading image:', error);
            previewDiv.innerHTML = '<p>Error uploading image. Please try again.</p>';
        }
    }

    async generateCharacter() {
        const description = this.descriptionInput.value.trim();
        if (description.length < 3) {
            this.statusEl.textContent = 'Please enter a longer description';
            return;
        }

        this.statusEl.innerHTML = '';
        document.getElementById('generate-character-button').disabled = true;
        document.getElementById('apply-character-button').style.display = 'none';
        window.tempCharacterSpec = null;

        try {
            /* @tweakable The system prompt for the AI character generator. Defines the expected JSON structure and detail level. */
            const systemPrompt = `Based on the user's character description, generate a detailed and structured 3D character model description. If the description indicates a humanoid character, break it down into the following individual body parts: head, nose, eyes, hair, ears, mouth, neck, torso, shoulders, upper arm right, lower arm right, upper arm left, lower arm left, hand left, hand right, waist, upper leg left, lower leg left, ankle left, foot left, upper leg right, lower leg right, ankle right, and foot right.

For each body part, provide a concise but descriptive summary focusing on shape, texture, and color. Ensure that the descriptions are consistent with each other and form a coherent whole, with all parts assembled correctly in their appropriate anatomical locations. If the user's description is vague or lacks specifics for certain parts, use realistic and appropriate defaults to fill in the details.

Additionally, ensure that at least one component, such as the feet, extends to Y=0 or below to serve as a ground anchor for the 3D model.

Be creative in interpreting the user's description, but stay true to the details provided. The output should be a JSON object with each body part as a key and its detailed description as the value.`;
            
            /* @tweakable Text for the first step of character generation. */
            const step1Text = "Generating detailed description... (Step 1/2)";
            this.updateStatus(step1Text, 10);
            
            const messages = [{
                role: "system",
                content: systemPrompt
            }];

            const userMessage = { role: "user", content: [] };
            userMessage.content.push({ type: "text", text: description });
            if (window.referenceImageUrl) {
                userMessage.content.push({ type: "image_url", image_url: { url: window.referenceImageUrl } });
            }
            messages.push(userMessage);

            const completion = await websim.chat.completions.create({ messages, json: true });
            
            // The new prompt doesn't return a spec that can be rendered with primitives.
            // We need to call another AI to convert the descriptive JSON to a renderable spec.
            const descriptiveSpec = JSON.parse(completion.content);

            /* @tweakable Text for the second step of character generation. */
            const step2Text = "Converting description to 3D model... (Step 2/2)";
            this.updateStatus(step2Text, 50);

            const conversionMessages = [{
                role: "system",
                content: `You are an AI assistant that converts detailed, descriptive JSON about a character into a renderable JSON format using 3D primitives. The user will provide a JSON object with body parts as keys and long text descriptions as values. Your task is to translate this into a "features" array.
                Each object in the "features" array must have:
                - "type": "box|sphere|cylinder|cone|torus"
                - "color": "hexcolor"
                - "position": {"x": number, "y": number, "z": number}
                - "scale": {"x": number, "y": number, "z": number}
                - "rotation": {"x": number, "y": number, "z": number} (in radians)
                - "name": (optional) "leftLeg" or "rightLeg" for animation.
                
                IMPORTANT CONSTRAINTS:
                - The entire character must fit within a 3x3x3 unit space.
                - At least one component must be at or extend below Y=0 to ground the model.
                - Create a coherent, visually appealing character based on the descriptions.
                - Use multiple primitives to represent complex parts.
                - Respond ONLY with the final JSON object in the format:
                {
                  "customMode": true,
                  "features": [ ... ],
                  "description": "A brief summary of the character."
                }`
            }, {
                role: "user",
                content: JSON.stringify(descriptiveSpec)
            }];

            const conversionCompletion = await websim.chat.completions.create({ messages: conversionMessages, json: true });
            const characterSpec = JSON.parse(conversionCompletion.content);

            this.currentCharacterDescription = description;
            this.updatePreviewModel(characterSpec);
            /* @tweakable Message displayed when character generation is successful. */
            const successMessage = 'Ready to apply!';
            this.statusEl.innerHTML = `<span style="color: lightgreen;">${successMessage}</span>`;
            document.getElementById('apply-character-button').style.display = 'block';
            window.tempCharacterSpec = characterSpec;
        } catch (error) {
            console.error('Error generating character:', error);
            /* @tweakable Message displayed when character generation fails. */
            const errorMessage = 'Error generating character. Please try again.';
            this.statusEl.innerHTML = `<span style="color: #ff5555;">${errorMessage}</span>`;
        } finally {
            document.getElementById('generate-character-button').disabled = false;
        }
    }

    async applyAndSaveCharacter() {
        if (!window.tempCharacterSpec) {
            this.statusEl.textContent = 'Please generate a character first';
            return;
        }

        try {
            const playerModel = this.onApplyCharacter(window.tempCharacterSpec);
            
            await this.characterCollection.create({
                description: this.currentCharacterDescription,
                spec: window.tempCharacterSpec,
                creator: this.room.peers[this.room.clientId]?.username || 'player',
                referenceImage: window.referenceImageUrl || null
            });

            this.room.updatePresence({
                characterSpec: window.tempCharacterSpec
            });

            this.statusEl.textContent = 'Character applied and saved!';
            await this.loadCommunityCharacters();
            setTimeout(() => this.close(), 1500);
        } catch (error) {
            console.error('Error applying character:', error);
            this.statusEl.textContent = 'Error saving character. Please try again.';
        }
    }

    loadCommunityCharacters() {
        const gallery = document.getElementById('community-gallery');
        gallery.innerHTML = '';
        const characters = this.characterCollection.getList();

        if (characters.length === 0) {
            gallery.innerHTML = '<div style="grid-column: 1/-1; text-align: center;">No characters yet. Be the first!</div>';
            return;
        }
        
        characters.forEach(character => {
            const charEl = document.createElement('div');
            charEl.className = 'character-option';
            
            if (character.referenceImage) {
                charEl.innerHTML = `
                    <div class="character-thumbnail"><img src="${character.referenceImage}" alt="Ref"></div>
                    <div class="character-name">${character.description.slice(0, 15) + (character.description.length > 15 ? '...' : '')}</div>
                `;
            } else {
                charEl.textContent = character.description.slice(0, 30) + (character.description.length > 30 ? '...' : '');
            }
            charEl.title = `${character.description} (by ${character.username})`;

            charEl.addEventListener('click', () => {
                document.querySelectorAll('.character-option').forEach(el => el.classList.remove('selected'));
                charEl.classList.add('selected');
                this.descriptionInput.value = character.description;
                this.updatePreviewModel(character.spec);
                window.tempCharacterSpec = character.spec;
                
                const previewDiv = document.getElementById('reference-preview');
                if (character.referenceImage) {
                    previewDiv.innerHTML = `<img src="${character.referenceImage}" id="reference-image-preview"><button id="remove-reference-image">Remove</button>`;
                    window.referenceImageUrl = character.referenceImage;
                    document.getElementById('remove-reference-image').addEventListener('click', () => {
                        previewDiv.innerHTML = ''; window.referenceImageUrl = null; document.getElementById('reference-image').value = '';
                    });
                } else {
                    previewDiv.innerHTML = ''; window.referenceImageUrl = null;
                }
                document.getElementById('apply-character-button').style.display = 'block';
            });
            gallery.appendChild(charEl);
        });
    }

    populatePresetCharacters() {
        const gallery = document.getElementById('preset-gallery');
        gallery.innerHTML = '';
        presetCharacters.forEach(preset => {
            const presetEl = document.createElement('div');
            presetEl.className = 'character-option';
            presetEl.textContent = preset.name;
            presetEl.title = preset.description;
            presetEl.addEventListener('click', () => {
                document.querySelectorAll('.character-option').forEach(el => el.classList.remove('selected'));
                presetEl.classList.add('selected');
                this.descriptionInput.value = preset.description;
                this.updatePreviewModel(preset.spec);
                window.tempCharacterSpec = preset.spec;
                document.getElementById('apply-character-button').style.display = 'block';
                this.statusEl.textContent = 'Preset character selected!';
            });
            gallery.appendChild(presetEl);
        });
    }
}