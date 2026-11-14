import { buildWhatsAppUrl, getSecretFragmentsState, validateSecretCode } from "./state.js";

/**
 * Genera una ilustración SVG romántica y navideña como Data URL
 * para usarla automáticamente si Vicent aún no ha puesto una foto en assets/photos/dia-X.jpg.
 * @param {string} theme
 * @param {number} day
 * @returns {string}
 */
export function getFallbackIllustrationUrl(theme = "couple-lights", day = 1) {
  const palettes = {
    "couple-lights": { bg1: "#4a0e17", bg2: "#1d060a", accent: "#f3d266", title: "Contigo en Navidad ✨" },
    "milan-duomo": { bg1: "#1a2842", bg2: "#0d1422", accent: "#f5d77f", title: "Milán bajo la nieve 🇮🇹" },
    "mountain-village": { bg1: "#2e1a24", bg2: "#160a10", accent: "#f4c973", title: "Cuevas de Cañart 🏔️" },
    "puzzle-hearts": { bg1: "#581320", bg2: "#24060c", accent: "#ffd77a", title: "Pieza a pieza ❤️" },
    "music-stars": { bg1: "#2e1129", bg2: "#140612", accent: "#f7d674", title: "Tu risa es música 🎶" },
    "winter-cabin": { bg1: "#19302a", bg2: "#0c1916", accent: "#f5d477", title: "Nuestro refugio ❄️" }
  };
  const p = palettes[theme] || palettes["couple-lights"];

  let extraArt = "";
  if (theme === "milan-duomo") {
    extraArt = `
      <path d="M90 290 L130 200 L150 230 L180 155 L200 115 L220 155 L250 230 L270 200 L310 290 Z" fill="#f7ebd2" opacity="0.9"/>
      <path d="M188 118 L200 72 L212 118 Z" fill="${p.accent}"/>
      <rect x="75" y="290" width="250" height="16" rx="4" fill="#d4af37" opacity="0.6"/>
    `;
  } else if (theme === "mountain-village") {
    extraArt = `
      <polygon points="40,300 140,150 245,300" fill="#3e2330"/>
      <polygon points="160,300 275,130 375,300" fill="#4f2d3c"/>
      <polygon points="140,150 115,190 165,190" fill="#f9f3e8" opacity="0.8"/>
      <polygon points="275,130 247,178 303,178" fill="#f9f3e8" opacity="0.85"/>
      <rect x="150" y="255" width="44" height="45" rx="3" fill="#e9d2b0"/>
      <polygon points="144,255 172,232 200,255" fill="#9b2235"/>
      <rect x="166" y="274" width="12" height="15" fill="#ffb84d"/>
    `;
  } else {
    extraArt = `
      <path d="M200 250 C145 212 110 175 110 140 C110 112 132 94 156 94 C174 94 190 105 200 120 C210 105 226 94 244 94 C268 94 290 112 290 140 C290 175 255 212 200 250 Z" fill="#b8243a" stroke="${p.accent}" stroke-width="4"/>
      <circle cx="155" cy="140" r="14" fill="#f9e6b3" opacity="0.35"/>
      <path d="M180 285 Q200 265 220 285" stroke="${p.accent}" stroke-width="3" fill="none"/>
    `;
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 360">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${p.bg1}"/>
          <stop offset="100%" stop-color="${p.bg2}"/>
        </linearGradient>
      </defs>
      <rect width="400" height="360" fill="url(#g)"/>
      <circle cx="65" cy="55" r="3" fill="${p.accent}" opacity="0.8"/>
      <circle cx="130" cy="40" r="2" fill="#ffffff" opacity="0.7"/>
      <circle cx="280" cy="48" r="3" fill="${p.accent}" opacity="0.9"/>
      <circle cx="340" cy="80" r="2" fill="#ffffff" opacity="0.6"/>
      <circle cx="95" cy="95" r="2" fill="#ffffff" opacity="0.5"/>
      <circle cx="315" cy="145" r="2.5" fill="${p.accent}" opacity="0.7"/>
      <path d="M0 48 Q100 80 200 48 T400 48" stroke="${p.accent}" stroke-width="2" fill="none" opacity="0.55"/>
      ${extraArt}
      <text x="200" y="330" text-anchor="middle" fill="#fbf6ee" font-family="Georgia, serif" font-size="18">${p.title}</text>
      <text x="200" y="34" text-anchor="middle" fill="${p.accent}" font-family="Georgia, serif" font-size="13" letter-spacing="3">DÍA ${day} · N &amp; V</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/**
 * Crea un aviso dorado si el día desbloquea un fragmento del código secreto.
 */
function createFragmentBadge(letter) {
  const badge = document.createElement("div");
  badge.className = "fragment-award-banner";
  badge.innerHTML = `
    <span class="fragment-award-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="7.5" cy="15.5" r="4.5" />
        <path d="m21 2-9.6 9.6" />
        <path d="m15.5 7.5 3 3L22 7l-3-3" />
      </svg>
    </span>
    <div>
      <strong>Clave secreta desbloqueada</strong>
      <p>Has obtenido el carácter <span class="fragment-pill">${letter}</span> para el cofre del Día 24.</p>
    </div>
  `;
  return badge;
}

function showWinFeedback(feedbackEl, dayData, onComplete) {
  feedbackEl.className = "game-feedback is-success";
  feedbackEl.innerHTML = `<p><strong>${dayData.rewardTitle || "¡Reto superado!"}</strong></p><p>${dayData.message}</p>`;
  if (dayData.fragmentLetter) {
    feedbackEl.appendChild(createFragmentBadge(dayData.fragmentLetter));
  }
  onComplete(dayData);
}

let fxAudioCtx = null;
function unlockGameAudio() {
  try {
    const AudioCtx = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!AudioCtx) return null;
    if (!fxAudioCtx) fxAudioCtx = new AudioCtx();
    if (fxAudioCtx.state === "suspended") fxAudioCtx.resume();
    return fxAudioCtx;
  } catch {
    return null;
  }
}

function playGameTone(freq, durationMs = 220) {
  try {
    const ctx = unlockGameAudio();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.14, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationMs / 1000);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + durationMs / 1000 + 0.02);
  } catch {
    // Silencioso si el navegador bloquea AudioContext
  }
}

/**
 * Crea un elemento <img> que automáticamente cambia a la ilustración SVG si no hay foto local.
 */
function createPhotoWithFallback(photoPath, fallbackTheme, day, altText) {
  const img = document.createElement("img");
  img.alt = altText;
  const fallbackUrl = getFallbackIllustrationUrl(fallbackTheme, day);
  img.src = photoPath || fallbackUrl;
  img.addEventListener(
    "error",
    () => {
      if (img.src !== fallbackUrl) {
        img.src = fallbackUrl;
      }
    },
    { once: true }
  );
  return img;
}

/**
 * 1. POLAROID GIRATORIA 3D + AUDIO OPCIONAL
 */
function renderPolaroid(container, dayData, onComplete) {
  const wrap = document.createElement("div");
  wrap.className = "polaroid-stage";

  const card = document.createElement("div");
  card.className = "polaroid-card";

  const front = document.createElement("div");
  front.className = "polaroid-face polaroid-front";
  const imgWrap = document.createElement("div");
  imgWrap.className = "polaroid-photo-frame";
  imgWrap.appendChild(
    createPhotoWithFallback(dayData.photo, dayData.fallbackTheme, dayData.day, dayData.title)
  );
  const caption = document.createElement("p");
  caption.className = "polaroid-caption";
  caption.textContent = dayData.caption || `Día ${dayData.day}`;
  const hint = document.createElement("span");
  hint.className = "polaroid-flip-hint";
  hint.textContent = "Toca la postal para leer la dedicatoria";
  front.append(imgWrap, caption, hint);

  const back = document.createElement("div");
  back.className = "polaroid-face polaroid-back";
  back.inert = true;
  const backTitle = document.createElement("h3");
  backTitle.className = "polaroid-back-title";
  backTitle.textContent = dayData.rewardTitle || "Para Nori";
  const msg = document.createElement("p");
  msg.className = "polaroid-back-message";
  msg.textContent = dayData.message;
  const sign = document.createElement("p");
  sign.className = "polaroid-signature";
  sign.textContent = "Con todo mi cariño, Vicent";
  back.append(backTitle, msg, sign);

  if (dayData.audio) {
    const audioBox = document.createElement("div");
    audioBox.className = "polaroid-audio-box";
    const audioEl = document.createElement("audio");
    audioEl.controls = true;
    audioEl.preload = "metadata";
    audioEl.src = dayData.audio;
    // Oculta el reproductor limpiamente si todavía no se ha subido el MP3
    audioEl.addEventListener("error", () => {
      audioBox.remove();
    });
    const audioLabel = document.createElement("span");
    audioLabel.className = "polaroid-audio-label";
    audioLabel.textContent = "Mensaje de voz del día";
    audioBox.append(audioLabel, audioEl);
    back.appendChild(audioBox);
  }

  card.append(front, back);
  wrap.appendChild(card);

  const btnRow = document.createElement("div");
  btnRow.className = "dialog-actions-center";
  const flipBtn = document.createElement("button");
  flipBtn.type = "button";
  flipBtn.className = "btn-gold";
  flipBtn.textContent = "Leer dedicatoria";

  let flipped = false;
  const toggleFlip = (e) => {
    if (e && e.target && e.target.closest(".polaroid-audio-box")) return;
    flipped = !flipped;
    card.classList.toggle("is-flipped", flipped);
    front.inert = flipped;
    back.inert = !flipped;
    flipBtn.textContent = flipped ? "Ver fotografía" : "Leer dedicatoria";
    if (flipped) {
      onComplete(dayData);
    }
  };

  card.addEventListener("click", toggleFlip);
  flipBtn.addEventListener("click", toggleFlip);

  btnRow.appendChild(flipBtn);
  container.append(wrap, btnRow);

  // Al abrir una Polaroid también la contamos como vista/completada
  onComplete(dayData);
}

/**
 * 2. VALE / CUPÓN DORADO CANJEABLE POR WHATSAPP
 */
function renderVoucher(container, dayData, config, stateApi, onComplete) {
  const currentState = stateApi.getState();
  let isRedeemed = currentState.redeemedVouchers.includes(dayData.day);

  const ticket = document.createElement("div");
  ticket.className = "golden-voucher";
  if (isRedeemed) ticket.classList.add("is-redeemed");

  ticket.innerHTML = `
    <div class="voucher-notch voucher-notch-left" aria-hidden="true"></div>
    <div class="voucher-notch voucher-notch-right" aria-hidden="true"></div>
    <div class="voucher-header">
      <span class="voucher-tag">VALE OFICIAL · DÍA ${dayData.day}</span>
      <span class="voucher-code">${dayData.voucherCode || `NORI-${dayData.day}`}</span>
    </div>
    <h3 class="voucher-title">${dayData.voucherTitle}</h3>
    <p class="voucher-desc">${dayData.message}</p>
    <div class="voucher-footer">
      <span>Para: <strong>${config.recipientNickname}</strong></span>
      <span>De: <strong>${config.senderName}</strong></span>
    </div>
    <div class="voucher-stamp" aria-hidden="true">CANJEADO</div>
  `;

  const actions = document.createElement("div");
  actions.className = "voucher-actions";

  const waMessage =
    dayData.whatsappText ||
    `¡Hola ${config.senderName}! Quiero canjear mi vale del Día ${dayData.day} (${dayData.voucherCode}): ${dayData.voucherTitle} ❤️`;

  const waBtn = document.createElement("a");
  waBtn.className = "btn-whatsapp";
  waBtn.href = buildWhatsAppUrl(config.whatsappNumber, waMessage);
  waBtn.target = "_blank";
  waBtn.rel = "noopener noreferrer";
  waBtn.textContent = `Canjear por WhatsApp con ${config.senderName}`;

  const markBtn = document.createElement("button");
  markBtn.type = "button";
  markBtn.className = "btn-outline";
  markBtn.textContent = isRedeemed ? "Vale ya canjeado" : "Marcar como canjeado";

  const markAsRedeemed = () => {
    isRedeemed = true;
    ticket.classList.add("is-redeemed");
    markBtn.textContent = "Vale ya canjeado";
    stateApi.markVoucherRedeemed(dayData.day);
    onComplete(dayData);
  };

  waBtn.addEventListener("click", markAsRedeemed);
  markBtn.addEventListener("click", markAsRedeemed);

  actions.append(waBtn, markBtn);
  container.appendChild(ticket);

  if (dayData.fragmentLetter) {
    container.appendChild(createFragmentBadge(dayData.fragmentLetter));
  }
  container.appendChild(actions);

  onComplete(dayData);
}

/**
 * 3A. MEMORY NAVIDEÑO 4x3 (6 PAREJAS)
 */
function renderMemory(container, dayData, onComplete) {
  const pairs = dayData.pairs || ["🍲", "✈️", "🐾", "🌯", "🎬", "❤️"];
  const deck = [...pairs, ...pairs];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  const wrap = document.createElement("div");
  wrap.className = "memory-wrapper";

  const hud = document.createElement("div");
  hud.className = "game-hud";
  const movesEl = document.createElement("span");
  movesEl.textContent = "Intentos: 0";
  const pairsEl = document.createElement("span");
  pairsEl.textContent = `Parejas: 0 / ${pairs.length}`;
  hud.append(movesEl, pairsEl);

  const grid = document.createElement("div");
  grid.className = "memory-grid";

  const feedback = document.createElement("div");
  feedback.className = "game-feedback";
  feedback.setAttribute("aria-live", "polite");

  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;
  let moves = 0;
  let matchedCount = 0;
  let flipTimer = null;

  deck.forEach((symbol, idx) => {
    const cardBtn = document.createElement("button");
    cardBtn.type = "button";
    cardBtn.className = "memory-card";
    cardBtn.dataset.cardNumber = String(idx + 1);
    cardBtn.setAttribute("aria-label", `Carta ${idx + 1}`);
    cardBtn.innerHTML = `
      <span class="memory-card-inner">
        <span class="memory-face memory-back" aria-hidden="true">✦</span>
        <span class="memory-face memory-front" aria-hidden="true">${symbol}</span>
      </span>
    `;

    cardBtn.addEventListener("click", () => {
      if (
        lockBoard ||
        cardBtn === firstCard ||
        cardBtn.classList.contains("is-matched")
      ) {
        return;
      }

      cardBtn.classList.add("is-flipped");
      cardBtn.setAttribute("aria-label", `Carta ${cardBtn.dataset.cardNumber}: ${symbol}`);

      if (!firstCard) {
        firstCard = cardBtn;
        playGameTone(523.25, 90);
        return;
      }

      secondCard = cardBtn;
      moves += 1;
      movesEl.textContent = `Intentos: ${moves}`;

      const sym1 = firstCard.querySelector(".memory-front").textContent;
      const sym2 = secondCard.querySelector(".memory-front").textContent;

      if (sym1 === sym2) {
        firstCard.classList.add("is-matched");
        secondCard.classList.add("is-matched");
        firstCard = null;
        secondCard = null;
        matchedCount += 1;
        pairsEl.textContent = `Parejas: ${matchedCount} / ${pairs.length}`;
        playGameTone(659.25, 160);

        if (matchedCount === pairs.length) {
          showWinFeedback(feedback, dayData, onComplete);
        }
      } else {
        playGameTone(523.25, 90);
        lockBoard = true;
        flipTimer = setTimeout(() => {
          if (firstCard) {
            firstCard.classList.remove("is-flipped");
            firstCard.setAttribute("aria-label", `Carta ${firstCard.dataset.cardNumber}`);
          }
          if (secondCard) {
            secondCard.classList.remove("is-flipped");
            secondCard.setAttribute("aria-label", `Carta ${secondCard.dataset.cardNumber}`);
          }
          firstCard = null;
          secondCard = null;
          lockBoard = false;
        }, 650);
      }
    });

    grid.appendChild(cardBtn);
  });

  wrap.append(hud, grid, feedback);
  container.appendChild(wrap);

  return () => {
    clearTimeout(flipTimer);
  };
}

/**
 * 3B. ARCADE TÁCTIL: ¡LA SOPA CALENTITA DE NORI!
 */
function renderCatcher(container, dayData, onComplete) {
  const targetScore = dayData.targetScore || 10;
  const goodItems = ["🥕", "🍄", "🍜", "🍗", "🧅"];
  const badItems = ["🧦", "💣"];

  const wrap = document.createElement("div");
  wrap.className = "catcher-wrapper";

  const hud = document.createElement("div");
  hud.className = "game-hud";
  const scoreEl = document.createElement("span");
  scoreEl.textContent = `Puntos: 0 / ${targetScore}`;
  const tipEl = document.createElement("span");
  tipEl.textContent = "👆 Desliza la olla";
  hud.append(scoreEl, tipEl);

  const canvas = document.createElement("canvas");
  canvas.className = "catcher-canvas";
  canvas.width = 360;
  canvas.height = 320;
  canvas.setAttribute("aria-label", "Juego de atrapar ingredientes para la sopa");

  const controls = document.createElement("div");
  controls.className = "catcher-controls";
  const leftBtn = document.createElement("button");
  leftBtn.type = "button";
  leftBtn.className = "btn-outline btn-sm";
  leftBtn.textContent = "⬅️ Mover izquierda";
  const rightBtn = document.createElement("button");
  rightBtn.type = "button";
  rightBtn.className = "btn-outline btn-sm";
  rightBtn.textContent = "Mover derecha ➡️";
  controls.append(leftBtn, rightBtn);

  const feedback = document.createElement("div");
  feedback.className = "game-feedback";
  feedback.setAttribute("aria-live", "polite");

  wrap.append(hud, canvas, controls, feedback);
  container.appendChild(wrap);

  const ctx = canvas.getContext("2d");
  let potX = canvas.width / 2;
  const potY = canvas.height - 30;
  const potHalfWidth = 34;
  let score = 0;
  let finished = false;
  let moveDir = 0;
  let items = [];
  let popups = [];
  let spawnAcc = 0;
  let lastTs = 0;
  let rafId = null;

  function spawnItem() {
    const isBad = Math.random() < 0.28;
    const pool = isBad ? badItems : goodItems;
    items.push({
      x: 26 + Math.random() * (canvas.width - 52),
      y: -18,
      vy: 115 + Math.random() * 80,
      emoji: pool[Math.floor(Math.random() * pool.length)],
      isBad
    });
  }

  function updateScore(delta, x, y) {
    score = Math.max(0, score + delta);
    scoreEl.textContent = `Puntos: ${score} / ${targetScore}`;
    popups.push({
      text: delta > 0 ? `+${delta} 🍲` : `${delta} 💥`,
      x,
      y,
      life: 0.7,
      good: delta > 0
    });
    if (score >= targetScore && !finished) {
      finished = true;
      controls.hidden = true;
      showWinFeedback(feedback, dayData, onComplete);
    }
  }

  function step(ts) {
    if (!lastTs) lastTs = ts;
    const dt = Math.min(0.05, (ts - lastTs) / 1000);
    lastTs = ts;

    if (!finished) {
      if (moveDir !== 0) {
        potX = Math.max(potHalfWidth, Math.min(canvas.width - potHalfWidth, potX + moveDir * 270 * dt));
      }

      spawnAcc += dt;
      if (spawnAcc >= 0.62) {
        spawnAcc = 0;
        spawnItem();
      }

      for (let i = items.length - 1; i >= 0; i--) {
        const it = items[i];
        it.y += it.vy * dt;

        const hitY = it.y >= potY - 22 && it.y <= potY + 14;
        const hitX = Math.abs(it.x - potX) <= potHalfWidth + 8;
        if (hitY && hitX) {
          items.splice(i, 1);
          updateScore(it.isBad ? -2 : 1, it.x, potY - 24);
          continue;
        }
        if (it.y > canvas.height + 24) {
          items.splice(i, 1);
        }
      }
    }

    for (let i = popups.length - 1; i >= 0; i--) {
      popups[i].y -= 36 * dt;
      popups[i].life -= dt;
      if (popups[i].life <= 0) popups.splice(i, 1);
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Ingredientes cayendo
    ctx.font = "26px system-ui, Apple Color Emoji, Segoe UI Emoji, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (const it of items) {
      ctx.fillText(it.emoji, it.x, it.y);
    }

    // Olla de Nori
    ctx.fillStyle = "rgba(245, 216, 125, 0.16)";
    ctx.beginPath();
    ctx.ellipse(potX, potY + 6, potHalfWidth + 6, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = "38px system-ui, Apple Color Emoji, Segoe UI Emoji, sans-serif";
    ctx.fillText("🍲", potX, potY);

    // Popups de puntuación
    ctx.font = "bold 15px system-ui, sans-serif";
    for (const p of popups) {
      ctx.fillStyle = p.good ? "#9cf5b8" : "#ff9aa4";
      ctx.fillText(p.text, p.x, p.y);
    }

    if (!finished) {
      rafId = requestAnimationFrame(step);
    }
  }

  function movePotToPointer(clientX) {
    if (finished) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    potX = Math.max(potHalfWidth, Math.min(canvas.width - potHalfWidth, x));
  }

  let dragging = false;
  canvas.addEventListener("pointerdown", (e) => {
    dragging = true;
    canvas.setPointerCapture(e.pointerId);
    movePotToPointer(e.clientX);
  });
  canvas.addEventListener("pointermove", (e) => {
    if (dragging) movePotToPointer(e.clientX);
  });
  canvas.addEventListener("pointerup", () => {
    dragging = false;
  });
  canvas.addEventListener("pointercancel", () => {
    dragging = false;
  });

  leftBtn.addEventListener("pointerdown", () => {
    moveDir = -1;
  });
  rightBtn.addEventListener("pointerdown", () => {
    moveDir = 1;
  });
  const stopMove = () => {
    moveDir = 0;
  };
  leftBtn.addEventListener("pointerup", stopMove);
  leftBtn.addEventListener("pointerleave", stopMove);
  leftBtn.addEventListener("pointercancel", stopMove);
  leftBtn.addEventListener("blur", stopMove);
  rightBtn.addEventListener("pointerup", stopMove);
  rightBtn.addEventListener("pointerleave", stopMove);
  rightBtn.addEventListener("pointercancel", stopMove);
  rightBtn.addEventListener("blur", stopMove);

  const onKeyDown = (e) => {
    if (e.key === "ArrowLeft") moveDir = -1;
    if (e.key === "ArrowRight") moveDir = 1;
  };
  const onKeyUp = (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") moveDir = 0;
  };
  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);

  spawnItem();
  rafId = requestAnimationFrame(step);

  return () => {
    cancelAnimationFrame(rafId);
    document.removeEventListener("keydown", onKeyDown);
    document.removeEventListener("keyup", onKeyUp);
  };
}

/**
 * 3C. SIMON SAYS NAVIDEÑO: LUCES Y CAMPANAS (5 RONDAS)
 */
function renderSimon(container, dayData, onComplete) {
  const totalRounds = dayData.rounds || 5;
  const padsInfo = [
    { emoji: "🔔", freq: 261.63, name: "Rojo" },
    { emoji: "🎄", freq: 329.63, name: "Verde" },
    { emoji: "⭐", freq: 392.0, name: "Dorado" },
    { emoji: "❄️", freq: 523.25, name: "Azul" }
  ];

  const wrap = document.createElement("div");
  wrap.className = "simon-wrapper";

  const hud = document.createElement("div");
  hud.className = "game-hud";
  const roundEl = document.createElement("span");
  roundEl.textContent = `Ronda: 0 / ${totalRounds}`;
  const stateEl = document.createElement("span");
  stateEl.textContent = "Pulsa Empezar";
  hud.append(roundEl, stateEl);

  const grid = document.createElement("div");
  grid.className = "simon-grid";

  const startBtn = document.createElement("button");
  startBtn.type = "button";
  startBtn.className = "btn-gold";
  startBtn.textContent = "▶️ Empezar secuencia";

  const feedback = document.createElement("div");
  feedback.className = "game-feedback";
  feedback.setAttribute("aria-live", "polite");

  const sequence = [];
  let userStep = 0;
  let acceptingInput = false;
  let won = false;
  const timers = [];

  const padButtons = padsInfo.map((info, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "simon-pad";
    btn.dataset.pad = String(idx);
    btn.textContent = info.emoji;
    btn.setAttribute("aria-label", `Campana ${info.name}`);
    btn.disabled = true;

    btn.addEventListener("click", () => {
      if (!acceptingInput || won) return;
      flashPad(idx, 240);
      if (idx === sequence[userStep]) {
        userStep += 1;
        if (userStep === sequence.length) {
          acceptingInput = false;
          setPadsDisabled(true);
          if (sequence.length >= totalRounds) {
            won = true;
            stateEl.textContent = "¡Completado!";
            showWinFeedback(feedback, dayData, onComplete);
          } else {
            stateEl.textContent = "¡Bien! Siguiente...";
            const t = setTimeout(nextRound, 700);
            timers.push(t);
          }
        }
      } else {
        acceptingInput = false;
        setPadsDisabled(true);
        stateEl.textContent = "¡Ups, casi!";
        feedback.className = "game-feedback is-hint";
        feedback.textContent = "Te despistaste un poquito 😄 Pulsa el botón para repetir esta ronda.";
        startBtn.hidden = false;
        startBtn.textContent = "🔄 Repetir secuencia";
      }
    });

    grid.appendChild(btn);
    return btn;
  });

  function setPadsDisabled(disabled) {
    padButtons.forEach((b) => {
      b.disabled = disabled;
    });
  }

  function flashPad(idx, duration = 360) {
    const btn = padButtons[idx];
    if (!btn) return;
    btn.classList.add("is-lit");
    playGameTone(padsInfo[idx].freq, duration);
    const t = setTimeout(() => {
      btn.classList.remove("is-lit");
    }, duration);
    timers.push(t);
  }

  function clearTimers() {
    while (timers.length > 0) {
      clearTimeout(timers.pop());
    }
  }

  function playSequence() {
    clearTimers();
    acceptingInput = false;
    setPadsDisabled(true);
    startBtn.hidden = true;
    feedback.className = "game-feedback";
    feedback.textContent = "";
    roundEl.textContent = `Ronda: ${sequence.length} / ${totalRounds}`;
    stateEl.textContent = "👀 Observa...";

    sequence.forEach((padIdx, i) => {
      const t = setTimeout(() => {
        flashPad(padIdx, 360);
      }, 450 + i * 540);
      timers.push(t);
    });

    const readyTimer = setTimeout(() => {
      acceptingInput = true;
      userStep = 0;
      setPadsDisabled(false);
      stateEl.textContent = `👆 ¡Tu turno! (${sequence.length})`;
    }, 450 + sequence.length * 540 + 80);
    timers.push(readyTimer);
  }

  function nextRound() {
    sequence.push(Math.floor(Math.random() * padsInfo.length));
    playSequence();
  }

  startBtn.addEventListener("click", () => {
    // Desbloquea AudioContext síncronamente dentro del gesto de usuario (iOS Safari)
    unlockGameAudio();
    if (sequence.length === 0) {
      nextRound();
    } else {
      playSequence();
    }
  });

  wrap.append(hud, grid, startBtn, feedback);
  container.appendChild(wrap);

  return () => {
    timers.forEach(clearTimeout);
  };
}

/**
 * 3D. ATRAPA AL GRINCH (WHACK-A-GRINCH 3x3)
 */
function renderWhack(container, dayData, onComplete) {
  const targetScore = dayData.targetScore || 10;
  const friends = ["🐶", "🦌", "🐱"];

  const wrap = document.createElement("div");
  wrap.className = "whack-wrapper";

  const hud = document.createElement("div");
  hud.className = "game-hud";
  const scoreEl = document.createElement("span");
  scoreEl.textContent = `Grinches: 0 / ${targetScore}`;
  const infoEl = document.createElement("span");
  infoEl.textContent = "Toca 👹 · Evita 🐶🦌";
  hud.append(scoreEl, infoEl);

  const grid = document.createElement("div");
  grid.className = "whack-grid";

  const feedback = document.createElement("div");
  feedback.className = "game-feedback";
  feedback.setAttribute("aria-live", "polite");

  let score = 0;
  let won = false;
  const holeStates = Array(9).fill(null);
  const holeTokens = Array(9).fill(0);
  const holeTimers = [];

  const holeButtons = Array.from({ length: 9 }, (_, idx) => {
    const hole = document.createElement("button");
    hole.type = "button";
    hole.className = "whack-hole";
    hole.setAttribute("aria-label", `Chimenea ${idx + 1}`);
    hole.textContent = "🎄";

    hole.addEventListener("click", () => {
      if (won) return;
      const current = holeStates[idx];
      if (!current) return;

      holeStates[idx] = null;
      const clickToken = ++holeTokens[idx];
      hole.classList.remove("is-grinch", "is-friend");

      if (current === "grinch") {
        score += 1;
        hole.textContent = "💥";
        scoreEl.textContent = `Grinches: ${score} / ${targetScore}`;
        if (score >= targetScore) {
          won = true;
          clearInterval(spawnInterval);
          showWinFeedback(feedback, dayData, onComplete);
        }
      } else {
        score = Math.max(0, score - 1);
        hole.textContent = "💔";
        scoreEl.textContent = `Grinches: ${score} / ${targetScore}`;
        feedback.className = "game-feedback is-hint";
        feedback.textContent = "¡Ay! Ese era un animalito amigo, cuidado 😄";
      }

      const resetT = setTimeout(() => {
        if (!holeStates[idx] && holeTokens[idx] === clickToken) {
          hole.textContent = "🎄";
        }
      }, 220);
      holeTimers.push(resetT);
    });

    grid.appendChild(hole);
    return hole;
  });

  function spawnOne() {
    if (won) return;
    const emptyIndices = holeStates
      .map((val, idx) => (val === null ? idx : -1))
      .filter((idx) => idx !== -1);
    if (emptyIndices.length === 0) return;

    const idx = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    const isGrinch = Math.random() < 0.72;
    holeStates[idx] = isGrinch ? "grinch" : "friend";
    const spawnToken = ++holeTokens[idx];

    const hole = holeButtons[idx];
    hole.classList.remove("is-grinch", "is-friend");
    if (isGrinch) {
      hole.classList.add("is-grinch");
      hole.textContent = "👹";
    } else {
      hole.classList.add("is-friend");
      hole.textContent = friends[Math.floor(Math.random() * friends.length)];
    }

    const hideT = setTimeout(() => {
      if (holeStates[idx] && holeTokens[idx] === spawnToken) {
        holeStates[idx] = null;
        hole.classList.remove("is-grinch", "is-friend");
        hole.textContent = "🎄";
      }
    }, 950);
    holeTimers.push(hideT);
  }

  const spawnInterval = setInterval(spawnOne, 620);
  spawnOne();

  wrap.append(hud, grid, feedback);
  container.appendChild(wrap);

  return () => {
    clearInterval(spawnInterval);
    holeTimers.forEach(clearTimeout);
  };
}

/**
 * Evalúa una fila de Wordle manejando letras repetidas correctamente.
 * @param {string} guess
 * @param {string} target
 * @returns {Array<"correct"|"present"|"absent">}
 */
export function evaluateWordleGuess(guess, target) {
  const g = guess.toUpperCase().split("");
  const t = target.toUpperCase().split("");
  const result = new Array(t.length).fill("absent");
  const remaining = {};

  for (let i = 0; i < t.length; i++) {
    if (g[i] === t[i]) {
      result[i] = "correct";
    } else {
      remaining[t[i]] = (remaining[t[i]] || 0) + 1;
    }
  }

  for (let i = 0; i < g.length; i++) {
    if (result[i] === "correct") continue;
    if (remaining[g[i]] > 0) {
      result[i] = "present";
      remaining[g[i]] -= 1;
    }
  }

  return result;
}

/**
 * 4. MINI-WORDLE DE 5 LETRAS
 */
function renderWordle(container, dayData, onComplete) {
  const targetWord = dayData.word.toUpperCase();
  const maxAttempts = 6;
  const wordLength = targetWord.length;

  let currentRow = 0;
  let currentGuess = "";
  let gameOver = false;
  const keyStates = {};

  const wrapper = document.createElement("div");
  wrapper.className = "wordle-wrapper";

  const hintWrap = document.createElement("div");
  hintWrap.className = "wordle-hint-box";
  const hintBtn = document.createElement("button");
  hintBtn.type = "button";
  hintBtn.className = "btn-outline btn-sm wordle-hint-btn";
  hintBtn.disabled = true;
  hintBtn.textContent = "Pista disponible tras 3 intentos";
  const hintTextEl = document.createElement("p");
  hintTextEl.className = "wordle-hint";
  hintTextEl.hidden = true;
  hintTextEl.textContent = dayData.hint;
  hintBtn.addEventListener("click", () => {
    hintTextEl.hidden = false;
    hintBtn.hidden = true;
  });
  hintWrap.append(hintBtn, hintTextEl);

  const board = document.createElement("div");
  board.className = "wordle-board";

  const rows = [];
  for (let r = 0; r < maxAttempts; r++) {
    const rowEl = document.createElement("div");
    rowEl.className = "wordle-row";
    const tiles = [];
    for (let c = 0; c < wordLength; c++) {
      const tile = document.createElement("div");
      tile.className = "wordle-tile";
      rowEl.appendChild(tile);
      tiles.push(tile);
    }
    board.appendChild(rowEl);
    rows.push(tiles);
  }

  const statusMsg = document.createElement("div");
  statusMsg.className = "game-feedback";
  statusMsg.setAttribute("aria-live", "polite");

  const keyboardRows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"]
  ];

  const keyboardEl = document.createElement("div");
  keyboardEl.className = "wordle-keyboard";
  const keyButtons = new Map();

  function refreshCurrentRow() {
    const tiles = rows[currentRow];
    if (!tiles) return;
    for (let c = 0; c < wordLength; c++) {
      tiles[c].textContent = currentGuess[c] || "";
      tiles[c].classList.toggle("has-letter", Boolean(currentGuess[c]));
    }
  }

  function updateKeyColors() {
    const priority = { absent: 1, present: 2, correct: 3 };
    keyButtons.forEach((btn, letter) => {
      const st = keyStates[letter];
      if (!st) return;
      btn.dataset.state = st;
      btn.classList.remove("state-absent", "state-present", "state-correct");
      btn.classList.add(`state-${st}`);
    });
    return priority;
  }

  function resetGame() {
    currentRow = 0;
    currentGuess = "";
    gameOver = false;
    Object.keys(keyStates).forEach((k) => delete keyStates[k]);
    rows.forEach((tiles) =>
      tiles.forEach((t) => {
        t.textContent = "";
        t.className = "wordle-tile";
      })
    );
    keyButtons.forEach((btn) => {
      btn.classList.remove("state-absent", "state-present", "state-correct");
      delete btn.dataset.state;
    });
    statusMsg.className = "game-feedback";
    statusMsg.innerHTML = "";
    hintBtn.disabled = true;
    hintBtn.hidden = false;
    hintBtn.textContent = "Pista disponible tras 3 intentos";
    hintTextEl.hidden = true;
  }

  function submitGuess() {
    if (gameOver) return;
    if (currentGuess.length < wordLength) {
      statusMsg.className = "game-feedback is-hint";
      statusMsg.textContent = `Escribe ${wordLength} letras para probar.`;
      rows[currentRow][0].parentElement.classList.add("shake");
      setTimeout(() => rows[currentRow]?.[0]?.parentElement?.classList.remove("shake"), 350);
      return;
    }

    const evaluation = evaluateWordleGuess(currentGuess, targetWord);
    const tiles = rows[currentRow];
    const priority = { absent: 1, present: 2, correct: 3 };

    evaluation.forEach((state, idx) => {
      const ch = currentGuess[idx];
      tiles[idx].classList.add(`tile-${state}`);
      const prev = keyStates[ch];
      if (!prev || priority[state] > priority[prev]) {
        keyStates[ch] = state;
      }
    });
    updateKeyColors();

    if (currentGuess === targetWord) {
      gameOver = true;
      statusMsg.className = "game-feedback is-success";
      statusMsg.innerHTML = `<p><strong>¡Exacto: ${targetWord}!</strong></p><p>${dayData.message}</p>`;
      if (dayData.fragmentLetter) {
        statusMsg.appendChild(createFragmentBadge(dayData.fragmentLetter));
      }
      onComplete(dayData);
      return;
    }

    currentRow += 1;
    currentGuess = "";

    if (currentRow >= 3 && hintTextEl.hidden) {
      hintBtn.disabled = false;
      hintBtn.textContent = "Ver pista";
    }

    if (currentRow >= maxAttempts) {
      gameOver = true;
      statusMsg.className = "game-feedback is-hint";
      statusMsg.innerHTML = `<p>¡Casi! La palabra era <strong>${targetWord}</strong>. Prueba otra vez para desbloquear tu recompensa ❤️</p>`;
      const retryBtn = document.createElement("button");
      retryBtn.type = "button";
      retryBtn.className = "btn-gold";
      retryBtn.style.marginTop = "0.5rem";
      retryBtn.textContent = "🔄 Intentar de nuevo";
      retryBtn.addEventListener("click", resetGame);
      statusMsg.appendChild(retryBtn);
    } else {
      statusMsg.className = "game-feedback";
      statusMsg.textContent = "";
    }
  }

  function handleKeyInput(key) {
    if (gameOver) return;
    const upper = key.toUpperCase();
    if (upper === "ENTER") {
      submitGuess();
    } else if (upper === "BACKSPACE" || upper === "⌫") {
      currentGuess = currentGuess.slice(0, -1);
      refreshCurrentRow();
    } else if (/^[A-ZÑ]$/.test(upper) && currentGuess.length < wordLength) {
      currentGuess += upper;
      refreshCurrentRow();
    }
  }

  keyboardRows.forEach((rowKeys) => {
    const rowDiv = document.createElement("div");
    rowDiv.className = "wordle-kb-row";
    rowKeys.forEach((k) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "wordle-key";
      if (k === "ENTER" || k === "⌫") btn.classList.add("is-wide");
      btn.textContent = k;
      btn.addEventListener("click", () => handleKeyInput(k));
      if (k.length === 1 && k !== "⌫") {
        keyButtons.set(k, btn);
      }
      rowDiv.appendChild(btn);
    });
    keyboardEl.appendChild(rowDiv);
  });

  const onPhysicalKey = (e) => {
    if (gameOver || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === "Enter") {
      // Deja actuar de forma normal a botones del diálogo (ej. cerrar o teclas enfocadas)
      if (e.target && e.target.closest("button, a, input, textarea, select")) return;
      e.preventDefault();
      handleKeyInput("ENTER");
    } else if (e.key === "Backspace") {
      e.preventDefault();
      handleKeyInput("BACKSPACE");
    } else if (/^[a-zA-ZñÑ]$/.test(e.key)) {
      handleKeyInput(e.key);
    }
  };
  document.addEventListener("keydown", onPhysicalKey);

  wrapper.append(hintWrap, board, statusMsg, keyboardEl);
  container.appendChild(wrapper);

  return () => {
    document.removeEventListener("keydown", onPhysicalKey);
  };
}

/**
 * 5. RASCA Y GANA CON EL DEDO / RATÓN (<canvas>)
 */
function renderScratchCard(container, dayData, onComplete) {
  const wrap = document.createElement("div");
  wrap.className = "scratch-wrapper";

  const card = document.createElement("div");
  card.className = "scratch-card";

  const underneath = document.createElement("div");
  underneath.className = "scratch-reveal";
  underneath.setAttribute("aria-hidden", "true");
  underneath.innerHTML = `
    <span class="scratch-badge">SORPRESA DE HOY</span>
    <h3 class="scratch-headline">${dayData.scratchHeadline || dayData.rewardTitle}</h3>
    <p class="scratch-prize-text">${dayData.scratchPrize}</p>
  `;

  const canvas = document.createElement("canvas");
  canvas.className = "scratch-canvas";
  canvas.width = 480;
  canvas.height = 240;
  canvas.setAttribute("aria-label", "Superficie dorada para rascar y descubrir tu sorpresa");

  const feedback = document.createElement("div");
  feedback.className = "game-feedback";
  feedback.setAttribute("aria-live", "polite");

  const fallbackBtn = document.createElement("button");
  fallbackBtn.type = "button";
  fallbackBtn.className = "btn-outline";
  fallbackBtn.textContent = "Descubrir tarjeta";

  card.append(underneath, canvas);
  wrap.append(card, feedback, fallbackBtn);
  container.appendChild(wrap);

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  // Lámina champán cepillado
  const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grad.addColorStop(0, "#b89347");
  grad.addColorStop(0.35, "#e7cd94");
  grad.addColorStop(0.65, "#caa459");
  grad.addColorStop(1, "#9d7933");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Líneas sutiles de cepillado satinado y marco doble
  ctx.strokeStyle = "rgba(255, 250, 238, 0.16)";
  ctx.lineWidth = 1;
  for (let y = 0; y < canvas.height; y += 6) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y - 24);
    ctx.stroke();
  }
  ctx.strokeStyle = "rgba(54, 12, 20, 0.25)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(14, 14, canvas.width - 28, canvas.height - 28);

  ctx.fillStyle = "#2b0a10";
  ctx.font = "italic 600 26px Georgia, serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Rasca para descubrir", canvas.width / 2, canvas.height / 2 - 10);
  ctx.font = "500 13px system-ui, sans-serif";
  ctx.fillStyle = "rgba(43, 10, 16, 0.72)";
  ctx.fillText("DESLIZA EL DEDO O EL RATÓN", canvas.width / 2, canvas.height / 2 + 20);

  let isDrawing = false;
  let revealed = false;
  let lastPoint = null;

  function revealPrize() {
    if (revealed) return;
    revealed = true;
    underneath.removeAttribute("aria-hidden");
    canvas.classList.add("is-cleared");
    fallbackBtn.hidden = true;
    feedback.className = "game-feedback is-success";
    feedback.innerHTML = `<p>${dayData.message}</p>`;
    if (dayData.fragmentLetter) {
      feedback.appendChild(createFragmentBadge(dayData.fragmentLetter));
    }
    onComplete(dayData);
  }

  function checkClearedRatio() {
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let cleared = 0;
    let sampled = 0;
    for (let i = 3; i < imgData.length; i += 16) {
      sampled += 1;
      if (imgData[i] < 128) cleared += 1;
    }
    if (sampled > 0 && cleared / sampled >= 0.45) {
      revealPrize();
    }
  }

  function scratchAt(clientX, clientY) {
    if (revealed) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 54;
    ctx.beginPath();
    if (lastPoint) {
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      ctx.arc(x, y, 27, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    lastPoint = { x, y };
  }

  canvas.addEventListener("pointerdown", (e) => {
    if (revealed) return;
    isDrawing = true;
    lastPoint = null;
    canvas.setPointerCapture(e.pointerId);
    scratchAt(e.clientX, e.clientY);
  });

  canvas.addEventListener("pointermove", (e) => {
    if (!isDrawing || revealed) return;
    scratchAt(e.clientX, e.clientY);
  });

  const endScratch = () => {
    if (!isDrawing) return;
    isDrawing = false;
    lastPoint = null;
    checkClearedRatio();
  };

  canvas.addEventListener("pointerup", endScratch);
  canvas.addEventListener("pointercancel", endScratch);
  fallbackBtn.addEventListener("click", revealPrize);
}

/**
 * 6. PUZZLE 3x3 INTERCAMBIABLE CON FOTO O ILUSTRACIÓN
 */
function renderPuzzle(container, dayData, onComplete) {
  const wrap = document.createElement("div");
  wrap.className = "puzzle-wrapper";

  const topInfo = document.createElement("div");
  topInfo.className = "puzzle-top-info";
  const movesEl = document.createElement("span");
  movesEl.textContent = "Movimientos: 0";
  const helpBtn = document.createElement("button");
  helpBtn.type = "button";
  helpBtn.className = "btn-outline btn-sm";
  helpBtn.textContent = "Completar puzzle";
  topInfo.append(movesEl, helpBtn);

  const board = document.createElement("div");
  board.className = "puzzle-board";

  const feedback = document.createElement("div");
  feedback.className = "game-feedback";
  feedback.setAttribute("aria-live", "polite");

  wrap.append(topInfo, board, feedback);
  container.appendChild(wrap);

  const fallbackUrl = getFallbackIllustrationUrl(dayData.fallbackTheme, dayData.day);
  let activeImageUrl = dayData.photo || fallbackUrl;

  // Comprobamos si la foto local existe; si no, usamos la ilustración SVG
  if (dayData.photo) {
    const tester = new Image();
    tester.onload = () => {
      activeImageUrl = dayData.photo;
      renderBoard();
    };
    tester.onerror = () => {
      activeImageUrl = fallbackUrl;
      renderBoard();
    };
    tester.src = dayData.photo;
  }

  // Barajar índices 0..8 evitando que salga ya resuelto
  const order = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  do {
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
  } while (order.every((v, idx) => v === idx));

  let selectedPos = null;
  let moves = 0;
  let solved = false;

  const tileButtons = Array.from({ length: 9 }, (_, pos) => {
    const tile = document.createElement("button");
    tile.type = "button";
    tile.className = "puzzle-tile";
    tile.addEventListener("click", () => {
      if (solved) return;
      if (selectedPos === null) {
        selectedPos = pos;
        renderBoard();
        return;
      }
      if (selectedPos === pos) {
        selectedPos = null;
        renderBoard();
        return;
      }
      [order[selectedPos], order[pos]] = [order[pos], order[selectedPos]];
      selectedPos = null;
      moves += 1;
      movesEl.textContent = `Movimientos: ${moves}`;

      if (order.every((v, idx) => v === idx)) {
        finishPuzzle();
      } else {
        renderBoard();
      }
    });
    board.appendChild(tile);
    return tile;
  });

  function finishPuzzle() {
    solved = true;
    selectedPos = null;
    for (let i = 0; i < 9; i++) order[i] = i;
    renderBoard();
    board.classList.add("is-solved");
    helpBtn.hidden = true;
    feedback.className = "game-feedback is-success";
    feedback.innerHTML = `<p><strong>${dayData.rewardTitle || "¡Puzzle completado!"}</strong></p><p>${dayData.message}</p>`;
    onComplete(dayData);
  }

  function renderBoard() {
    order.forEach((pieceIndex, pos) => {
      const tile = tileButtons[pos];
      tile.classList.toggle("is-selected", pos === selectedPos);
      tile.classList.toggle("is-in-place", pieceIndex === pos);
      tile.setAttribute("aria-pressed", String(pos === selectedPos));
      tile.setAttribute(
        "aria-label",
        `Pieza ${pieceIndex + 1} de 9 en posición ${pos + 1}`
      );

      const row = Math.floor(pieceIndex / 3);
      const col = pieceIndex % 3;
      tile.style.backgroundImage = `url("${activeImageUrl}")`;
      tile.style.backgroundSize = "300% 300%";
      tile.style.backgroundPosition = `${col * 50}% ${row * 50}%`;
    });
  }

  helpBtn.addEventListener("click", finishPuzzle);
  renderBoard();
}

/**
 * 7. GRAN FINAL DÍA 24: COFRE SECRETO CON CÓDIGO "M7C2V0"
 */
function renderFinale24(container, dayData, config, stateApi, daysData, onComplete) {
  const currentState = stateApi.getState();
  const fragInfo = getSecretFragmentsState(
    daysData,
    currentState.completedDays,
    currentState.creatorMode
  );

  const wrap = document.createElement("div");
  wrap.className = "finale-wrapper";

  function showUnlockedVault() {
    wrap.innerHTML = `
      <div class="finale-vault-open">
        <div class="finale-confetti" aria-hidden="true">✦</div>
        <h3 class="finale-title">${config.finaleLetterTitle}</h3>
        <p class="finale-body">${config.finaleLetterBody}</p>
        <div class="finale-gift-box">
          <span class="finale-gift-label">TU MISIÓN FINAL</span>
          <p class="finale-gift-text">${config.physicalGiftInstruction}</p>
        </div>
        <div class="dialog-actions-center">
          <a class="btn-whatsapp" href="${buildWhatsAppUrl(
            config.whatsappNumber,
            config.finaleWhatsAppText
          )}" target="_blank" rel="noopener noreferrer">
            Reclamar mi regalo por WhatsApp
          </a>
        </div>
      </div>
    `;
  }

  if (currentState.finaleUnlocked) {
    showUnlockedVault();
    container.appendChild(wrap);
    onComplete(dayData);
    return;
  }

  const slotsHtml = fragInfo.fragments
    .map(
      (f) => `
      <div class="vault-slot ${f.unlocked ? "is-ready" : ""}" title="Día ${f.day}">
        <span class="vault-slot-letter">${f.unlocked ? f.letter : "?"}</span>
        <span class="vault-slot-day">Día ${f.day}</span>
      </div>
    `
    )
    .join("");

  wrap.innerHTML = `
    <div class="finale-vault-locked">
      <p class="finale-intro">${dayData.message}</p>
      <div class="vault-slots">${slotsHtml}</div>
      <form class="vault-form" id="vault-unlock-form">
        <label for="vault-code-input" class="vault-label">Código secreto de 6 caracteres:</label>
        <input
          id="vault-code-input"
          class="vault-input"
          type="text"
          maxlength="6"
          autocomplete="off"
          placeholder="••••••"
          value=""
        />
        <div class="vault-buttons">
          <button type="submit" class="btn-gold">Abrir Cofre de Nochebuena</button>
          <button type="button" id="vault-autofill-btn" class="btn-outline">
            Rellenar con mis claves (${fragInfo.unlockedCount}/${fragInfo.totalCount})
          </button>
        </div>
        <p id="vault-feedback" class="game-feedback" aria-live="polite"></p>
      </form>
    </div>
  `;

  container.appendChild(wrap);

  const form = wrap.querySelector("#vault-unlock-form");
  const input = wrap.querySelector("#vault-code-input");
  const autofillBtn = wrap.querySelector("#vault-autofill-btn");
  const feedback = wrap.querySelector("#vault-feedback");

  autofillBtn.addEventListener("click", () => {
    const partial = fragInfo.fragments.map((f) => (f.unlocked ? f.letter : "")).join("");
    input.value = partial;
    input.focus();
    if (!fragInfo.allUnlocked) {
      feedback.className = "game-feedback is-hint";
      feedback.textContent = `Aún te faltan claves por descubrir (tienes ${fragInfo.unlockedCount} de ${fragInfo.totalCount}). Completa los días 4, 8, 12, 16, 20 y 23 para reunir el código.`;
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (validateSecretCode(input.value, config.secretWord)) {
      stateApi.unlockFinale();
      showUnlockedVault();
      onComplete(dayData);
    } else {
      feedback.className = "game-feedback is-hint";
      feedback.textContent =
        "Código incorrecto. Necesitas reunir los 6 caracteres exactos de los días 4, 8, 12, 16, 20 y 23 🔒";
      input.focus();
    }
  });
}

/**
 * Dispatcher principal que monta la mecánica interactiva correspondiente dentro del modal.
 * @returns {Function|null} Función de limpieza opcional al cerrar el modal.
 */
export function renderDayExperience({
  container,
  dayData,
  config,
  stateApi,
  daysData,
  onComplete
}) {
  container.innerHTML = "";

  switch (dayData.type) {
    case "polaroid":
      renderPolaroid(container, dayData, onComplete);
      return null;
    case "voucher":
      renderVoucher(container, dayData, config, stateApi, onComplete);
      return null;
    case "memory":
      return renderMemory(container, dayData, onComplete);
    case "catcher":
      return renderCatcher(container, dayData, onComplete);
    case "simon":
      return renderSimon(container, dayData, onComplete);
    case "whack":
      return renderWhack(container, dayData, onComplete);
    case "wordle":
      return renderWordle(container, dayData, onComplete);
    case "scratch":
      renderScratchCard(container, dayData, onComplete);
      return null;
    case "puzzle":
      renderPuzzle(container, dayData, onComplete);
      return null;
    case "finale":
      renderFinale24(container, dayData, config, stateApi, daysData, onComplete);
      return null;
    default:
      container.textContent = dayData.message || "";
      onComplete(dayData);
      return null;
  }
}
