export class ChangelogUI {
    create() {
        const gameContainer = document.getElementById('game-container');
        const changelogButton = document.createElement('div');
        changelogButton.id = 'changelog-button';
        changelogButton.classList.add('circle-button');
        changelogButton.setAttribute('data-tooltip', 'View Changelog');
        changelogButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M15 1H4a2 2 0 00-2 2v18a2 2 0 002 2h13a1 1 0 001-1V2a1 1 0 00-1-1zM4 3h11v2H4V3zm9 6H6v2h7V9zm-3 4H6v2h4v-2z"/></svg>`;
        gameContainer.appendChild(changelogButton);

        const changelogModal = document.createElement('div');
        changelogModal.id = 'changelog-modal';
        changelogModal.innerHTML = `
            <div id="close-changelog" data-tooltip="Close">✕</div>
            <pre id="changelog-content"></pre>
        `;
        gameContainer.appendChild(changelogModal);

        changelogButton.addEventListener('click', async () => {
            changelogModal.style.display = 'block';
            const contentEl = changelogModal.querySelector('#changelog-content');
            try {
                const text = await fetch('CHANGELOG.md').then(r => r.text());
                contentEl.textContent = text;
            } catch (e) {
                contentEl.textContent = 'Failed to load changelog.';
            }
        });

        changelogModal.querySelector('#close-changelog').addEventListener('click', () => {
            changelogModal.style.display = 'none';
        });
    }
}