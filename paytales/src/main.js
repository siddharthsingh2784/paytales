// PayTales: Master Application Controller & Component Orchestration
import { dataService } from "./modules/firebase-service.js";
import { BookController } from "./modules/book-controller.js";
import { ImpactHub } from "./modules/impact-hub.js";
import { CheckoutModal } from "./modules/checkout-modal.js";
import { AdminCMS } from "./modules/admin-cms.js";
import { sounds } from "./modules/sound-effects.js";

class PayTalesApp {
  constructor() {
    this.currentView = "book"; // 'book' | 'impact'
    this.chapters = [];
    this.bookController = null;
    this.impactHub = null;
    this.checkoutModal = null;
    this.adminCms = null;
    this.init();
  }

  async init() {
    this.initElements();
    this.initSubsystems();
    this.bindEvents();

    // Subscribe to Firebase / Local Storage data changes
    dataService.subscribe((state) => {
      this.handleDataUpdate(state);
    });

    // Start Firebase connectivity check with 6-second timeout fallback
    await dataService.init();
  }

  initElements() {
    this.tabBookBtn = document.getElementById("tabBookBtn");
    this.tabImpactBtn = document.getElementById("tabImpactBtn");
    this.bookView = document.getElementById("bookView");
    this.impactView = document.getElementById("impactView");
    this.syncStatusBadge = document.getElementById("syncStatusBadge");
    this.syncStatusText = document.getElementById("syncStatusText");
    this.ambientSoundBtn = document.getElementById("ambientSoundBtn");
    this.adminOpenBtn = document.getElementById("adminOpenBtn");
    this.tocBtn = document.getElementById("tocBtn");
    this.tocDialog = document.getElementById("tocDialog");
    this.tocListContainer = document.getElementById("tocListContainer");
    this.brandHomeBtn = document.getElementById("brandHomeBtn");
  }

  initSubsystems() {
    // 1. Checkout Modal (Simulated PayPal Sandbox & Credit Card)
    this.checkoutModal = new CheckoutModal((result) => {
      // Re-render impact hub and book when donation completes
      if (this.impactHub) {
        this.impactHub.render(this.chapters);
      }
    });

    // 2. 3D Split-Screen Book Controller
    const bookContainer = document.getElementById("bookContainer");
    this.bookController = new BookController({
      containerElement: bookContainer,
      onDonateClick: (chapter, index, amount) => {
        this.checkoutModal.open(chapter, index, amount);
      },
      onAdminClick: () => {
        this.openAdmin();
      }
    });

    // 3. Track & Impact Hub (Donor Transparency Page)
    const impactContainer = document.getElementById("impactContainer");
    this.impactHub = new ImpactHub(impactContainer, (chapterIndex) => {
      // User clicked "Read Story" or "View Chapter" from the timeline
      this.switchView("book");
      this.bookController.goToChapter(chapterIndex);
    });

    // 4. Admin CMS Dialog (<dialog id="admin">)
    this.adminCms = new AdminCMS((updatedChapters, selectedIndex) => {
      this.chapters = updatedChapters;
      this.bookController.setChapters(this.chapters);
      this.bookController.goToChapter(selectedIndex);
      this.impactHub.render(this.chapters);
      this.renderTocList();
    });
  }

  bindEvents() {
    // Navigation Tabs Switch
    this.tabBookBtn.onclick = () => this.switchView("book");
    this.tabImpactBtn.onclick = () => this.switchView("impact");

    // Brand Home button: Return to Book Cover
    this.brandHomeBtn.onclick = (e) => {
      e.preventDefault();
      this.switchView("book");
      this.bookController.closeCover();
    };

    // Header "Edit chapters" button
    this.adminOpenBtn.onclick = () => {
      this.openAdmin();
    };

    // Table of contents popover
    if (this.tocBtn && this.tocDialog) {
      this.tocBtn.onclick = () => {
        this.renderTocList();
        this.tocDialog.showModal();
        document.body.classList.add("modal-open");
      };

      const closeTocBtn = document.getElementById("closeTocBtn");
      if (closeTocBtn) {
        closeTocBtn.onclick = () => {
          this.tocDialog.close();
          document.body.classList.remove("modal-open");
        };
      }

      this.tocDialog.addEventListener("click", (e) => {
        const rect = this.tocDialog.getBoundingClientRect();
        const inDialog =
          rect.top <= e.clientY &&
          e.clientY <= rect.top + rect.height &&
          rect.left <= e.clientX &&
          e.clientX <= rect.left + rect.width;
        if (!inDialog) {
          this.tocDialog.close();
          document.body.classList.remove("modal-open");
        }
      });
    }

    // Ambient Sound Toggle
    if (this.ambientSoundBtn) {
      this.ambientSoundBtn.onclick = () => {
        const isPlaying = sounds.toggleAmbient();
        const icon = document.getElementById("ambientSoundIcon");
        if (icon) {
          icon.textContent = isPlaying ? "🔊" : "🌧️";
        }
        this.ambientSoundBtn.classList.toggle("active", isPlaying);
      };
    }
  }

  switchView(viewName) {
    this.currentView = viewName;
    if (viewName === "book") {
      this.tabBookBtn.classList.add("active");
      this.tabImpactBtn.classList.remove("active");
      this.bookView.classList.add("active");
      this.impactView.classList.remove("active");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      this.tabBookBtn.classList.remove("active");
      this.tabImpactBtn.classList.add("active");
      this.bookView.classList.remove("active");
      this.impactView.classList.add("active");
      if (this.impactHub) {
        this.impactHub.render(this.chapters);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  openAdmin() {
    if (this.adminCms) {
      this.adminCms.open(this.chapters, this.bookController.currentIndex);
    }
  }

  handleDataUpdate(state) {
    this.chapters = state.chapters;

    // Update connection badge
    if (this.syncStatusBadge && this.syncStatusText) {
      this.syncStatusBadge.className = `sync-status-badge ${state.status}`;
      if (state.status === "online") {
        this.syncStatusText.textContent = "Realtime RTDB";
        this.syncStatusBadge.title = "Connected to Firebase Realtime Database";
      } else if (state.status === "offline") {
        this.syncStatusText.textContent = "Local Sync Mode";
        this.syncStatusBadge.title = "Operating in resilient offline mode via LocalStorage";
      } else {
        this.syncStatusText.textContent = "Connecting...";
      }
    }

    // Refresh Book and Impact Hub with live data
    if (this.bookController && this.chapters.length > 0) {
      this.bookController.setChapters(this.chapters);
    }
    if (this.impactHub && this.chapters.length > 0) {
      this.impactHub.render(this.chapters);
    }
    this.renderTocList();
  }

  renderTocList() {
    if (!this.tocListContainer || !this.chapters.length) return;

    this.tocListContainer.innerHTML = this.chapters
      .map((ch, idx) => {
        const pct = Math.min(100, Math.round(((ch.raised || 0) / (ch.goal || 1)) * 100));
        return `
        <div class="toc-entry-card" data-idx="${idx}" style="display: flex; align-items: center; justify-content: space-between; background: rgba(16, 28, 48, 0.85); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 0.75rem 1rem; cursor: pointer; transition: all 0.2s ease;">
          <div style="display: flex; align-items: center; gap: 0.85rem;">
            <span style="font-family: var(--font-serif); font-size: 1.1rem; font-weight: 800; color: var(--gold-light); min-width: 28px;">${idx + 1}.</span>
            <div>
              <h4 style="font-family: var(--font-serif); font-size: 1.05rem; color: #fff; margin-bottom: 2px;">${ch.title}</h4>
              <span style="font-size: 0.75rem; color: #94a3b8;">${ch.cause}</span>
            </div>
          </div>
          <div style="text-align: right;">
            <span style="display: block; font-size: 0.88rem; font-weight: 800; color: var(--teal-bright);">${pct}%</span>
            <span style="font-size: 0.7rem; color: #64748b;">$${(ch.raised || 0).toLocaleString()}</span>
          </div>
        </div>
      `;
      })
      .join("");

    this.tocListContainer.querySelectorAll(".toc-entry-card").forEach((card) => {
      card.onclick = () => {
        const idx = Number(card.getAttribute("data-idx"));
        if (this.tocDialog) {
          this.tocDialog.close();
          document.body.classList.remove("modal-open");
        }
        this.switchView("book");
        this.bookController.goToChapter(idx);
      };
    });
  }
}

// Bootstrap once DOM ready
window.addEventListener("DOMContentLoaded", () => {
  new PayTalesApp();
});
