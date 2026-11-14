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

const soundToggleBtn = document.getElementById("sound-toggle-btn");
const snowToggleBtn = document.getElementById("snow-toggle-btn");

const dayDialog = document.getElementById("day-dialog");
const dialogDayBadge = document.getElementById("dialog-day-badge");
const dialogDayTitle = document.getElementById("dialog-day-title");
const dialogDaySubtitle = document.getElementById("dialog-day-subtitle");
const dialogBody = document.getElementById("dialog-body");
const dialogCloseBtn = document.getElementById("dialog-close-btn");

const creatorDialog = document.getElementById("creator-dialog");
const creatorOpenBtn = document.getElementById("creator-open-btn");
const creatorCloseBtn = document.getElementById("creator-close-btn");
const creatorForm = document.getElementById("creator-form");
const creatorCodeInput = document.getElementById("creator-code-input");
const creatorDisableBtn = document.getElementById("creator-disable-btn");
const creatorResetBtn = document.getElementById("creator-reset-btn");
const creatorFeedback = document.getElementById("creator-feedback");

let activeGameCleanup = null;
let toastTimer = null;

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
  // Intercepta Esc / light-dismiss nativo para animar la salida cuando falte overlay/display transition
  dialogEl.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeTopLayer(dialogEl);
  });

  // Fallback para navegadores sin closedby (ej. Safari): detectar clic fuera de los límites del diálogo
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

// Fallback por si el navegador no soporta declarative command="show-modal" / commandfor
if (!("commandForElement" in HTMLButtonElement.prototype)) {
  creatorOpenBtn.addEventListener("click", () => {
    if (!creatorDialog.open) {
      creatorDialog.showModal();
    }
  });
}

dialogCloseBtn.addEventListener("click", () => closeTopLayer(dayDialog));
creatorCloseBtn.addEventListener("click", () => closeTopLayer(creatorDialog));

dayDialog.addEventListener("close", () => {
  dayDialog.removeAttribute("data-closing");
  if (typeof activeGameCleanup === "function") {
    activeGameCleanup();
    activeGameCleanup = null;
  }
  dialogBody.innerHTML = "";
});

creatorDialog.addEventListener("close", () => {
  creatorDialog.removeAttribute("data-closing");
  creatorFeedback.className = "game-feedback";
  creatorFeedback.textContent = "";
});

/* ==================== MELODÍA NAVIDEÑA SUAVE (WEB AUDIO API SIN MP3 EXTERNOS) ==================== */
let audioCtx = null;
let musicInterval = null;
let noteIndex = 0;

const CAROLS_NOTES = [
  329.63, 329.63, 329.63, 0,
  329.63, 329.63, 329.63, 0,
  329.63, 392.0, 261.63, 293.66, 329.63, 0,
  349.23, 349.23, 349.23, 349.23,
  349.23, 329.63, 329.63, 329.63,
  392.0, 392.0, 349.23, 293.66, 261.63, 0
];

function playSoftNote(freq) {
  if (!freq || !audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.045, audioCtx.currentTime + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.42);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.45);
}

function setMusicPlaying(enabled) {
  stateApi.setSoundEnabled(enabled);
  soundToggleBtn.setAttribute("aria-pressed", String(enabled));
  soundToggleBtn.classList.toggle("is-active", enabled);
  soundToggleBtn.textContent = enabled ? "🔊 Música ON" : "🔇 Música";

  if (musicInterval) {
    clearInterval(musicInterval);
    musicInterval = null;
  }

  if (enabled) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    if (!audioCtx) audioCtx = new AudioContextClass();
    if (audioCtx.state === "suspended") audioCtx.resume();
    musicInterval = setInterval(() => {
      playSoftNote(CAROLS_NOTES[noteIndex % CAROLS_NOTES.length]);
      noteIndex += 1;
    }, 380);
  }
}

soundToggleBtn.addEventListener("click", () => {
  const next = !stateApi.getState().soundEnabled;
  setMusicPlaying(next);
});

/* ==================== NIEVE ANIMADA EN <canvas> ==================== */
const snowCanvas = document.getElementById("snow-canvas");
const snowCtx = snowCanvas.getContext("2d");
let snowflakes = [];
let snowRafId = null;

function resizeSnowCanvas() {
  snowCanvas.width = window.innerWidth;
  snowCanvas.height = window.innerHeight;
}

function createFlakes() {
  const count = Math.min(85, Math.floor((window.innerWidth * window.innerHeight) / 14000));
  snowflakes = Array.from({ length: Math.max(28, count) }, () => ({
    x: Math.random() * snowCanvas.width,
    y: Math.random() * snowCanvas.height,
    r: 1.2 + Math.random() * 2.8,
    speedY: 0.35 + Math.random() * 0.9,
    drift: (Math.random() - 0.5) * 0.45,
    alpha: 0.3 + Math.random() * 0.55
  }));
}

function drawSnowFrame() {
  snowCtx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);
  for (const f of snowflakes) {
    f.y += f.speedY;
    f.x += f.drift;
    if (f.y > snowCanvas.height + 6) {
      f.y = -6;
      f.x = Math.random() * snowCanvas.width;
    }
    if (f.x > snowCanvas.width + 6) f.x = -6;
    if (f.x < -6) f.x = snowCanvas.width + 6;

    snowCtx.beginPath();
    snowCtx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    snowCtx.fillStyle = `rgba(255, 248, 236, ${f.alpha})`;
    snowCtx.fill();
  }
  snowRafId = requestAnimationFrame(drawSnowFrame);
}

function updateSnowState(enabled) {
  stateApi.setSnowEnabled(enabled);
  snowToggleBtn.setAttribute("aria-pressed", String(enabled));
  snowToggleBtn.classList.toggle("is-active", enabled);
  snowToggleBtn.textContent = enabled ? "❄️ Nieve" : "❄️ Sin nieve";

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (snowRafId) {
    cancelAnimationFrame(snowRafId);
    snowRafId = null;
  }

  if (enabled && !reduced) {
    resizeSnowCanvas();
    createFlakes();
    drawSnowFrame();
  } else {
    snowCtx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);
  }
}

let lastSnowWidth = window.innerWidth;

window.addEventListener("resize", () => {
  if (!stateApi.getState().snowEnabled) return;
  const currentWidth = window.innerWidth;
  resizeSnowCanvas();
  // En móviles al ocultar/mostrar la barra de direcciones solo cambia el alto: evitamos reiniciar la nieve
  if (Math.abs(currentWidth - lastSnowWidth) > 40) {
    lastSnowWidth = currentWidth;
    createFlakes();
  }
});

snowToggleBtn.addEventListener("click", () => {
  updateSnowState(!stateApi.getState().snowEnabled);
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

/* ==================== RENDERIZADO DE FRAGMENTOS Y PUERTAS ==================== */
const TYPE_ICONS = {
  polaroid: "📸",
  voucher: "🎟️",
  quiz: "❓",
  wordle: "🟩",
  scratch: "🪙",
  puzzle: "🧩",
  finale: "🎁"
};

function renderFragmentsTracker() {
  const st = stateApi.getState();
  const fragInfo = getSecretFragmentsState(DAYS_DATA, st.completedDays, st.creatorMode);

  fragmentsCounter.textContent = `${fragInfo.unlockedCount} / ${fragInfo.totalCount} letras`;
  fragmentsSlots.innerHTML = fragInfo.fragments
    .map(
      (f) => `
      <div class="fragment-chip ${f.unlocked ? "is-found" : ""}" title="Día ${f.day}">
        <span class="fragment-chip-letter">${f.unlocked ? f.letter : "?"}</span>
        <span class="fragment-chip-day">Día ${f.day}</span>
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

    const card = document.createElement("article");
    card.className = "door-card";
    if (dayData.day === 24) card.classList.add("is-finale");
    card.classList.add(unlocked ? "is-unlocked" : "is-locked");
    if (opened && unlocked) card.classList.add("is-opened");

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
      <span class="door-inside-icon">${TYPE_ICONS[dayData.type] || "✨"}</span>
      <span class="door-inside-title">${dayData.title}</span>
      <span class="door-inside-status">${completed ? "✓ Completado" : "Abrir sorpresa"}</span>
    `;

    const leaf = document.createElement("div");
    leaf.className = "door-leaf";
    leaf.innerHTML = `
      <div class="door-top">
        <span class="door-number">${dayData.day}</span>
        <span class="door-badge-icon">${
          unlocked ? (completed ? "✅" : TYPE_ICONS[dayData.type] || "✨") : "🔒"
        }</span>
      </div>
      <div class="door-bottom">
        <span>${unlocked ? "Toca para abrir" : `${dayData.day} de dic`}</span>
        ${
          dayData.fragmentLetter
            ? `<span class="door-fragment-tag">🗝️ ${completed || st.creatorMode ? dayData.fragmentLetter : "?"}</span>`
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
    showToast(`🔒 ¡Paciencia, Nori! ${countdown}. (O prueba en Modo Creador)`);
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

  dialogDayBadge.textContent = `DÍA ${dayData.day} DE DICIEMBRE`;
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
function showMainApp() {
  lockScreen.hidden = true;
  appShell.hidden = false;
  renderCalendarGrid();
  updateSnowState(stateApi.getState().snowEnabled);
}

pinHintText.textContent = CONFIG.pinHint || "Introduce nuestra clave";

pinForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (validatePin(pinInput.value, CONFIG.pinCode)) {
    pinError.textContent = "";
    stateApi.unlockIntro();
    showMainApp();
  } else {
    pinError.textContent = "Ups, esa clave no es... ¡Pista: nuestra fecha especial (4 dígitos)! ❤️";
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
      "🛠️ ¡Modo Creador activado! Ya puedes abrir cualquier puerta del 1 al 24 para probarla.";
    renderCalendarGrid();
  } else {
    creatorFeedback.className = "game-feedback is-hint";
    creatorFeedback.textContent = "Código incorrecto. Pista: el nombre del autor de este regalo 😉";
  }
});

creatorDisableBtn.addEventListener("click", () => {
  stateApi.setCreatorMode(false);
  creatorFeedback.className = "game-feedback is-hint";
  creatorFeedback.textContent =
    "🔒 Modo Creador desactivado. Ahora se respeta el bloqueo real por fechas de diciembre.";
  renderCalendarGrid();
});

creatorResetBtn.addEventListener("click", () => {
  stateApi.resetAll();
  stateApi.unlockIntro();
  setMusicPlaying(false);
  updateSnowState(true);
  creatorFeedback.className = "game-feedback is-hint";
  creatorFeedback.textContent = "🧹 Progreso reiniciado. Todas las puertas han vuelto a cerrarse.";
  renderCalendarGrid();
});

/* ==================== INICIO ==================== */
// La música siempre empieza apagada tras una carga de página para cumplir con autoplay y sincronizar el botón
setMusicPlaying(false);

if (stateApi.getState().unlockedIntro) {
  showMainApp();
} else {
  updateSnowState(stateApi.getState().snowEnabled);
}
