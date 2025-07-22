import * as THREE from 'three';
import { setYoutubePlayerUrl, getPlayer } from './youtubePlayer.js';

export const OCCLUSION_BUFFER = 1.0;
export const VIDEO_OCCLUSION_CHECK_INTERVAL = 10;
export const VIDEO_AUDIO_UPDATE_INTERVAL = 10;
/* @tweakable Set to true to hide the video and mute audio when it's blocked by other objects. Set to false to ensure it's always playing. */
const ENABLE_VIDEO_OCCLUSION = false;

/* @tweakable An offset in seconds to adjust lyric timing. Negative values make lyrics appear earlier, positive values make them appear later. */
const LYRIC_TIME_OFFSET = 0;

/* @tweakable The lyrics for the song with timestamps in seconds. */
const lyrics = [
  { time: 2, text: "I'll be the one" },
  { time: 5, text: "Out in the rain" },
  { time: 8, text: "With all of your heart" },
  { time: 11, text: "And all of your pain" },
  { time: 14, text: "Taking its toll" },
  { time: 17, text: "Day after day" },
  { time: 20, text: "You do what you want" },
  { time: 23, text: "I carry the weight" },
  { time: 26, text: "Breaking my back" },
  { time: 29, text: "To give you a break" },
  { time: 32, text: "No time for breath" },
  { time: 35, text: "No room for mistakes" },
  { time: 38, text: "This isn't fair" },
  { time: 41, text: "Not even ok" },
  { time: 44, text: "But when I speak up" },
  { time: 47, text: "You say" },
  { time: 50, text: "I thought I was dealing with somebody else" },
  { time: 53, text: "Didn't realize that you only thought about yourself" },
  { time: 56, text: "Isn't it ironic? Or can you even tell?" },
  { time: 59, text: "Tables turned would you recognize yourself" },
  { time: 62, text: "I'll be the one" },
  { time: 65, text: "Out in the rain" },
  { time: 68, text: "With all of your heart" },
  { time: 71, text: "And all of your pain" },
  { time: 74, text: "Taking its toll" },
  { time: 77, text: "Day after day" },
  { time: 80, text: "You do what you want" },
  { time: 83, text: "I carry the weight" },
  { time: 86, text: "Yeah I know that you know" },
  { time: 89, text: "The way I love you it all overflows" },
  { time: 92, text: "Using my feelings to keep the control" },
  { time: 95, text: "Let's see how far this goes" },
  { time: 98, text: "I'll be the one" },
  { time: 101, text: "Out in the rain" },
  { time: 104, text: "With all of your heart" },
  { time: 107, text: "And all of your pain" },
  { time: 110, text: "Taking its toll" },
  { time: 113, text: "Day after day" },
  { time: 116, text: "You do what you want" },
  { time: 119, text: "I carry the weight" },
  { time: 122, text: "I thought I was dealing with somebody else" },
  { time: 125, text: "Didn't realize that you only thought about yourself" },
  { time: 128, text: "Isn't it ironic? Or can you even tell?" },
  { time: 131, text: "Tables turned would you recognize yourself" },
  { time: 134, text: "I thought I was dealing with somebody else" },
  { time: 137, text: "Didn't realize that you only thought about yourself" },
  { time: 140, text: "Isn't it ironic? Or can you even tell?" },
  { time: 143, text: "Tables turned would you recognize yourself" },
  { time: 146, text: "I thought I was dealing with somebody else" },
  { time: 149, text: "Didn't realize that you only thought about yourself" },
  { time: 152, text: "Isn't it ironic? Or can you even tell?" },
  { time: 155, text: "Tables turned on yourself" },
  { time: 158, text: "I'll be the one" },
  { time: 161, text: "Out in the rain" },
  { time: 164, text: "With all of your heart" },
  { time: 167, text: "And all of your pain" },
  { time: 170, text: "Taking its toll" },
  { time: 173, text: "Day after day" },
  { time: 176, text: "You do what you want" },
  { time: 179, text: "I carry the weight" },
  { time: 182, text: "Carry the weight" },
  { time: 185, text: "Whoah" },
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
                if (currentTime >= (lyrics[i].time + LYRIC_TIME_OFFSET)) {
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