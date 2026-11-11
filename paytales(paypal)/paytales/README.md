<div align="center">

<img src="./public/paytales_logo.png" alt="PayTales Official Logo" width="480" />

# PayTales: Turn a Story into Real Impact
### *Story-Driven Micro-Donation Platform for Rural Tragedies & Climate Disasters*

[![Vite](https://img.shields.io/badge/Vite-8.3.7-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Firebase Realtime Database](https://img.shields.io/badge/Firebase-RTDB%20Sync-FFA611?style=for-the-badge&logo=firebase&logoColor=white)](https://firebase.google.com/)
[![Web Audio API](https://img.shields.io/badge/Web_Audio-Procedural_Sound-2a9d8f?style=for-the-badge)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
[![License: MIT](https://img.shields.io/badge/License-MIT-c9a96e?style=for-the-badge)](LICENSE)

**PayTales** bridges humanitarian crisis storytelling and direct grassroots micro-giving inside an interactive, vintage 3D split-screen digital book interface.

[Explore Live Demo](http://localhost:3000) • [Architecture Guide](file:///C:/Users/HP/.gemini/antigravity/brain/95e62347-87f2-450d-a6ac-c8ec38befbb3/paytales_architecture.md) • [Report Issue](https://github.com/paytales/paytales/issues)

</div>

---

## 📖 Table of Contents
- [Philosophy & Purpose](#-philosophy--purpose)
- [Key Features](#-key-features)
  - [1. 3D Split-Screen Digital Book Experience](#1-3d-split-screen-digital-book-experience)
  - [2. Circular Liquid Progress Vessel (#meter)](#2-circular-liquid-progress-vessel-meter)
  - [3. Track & Impact Hub (Donor Transparency Page)](#3-track--impact-hub-donor-transparency-page)
  - [4. Realtime Database & 6-Second Offline Fallback](#4-realtime-database--6-second-offline-fallback)
  - [5. Administrative CMS Modal](#5-administrative-cms-modal)
  - [6. Procedural Web Audio Sound Engine](#6-procedural-web-audio-sound-engine)
- [Design System & Typography](#-design-system--typography)
- [Project Architecture & File Tree](#-project-architecture--file-tree)
- [Pre-Loaded Disaster Chronicles (10 Chapters)](#-pre-loaded-disaster-chronicles-10-chapters)
- [Installation & Quickstart](#-installation--quickstart)
- [Keyboard Controls & Navigation](#-keyboard-controls--navigation)
- [Firebase Realtime Database Configuration](#-firebase-realtime-database-configuration)
- [License](#-license)

---

## 💡 Philosophy & Purpose

Traditional donation platforms suffer from **donor numbness**: detached rows of statistics, sterile transactional gateways, and zero emotional resonance. 

**PayTales** inverts this dynamic:
1. **Stories First**: Every relief campaign is experienced as a chapter of living human resilience.
2. **Tactile Interaction**: Users physically turn pages, watch liquid rise in a glass vessel, and hear parchment rustle.
3. **Tangible Micro-Tiers**: Donors choose exact outcomes ($5 emergency blankets, $10 family meals, $25 temporary housing units) rather than abstract percentages.
4. **Radical Transparency**: Every micro-deed routes into a multi-stage logistics pipeline with GPS tracking and cryptographic verification hashes.

---

## ✨ Key Features

### 1. 3D Split-Screen Digital Book Experience
- **Interactive 3D Hardcover**: Bound in deep midnight leather with dual gold foil filigree, rotating celestial medallion, and an **"Open the book"** trigger that executes a smooth 3D perspective rotation (`rotateY(-112deg)`) with authentic leather acoustics.
- **Center Spine Crease**: Realistic ambient shadow falloff, paper thickness bevel, and dimensional book depth (`perspective: 2600px`).
- **3D Leaf Flipping**: Switching chapters activates GPU-accelerated page flips with directional shadows (`rotateY(-180deg)`).
- **Left Page (Narrative Hub)**:
  - Dynamic ambient imagery blurred with disaster-specific background gradients.
  - **Automated Scene Player**: Sequential scene cards with line-by-line staggered animation reveals (`fadeSlideUp`), Play/Pause controls, dynamic progress fill bar (`#sceneProgressBar`), and optional Web Speech narration voice (`🎙️`).
  - **AI Dedication Badge**: Contextual dedication prompt to honor loved ones with each gift.
- **Right Page (Impact & Donation Hub)**:
  - Circular liquid meter progress vessel (`#meter`).
  - 3 live statistics metrics (e.g., *850+ families relocated*, *2,400 medical kits*).
  - Interactive donation tier cards ($5, $10, $25) with dynamic impact summaries.
  - Simulated **PayPal Sandbox** checkout with spinner state, confetti celebration, and an **Official Certificate of Direct Impact**.

### 2. Circular Liquid Progress Vessel (`#meter`)
- Vintage gilded brass bezel rim with metallic tick markings.
- Spherical glass enclosure with specular reflection sheen and rising micro-bubbles.
- **Dual-wave SVG fluid keyframes** (`.wave-front` and `.wave-back`) that dynamically calibrate wave amplitude and water height based on `% funded` (`raised / goal`).
- Prominent luxury serif percentage readout and live funding dollar figures.

### 3. Track & Impact Hub (Donor Transparency Page)
Toggleable via **"📍 Track Impact"** in the top navigation bar:
- **Disaster Checkpoint Steppers**:
  - `Stage 1: Target Set & Emergency Fund Opened`
  - `Stage 2: 75% Funds Dispatched to Local First Responders`
  - `Stage 3: Supplies & Hardware Purchased`
  - `Stage 4: On-Ground Delivery & Verification`
- **Verified Field Dispatches Feed**:
  - Live relief convoy updates with timestamps, authorized agency badges (e.g., *Kerala Voluntary Disaster Force*, *Delta Water Guardians*), and cryptographic verification hashes (`0x8F3b...9E21`).
  - One-click `Read Story ↗` links jumping straight into that story in the Book Reader.
- **Personal Giving Ledger**:
  - Tracks user micro-donations in the current session with printable, high-resolution impact certificates.

### 4. Realtime Database & 6-Second Offline Fallback
- Direct synchronization with **Firebase Realtime Database** via `onValue` listeners.
- Atomic updates executed via `runTransaction` on `chapters/{id}/raised` to prevent race conditions during concurrent donations.
- **Resilient Fallback Mechanism**: If Firebase fails or exceeds $6\text{ seconds}$, the application gracefully transitions to `localStorage` offline mode with a live header badge (`🟢 Realtime RTDB` vs `🟠 Local Sync Mode`).

### 5. Administrative CMS Modal
- Header button **"🗝️ Edit chapters"** opens `<dialog id="admin">`.
- Full administrative CRUD controls:
  - Select existing chapter or click **"+ Add Chapter"**.
  - Modify `title`, `cause`, `images` (newline/comma URL list), `scenes` (separated by double newlines `\n\n`), `ai` prompt, `tags`, `goal`, `raised`, `stats` (`Value | Label` syntax), and `tiers`.
  - Atmospheric gradient color pickers (`grad[0]`, `grad[1]`).
  - **Save Changes & Sync**: Broadcasts updates to Firebase (`set(chRef, toDbAll(chapters))`) or local storage.
  - **Reset to Sample Data**: One-click restore to the 10 official pre-loaded disaster chronicles.

### 6. Procedural Web Audio Sound Engine
Zero external MP3 dependencies. Uses Web Audio API synthesis for zero latency and guaranteed uptime:
- **Page Turn**: Bandpass-filtered brownian noise with envelope shaping mimicking crisp parchment.
- **Book Open**: Resonant leather creak using pitch-modulated oscillator sweeps.
- **Donation Chime**: Celestial pentatonic harp chords ($C_5, E_5, G_5, C_6, E_6$) with harmonic decay.
- **Ambient Rain/Wind Generator**: Pink noise filtered through a $600\text{ Hz}$ low-pass filter with volume ramping.

---

## 🎨 Design System & Typography

| Color Token | Hex Code | Purpose |
| :--- | :--- | :--- |
| **Midnight Base** | `#0a1220` / `#060b14` | Atmospheric background and leather hardcover base |
| **Gold Primary** | `#c9a96e` | Foil borders, chapter kickers, active accents |
| **Gold Light** | `#e3c57a` / `#fdf2d0` | Medallion glow, illuminated buttons, headlines |
| **Sea Teal Primary** | `#2a9d8f` | Liquid meter fluid, verified badges, action buttons |
| **Sea Teal Deep** | `#0e6a6a` | Wave gradient base, dark accents, contrast tags |
| **Parchment Cream** | `#fdfaf4` / `#f5f0e3` | Book page leaf background and printed certificates |

### Typography
- **Headers & Titlecraft**: [**Fraunces**](https://fonts.google.com/specimen/Fraunces) (Soft, luxury optical-size serif, weights 300–900).
- **Body & Metrics**: [**Figtree**](https://fonts.google.com/specimen/Figtree) (Clean, contemporary geometric sans-serif).

---

## 📁 Project Architecture & File Tree

```
paytales/
├── index.html                  # Master HTML shell & dialog container
├── vite.config.js              # Vite bundler & development server config
├── package.json                # Project dependencies & npm scripts
├── public/
│   ├── paytales_logo.png       # Official PayTales brand logo
│   └── favicon.svg             # SVG gilded book icon
└── src/
    ├── main.js                 # Application coordinator & event dispatcher
    ├── styles/
    │   ├── main.css            # Midnight theme, top navigation, resets
    │   ├── book.css            # 3D perspective book, cover, split pages
    │   ├── liquid-meter.css    # Circular #meter vessel, wave animations
    │   ├── impact-hub.css      # Donor transparency pipelines & timelines
    │   └── admin.css           # Admin CMS dialog, checkout & certificate
    └── modules/
        ├── sample-data.js      # 10 official disaster chronicles & impact logs
        ├── firebase-service.js # RTDB listeners, atomic transactions, 6s fallback
        ├── sound-effects.js    # Procedural Web Audio API sound synthesizer
        ├── liquid-meter.js     # Circular liquid progress meter controller
        ├── scene-player.js     # Staggered narrative scene player & TTS
        ├── book-controller.js  # 3D book cover, leaf flips, split-screen UI
        ├── checkout-modal.js   # Simulated PayPal sandbox & impact certificate
        ├── admin-cms.js        # Administrative CMS dialog (<dialog id="admin">)
        └── impact-hub.js       # Track & Impact Hub transparency component
```

---

## 📚 Pre-Loaded Disaster Chronicles (10 Chapters)

1. **Chapter I**: *When the Hills Fell Asleep* — Wayanad Landslide Relief (Kerala, India)
2. **Chapter II**: *The Water That Breathes Salt* — Sundarbans Cyclone Recovery (West Bengal)
3. **Chapter III**: *The Sky Breaks Open* — Himachal Cloudburst Recovery (Himachal Pradesh)
4. **Chapter IV**: *Dust Before Rain* — Horn of Africa Drought Relief (Turkana & Wajir, Kenya)
5. **Chapter V**: *When the Earth Shivered at Noon* — Afghan Rural Earthquake Relief (Herat, Afghanistan)
6. **Chapter VI**: *The Mountain That Came Down* — Rural Vietnam Typhoon Relief (Lao Cai, Vietnam)
7. **Chapter VII**: *The Empty Bowl of Baidoa* — Somalia Child Malnutrition Emergency (Bay Region, Somalia)
8. **Chapter VIII**: *The School That Floated Away* — Rural Assam Flood Education & Relief (Majuli Island, Assam)
9. **Chapter IX**: *The Classroom on the River* — Bangladesh Climate-Resilient Education (Chalan Beel, Bangladesh)
10. **Chapter X**: *The Van That Arrived Before Dawn* — Remote Maternal & Infant Health Care (Cachar Tea Gardens, Assam)

---

## 🚀 Installation & Quickstart

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.0.0 or higher)
- npm (version 9.0.0 or higher)

### Setup Steps
```bash
# 1. Navigate to the project directory
cd C:\Users\HP\.gemini\antigravity\scratch\paytales

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Open in your browser
# Navigate to: http://localhost:3000
```

### Production Build
```bash
# Build optimized static distribution
npm run build

# Preview production build locally
npm run preview
```

---

## ⌨️ Keyboard Controls & Navigation

| Key | Action |
| :--- | :--- |
| <kbd>Space</kbd> | Opens the 3D hardcover book from the cover screen |
| <kbd>→</kbd> | Flips forward to the next chapter |
| <kbd>←</kbd> | Flips backward to the previous chapter |
| <kbd>Esc</kbd> | Closes any open dialog modal (Admin CMS, Checkout, Table of Contents) |

---

## 🔒 Firebase Realtime Database Configuration

The application is configured to connect to:
```javascript
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCivbXlHEaS6a8_2wz_bp1VkVCRb76TAbQ",
  authDomain: "paytalessam.firebaseapp.com",
  databaseURL: "https://paytalessam-default-rtdb.firebaseio.com",
  projectId: "paytalessam",
  storageBucket: "paytalessam.firebasestorage.app",
  messagingSenderId: "863828465990",
  appId: "1:863828465990:web:2a257d545b0e2fea216d47"
};
```
If you wish to point to your own Firebase instance, modify `FIREBASE_CONFIG` inside [`src/modules/firebase-service.js`](file:///C:/Users/HP/.gemini/antigravity/scratch/paytales/src/modules/firebase-service.js).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — feel free to adapt, extend, and deploy for humanitarian relief initiatives worldwide.

<div align="center">
  <sub>Built with care for climate resilience and grassroots humanitarian impact.</sub>
</div>
