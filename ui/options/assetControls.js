export function setupAssetControls(modal, assetReplacementManager) {
    const toggleReplaceButtons = (show) => {
        const container = modal.querySelector('#asset-replacement-buttons');
        if (container) {
            container.style.display = show ? 'grid' : 'none';
        }
    };

    toggleReplaceButtons(false);

    modal.querySelector('#download-assets').addEventListener('click', async () => {
        const success = await assetReplacementManager.downloadExternalAssets();
        if (success) {
            toggleReplaceButtons(true);
        }
    });

    modal.querySelector('#use-all-assets-button').addEventListener('click', () => {
        assetReplacementManager.replaceAllModels();
    });

    modal.querySelector('#replace-player-button').addEventListener('click', () => {
        assetReplacementManager.replaceModel('player');
    });
    modal.querySelector('#replace-robots-button').addEventListener('click', () => {
        assetReplacementManager.replaceModel('robot');
    });
    modal.querySelector('#replace-eyebots-button').addEventListener('click', () => {
        assetReplacementManager.replaceModel('eyebot');
    });
    modal.querySelector('#replace-chickens-button').addEventListener('click', () => {
        assetReplacementManager.replaceModel('chicken');
    });
    modal.querySelector('#replace-wireframes-button').addEventListener('click', () => {
        assetReplacementManager.replaceModel('wireframe');
    });
    modal.querySelector('#replace-aliens-button').addEventListener('click', () => {
        assetReplacementManager.replaceModel('alien');
    });
    modal.querySelector('#replace-shopkeeper-button').addEventListener('click', () => {
        assetReplacementManager.replaceModel('shopkeeper');
    });
    modal.querySelector('#replace-ogres-button').addEventListener('click', () => {
        assetReplacementManager.replaceModel('ogre');
    });
    modal.querySelector('#replace-knights-button').addEventListener('click', () => {
        assetReplacementManager.replaceModel('knight');
    });
}
