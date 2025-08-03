/* @tweakable The title for the admin teleport section */
const teleportTitle = "Teleport";
/* @tweakable The label for the X coordinate input */
const xLabel = "X Coordinate:";
/* @tweakable The label for the Y coordinate input */
const yLabel = "Y Coordinate:";
/* @tweakable The label for the Z coordinate input */
const zLabel = "Z Coordinate:";
/* @tweakable The text for the teleport button */
const teleportButtonText = "Teleport";
/* @tweakable The tooltip for the teleport button */
const teleportButtonTooltip = "Teleport to specified coordinates";

export async function addAdminTab(dependencies, modal, optionsUI) {
    const currentUser = await window.websim.getCurrentUser();
    /* @tweakable The username that has access to the admin panel. */
    const adminUsername = 'lordtsarcasm';

    if (currentUser && currentUser.username === adminUsername) {
        modal.classList.add('admin-view');
        const tabsContainer = modal.querySelector('#options-tabs');
        const contentContainer = modal.querySelector('#options-content');

        const adminTab = document.createElement('button');
        adminTab.className = 'options-tab admin-tab';
        adminTab.dataset.tab = 'admin';
        adminTab.textContent = 'Admin';
        tabsContainer.appendChild(adminTab);

        const adminContent = document.createElement('div');
        adminContent.id = 'options-tab-admin';
        adminContent.className = 'options-tab-content';
        
        /* @tweakable Title for the admin notes section */
        const notesTitle = 'Persistent Notes';
        /* @tweakable Placeholder text for the admin notes textarea */
        const notesPlaceholder = 'Write notes here...';
        /* @tweakable Text for the save button in the admin notes section */
        const saveButtonText = 'Save Notes';

        adminContent.innerHTML = `
            <h3>Admin Controls</h3>
            <div id="admin-sections-grid">
                <div class="options-section">
                    <h4>Billboard Song</h4>
                    <div class="option-item-vertical">
                        <label for="billboard-song-select">Choose Song:</label>
                        <select id="billboard-song-select">
                            <option value="">Select...</option>
                            <option value="whoareyou">Who Are You</option>
                            <option value="none">Video Only</option>
                        </select>
                    </div>
                    <button id="set-billboard-song" class="option-button" data-tooltip="Play selected song for everyone">Set Song</button>
                </div>
                <div class="options-section">
                    <h4>Developer Mode</h4>
                    <div class="option-item">
                        <label for="dev-mode-checkbox">Lock Time to Noon</label>
                        <input type="checkbox" id="dev-mode-checkbox">
                    </div>
                </div>
                <div class="options-section">
                    <h4>${teleportTitle}</h4>
                    <div class="option-item-vertical">
                        <label for="teleport-x">${xLabel}</label>
                        <input type="number" id="teleport-x" placeholder="Enter X coordinate...">
                    </div>
                    <div class="option-item-vertical">
                        <label for="teleport-y">${yLabel}</label>
                        <input type="number" id="teleport-y" placeholder="Enter Y coordinate...">
                    </div>
                    <div class="option-item-vertical">
                        <label for="teleport-z">${zLabel}</label>
                        <input type="number" id="teleport-z" placeholder="Enter Z coordinate...">
                    </div>
                    <button id="teleport-button" class="option-button" data-tooltip="${teleportButtonTooltip}">${teleportButtonText}</button>
                </div>
                <div class="options-section">
                    <h4>${notesTitle}</h4>
                    <textarea id="admin-notes-textarea" style="width: 100%; height: 150px; background-color: #222; color: white; border: 1px solid #555; border-radius: 4px; padding: 5px; margin-top: 5px;" placeholder="${notesPlaceholder}"></textarea>
                    <button id="save-admin-notes" class="option-button" style="margin-top: 10px;">${saveButtonText}</button>
                    <div id="admin-notes-status" style="margin-top: 5px; color: #4CAF50;"></div>
                </div>
                <div class="options-section" style="grid-column: 1 / -1;">
                    <h4>Rigged GLB Characters</h4>
                    <div id="rigged-characters-list"></div>
                </div>
            </div>
        `;
        contentContainer.appendChild(adminContent);

        /* @tweakable Title for the lyrics editor section in the admin panel. */
        const lyricsEditorTitle = 'Amphitheater Lyrics Editor';
        /* @tweakable Instructions for the lyrics editor. */
        const lyricsEditorInstructions = 'Edit the lyrics JSON below. The format is an array of objects, each with a "time" (in seconds) and "text" property.';
        /* @tweakable Text for the save button in the lyrics editor. */
        const lyricsSaveButtonText = 'Save Lyrics';
        
        const lyricsTab = document.createElement('button');
        lyricsTab.className = 'options-tab admin-tab';
        lyricsTab.dataset.tab = 'lyrics';
        lyricsTab.textContent = 'Lyrics';
        tabsContainer.appendChild(lyricsTab);

        const lyricsContent = document.createElement('div');
        lyricsContent.id = 'options-tab-lyrics';
        lyricsContent.className = 'options-tab-content';
        lyricsContent.innerHTML = `
            <h3>${lyricsEditorTitle}</h3>
            <div class="options-section">
                <p style="font-size: 14px; color: var(--white-70); margin-top: -10px; margin-bottom: 10px;">${lyricsEditorInstructions}</p>
                <textarea id="lyrics-textarea" style="width: 100%; height: 250px; background-color: #222; color: white; border: 1px solid #555; border-radius: 4px; padding: 5px; font-family: monospace; font-size: 12px;"></textarea>
                <button id="save-lyrics-button" class="option-button" style="margin-top: 10px;">${lyricsSaveButtonText}</button>
                <div id="lyrics-status" style="margin-top: 5px; color: #4CAF50;"></div>
            </div>
        `;
        contentContainer.appendChild(lyricsContent);

        adminContent.querySelector('#set-billboard-song').addEventListener('click', async () => {
            const choice = adminContent.querySelector('#billboard-song-select').value;
            if (!dependencies.room) return;
            if (choice === 'whoareyou') {
                const audioUrl = 'https://file.garden/Zy7B0LkdIVpGyzA1/Songs/Who%20Are%20You.mp3';
                const resp = await fetch('lyrics/whoareyou.lyrics');
                const lyricsData = await resp.json();
                const lyricsCollection = dependencies.room.collection('lyrics');
                const current = lyricsCollection.getList()[0];
                if (current) {
                    await lyricsCollection.update(current.id, { content: lyricsData });
                } else {
                    await lyricsCollection.create({ content: lyricsData });
                }
                dependencies.room.updateRoomState({ billboardAudioUrl: audioUrl, billboardSongTitle: 'Who Are You' });
            } else if (choice === 'none') {
                dependencies.room.updateRoomState({ billboardAudioUrl: null, billboardSongTitle: null });
            }
        });

        const devModeCheckbox = adminContent.querySelector('#dev-mode-checkbox');
        devModeCheckbox.checked = localStorage.getItem('devMode') === 'true';
        devModeCheckbox.addEventListener('change', (e) => {
            localStorage.setItem('devMode', e.target.checked);
        });

        adminContent.querySelector('#toggle-grid-button')?.addEventListener('click', () => {
            if (dependencies.gridManager && dependencies.playerControls) {
                const playerPosition = dependencies.playerControls.getPlayerModel().position;
                dependencies.gridManager.toggle(playerPosition);
            }
        });

        /* @tweakable The list of rigged characters to display in the admin panel. */
        const riggedCharacters = ['Player', 'Robot', 'Eyebot', 'Chicken', 'Wireframe', 'Alien', 'Shopkeeper', 'Ogre', 'Knight', 'Sprite'];
        const riggedCharactersContainer = adminContent.querySelector('#rigged-characters-list');
        
        riggedCharacters.forEach(charName => {
            const tag = document.createElement('span');
            tag.className = 'char-tag';
            tag.textContent = charName;
            riggedCharactersContainer.appendChild(tag);
        });

        // Notes Feature Logic
        const { room } = dependencies;
        if (room) {
            const notesTextarea = adminContent.querySelector('#admin-notes-textarea');
            const saveNotesButton = adminContent.querySelector('#save-admin-notes');
            const notesStatus = adminContent.querySelector('#admin-notes-status');
            let currentNote = null;

            const adminNotesCollection = room.collection('admin_notes').filter({ username: adminUsername });

            adminNotesCollection.subscribe(notes => {
                // getList() returns newest first, so notes[0] is the latest.
                if (notes && notes.length > 0) {
                    currentNote = notes[0];
                    if (document.activeElement !== notesTextarea) { // Avoid overwriting while typing
                        notesTextarea.value = currentNote.content;
                    }
                } else {
                    currentNote = null;
                }
            });

            saveNotesButton.addEventListener('click', async () => {
                const content = notesTextarea.value;
                
                /* @tweakable The message displayed while saving admin notes. */
                const savingMessage = 'Saving...';
                /* @tweakable The message displayed on successful save of admin notes. */
                const savedMessage = 'Notes saved!';
                /* @tweakable The message displayed on error when saving admin notes. */
                const errorMessage = 'Error saving notes.';
                /* @tweakable The time in milliseconds to display the save status message. */
                const statusMessageDuration = 2000;

                notesStatus.textContent = savingMessage;
                try {
                    if (currentNote) {
                        await room.collection('admin_notes').update(currentNote.id, { content });
                    } else {
                        // The create method will automatically associate the note with the current user.
                        await room.collection('admin_notes').create({ content });
                    }
                    notesStatus.textContent = savedMessage;
                    setTimeout(() => { notesStatus.textContent = ''; }, statusMessageDuration);
                } catch (e) {
                    notesStatus.textContent = errorMessage;
                    console.error("Error saving admin notes:", e);
                }
            });
        }

        // Teleport Logic
        adminContent.querySelector('#teleport-button').addEventListener('click', () => {
            const x = parseFloat(adminContent.querySelector('#teleport-x').value);
            const y = parseFloat(adminContent.querySelector('#teleport-y').value);
            const z = parseFloat(adminContent.querySelector('#teleport-z').value);

            if (isNaN(x) || isNaN(y) || isNaN(z)) {
                alert('Please enter valid coordinates for X, Y, and Z.');
                return;
            }

            const { playerControls } = dependencies;
            if (playerControls) {
                const playerModel = playerControls.getPlayerModel();
                playerModel.position.set(x, y, z);
                playerControls.velocity.set(0, 0, 0);
                if (optionsUI) {
                    optionsUI.toggleModal();
                }
            }
        });

        // Lyrics Feature Logic
        if (room) {
            const lyricsTextarea = lyricsContent.querySelector('#lyrics-textarea');
            const saveLyricsButton = lyricsContent.querySelector('#save-lyrics-button');
            const lyricsStatus = lyricsContent.querySelector('#lyrics-status');
            let currentLyricsRecord = null;
            const lyricsCollection = room.collection('lyrics');

            lyricsCollection.subscribe(lyricsData => {
                if (lyricsData && lyricsData.length > 0) {
                    currentLyricsRecord = lyricsData[0];
                     if (document.activeElement !== lyricsTextarea) {
                        lyricsTextarea.value = JSON.stringify(currentLyricsRecord.content, null, 2);
                    }
                } else {
                    currentLyricsRecord = null;
                }
            });

            saveLyricsButton.addEventListener('click', async () => {
                /* @tweakable Message shown when saving lyrics. */
                const savingLyricsMessage = 'Saving lyrics...';
                /* @tweakable Message shown on successful lyrics save. */
                const savedLyricsMessage = 'Lyrics saved!';
                /* @tweakable Message shown when there is an error saving lyrics due to invalid JSON. */
                const invalidJsonMessage = 'Error: Invalid JSON format.';
                /* @tweakable Generic error message for saving lyrics. */
                const errorLyricsMessage = 'Error saving lyrics.';
                /* @tweakable Duration to show status messages in milliseconds. */
                const lyricsStatusDuration = 2000;

                let lyricsContent;
                try {
                    lyricsContent = JSON.parse(lyricsTextarea.value);
                } catch (e) {
                    lyricsStatus.textContent = invalidJsonMessage;
                    lyricsStatus.style.color = '#f44336';
                    return;
                }

                lyricsStatus.textContent = savingLyricsMessage;
                lyricsStatus.style.color = '#4CAF50';
                try {
                    if (currentLyricsRecord) {
                        await lyricsCollection.update(currentLyricsRecord.id, { content: lyricsContent });
                    } else {
                        await lyricsCollection.create({ content: lyricsContent });
                    }
                    lyricsStatus.textContent = savedLyricsMessage;
                    setTimeout(() => { lyricsStatus.textContent = ''; }, lyricsStatusDuration);
                } catch (e) {
                    lyricsStatus.textContent = errorLyricsMessage;
                    lyricsStatus.style.color = '#f44336';
                    console.error("Error saving lyrics:", e);
                }
            });
        }

        adminTab.addEventListener('click', (e) => {
            document.querySelectorAll('.options-tab').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            document.querySelectorAll('.options-tab-content').forEach(content => {
                content.classList.remove('active');
            });
            adminContent.classList.add('active');
        });

        lyricsTab.addEventListener('click', (e) => {
            document.querySelectorAll('.options-tab').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            document.querySelectorAll('.options-tab-content').forEach(content => {
                content.classList.remove('active');
            });
            lyricsContent.classList.add('active');
        });
    }
}