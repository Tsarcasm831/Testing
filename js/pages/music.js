import { app } from "../app.js";
(function(ns) {
    'use strict';

    ns.pages = ns.pages || {};

    function initMusicPage() {
        ns.ui.setupTooltipAnimation();

        const songFiles = [
            '/songs/songs_a_e.json',
            '/songs/songs_f_j.json',
            '/songs/songs_k_o.json',
            '/songs/songs_p_s.json',
            '/songs/songs_t_z.json'
        ];

        async function fetchAllSongs() {
            try {
                const responses = await Promise.all(songFiles.map(file => fetch(file)));
                const songArrays = await Promise.all(responses.map(res => {
                    if (!res.ok) throw new Error(`Failed to fetch ${res.url}`);
                    return res.json();
                }));
                let allSongs = songArrays.flat();
                allSongs.sort((a, b) => a.song_title.localeCompare(b.song_title));
                return allSongs;
            } catch (error) {
                console.error("Failed to load song catalog:", error);
                return null;
            }
        }

        function renderSongs(songs, container) {
            if (!container) return;
            if (songs.length === 0) {
                container.innerHTML = `<p style="text-align: center;">No songs found.</p>`;
                return;
            }

            const songListHtml = songs.map(song => `
                <div class="song-catalog-item">
                    <h4 class="song-catalog-title">${song.song_title}</h4>
                    <div class="song-links">
                        <a href="${song.spotify_url}" target="_blank" class="platform-link">Spotify</a>
                        <a href="${song.youtube_url}" target="_blank" class="platform-link">YouTube</a>
                        <a href="${song.apple_url}" target="_blank" class="platform-link">Apple Music</a>
                    </div>
                </div>
            `).join('');
            container.innerHTML = songListHtml;
        }

        async function loadCatalog() {
            const songListContainer = document.getElementById('song-list-container');
            const searchInput = document.getElementById('song-search-input');
            const exportBtn = document.getElementById('export-catalog-btn');

            if (!songListContainer) return;

            const allSongs = await fetchAllSongs();

            if (allSongs === null) {
                songListContainer.innerHTML = `<p style="text-align: center;">Error loading song catalog. Data might be corrupted.</p>`;
                if (searchInput) searchInput.style.display = 'none';
                if (exportBtn) exportBtn.style.display = 'none';
                return;
            }

            renderSongs(allSongs, songListContainer);

            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    const searchTerm = e.target.value.toLowerCase().trim();
                    const filteredSongs = allSongs.filter(song => song.song_title.toLowerCase().includes(searchTerm));
                    renderSongs(filteredSongs, songListContainer);
                });
            }

            if (exportBtn) {
                exportBtn.addEventListener('click', () => {
                    if (!allSongs || allSongs.length === 0) {
                        alert("Song catalog is empty or not loaded yet.");
                        return;
                    }
                    const jsonString = JSON.stringify(allSongs, null, 2);
                    const blob = new Blob([jsonString], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);

                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'lord_tsarcasm_song_catalog.json';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                });
            }

            const exportSeparatedContainer = document.getElementById('export-separated-container');
            if (exportSeparatedContainer) {
                songFiles.forEach(filePath => {
                    const button = document.createElement('button');
                    const fileName = filePath.split('/').pop();
                    button.textContent = `Export ${fileName}`;
                    button.classList.add('platform-link');
                    button.style.flexGrow = '0';
                    button.addEventListener('click', async () => {
                        try {
                            const response = await fetch(filePath);
                            if (!response.ok) {
                                throw new Error(`Failed to fetch ${filePath}`);
                            }
                            const blob = await response.blob();
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = fileName;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                        } catch (error) {
                            console.error('Error exporting file:', error);
                            alert(`Could not export ${fileName}.`);
                        }
                    });
                    exportSeparatedContainer.appendChild(button);
                });
            }
        }

        loadCatalog();
    }

    Object.assign(ns.pages, { initMusicPage });
}(app));
