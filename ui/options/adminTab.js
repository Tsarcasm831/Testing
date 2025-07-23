export async function addAdminTab(dependencies, modal) {
    const currentUser = await window.websim.getCurrentUser();
    /* @tweakable The username that has access to the admin panel. */
    const adminUsername = 'lordtsarcasm';

    if (currentUser && currentUser.username === adminUsername) {
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
            <div class="option-item">
                <label for="youtube-url-input">Video URL:</label>
                <input type="text" id="youtube-url-input" placeholder="Enter video file URL...">
            </div>
            <button id="save-youtube-url" class="option-button" data-tooltip="Update the video screen for everyone">Set Video</button>
            <div class="option-item" style="margin-top: 20px; flex-direction: column; align-items: flex-start;">
                <label>Rigged GLB Characters:</label>
                <ul id="rigged-characters-list" style="padding-left: 20px; margin-top: 5px;"></ul>
            </div>
            <div class="option-item" style="margin-top: 20px; flex-direction: column; align-items: flex-start;">
                <h4>${notesTitle}</h4>
                <textarea id="admin-notes-textarea" style="width: 100%; height: 150px; background-color: #222; color: white; border: 1px solid #555; border-radius: 4px; padding: 5px; margin-top: 5px;" placeholder="${notesPlaceholder}"></textarea>
                <button id="save-admin-notes" class="option-button" style="margin-top: 10px;">${saveButtonText}</button>
                <div id="admin-notes-status" style="margin-top: 5px; color: #4CAF50;"></div>
            </div>
        `;
        contentContainer.appendChild(adminContent);

        adminContent.querySelector('#save-youtube-url').addEventListener('click', () => {
            const url = adminContent.querySelector('#youtube-url-input').value;
            if (dependencies.room) {
                dependencies.room.updateRoomState({ youtubeUrl: url });
            }
        });

        adminContent.querySelector('#toggle-grid-button')?.addEventListener('click', () => {
            if (dependencies.gridManager && dependencies.playerControls) {
                const playerPosition = dependencies.playerControls.getPlayerModel().position;
                dependencies.gridManager.toggle(playerPosition);
            }
        });

        /* @tweakable The list of rigged characters to display in the admin panel. */
        const riggedCharacters = ['Player', 'Robot', 'Eyebot', 'Chicken', 'Wireframe', 'Alien', 'Shopkeeper', 'Ogre', 'Knight'];
        const riggedCharactersList = adminContent.querySelector('#rigged-characters-list');
        
        /* @tweakable The list style type for the rigged characters list in admin options. */
        const listStyle = 'disc';
        riggedCharactersList.style.listStyleType = listStyle;
        
        riggedCharacters.forEach(charName => {
            const li = document.createElement('li');
            li.textContent = charName;
            riggedCharactersList.appendChild(li);
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

        adminTab.addEventListener('click', (e) => {
            document.querySelectorAll('.options-tab').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            document.querySelectorAll('.options-tab-content').forEach(content => {
                content.classList.remove('active');
            });
            adminContent.classList.add('active');
        });
    }
}