// PayTales: Simulated PayPal Sandbox & Micro-Donation Checkout Experience
import confetti from "canvas-confetti";
import { sounds } from "./sound-effects.js";
import { dataService } from "./firebase-service.js";

export class CheckoutModal {
  constructor(onDonationComplete) {
    this.onDonationComplete = onDonationComplete;
    this.currentChapter = null;
    this.chapterIndex = 0;
    this.selectedTier = 10;
    this.customAmount = null;
    this.isProcessing = false;
    this.initModal();
  }

  initModal() {
    let dialog = document.getElementById("checkoutDialog");
    if (!dialog) {
      dialog = document.createElement("dialog");
      dialog.id = "checkoutDialog";
      dialog.className = "vintage-modal checkout-modal";
      document.body.appendChild(dialog);
    }
    this.dialog = dialog;

    // Close on backdrop click
    this.dialog.addEventListener("click", (e) => {
      const rect = this.dialog.getBoundingClientRect();
      const inDialog =
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width;
      if (!inDialog && !this.isProcessing) {
        this.close();
      }
    });
  }

  open(chapter, chapterIndex, preselectedAmount = 10) {
    this.currentChapter = chapter;
    this.chapterIndex = chapterIndex;
    this.selectedTier = preselectedAmount;
    this.customAmount = null;
    this.render();
    this.dialog.showModal();
    document.body.classList.add("modal-open");
  }

  close() {
    this.dialog.close();
    document.body.classList.remove("modal-open");
  }

  getEffectiveAmount() {
    if (this.customAmount && this.customAmount > 0) {
      return Number(this.customAmount);
    }
    return Number(this.selectedTier) || 10;
  }

  getImpactSummary(amount) {
    const ch = this.currentChapter;
    if (!ch) return "Your contribution funds essential crisis relief.";
    if (amount <= 5) return ch.tiers[0] || "$5 buys emergency blanket and trauma care supplies.";
    if (amount <= 15) return ch.tiers[1] || "$10 funds warm meals for a family for 3 days.";
    return ch.tiers[2] || "$25 helps rebuild critical community survival infrastructure.";
  }

  render() {
    const ch = this.currentChapter;
    if (!ch) return;

    const amount = this.getEffectiveAmount();
    const impactText = this.getImpactSummary(amount);
    const aiPrompt = ch.ai || "Dedicate your micro-donation in honor of someone special.";

    this.dialog.innerHTML = `
      <div class="modal-card">
        <!-- Golden ornamental header border -->
        <div class="modal-header-ornament">
          <span class="gold-gem">◆</span>
          <span class="ornament-line"></span>
          <span class="gold-crown">👑</span>
          <span class="ornament-line"></span>
          <span class="gold-gem">◆</span>
        </div>

        <button class="modal-close-btn" id="closeCheckoutBtn" aria-label="Close dialog">✕</button>

        <div class="checkout-header">
          <span class="checkout-sub">PAYTALES MICRO-DONATION</span>
          <h2 class="checkout-title">${ch.title}</h2>
          <p class="checkout-cause">Relief for: <strong>${ch.cause}</strong></p>
        </div>

        <!-- Tier Selection Pills -->
        <div class="tier-selector-group">
          <label class="tier-group-label">Select Impact Tier:</label>
          <div class="tier-pills">
            <button type="button" class="tier-pill ${this.selectedTier === 5 && !this.customAmount ? 'active' : ''}" data-amount="5">
              <span class="pill-val">$5</span>
              <span class="pill-sub">Emergency</span>
            </button>
            <button type="button" class="tier-pill ${this.selectedTier === 10 && !this.customAmount ? 'active' : ''}" data-amount="10">
              <span class="pill-badge">Most Chosen</span>
              <span class="pill-val">$10</span>
              <span class="pill-sub">Sustenance</span>
            </button>
            <button type="button" class="tier-pill ${this.selectedTier === 25 && !this.customAmount ? 'active' : ''}" data-amount="25">
              <span class="pill-val">$25</span>
              <span class="pill-sub">Shelter</span>
            </button>
            <button type="button" class="tier-pill ${this.customAmount ? 'active' : ''}" id="tierCustomBtn">
              <span class="pill-val">Custom</span>
              <span class="pill-sub">Amount</span>
            </button>
          </div>

          <!-- Custom Amount Box (Hidden by default unless selected) -->
          <div class="custom-amount-wrap ${this.customAmount ? 'show' : ''}" id="customAmountWrap">
            <span class="currency-prefix">$</span>
            <input type="number" id="customAmountInput" min="1" max="10000" placeholder="Enter custom amount" value="${this.customAmount || ''}">
          </div>
        </div>

        <!-- Dynamic Impact Summary Box -->
        <div class="dynamic-impact-card">
          <div class="impact-badge">
            <svg class="feather-leaf" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
            </svg>
            DIRECT IMPACT FOR $${amount}
          </div>
          <p class="impact-desc-text" id="dynamicImpactDesc">${impactText}</p>
        </div>

        <!-- AI Dedication & Donor Details -->
        <form id="checkoutForm" class="checkout-form" onsubmit="return false;">
          <div class="form-row">
            <label for="donorName">Your Name / Alias (Optional)</label>
            <input type="text" id="donorName" placeholder="e.g., Sarah Chen or A Grateful Reader" maxlength="50" autocomplete="name">
          </div>

          <div class="form-row ai-dedication-field">
            <label for="donorDedication">
              <span class="ai-sparkle-icon">✨</span>
              ${aiPrompt}
            </label>
            <input type="text" id="donorDedication" placeholder="e.g., In memory of Grandmother Mary, or For Chooralmala children" maxlength="90">
          </div>

          <!-- Payment Methods -->
          <div class="payment-action-zone">
            <!-- Simulated PayPal Sandbox Button -->
            <button type="button" id="payPalSandboxBtn" class="paypal-sandbox-btn">
              <div class="btn-spinner" id="paypalSpinner"></div>
              <div class="paypal-content-wrap">
                <span class="paypal-word">Pay<span class="pal-blue">Pal</span></span>
                <span class="sandbox-tag">SANDBOX SECURE</span>
              </div>
            </button>

            <!-- Instant One-Click Micro-Donation -->
            <button type="button" id="directCardBtn" class="direct-card-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect width="20" height="14" x="2" y="5" rx="2"/>
                <line x1="2" x2="22" y1="10" y2="10"/>
              </svg>
              Quick Give $${amount} with Simulated Card
            </button>

            <div class="trust-footer">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <span>100% of micro-donations directly route to verified field supplies • Sandbox Mode Enabled</span>
            </div>
          </div>
        </form>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    const closeBtn = this.dialog.querySelector("#closeCheckoutBtn");
    if (closeBtn) closeBtn.onclick = () => this.close();

    // Tier pills
    const pills = this.dialog.querySelectorAll(".tier-pill[data-amount]");
    pills.forEach((pill) => {
      pill.onclick = () => {
        const val = Number(pill.getAttribute("data-amount"));
        this.selectedTier = val;
        this.customAmount = null;
        this.render();
      };
    });

    const customBtn = this.dialog.querySelector("#tierCustomBtn");
    const customWrap = this.dialog.querySelector("#customAmountWrap");
    const customInput = this.dialog.querySelector("#customAmountInput");

    if (customBtn && customInput) {
      customBtn.onclick = () => {
        customWrap.classList.add("show");
        customInput.focus();
      };

      customInput.oninput = (e) => {
        const val = Math.max(1, Number(e.target.value) || 1);
        this.customAmount = val;
        const desc = this.dialog.querySelector("#dynamicImpactDesc");
        if (desc) desc.textContent = this.getImpactSummary(val);
        const cardBtn = this.dialog.querySelector("#directCardBtn");
        if (cardBtn) cardBtn.innerHTML = `Quick Give $${val} with Simulated Card`;
      };
    }

    // PayPal button
    const ppBtn = this.dialog.querySelector("#payPalSandboxBtn");
    if (ppBtn) {
      ppBtn.onclick = () => this.executePayment("paypal");
    }

    const cardBtn = this.dialog.querySelector("#directCardBtn");
    if (cardBtn) {
      cardBtn.onclick = () => this.executePayment("card");
    }
  }

  async executePayment(method) {
    if (this.isProcessing) return;
    this.isProcessing = true;

    const ppBtn = this.dialog.querySelector("#payPalSandboxBtn");
    const cardBtn = this.dialog.querySelector("#directCardBtn");
    const spinner = this.dialog.querySelector("#paypalSpinner");

    if (method === "paypal") {
      if (ppBtn) ppBtn.classList.add("loading");
      if (spinner) spinner.style.display = "block";
    } else {
      if (cardBtn) cardBtn.classList.add("loading");
    }

    const donorName = this.dialog.querySelector("#donorName")?.value?.trim() || "Kindhearted Benefactor";
    const dedication = this.dialog.querySelector("#donorDedication")?.value?.trim() || "";
    const amount = this.getEffectiveAmount();

    // Simulate realistic 1.4s gateway verification
    await new Promise((res) => setTimeout(res, 1400));

    try {
      const result = await dataService.donate(this.chapterIndex, amount, {
        name: donorName,
        dedication: dedication
      });

      this.isProcessing = false;
      this.close();

      // Trigger multi-cannon celebration confetti
      this.fireConfetti();
      sounds.playDonationChime();

      // Display official Impact Certificate modal
      this.showReceiptCertificate({
        donorName,
        dedication,
        amount,
        chapter: this.currentChapter,
        txId: "PT-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        mode: result.mode
      });

      if (this.onDonationComplete) {
        this.onDonationComplete(result);
      }
    } catch (err) {
      this.isProcessing = false;
      alert("Donation simulation error: " + err.message);
      if (ppBtn) ppBtn.classList.remove("loading");
      if (cardBtn) cardBtn.classList.remove("loading");
      if (spinner) spinner.style.display = "none";
    }
  }

  fireConfetti() {
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#c9a96e", "#e3c57a", "#2a9d8f", "#ffffff"]
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#c9a96e", "#e3c57a", "#2a9d8f", "#ffffff"]
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }

  showReceiptCertificate(data) {
    let certDialog = document.getElementById("certificateDialog");
    if (!certDialog) {
      certDialog = document.createElement("dialog");
      certDialog.id = "certificateDialog";
      certDialog.className = "vintage-modal cert-modal";
      document.body.appendChild(certDialog);
    }

    certDialog.innerHTML = `
      <div class="certificate-frame">
        <div class="cert-outer-border">
          <div class="cert-inner-border">
            <button class="cert-close-btn" id="closeCertBtn">✕</button>

            <div class="cert-header">
              <div class="cert-emblem">📜</div>
              <span class="cert-super">OFFICIAL CERTIFICATE OF DIRECT IMPACT</span>
              <h1 class="cert-title">PayTales Verified Deed</h1>
              <p class="cert-sub">Presented with profound gratitude to</p>
              <h2 class="cert-recipient">${data.donorName}</h2>
            </div>

            <div class="cert-body">
              <p class="cert-text">
                For the generous contribution of <strong>$${data.amount}.00 USD</strong> toward:
              </p>
              <div class="cert-cause-badge">
                ${data.chapter.cause} — <em>"${data.chapter.title}"</em>
              </div>

              ${
                data.dedication
                  ? `<div class="cert-dedication-box">
                      <span class="ded-quote">“</span>
                      <span>${data.dedication}</span>
                      <span class="ded-quote">”</span>
                    </div>`
                  : ""
              }

              <div class="cert-meta-grid">
                <div>
                  <span class="meta-label">DISPATCH HASH</span>
                  <span class="meta-val">${data.txId}</span>
                </div>
                <div>
                  <span class="meta-label">DATE RECORDED</span>
                  <span class="meta-val">${data.date}</span>
                </div>
                <div>
                  <span class="meta-label">DATABASE SYNC</span>
                  <span class="meta-val green-text">${data.mode === 'realtime' ? '🟢 Realtime RTDB' : '🟠 Local Verified'}</span>
                </div>
              </div>
            </div>

            <div class="cert-footer">
              <div class="cert-seal">
                <div class="seal-ring">VERIFIED</div>
                <div class="seal-inner">★</div>
              </div>
              <div class="cert-actions">
                <button class="gold-action-btn" id="printCertBtn">🖨️ Print / Save Certificate</button>
                <button class="ghost-btn" id="doneCertBtn">Back to Story</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    certDialog.showModal();

    certDialog.querySelector("#closeCertBtn").onclick = () => certDialog.close();
    certDialog.querySelector("#doneCertBtn").onclick = () => certDialog.close();
    certDialog.querySelector("#printCertBtn").onclick = () => window.print();
  }
}
