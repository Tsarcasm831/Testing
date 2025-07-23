export class MusicUI {
    constructor(dependencies) {
        this.playerControls = dependencies.playerControls;
    }

    create() {
        const uiContainer = document.getElementById('ui-container');

        const button = document.createElement('div');
        button.id = 'music-button';
        button.classList.add('circle-button');
        button.setAttribute('data-tooltip', 'Music');
        /* @tweakable The URL for the music icon. */
        const musicIconUrl = "https://file.garden/Zy7B0LkdIVpGyzA1/Public/Images/Icons/music_icon.png";
        /* @tweakable The size of the music icon. */
        const musicIconSize = "28px";
        button.innerHTML = `<img src="${musicIconUrl}" alt="Music" style="width: ${musicIconSize}; height: ${musicIconSize};">`;
        uiContainer.appendChild(button);

        const modal = document.createElement('div');
        modal.id = 'music-modal';
        modal.style.display = 'none';
        modal.innerHTML = `
            <div id="music-header">
                <h2>Music</h2>
                <div id="close-music" data-tooltip="Close">✕</div>
            </div>
            <div id="music-tabs">
                <button class="music-tab active" data-tab="songs">Songs</button>
                <button class="music-tab" data-tab="collaborators">Collaborators</button>
            </div>
            <div id="music-content">
                <div id="music-tab-songs" class="music-tab-content active">
                    <ul id="music-song-list">
                        <li>Placeholder Song 1</li>
                        <li>Placeholder Song 2</li>
                        <li>Placeholder Song 3</li>
                        <li>Placeholder Song 4</li>
                        <li>Placeholder Song 5</li>
                    </ul>
                </div>
                <div id="music-tab-collaborators" class="music-tab-content">
                    <ul id="music-collaborators-list">
                        <li>Alice</li>
                        <li>Bob</li>
                        <li>Carol</li>
                        <li>Dave</li>
                        <li>Eve</li>
                    </ul>
                </div>
            </div>
        `;
        uiContainer.appendChild(modal);

        button.addEventListener('click', () => {
            modal.style.display = 'block';
            if (this.playerControls) this.playerControls.enabled = false;
        });

        modal.querySelector('#close-music').addEventListener('click', () => {
            modal.style.display = 'none';
            if (this.playerControls) this.playerControls.enabled = true;
        });

        modal.querySelectorAll('.music-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                modal.querySelectorAll('.music-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                modal.querySelectorAll('.music-tab-content').forEach(content => content.classList.remove('active'));
                modal.querySelector(`#music-tab-${tabName}`).classList.add('active');
            });
        });
    }
}