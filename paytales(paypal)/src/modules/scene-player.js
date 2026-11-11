// PayTales: Narrative Scene Player with Auto-Advance, Line Stagger, and Speech Narration
import { sounds } from "./sound-effects.js";

export class ScenePlayer {
  constructor(containerElement, onSceneChange) {
    this.container = containerElement;
    this.onSceneChange = onSceneChange;
    this.scenes = [];
    this.currentIndex = 0;
    this.isPlaying = false;
    this.intervalId = null;
    this.progressFrame = null;
    this.durationPerScene = 7500; // 7.5 seconds per scene for comfortable reading
    this.startTime = 0;
    this.synth = window.speechSynthesis || null;
    this.isSpeaking = false;
  }

  loadScenes(scenes) {
    this.stop();
    this.scenes = Array.isArray(scenes) && scenes.length > 0 ? scenes : ["A story waiting to be told..."];
    this.currentIndex = 0;
    this.renderCurrentScene();
  }

  renderCurrentScene() {
    if (!this.container) return;

    const sceneText = this.scenes[this.currentIndex] || "";
    // Break into lines for staggered animation
    const lines = sceneText.split("\n").filter((l) => l.trim().length > 0);

    const linesHtml = lines
      .map(
        (line, idx) => `
        <p class="scene-line" style="animation-delay: ${idx * 0.45}s">
          ${line}
        </p>
      `
      )
      .join("");

    this.container.innerHTML = `
      <div class="scene-content-box" key="scene-${this.currentIndex}">
        <div class="scene-counter-badge">
          <span class="pulse-dot"></span>
          Scene ${this.currentIndex + 1} of ${this.scenes.length}
        </div>

        <div class="scene-lines">
          ${linesHtml}
        </div>
      </div>
    `;

    // Speak narration if enabled
    if (this.isSpeaking) {
      this.speakText(sceneText);
    }

    if (this.onSceneChange) {
      this.onSceneChange(this.currentIndex, this.scenes.length);
    }
  }

  play() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.startTime = performance.now();
    this.runProgressLoop();
  }

  pause() {
    this.isPlaying = false;
    if (this.progressFrame) {
      cancelAnimationFrame(this.progressFrame);
      this.progressFrame = null;
    }
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
    return this.isPlaying;
  }

  nextScene() {
    if (this.currentIndex < this.scenes.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0; // Loop or end
    }
    this.startTime = performance.now();
    this.renderCurrentScene();
    sounds.playPageTurn();
  }

  prevScene() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.scenes.length - 1;
    }
    this.startTime = performance.now();
    this.renderCurrentScene();
    sounds.playPageTurn();
  }

  goToScene(index) {
    if (index >= 0 && index < this.scenes.length) {
      this.currentIndex = index;
      this.startTime = performance.now();
      this.renderCurrentScene();
    }
  }

  runProgressLoop() {
    if (!this.isPlaying) return;

    const now = performance.now();
    const elapsed = now - this.startTime;
    const progress = Math.min(1, elapsed / this.durationPerScene);

    const progressBar = document.getElementById("sceneProgressBar");
    if (progressBar) {
      progressBar.style.width = `${progress * 100}%`;
    }

    if (elapsed >= this.durationPerScene) {
      this.nextScene();
      this.startTime = performance.now();
    }

    this.progressFrame = requestAnimationFrame(() => this.runProgressLoop());
  }

  stop() {
    this.pause();
    if (this.synth) {
      this.synth.cancel();
    }
    const progressBar = document.getElementById("sceneProgressBar");
    if (progressBar) {
      progressBar.style.width = "0%";
    }
  }

  toggleNarrationVoice() {
    this.isSpeaking = !this.isSpeaking;
    if (!this.isSpeaking) {
      if (this.synth) this.synth.cancel();
    } else {
      const currentText = this.scenes[this.currentIndex] || "";
      this.speakText(currentText);
    }
    return this.isSpeaking;
  }

  speakText(text) {
    if (!this.synth) return;
    this.synth.cancel();
    const cleanText = text.replace(/\n/g, " ");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.92;
    utterance.pitch = 1.0;
    // Try to find a warm natural English voice
    const voices = this.synth.getVoices();
    const warmVoice = voices.find(
      (v) => (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Samantha")) && v.lang.startsWith("en")
    );
    if (warmVoice) utterance.voice = warmVoice;

    this.synth.speak(utterance);
  }
}
