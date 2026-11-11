// PayTales: Procedural Web Audio Sound Engine (Zero external audio file dependencies)
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.ambientPlaying = false;
    this.ambientNodes = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted && this.ambientPlaying) {
      this.stopAmbient();
    }
    return this.muted;
  }

  // Realistic paper leaf turn sound
  playPageTurn() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const duration = 0.35;
      const bufferSize = this.ctx.sampleRate * duration;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Filtered noise with brownian-like decay
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        lastOut = (lastOut + 0.02 * white) / 1.02;
        // Apply envelope (swish sound)
        const t = i / bufferSize;
        const envelope = Math.sin(t * Math.PI) * Math.pow(1 - t, 0.4);
        data[i] = lastOut * 3.5 * envelope;
      }

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = buffer;

      // Bandpass filter to emulate parchment paper texture
      const bandpass = this.ctx.createBiquadFilter();
      bandpass.type = "bandpass";
      bandpass.frequency.setValueAtTime(1200, this.ctx.currentTime);
      bandpass.frequency.exponentialRampToValueAtTime(450, this.ctx.currentTime + duration);
      bandpass.Q.setValueAtTime(1.8, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.28, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      noiseSource.connect(bandpass);
      bandpass.connect(gain);
      gain.connect(this.ctx.destination);

      noiseSource.start();
    } catch (e) {
      console.debug("Audio error:", e);
    }
  }

  // Leather book opening creak & whoosh
  playBookOpen() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.35);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.7);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.8);

      // Accompany with paper whoosh
      setTimeout(() => this.playPageTurn(), 100);
    } catch (e) {
      console.debug("Audio error:", e);
    }
  }

  // Celebratory golden micro-donation chime (celestial chords)
  playDonationChime() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const pitches = [523.25, 659.25, 783.99, 1046.5, 1318.51]; // C5, E5, G5, C6, E6
      pitches.forEach((freq, idx) => {
        const startTime = this.ctx.currentTime + idx * 0.08;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.15 / (idx + 1), startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 1.3);
      });
    } catch (e) {
      console.debug("Audio error:", e);
    }
  }

  // Toggle ambient peaceful rain/wind soundscape
  toggleAmbient() {
    if (this.ambientPlaying) {
      this.stopAmbient();
      return false;
    } else {
      this.startAmbient();
      return true;
    }
  }

  startAmbient() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const duration = 2.0;
      const bufferSize = this.ctx.sampleRate * duration;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Pinkish soothing rain/wind noise
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
        b6 = white * 0.115926;
      }

      const source = this.ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(600, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 1.5);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      source.start();
      this.ambientNodes = { source, gain, filter };
      this.ambientPlaying = true;
    } catch (e) {
      console.debug("Ambient error:", e);
    }
  }

  stopAmbient() {
    if (this.ambientNodes && this.ambientPlaying) {
      try {
        const { gain, source } = this.ambientNodes;
        gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);
        setTimeout(() => {
          try {
            source.stop();
          } catch (e) {}
        }, 900);
      } catch (e) {}
    }
    this.ambientPlaying = false;
    this.ambientNodes = null;
  }
}

export const sounds = new SoundEngine();
