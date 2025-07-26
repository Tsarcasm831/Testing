import * as THREE from 'three';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
import { createPlayerModel } from '../js/playerModel.js';

export class BestiaryUI {
    constructor(dependencies) {
        this.npcManager = dependencies.npcManager;
        this.playerControls = dependencies.playerControls;
        this.presetCharacters = dependencies.presetCharacters;
        this.modal = null;
        this.isOpen = false;

        this.previewScene = null;
        this.previewCamera = null;
        this.previewModel = null;
        this.previewRenderer = null;
        this.previewAnimationId = null;
    }

    create() {
        const uiContainer = document.getElementById('ui-container');

        const button = document.createElement('div');
        button.id = 'bestiary-button';
        button.classList.add('circle-button');
        button.setAttribute('data-tooltip', 'Bestiary (B)');
        /* @tweakable The URL for the bestiary icon. */
        const iconUrl = 'https://file.garden/Zy7B0LkdIVpGyzA1/Public/Images/Icons/bestiary_icon.png';
        /* @tweakable The size of the bestiary icon. */
        const iconSize = '28px';
        button.innerHTML = `<img src="${iconUrl}" alt="Bestiary" style="width: ${iconSize}; height: ${iconSize};">`;
        uiContainer.appendChild(button);

        const modal = document.createElement('div');
        modal.id = 'bestiary-modal';
        /* @tweakable The inner HTML structure of the bestiary modal, defining its layout. */
        modal.innerHTML = `
            <div id="bestiary-header">
                <h2>Bestiary</h2>
                <div id="close-bestiary" data-tooltip="Close">✕</div>
            </div>
            <div id="bestiary-body">
                <div id="bestiary-list-container">
                    <div id="bestiary-list"></div>
                </div>
                <div id="bestiary-detail-container">
                    <div id="bestiary-preview-container"></div>
                    <h3 id="bestiary-npc-name"></h3>
                    <p id="bestiary-npc-description"></p>
                </div>
            </div>
        `;
        uiContainer.appendChild(modal);
        this.modal = modal;

        button.addEventListener('click', () => this.toggle());
        modal.querySelector('#close-bestiary').addEventListener('click', () => this.toggle());

        window.addEventListener('keydown', (e) => {
            if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;
            if (e.key.toLowerCase() === 'b') {
                this.toggle();
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
        if (this.isOpen) {
            if (!this.previewRenderer) {
                this.setupPreviewRenderer();
            }
            this.populate();
            this.startPreviewAnimation();
        } else {
            this.stopPreviewAnimation();
        }
    }
    
    setupPreviewRenderer() {
        const container = this.modal.querySelector('#bestiary-preview-container');
        if (!container) return;

        this.previewScene = new THREE.Scene();
        /* @tweakable The background color for the bestiary preview renders. */
        const previewBackgroundColor = 0x2a2a2a;
        this.previewScene.background = new THREE.Color(previewBackgroundColor);

        this.previewCamera = new THREE.PerspectiveCamera(30, container.clientWidth / container.clientHeight, 0.1, 100);
        /* @tweakable The camera position for the bestiary previews. */
        const cameraPosition = { x: 0, y: 1.5, z: 4 };
        this.previewCamera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
        this.previewCamera.lookAt(0, 0.75, 0);

        /* @tweakable The intensity of the ambient light in the bestiary preview. */
        const ambientLightIntensity = 0.8;
        const ambLight = new THREE.AmbientLight(0xffffff, ambientLightIntensity);
        this.previewScene.add(ambLight);

        /* @tweakable The intensity of the directional light in the bestiary preview. */
        const directionalLightIntensity = 1.5;
        const dirLight = new THREE.DirectionalLight(0xffffff, directionalLightIntensity);
        /* @tweakable The position of the directional light in the bestiary preview. */
        const directionalLightPosition = { x: 2, y: 5, z: 3 };
        dirLight.position.set(directionalLightPosition.x, directionalLightPosition.y, directionalLightPosition.z);
        this.previewScene.add(dirLight);

        this.previewRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.previewRenderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(this.previewRenderer.domElement);
    }

    populate() {
        if (!this.modal || !this.npcManager) return;
        
        const listEl = this.modal.querySelector('#bestiary-list');
        listEl.innerHTML = ''; // Clear previous entries

        const uniqueNpcs = new Map();
        
        this.presetCharacters.forEach(preset => {
            if (!uniqueNpcs.has(preset.id)) {
                uniqueNpcs.set(preset.id, {
                    presetId: preset.id,
                    modelName: preset.name,
                    description: preset.description,
                    spec: preset.spec,
                    animatedModel: this.npcManager.npcSpawner.animatedData[preset.id]?.model
                });
            }
        });
        
        const npcArray = Array.from(uniqueNpcs.values());

        npcArray.forEach(npcInfo => {
            const entry = document.createElement('button');
            entry.className = 'bestiary-entry';
            entry.textContent = npcInfo.modelName || npcInfo.presetId;
            entry.addEventListener('click', () => {
                this.showNpcDetail(npcInfo);
                listEl.querySelectorAll('.bestiary-entry').forEach(el => el.classList.remove('active'));
                entry.classList.add('active');
            });
            listEl.appendChild(entry);
        });
        
        // Show the first NPC by default
        if (npcArray.length > 0) {
            this.showNpcDetail(npcArray[0]);
            listEl.querySelector('.bestiary-entry').classList.add('active');
        }
    }

    showNpcDetail(npcInfo) {
        if (!this.previewScene) return;

        if (this.previewModel) {
            this.previewScene.remove(this.previewModel);
            // Dispose of old model's resources
            this.previewModel.traverse(child => {
                if (child.isMesh) {
                    child.geometry.dispose();
                    if(Array.isArray(child.material)) {
                        child.material.forEach(m => m.dispose());
                    } else {
                        child.material.dispose();
                    }
                }
            });
        }
        
        let model;
        if (npcInfo.animatedModel) {
            model = SkeletonUtils.clone(npcInfo.animatedModel);
            model.userData.isAnimatedGLB = true; 
            
            if (model.animations && model.animations.length > 0) {
                const mixer = new THREE.AnimationMixer(model);
                model.userData.mixer = mixer;
                const idleClip = model.animations.find(clip => clip.name.toLowerCase().includes('idle'));
                const clipToPlay = idleClip || model.animations[0];
                if (clipToPlay) {
                    const action = mixer.clipAction(clipToPlay);
                    action.play();
                }
            }
        } else {
            model = createPlayerModel(THREE, npcInfo.modelName, npcInfo.spec);
        }

        model.position.set(0, 0, 0);
        model.rotation.set(0, 0, 0);
        
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxSize = Math.max(size.x, size.y, size.z);
        
        /* @tweakable The scaling factor for models in the bestiary preview to fit them in view. */
        const scaleFactor = 1.5;
        if (maxSize > 0) {
            const scale = scaleFactor / maxSize;
            model.scale.set(scale, scale, scale);
            model.position.sub(center.multiplyScalar(scale));
        }

        this.previewModel = model;
        this.previewScene.add(this.previewModel);

        this.modal.querySelector('#bestiary-npc-name').textContent = npcInfo.modelName;
        this.modal.querySelector('#bestiary-npc-description').textContent = npcInfo.description;
    }

    startPreviewAnimation() {
        if (this.previewAnimationId) return;

        const animate = () => {
            this.previewAnimationId = requestAnimationFrame(animate);
            /* @tweakable The rotation speed for models in the bestiary preview. */
            const modelRotationSpeed = 0.01;

            if (this.previewModel) {
                this.previewModel.rotation.y += modelRotationSpeed;
                if (this.previewModel.userData.mixer) {
                    const delta = (performance.now() - (this.previewModel.userData.lastMixerUpdate || performance.now())) / 1000;
                    this.previewModel.userData.mixer.update(delta);
                    this.previewModel.userData.lastMixerUpdate = performance.now();
                }
            }
            if (this.previewRenderer) {
                this.previewRenderer.render(this.previewScene, this.previewCamera);
            }
        };
        animate();
    }

    stopPreviewAnimation() {
        if (this.previewAnimationId) {
            cancelAnimationFrame(this.previewAnimationId);
            this.previewAnimationId = null;
        }
    }
}