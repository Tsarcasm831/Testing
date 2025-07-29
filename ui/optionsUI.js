import * as THREE from 'three';
import { addAdminTab } from './options/adminTab.js';
import { setupAssetControls } from './options/assetControls.js';
import { applyPerformanceMode, applyShadowQuality } from './options/performance.js';
import * as houseItems from '../js/items/houseItems.js';

export class OptionsUI {
    constructor(dependencies) {
        this.dependencies = dependencies;
        this.assetReplacementManager = dependencies.assetReplacementManager;
        this.playerControls = dependencies.playerControls;
        this.renderer = dependencies.renderer;
        this.dirLight = dependencies.dirLight;
        this.scene = dependencies.scene;
        this.modal = null;
        this.itemPreviewScene = null;
        this.itemPreviewCamera = null;
        this.itemPreviewRenderer = null;
        this.itemPreviewModel = null;
        this.itemPreviewAnimationId = null;
        this.itemPreviewContainer = null;
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
                <button class="options-tab" data-tab="items">Items</button>
                <button class="options-tab" data-tab="about">About</button>
            </div>
            <div id="options-content">
                <div id="options-tab-general" class="options-tab-content active">
                    <h3>General Settings</h3>
                    <div class="options-section">
                        <h4>Performance</h4>
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
                    </div>
                    <div class="options-section">
                        <h4>Gameplay</h4>
                        <button id="toggle-mobile-controls-button" class="option-button" data-tooltip="Toggle on-screen controls.">Toggle Mobile Controls</button>
                        <button id="respawn-button" class="option-button" data-tooltip="Return to the starting area">Respawn</button>
                    </div>
                </div>
                <div id="options-tab-assets" class="options-tab-content">
                    <h3>Asset Management</h3>
                    <div class="options-section">
                        <h4>Asset Packs</h4>
                        <button id="download-assets" class="option-button" data-tooltip="Download assets for animated models">Download All Assets</button>
                        <div id="download-status"></div>
                    </div>
                    <div class="options-section" id="asset-replacement-buttons">
                        <h4>Animated Models</h4>
                        <button class="option-button" id="use-all-assets-button" data-tooltip="Replace all characters with animated versions">Use All Animated Models</button>
                        <div id="asset-buttons-grid">
                            <button class="option-button" id="replace-player-button" data-tooltip="Use an animated model for your player">Animated Player</button>
                            <button class="option-button" id="replace-robots-button" data-tooltip="Replace robot NPCs with animated models">Animated Robots</button>
                            <button class="option-button" id="replace-eyebots-button" data-tooltip="Replace eyebot NPCs with models">Eyebots</button>
                            <button class="option-button" id="replace-chickens-button" data-tooltip="Replace chicken NPCs with animated models">Animated Chickens</button>
                            <button class="option-button" id="replace-wireframes-button" data-tooltip="Replace wireframe NPCs with animated models">Animated Wireframes</button>
                            <button class="option-button" id="replace-aliens-button" data-tooltip="Replace alien NPCs with animated models">Animated Aliens</button>
                            <button class="option-button" id="replace-shopkeeper-button" data-tooltip="Replace shopkeeper NPC with an animated model">Animated Shopkeeper</button>
                            <button class="option-button" id="replace-sprites-button" data-tooltip="Replace sprite NPCs with animated models">Animated Sprites</button>
                            <button class="option-button" id="replace-ogres-button" data-tooltip="Replace ogre NPCs with animated models">Animated Ogres</button>
                            <button class="option-button" id="replace-knights-button" data-tooltip="Replace knight NPCs with animated models">Animated Knights</button>
                        </div>
                    </div>
                </div>
                <div id="options-tab-items" class="options-tab-content">
                    <h3>Item Catalog</h3>
                    <div class="item-catalog-body">
                        <div id="item-list-container" class="item-list"></div>
                        <div id="item-preview-container" class="item-preview"></div>
                    </div>
                </div>
                <div id="options-tab-about" class="options-tab-content">
                    <div class="options-section">
                      <h3>About this Project</h3>
                      <p>3D Overworld Template v1.9</p>
                      <p>Created with Websim for educational purposes.</p>
                    </div>
                    <div class="options-section">
                        <h3>Credits</h3>
                        <p>Models from Mixamo. Project by LordTsarcasm.</p>
                    </div>
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

        modal.querySelector('.options-tab[data-tab="items"]').addEventListener('click', (e) => {
            if (!this.itemPreviewRenderer) {
                this.setupItemPreview();
            }
        });

        // Add admin tab if user is lordtsarcasm
        addAdminTab(this.dependencies, modal, this);

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

    setupItemPreview() {
        this.itemPreviewContainer = this.modal.querySelector('#item-preview-container');
        this.itemPreviewScene = new THREE.Scene();
        
        /* @tweakable The background color of the item preview scene. */
        const previewBackgroundColor = 0x2a2a2a;
        this.itemPreviewScene.background = new THREE.Color(previewBackgroundColor);

        this.itemPreviewCamera = new THREE.PerspectiveCamera(50, this.itemPreviewContainer.clientWidth / this.itemPreviewContainer.clientHeight, 0.1, 1000);
        this.itemPreviewCamera.position.set(0, 1.5, 3);
        this.itemPreviewCamera.lookAt(0, 0.5, 0);

        this.itemPreviewRenderer = new THREE.WebGLRenderer({ antialias: true });
        this.itemPreviewRenderer.setSize(this.itemPreviewContainer.clientWidth, this.itemPreviewContainer.clientHeight);
        this.itemPreviewContainer.appendChild(this.itemPreviewRenderer.domElement);
        
        /* @tweakable The intensity of the ambient light in the item preview. */
        const ambientLightIntensity = 0.8;
        const ambLight = new THREE.AmbientLight(0xffffff, ambientLightIntensity);
        this.itemPreviewScene.add(ambLight);

        /* @tweakable The intensity of the directional light in the item preview. */
        const directionalLightIntensity = 1.5;
        const dirLight = new THREE.DirectionalLight(0xffffff, directionalLightIntensity);
        dirLight.position.set(5, 10, 7.5);
        this.itemPreviewScene.add(dirLight);

        this.populateItemList();
        this.animateItemPreview();
    }

    populateItemList() {
        const listContainer = this.modal.querySelector('#item-list-container');
        listContainer.innerHTML = '';
        for (const itemName in houseItems) {
            if (typeof houseItems[itemName] === 'function') {
                const button = document.createElement('button');
                button.className = 'option-button';
                button.textContent = itemName.replace('create', '').replace(/([A-Z])/g, ' $1').trim();
                button.addEventListener('click', () => this.showItemInPreview(itemName));
                listContainer.appendChild(button);
            }
        }
    }

    async showItemInPreview(itemName) {
        if (this.itemPreviewModel) {
            this.itemPreviewScene.remove(this.itemPreviewModel);
        }
        this.itemPreviewModel = await houseItems[itemName](this.assetReplacementManager);

        const box = new THREE.Box3().setFromObject(this.itemPreviewModel);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxSize = Math.max(size.x, size.y, size.z);
        
        /* @tweakable The scaling factor for items in the preview window to fit them in view. */
        const scale = 1.5 / maxSize;
        
        this.itemPreviewModel.scale.set(scale, scale, scale);
        this.itemPreviewModel.position.sub(center.multiplyScalar(scale));
        
        this.itemPreviewScene.add(this.itemPreviewModel);
    }
    
    animateItemPreview() {
        this.itemPreviewAnimationId = requestAnimationFrame(this.animateItemPreview.bind(this));
        if (this.itemPreviewModel) {
            /* @tweakable The rotation speed of the item in the preview window. */
            const rotationSpeed = 0.01;
            this.itemPreviewModel.rotation.y += rotationSpeed;
        }
        if(this.itemPreviewRenderer) {
            this.itemPreviewRenderer.render(this.itemPreviewScene, this.itemPreviewCamera);
        }
    }

    stopItemPreviewAnimation() {
        if (this.itemPreviewAnimationId) {
            cancelAnimationFrame(this.itemPreviewAnimationId);
            this.itemPreviewAnimationId = null;
        }
    }

    toggleModal() {
        if (!this.modal) return;
        const isVisible = this.modal.style.display === 'block';

        if (isVisible) {
            this.modal.style.display = 'none';
            this.playerControls.enabled = true;
            this.stopItemPreviewAnimation();
        } else {
            this.modal.style.display = 'block';
            this.playerControls.enabled = false;
        }
    }
}