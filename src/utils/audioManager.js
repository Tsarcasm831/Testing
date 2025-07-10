class AudioManager {
  constructor() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.sounds = {};
  }

  loadSound(name, url) {
    fetch(url)
      .then((response) => response.arrayBuffer())
      .then((buffer) => this.audioContext.decodeAudioData(buffer))
      .then((audioBuffer) => {
        this.sounds[name] = audioBuffer;
      });
  }

  playSound(name) {
    const source = this.audioContext.createBufferSource();
    source.buffer = this.sounds[name];
    source.connect(this.audioContext.destination);
    source.start();
  }
}

export default AudioManager;
