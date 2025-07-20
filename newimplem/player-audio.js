export class PlayerAudio {
    constructor(loadedAssets) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.footstepSoundBuffer = loadedAssets.footstep;
        this.windSoundBuffer = loadedAssets.wind;
        this.footstepTimer = 0;
    }

    resumeContext() {
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    playFootstepSound() {
        if (!this.footstepSoundBuffer || this.audioContext.state === 'suspended') return;
        
        const source = this.audioContext.createBufferSource();
        source.buffer = this.footstepSoundBuffer;
        
        const gainNode = this.audioContext.createGain();
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        
        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        source.start(0);
    }

    playWindSound() {
        if (!this.windSoundBuffer || this.audioContext.state === 'suspended') return;
        
        const source = this.audioContext.createBufferSource();
        source.buffer = this.windSoundBuffer;
        source.loop = true;
        
        const gainNode = this.audioContext.createGain();
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        
        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        source.start(0);
    }
}