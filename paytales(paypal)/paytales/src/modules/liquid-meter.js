// PayTales: Circular Liquid Progress Meter Component (#meter)
export class LiquidMeter {
  constructor(containerElement) {
    this.container = containerElement;
    this.currentPercent = 0;
    this.targetPercent = 0;
    this.animationFrame = null;
    this.render();
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="liquid-vessel" title="Funded Progress Vessel">
        <!-- Vintage Brass Bezel Rim -->
        <div class="vessel-rim">
          <div class="vessel-ticks"></div>
        </div>

        <!-- Glass Container -->
        <div class="vessel-glass">
          <!-- Glass highlight reflection -->
          <div class="glass-reflection"></div>

          <!-- Animated SVG Liquid Waves -->
          <svg class="liquid-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="liquidGradBack" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#2a9d8f" stop-opacity="0.55" />
                <stop offset="100%" stop-color="#0a3d42" stop-opacity="0.85" />
              </linearGradient>
              <linearGradient id="liquidGradFront" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#48cae4" stop-opacity="0.85" />
                <stop offset="40%" stop-color="#2a9d8f" stop-opacity="0.95" />
                <stop offset="100%" stop-color="#0e6a6a" stop-opacity="0.98" />
              </linearGradient>
            </defs>

            <!-- Back Wave (Slower, offset) -->
            <path id="waveBack" class="wave wave-back" fill="url(#liquidGradBack)" d="" />

            <!-- Front Wave (Dynamic slosh) -->
            <path id="waveFront" class="wave wave-front" fill="url(#liquidGradFront)" d="" />
          </svg>

          <!-- Floating micro-bubbles -->
          <div class="bubbles-container">
            <span class="bubble b1"></span>
            <span class="bubble b2"></span>
            <span class="bubble b3"></span>
            <span class="bubble b4"></span>
          </div>

          <!-- Inner Metric Typography Overlay -->
          <div class="vessel-content">
            <div class="percent-val" id="meterPercent">0%</div>
            <div class="percent-label" id="meterLabel">FUNDED</div>
            <div class="amount-sub" id="meterSub">$0 of $0</div>
          </div>
        </div>
      </div>
    `;

    this.percentEl = this.container.querySelector("#meterPercent");
    this.labelEl = this.container.querySelector("#meterLabel");
    this.subEl = this.container.querySelector("#meterSub");
    this.waveFront = this.container.querySelector("#waveFront");
    this.waveBack = this.container.querySelector("#waveBack");
  }

  update(raised, goal) {
    const r = Math.max(0, Number(raised) || 0);
    const g = Math.max(1, Number(goal) || 1);
    const rawPercent = (r / g) * 100;
    const clampedPercent = Math.min(100, Math.round(rawPercent));

    this.targetPercent = clampedPercent;
    this.raised = r;
    this.goal = g;

    this.animateToPercent(clampedPercent);

    if (this.subEl) {
      this.subEl.textContent = `$${r.toLocaleString()} of $${g.toLocaleString()}`;
    }
    if (this.labelEl) {
      this.labelEl.textContent = clampedPercent >= 100 ? "FULLY FUNDED" : "FUNDED";
    }
  }

  animateToPercent(target) {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }

    const step = () => {
      const diff = target - this.currentPercent;
      if (Math.abs(diff) < 0.2) {
        this.currentPercent = target;
        this.applyWaveHeight(this.currentPercent);
        if (this.percentEl) this.percentEl.textContent = `${Math.round(this.currentPercent)}%`;
        return;
      }

      this.currentPercent += diff * 0.12;
      this.applyWaveHeight(this.currentPercent);
      if (this.percentEl) this.percentEl.textContent = `${Math.round(this.currentPercent)}%`;

      this.animationFrame = requestAnimationFrame(step);
    };

    this.animationFrame = requestAnimationFrame(step);
  }

  applyWaveHeight(percent) {
    // Liquid level in SVG coords (0 = top, 100 = bottom)
    const levelY = 100 - Math.min(96, Math.max(4, percent));

    // Dynamic wave paths with subtle amplitude
    const ampFront = percent <= 0 ? 0 : 4;
    const ampBack = percent <= 0 ? 0 : 3.5;

    // Front wave path covering from levelY down to 100
    // d: M 0,levelY Q 25,levelY-amp 50,levelY T 100,levelY L 100,100 L 0,100 Z
    if (this.waveFront) {
      this.waveFront.setAttribute(
        "d",
        `M 0 ${levelY} Q 25 ${levelY - ampFront} 50 ${levelY} T 100 ${levelY} L 100 100 L 0 100 Z`
      );
    }

    if (this.waveBack) {
      this.waveBack.setAttribute(
        "d",
        `M 0 ${levelY} Q 30 ${levelY + ampBack} 65 ${levelY} T 100 ${levelY} L 100 100 L 0 100 Z`
      );
    }
  }
}
