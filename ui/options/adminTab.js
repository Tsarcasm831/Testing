export async function addAdminTab(dependencies) {
    const currentUser = await window.websim.getCurrentUser();
    const adminUsername = 'lordtsarcasm';

    if (currentUser && currentUser.username === adminUsername) {
        const tabsContainer = document.querySelector('#options-tabs');
        const contentContainer = document.querySelector('#options-content');

        const adminTab = document.createElement('button');
        adminTab.className = 'options-tab admin-tab';
        adminTab.dataset.tab = 'admin';
        adminTab.textContent = 'Admin';
        tabsContainer.appendChild(adminTab);

        const adminContent = document.createElement('div');
        adminContent.id = 'options-tab-admin';
        adminContent.className = 'options-tab-content';
        adminContent.innerHTML = `
            <h3>Admin Controls</h3>
            <div class="option-item">
                <label for="youtube-url-input">Video URL:</label>
                <input type="text" id="youtube-url-input" placeholder="Enter video file URL...">
            </div>
            <button id="save-youtube-url" class="option-button" data-tooltip="Update the video screen for everyone">Set Video</button>
            <div class="option-item" style="margin-top: 20px;">
                <label for="toggle-grid-button">Toggle World Grid</label>
                <button id="toggle-grid-button" class="option-button" data-tooltip="Show or hide the coordinate grid">Toggle Grid</button>
            </div>
            <div class="option-item" style="margin-top: 20px; flex-direction: column; align-items: flex-start;">
                <label>Rigged GLB Characters:</label>
                <ul id="rigged-characters-list" style="padding-left: 20px; margin-top: 5px;"></ul>
            </div>
        `;
        contentContainer.appendChild(adminContent);

        adminContent.querySelector('#save-youtube-url').addEventListener('click', () => {
            const url = adminContent.querySelector('#youtube-url-input').value;
            if (dependencies.room) {
                dependencies.room.updateRoomState({ youtubeUrl: url });
            }
        });

        adminContent.querySelector('#toggle-grid-button').addEventListener('click', () => {
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