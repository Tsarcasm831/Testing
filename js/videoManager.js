import * as THREE from 'three';
import { setYoutubePlayerUrl, getPlayer } from './youtubePlayer.js';

export const OCCLUSION_BUFFER = 1.0;
/* @tweakable How many frames to wait between checking if the video screen is occluded. Higher values improve performance. */
export const VIDEO_OCCLUSION_CHECK_INTERVAL = 30;
/* @tweakable How many frames to wait between updating video volume based on distance. Higher values improve performance. */
export const VIDEO_AUDIO_UPDATE_INTERVAL = 20;
/* @tweakable Set to true to hide the video and mute audio when it's blocked by other objects. Set to false to ensure it's always playing. */
const ENABLE_VIDEO_OCCLUSION = false;

/* @tweakable An offset in seconds to adjust lyric timing. Negative values make lyrics appear earlier, positive values make them appear later. */
const LYRIC_TIME_OFFSET = 0;

/* @tweakable The lyrics for the song with timestamps in seconds. */
const defaultLyrics = [
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
    constructor(scene, camera, playerModel, room) {
        this.scene = scene;
        this.camera = camera;
        this.playerModel = playerModel;
        this.room = room;
        this.videoOcclusionCheckCounter = 0;
        this.videoAudioUpdateCounter = 0;
        this.currentYoutubeUrl = null;
        this.currentAudioUrl = null;
        this.currentSongTitle = '';
        this.audioElement = document.createElement('audio');
        this.audioElement.id = 'billboard-audio';
        this.audioElement.loop = true;
        this.audioElement.crossOrigin = 'anonymous';
        this.audioElement.style.display = 'none';
        document.body.appendChild(this.audioElement);
        this.currentLyricIndex = -1;
        this.lyrics = [];
        this.initLyrics();
    }

    async initLyrics() {
        if (!this.room) return;
        const lyricsCollection = this.room.collection('lyrics');
        
        lyricsCollection.subscribe(lyricsData => {
            if (lyricsData && lyricsData.length > 0) {
                // getList is newest first, so we'll take the first one.
                this.lyrics = lyricsData[0].content;
                if (Array.isArray(this.lyrics)) {
                    this.lyrics.sort((a, b) => a.time - b.time);
                } else {
                    this.lyrics = [];
                }
            } else {
                this.lyrics = [];
            }
        });

        const existingLyrics = lyricsCollection.getList();
        // Use a slight delay to ensure subscription has a chance to populate.
        setTimeout(async () => {
            if (this.lyrics.length === 0 && (!existingLyrics || existingLyrics.length === 0)) {
                console.log("No lyrics found in database, creating default set.");
                await lyricsCollection.create({ content: defaultLyrics });
            }
        }, 2000);
    }

    setPlayerModel(model) {
        this.playerModel = model;
    }

    handleRoomStateChange(roomState) {
        if (roomState && Object.prototype.hasOwnProperty.call(roomState, 'billboardAudioUrl')) {
            if (roomState.billboardAudioUrl !== this.currentAudioUrl) {
                this.currentAudioUrl = roomState.billboardAudioUrl;
                this.currentSongTitle = roomState.billboardSongTitle || '';
                if (this.currentAudioUrl) {
                    this.audioElement.src = this.currentAudioUrl;
                    this.audioElement.play().catch(e => console.error('Audio playback error:', e));
                    const videoMesh = this.scene.getObjectByName('amphitheatre-video-screen');
                    if (videoMesh) videoMesh.visible = false;
                } else {
                    this.audioElement.pause();
                    const videoMesh = this.scene.getObjectByName('amphitheatre-video-screen');
                    if (videoMesh) videoMesh.visible = true;
                }
            }
        }
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
        const videoEl = this.currentAudioUrl ? this.audioElement : getPlayer();
        const lyricsCanvas = document.getElementById('lyrics-display');

        if (videoEl && lyricsCanvas && !videoEl.paused && this.lyrics && this.lyrics.length > 0) {
            const currentTime = videoEl.currentTime;
            let newLyricIndex = -1;

            for (let i = 0; i < this.lyrics.length; i++) {
                if (currentTime >= (this.lyrics[i].time + LYRIC_TIME_OFFSET)) {
                    newLyricIndex = i;
                } else {
                    break;
                }
            }
            
            if (newLyricIndex !== this.currentLyricIndex) {
                this.currentLyricIndex = newLyricIndex;
            }
            const firstLyricTime = this.lyrics[0]?.time ?? 0;
            const displayText = this.currentLyricIndex !== -1 ? this.lyrics[this.currentLyricIndex].text :
                (this.currentSongTitle && currentTime < firstLyricTime ? `Now Playing: ${this.currentSongTitle}` : "");
            const ctx = lyricsCanvas.getContext('2d');
            ctx.clearRect(0, 0, lyricsCanvas.width, lyricsCanvas.height);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
            ctx.fillRect(0, 0, lyricsCanvas.width, lyricsCanvas.height);
            ctx.fillStyle = 'white';
            ctx.font = 'bold 64px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(displayText, lyricsCanvas.width / 2, lyricsCanvas.height / 2);
            if (lyricsCanvas.texture) {
                lyricsCanvas.texture.needsUpdate = true;
            }
        }
    }

    updateVideoAudio() {
        const videoMesh = this.scene.getObjectByName('amphitheatre-video-screen');
        const mediaEl = this.currentAudioUrl ? this.audioElement : getPlayer();

        if (videoMesh && mediaEl && this.playerModel) {
            const screenCenter = new THREE.Vector3();
            videoMesh.getWorldPosition(screenCenter);

            const playerPosition = this.playerModel.position;
            const distance = playerPosition.distanceTo(screenCenter);

            const maxAudioDistance = 60;
            const minAudioDistance = 5;

            // Play audio if within range AND (video is visible OR occlusion check is disabled)
            if (distance < maxAudioDistance && (!ENABLE_VIDEO_OCCLUSION || (videoMesh.parent && videoMesh.parent.visible))) {
                mediaEl.muted = false;
                const volume = 1.0 - THREE.MathUtils.smoothstep(distance, minAudioDistance, maxAudioDistance);
                const globalVolume = 0.5;
                mediaEl.volume = Math.pow(volume, 2) * globalVolume;
            } else {
                mediaEl.volume = 0;
            }
        }
    }
}