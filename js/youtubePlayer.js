/*
This file will be created.
*/
let videoElement = null;

export function initYoutubePlayer() {
    // The video element is created in amphitheatre.js and might not exist when this is called.
    // We'll grab it when it's needed.
}

function ensureVideoElement() {
    if (!videoElement) {
        videoElement = document.getElementById('amphitheatre-video');
    }
    return videoElement;
}

export function setYoutubePlayerUrl(url) {
    const video = ensureVideoElement();
    if (video) {
        /* @tweakable The new source URL for the video screen. */
        video.src = url;
    }
}

export function togglePlayPause() {
    const video = ensureVideoElement();
    if (video) {
        if (video.paused) {
            video.play().catch(e => console.error("Video play failed:", e));
        } else {
            video.pause();
        }
    }
}

/* @tweakable The key used to toggle play/pause for the amphitheater video. */
export const togglePlayPauseKey = 'p';

export function getPlayer() {
    return ensureVideoElement();
}