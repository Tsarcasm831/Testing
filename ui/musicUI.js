export class MusicUI {
    constructor(dependencies) {
        this.playerControls = dependencies.playerControls;
        /* @tweakable The list of songs available in the music player. */
        this.songs = [
            { title: "Who Are You", artist: "Kronowski", url: "https://file.garden/Zy7B0LkdIVpGyzA1/Songs/Who%20Are%20You.mp3" },
            { title: "The Weight", artist: "Kronowski", url: "https://file.garden/Zy7B0LkdIVpGyzA1/Videos/The%20Weight%20-%20Kronowski%20(AI%20Music%20Video).mp4" },
            { title: "Placeholder Song", artist: "TBD", url: null },
        ];
        this.audioElement = null;
        this.currentSongIndex = -1;
        this.modal = null;
        this.isOpen = false;
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

        this.audioElement = document.getElementById('music-player');

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
        this.modal = modal;

        button.addEventListener('click', () => {
            this.toggle();
        });

        modal.querySelector('#close-music').addEventListener('click', () => {
            this.toggle();
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

        this.populateSongList();
        this.audioElement.addEventListener('play', () => this.updatePlayingUI());
        this.audioElement.addEventListener('pause', () => this.updatePlayingUI());
    }

    populateSongList() {
        const songListEl = this.modal.querySelector('#music-song-list');
        songListEl.innerHTML = '';
        this.songs.forEach((song, index) => {
            const li = document.createElement('li');
            li.className = 'song-item';
            li.dataset.index = index;
            li.innerHTML = `
                <div class="song-info">
                    <span class="song-title">${song.title}</span>
                    <span class="song-artist">${song.artist}</span>
                </div>
                <div class="song-status"></div>
            `;
            
            if (song.url) {
                li.addEventListener('click', () => this.playSong(index));
            } else {
                li.classList.add('disabled');
            }
            songListEl.appendChild(li);
        });
    }

    playSong(index) {
        if (index < 0 || index >= this.songs.length) return;
        const song = this.songs[index];
        if (!song.url) return;

        if (index === this.currentSongIndex && !this.audioElement.paused) {
            this.audioElement.pause();
        } else {
            this.currentSongIndex = index;
            this.audioElement.src = song.url;
            this.audioElement.play().catch(e => console.error("Audio playback error:", e));
        }
    }

    updatePlayingUI() {
        const songItems = this.modal.querySelectorAll('.song-item');
        songItems.forEach((item, index) => {
            if (index === this.currentSongIndex && !this.audioElement.paused) {
                item.classList.add('playing');
            } else {
                item.classList.remove('playing');
            }
        });
    }

    toggle() {
        this.isOpen = !this.isOpen;
        if (this.modal) {
            this.modal.style.display = this.isOpen ? 'flex' : 'none';
        }
        if (this.playerControls) {
            this.playerControls.enabled = !this.isOpen;
        }
    }
}