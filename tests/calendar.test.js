import test from "node:test";
import assert from "node:assert/strict";

import { CONFIG, DAYS_DATA } from "../js/config.js";
import { evaluateWordleGuess } from "../js/games.js";
import {
  buildWhatsAppUrl,
  createStateManager,
  getSecretFragmentsState,
  getUnlockCountdownText,
  isDayUnlocked,
  validateCreatorCode,
  validatePin,
  validateSecretCode
} from "../js/state.js";

test("DAYS_DATA contiene exactamente 24 días consecutivos del 1 al 24", () => {
  assert.equal(DAYS_DATA.length, 24);
  const numbers = DAYS_DATA.map((d) => d.day);
  assert.deepEqual(
    numbers,
    Array.from({ length: 24 }, (_, i) => i + 1)
  );
});

test("Los fragmentos secretos en DAYS_DATA forman exactamente M7C2V0", () => {
  const fragInfo = getSecretFragmentsState(DAYS_DATA, [], true);
  assert.equal(fragInfo.totalCount, 6);
  assert.equal(fragInfo.assembledCode, CONFIG.secretWord);
  assert.equal(CONFIG.secretWord, "M7C2V0");
  assert.deepEqual(
    fragInfo.fragments.map((f) => f.day),
    [4, 8, 12, 16, 20, 23]
  );
});

test("Los días 2, 8, 14 y 21 usan los 4 nuevos mini-juegos móviles y el día 20 es burrito o burguer", () => {
  const byDay = new Map(DAYS_DATA.map((d) => [d.day, d]));
  assert.equal(byDay.get(2).type, "memory");
  assert.equal(byDay.get(8).type, "catcher");
  assert.equal(byDay.get(14).type, "simon");
  assert.equal(byDay.get(21).type, "whack");
  assert.match(byDay.get(20).voucherTitle, /burrito|burguer/i);
});

test("Los Wordles personalizados tienen palabras de 5 letras válidas (MILAN, COVES, SOPAS)", () => {
  const wordles = DAYS_DATA.filter((d) => d.type === "wordle");
  assert.deepEqual(
    wordles.map((w) => w.word),
    ["MILAN", "COVES", "SOPAS"]
  );
  for (const w of wordles) {
    assert.equal(w.word.length, 5);
  }
});

test("evaluateWordleGuess gestiona letras exactas, presentes y repetidas", () => {
  assert.deepEqual(evaluateWordleGuess("MILAN", "MILAN"), [
    "correct",
    "correct",
    "correct",
    "correct",
    "correct"
  ]);
  // En SOPAS hay 2 'S' (pos 0 y pos 4). Si probamos SALSA:
  // pos 0: S -> correct; pos 1: A -> present (A en pos 3); pos 2: L -> absent;
  // pos 3: S -> present (S en pos 4); pos 4: A -> absent (solo hay una A en SOPAS)
  assert.deepEqual(evaluateWordleGuess("SALSA", "SOPAS"), [
    "correct",
    "present",
    "absent",
    "present",
    "absent"
  ]);
});

test("Validación de PIN 0207, código creador VICENT y secreto M7C2V0", () => {
  assert.equal(validatePin("0207", CONFIG.pinCode), true);
  assert.equal(validatePin(" 0207 ", CONFIG.pinCode), true);
  assert.equal(validatePin("1234", CONFIG.pinCode), false);

  assert.equal(validateCreatorCode("vicent", CONFIG.creatorCode), true);
  assert.equal(validateCreatorCode("VICENT", CONFIG.creatorCode), true);
  assert.equal(validateCreatorCode("otro", CONFIG.creatorCode), false);

  assert.equal(validateSecretCode("m7c2v0", CONFIG.secretWord), true);
  assert.equal(validateSecretCode("M7C2V0", CONFIG.secretWord), true);
  assert.equal(validateSecretCode("NORITA", CONFIG.secretWord), false);
});

test("isDayUnlocked bloquea antes de diciembre, desbloquea día a día y respeta Modo Creador", () => {
  const novDate = new Date(2026, 10, 20, 12, 0, 0); // 20 nov 2026
  assert.equal(isDayUnlocked(1, novDate, false, 2026), false);
  assert.equal(isDayUnlocked(1, novDate, true, 2026), true);

  const dec5 = new Date(2026, 11, 5, 9, 0, 0); // 5 dic 2026
  assert.equal(isDayUnlocked(1, dec5, false, 2026), true);
  assert.equal(isDayUnlocked(5, dec5, false, 2026), true);
  assert.equal(isDayUnlocked(6, dec5, false, 2026), false);
  assert.equal(isDayUnlocked(24, dec5, false, 2026), false);

  const nextYear = new Date(2027, 0, 2, 10, 0, 0);
  assert.equal(isDayUnlocked(24, nextYear, false, 2026), true);
});

test("buildWhatsAppUrl genera el enlace oficial con el teléfono de Vicent", () => {
  const url = buildWhatsAppUrl(CONFIG.whatsappNumber, "Hola Vicent ❤️");
  assert.equal(url, "https://wa.me/34626661315?text=Hola%20Vicent%20%E2%9D%A4%EF%B8%8F");
});

test("createStateManager persiste y recupera progreso en storage", () => {
  const store = new Map();
  const mockStorage = {
    getItem: (k) => store.get(k) ?? null,
    setItem: (k, v) => store.set(k, v)
  };

  const manager1 = createStateManager(mockStorage, "test_key");
  manager1.unlockIntro();
  manager1.markDayOpened(4);
  manager1.markDayCompleted(4);
  manager1.markVoucherRedeemed(3);
  manager1.unlockFinale();

  const manager2 = createStateManager(mockStorage, "test_key");
  const loaded = manager2.getState();
  assert.equal(loaded.unlockedIntro, true);
  assert.deepEqual(loaded.openedDays.sort((a, b) => a - b), [4]);
  assert.deepEqual(loaded.completedDays.sort((a, b) => a - b), [3, 4, 24]);
  assert.deepEqual(loaded.redeemedVouchers, [3]);
  assert.equal(loaded.finaleUnlocked, true);

  manager2.resetAll();
  assert.equal(manager2.getState().unlockedIntro, false);
  assert.deepEqual(manager2.getState().completedDays, []);
});

test("getUnlockCountdownText y recuperación segura ante JSON corrupto", () => {
  const nov28 = new Date(2026, 10, 28, 12, 0, 0);
  assert.match(getUnlockCountdownText(1, nov28, 2026), /Falta/i);

  const dec5 = new Date(2026, 11, 5, 12, 0, 0);
  assert.equal(getUnlockCountdownText(5, dec5, 2026), "¡Disponible ya!");

  const corruptStorage = {
    getItem: () => "{no-es-json",
    setItem: () => {}
  };
  const safeManager = createStateManager(corruptStorage, "corrupt");
  assert.equal(safeManager.getState().unlockedIntro, false);
});
