import * as THREE from 'three';
import { createPlayerModel } from '../playerModel.js';
import { setupAnimatedRobot, setupEyebot, setupAnimatedChicken, setupAnimatedWireframe, setupAnimatedAlien } from '../animationSetup.js';
import { presetCharacters } from '../characters/presets.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
import { NPC } from './NPC.js';
import {
    USE_BOUNDING_BOX_CULLING,
    ROBOT_SPAWN_CHANCE,
    EYEBOT_SPAWN_CHANCE,
    NPC_ADJECTIVES,
    MIN_NPCS_PER_ZONE,
    MAX_NPCS_PER_ZONE,
    ROBOT_NPC_SCALE,
    CHICKEN_NPC_SCALE,
    WIREFRAME_NPC_SCALE,
    ALIEN_NPC_SCALE,
    EYEBOT_NPC_SCALE,
    EYEBOT_FLY_HEIGHT,
    FIX_FRUSTUM_CULLING_BUG
} from './constants.js';
import { ZONE_SIZE } from '../worldGeneration.js';


export class NPCSpawner {
    constructor(scene, terrain) {
        this.scene = scene;
        this.terrain = terrain;
        this.animatedData = {};
        this.npcManager = null;
    }
    
    setAnimatedData(type, data) {
        if (data.model && type === 'robot' && FIX_FRUSTUM_CULLING_BUG) {
             data.model.traverse(c => {
                if (c.type === 'Object3D' && !c.isGroup) {
                    c.isGroup = true;
                }
            });
        }
        
        if (data.model && (type === 'robot' || type === 'eyebot') && USE_BOUNDING_BOX_CULLING) {
            data.model.userData.boundingBox = new THREE.Box3().setFromObject(data.model);
        }
        
        this.animatedData[type] = data;
    }

    spawnNpcsForZone(zoneKey) {
        const [zoneGridX, zoneGridZ] = zoneKey.split(',').map(Number);
        const numNpcs = MIN_NPCS_PER_ZONE + Math.floor(Math.random() * (MAX_NPCS_PER_ZONE - MIN_NPCS_PER_ZONE + 1));
        const zoneNpcs = [];

        for (let i = 0; i < numNpcs; i++) {
            let npcModel;
            let adjective = NPC_ADJECTIVES[Math.floor(Math.random() * NPC_ADJECTIVES.length)];
            let preset;
            let isEyebot = false;

            if (this.animatedData.eyebot && this.animatedData.eyebot.model && Math.random() < EYEBOT_SPAWN_CHANCE) {
                const eyebotData = this.animatedData.eyebot;
                npcModel = eyebotData.model.clone();
                isEyebot = true;
                eyebotData.setupFn(npcModel);
                npcModel.name = `${adjective} Eyebot`;
                npcModel.traverse(c => { c.castShadow = true; });
                npcModel.scale.set(EYEBOT_NPC_SCALE, EYEBOT_NPC_SCALE, EYEBOT_NPC_SCALE);
                preset = { id: 'eyebot' };
            }
            else if (this.animatedData.robot && this.animatedData.robot.model && Math.random() < ROBOT_SPAWN_CHANCE) {
                preset = presetCharacters.find(p => p.id === 'robots');
                const robotData = this.animatedData.robot;
                npcModel = SkeletonUtils.clone(robotData.model);

                if (USE_BOUNDING_BOX_CULLING && robotData.model.userData.boundingBox) {
                    npcModel.userData.boundingBox = new THREE.Box3().setFromObject(npcModel);
                }

                robotData.setupFn(npcModel, robotData.idleClip, robotData.walkClip, robotData.listenClip);
                npcModel.name = `${adjective} Robot`;
                npcModel.traverse(c => { c.castShadow = true; });
                npcModel.scale.set(ROBOT_NPC_SCALE, ROBOT_NPC_SCALE, ROBOT_NPC_SCALE);
            } else if (this.animatedData.wireframe && this.animatedData.wireframe.model && Math.random() < ROBOT_SPAWN_CHANCE) {
                preset = presetCharacters.find(p => p.id === 'wireframe');
                const wireframeData = this.animatedData.wireframe;
                npcModel = SkeletonUtils.clone(wireframeData.model);
                wireframeData.setupFn(npcModel, wireframeData.idleClip, wireframeData.walkClip, wireframeData.runClip, wireframeData.listenClip);
                npcModel.name = `${adjective} Wireframe`;
                npcModel.traverse(c => { c.castShadow = true; });
                npcModel.scale.set(WIREFRAME_NPC_SCALE, WIREFRAME_NPC_SCALE, WIREFRAME_NPC_SCALE);
            } else if (this.animatedData.alien && this.animatedData.alien.model && Math.random() < ROBOT_SPAWN_CHANCE) {
                preset = presetCharacters.find(p => p.id === 'alien');
                const alienData = this.animatedData.alien;
                npcModel = SkeletonUtils.clone(alienData.model);
                alienData.setupFn(npcModel, alienData.idleClip, alienData.walkClip, alienData.runClip, alienData.listenClip);
                npcModel.name = `${adjective} Alien`;
                npcModel.traverse(c => { c.castShadow = true; });
                npcModel.scale.set(ALIEN_NPC_SCALE, ALIEN_NPC_SCALE, ALIEN_NPC_SCALE);
            } else if (this.animatedData.chicken && this.animatedData.chicken.model && Math.random() < ROBOT_SPAWN_CHANCE) {
                preset = presetCharacters.find(p => p.id === 'chicken');
                const chickenData = this.animatedData.chicken;
                npcModel = SkeletonUtils.clone(chickenData.model);
                chickenData.setupFn(npcModel, chickenData.idleClip, chickenData.walkClip, chickenData.runClip, chickenData.alertClip, chickenData.listenClip);
                npcModel.name = `${adjective} Chicken`;
                npcModel.traverse(c => { c.castShadow = true; });
                npcModel.scale.set(CHICKEN_NPC_SCALE, CHICKEN_NPC_SCALE, CHICKEN_NPC_SCALE);
            }
            else {
                let availablePresets = presetCharacters;
                if (this.animatedData.robot) {
                    availablePresets = availablePresets.filter(p => p.id !== 'robots');
                }
                 if (this.animatedData.chicken) {
                    availablePresets = availablePresets.filter(p => p.id !== 'chicken');
                }
                if (this.animatedData.wireframe) {
                    availablePresets = availablePresets.filter(p => p.id !== 'wireframe');
                }
                if (this.animatedData.alien) {
                    availablePresets = availablePresets.filter(p => p.id !== 'alien');
                }
                if (this.animatedData.eyebot) {
                    availablePresets = availablePresets.filter(p => p.id !== 'eyebot');
                }

                if(availablePresets.length === 0) {
                     availablePresets = presetCharacters; // Fallback to all presets if filtering results in an empty list
                }
                
                preset = availablePresets[Math.floor(Math.random() * availablePresets.length)];
                if (!preset) { // Add a guard in case preset is still undefined
                    console.warn("Could not find a suitable NPC preset. Skipping NPC spawn.");
                    continue; 
                }
                const uniqueId = `${preset.name}_${zoneKey}_${i}`;
                npcModel = createPlayerModel(THREE, uniqueId, preset.spec);
                npcModel.name = `${adjective} ${preset.name}`;
            }

            if (!npcModel || !preset) {
                console.warn("Failed to create NPC model or find preset, skipping spawn.", { npcModel, preset });
                continue;
            }

            npcModel.userData.isNpc = true;

            const zoneCenterX = zoneGridX * ZONE_SIZE;
            const zoneCenterZ = zoneGridZ * ZONE_SIZE;
            
            const offsetX = (Math.random() - 0.5) * ZONE_SIZE;
            const offsetZ = (Math.random() - 0.5) * ZONE_SIZE;
            
            const startX = zoneCenterX + offsetX;
            const startZ = zoneCenterZ + offsetZ;
            const startY = this.terrain.userData.getHeight(startX, startZ) + (isEyebot ? EYEBOT_FLY_HEIGHT : 0.2);

            npcModel.position.set(startX, startY, startZ);

            if (isEyebot) {
                npcModel.userData.baseY = startY;
            }

            this.scene.add(npcModel);

            const npc = new NPC(
                npcModel,
                preset.id,
                zoneKey,
                isEyebot,
                npcModel.position.clone(),
                this.terrain
            );
            
            zoneNpcs.push(npc);
        }
        
        return zoneNpcs;
    }

    replaceNpcModels(npcType) {
        if (!this.animatedData[npcType] || !this.npcManager) return;

        const allNpcData = this.npcManager.npcs;
        
        allNpcData.forEach(npc => {
            const isEyebotPreset = npc.presetId === 'eyebot';
            const isTargetType = npc.presetId === npcType;
            /* @tweakable If true, replacing eyebots will also replace NPCs of other types. Set to false to only replace existing eyebots. */
            const shouldReplaceOtherTypesForEyebot = true;

            // Determine if this NPC should be replaced
            let shouldReplace = isTargetType;
            if (npcType === 'eyebot' && shouldReplaceOtherTypesForEyebot && !isEyebotPreset) {
                // When replacing with eyebots, replace other types too if configured
                shouldReplace = true;
            }

            if (!shouldReplace) return;

            this.scene.remove(npc.model);

            let newModel;
            if (npcType === 'eyebot') {
                newModel = this.animatedData.eyebot.model.clone();
                if (USE_BOUNDING_BOX_CULLING && this.animatedData.eyebot.model.userData.boundingBox) {
                    newModel.userData.boundingBox = new THREE.Box3().setFromObject(newModel);
                }
                setupEyebot(newModel);
            } else {
                newModel = SkeletonUtils.clone(this.animatedData[npcType].model);
                if (npcType === 'robot') {
                    if (USE_BOUNDING_BOX_CULLING && this.animatedData.robot.model.userData.boundingBox) {
                        newModel.userData.boundingBox = new THREE.Box3().setFromObject(newModel);
                    }
                    setupAnimatedRobot(newModel, this.animatedData.robot.idleClip, this.animatedData.robot.walkClip, this.animatedData.robot.listenClip);
                } else if (npcType === 'chicken') {
                     setupAnimatedChicken(newModel, this.animatedData.chicken.idleClip, this.animatedData.chicken.walkClip, this.animatedData.chicken.runClip, this.animatedData.chicken.alertClip, this.animatedData.chicken.listenClip);
                } else if (npcType === 'wireframe') {
                    setupAnimatedWireframe(newModel, this.animatedData.wireframe.idleClip, this.animatedData.wireframe.walkClip, this.animatedData.wireframe.runClip, this.animatedData.wireframe.listenClip);
                } else if (npcType === 'alien') {
                    setupAnimatedAlien(newModel, this.animatedData.alien.idleClip, this.animatedData.alien.walkClip, this.animatedData.alien.runClip, this.animatedData.alien.listenClip);
                }
            }
            
            const adjective = NPC_ADJECTIVES[Math.floor(Math.random() * NPC_ADJECTIVES.length)];
            
            let scale;
            switch(npcType) {
                case 'robot': newModel.name = `${adjective} Robot`; scale = ROBOT_NPC_SCALE; break;
                case 'eyebot': newModel.name = `${adjective} Eyebot`; scale = EYEBOT_NPC_SCALE; break;
                case 'chicken': newModel.name = `${adjective} Chicken`; scale = CHICKEN_NPC_SCALE; break;
                case 'wireframe': newModel.name = `${adjective} Wireframe`; scale = WIREFRAME_NPC_SCALE; break;
                case 'alien': newModel.name = `${adjective} Alien`; scale = ALIEN_NPC_SCALE; break;
            }

            newModel.traverse(c => { c.castShadow = true; });
            newModel.scale.set(scale, scale, scale);

            newModel.position.copy(npc.model.position);
            npc.model = newModel;
            
            this.scene.add(newModel);
        });
    }
}