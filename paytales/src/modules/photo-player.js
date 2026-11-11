// PayTales: Dedicated Photo Showcase Player (Auto-cycles every 4.5 seconds with progress bar & controls)
import { cleanImageUrl } from "./sample-data.js";

export class PhotoPlayer {
  constructor(containerElement, { onPhotoClick, onPhotoChange } = {}) {
    this.container = containerElement;
    this.onPhotoClick = onPhotoClick;
    this.onPhotoChange = onPhotoChange;
    this.images = [];
    this.chapterMeta = { title: "", cause: "", location: "" };
    this.currentIndex = 0;
    this.isPlaying = true;
    this.duration = 4500; // 4.5 seconds auto-cycle as requested
    this.startTime = 0;
    this.progressFrame = null;
    this.renderSkeleton();
  }

  renderSkeleton() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="photo-showcase-card" id="photoShowcaseCard">
        <!-- Main Image Stage -->
        <div class="showcase-viewport" id="showcaseViewport" title="Click to view full photo">
          <img class="showcase-img" id="showcaseImg" src="" alt="Disaster field evidence" />
          <div class="showcase-img-placeholder" id="showcasePlaceholder" style="display: none;">
            <span>📸 No field photography available</span>
          </div>
          
          <!-- Top Badges -->
          <div class="showcase-top-overlay">
            <span class="showcase-counter-badge" id="photoCounterBadge">
              <span class="live-photo-dot"></span>
              <span id="photoCounterText">Photo 1 of 1</span>
            </span>
            <button type="button" class="showcase-expand-btn" id="photoExpandBtn" title="Expand high-res photo">
              <span>⛶</span> Expand
            </button>
          </div>

          <!-- Bottom Caption / Location Strip -->
          <div class="showcase-bottom-overlay">
            <div class="showcase-location-tag">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span id="photoLocationText">Ground Relief Verification</span>
            </div>
            
            <!-- Mini dots for multiple photos -->
            <div class="showcase-dots" id="photoDotsContainer"></div>
          </div>
        </div>

        <!-- Progress Track & Controls Bar -->
        <div class="showcase-control-bar">
          <div class="showcase-mini-ctrls">
            <button type="button" class="mini-ctrl-btn" id="prevPhotoBtn" title="Previous photo">⏮</button>
            <button type="button" class="mini-ctrl-btn" id="playPausePhotoBtn" title="Play or pause photo slideshow">
              <span id="playPausePhotoIcon">⏸</span>
            </button>
            <button type="button" class="mini-ctrl-btn" id="nextPhotoBtn" title="Next photo">⏭</button>
          </div>

          <!-- Dynamic 4.5-Second Progress Fill Bar -->
          <div class="showcase-progress-track" title="4.5s slide timer">
            <div class="showcase-progress-fill" id="photoProgressBar"></div>
          </div>

          <span class="cycle-hint">Cycles every 4.5s</span>
        </div>
      </div>
    `;

    this.attachDomEvents();
  }

  attachDomEvents() {
    const prevBtn = this.container.querySelector("#prevPhotoBtn");
    const nextBtn = this.container.querySelector("#nextPhotoBtn");
    const playPauseBtn = this.container.querySelector("#playPausePhotoBtn");
    const expandBtn = this.container.querySelector("#photoExpandBtn");
    const viewport = this.container.querySelector("#showcaseViewport");

    if (prevBtn) prevBtn.onclick = () => this.prevPhoto();
    if (nextBtn) nextBtn.onclick = () => this.nextPhoto();

    if (playPauseBtn) {
      playPauseBtn.onclick = () => {
        this.isPlaying = !this.isPlaying;
        const icon = this.container.querySelector("#playPausePhotoIcon");
        if (icon) icon.textContent = this.isPlaying ? "⏸" : "▶";
        if (this.isPlaying) {
          this.startTime = performance.now();
          this.runProgressLoop();
        } else {
          this.stopLoop();
        }
      };
    }

    if (expandBtn) {
      expandBtn.onclick = (e) => {
        e.stopPropagation();
        this.triggerClick();
      };
    }

    if (viewport) {
      viewport.onclick = () => this.triggerClick();
    }
  }

  triggerClick() {
    if (this.onPhotoClick && this.images[this.currentIndex]) {
      this.onPhotoClick(this.images[this.currentIndex], this.chapterMeta);
    }
  }

  loadImages(images, meta = {}) {
    this.stopLoop();
    this.chapterMeta = meta;

    // Clean all URLs
    this.images = (Array.isArray(images) ? images : [])
      .map(cleanImageUrl)
      .filter((u) => u && u.length > 0);

    this.currentIndex = 0;
    this.renderCurrentPhoto();

    if (this.images.length > 1 && this.isPlaying) {
      this.startTime = performance.now();
      this.runProgressLoop();
    } else {
      const progressBar = this.container.querySelector("#photoProgressBar");
      if (progressBar) progressBar.style.width = "100%";
    }
  }

  renderCurrentPhoto() {
    const imgEl = this.container.querySelector("#showcaseImg");
    const placeholder = this.container.querySelector("#showcasePlaceholder");
    const counterText = this.container.querySelector("#photoCounterText");
    const locationText = this.container.querySelector("#photoLocationText");
    const dotsContainer = this.container.querySelector("#photoDotsContainer");
    const controlBar = this.container.querySelector(".showcase-control-bar");

    if (!imgEl) return;

    if (this.images.length === 0) {
      imgEl.style.display = "none";
      if (placeholder) placeholder.style.display = "flex";
      if (counterText) counterText.textContent = "No photos";
      if (controlBar) controlBar.style.display = "none";
      return;
    }

    if (controlBar) controlBar.style.display = "flex";
    if (placeholder) placeholder.style.display = "none";
    imgEl.style.display = "block";

    // Trigger smooth crossfade transition
    imgEl.classList.remove("fade-in");
    void imgEl.offsetWidth; // reflow
    imgEl.src = this.images[this.currentIndex];
    imgEl.classList.add("fade-in");

    if (counterText) {
      counterText.textContent = `Photo ${this.currentIndex + 1} of ${this.images.length}`;
    }

    if (locationText) {
      locationText.textContent = this.chapterMeta.location || this.chapterMeta.cause || "Disaster Relief Evidence";
    }

    // Render photo dots
    if (dotsContainer) {
      dotsContainer.innerHTML = this.images
        .map(
          (_, idx) => `
          <button type="button" class="photo-dot ${idx === this.currentIndex ? "active" : ""}" data-idx="${idx}" title="Go to photo ${idx + 1}"></button>
        `
        )
        .join("");

      dotsContainer.querySelectorAll(".photo-dot").forEach((dot) => {
        dot.onclick = (e) => {
          e.stopPropagation();
          const target = Number(dot.getAttribute("data-idx"));
          this.goToPhoto(target);
        };
      });
    }

    if (this.onPhotoChange) {
      this.onPhotoChange(this.images[this.currentIndex], this.currentIndex);
    }
  }

  nextPhoto() {
    if (this.images.length <= 1) return;
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.startTime = performance.now();
    this.renderCurrentPhoto();
  }

  prevPhoto() {
    if (this.images.length <= 1) return;
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.startTime = performance.now();
    this.renderCurrentPhoto();
  }

  goToPhoto(index) {
    if (index >= 0 && index < this.images.length) {
      this.currentIndex = index;
      this.startTime = performance.now();
      this.renderCurrentPhoto();
    }
  }

  runProgressLoop() {
    if (!this.isPlaying || this.images.length <= 1) return;

    const now = performance.now();
    const elapsed = now - this.startTime;
    const progress = Math.min(1, elapsed / this.duration);

    const progressBar = this.container.querySelector("#photoProgressBar");
    if (progressBar) {
      progressBar.style.width = `${progress * 100}%`;
    }

    if (elapsed >= this.duration) {
      this.nextPhoto();
      this.startTime = performance.now();
    }

    this.progressFrame = requestAnimationFrame(() => this.runProgressLoop());
  }

  stopLoop() {
    if (this.progressFrame) {
      cancelAnimationFrame(this.progressFrame);
      this.progressFrame = null;
    }
  }
}
