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
        `;
        contentContainer.appendChild(adminContent);

        adminContent.querySelector('#save-youtube-url').addEventListener('click', () => {
            const url = adminContent.querySelector('#youtube-url-input').value;
            if (dependencies.room) {
                dependencies.room.updateRoomState({ youtubeUrl: url });
            }
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
