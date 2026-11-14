/**
 * Lógica pura de fechas, códigos secretos, WhatsApp y persistencia en localStorage.
 * No depende del DOM para poder probarse directamente con node:test.
 */

export const DEFAULT_STORAGE_KEY = "nori_advent_state_v1";

/**
 * Crea el estado inicial por defecto.
 * @returns {object}
 */
export function createEmptyState() {
  return {
    unlockedIntro: false,
    creatorMode: false,
    openedDays: [],
    completedDays: [],
    redeemedVouchers: [],
    finaleUnlocked: false,
    soundEnabled: false,
    snowEnabled: true
  };
}

/**
 * Comprueba si el PIN de entrada es válido.
 * @param {string} input
 * @param {string} expectedPin
 * @returns {boolean}
 */
export function validatePin(input, expectedPin) {
  if (typeof input !== "string" || typeof expectedPin !== "string") return false;
  return input.trim() === expectedPin.trim();
}

/**
 * Comprueba si el código del Modo Creador es válido (sin distinguir mayúsculas/minúsculas).
 * @param {string} input
 * @param {string} expectedCode
 * @returns {boolean}
 */
export function validateCreatorCode(input, expectedCode) {
  if (typeof input !== "string" || typeof expectedCode !== "string") return false;
  return input.trim().toUpperCase() === expectedCode.trim().toUpperCase();
}

/**
 * Comprueba si el código secreto del Día 24 (NORITA) es válido.
 * @param {string} input
 * @param {string} expectedWord
 * @returns {boolean}
 */
export function validateSecretCode(input, expectedWord) {
  if (typeof input !== "string" || typeof expectedWord !== "string") return false;
  return input.trim().toUpperCase() === expectedWord.trim().toUpperCase();
}

/**
 * Determina si una casilla (1..24) está desbloqueada según la fecha local y el Modo Creador.
 * - Si creatorMode === true, siempre está desbloqueada.
 * - Si el año actual es mayor que targetYear, todo diciembre quedó desbloqueado.
 * - Si estamos en diciembre (month === 11) de targetYear, se desbloquea cuando date >= day.
 * - Antes de diciembre de targetYear (ej. noviembre), permanece bloqueada para el usuario final.
 *
 * @param {number} day
 * @param {Date} [now]
 * @param {boolean} [creatorMode]
 * @param {number} [targetYear]
 * @returns {boolean}
 */
export function isDayUnlocked(day, now = new Date(), creatorMode = false, targetYear = 2026) {
  if (!Number.isInteger(day) || day < 1 || day > 24) return false;
  if (creatorMode) return true;

  const year = now.getFullYear();
  const month = now.getMonth(); // 0 = enero, 11 = diciembre
  const date = now.getDate();

  if (year > targetYear) return true;
  if (year < targetYear) return false;
  if (month !== 11) return false;

  return date >= day;
}

/**
 * Calcula un texto informativo con el tiempo restante hasta que se abra un día concreto.
 * @param {number} day
 * @param {Date} [now]
 * @param {number} [targetYear]
 * @returns {string}
 */
export function getUnlockCountdownText(day, now = new Date(), targetYear = 2026) {
  const target = new Date(targetYear, 11, day, 0, 0, 0, 0);
  const diffMs = target.getTime() - now.getTime();
  if (diffMs <= 0) return "¡Disponible ya!";

  const totalHours = Math.ceil(diffMs / (1000 * 60 * 60));
  const daysLeft = Math.floor(totalHours / 24);
  const hoursLeft = totalHours % 24;

  if (daysLeft > 1) {
    return `Faltan ${daysLeft} días para el ${day} de dic`;
  }
  if (daysLeft === 1) {
    return hoursLeft > 0 ? `Falta 1 día y ${hoursLeft} h` : "Se abre mañana";
  }
  return `Se abre en ${hoursLeft} h`;
}

/**
 * Construye una URL oficial de WhatsApp (wa.me) con mensaje URL-encoded.
 * @param {string} phone
 * @param {string} message
 * @returns {string}
 */
export function buildWhatsAppUrl(phone, message) {
  const cleanPhone = String(phone || "").replace(/[^\d]/g, "");
  const encodedText = encodeURIComponent(String(message || ""));
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

/**
 * Devuelve el estado de los fragmentos del código secreto (p. ej. N-O-R-I-T-A)
 * según los días completados.
 *
 * @param {Array<object>} daysData
 * @param {Array<number>} completedDays
 * @param {boolean} [creatorMode]
 * @returns {{ fragments: Array<{day: number, letter: string, unlocked: boolean}>, unlockedCount: number, totalCount: number, assembledCode: string, allUnlocked: boolean }}
 */
export function getSecretFragmentsState(daysData, completedDays = [], creatorMode = false) {
  const completedSet = new Set(completedDays);
  const fragments = daysData
    .filter((d) => typeof d.fragmentLetter === "string" && d.fragmentLetter.length > 0)
    .map((d) => ({
      day: d.day,
      letter: d.fragmentLetter.toUpperCase(),
      unlocked: creatorMode || completedSet.has(d.day)
    }));

  const unlockedCount = fragments.filter((f) => f.unlocked).length;
  const assembledCode = fragments.map((f) => (f.unlocked ? f.letter : "_")).join("");

  return {
    fragments,
    unlockedCount,
    totalCount: fragments.length,
    assembledCode,
    allUnlocked: fragments.length > 0 && unlockedCount === fragments.length
  };
}

/**
 * Crea un gestor de estado persistente respaldado por localStorage (o un mock en tests).
 * @param {Storage|null} [storage]
 * @param {string} [storageKey]
 */
export function createStateManager(
  storage = typeof globalThis !== "undefined" ? globalThis.localStorage ?? null : null,
  storageKey = DEFAULT_STORAGE_KEY
) {
  let state = loadState();

  function loadState() {
    const base = createEmptyState();
    if (!storage || typeof storage.getItem !== "function") return base;
    try {
      const raw = storage.getItem(storageKey);
      if (!raw) return base;
      const parsed = JSON.parse(raw);
      return {
        ...base,
        ...parsed,
        openedDays: Array.isArray(parsed.openedDays) ? [...new Set(parsed.openedDays)] : [],
        completedDays: Array.isArray(parsed.completedDays) ? [...new Set(parsed.completedDays)] : [],
        redeemedVouchers: Array.isArray(parsed.redeemedVouchers)
          ? [...new Set(parsed.redeemedVouchers)]
          : []
      };
    } catch {
      return base;
    }
  }

  function saveState() {
    if (!storage || typeof storage.setItem !== "function") return;
    try {
      storage.setItem(storageKey, JSON.stringify(state));
    } catch {
      // Silencioso en caso de almacenamiento privado lleno
    }
  }

  return {
    getState() {
      return {
        ...state,
        openedDays: [...state.openedDays],
        completedDays: [...state.completedDays],
        redeemedVouchers: [...state.redeemedVouchers]
      };
    },
    unlockIntro() {
      state.unlockedIntro = true;
      saveState();
    },
    setCreatorMode(enabled) {
      state.creatorMode = Boolean(enabled);
      saveState();
    },
    markDayOpened(day) {
      if (!state.openedDays.includes(day)) {
        state.openedDays.push(day);
        saveState();
      }
    },
    markDayCompleted(day) {
      if (!state.openedDays.includes(day)) {
        state.openedDays.push(day);
      }
      if (!state.completedDays.includes(day)) {
        state.completedDays.push(day);
        saveState();
      }
    },
    markVoucherRedeemed(day) {
      if (!state.redeemedVouchers.includes(day)) {
        state.redeemedVouchers.push(day);
      }
      if (!state.completedDays.includes(day)) {
        state.completedDays.push(day);
      }
      saveState();
    },
    unlockFinale() {
      state.finaleUnlocked = true;
      if (!state.completedDays.includes(24)) {
        state.completedDays.push(24);
      }
      saveState();
    },
    setSoundEnabled(enabled) {
      state.soundEnabled = Boolean(enabled);
      saveState();
    },
    setSnowEnabled(enabled) {
      state.snowEnabled = Boolean(enabled);
      saveState();
    },
    resetAll() {
      state = createEmptyState();
      saveState();
    }
  };
}
