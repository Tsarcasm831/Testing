import * as THREE from 'three';
import { setYoutubePlayerUrl, getPlayer } from './youtubePlayer.js';

export const OCCLUSION_BUFFER = 1.0;
export const VIDEO_OCCLUSION_CHECK_INTERVAL = 10;
export const VIDEO_AUDIO_UPDATE_INTERVAL = 10;
/* @tweakable Set to true to hide the video and mute audio when it's blocked by other objects. Set to false to ensure it's always playing. */
const ENABLE_VIDEO_OCCLUSION = false;

/* @tweakable The lyrics for the song with timestamps in seconds. */
const lyrics = [
  { time: 10, text: "I pulled into Nazareth, I was feelin' about half past dead" },
  { time: 15, text: "I just need some place where I can lay my head" },
  { time: 20, text: "'Hey, mister, can you tell me where a man might find a bed?'" },
  { time: 25, text: "He just grinned and shook my hand, and 'No' was all he said" },
  { time: 31, text: "" },
  { time: 32, text: "Take a load off, Fanny" },
  { time: 35, text: "Take a load for free" },
  { time: 37, text: "Take a load off, Fanny" },
  { time: 40, text: "And you can put the load right on me" },
  { time: 44, text: "" },
  { time: 45, text: "I picked up my bag, I went lookin' for a place to hide" },
  { time: 50, text: "When I saw Carmen and the Devil walkin' side by side" },
  { time: 55, text: "I said, 'Hey, Carmen, come on, let's go downtown'" },
  { time: 60, text: "She said, 'I gotta go, but my friend can stick around'" },
  { time: 66, text: "" },
  { time: 67, text: "Take a load off, Fanny" },
  { time: 70, text: "Take a load for free" },
  { time: 72, text: "Take a load off, Fanny" },
  { time: 75, text: "And you can put the load right on me" },
  { time: 79, text: "" },
  { time: 80, text: "Go down, Miss Moses, there's nothin' you can say" },
  { time: 85, text: "It's just ol' Luke, and Luke's waitin' on the Judgment Day" },
  { time: 90, text: "'Well, Luke, my friend, what about young Anna Lee?'" },
  { time: 95, text: "He said, 'Do me a favor, son, won't you stay and keep Anna Lee company?'" },
  { time: 101, text: "" },
  { time: 102, text: "Take a load off, Fanny" },
  { time: 105, text: "Take a load for free" },
  { time: 107, text: "Take a load off, Fanny" },
  { time: 110, text: "And you can put the load right on me" },
  { time: 114, text: "" },
  { time: 115, text: "Crazy Chester followed me, and he caught me in the fog" },
  { time: 120, text: "He said, 'I will fix your rack, if you'll take Jack, my dog'" },
  { time: 125, text: "I said, 'Wait a minute, Chester, you know I'm a peaceful man'" },
  { time: 130, text: "He said, 'That's okay, boy, won't you feed him when you can'" },
  { time: 136, text: "" },
  { time: 137, text: "Take a load off, Fanny" },
  { time: 140, text: "Take a load for free" },
  { time: 142, text: "Take a load off, Fanny" },
  { time: 145, text: "And you can put the load right on me" },
  { time: 151, text: "" },
  { time: 153, text: "Catch a cannonball now to take me down the line" },
  { time: 158, text: "My bag is sinkin' low and I do believe it's time" },
  { time: 163, text: "To get back to Miss Fanny, you know she's the only one" },
  { time: 168, text: "Who sent me here with her regards for everyone" },
  { time: 174, text: "" },
  { time: 175, text: "Take a load off, Fanny" },
  { time: 178, text: "Take a load for free" },
  { time: 180, text: "Take a load off, Fanny" },
  { time: 183, text: "And you can put the load right on me" },
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
        const lyricsDisplay = document.getElementById('lyrics-display');

        if (videoEl && lyricsDisplay && !videoEl.paused) {
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
                const span = lyricsDisplay.querySelector('span');
                if (span) {
                    span.textContent = lyricText;
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