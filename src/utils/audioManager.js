class AudioManager {
  constructor() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.listener = this.audioContext.listener;
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

  playSpatialSound(name, position) {
    const source = this.audioContext.createBufferSource();
    source.buffer = this.sounds[name];
    const panner = this.audioContext.createPanner();
    panner.setPosition(position.x, position.y, position.z);
    source.connect(panner).connect(this.audioContext.destination);
    source.start();
  }

  updateListener(position) {
    this.listener.setPosition(position.x, position.y, position.z);
  }
}

export default AudioManager;
