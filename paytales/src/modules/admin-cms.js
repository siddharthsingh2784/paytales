// PayTales: Admin CMS Modal (<dialog id="admin">)
import { dataService } from "./firebase-service.js";
import { SAMPLE, cleanImageUrl } from "./sample-data.js";

export class AdminCMS {
  constructor(onChaptersUpdated) {
    this.onChaptersUpdated = onChaptersUpdated;
    this.dialog = document.getElementById("admin");
    this.selectedIndex = 0;
    this.chapters = [];
    this.init();
  }

  init() {
    if (!this.dialog) {
      this.dialog = document.createElement("dialog");
      this.dialog.id = "admin";
      this.dialog.className = "vintage-modal admin-dialog";
      document.body.appendChild(this.dialog);
    }
  }

  open(chapters, initialIndex = 0) {
    this.chapters = JSON.parse(JSON.stringify(chapters));
    this.selectedIndex = Math.min(initialIndex, this.chapters.length - 1);
    this.render();
    this.dialog.showModal();
    document.body.classList.add("modal-open");
  }

  close() {
    this.dialog.close();
    document.body.classList.remove("modal-open");
  }

  render() {
    const ch = this.chapters[this.selectedIndex] || this.chapters[0] || SAMPLE[0];

    // Format fields for editing
    const imagesStr = (ch.images || []).join("\n");
    const scenesStr = (ch.scenes || []).join("\n\n");
    const tagsStr = (ch.tags || []).join(", ");
    const tiersStr = (ch.tiers || []).join("\n");
    const statsStr = (ch.stats || []).map((s) => `${s.n || ""} | ${s.l || ""}`).join("\n");
    const grad1 = ch.grad?.[0] || "#0a1220";
    const grad2 = ch.grad?.[1] || "#2a9d8f";

    // Options for chapter select
    const optionsHtml = this.chapters
      .map(
        (c, idx) => `
        <option value="${idx}" ${idx === this.selectedIndex ? "selected" : ""}>
          Chapter ${idx + 1}: ${c.title || "Untitled"} (${c.cause || "No cause"})
        </option>
      `
      )
      .join("");

    this.dialog.innerHTML = `
      <div class="modal-card admin-card">
        <div class="admin-top-bar">
          <div class="admin-brand">
            <span class="gold-key">🗝️</span>
            <div>
              <h2 class="admin-title">PayTales Archive Editor</h2>
              <span class="admin-subtitle">Live Firebase CMS & Narrative Management</span>
            </div>
          </div>
          <button class="modal-close-btn" id="closeAdminBtn" aria-label="Close admin">✕</button>
        </div>

        <div class="admin-chapter-selector-bar">
          <div class="selector-field">
            <label for="adminChapterSelect">Select Chapter to Edit:</label>
            <select id="adminChapterSelect" class="vintage-select">
              ${optionsHtml}
            </select>
          </div>
          <div class="selector-actions">
            <button type="button" id="adminAddChapterBtn" class="pill-btn add-btn">
              <span>+</span> Add Chapter
            </button>
            <button type="button" id="adminDeleteChapterBtn" class="pill-btn delete-btn" ${this.chapters.length <= 1 ? "disabled" : ""}>
              <span>🗑️</span> Delete
            </button>
          </div>
        </div>

        <form id="adminForm" class="admin-form" onsubmit="return false;">
          <div class="form-grid-2">
            <div class="form-group">
              <label for="chTitle">Chapter Title</label>
              <input type="text" id="chTitle" value="${this.escapeHtml(ch.title || "")}" required>
            </div>
            <div class="form-group">
              <label for="chCause">Cause / Disaster Focus</label>
              <input type="text" id="chCause" value="${this.escapeHtml(ch.cause || "")}" required>
            </div>
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label for="chGoal">Funding Goal (USD $)</label>
              <input type="number" id="chGoal" value="${ch.goal || 30000}" min="100" step="100" required>
            </div>
            <div class="form-group">
              <label for="chRaised">Current Raised Amount (USD $)</label>
              <input type="number" id="chRaised" value="${ch.raised || 0}" min="0" step="50" required>
            </div>
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label for="chGrad1">Spine Background Gradient 1 & 2</label>
              <div class="color-picker-pair">
                <input type="color" id="chGrad1" value="${grad1}">
                <input type="color" id="chGrad2" value="${grad2}">
                <span class="color-preview-label">Atmosphere</span>
              </div>
            </div>
            <div class="form-group">
              <label for="chTags">Topic Tags (comma-separated)</label>
              <input type="text" id="chTags" value="${this.escapeHtml(tagsStr)}">
            </div>
          </div>

          <div class="form-group">
            <label for="chAi">AI Dedication Prompt Badge</label>
            <input type="text" id="chAi" value="${this.escapeHtml(ch.ai || "")}">
          </div>

          <div class="form-group">
            <label for="chImages">Imagery URLs (One per line or comma-separated)</label>
            <textarea id="chImages" rows="2" placeholder="https://images.unsplash.com/...">${this.escapeHtml(imagesStr)}</textarea>
            <div class="admin-image-previews" id="adminImagePreviews"></div>
            <small class="field-hint">Tip: Paste image URLs. Markdown links like [url](url) and quotes are automatically sanitized.</small>
          </div>

          <div class="form-group">
            <label for="chScenes">Story Scenes (Separate each scene with a double newline)</label>
            <textarea id="chScenes" rows="5" placeholder="First scene text...\n\nSecond scene text...">${this.escapeHtml(scenesStr)}</textarea>
            <small class="field-hint">Tip: Double linebreaks create distinct auto-advance cards.</small>
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label for="chStats">Live Statistics (Format: Value | Label)</label>
              <textarea id="chStats" rows="3" placeholder="850+ | families relocated\n2,400 | medical kits">${this.escapeHtml(statsStr)}</textarea>
            </div>
            <div class="form-group">
              <label for="chTiers">Micro-Donation Tiers ($5, $10, $25 descriptions)</label>
              <textarea id="chTiers" rows="3" placeholder="$5 buys emergency blankets...\n$10 funds meals...\n$25 builds temporary shelters...">${this.escapeHtml(tiersStr)}</textarea>
            </div>
          </div>

          <div class="admin-footer-actions">
            <button type="button" id="adminResetSampleBtn" class="text-danger-btn">
              <span>↺</span> Reset to Default 10 Chapters
            </button>
            <div class="footer-right-buttons">
              <button type="button" id="adminCancelBtn" class="ghost-btn">Cancel</button>
              <button type="button" id="adminSaveBtn" class="gold-action-btn">
                <span>💾</span> Save Changes & Sync
              </button>
            </div>
          </div>
        </form>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    this.dialog.querySelector("#closeAdminBtn").onclick = () => this.close();
    this.dialog.querySelector("#adminCancelBtn").onclick = () => this.close();

    // Chapter switch
    const select = this.dialog.querySelector("#adminChapterSelect");
    select.onchange = (e) => {
      this.syncCurrentFormToMemory();
      this.selectedIndex = Number(e.target.value);
      this.render();
    };

    // Live image previews
    const imgTextarea = this.dialog.querySelector("#chImages");
    const previewContainer = this.dialog.querySelector("#adminImagePreviews");

    const updatePreviews = () => {
      if (!previewContainer || !imgTextarea) return;
      const urls = imgTextarea.value
        .split(/[\n,]/)
        .map(cleanImageUrl)
        .filter((u) => u.length > 0);

      if (urls.length === 0) {
        previewContainer.innerHTML = `<span style="font-size:0.75rem; color:#64748b; font-style:italic;">No background image specified.</span>`;
        return;
      }

      previewContainer.innerHTML = `
        <div style="display: flex; gap: 0.6rem; align-items: center; flex-wrap: wrap; margin-top: 0.4rem;">
          ${urls
            .map(
              (u, idx) => `
            <div class="admin-preview-item" style="position: relative; width: 78px; height: 50px; border-radius: 6px; overflow: hidden; border: 1.5px solid rgba(201,169,110,0.5); background: #000; box-shadow: 0 2px 6px rgba(0,0,0,0.4);">
              <img src="${u}" alt="Preview ${idx + 1}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
              <div style="display: none; position: absolute; inset: 0; background: #3b1d1d; color: #fca5a5; font-size: 0.65rem; align-items: center; justify-content: center; text-align: center; padding: 2px;">⚠️ Bad Link</div>
              <span style="position: absolute; bottom: 2px; left: 2px; font-size: 0.58rem; font-weight: 700; background: rgba(0,0,0,0.8); color: var(--gold-light); padding: 0 4px; border-radius: 2px;">${idx === 0 ? "Active BG" : "#" + (idx + 1)}</span>
            </div>
          `
            )
            .join("")}
        </div>
      `;
    };

    if (imgTextarea) {
      imgTextarea.oninput = updatePreviews;
      updatePreviews();
    }

    // Add chapter
    this.dialog.querySelector("#adminAddChapterBtn").onclick = () => {
      this.syncCurrentFormToMemory();
      const newIndex = this.chapters.length + 1;
      const newCh = {
        id: `chapter-${Date.now()}`,
        title: `New Tragedy Relief ${newIndex}`,
        cause: "Emergency Crisis Relief",
        location: "Disaster Impact Zone",
        coords: "0.0000° N, 0.0000° E",
        grad: ["#1c2d37", "#4a6fa5"],
        images: ["https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80"],
        scenes: [
          "Emergency responders mobilized overnight.\nFamilies gather at community centers waiting for news.",
          "Every hour matters when water and communications fail.\nField teams are delivering clean water and dry rations."
        ],
        ai: "Dedicate a crisis supply pack in someone's honor.",
        tags: ["emergency", "relief", "community"],
        goal: 25000,
        raised: 1200,
        stats: [{ n: "150", l: "families reached" }, { n: "500", l: "water kits" }],
        tiers: [
          "$5 supplies clean water purification tablets.",
          "$10 delivers hot meals to displaced survivors.",
          "$25 sponsors complete family hygiene and medical packs."
        ],
        checkpoints: [
          { label: "Emergency Fund Opened", status: "completed", date: "Today" },
          { label: "Supplies Dispatched", status: "in-progress", date: "This Week" }
        ],
        verifiedReports: []
      };
      this.chapters.push(newCh);
      this.selectedIndex = this.chapters.length - 1;
      this.render();
    };

    // Delete chapter
    const deleteBtn = this.dialog.querySelector("#adminDeleteChapterBtn");
    if (deleteBtn) {
      deleteBtn.onclick = () => {
        if (this.chapters.length <= 1) {
          alert("Cannot delete the only remaining chapter.");
          return;
        }
        if (confirm(`Are you sure you want to delete chapter "${this.chapters[this.selectedIndex].title}"?`)) {
          this.chapters.splice(this.selectedIndex, 1);
          this.selectedIndex = Math.max(0, this.selectedIndex - 1);
          this.render();
        }
      };
    }

    // Reset to SAMPLE
    this.dialog.querySelector("#adminResetSampleBtn").onclick = async () => {
      if (confirm("Reset all chapters back to the official 10 PayTales sample dataset? Any custom edits will be reverted.")) {
        this.chapters = JSON.parse(JSON.stringify(SAMPLE));
        this.selectedIndex = 0;
        await dataService.saveAllChapters(this.chapters);
        this.render();
        this.showToast("Restored 10 official PayTales chapters!");
      }
    };

    // Save changes
    this.dialog.querySelector("#adminSaveBtn").onclick = async () => {
      this.syncCurrentFormToMemory();
      const saveBtn = this.dialog.querySelector("#adminSaveBtn");
      saveBtn.innerHTML = `<span>⏳</span> Syncing...`;
      saveBtn.disabled = true;

      try {
        const result = await dataService.saveAllChapters(this.chapters);
        saveBtn.innerHTML = `<span>✓</span> Saved!`;
        this.showToast(result.mode === "realtime" ? "Changes synced to Firebase Realtime Database!" : "Changes saved locally!");
        setTimeout(() => {
          this.close();
          if (this.onChaptersUpdated) {
            this.onChaptersUpdated(this.chapters, this.selectedIndex);
          }
        }, 600);
      } catch (err) {
        alert("Failed to save chapters: " + err.message);
        saveBtn.innerHTML = `<span>💾</span> Save Changes & Sync`;
        saveBtn.disabled = false;
      }
    };
  }

  syncCurrentFormToMemory() {
    const ch = this.chapters[this.selectedIndex];
    if (!ch) return;

    ch.title = this.dialog.querySelector("#chTitle")?.value?.trim() || ch.title;
    ch.cause = this.dialog.querySelector("#chCause")?.value?.trim() || ch.cause;
    ch.goal = Number(this.dialog.querySelector("#chGoal")?.value) || ch.goal;
    ch.raised = Number(this.dialog.querySelector("#chRaised")?.value) || ch.raised;
    ch.ai = this.dialog.querySelector("#chAi")?.value?.trim() || ch.ai;

    const grad1 = this.dialog.querySelector("#chGrad1")?.value || ch.grad?.[0] || "#0a1220";
    const grad2 = this.dialog.querySelector("#chGrad2")?.value || ch.grad?.[1] || "#2a9d8f";
    ch.grad = [grad1, grad2];

    const tagsVal = this.dialog.querySelector("#chTags")?.value || "";
    ch.tags = tagsVal.split(",").map((t) => t.trim()).filter((t) => t.length > 0);

    const imagesVal = this.dialog.querySelector("#chImages")?.value || "";
    ch.images = imagesVal
      .split(/[\n,]/)
      .map(cleanImageUrl)
      .filter((u) => u.length > 0);

    const scenesVal = this.dialog.querySelector("#chScenes")?.value || "";
    ch.scenes = scenesVal
      .split(/\n\s*\n/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const statsVal = this.dialog.querySelector("#chStats")?.value || "";
    ch.stats = statsVal
      .split("\n")
      .map((line) => {
        const parts = line.split("|").map((p) => p.trim());
        return { n: parts[0] || "", l: parts[1] || "" };
      })
      .filter((s) => s.n.length > 0);

    const tiersVal = this.dialog.querySelector("#chTiers")?.value || "";
    ch.tiers = tiersVal
      .split("\n")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
  }

  showToast(message) {
    let toast = document.getElementById("paytalesToast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "paytalesToast";
      toast.className = "vintage-toast";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("visible");
    setTimeout(() => {
      toast.classList.remove("visible");
    }, 3200);
  }

  escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
}
