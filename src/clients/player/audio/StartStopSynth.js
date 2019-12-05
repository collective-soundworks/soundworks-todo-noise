class StartStopSynth {
  constructor(audioContext, buffer) {
    this.audioContext = audioContext;
    this.buffer = buffer;
    this.output = this.audioContext.createGain();

    this.src = null;
  }

  connect(destination) {
    this.output.connect(destination);
  }

  start() {
    if (!this.src) {
      this.src = this.audioContext.createBufferSource();
      this.src.connect(this.output);
      this.src.buffer = this.buffer;
      this.src.loop = true;
      this.src.start();
    }
  }

  stop() {
    if (this.src) {
      this.src.stop();
      this.src = null;
    }
  }
}

export default StartStopSynth;
