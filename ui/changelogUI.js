export class ChangelogUI {
    create() {
        const uiContainer = document.getElementById('ui-container');
        const changelogButton = document.createElement('div');
        changelogButton.id = 'changelog-button';
        changelogButton.classList.add('circle-button');
        changelogButton.setAttribute('data-tooltip', 'View Changelog');
        /* @tweakable The URL for the changelog icon. */
        const changelogIconUrl = "https://file.garden/Zy7B0LkdIVpGyzA1/Public/Images/Icons/changelog_icon.png";
        /* @tweakable The size of the changelog icon. */
        const changelogIconSize = "28px";
        changelogButton.innerHTML = `<img src="${changelogIconUrl}" alt="Changelog" style="width: ${changelogIconSize}; height: ${changelogIconSize};">`;
        uiContainer.appendChild(changelogButton);

        const changelogModal = document.createElement('div');
        changelogModal.id = 'changelog-modal';
        changelogModal.innerHTML = `
            <div id="close-changelog" data-tooltip="Close">✕</div>
            <pre id="changelog-content"></pre>
        `;
        uiContainer.appendChild(changelogModal);

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