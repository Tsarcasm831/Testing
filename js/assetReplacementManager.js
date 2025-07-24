import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Downloader } from './downloader.js';
import { setupAnimatedPlayer, setupAnimatedRobot, setupAnimatedChicken, setupAnimatedWireframe, setupAnimatedAlien, setupEyebot, setupAnimatedShopkeeper, setupAnimatedOgre, setupAnimatedKnight, setupAnimatedSprite } from './animationSetup.js';

export class AssetReplacementManager {
    /* @tweakable The number of models to parse in parallel. Higher values may be faster but use more memory and CPU. */
    static parallelModelLoads = 5;

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
            },
            'shopkeeper': {
                assetNames: ['Shopkeeper Idle 02 Animation', 'Shopkeeper Walking Animation', 'Shopkeeper Listening Gesture Animation'],
                clipNames: ['idle', 'walk', 'listen'],
                setupFn: setupAnimatedShopkeeper,
                applyFn: (modelData) => this.dependencies.npcManager.useAnimatedShopkeepers(modelData)
            },
            "sprite": {
                assetNames: ["Sprite Idle Animation", "Sprite Walking Animation", "Sprite Running Animation", "Sprite Listening Animation"],
                clipNames: ["idle", "walk", "run", "listen"],
                setupFn: setupAnimatedSprite,
                applyFn: (modelData) => this.dependencies.npcManager.useAnimatedSprites(modelData)
            },
            'ogre': {
                assetNames: ['Ogre Idle Animation', 'Ogre Walking Animation', 'Ogre Running Animation', 'Ogre Listening Animation'],
                clipNames: ['idle', 'walk', 'run', 'listen'],
                setupFn: setupAnimatedOgre,
                applyFn: (modelData) => this.dependencies.npcManager.useAnimatedOgres(modelData)
            },
            'knight': {
                assetNames: ['Knight Idle Animation', 'Knight Walking Animation', 'Knight Running Animation', 'Knight Listening Animation'],
                clipNames: ['idle', 'walk', 'run', 'listen'],
                setupFn: setupAnimatedKnight,
                applyFn: (modelData) => this.dependencies.npcManager.useAnimatedKnights(modelData)
            }
        };
    }

    async preloadAndApplyPlayerModel() {
        this.updateStatus('Loading special player model...');
        try {
            const response = await fetch('assets.json');
            const data = await response.json();
            const playerAssetNames = this.modelTypes['player'].assetNames;
            const playerAssetsToDownload = data.assets.filter(a => playerAssetNames.includes(a.name));

            if (playerAssetsToDownload.length !== playerAssetNames.length) {
                console.error("Missing some player assets in assets.json");
                this.updateStatus('Failed to load player assets.');
                return;
            }

            const downloadedAssets = await this.downloader.preloadAssets(playerAssetsToDownload, null, (progress) => {
                 this.updateStatus(`Downloading player model... ${(progress * 100).toFixed(0)}%`, progress);
            });
            this.assets = { ...(this.assets || {}), ...downloadedAssets };

            const modelData = await this.prepareModelData('player');
            if (modelData) {
                this.applyToPlayer(modelData);
                this.updateStatus('Player model loaded.');
            } else {
                throw new Error("Failed to prepare player model data");
            }
        } catch (e) {
            this.updateStatus('Failed to load player model.');
            console.error(e);
        }
    }

    setStatusElement(element) {
        this.statusElement = element;
    }

    updateStatus(message, progress = null) {
        if (this.statusElement) {
            if (progress !== null) {
                 this.statusElement.innerHTML = `
                    <div style="margin-bottom: 5px;">${message}</div>
                    <div class="options-progress-bar-container">
                        <div class="options-progress-bar" style="width: ${progress * 100}%"></div>
                    </div>
                `;
            } else {
                this.statusElement.innerHTML = message;
            }
        }
    }

    async downloadExternalAssets() {
        this.updateStatus('Loading asset list...');
        try {
            const response = await fetch('assets.json');
            const data = await response.json();
            const external = data.assets.filter(a => /^https?:/.test(a.url));
            this.assets = await this.downloader.preloadAssets(external, 
                (asset, p) => {
                    // Per-asset progress callback (optional, currently unused to avoid spam)
                },
                (overallProgress) => {
                    // Overall progress callback
                    const percent = (overallProgress * 100).toFixed(0);
                    this.updateStatus(`Downloading assets... ${percent}%`, overallProgress);
                }
            );
            this.updateStatus('All assets downloaded.');
            return true;
        } catch (e) {
            this.updateStatus('Failed to download assets.');
            console.error(e);
            return false;
        }
    }

    async prepareModelData(type) {
        const modelInfo = this.modelTypes[type];
        if (!modelInfo) {
            console.error(`Unknown model type: ${type}`);
            return null;
        }

        if (!this.assets) {
            return null;
        }

        const requiredAssets = {};
        for (const name of modelInfo.assetNames) {
            if (!this.assets[name]) {
                this.updateStatus(`${name} asset missing.`);
                console.error(`${name} asset is missing.`);
                return null;
            }
            requiredAssets[name] = this.assets[name];
        }

        const loader = new GLTFLoader();
        const assetUrls = Object.values(requiredAssets).map(asset => URL.createObjectURL(asset));

        try {
            const gltfResults = await Promise.all(assetUrls.map(url => loader.loadAsync(url)));

            const model = gltfResults[0].scene;
            const animations = gltfResults.map(gltf => gltf.animations[0]).filter(Boolean);

            let modelData = { type, model, setupFn: modelInfo.setupFn };
            if (modelInfo.clipNames && modelInfo.clipNames.length > 0) {
                animations.forEach((clip, index) => {
                    const clipName = modelInfo.clipNames[index];
                    if (clipName) {
                        modelData[`${clipName}Clip`] = clip;
                    }
                });
            }
            return modelData;
        } catch (error) {
            console.error(`Error loading ${type} model:`, error);
            this.updateStatus(`Failed to load ${type} model.`);
            return null;
        } finally {
            assetUrls.forEach(url => URL.revokeObjectURL(url));
        }
    }

    async replaceAllModels() {
        if (!this.assets) {
            this.updateStatus('Please download assets first.');
            return;
        }

        this.updateStatus('Replacing all models...', 0);

        this.dependencies.npcManager.updatePlayerModel(null, true);

        const modelTypes = Object.keys(this.modelTypes);
        const queue = [...modelTypes];
        const results = [];
        let loadedCount = 0;

        const worker = async () => {
            while (queue.length > 0) {
                const type = queue.shift();
                if (type) {
                    const modelData = await this.prepareModelData(type);
                    if (modelData) {
                        results.push(modelData);
                    }
                    loadedCount++;
                    const progress = loadedCount / modelTypes.length;
                    this.updateStatus(`Loading models... ${(progress * 100).toFixed(0)}%`, progress);
                }
            }
        };

        const workers = [];
        const numWorkers = Math.min(AssetReplacementManager.parallelModelLoads, modelTypes.length);
        for (let i = 0; i < numWorkers; i++) {
            workers.push(worker());
        }
        await Promise.all(workers);

        this.updateStatus('Applying models...');
        
        const allModelData = results.filter(data => data !== null);
        
        allModelData.forEach(modelData => {
            const { type } = modelData;
            const modelInfo = this.modelTypes[type];
    
            if (type === 'player') {
                modelInfo.applyFn(modelData);
            } else if (modelInfo.applyFn) {
                modelInfo.applyFn(modelData, false);
            }
        });
        
        this.dependencies.npcManager.updatePlayerModel(null, true);

        this.updateStatus('All models have been replaced.');
    }

    async replaceModel(type, respawnNpcs = true) {
        if (!this.assets) {
            this.updateStatus('Please download assets first.');
            return;
        }
        
        this.updateStatus(`Loading ${type} model...`);
        const modelData = await this.prepareModelData(type);

        if (modelData) {
            const modelInfo = this.modelTypes[type];
            if (type === 'player') {
                modelInfo.applyFn(modelData);
            } else if (modelInfo.applyFn) {
                modelInfo.applyFn(modelData, respawnNpcs);
            }
            this.updateStatus(`${type.charAt(0).toUpperCase() + type.slice(1)} model applied.`);
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