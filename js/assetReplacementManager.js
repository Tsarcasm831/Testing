import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Downloader } from './downloader.js';
import { setupAnimatedPlayer, setupAnimatedRobot, setupAnimatedChicken, setupAnimatedWireframe, setupAnimatedAlien, setupEyebot } from './animationSetup.js';

export class AssetReplacementManager {
    constructor(dependencies) {
        this.dependencies = dependencies;
        this.downloader = new Downloader();
        this.assets = null;
        this.statusElement = null;
        // Optional callback for when the player model is replaced
        this.onPlayerModelReplaced = dependencies.onPlayerModelReplaced || null;

        this.modelTypes = {
            'player': {
                assetNames: ['Player idle animation', 'Player walking animation', 'Player running animation'],
                clipNames: ['idle', 'walk', 'run'],
                setupFn: setupAnimatedPlayer,
                applyFn: (modelData) => this.applyToPlayer(modelData)
            },
            'robot': {
                assetNames: ['Robot idle 2 animation', 'Robot walking animation', 'Robot listening animation'],
                clipNames: ['idle', 'walk', 'listen'],
                setupFn: setupAnimatedRobot,
                applyFn: (modelData) => this.dependencies.npcManager.useAnimatedRobots(modelData)
            },
            'eyebot': {
                assetNames: ['Eyebot model'],
                clipNames: [],
                setupFn: setupEyebot,
                applyFn: (modelData) => this.dependencies.npcManager.useEyebotModels(modelData)
            },
            'chicken': {
                assetNames: ['Chicken Idle Animation', 'Chicken Walking Animation', 'Chicken Running Animation', 'Chicken Alert Animation', 'Chicken Listening Animation'],
                clipNames: ['idle', 'walk', 'run', 'alert', 'listen'],
                setupFn: setupAnimatedChicken,
                applyFn: (modelData) => this.dependencies.npcManager.useAnimatedChickens(modelData)
            },
            'wireframe': {
                assetNames: ['Wireframe Idle Animation', 'Wireframe Walking Animation', 'Wireframe Running Animation', 'Wireframe Listening Animation'],
                clipNames: ['idle', 'walk', 'run', 'listen'],
                setupFn: setupAnimatedWireframe,
                applyFn: (modelData) => this.dependencies.npcManager.useAnimatedWireframes(modelData)
            },
            'alien': {
                assetNames: ['Alien Idle Animation', 'Alien Walking Animation', 'Alien Running Animation', 'Alien Listening Animation'],
                clipNames: ['idle', 'walk', 'run', 'listen'],
                setupFn: setupAnimatedAlien,
                applyFn: (modelData) => this.dependencies.npcManager.useAnimatedAliens(modelData)
            }
        };
    }

    setStatusElement(element) {
        this.statusElement = element;
    }

    updateStatus(message) {
        if (this.statusElement) {
            this.statusElement.textContent = message;
        }
    }

    async downloadExternalAssets() {
        this.updateStatus('Loading asset list...');
        try {
            const response = await fetch('assets.json');
            const data = await response.json();
            const external = data.assets.filter(a => /^https?:/.test(a.url));
            this.assets = await this.downloader.preloadAssets(external, (asset, p) => {
                this.updateStatus(`Downloading ${asset.name} ${(p * 100).toFixed(0)}%`);
            });
            this.updateStatus('All assets downloaded.');
            return true;
        } catch (e) {
            this.updateStatus('Failed to download assets.');
            console.error(e);
            return false;
        }
    }

    /* @tweakable Delay in milliseconds between replacing each model type when using 'Use All'. */
    static allAssetsReplacementDelay = 200;

    async replaceAllModels() {
        if (!this.assets) {
            this.updateStatus('Please download assets first.');
            return;
        }

        this.updateStatus('Replacing all models...');

        for (const type in this.modelTypes) {
            if (type === 'player') continue;
            const modelInfo = this.modelTypes[type];
            if(this.dependencies.npcManager[`useAnimated${type.charAt(0).toUpperCase() + type.slice(1)}s`]){
                 this.dependencies.npcManager[`useAnimated${type.charAt(0).toUpperCase() + type.slice(1)}s`]({}, false); // Clear existing
            } else if(this.dependencies.npcManager[`use${type.charAt(0).toUpperCase() + type.slice(1)}Models`]) {
                this.dependencies.npcManager[`use${type.charAt(0).toUpperCase() + type.slice(1)}Models`]({}, false); // Clear existing
            }
        }

        for (const type of Object.keys(this.modelTypes)) {
            await this.replaceModel(type, false);
            await new Promise(resolve => setTimeout(resolve, AssetReplacementManager.allAssetsReplacementDelay));
        }
        
        // After all models are loaded and set, respawn NPCs
        this.dependencies.npcManager.updatePlayerModel(null, true);

        this.updateStatus('All models have been replaced.');
    }

    async replaceModel(type, respawnNpcs = true) {
        const modelInfo = this.modelTypes[type];
        if (!modelInfo) {
            console.error(`Unknown model type: ${type}`);
            return;
        }
        
        if (!this.assets) {
            this.updateStatus('Please download assets first.');
            return;
        }

        const requiredAssets = {};
        for (const name of modelInfo.assetNames) {
            if (!this.assets[name]) {
                this.updateStatus(`${name} asset missing.`);
                console.error(`${name} asset is missing.`);
                return;
            }
            requiredAssets[name] = this.assets[name];
        }

        this.updateStatus(`Loading ${type} model...`);

        const loader = new GLTFLoader();
        const assetUrls = Object.values(requiredAssets).map(asset => URL.createObjectURL(asset));

        try {
            const gltfResults = await Promise.all(assetUrls.map(url => loader.loadAsync(url)));

            const model = gltfResults[0].scene;
            const animations = gltfResults.map(gltf => gltf.animations[0]).filter(Boolean);

            let modelData = { model, setupFn: modelInfo.setupFn };
            if (modelInfo.clipNames && modelInfo.clipNames.length > 0) {
                animations.forEach((clip, index) => {
                    const clipName = modelInfo.clipNames[index];
                    if (clipName) {
                        modelData[`${clipName}Clip`] = clip;
                    }
                });
            }

            if (type === 'player') {
                modelInfo.applyFn(modelData);
            } else if (modelInfo.applyFn) {
                // Pass respawnNpcs flag to NPC replacement methods
                modelInfo.applyFn(modelData, respawnNpcs);
            }

            this.updateStatus(`${type.charAt(0).toUpperCase() + type.slice(1)} model applied.`);
        } catch (error) {
            console.error(`Error loading ${type} model:`, error);
            this.updateStatus(`Failed to load ${type} model.`);
        } finally {
            assetUrls.forEach(url => URL.revokeObjectURL(url));
        }
    }

    applyToPlayer(modelData) {
        const { model, setupFn } = modelData;
        const scene = this.dependencies.playerControls.scene;
        const controls = this.dependencies.playerControls;

        if (scene && controls) {
            if (controls.playerModel) {
                scene.remove(controls.playerModel);
            }
            
            if (setupFn) {
                const modelInfo = this.modelTypes['player'];
                const clips = modelInfo.clipNames.map(name => modelData[`${name}Clip`]);
                setupFn(model, ...clips);
            }

            model.traverse(c => { c.castShadow = true; });
            scene.add(model);
            controls.playerModel = model;
            controls.playerModel.userData.isGLB = true;
            controls.currentAction = 'idle';
            if (this.onPlayerModelReplaced) {
                this.onPlayerModelReplaced(model);
            }
        }
    }
}