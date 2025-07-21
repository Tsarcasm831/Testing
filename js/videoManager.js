import * as THREE from 'three';
import { setYoutubePlayerUrl, getPlayer } from './youtubePlayer.js';

export const OCCLUSION_BUFFER = 1.0;
export const VIDEO_OCCLUSION_CHECK_INTERVAL = 10;
export const VIDEO_AUDIO_UPDATE_INTERVAL = 10;
/* @tweakable Set to true to hide the video and mute audio when it's blocked by other objects. Set to false to ensure it's always playing. */
const ENABLE_VIDEO_OCCLUSION = false;

/* @tweakable The lyrics for the song with timestamps in seconds. */
const lyrics = [
  { time: 10, text: "I'll be the one" },
  { time: 13, text: "Out in the rain" },
  { time: 16, text: "With all of your heart" },
  { time: 19, text: "And all of your pain" },
  { time: 22, text: "Taking its toll" },
  { time: 25, text: "Day after day" },
  { time: 28, text: "You do what you want" },
  { time: 31, text: "I carry the weight" },
  { time: 34, text: "Breaking my back" },
  { time: 37, text: "To give you a break" },
  { time: 40, text: "No time for breath" },
  { time: 43, text: "No room for mistakes" },
  { time: 46, text: "This isn't fair" },
  { time: 49, text: "Not even ok" },
  { time: 52, text: "But when I speak up" },
  { time: 55, text: "You say" },
  { time: 58, text: "I thought I was dealing with somebody else" },
  { time: 61, text: "Didn't realize that you only thought about yourself" },
  { time: 64, text: "Isn't it ironic? Or can you even tell?" },
  { time: 67, text: "Tables turned would you recognize yourself" },
  { time: 70, text: "I'll be the one" },
  { time: 73, text: "Out in the rain" },
  { time: 76, text: "With all of your heart" },
  { time: 79, text: "And all of your pain" },
  { time: 82, text: "Taking its toll" },
  { time: 85, text: "Day after day" },
  { time: 88, text: "You do what you want" },
  { time: 91, text: "I carry the weight" },
  { time: 94, text: "Yeah I know that you know" },
  { time: 97, text: "The way I love you it all overflows" },
  { time: 100, text: "Using my feelings to keep the control" },
  { time: 103, text: "Let's see how far this goes" },
  { time: 106, text: "I'll be the one" },
  { time: 109, text: "Out in the rain" },
  { time: 112, text: "With all of your heart" },
  { time: 115, text: "And all of your pain" },
  { time: 118, text: "Taking its toll" },
  { time: 121, text: "Day after day" },
  { time: 124, text: "You do what you want" },
  { time: 127, text: "I carry the weight" },
  { time: 130, text: "I thought I was dealing with somebody else" },
  { time: 133, text: "Didn't realize that you only thought about yourself" },
  { time: 136, text: "Isn't it ironic? Or can you even tell?" },
  { time: 139, text: "Tables turned would you recognize yourself" },
  { time: 142, text: "I thought I was dealing with somebody else" },
  { time: 145, text: "Didn't realize that you only thought about yourself" },
  { time: 148, text: "Isn't it ironic? Or can you even tell?" },
  { time: 151, text: "Tables turned would you recognize yourself" },
  { time: 154, text: "I thought I was dealing with somebody else" },
  { time: 157, text: "Didn't realize that you only thought about yourself" },
  { time: 160, text: "Isn't it ironic? Or can you even tell?" },
  { time: 163, text: "Tables turned on yourself" },
  { time: 166, text: "I'll be the one" },
  { time: 169, text: "Out in the rain" },
  { time: 172, text: "With all of your heart" },
  { time: 175, text: "And all of your pain" },
  { time: 178, text: "Taking its toll" },
  { time: 181, text: "Day after day" },
  { time: 184, text: "You do what you want" },
  { time: 187, text: "I carry the weight" },
  { time: 190, text: "Carry the weight" },
  { time: 193, text: "Whoah" },
];

export class VideoManager {
    constructor(scene, camera, playerModel) {
        this.scene = scene;
        this.camera = camera;
        this.playerModel = playerModel;
        this.videoOcclusionCheckCounter = 0;
        this.videoAudioUpdateCounter = 0;
        this.currentYoutubeUrl = null;
        this.currentLyricIndex = -1;
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
            if (ENABLE_VIDEO_OCCLUSION) {
                this.checkVideoOcclusion();
            } else {
                // If occlusion is disabled, ensure the video screen is always visible
                const videoMesh = this.scene.getObjectByName('amphitheatre-video-screen');
                if (videoMesh && videoMesh.parent && !videoMesh.parent.visible) {
                    videoMesh.parent.visible = true;
                }
            }
        }

        this.videoAudioUpdateCounter++;
        if (this.videoAudioUpdateCounter >= VIDEO_AUDIO_UPDATE_INTERVAL) {
            this.videoAudioUpdateCounter = 0;
            this.updateVideoAudio();
            this.updateLyrics();
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

    updateLyrics() {
        const videoEl = getPlayer();
        const lyricsCanvas = document.getElementById('lyrics-display');

        if (videoEl && lyricsCanvas && !videoEl.paused) {
            const currentTime = videoEl.currentTime;
            let newLyricIndex = -1;

            for (let i = 0; i < lyrics.length; i++) {
                if (currentTime >= lyrics[i].time) {
                    newLyricIndex = i;
                } else {
                    break;
                }
            }
            
            if (newLyricIndex !== this.currentLyricIndex) {
                this.currentLyricIndex = newLyricIndex;
                const lyricText = this.currentLyricIndex !== -1 ? lyrics[this.currentLyricIndex].text : "";
                const ctx = lyricsCanvas.getContext('2d');
                ctx.clearRect(0, 0, lyricsCanvas.width, lyricsCanvas.height);
                ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
                ctx.fillRect(0, 0, lyricsCanvas.width, lyricsCanvas.height);
                ctx.fillStyle = 'white';
                ctx.font = 'bold 64px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(lyricText, lyricsCanvas.width / 2, lyricsCanvas.height / 2);
                if (lyricsCanvas.texture) {
                    lyricsCanvas.texture.needsUpdate = true;
                }
            }
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

            // Play audio if within range AND (video is visible OR occlusion check is disabled)
            if (distance < maxAudioDistance && (!ENABLE_VIDEO_OCCLUSION || (videoMesh.parent && videoMesh.parent.visible))) {
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