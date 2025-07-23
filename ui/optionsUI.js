import { addAdminTab } from './options/adminTab.js';
import { setupAssetControls } from './options/assetControls.js';
import { applyPerformanceMode, applyShadowQuality } from './options/performance.js';

export class OptionsUI {
    constructor(dependencies) {
        this.dependencies = dependencies;
        this.assetReplacementManager = dependencies.assetReplacementManager;
        this.playerControls = dependencies.playerControls;
        this.renderer = dependencies.renderer;
        this.dirLight = dependencies.dirLight;
        this.scene = dependencies.scene;
        this.modal = null;
    }

    create() {
        const uiContainer = document.getElementById('ui-container');
        const button = document.createElement('div');
        button.id = 'options-button';
        button.classList.add('circle-button');
        button.setAttribute('data-tooltip', 'Options');
        /* @tweakable The URL for the options gear icon. */
        const optionsIconUrl = "https://file.garden/Zy7B0LkdIVpGyzA1/Public/Images/Icons/gear_icon.png";
        /* @tweakable The size of the options gear icon. */
        const optionsIconSize = "28px";
        button.innerHTML = `<img src="${optionsIconUrl}" alt="Options" style="width: ${optionsIconSize}; height: ${optionsIconSize};">`;
        uiContainer.appendChild(button);

        const modal = document.createElement('div');
        modal.id = 'options-modal';
        modal.style.display = 'none';
        modal.innerHTML = `
            <div id="options-header">
                <h2>Options</h2>
                <div id="close-options" data-tooltip="Close Options">✕</div>
            </div>
            <div id="options-tabs">
                <button class="options-tab active" data-tab="general">General</button>
                <button class="options-tab" data-tab="assets">Assets</button>
                <button class="options-tab" data-tab="about">About</button>
            </div>
            <div id="options-content">
                <div id="options-tab-general" class="options-tab-content active">
                    <h3>General Settings</h3>
                    <div class="option-item">
                        <label for="performance-mode">Performance Mode</label>
                        <input type="checkbox" id="performance-mode">
                    </div>
                    <div class="option-item">
                        <label for="shadow-quality">Shadow Quality</label>
                        <select id="shadow-quality">
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                            <option value="off">Off</option>
                        </select>
                    </div>
                     <div class="option-item">
                        <label for="view-distance">View Distance</label>
                        <input type="range" id="view-distance" min="50" max="300" value="150" step="10">
                        <span id="view-distance-value">150</span>
                    </div>
                    <button id="toggle-mobile-controls-button" class="option-button" data-tooltip="Toggle on-screen controls.">Toggle Mobile Controls</button>
                    <button id="respawn-button" class="option-button" data-tooltip="Return to the starting area">Respawn</button>
                </div>
                <div id="options-tab-assets" class="options-tab-content">
                    <h3>Asset Replacement</h3>
                    <button id="download-assets" class="option-button" data-tooltip="Download assets for animated models">Download All Assets</button>
                    <div id="download-status"></div>
                    <div id="asset-replacement-buttons">
                        <button class="option-button" id="use-all-assets-button" style="grid-column: 1 / -1; background-color: #4CAF50;" data-tooltip="Replace all characters with animated versions">Use All Animated Models</button>
                        <button class="option-button" id="replace-player-button" data-tooltip="Use an animated model for your player">Use Animated Player</button>
                        <button class="option-button" id="replace-robots-button" data-tooltip="Replace robot NPCs with animated models">Use Animated Robots</button>
                        <button class="option-button" id="replace-eyebots-button" data-tooltip="Replace eyebot NPCs with models">Use Eyebots</button>
                        <button class="option-button" id="replace-chickens-button" data-tooltip="Replace chicken NPCs with animated models">Use Animated Chickens</button>
                        <button class="option-button" id="replace-wireframes-button" data-tooltip="Replace wireframe NPCs with animated models">Use Animated Wireframes</button>
                        <button class="option-button" id="replace-aliens-button" data-tooltip="Replace alien NPCs with animated models">Use Animated Aliens</button>
                        <button class="option-button" id="replace-shopkeeper-button" data-tooltip="Replace shopkeeper NPC with an animated model">Use Animated Shopkeeper</button>
                        <button class="option-button" id="replace-ogres-button" data-tooltip="Replace ogre NPCs with animated models">Use Animated Ogres</button>
                        <button class="option-button" id="replace-knights-button" data-tooltip="Replace knight NPCs with animated models">Use Animated Knights</button>
                    </div>
                </div>
                <div id="options-tab-about" class="options-tab-content">
                    <h3>About</h3>
                    <p>3D Overworld Template v1.9</p>
                    <p>Created with Websim for educational purposes.</p>
                    <p>Models from Mixamo. Project by LordTsarcasm.</p>
                </div>
            </div>
        `;
        uiContainer.appendChild(modal);
        this.modal = modal;
        
        this.assetReplacementManager.setStatusElement(modal.querySelector('#download-status'));

        button.addEventListener('click', () => this.toggleModal());

        modal.querySelector('#close-options').addEventListener('click', () => this.toggleModal());

        window.addEventListener('keydown', (e) => {
            if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;

            /* @tweakable The keybind to open the options menu. */
            const optionsKeybind = '`';
            if (e.key === optionsKeybind) {
                this.toggleModal();
            }
        });

        // Tab switching logic
        modal.querySelectorAll('.options-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                modal.querySelectorAll('.options-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                modal.querySelectorAll('.options-tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                modal.querySelector(`#options-tab-${tabName}`).classList.add('active');
            });
        });

        // Add admin tab if user is lordtsarcasm
        addAdminTab(this.dependencies, modal);

        // Respawn logic
        modal.querySelector('#respawn-button').addEventListener('click', () => {
            const playerModel = this.playerControls.getPlayerModel();
            playerModel.position.set(0, 5, 0); // Respawn at center, slightly elevated
            this.playerControls.velocity.set(0, 0, 0); // Reset velocity
            this.toggleModal();
        });

        // Performance Mode Logic
        const performanceModeCheckbox = modal.querySelector('#performance-mode');
        const isPerformanceMode = localStorage.getItem('performanceMode') === 'true';
        performanceModeCheckbox.checked = isPerformanceMode;
        if (isPerformanceMode) applyPerformanceMode(this, true);

        performanceModeCheckbox.addEventListener('change', (e) => {
            const enabled = e.target.checked;
            applyPerformanceMode(this, enabled);
            localStorage.setItem('performanceMode', enabled);
        });
        
        // Shadow Quality Logic
        const shadowQualitySelect = modal.querySelector('#shadow-quality');
        const defaultShadowQuality = this.playerControls.isMobile ? 'low' : 'medium';
        shadowQualitySelect.value = localStorage.getItem('shadowQuality') || defaultShadowQuality;
        applyShadowQuality(this, shadowQualitySelect.value);
        shadowQualitySelect.addEventListener('change', (e) => {
            applyShadowQuality(this, e.target.value);
            localStorage.setItem('shadowQuality', e.target.value);
        });

        // View distance logic
        const viewDistanceSlider = modal.querySelector('#view-distance');
        const viewDistanceValue = modal.querySelector('#view-distance-value');
        viewDistanceSlider.value = this.playerControls.camera.far;
        viewDistanceValue.textContent = this.playerControls.camera.far;
        viewDistanceSlider.addEventListener('input', (e) => {
            const distance = parseInt(e.target.value);
            this.playerControls.camera.far = distance;
            this.playerControls.camera.updateProjectionMatrix();
            viewDistanceValue.textContent = distance;
        });
        
        const toggleMobileButton = modal.querySelector('#toggle-mobile-controls-button');
        const updateButtonText = () => {
            const isMobile = this.playerControls.isMobile;
            /* @tweakable Text for the mobile controls toggle button when mobile controls are active. */
            const desktopText = "Use Desktop Controls";
            /* @tweakable Text for the mobile controls toggle button when desktop controls are active. */
            const mobileText = "Use Mobile Controls";
            toggleMobileButton.textContent = isMobile ? desktopText : mobileText;
        };
        updateButtonText();
        
        toggleMobileButton.addEventListener('click', () => {
            this.playerControls.toggleMobileControls();
            updateButtonText();
        });
        
        setupAssetControls(modal, this.assetReplacementManager);
    }

    toggleModal() {
        if (!this.modal) return;
        const isVisible = this.modal.style.display === 'block';

        if (isVisible) {
            this.modal.style.display = 'none';
            this.playerControls.enabled = true;
        } else {
            this.modal.style.display = 'block';
            this.playerControls.enabled = false;
        }
    }
}