import * as THREE from 'three';
import { setYoutubePlayerUrl, getPlayer } from './youtubePlayer.js';

export const OCCLUSION_BUFFER = 1.0;
export const VIDEO_OCCLUSION_CHECK_INTERVAL = 10;
export const VIDEO_AUDIO_UPDATE_INTERVAL = 10;

export class VideoManager {
    constructor(scene, camera, playerModel) {
        this.scene = scene;
        this.camera = camera;
        this.playerModel = playerModel;
        this.videoOcclusionCheckCounter = 0;
        this.videoAudioUpdateCounter = 0;
        this.currentYoutubeUrl = null;
    }

    setPlayerModel(model) {
        this.playerModel = model;
    }

    handleRoomStateChange(roomState) {
        if (roomState && roomState.youtubeUrl && roomState.youtubeUrl !== this.currentYoutubeUrl) {
            this.currentYoutubeUrl = roomState.youtubeUrl;
            setYoutubePlayerUrl(this.currentYoutubeUrl);
        }
    }

    update() {
        this.videoOcclusionCheckCounter++;
        if (this.videoOcclusionCheckCounter >= VIDEO_OCCLUSION_CHECK_INTERVAL) {
            this.videoOcclusionCheckCounter = 0;
            this.checkVideoOcclusion();
        }

        this.videoAudioUpdateCounter++;
        if (this.videoAudioUpdateCounter >= VIDEO_AUDIO_UPDATE_INTERVAL) {
            this.videoAudioUpdateCounter = 0;
            this.updateVideoAudio();
        }
    }

    checkVideoOcclusion() {
        const videoMesh = this.scene.getObjectByName('amphitheatre-video-screen');

        if (videoMesh) {
            const screenCenter = new THREE.Vector3();
            videoMesh.getWorldPosition(screenCenter);

            const cameraPosition = new THREE.Vector3();
            this.camera.getWorldPosition(cameraPosition);

            const direction = screenCenter.clone().sub(cameraPosition).normalize();
            const raycaster = new THREE.Raycaster(cameraPosition, direction);

            const intersects = raycaster.intersectObjects(this.scene.children, true);

            let occluded = false;
            const distanceToScreen = cameraPosition.distanceTo(screenCenter);

            for (const intersect of intersects) {
                if (intersect.object === videoMesh || intersect.object.userData.isPlayer || intersect.object.userData.isGridHelper) {
                    continue;
                }
                if (intersect.distance < distanceToScreen - OCCLUSION_BUFFER) {
                    occluded = true;
                    break;
                }
            }
            if (videoMesh.parent) videoMesh.parent.visible = !occluded;
        }
    }

    updateVideoAudio() {
        const videoMesh = this.scene.getObjectByName('amphitheatre-video-screen');
        const videoEl = getPlayer();

        if (videoMesh && videoEl && this.playerModel) {
            const screenCenter = new THREE.Vector3();
            videoMesh.getWorldPosition(screenCenter);

            const playerPosition = this.playerModel.position;
            const distance = playerPosition.distanceTo(screenCenter);

            const maxAudioDistance = 60;
            const minAudioDistance = 5;

            if (distance < maxAudioDistance && videoMesh.parent && videoMesh.parent.visible) {
                videoEl.muted = false;
                const volume = 1.0 - THREE.MathUtils.smoothstep(distance, minAudioDistance, maxAudioDistance);
                const globalVideoVolume = 0.5;
                videoEl.volume = Math.pow(volume, 2) * globalVideoVolume;
            } else {
                videoEl.volume = 0;
            }
        }
    }
}
