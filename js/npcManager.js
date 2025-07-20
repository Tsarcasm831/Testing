import * as THREE from 'three';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
import { ZoneManager } from './npc/ZoneManager.js';
import { NPCSpawner } from './npc/NPCSpawner.js';
import {
    USE_BOUNDING_BOX_CULLING,
} from './npc/constants.js';

export class NPCManager {
    constructor(scene, terrain, playerControls) {
        this.scene = scene;
        this.terrain = terrain;
        this.playerControls = playerControls;
        this.npcs = [];
        this.lastUpdateTime = 0;
        this.collisionManager = null;
        
        // Spawner is initialized once, and terrain is added later.
        this.npcSpawner = new NPCSpawner(scene, null);
        this.npcSpawner.npcManager = this;
        this.zoneManager = new ZoneManager(
            playerControls,
            (zoneKey) => this.activateZone(zoneKey),
            (zoneKey) => this.deactivateZone(zoneKey)
        );

        this.frustum = new THREE.Frustum();
        this.cameraMatrix = new THREE.Matrix4();
        this.zoneCache = new Map();
    }

    initializeSpawner(terrain) {
        this.terrain = terrain;
        this.npcSpawner.terrain = terrain;
    }

    addNpc(npc) {
        npc.npcManager = this; // Provide reference to manager
        this.npcs.push(npc);
        this.scene.add(npc.model);
    }

    useAnimatedRobots(data, replaceExisting = true) {
        this.npcSpawner.setAnimatedData('robot', data);
        if (replaceExisting) {
            this.npcSpawner.replaceNpcModels('robot');
        }
    }

    useEyebotModels(data, replaceExisting = true) {
        this.npcSpawner.setAnimatedData('eyebot', data);
        if (replaceExisting) {
            this.npcSpawner.replaceNpcModels('eyebot', true);
        }
    }

    useAnimatedWireframes(data, replaceExisting = true) {
        this.npcSpawner.setAnimatedData('wireframe', data);
        if (replaceExisting) {
            this.npcSpawner.replaceNpcModels('wireframe');
        }
    }

    useAnimatedAliens(data, replaceExisting = true) {
        this.npcSpawner.setAnimatedData('alien', data);
        if (replaceExisting) {
            this.npcSpawner.replaceNpcModels('alien');
        }
    }

    useAnimatedShopkeepers(data, replaceExisting = true) {
        this.npcSpawner.setAnimatedData('shopkeeper', data);
        if (replaceExisting) {
            this.npcSpawner.replaceNpcModels('shopkeeper');
        }
    }

    useAnimatedChickens(data, replaceExisting = true) {
        this.npcSpawner.setAnimatedData('chicken', data);
        if (replaceExisting) {
            this.npcSpawner.replaceNpcModels('chicken');
        }
    }

    useAnimatedOgres(data, replaceExisting = true) {
        this.npcSpawner.setAnimatedData('ogre', data);
        if (replaceExisting) {
            this.npcSpawner.replaceNpcModels('ogre');
        }
    }

    activateZone(zoneKey) {
        if (!this.npcSpawner) return; // Don't spawn if spawner isn't ready

        if (this.zoneCache.has(zoneKey)) {
            const cachedNpcs = this.zoneCache.get(zoneKey);
            cachedNpcs.forEach(npc => {
                this.scene.add(npc.model);
                this.npcs.push(npc);
            });
        } else {
            const newNpcs = this.npcSpawner.spawnNpcsForZone(zoneKey);
            this.npcs.push(...newNpcs);
            this.zoneCache.set(zoneKey, newNpcs);
        }
    }

    deactivateZone(zoneKey) {
        const npcsInZone = this.npcs.filter(npc => npc.zoneKey === zoneKey);
        npcsInZone.forEach(npc => {
            this.scene.remove(npc.model);
        });
        this.npcs = this.npcs.filter(npc => npc.zoneKey !== zoneKey);
    }
    
    updatePlayerModel(newSpec, forceRespawn = false) {
        this.npcs.forEach(npc => this.scene.remove(npc.model));
        this.npcs = [];
        this.zoneCache.clear();
        if (forceRespawn) {
            this.zoneManager.reset();
        }
        this.zoneManager.update();
    }
    
    setInteracting(npc, isInteracting) {
        if (!npc) return;
        npc.setInteracting(isInteracting);
    }

    update() {
        this.zoneManager.update();

        const now = performance.now();
        const delta = now - (this.lastUpdateTime || now);
        this.lastUpdateTime = now;
        
        this.cameraMatrix.multiplyMatrices(this.playerControls.camera.projectionMatrix, this.playerControls.camera.matrixWorldInverse);
        this.frustum.setFromProjectionMatrix(this.cameraMatrix);

        const playerModel = this.playerControls.getPlayerModel();

        this.npcs.forEach(npc => {
            if (!npc || !npc.model) return;

            let isVisible;
            const model = npc.model;

            if (USE_BOUNDING_BOX_CULLING && model.userData.boundingBox) {
                /* @tweakable A flag to enable a workaround for a Three.js bug where bounding boxes are not cloned correctly. Set to false if you notice performance issues or upgrade Three.js. */
                const CLONE_BOUNDING_BOX_FIX = true;
                if (CLONE_BOUNDING_BOX_FIX && typeof model.userData.boundingBox.clone !== 'function') {
                     // Bounding box might not be a Box3 instance, recreate it.
                    model.userData.boundingBox = new THREE.Box3().setFromObject(model);
                }

                const tempBox = model.userData.boundingBox.clone();
                tempBox.applyMatrix4(model.matrixWorld);
                isVisible = this.frustum.intersectsBox(tempBox);
            } else {
                if (model.geometry) {
                    isVisible = this.frustum.intersectsObject(model);
                } else if (model.isGroup) {
                    isVisible = true; 
                } else {
                    isVisible = false;
                }
            }
            
            npc.update(delta, isVisible, playerModel);
        });
    }
}