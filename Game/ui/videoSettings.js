export class VideoSettings {
    constructor(dependencies) {
        this.playerControls = dependencies.playerControls;
        this.room = dependencies.room;
        this.modal = null;
        this.isOpen = false;
    }

    async create() {
        const uiContainer = document.getElementById('ui-container');
        const modal = document.createElement('div');
        modal.id = 'video-settings-modal';
        modal.style.display = 'none';
        modal.innerHTML = `
            <div id="video-settings-header">
                <h2>Video Settings</h2>
                <div id="close-video-settings" data-tooltip="Close">✕</div>
            </div>
            <div id="video-settings-content"></div>
        `;
        uiContainer.appendChild(modal);
        this.modal = modal;

        const content = modal.querySelector('#video-settings-content');
        const adminSection = document.createElement('div');
        adminSection.className = 'options-section';
        adminSection.innerHTML = `
            <h4>Video Screen</h4>
            <div class="option-item-vertical">
                <label for="video-url-input">Video URL:</label>
                <input type="text" id="video-url-input" placeholder="Enter video file URL...">
            </div>
            <button id="save-video-url" class="option-button" data-tooltip="Update the video screen for everyone">Set Video</button>
        `;
        content.appendChild(adminSection);

        const currentUser = await (window.websim?.getCurrentUser?.() ?? null);
        const adminUsername = 'lordtsarcasm';
        if (!currentUser || currentUser.username !== adminUsername) {
            adminSection.style.display = 'none';
        }

        modal.querySelector('#close-video-settings').addEventListener('click', () => this.toggle());
        const saveBtn = modal.querySelector('#save-video-url');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const url = modal.querySelector('#video-url-input').value;
                if (this.room) {
                    this.room.updateRoomState({ youtubeUrl: url });
                }
            });
        }

        window.addEventListener('keydown', (e) => {
            if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;
            const videoKeybind = 'v';
            if (e.key.toLowerCase() === videoKeybind) {
                this.toggle();
            }
        });
    }

    toggle() {
        this.isOpen = !this.isOpen;
        if (this.modal) {
            this.modal.style.display = this.isOpen ? 'block' : 'none';
        }
        if (this.playerControls) {
            this.playerControls.enabled = !this.isOpen;
        }
    }
}
