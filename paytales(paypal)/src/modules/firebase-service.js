// PayTales: Firebase Realtime Database Integration & Resilient Offline Fallback
import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, onValue, set, runTransaction } from "firebase/database";
import { SAMPLE, APP_CONFIG } from "./sample-data.js";

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCivbXlHEaS6a8_2wz_bp1VkVCRb76TAbQ",
  authDomain: "paytalessam.firebaseapp.com",
  databaseURL: "https://paytalessam-default-rtdb.firebaseio.com",
  projectId: "paytalessam",
  storageBucket: "paytalessam.firebasestorage.app",
  messagingSenderId: "863828465990",
  appId: "1:863828465990:web:2a257d545b0e2fea216d47"
};

const STORAGE_KEY = "paytales_chapters_v2";
const STORAGE_DONATIONS_KEY = "paytales_donor_history_v2";

export class DataService {
  constructor() {
    this.db = null;
    this.app = null;
    this.isOffline = false;
    this.connectionStatus = "connecting"; // 'connecting' | 'online' | 'offline'
    this.listeners = new Set();
    this.chapters = [];
    this.initialized = false;
    this.hasReceivedFirstValue = false;
  }

  // Register state change listener (called whenever chapters or sync status change)
  subscribe(callback) {
    this.listeners.add(callback);
    if (this.chapters.length > 0) {
      callback({
        chapters: this.chapters,
        status: this.connectionStatus,
        isOffline: this.isOffline
      });
    }
    return () => this.listeners.delete(callback);
  }

  notify() {
    for (const listener of this.listeners) {
      try {
        listener({
          chapters: this.chapters,
          status: this.connectionStatus,
          isOffline: this.isOffline
        });
      } catch (e) {
        console.error("[PayTales] Listener error:", e);
      }
    }
  }

  // Format array for database persistence
  toDbAll(chapters) {
    return chapters.map((ch, idx) => ({
      id: ch.id || `chapter-${idx + 1}`,
      title: ch.title || "Untitled Chapter",
      cause: ch.cause || "Relief Mission",
      location: ch.location || "Community Relief Area",
      coords: ch.coords || "10.0000° N, 75.0000° E",
      grad: Array.isArray(ch.grad) ? ch.grad : ["#0a1220", "#2a9d8f"],
      images: Array.isArray(ch.images) ? ch.images : [],
      scenes: Array.isArray(ch.scenes) ? ch.scenes : [],
      ai: ch.ai || "",
      tags: Array.isArray(ch.tags) ? ch.tags : [],
      goal: Number(ch.goal) || 30000,
      raised: Number(ch.raised) || 0,
      stats: Array.isArray(ch.stats) ? ch.stats : [],
      tiers: Array.isArray(ch.tiers) ? ch.tiers : [],
      checkpoints: Array.isArray(ch.checkpoints) ? ch.checkpoints : (SAMPLE[idx]?.checkpoints || []),
      verifiedReports: Array.isArray(ch.verifiedReports) ? ch.verifiedReports : (SAMPLE[idx]?.verifiedReports || [])
    }));
  }

  // Load from local storage or fallback to SAMPLE
  loadLocalChapters() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("[PayTales] Failed to load local storage:", e);
    }
    return JSON.parse(JSON.stringify(SAMPLE));
  }

  saveLocalChapters(chapters) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chapters));
    } catch (e) {
      console.warn("[PayTales] Failed to persist to local storage:", e);
    }
  }

  // Initialize Firebase with 6-second timeout fallback
  async init() {
    // Start with local storage / sample cache immediately so user experiences zero wait time
    this.chapters = this.loadLocalChapters();
    this.notify();

    let timeoutId;
    const timeoutPromise = new Promise((resolve) => {
      timeoutId = setTimeout(() => {
        console.warn(`[PayTales] Firebase connection timed out after ${APP_CONFIG.firebaseTimeoutMs}ms. Falling back to offline mode.`);
        resolve({ timedOut: true });
      }, APP_CONFIG.firebaseTimeoutMs);
    });

    const initFirebasePromise = (async () => {
      try {
        if (!getApps().length) {
          this.app = initializeApp(FIREBASE_CONFIG);
        } else {
          this.app = getApps()[0];
        }
        this.db = getDatabase(this.app);
        const chRef = ref(this.db, "chapters");

        return new Promise((resolve, reject) => {
          onValue(
            chRef,
            (snapshot) => {
              clearTimeout(timeoutId);
              const data = snapshot.val();
              this.hasReceivedFirstValue = true;
              this.isOffline = false;
              this.connectionStatus = "online";

              if (!data) {
                console.log("[PayTales] Database empty. Seeding with 10 SAMPLE chapters...");
                const seedData = this.toDbAll(SAMPLE);
                set(chRef, seedData)
                  .then(() => {
                    this.chapters = seedData;
                    this.saveLocalChapters(seedData);
                    this.notify();
                    resolve({ success: true, seeded: true });
                  })
                  .catch((err) => {
                    console.warn("[PayTales] Seed failed:", err);
                    resolve({ success: true, seeded: false });
                  });
              } else {
                const chaptersArray = Array.isArray(data) ? data : Object.values(data);
                this.chapters = this.normalizeChapters(chaptersArray);
                this.saveLocalChapters(this.chapters);
                this.notify();
                resolve({ success: true });
              }
            },
            (error) => {
              clearTimeout(timeoutId);
              console.warn("[PayTales] Realtime listener error:", error);
              reject(error);
            }
          );
        });
      } catch (err) {
        clearTimeout(timeoutId);
        throw err;
      }
    })();

    try {
      const result = await Promise.race([initFirebasePromise, timeoutPromise]);
      if (result && result.timedOut) {
        this.enableOfflineMode("Connection timeout (> 6s)");
      }
    } catch (error) {
      console.warn("[PayTales] Firebase init error, falling back to offline mode:", error);
      this.enableOfflineMode(error.message);
    }

    this.initialized = true;
  }

  enableOfflineMode(reason = "") {
    this.isOffline = true;
    this.connectionStatus = "offline";
    console.info(`[PayTales] Running in resilient LocalStorage Mode. ${reason}`);
    this.notify();
  }

  normalizeChapters(chapters) {
    return chapters.map((ch, idx) => {
      const sampleFallback = SAMPLE[idx] || SAMPLE[0];
      return {
        id: ch.id || `chapter-${idx + 1}`,
        title: ch.title || sampleFallback.title,
        cause: ch.cause || sampleFallback.cause,
        location: ch.location || sampleFallback.location || "Community Disaster Zone",
        coords: ch.coords || sampleFallback.coords || "10.0000° N, 75.0000° E",
        grad: Array.isArray(ch.grad) && ch.grad.length >= 2 ? ch.grad : sampleFallback.grad,
        images: Array.isArray(ch.images) && ch.images.length ? ch.images : sampleFallback.images,
        scenes: Array.isArray(ch.scenes) && ch.scenes.length ? ch.scenes : sampleFallback.scenes,
        ai: ch.ai || sampleFallback.ai,
        tags: Array.isArray(ch.tags) ? ch.tags : sampleFallback.tags,
        goal: Number(ch.goal) || sampleFallback.goal,
        raised: Number(ch.raised) || sampleFallback.raised,
        stats: Array.isArray(ch.stats) ? ch.stats : sampleFallback.stats,
        tiers: Array.isArray(ch.tiers) ? ch.tiers : sampleFallback.tiers,
        checkpoints: Array.isArray(ch.checkpoints) ? ch.checkpoints : sampleFallback.checkpoints,
        verifiedReports: Array.isArray(ch.verifiedReports) ? ch.verifiedReports : sampleFallback.verifiedReports
      };
    });
  }

  // Atomic donation transaction using runTransaction on `raised`
  async donate(chapterIndex, amount, donorMeta = {}) {
    if (chapterIndex < 0 || chapterIndex >= this.chapters.length) {
      throw new Error("Invalid chapter index");
    }

    const currentCh = this.chapters[chapterIndex];
    const prevRaised = Number(currentCh.raised) || 0;
    const newRaised = prevRaised + Number(amount);

    // Save donor receipt locally
    this.saveDonationRecord({
      chapterIndex,
      chapterTitle: currentCh.title,
      cause: currentCh.cause,
      amount,
      donorName: donorMeta.name || "Anonymous Benefactor",
      dedication: donorMeta.dedication || "",
      timestamp: new Date().toISOString(),
      id: "PT-" + Math.random().toString(36).substring(2, 9).toUpperCase()
    });

    if (this.db && !this.isOffline) {
      try {
        const raisedRef = ref(this.db, `chapters/${chapterIndex}/raised`);
        const result = await runTransaction(raisedRef, (currentValue) => {
          return (Number(currentValue) || 0) + Number(amount);
        });

        if (result.committed) {
          // Firebase listener will trigger update, but update immediate local cache
          currentCh.raised = result.snapshot.val();
          this.saveLocalChapters(this.chapters);
          this.notify();
          return { success: true, raised: currentCh.raised, mode: "realtime" };
        }
      } catch (err) {
        console.warn("[PayTales] Realtime transaction failed, applying local update:", err);
      }
    }

    // Fallback: Local atomic update
    currentCh.raised = newRaised;
    this.saveLocalChapters(this.chapters);
    this.notify();
    return { success: true, raised: newRaised, mode: "local" };
  }

  // Save all chapters (used by Admin CMS modal)
  async saveAllChapters(updatedChapters) {
    const formatted = this.toDbAll(updatedChapters);
    this.chapters = formatted;
    this.saveLocalChapters(formatted);
    this.notify();

    if (this.db && !this.isOffline) {
      try {
        const chRef = ref(this.db, "chapters");
        await set(chRef, formatted);
        return { success: true, mode: "realtime" };
      } catch (err) {
        console.warn("[PayTales] Admin sync to Firebase failed:", err);
        return { success: true, mode: "local-only", error: err.message };
      }
    }
    return { success: true, mode: "local" };
  }

  // Reset to default sample
  async resetToSample() {
    return this.saveAllChapters(SAMPLE);
  }

  // Get user donation history
  getDonationHistory() {
    try {
      const records = localStorage.getItem(STORAGE_DONATIONS_KEY);
      return records ? JSON.parse(records) : [];
    } catch (e) {
      return [];
    }
  }

  saveDonationRecord(record) {
    try {
      const history = this.getDonationHistory();
      history.unshift(record);
      localStorage.setItem(STORAGE_DONATIONS_KEY, JSON.stringify(history.slice(0, 50)));
    } catch (e) {
      console.warn("[PayTales] Failed to record donation:", e);
    }
  }
}

export const dataService = new DataService();
