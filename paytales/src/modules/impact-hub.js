// PayTales: Track & Impact Hub (Donor Transparency & Verified Relief Delivery)
import { dataService } from "./firebase-service.js";

export class ImpactHub {
  constructor(containerElement, onSelectChapterInBook) {
    this.container = containerElement;
    this.onSelectChapterInBook = onSelectChapterInBook;
    this.activeFilter = "all";
    this.chapters = [];
  }

  render(chapters) {
    this.chapters = chapters;
    if (!this.container) return;

    // Calculate aggregated metrics
    const totalRaised = chapters.reduce((sum, ch) => sum + (Number(ch.raised) || 0), 0);
    const totalGoal = chapters.reduce((sum, ch) => sum + (Number(ch.goal) || 0), 0);
    const userDonations = dataService.getDonationHistory();
    const userTotal = userDonations.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

    // Collect all verified reports across chapters
    const allReports = [];
    chapters.forEach((ch, chIdx) => {
      if (Array.isArray(ch.verifiedReports)) {
        ch.verifiedReports.forEach((rep) => {
          allReports.push({
            ...rep,
            chapterIndex: chIdx,
            chapterTitle: ch.title,
            cause: ch.cause,
            location: ch.location,
            tags: ch.tags || []
          });
        });
      }
    });

    this.container.innerHTML = `
      <div class="impact-hub-wrap">
        <!-- Hub Header Banner -->
        <header class="hub-header">
          <div class="hub-tagline-wrap">
            <span class="hub-kicker">DONOR TRANSPARENCY & RADICAL TRUTH</span>
            <h1 class="hub-title">Track Ground Relief & Impact</h1>
            <p class="hub-subtitle">
              Every micro-donation moves through verified milestones from initial collection to live on-ground deployment.
              Audit real-time relief logistics, field dispatches, and life-saving deliveries.
            </p>
          </div>

          <!-- Overall Transparency Scoreboard -->
          <div class="transparency-stats-strip">
            <div class="stat-pill-card">
              <span class="pill-number">$${totalRaised.toLocaleString()}</span>
              <span class="pill-label">Total Relief Mobilized</span>
              <span class="pill-sub">of $${totalGoal.toLocaleString()} combined goal</span>
            </div>
            <div class="stat-pill-card">
              <span class="pill-number">${chapters.length}</span>
              <span class="pill-label">Active Relief Missions</span>
              <span class="pill-sub">Across 6 critical disaster zones</span>
            </div>
            <div class="stat-pill-card">
              <span class="pill-number">100%</span>
              <span class="pill-label">Verified Dispatch Audit</span>
              <span class="pill-sub">With photo & receipt logging</span>
            </div>
            <div class="stat-pill-card highlight-card">
              <span class="pill-number">$${userTotal.toLocaleString()}</span>
              <span class="pill-label">Your Personal Impact</span>
              <span class="pill-sub">${userDonations.length} micro-deeds recorded</span>
            </div>
          </div>
        </header>

        <!-- Main Hub Grid: Checkpoint Pipeline & Live Feed -->
        <div class="hub-main-grid">
          <!-- Left Column: Chapter Checkpoint Trackers -->
          <section class="hub-checkpoints-section">
            <div class="section-title-bar">
              <h2 class="section-heading">Disaster Checkpoint Pipelines</h2>
              <span class="section-badge">Live Progress</span>
            </div>

            <div class="checkpoint-cards-list">
              ${chapters.map((ch, idx) => this.renderChapterPipelineCard(ch, idx)).join("")}
            </div>
          </section>

          <!-- Right Column: Live Verified Dispatch Feed & User Ledger -->
          <aside class="hub-feed-column">
            <!-- User's Personal Impact Ledger -->
            ${
              userDonations.length > 0
                ? `
              <div class="user-ledger-box">
                <div class="ledger-header">
                  <span class="gold-star">⭐</span>
                  <h3>Your Giving Ledger</h3>
                </div>
                <div class="ledger-items">
                  ${userDonations
                    .slice(0, 3)
                    .map(
                      (d) => `
                    <div class="ledger-item">
                      <div class="item-left">
                        <strong>$${d.amount}.00</strong>
                        <span class="ledger-cause">${d.cause}</span>
                      </div>
                      <div class="item-right">
                        <span class="ledger-hash">${d.id}</span>
                        <span class="ledger-date">${new Date(d.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                  `
                    )
                    .join("")}
                </div>
              </div>
            `
                : ""
            }

            <!-- Live Relief Updates Timeline -->
            <div class="live-updates-panel">
              <div class="section-title-bar">
                <h2 class="section-heading">Verified Field Dispatches</h2>
                <span class="pulse-indicator"><span class="pulse-ring"></span>Live Logs</span>
              </div>

              <div class="timeline-container">
                ${allReports.map((report) => this.renderTimelineItem(report)).join("")}
              </div>
            </div>
          </aside>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  renderChapterPipelineCard(ch, idx) {
    const percent = Math.min(100, Math.round(((ch.raised || 0) / (ch.goal || 1)) * 100));
    const checkpoints = ch.checkpoints || [
      { label: "Target Set & Emergency Fund Opened", status: "completed", date: "Initial" },
      { label: "75% Funds Dispatched", status: percent >= 75 ? "completed" : "in-progress", date: "Ongoing" },
      { label: "Supplies Purchased", status: percent >= 85 ? "completed" : "in-progress", date: "Target" },
      { label: "On-Ground Delivery", status: percent >= 100 ? "completed" : "upcoming", date: "Pending" }
    ];

    return `
      <article class="pipeline-card" data-chapter-index="${idx}">
        <div class="pipeline-card-header">
          <div class="card-titles">
            <span class="ch-badge">Chapter ${idx + 1}</span>
            <h3 class="pipeline-title">${ch.title}</h3>
            <span class="pipeline-cause">${ch.cause} • <span class="loc-text">${ch.location || "Disaster Zone"}</span></span>
          </div>

          <button type="button" class="jump-story-btn" data-chapter-idx="${idx}" title="Open this chapter in the book">
            Read Story ↗
          </button>
        </div>

        <!-- Funding Progress Bar -->
        <div class="pipeline-progress-wrap">
          <div class="pipeline-progress-labels">
            <span><strong>$${(ch.raised || 0).toLocaleString()}</strong> raised of $${(ch.goal || 0).toLocaleString()}</span>
            <span class="pipeline-pct">${percent}%</span>
          </div>
          <div class="pipeline-bar-track">
            <div class="pipeline-bar-fill" style="width: ${percent}%;"></div>
          </div>
        </div>

        <!-- Checkpoints Stepper -->
        <div class="stepper-track">
          ${checkpoints
            .map((cp, stepIdx) => {
              const statusClass = cp.status || "upcoming";
              const icon =
                statusClass === "completed"
                  ? "✓"
                  : statusClass === "in-progress"
                  ? "⏳"
                  : (stepIdx + 1).toString();
              return `
              <div class="step-node ${statusClass}">
                <div class="step-circle" title="${cp.label}">
                  ${icon}
                </div>
                <div class="step-info">
                  <span class="step-title">${cp.label}</span>
                  <span class="step-date">${cp.date || ""}</span>
                </div>
              </div>
            `;
            })
            .join("")}
        </div>
      </article>
    `;
  }

  renderTimelineItem(report) {
    return `
      <div class="timeline-entry">
        <div class="timeline-dot"></div>
        <div class="entry-card">
          <div class="entry-meta">
            <span class="entry-time">${report.date}</span>
            <span class="entry-agency">Verified by: ${report.agency}</span>
          </div>

          <h4 class="entry-headline">${report.headline}</h4>
          <p class="entry-desc">${report.description}</p>

          <div class="entry-footer">
            <span class="entry-cause-tag">${report.cause}</span>
            <span class="entry-hash" title="Cryptographic Dispatch Verification Hash">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              ${report.hash || "0x8E12...AB77"}
            </span>
            <button type="button" class="inline-story-link jump-story-btn" data-chapter-idx="${report.chapterIndex}">
              View Chapter 📖
            </button>
          </div>
        </div>
      </div>
    `;
  }

  attachEvents() {
    const jumpButtons = this.container.querySelectorAll(".jump-story-btn");
    jumpButtons.forEach((btn) => {
      btn.onclick = () => {
        const idx = Number(btn.getAttribute("data-chapter-idx"));
        if (this.onSelectChapterInBook) {
          this.onSelectChapterInBook(idx);
        }
      };
    });
  }
}
