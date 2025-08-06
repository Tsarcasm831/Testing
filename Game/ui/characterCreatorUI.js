export class CharacterCreatorUI {
    constructor(dependencies) {
        this.characterCreator = dependencies.characterCreator;
    }

    create() {
        const uiContainer = document.getElementById('ui-container');

        const characterButton = document.createElement('div');
        characterButton.id = 'character-creator-button';
        characterButton.classList.add('circle-button');
        characterButton.setAttribute('data-tooltip', 'Character Creator');
        /* @tweakable The URL for the character creator icon. */
        const characterCreatorIconUrl = "https://file.garden/Zy7B0LkdIVpGyzA1/Public/Images/Icons/character_creator_icon.png";
        /* @tweakable The size of the character creator icon. */
        const characterCreatorIconSize = "28px";
        characterButton.innerHTML = `<img src="${characterCreatorIconUrl}" alt="Character Creator" style="width: ${characterCreatorIconSize}; height: ${characterCreatorIconSize};">`;
        uiContainer.appendChild(characterButton);

        const characterModal = document.createElement('div');
        characterModal.id = 'character-creator-modal';
        characterModal.innerHTML = `
            <div id="character-creator-header">
                <h2>Character Creator</h2>
                <div id="close-character-creator" data-tooltip="Close">✕</div>
            </div>

            <div id="character-creator-tabs">
                <button class="creator-tab active" data-tab="create">Create</button>
                <button class="creator-tab" data-tab="presets">Presets</button>
                <button class="creator-tab" data-tab="community">Community</button>
            </div>

            <div id="character-creator-content">
                <!-- Create Tab -->
                <div id="tab-content-create" class="creator-tab-content active">
                    <div class="creator-body">
                        <div class="creator-inputs">
                            <label for="character-description">Describe your character:</label>
                            <textarea id="character-description" placeholder="e.g., 'a crystal golem with glowing blue eyes'"></textarea>
                            
                            <div id="reference-image-container">
                              <label for="reference-image" class="reference-upload-label">Or upload a reference image (optional):</label>
                              <input type="file" id="reference-image" accept="image/*">
                              <div id="reference-preview"></div>
                            </div>
                            
                            <button id="generate-character-button" data-tooltip="Generate character with AI">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5a.5.5 0 01.5.5v1.51a6.512 6.512 0 010 12.98V19.5a.5.5 0 01-1 0v-1.51a6.512 6.512 0 010-12.98V3a.5.5 0 01.5-.5zM3 12a.5.5 0 01.5-.5h1.51a6.512 6.512 0 010 1H3.5a.5.5 0 01-.5-.5zm16 0a.5.5 0 01.5-.5h1.51a6.512 6.512 0 010 1H19.5a.5.5 0 01-.5-.5z"/></svg>
                                Generate
                            </button>
                            <div id="character-status"></div>
                        </div>
                        <div class="creator-preview">
                            <div id="character-preview-container">
                                <div id="character-preview"></div>
                            </div>
                            <div class="creator-actions">
                                <button id="apply-character-button" data-tooltip="Apply and save this character">Apply & Save</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Presets Tab -->
                <div id="tab-content-presets" class="creator-tab-content">
                    <h3>Select a Preset</h3>
                    <div class="character-gallery" id="preset-gallery"></div>
                </div>

                <!-- Community Tab -->
                <div id="tab-content-community" class="creator-tab-content">
                    <h3>Community Creations</h3>
                    <div class="character-gallery" id="community-gallery"></div>
                </div>
            </div>
        `;
        uiContainer.appendChild(characterModal);

        characterButton.addEventListener('click', () => this.characterCreator.open());
        document.getElementById('generate-character-button').addEventListener('click', () => this.characterCreator.generateCharacter());
        document.getElementById('apply-character-button').addEventListener('click', () => this.characterCreator.applyAndSaveCharacter());
        document.getElementById('close-character-creator').addEventListener('click', () => this.characterCreator.close());
        document.getElementById('reference-image').addEventListener('change', (e) => this.characterCreator.handleReferenceImageUpload(e));
        
        // Tab switching logic
        const tabs = characterModal.querySelectorAll('.creator-tab');
        const contents = characterModal.querySelectorAll('.creator-tab-content');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
                
                tab.classList.add('active');
                characterModal.querySelector(`#tab-content-${tab.dataset.tab}`).classList.add('active');
            });
        });
    }
}