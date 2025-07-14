import { AssetReplacementManager } from '../js/assetReplacementManager.js';
import * as THREE from "three";

export class OptionsUI {
    constructor(dependencies) {
        this.dependencies = dependencies;
        this.assetReplacementManager = dependencies.assetReplacementManager;
        this.playerControls = dependencies.playerControls;
        this.renderer = dependencies.renderer;
        this.dirLight = dependencies.dirLight;
        this.scene = dependencies.scene;
    }

    create() {
        const container = document.getElementById('game-container');
        const button = document.createElement('div');
        button.id = 'options-button';
        button.classList.add('circle-button');
        button.setAttribute('data-tooltip', 'Options');
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                <path fill-rule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.946 1.55l-.57 2.092a1.75 1.75 0 00-1.212 1.212l-2.092.57c-.887.247-1.55.929-1.55 1.946l.003 2.059a1.75 1.75 0 001.212 1.212l2.092.57c.887.247 1.55.929 1.55 1.946l-.003 2.059c0 .917.663 1.699 1.55 1.946l2.092.57c.75.205 1.212.75 1.212 1.212l.57 2.092A2.25 2.25 0 0015.138 2.25h-4.06zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" clip-rule="evenodd" />
            </svg>
        `;
        container.appendChild(button);

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
                        <label for="shadow-quality">Shadow Quality</label>
                        <select id="shadow-quality">
                            <option value="high">High</option>
                            <option value="medium" selected>Medium</option>
                            <option value="low">Low</option>
                            <option value="off">Off</option>
                        </select>
                    </div>
                     <div class="option-item">
                        <label for="view-distance">View Distance</label>
                        <input type="range" id="view-distance" min="50" max="250" value="100" step="10">
                        <span id="view-distance-value">100</span>
                    </div>
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
        container.appendChild(modal);
        
        this.assetReplacementManager.setStatusElement(modal.querySelector('#download-status'));

        button.addEventListener('click', () => {
            modal.style.display = 'block';
            this.playerControls.enabled = false;
        });

        modal.querySelector('#close-options').addEventListener('click', () => {
            modal.style.display = 'none';
            this.playerControls.enabled = true;
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

        // Respawn logic
        modal.querySelector('#respawn-button').addEventListener('click', () => {
            const playerModel = this.playerControls.getPlayerModel();
            playerModel.position.set(0, 5, 0); // Respawn at center, slightly elevated
            this.playerControls.velocity.set(0, 0, 0); // Reset velocity
            modal.style.display = 'none';
            this.playerControls.enabled = true;
        });
        
        // Shadow Quality Logic
        const shadowQualitySelect = modal.querySelector('#shadow-quality');
        shadowQualitySelect.value = localStorage.getItem('shadowQuality') || 'medium';
        this.applyShadowQuality(shadowQualitySelect.value);
        shadowQualitySelect.addEventListener('change', (e) => {
            this.applyShadowQuality(e.target.value);
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
        
        const replaceButtons = [
            'use-all-assets-button', 'replace-player-button', 'replace-robots-button', 'replace-eyebots-button',
            'replace-chickens-button', 'replace-wireframes-button', 'replace-aliens-button'
        ];

        const toggleReplaceButtons = (show) => {
            const container = modal.querySelector('#asset-replacement-buttons');
            if (container) {
                container.style.display = show ? 'grid' : 'none';
            }
        };
        
        toggleReplaceButtons(false);

        modal.querySelector('#download-assets').addEventListener('click', async () => {
            const success = await this.assetReplacementManager.downloadExternalAssets();
            if (success) {
                toggleReplaceButtons(true);
            }
        });

        modal.querySelector('#use-all-assets-button').addEventListener('click', () => {
            this.assetReplacementManager.replaceAllModels();
        });

        modal.querySelector('#replace-player-button').addEventListener('click', () => {
            this.assetReplacementManager.replaceModel('player');
        });
        modal.querySelector('#replace-robots-button').addEventListener('click', () => {
            this.assetReplacementManager.replaceModel('robot');
        });
        modal.querySelector('#replace-eyebots-button').addEventListener('click', () => {
            this.assetReplacementManager.replaceModel('eyebot');
        });
        modal.querySelector('#replace-chickens-button').addEventListener('click', () => {
            this.assetReplacementManager.replaceModel('chicken');
        });
        modal.querySelector('#replace-wireframes-button').addEventListener('click', () => {
            this.assetReplacementManager.replaceModel('wireframe');
        });
        modal.querySelector('#replace-aliens-button').addEventListener('click', () => {
            this.assetReplacementManager.replaceModel('alien');
        });
    }

    applyShadowQuality(quality) {
        if (!this.renderer || !this.dirLight) return;
        
        switch(quality) {
            case 'high':
                this.renderer.shadowMap.enabled = true;
                this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
                this.dirLight.castShadow = true;
                this.dirLight.shadow.mapSize.width = 2048;
                this.dirLight.shadow.mapSize.height = 2048;
                this.dirLight.shadow.radius = 2.0;
                break;
            case 'medium':
                this.renderer.shadowMap.enabled = true;
                this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
                this.dirLight.castShadow = true;
                this.dirLight.shadow.mapSize.width = 1024;
                this.dirLight.shadow.mapSize.height = 1024;
                this.dirLight.shadow.radius = 1.5;
                break;
            case 'low':
                this.renderer.shadowMap.enabled = true;
                this.renderer.shadowMap.type = THREE.PCFShadowMap;
                this.dirLight.castShadow = true;
                this.dirLight.shadow.mapSize.width = 512;
                this.dirLight.shadow.mapSize.height = 512;
                break;
            case 'off':
                this.renderer.shadowMap.enabled = false;
                this.dirLight.castShadow = false;
                break;
        }
        // Force materials to update
        this.scene.traverse(obj => {
            if(obj.material) {
                obj.material.needsUpdate = true;
            }
        });
    }
}