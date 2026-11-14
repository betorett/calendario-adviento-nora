import { CONFIG, DAYS_DATA } from "./config.js";
import { renderDayExperience } from "./games.js";
import {
  createStateManager,
  getSecretFragmentsState,
  getUnlockCountdownText,
  isDayUnlocked,
  validateCreatorCode,
  validatePin
} from "./state.js";

const stateApi = createStateManager();

const lockScreen = document.getElementById("lock-screen");
const appShell = document.getElementById("app-shell");
const pinForm = document.getElementById("pin-form");
const pinInput = document.getElementById("pin-input");
const pinError = document.getElementById("pin-error");
const pinHintText = document.getElementById("pin-hint-text");

const calendarGrid = document.getElementById("calendar-grid");
const fragmentsSlots = document.getElementById("fragments-slots");
const fragmentsCounter = document.getElementById("fragments-counter");
const creatorIndicator = document.getElementById("creator-indicator");
const footerYear = document.getElementById("footer-year");
const toastBanner = document.getElementById("toast-banner");

const dayDialog = document.getElementById("day-dialog");
const dialogDayBadge = document.getElementById("dialog-day-badge");
const dialogDayTitle = document.getElementById("dialog-day-title");
const dialogDaySubtitle = document.getElementById("dialog-day-subtitle");
const dialogBody = document.getElementById("dialog-body");
const dialogCloseBtn = document.getElementById("dialog-close-btn");

const creatorDialog = document.getElementById("creator-dialog");
const heroTitle = document.querySelector(".hero-title");
const creatorCloseBtn = document.getElementById("creator-close-btn");
const creatorForm = document.getElementById("creator-form");
const creatorCodeInput = document.getElementById("creator-code-input");
const creatorDisableBtn = document.getElementById("creator-disable-btn");
const creatorResetBtn = document.getElementById("creator-reset-btn");
const creatorFeedback = document.getElementById("creator-feedback");

let activeGameCleanup = null;
let toastTimer = null;

/* ==================== ICONOGRAFÍA VECTORIAL EDITORIAL ==================== */
const DOOR_TYPE_SVGS = {
  polaroid: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="12" cy="11.5" r="3.2"/><path d="M16.5 7.5h.01"/></svg>`,
  voucher: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v1a2 2 0 0 0 0 4v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1a2 2 0 0 0 0-4V9z"/><line x1="9" y1="7" x2="9" y2="17" stroke-dasharray="2 2"/></svg>`,
  memory: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="5" width="11" height="14" rx="2"/><path d="M9 3h9a2 2 0 0 1 2 2v12"/></svg>`,
  catcher: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h16a8 8 0 0 1-16 0z"/><path d="M8 7c0-1.5 1-2 1-3M12 7c0-1.5 1-2 1-3M16 7c0-1.5 1-2 1-3"/></svg>`,
  simon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>`,
  whack: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2l2.3 6.7L21 11l-6.7 2.3L12 20l-2.3-6.7L3 11l6.7-2.3L12 2z"/></svg>`,
  wordle: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/></svg>`,
  scratch: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h12l4 6-10 12L2 9z"/><path d="M2 9h20"/></svg>`,
  puzzle: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h4a2 2 0 1 1 4 0h4a1 1 0 0 1 1 1v4a2 2 0 1 1 0 4v4a1 1 0 0 1-1 1h-4a2 2 0 1 0-4 0H4a1 1 0 0 1-1-1v-4a2 2 0 1 0 0-4V8a1 1 0 0 1 1-1z"/></svg>`,
  finale: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/><path d="M7.5 8a2.5 2.5 0 1 1 4.5-1.5V8M16.5 8a2.5 2.5 0 1 0-4.5-1.5V8"/></svg>`
};

const UI_LOCK_SVG = `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>`;
const UI_KEY_SVG = `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="7.5" cy="15.5" r="4"/><path d="m20 3-9 9"/><path d="m15 8 2.5 2.5"/></svg>`;
const UI_CHECK_SVG = `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>`;

const DOOR_GRID_LABELS = {
  1: "Carta y Polaroid",
  2: "Memory de invierno",
  3: "Noche de sofá y peli",
  4: "Wordle I · Clave",
  5: "Rasca viajero",
  6: "Recuerdo Polaroid",
  7: "Desayuno de reina",
  8: "La sopa de Nori",
  9: "Puzzle I · Nosotros",
  10: "Pinche oficial",
  11: "Wordle II",
  12: "Rasca · Mimo y clave",
  13: "Postal del pueblo",
  14: "Luces y campanas",
  15: "Excursión natural",
  16: "Wordle III · Clave",
  17: "Tu mejor sonrisa",
  18: "Capricho dulce",
  19: "Puzzle II · Momento",
  20: "Burrito o burguer",
  21: "Fuera el Grinch",
  22: "Lo mejor del año",
  23: "Último rasca",
  24: "El Cofre Secreto"
};

/* ==================== MODERN WEB GUIDANCE: TOP-LAYER EXIT & LIGHT-DISMISS FALLBACK ==================== */
let supportsDisplayTransition;
function canTransitionDisplay() {
  if (supportsDisplayTransition !== undefined) return supportsDisplayTransition;
  if (!window.CSS?.supports?.("transition-behavior", "allow-discrete") || !document.body) {
    return false;
  }
  const probe = document.createElement("div");
  probe.style.cssText = "transition: display 1s allow-discrete !important; display: block;";
  document.body.appendChild(probe);
  getComputedStyle(probe).display;
  probe.style.display = "none";
  supportsDisplayTransition = getComputedStyle(probe).display === "block";
  probe.remove();
  return supportsDisplayTransition;
}

function supportsTopLayerExit() {
  return Boolean(window.CSS?.supports?.("overlay", "auto") && canTransitionDisplay());
}

async function closeTopLayer(element) {
  if (!element || !element.open) return;
  if (!supportsTopLayerExit()) {
    element.setAttribute("data-closing", "");
    const animations = element.getAnimations({ subtree: true });
    if (animations.length > 0) {
      await Promise.race([
        Promise.allSettled(animations.map((a) => a.finished)),
        new Promise((r) => setTimeout(r, 450))
      ]);
    }
    if (!element.hasAttribute("data-closing")) return;
    element.removeAttribute("data-closing");
  }
  element.close();
}

function setupDialogSupport(dialogEl) {
  dialogEl.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeTopLayer(dialogEl);
  });

  if (!("closedBy" in HTMLDialogElement.prototype)) {
    const outside = (e) => {
      const r = dialogEl.getBoundingClientRect();
      return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    };
    let pressedOutside = false;
    dialogEl.addEventListener("pointerdown", (e) => {
      pressedOutside = outside(e);
    });
    dialogEl.addEventListener("pointerup", (e) => {
      if (pressedOutside && outside(e)) {
        closeTopLayer(dialogEl);
      }
      pressedOutside = false;
    });
  }
}

setupDialogSupport(dayDialog);
setupDialogSupport(creatorDialog);

// Acceso secreto al Modo Creador: 5 toques seguidos en el título principal
let titleTapCount = 0;
let titleTapTimer = null;

function openCreatorModal() {
  if (!creatorDialog.open) {
    creatorDialog.showModal();
  }
}

heroTitle.addEventListener("click", () => {
  titleTapCount += 1;
  clearTimeout(titleTapTimer);
  if (titleTapCount >= 5) {
    titleTapCount = 0;
    openCreatorModal();
    return;
  }
  titleTapTimer = setTimeout(() => {
    titleTapCount = 0;
  }, 2500);
});

dialogCloseBtn.addEventListener("click", () => closeTopLayer(dayDialog));
creatorCloseBtn.addEventListener("click", () => closeTopLayer(creatorDialog));

dayDialog.addEventListener("close", () => {
  dayDialog.removeAttribute("data-closing");
  if (typeof activeGameCleanup === "function") {
    activeGameCleanup();
    activeGameCleanup = null;
  }
  dialogBody.innerHTML = "";
  voiceMessagePlaying = false;
  ensureMusicPlaying();
});

creatorDialog.addEventListener("close", () => {
  creatorDialog.removeAttribute("data-closing");
  creatorFeedback.className = "game-feedback";
  creatorFeedback.textContent = "";
});

/* ==================== CELESTA Y ARPA NAVIDEÑA POLIFÓNICA ("NOCHE DE PAZ" EN RE MAYOR) ==================== */
let musicAudio = null;
let musicObjectUrl = null;
let musicPlayPromise = null;
let musicUnlocked = false;
let voiceMessagePlaying = false;
let soundPersisted = false;

/**
 * Convierte un cifrado en frecuencia exacta en Hz (p. ej. "F#4", "C#5").
 */
function noteToFreq(note) {
  const map = {
    D3: 146.83,
    E3: 164.81,
    "F#3": 185.0,
    G3: 196.0,
    A3: 220.0,
    B3: 246.94,
    "C#4": 277.18,
    D4: 293.66,
    E4: 329.63,
    "F#4": 369.99,
    G4: 392.0,
    A4: 440.0,
    B4: 493.88,
    "C#5": 554.37,
    D5: 587.33,
    E5: 659.25,
    "F#5": 739.99,
    G5: 783.99
  };
  return map[note] || 0;
}

/**
 * Sintetiza un arreglo polifónico en compás 3/4 de "Noche de Paz" con sonido cálido de celesta,
 * arpa de acompañamiento, reverberación envolvente y cola cíclica continua sin cortes al reiniciar.
 */
function createChristmasCarolWavUrl() {
  if (musicObjectUrl) return musicObjectUrl;

  const sampleRate = 22050;
  const beatSec = 0.56; // 3/4 vals tranquilo (~107 pulsos de negra por minuto)
  const totalBeats = 72; // 24 compases completos de 3 tiempos (~40.3s)
  const totalSamples = Math.round(totalBeats * beatSec * sampleRate);

  const mix = new Float32Array(totalSamples);

  // [tiempoInicialEnBeats, nota, volumen, duracionDecaimientoSec, tipoTimbre]
  const events = [];
  const melody = [
    // Compás 1-2: "Noche de paz"
    [0, "A4", 0.34, 1.4],
    [1.5, "B4", 0.25, 0.9],
    [2, "A4", 0.29, 1.1],
    [3, "F#4", 0.32, 1.9],
    // Compás 3-4: "Noche de amor"
    [6, "A4", 0.34, 1.4],
    [7.5, "B4", 0.25, 0.9],
    [8, "A4", 0.29, 1.1],
    [9, "F#4", 0.32, 1.9],
    // Compás 5-8: "Todo duerme en derredor"
    [12, "E5", 0.34, 1.5],
    [14, "E5", 0.27, 1.0],
    [15, "C#5", 0.33, 1.9],
    [18, "D5", 0.34, 1.5],
    [20, "D5", 0.27, 1.0],
    [21, "A4", 0.32, 1.9],
    // Compás 9-12: "Entre los astros que esparcen su luz"
    [24, "B4", 0.32, 1.4],
    [26, "B4", 0.26, 1.0],
    [27, "D5", 0.34, 1.3],
    [28.5, "C#5", 0.26, 0.9],
    [29, "B4", 0.28, 1.1],
    [30, "A4", 0.33, 1.3],
    [31.5, "B4", 0.25, 0.9],
    [32, "A4", 0.28, 1.1],
    [33, "F#4", 0.31, 1.9],
    // Compás 13-16: "Bella anunciando al niñito Jesús"
    [36, "B4", 0.32, 1.4],
    [38, "B4", 0.26, 1.0],
    [39, "D5", 0.34, 1.3],
    [40.5, "C#5", 0.26, 0.9],
    [41, "B4", 0.28, 1.1],
    [42, "A4", 0.33, 1.3],
    [43.5, "B4", 0.25, 0.9],
    [44, "A4", 0.28, 1.1],
    [45, "F#4", 0.31, 1.9],
    // Compás 17-23: "Brilla la estrella de paz"
    [48, "E5", 0.34, 1.4],
    [50, "E5", 0.27, 1.0],
    [51, "G5", 0.35, 1.3],
    [52.5, "E5", 0.26, 0.9],
    [53, "C#5", 0.29, 1.1],
    [54, "D5", 0.35, 1.9],
    [57, "F#5", 0.35, 1.9],
    [60, "D5", 0.31, 1.3],
    [61.5, "A4", 0.25, 0.9],
    [62, "F#4", 0.28, 1.1],
    [63, "A4", 0.31, 1.3],
    [64.5, "G4", 0.25, 0.9],
    [65, "E4", 0.27, 1.1],
    [66, "D4", 0.34, 2.5]
  ];

  for (const [b, note, amp, decay] of melody) {
    events.push([b, note, amp, decay, "celesta"]);
  }

  // Acordes suaves de arpa en arpegio 3/4 por compás (24 compases)
  const barChords = [
    ["D3", "A3", "D4", "F#4"], // 1: D
    ["D3", "A3", "D4", "F#4"], // 2: D
    ["D3", "A3", "D4", "F#4"], // 3: D
    ["D3", "A3", "D4", "F#4"], // 4: D
    ["A3", "C#4", "E4", "G4"], // 5: A7
    ["A3", "C#4", "E4", "G4"], // 6: A7
    ["D3", "A3", "D4", "F#4"], // 7: D
    ["D3", "A3", "D4", "F#4"], // 8: D
    ["G3", "D4", "G4", "B4"], // 9: G
    ["G3", "D4", "G4", "B4"], // 10: G
    ["D3", "A3", "D4", "F#4"], // 11: D
    ["D3", "A3", "D4", "F#4"], // 12: D
    ["G3", "D4", "G4", "B4"], // 13: G
    ["G3", "D4", "G4", "B4"], // 14: G
    ["D3", "A3", "D4", "F#4"], // 15: D
    ["D3", "A3", "D4", "F#4"], // 16: D
    ["A3", "E4", "G4", "A4"], // 17: A7
    ["A3", "E4", "G4", "C#5"], // 18: A7
    ["D3", "A3", "D4", "F#4"], // 19: D
    ["D3", "A3", "D4", "F#4"], // 20: Bmin/D
    ["D3", "A3", "D4", "F#4"], // 21: D
    ["A3", "E4", "G4", "E4"], // 22: A7
    ["D3", "A3", "D4", "F#4"], // 23: D
    ["D3", "A3", "F#4", "A4"] // 24: cadencia en puente suave al inicio
  ];

  barChords.forEach((chord, barIdx) => {
    const startBeat = barIdx * 3;
    const arpOffsets = [0, 0.5, 1.0, 1.5, 2.0, 2.5];
    const pattern = [chord[0], chord[1], chord[2], chord[3], chord[2], chord[1]];
    arpOffsets.forEach((off, step) => {
      const vol = step === 0 ? 0.14 : 0.085;
      events.push([startBeat + off, pattern[step], vol, step === 0 ? 1.85 : 1.15, "harp"]);
    });
  });

  // Sintetizamos cada evento con decaimiento exponencial envolvente y envoltura circular (loop sin clic)
  for (const [beatStart, note, amp, decaySec, timbre] of events) {
    const freq = noteToFreq(note);
    if (!freq) continue;
    const startSample = Math.round(beatStart * beatSec * sampleRate);
    const lenSamples = Math.min(totalSamples, Math.round((decaySec * 3.4) * sampleRate));
    const twoPiF = (2 * Math.PI * freq) / sampleRate;
    const tau = decaySec * sampleRate;

    if (timbre === "celesta") {
      // Ligero desafinado sutil para efecto celesta/coro navideño
      const detuneRatio = (2 * Math.PI * (freq * 1.0022)) / sampleRate;
      const attackLen = Math.round(0.014 * sampleRate);
      for (let i = 0; i < lenSamples; i++) {
        const atk = i < attackLen ? i / attackLen : 1;
        const env = atk * Math.exp((-i * 2.2) / tau);
        const f1 = Math.sin(twoPiF * i);
        const fChorus = Math.sin(detuneRatio * i);
        const f2 = Math.sin(twoPiF * 2 * i) * Math.exp(-i / (sampleRate * 0.24));
        const f3 = Math.sin(twoPiF * 3 * i) * Math.exp(-i / (sampleRate * 0.08));
        const sample = (0.52 * f1 + 0.26 * fChorus + 0.16 * f2 + 0.06 * f3) * env * amp;
        mix[(startSample + i) % totalSamples] += sample;
      }
    } else {
      const attackLen = Math.round(0.02 * sampleRate);
      for (let i = 0; i < lenSamples; i++) {
        const atk = i < attackLen ? i / attackLen : 1;
        const env = atk * Math.exp((-i * 2.5) / tau);
        const f1 = Math.sin(twoPiF * i);
        const f2 = Math.sin(twoPiF * 2 * i) * Math.exp(-i / (sampleRate * 0.35));
        const sample = (0.82 * f1 + 0.18 * f2) * env * amp;
        mix[(startSample + i) % totalSamples] += sample;
      }
    }
  }

  // Cámara de reverberación cálida de 4 ecos circulares + filtro paso bajo suave
  const wet = new Float32Array(totalSamples);
  const taps = [
    [Math.round(0.037 * sampleRate), 0.24],
    [Math.round(0.061 * sampleRate), 0.17],
    [Math.round(0.097 * sampleRate), 0.12],
    [Math.round(0.149 * sampleRate), 0.08]
  ];
  for (let i = 0; i < totalSamples; i++) {
    let rev = mix[i];
    for (const [delay, gain] of taps) {
      rev += mix[(i - delay + totalSamples) % totalSamples] * gain;
    }
    wet[i] = rev;
  }

  const buffer = new ArrayBuffer(44 + totalSamples * 2);
  const view = new DataView(buffer);
  const writeString = (offset, str) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + totalSamples * 2, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, totalSamples * 2, true);

  let prev = wet[totalSamples - 1];
  for (let i = 0; i < totalSamples; i++) {
    // Suavizado tipo fieltro cálido + limitador suave con tanh para evitar saturación
    const filtered = 0.72 * wet[i] + 0.28 * prev;
    prev = filtered;
    const limited = Math.tanh(filtered * 0.9);
    view.setInt16(44 + i * 2, Math.round(limited * 32767), true);
  }

  const blob = new Blob([buffer], { type: "audio/wav" });
  musicObjectUrl = URL.createObjectURL(blob);
  return musicObjectUrl;
}

let unlockListenersAttached = false;

function getMusicAudio() {
  if (!musicAudio) {
    musicAudio = new Audio(createChristmasCarolWavUrl());
    musicAudio.loop = true;
    musicAudio.preload = "auto";
    musicAudio.volume = 0.58;
  }
  return musicAudio;
}

const UNLOCK_EVENTS = ["touchend", "click", "keydown"];
function onUserGestureUnlock() {
  ensureMusicPlaying();
}

function attachMusicUnlockListeners() {
  if (unlockListenersAttached) return;
  unlockListenersAttached = true;
  UNLOCK_EVENTS.forEach((evt) => {
    document.addEventListener(evt, onUserGestureUnlock, { capture: true, passive: true });
  });
}

function detachMusicUnlockListeners() {
  if (!unlockListenersAttached) return;
  unlockListenersAttached = false;
  UNLOCK_EVENTS.forEach((evt) => {
    document.removeEventListener(evt, onUserGestureUnlock, { capture: true });
  });
}

function ensureMusicPlaying() {
  if (!soundPersisted) {
    soundPersisted = true;
    stateApi.setSoundEnabled(true);
  }
  if (voiceMessagePlaying) return;

  try {
    const audio = getMusicAudio();
    if (!audio.paused && musicUnlocked) return;
    if (musicPlayPromise) return;

    const playPromise = audio.play();
    if (playPromise && typeof playPromise.then === "function") {
      musicPlayPromise = playPromise;
      playPromise
        .then(() => {
          musicPlayPromise = null;
          musicUnlocked = true;
          detachMusicUnlockListeners();
        })
        .catch(() => {
          musicPlayPromise = null;
          attachMusicUnlockListeners();
        });
    } else if (!audio.paused) {
      musicUnlocked = true;
      detachMusicUnlockListeners();
    }
  } catch {
    attachMusicUnlockListeners();
  }
}

attachMusicUnlockListeners();

// Pausa la música ambiental mientras suena un audio de Polaroid y la reanuda al terminar
dayDialog.addEventListener(
  "play",
  (e) => {
    if (e.target && e.target.tagName === "AUDIO") {
      voiceMessagePlaying = true;
      if (musicAudio && !musicAudio.paused) {
        musicAudio.pause();
      }
    }
  },
  true
);

["pause", "ended"].forEach((evt) => {
  dayDialog.addEventListener(
    evt,
    (e) => {
      if (e.target && e.target.tagName === "AUDIO" && voiceMessagePlaying) {
        voiceMessagePlaying = false;
        ensureMusicPlaying();
      }
    },
    true
  );
});

document.addEventListener("visibilitychange", () => {
  if (!document.hidden && !voiceMessagePlaying && (!musicAudio || musicAudio.paused)) {
    ensureMusicPlaying();
  }
});

function scheduleIdleAudioWarmup() {
  const run = () => {
    getMusicAudio();
    ensureMusicPlaying();
  };
  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(run, { timeout: 400 });
  } else {
    setTimeout(run, 150);
  }
}

/* ==================== NIEVE PERMANENTE MULTICAPA EN <canvas> ==================== */
const snowCanvas = document.getElementById("snow-canvas");
const snowCtx = snowCanvas.getContext("2d");
let snowflakes = [];
let snowRafId = null;

function resizeSnowCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  snowCanvas.width = Math.floor(window.innerWidth * dpr);
  snowCanvas.height = Math.floor(window.innerHeight * dpr);
  snowCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function createFlakes() {
  const area = window.innerWidth * window.innerHeight;
  const count = Math.max(36, Math.min(95, Math.floor(area / 13000)));
  snowflakes = Array.from({ length: count }, (_, idx) => {
    const depth = idx % 3 === 0 ? 1.35 : idx % 2 === 0 ? 0.9 : 0.55;
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: (1.1 + Math.random() * 1.9) * depth,
      speedY: (0.28 + Math.random() * 0.55) * depth,
      amp: (0.25 + Math.random() * 0.45) * depth,
      phase: Math.random() * Math.PI * 2,
      alpha: 0.16 + 0.34 * depth
    };
  });
}

function drawSnowFrame(ts = 0) {
  const w = window.innerWidth;
  const h = window.innerHeight;
  snowCtx.clearRect(0, 0, w, h);

  const time = ts * 0.001;
  for (const f of snowflakes) {
    f.y += f.speedY;
    f.x += Math.sin(time * 0.75 + f.phase) * f.amp;

    if (f.y > h + 8) {
      f.y = -8;
      f.x = Math.random() * w;
    }
    if (f.x > w + 8) f.x = -8;
    if (f.x < -8) f.x = w + 8;

    snowCtx.beginPath();
    snowCtx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    snowCtx.fillStyle = `rgba(250, 243, 232, ${f.alpha})`;
    snowCtx.fill();
  }
  snowRafId = requestAnimationFrame(drawSnowFrame);
}

function startAlwaysOnSnow() {
  stateApi.setSnowEnabled(true);
  if (snowRafId) cancelAnimationFrame(snowRafId);
  resizeSnowCanvas();
  createFlakes();

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    // Dibuja copos suaves estáticos respetando preferencia de movimiento reducido
    snowCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (const f of snowflakes) {
      snowCtx.beginPath();
      snowCtx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      snowCtx.fillStyle = `rgba(250, 243, 232, ${f.alpha})`;
      snowCtx.fill();
    }
    return;
  }

  snowRafId = requestAnimationFrame(drawSnowFrame);
}

let lastSnowWidth = window.innerWidth;
window.addEventListener("resize", () => {
  const currentWidth = window.innerWidth;
  resizeSnowCanvas();
  if (Math.abs(currentWidth - lastSnowWidth) > 40) {
    lastSnowWidth = currentWidth;
    createFlakes();
  }
});

/* ==================== TOAST INFORMATIVO ==================== */
function showToast(text) {
  toastBanner.textContent = text;
  toastBanner.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastBanner.hidden = true;
  }, 3600);
}

/* ==================== RENDERIZADO DE CÓDICE Y 24 PUERTAS ==================== */
function formatDayNum(day) {
  return String(day).padStart(2, "0");
}

function renderFragmentsTracker() {
  const st = stateApi.getState();
  const fragInfo = getSecretFragmentsState(DAYS_DATA, st.completedDays, st.creatorMode);

  fragmentsCounter.textContent = `${fragInfo.unlockedCount} / ${fragInfo.totalCount} claves`;
  fragmentsSlots.innerHTML = fragInfo.fragments
    .map(
      (f) => `
      <div class="fragment-chip ${f.unlocked ? "is-found" : ""}" title="Día ${f.day}">
        <span class="fragment-chip-letter">${f.unlocked ? f.letter : "·"}</span>
        <span class="fragment-chip-day">Día ${formatDayNum(f.day)}</span>
      </div>
    `
    )
    .join("");
}

function renderCalendarGrid() {
  const st = stateApi.getState();
  const now = new Date();

  creatorIndicator.hidden = !st.creatorMode;
  creatorDisableBtn.hidden = !st.creatorMode;
  footerYear.textContent = String(CONFIG.targetYear);

  calendarGrid.innerHTML = "";

  DAYS_DATA.forEach((dayData) => {
    const unlocked = isDayUnlocked(dayData.day, now, st.creatorMode, CONFIG.targetYear);
    const opened = st.openedDays.includes(dayData.day);
    const completed = st.completedDays.includes(dayData.day);
    const typeSvg = DOOR_TYPE_SVGS[dayData.type] || DOOR_TYPE_SVGS.polaroid;
    const dayPad = formatDayNum(dayData.day);
    const shortLabel = DOOR_GRID_LABELS[dayData.day] || dayData.subtitle || dayData.title;

    const card = document.createElement("article");
    card.className = "door-card";
    if (dayData.day === 24) card.classList.add("is-finale");
    card.classList.add(unlocked ? "is-unlocked" : "is-locked");
    if (opened && unlocked) card.classList.add("is-opened");
    if (completed && unlocked) card.classList.add("is-completed");

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "door-btn";
    btn.setAttribute(
      "aria-label",
      unlocked
        ? `Abrir puerta del día ${dayData.day}: ${dayData.title}`
        : `Puerta del día ${dayData.day} bloqueada`
    );

    const frame = document.createElement("div");
    frame.className = "door-frame";
    frame.innerHTML = `
      <div class="door-inside-header">
        <span class="door-inside-day">${dayPad}</span>
        ${
          dayData.fragmentLetter
            ? `<span class="door-inside-frag">${UI_KEY_SVG}<span>${completed || st.creatorMode ? dayData.fragmentLetter : "?"}</span></span>`
            : ""
        }
      </div>
      <div class="door-inside-center">
        <span class="door-inside-emblem">${typeSvg}</span>
        <span class="door-inside-title">${shortLabel}</span>
      </div>
      <span class="door-inside-status">${
        completed ? `${UI_CHECK_SVG}<span>Completado</span>` : `<span>Abrir</span>`
      }</span>
    `;

    const leaf = document.createElement("div");
    leaf.className = "door-leaf";
    leaf.innerHTML = `
      <div class="door-top">
        <span class="door-meta-label">DIC</span>
        <span class="door-badge-icon">${
          unlocked ? (completed ? UI_CHECK_SVG : typeSvg) : UI_LOCK_SVG
        }</span>
      </div>
      <span class="door-number">${dayPad}</span>
      <div class="door-bottom">
        <span>${unlocked ? "Abrir" : `${dayPad} dic`}</span>
        ${
          dayData.fragmentLetter
            ? `<span class="door-fragment-tag">${UI_KEY_SVG}<span>${completed || st.creatorMode ? dayData.fragmentLetter : "?"}</span></span>`
            : ""
        }
      </div>
    `;

    btn.append(frame, leaf);
    btn.addEventListener("click", () => handleDoorClick(dayData));
    card.appendChild(btn);
    calendarGrid.appendChild(card);
  });

  renderFragmentsTracker();
}

function handleDoorClick(dayData) {
  const st = stateApi.getState();
  const now = new Date();
  const unlocked = isDayUnlocked(dayData.day, now, st.creatorMode, CONFIG.targetYear);

  if (!unlocked) {
    const countdown = getUnlockCountdownText(dayData.day, now, CONFIG.targetYear);
    showToast(`Paciencia, Nori — ${countdown}`);
    return;
  }

  stateApi.markDayOpened(dayData.day);
  renderCalendarGrid();
  openDayModal(dayData);
}

function openDayModal(dayData) {
  if (typeof activeGameCleanup === "function") {
    activeGameCleanup();
    activeGameCleanup = null;
  }

  dialogDayBadge.textContent = `DÍA ${formatDayNum(dayData.day)} DE DICIEMBRE`;
  dialogDayTitle.textContent = dayData.title;
  dialogDaySubtitle.textContent = dayData.subtitle || "";

  activeGameCleanup = renderDayExperience({
    container: dialogBody,
    dayData,
    config: CONFIG,
    stateApi,
    daysData: DAYS_DATA,
    onComplete: (completedDay) => {
      stateApi.markDayCompleted(completedDay.day);
      renderCalendarGrid();
    }
  });

  dayDialog.showModal();
}

/* ==================== PANTALLA DE PIN & MODO CREADOR ==================== */
const wantsCreatorQuery = new URLSearchParams(window.location.search).get("creador") === "1";

function showMainApp(fromUserAction = false) {
  lockScreen.hidden = true;
  appShell.hidden = false;
  renderCalendarGrid();
  if (fromUserAction) {
    ensureMusicPlaying();
  } else {
    scheduleIdleAudioWarmup();
  }
  if (wantsCreatorQuery) {
    openCreatorModal();
  }
}

pinHintText.textContent = CONFIG.pinHint || "Introduce nuestra clave";

pinForm.addEventListener("submit", (e) => {
  e.preventDefault();
  ensureMusicPlaying();
  if (validatePin(pinInput.value, CONFIG.pinCode)) {
    pinError.textContent = "";
    stateApi.unlockIntro();
    showMainApp(true);
  } else {
    pinError.textContent = "Clave incorrecta · Pista: nuestra fecha especial (4 dígitos)";
    pinInput.select();
  }
});

creatorForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (validateCreatorCode(creatorCodeInput.value, CONFIG.creatorCode)) {
    stateApi.setCreatorMode(true);
    creatorCodeInput.value = "";
    creatorFeedback.className = "game-feedback is-success";
    creatorFeedback.textContent =
      "Modo Creador activado. Ya puedes abrir cualquier puerta del 01 al 24.";
    renderCalendarGrid();
  } else {
    creatorFeedback.className = "game-feedback is-hint";
    creatorFeedback.textContent = "Código incorrecto. Pista: el nombre del autor de este regalo.";
  }
});

creatorDisableBtn.addEventListener("click", () => {
  stateApi.setCreatorMode(false);
  creatorFeedback.className = "game-feedback is-hint";
  creatorFeedback.textContent =
    "Modo Creador desactivado. Vuelve a aplicarse el bloqueo real por fecha.";
  renderCalendarGrid();
});

creatorResetBtn.addEventListener("click", () => {
  stateApi.resetAll();
  stateApi.unlockIntro();
  soundPersisted = false;
  ensureMusicPlaying();
  creatorFeedback.className = "game-feedback is-hint";
  creatorFeedback.textContent = "Progreso reiniciado. Todas las puertas han vuelto a cerrarse.";
  renderCalendarGrid();
});

/* ==================== INICIO ==================== */
startAlwaysOnSnow();

if (stateApi.getState().unlockedIntro) {
  showMainApp(false);
} else {
  scheduleIdleAudioWarmup();
}
