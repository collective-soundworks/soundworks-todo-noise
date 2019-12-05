class TriggerSynth {
  constructor(audioContext, frequency) {
    this.audioContext = audioContext;
    this.frequency = frequency;
    this.output = this.audioContext.createGain();
  }

  connect(destination) {
    this.output.connect(destination);
  }

  trigger() {
    const now = this.audioContext.currentTime;

    const env = this.audioContext.createGain();
    env.connect(this.output);
    env.gain.setValueAtTime(0, now);
    env.gain.linearRampToValueAtTime(1, now + 0.01);
    env.gain.exponentialRampToValueAtTime(0.0001, now + 1);

    const sine = this.audioContext.createOscillator();
    sine.connect(env);
    sine.frequency.value = this.frequency;
    sine.start(now);
    sine.stop(now + 1);
  }
}

export default TriggerSynth;
