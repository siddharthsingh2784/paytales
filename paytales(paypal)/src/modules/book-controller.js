// PayTales: 3D Interactive Digital Split-Screen Book Controller
import { LiquidMeter } from "./liquid-meter.js";
import { ScenePlayer } from "./scene-player.js";
import { sounds } from "./sound-effects.js";

const ROMAN_NUMERALS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV"];

export class BookController {
  constructor({ containerElement, onDonateClick, onAdminClick }) {
    this.container = containerElement;
    this.onDonateClick = onDonateClick;
    this.onAdminClick = onAdminClick;

    this.chapters = [];
    this.currentIndex = 0;
    this.isCoverOpen = false;
    this.isFlipping = false;

    this.liquidMeter = null;
    this.scenePlayer = null;

    this.renderSkeleton();
    this.attachGlobalListeners();
  }

  renderSkeleton() {
    this.container.innerHTML = `
      <div class="book-viewport" id="bookViewport">
        <!-- 3D Book Stage -->
        <div class="book-3d-wrapper" id="bookWrapper">

          <!-- Interactive 3D Hardcover -->
          <div class="book-cover" id="bookCover">
            <div class="cover-front">
              <div class="cover-leather-texture"></div>
              <div class="cover-gilded-border">
                <div class="cover-inner-border">

                  <!-- Golden Header Emblem -->
                  <div class="cover-brand-header">
                    <img src="/paytales_logo.png" alt="PayTales Logo" class="cover-logo-img" />
                    <span class="cover-est">EST. 2024 • INTERACTIVE IMPACT JOURNEYS</span>
                  </div>

                  <!-- Central 3D Medallion -->
                  <div class="cover-medallion">
                    <div class="medallion-ring ring-outer"></div>
                    <div class="medallion-ring ring-inner"></div>
                    <div class="medallion-core">
                      <svg class="medallion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
                        <path d="M6 2v20"/>
                        <path d="M14 6h3"/>
                        <path d="M14 10h3"/>
                      </svg>
                    </div>
                  </div>

                  <!-- Foil Typography -->
                  <div class="cover-titles">
                    <h1 class="cover-title-foil">PayTales</h1>
                    <div class="cover-ornament-divider">
                      <span class="star-foil">✦</span>
                      <span class="line-foil"></span>
                      <span class="star-foil">✦</span>
                    </div>
                    <p class="cover-subtitle-foil">Turn a story into real impact</p>
                    <p class="cover-motto">
                      A story-driven micro-donation platform for rural tragedies & climate disasters
                    </p>
                  </div>

                  <!-- Open Button -->
                  <div class="cover-action-wrap">
                    <button type="button" id="openBookBtn" class="open-book-btn">
                      <span class="btn-text">Open the Book</span>
                      <span class="btn-icon">→</span>
                    </button>
                    <span class="open-subtext">Click or press Spacebar to enter</span>
                  </div>

                </div>
              </div>
            </div>
            <div class="cover-back"></div>
          </div>

          <!-- Open Book Pages Split-Screen -->
          <main class="open-book-body" id="openBookBody">
            <!-- Spine Fold & Shadow -->
            <div class="book-spine-crease"></div>

            <!-- Page Leaf Left: Narrative Hub -->
            <section class="page-leaf page-left" id="pageLeft">
              <!-- Background Ambient Gradient & Disaster Image Blend -->
              <div class="page-ambient-bg" id="pageAmbientBg">
                <div class="ambient-image-layer" id="ambientImageLayer"></div>
                <div class="ambient-gradient-overlay" id="ambientGradOverlay"></div>
                <div class="parchment-grain"></div>
              </div>

              <div class="page-inner-content">
                <!-- Chapter Top Ribbon / Header -->
                <header class="narrative-header">
                  <div class="chapter-kicker">
                    <span class="chapter-roman" id="chRoman">CHAPTER I</span>
                    <span class="kicker-sep">•</span>
                    <span class="chapter-cause-badge" id="chCauseBadge">Wayanad Landslide Relief</span>
                  </div>
                  <h2 class="narrative-title" id="chTitle">When the Hills Fell Asleep</h2>

                  <!-- Tags -->
                  <div class="narrative-tags" id="chTags"></div>
                </header>

                <!-- Staggered Story Reveal Box -->
                <div class="narrative-story-box" id="narrativeStoryBox">
                  <!-- Injected by ScenePlayer -->
                </div>

                <!-- Scene Audio & Play Controls Bar -->
                <div class="story-player-bar">
                  <div class="player-controls">
                    <button type="button" class="player-ctrl-btn" id="prevSceneBtn" title="Previous scene">
                      ⏮
                    </button>
                    <button type="button" class="player-ctrl-btn play-pause-btn" id="playPauseSceneBtn" title="Play or pause story progression">
                      <span id="playPauseIcon">▶</span>
                    </button>
                    <button type="button" class="player-ctrl-btn" id="nextSceneBtn" title="Next scene">
                      ⏭
                    </button>
                    <button type="button" class="player-ctrl-btn sound-toggle-btn" id="speechToggleBtn" title="Listen to voice narration">
                      <span id="speechIcon">🎙️</span>
                    </button>
                  </div>

                  <!-- Dynamic Scene Progress Fill Bar -->
                  <div class="scene-progress-track">
                    <div class="scene-progress-fill" id="sceneProgressBar"></div>
                  </div>
                </div>

                <!-- AI Dedication Badge -->
                <div class="ai-dedication-box" id="aiDedicationBox">
                  <div class="ai-badge-header">
                    <span class="ai-stars">✨ AI DEDICATION PROMPT</span>
                  </div>
                  <p class="ai-prompt-text" id="aiPromptText">
                    Tell us a name to dedicate this relief shelter kit.
                  </p>
                  <button type="button" class="dedicate-action-link" id="dedicateLinkBtn">
                    Add dedication with your gift →
                  </button>
                </div>
              </div>

              <!-- Page Footer Number -->
              <footer class="page-footer-left">
                <span class="page-num" id="pageNumLeft">Page 1</span>
              </footer>
            </section>

            <!-- Page Leaf Right: Impact & Micro-Donation Hub -->
            <section class="page-leaf page-right" id="pageRight">
              <div class="page-ambient-bg right-bg">
                <div class="parchment-grain"></div>
              </div>

              <div class="page-inner-content">
                <header class="impact-header">
                  <span class="impact-kicker">COMMUNITY RELIEF VESSEL</span>
                  <h3 class="impact-subheading">Turn Empathy Into Ground Action</h3>
                </header>

                <!-- Circular Liquid Progress Meter Vessel (#meter) -->
                <div class="meter-center-wrapper">
                  <div id="meter"></div>
                </div>

                <!-- Live Statistical Metrics Grid -->
                <div class="stats-grid" id="statsGrid">
                  <!-- Injected dynamically (3 cards) -->
                </div>

                <!-- Interactive Donation Tier Cards ($5, $10, $25) -->
                <div class="donation-tiers-section">
                  <div class="tiers-label-bar">
                    <span class="tiers-title">Choose Micro-Donation Tier</span>
                    <span class="tiers-hint">100% directly deployed</span>
                  </div>
                  <div class="tiers-grid" id="tiersGrid">
                    <!-- Injected dynamically -->
                  </div>
                </div>

                <!-- Primary Call to Action Button -->
                <div class="donate-action-bar">
                  <button type="button" class="donate-cta-btn" id="mainDonateBtn">
                    <span class="cta-shine"></span>
                    <span class="cta-icon">🎁</span>
                    <span class="cta-label">Donate to This Chapter</span>
                    <span class="cta-arrow">→</span>
                  </button>
                </div>
              </div>

              <!-- Page Footer Number -->
              <footer class="page-footer-right">
                <span class="page-num" id="pageNumRight">Page 2</span>
              </footer>
            </section>

            <!-- Animated 3D Turning Leaf (For Page Turn Animation) -->
            <div class="turning-leaf" id="turningLeaf">
              <div class="leaf-front" id="leafFront"></div>
              <div class="leaf-back" id="leafBack"></div>
            </div>

          </main>

        </div>

        <!-- Book Navigation Ribbon & Floating Controls -->
        <nav class="book-nav-dock" id="bookNavDock">
          <!-- Prev Chapter Arrow -->
          <button type="button" class="nav-arrow-btn prev-arrow" id="prevChapterBtn" title="Previous chapter (←)">
            ‹
          </button>

          <!-- Central Chapter Dots & Reading Progress -->
          <div class="nav-dots-wrapper">
            <div class="book-progress-line">
              <div class="progress-line-fill" id="bookProgressFill"></div>
            </div>
            <div class="chapter-dots-list" id="chapterDotsList">
              <!-- 10 dots injected -->
            </div>
          </div>

          <!-- Next Chapter Arrow -->
          <button type="button" class="nav-arrow-btn next-arrow" id="nextChapterBtn" title="Next chapter (→)">
            ›
          </button>
        </nav>
      </div>
    `;

    // Initialize sub-components
    const meterEl = this.container.querySelector("#meter");
    this.liquidMeter = new LiquidMeter(meterEl);

    const storyBox = this.container.querySelector("#narrativeStoryBox");
    this.scenePlayer = new ScenePlayer(storyBox, (sceneIdx, total) => {
      // Scene changed
    });

    this.attachDomEvents();
  }

  attachDomEvents() {
    const openBtn = this.container.querySelector("#openBookBtn");
    if (openBtn) {
      openBtn.onclick = () => this.openCover();
    }

    const prevBtn = this.container.querySelector("#prevChapterBtn");
    const nextBtn = this.container.querySelector("#nextChapterBtn");
    if (prevBtn) prevBtn.onclick = () => this.prevChapter();
    if (nextBtn) nextBtn.onclick = () => this.nextChapter();

    // Scene player controls
    const playPauseBtn = this.container.querySelector("#playPauseSceneBtn");
    const playPauseIcon = this.container.querySelector("#playPauseIcon");
    if (playPauseBtn) {
      playPauseBtn.onclick = () => {
        const isPlaying = this.scenePlayer.togglePlay();
        playPauseIcon.textContent = isPlaying ? "⏸" : "▶";
      };
    }

    const prevSceneBtn = this.container.querySelector("#prevSceneBtn");
    const nextSceneBtn = this.container.querySelector("#nextSceneBtn");
    if (prevSceneBtn) prevSceneBtn.onclick = () => this.scenePlayer.prevScene();
    if (nextSceneBtn) nextSceneBtn.onclick = () => this.scenePlayer.nextScene();

    const speechBtn = this.container.querySelector("#speechToggleBtn");
    if (speechBtn) {
      speechBtn.onclick = () => {
        const speaking = this.scenePlayer.toggleNarrationVoice();
        speechBtn.classList.toggle("active", speaking);
      };
    }

    // Dedicate link
    const dedicateBtn = this.container.querySelector("#dedicateLinkBtn");
    if (dedicateBtn) {
      dedicateBtn.onclick = () => {
        if (this.onDonateClick) {
          this.onDonateClick(this.chapters[this.currentIndex], this.currentIndex, 10);
        }
      };
    }

    // Main donate button
    const donateBtn = this.container.querySelector("#mainDonateBtn");
    if (donateBtn) {
      donateBtn.onclick = () => {
        if (this.onDonateClick) {
          this.onDonateClick(this.chapters[this.currentIndex], this.currentIndex, 10);
        }
      };
    }
  }

  attachGlobalListeners() {
    window.addEventListener("keydown", (e) => {
      // If modal dialog is open or user typing in input, ignore
      if (document.body.classList.contains("modal-open") || ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) {
        return;
      }

      if (e.code === "Space") {
        if (!this.isCoverOpen) {
          e.preventDefault();
          this.openCover();
        }
      } else if (e.code === "ArrowRight") {
        if (this.isCoverOpen) {
          e.preventDefault();
          this.nextChapter();
        }
      } else if (e.code === "ArrowLeft") {
        if (this.isCoverOpen) {
          e.preventDefault();
          this.prevChapter();
        }
      }
    });
  }

  setChapters(chapters) {
    this.chapters = chapters;
    this.renderDots();
    this.renderCurrentChapter();
  }

  openCover() {
    if (this.isCoverOpen) return;
    this.isCoverOpen = true;

    sounds.playBookOpen();
    const cover = this.container.querySelector("#bookCover");
    const navDock = this.container.querySelector("#bookNavDock");
    const viewport = this.container.querySelector("#bookViewport");

    if (viewport) viewport.classList.add("book-opened");
    if (cover) cover.classList.add("cover-opened");
    if (navDock) navDock.classList.add("visible");

    // Automatically start narrative scene player
    setTimeout(() => {
      this.scenePlayer.play();
      const playPauseIcon = this.container.querySelector("#playPauseIcon");
      if (playPauseIcon) playPauseIcon.textContent = "⏸";
    }, 700);
  }

  closeCover() {
    this.isCoverOpen = false;
    sounds.playBookOpen();
    const cover = this.container.querySelector("#bookCover");
    const navDock = this.container.querySelector("#bookNavDock");
    const viewport = this.container.querySelector("#bookViewport");

    if (viewport) viewport.classList.remove("book-opened");
    if (cover) cover.classList.remove("cover-opened");
    if (navDock) navDock.classList.remove("visible");
    this.scenePlayer.pause();
  }

  goToChapter(index) {
    if (index === this.currentIndex || index < 0 || index >= this.chapters.length) return;
    if (!this.isCoverOpen) {
      this.openCover();
    }
    this.triggerPageTurn(index > this.currentIndex ? "forward" : "backward", index);
  }

  nextChapter() {
    if (this.isFlipping) return;
    if (this.currentIndex < this.chapters.length - 1) {
      this.triggerPageTurn("forward", this.currentIndex + 1);
    } else {
      // Loop to chapter 0
      this.triggerPageTurn("forward", 0);
    }
  }

  prevChapter() {
    if (this.isFlipping) return;
    if (this.currentIndex > 0) {
      this.triggerPageTurn("backward", this.currentIndex - 1);
    } else {
      // Loop to last chapter
      this.triggerPageTurn("backward", this.chapters.length - 1);
    }
  }

  triggerPageTurn(direction, targetIndex) {
    if (this.isFlipping) return;
    this.isFlipping = true;

    sounds.playPageTurn();

    const turningLeaf = this.container.querySelector("#turningLeaf");
    if (turningLeaf) {
      turningLeaf.className = "turningLeaf"; // reset
      void turningLeaf.offsetWidth; // trigger reflow
      turningLeaf.classList.add(direction === "forward" ? "flip-forward" : "flip-backward");
    }

    // Mid-way through flip, switch data
    setTimeout(() => {
      this.currentIndex = targetIndex;
      this.renderCurrentChapter();
    }, 280);

    // End of flip
    setTimeout(() => {
      if (turningLeaf) {
        turningLeaf.className = "turningLeaf";
      }
      this.isFlipping = false;
    }, 600);
  }

  renderCurrentChapter() {
    const ch = this.chapters[this.currentIndex];
    if (!ch) return;

    const roman = ROMAN_NUMERALS[this.currentIndex] || `CH ${this.currentIndex + 1}`;

    // Left Page Content
    const chRoman = this.container.querySelector("#chRoman");
    const chCauseBadge = this.container.querySelector("#chCauseBadge");
    const chTitle = this.container.querySelector("#chTitle");
    const chTags = this.container.querySelector("#chTags");
    const aiPromptText = this.container.querySelector("#aiPromptText");
    const pageNumLeft = this.container.querySelector("#pageNumLeft");
    const pageNumRight = this.container.querySelector("#pageNumRight");
    const ambientImageLayer = this.container.querySelector("#ambientImageLayer");
    const ambientGradOverlay = this.container.querySelector("#ambientGradOverlay");

    if (chRoman) chRoman.textContent = `CHAPTER ${roman}`;
    if (chCauseBadge) chCauseBadge.textContent = ch.cause;
    if (chTitle) chTitle.textContent = ch.title;
    if (aiPromptText) aiPromptText.textContent = ch.ai || "Dedicate your micro-gift to make this story real.";
    if (pageNumLeft) pageNumLeft.textContent = `Page ${this.currentIndex * 2 + 1}`;
    if (pageNumRight) pageNumRight.textContent = `Page ${this.currentIndex * 2 + 2}`;

    // Tags
    if (chTags) {
      chTags.innerHTML = (ch.tags || [])
        .map((tag) => `<span class="topic-tag">#${tag}</span>`)
        .join("");
    }

    // Dynamic background gradient & imagery
    const grad1 = ch.grad?.[0] || "#0a1220";
    const grad2 = ch.grad?.[1] || "#2a9d8f";
    if (ambientGradOverlay) {
      ambientGradOverlay.style.background = `linear-gradient(145deg, ${grad1}f0 0%, ${grad2}bb 100%)`;
    }

    if (ambientImageLayer && ch.images?.[0]) {
      ambientImageLayer.style.backgroundImage = `url('${ch.images[0]}')`;
    }

    // Load scenes into ScenePlayer
    this.scenePlayer.loadScenes(ch.scenes);
    if (this.isCoverOpen) {
      this.scenePlayer.play();
    }

    // Right Page Content: Liquid Meter
    this.liquidMeter.update(ch.raised, ch.goal);

    // Stats Grid
    const statsGrid = this.container.querySelector("#statsGrid");
    if (statsGrid) {
      statsGrid.innerHTML = (ch.stats || [])
        .slice(0, 3)
        .map(
          (stat) => `
          <div class="stat-card">
            <div class="stat-num">${stat.n}</div>
            <div class="stat-desc">${stat.l}</div>
          </div>
        `
        )
        .join("");
    }

    // Donation Tiers
    const tiersGrid = this.container.querySelector("#tiersGrid");
    if (tiersGrid) {
      const amounts = [5, 10, 25];
      tiersGrid.innerHTML = amounts
        .map((amt, idx) => {
          const tierDesc = ch.tiers?.[idx] || `$${amt} micro-donation helps communities in need.`;
          return `
          <div class="tier-card" data-amount="${amt}">
            <div class="tier-card-head">
              <span class="tier-currency">$</span>
              <span class="tier-price">${amt}</span>
              ${amt === 10 ? '<span class="tier-badge-recommended">POPULAR</span>' : ""}
            </div>
            <p class="tier-text">${tierDesc}</p>
            <button type="button" class="tier-choose-btn" data-amount="${amt}">
              Select $${amt}
            </button>
          </div>
        `;
        })
        .join("");

      // Tier click events
      tiersGrid.querySelectorAll(".tier-card").forEach((card) => {
        card.onclick = () => {
          const amt = Number(card.getAttribute("data-amount"));
          if (this.onDonateClick) {
            this.onDonateClick(this.chapters[this.currentIndex], this.currentIndex, amt);
          }
        };
      });
    }

    // Update Dots & Overall Book Progress
    this.updateDotsActive();
    this.updateBookProgress();
  }

  renderDots() {
    const list = this.container.querySelector("#chapterDotsList");
    if (!list) return;

    list.innerHTML = this.chapters
      .map(
        (ch, idx) => `
        <button type="button" class="ch-dot ${idx === this.currentIndex ? "active" : ""}" data-index="${idx}" title="Chapter ${idx + 1}: ${ch.title}">
          <span class="dot-inner"></span>
          <span class="dot-tooltip">${ch.cause}</span>
        </button>
      `
      )
      .join("");

    list.querySelectorAll(".ch-dot").forEach((dot) => {
      dot.onclick = () => {
        const idx = Number(dot.getAttribute("data-index"));
        this.goToChapter(idx);
      };
    });
  }

  updateDotsActive() {
    const dots = this.container.querySelectorAll(".ch-dot");
    dots.forEach((dot, idx) => {
      dot.classList.toggle("active", idx === this.currentIndex);
    });
  }

  updateBookProgress() {
    const fill = this.container.querySelector("#bookProgressFill");
    if (fill && this.chapters.length > 1) {
      const pct = (this.currentIndex / (this.chapters.length - 1)) * 100;
      fill.style.width = `${pct}%`;
    }
  }
}
