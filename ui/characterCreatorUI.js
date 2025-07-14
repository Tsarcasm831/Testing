export class CharacterCreatorUI {
    constructor(dependencies) {
        this.characterCreator = dependencies.characterCreator;
    }

    create() {
        const gameContainer = document.getElementById('game-container');

        const characterButton = document.createElement('div');
        characterButton.id = 'character-creator-button';
        characterButton.classList.add('circle-button');
        characterButton.setAttribute('data-tooltip', 'Character Creator');
        characterButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5a5.5 5.5 0 015.5 5.5c0 1.536-.624 2.926-1.64 3.96a7.51 7.51 0 013.64 6.04H4.5a7.51 7.51 0 013.64-6.04A5.488 5.488 0 016.5 8a5.5 5.5 0 015.5-5.5z"/></svg>`;
        gameContainer.appendChild(characterButton);

        const characterModal = document.createElement('div');
        characterModal.id = 'character-creator-modal';
        characterModal.innerHTML = `
            <h2>Create Character</h2>
            <div class="creator-body">
              <div class="creator-inputs">
                <label for="character-description">Description</label>
                <textarea id="character-description" placeholder="e.g. 'a red robot with glowing eyes'"></textarea>
                <div id="reference-image-container">
                  <label for="reference-image" class="reference-upload-label">Reference Image (optional)</label>
                  <input type="file" id="reference-image" accept="image/*">
                  <div id="reference-preview"></div>
                </div>
                <button id="generate-character-button" data-tooltip="Generate character with AI">Generate</button>
                <div id="character-status"></div>
              </div>
              <div class="creator-preview">
                <div id="character-preview"></div>
                <div class="creator-actions">
                  <button id="apply-character-button" data-tooltip="Apply and save this character">Apply & Save</button>
                  <button id="cancel-character-button" data-tooltip="Close character creator">Close</button>
                </div>
              </div>
            </div>
            <h3>Preset Characters</h3>
            <div class="character-gallery" id="preset-gallery"></div>
            <h3>Community Characters</h3>
            <div class="character-gallery" id="character-gallery"></div>
        `;
        gameContainer.appendChild(characterModal);

        characterButton.addEventListener('click', () => this.characterCreator.open());
        document.getElementById('generate-character-button').addEventListener('click', () => this.characterCreator.generateCharacter());
        document.getElementById('apply-character-button').addEventListener('click', () => this.characterCreator.applyAndSaveCharacter());
        document.getElementById('cancel-character-button').addEventListener('click', () => this.characterCreator.close());
        document.getElementById('reference-image').addEventListener('change', (e) => this.characterCreator.handleReferenceImageUpload(e));
    }
}