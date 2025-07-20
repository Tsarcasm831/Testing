/*
This file will be created.
*/
let player;
let isPlayerReady = false;
let currentVideoId = null;
let videoElement;

export function initYoutubePlayer() {
    // This no longer initializes the YouTube IFrame API
    // It will be used to manage the video element for the VideoTexture
    videoElement = document.querySelector('video'); // Assuming the video element is already created
}

export function setYoutubePlayerUrl(url) {
    if (videoElement) {
        /* @tweakable The new source URL for the video screen. */
        videoElement.src = url;
        videoElement.play().catch(e => console.error("Failed to play new video:", e));
    }
}

export function togglePlayPause() {
    if (videoElement) {
        if (videoElement.paused) {
            videoElement.play();
        } else {
            videoElement.pause();
        }
    }
}

export const togglePlayPauseKey = 'p';

export function getPlayer() {
    return videoElement;
}