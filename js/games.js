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
    <span class="fragment-award-icon">🗝️</span>
    <div>
      <strong>¡Fragmento Secreto Desbloqueado!</strong>
      <p>Has conseguido la letra dorada <span class="fragment-pill">${letter}</span> para el cofre del Día 24.</p>
    </div>
  `;
  return badge;
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
  hint.textContent = "Toca la foto para darle la vuelta ↻";
  front.append(imgWrap, caption, hint);

  const back = document.createElement("div");
  back.className = "polaroid-face polaroid-back";
  const backTitle = document.createElement("h3");
  backTitle.className = "polaroid-back-title";
  backTitle.textContent = dayData.rewardTitle || "Para Nori ❤️";
  const msg = document.createElement("p");
  msg.className = "polaroid-back-message";
  msg.textContent = dayData.message;
  const sign = document.createElement("p");
  sign.className = "polaroid-signature";
  sign.textContent = "Con todo mi cariño, Vicent ❤️";
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
    audioLabel.textContent = "🎧 Mensaje / canción del día:";
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
  flipBtn.textContent = "🔄 Girar Polaroid y leer dedicatoria";

  let flipped = false;
  const toggleFlip = (e) => {
    if (e && e.target && e.target.closest(".polaroid-audio-box")) return;
    flipped = !flipped;
    card.classList.toggle("is-flipped", flipped);
    flipBtn.textContent = flipped ? "🖼️ Ver fotografía" : "🔄 Girar Polaroid y leer dedicatoria";
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
    <div class="voucher-stamp" aria-hidden="true">CANJEADO ✨</div>
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
  waBtn.textContent = `💬 Canjear por WhatsApp con ${config.senderName}`;

  const markBtn = document.createElement("button");
  markBtn.type = "button";
  markBtn.className = "btn-outline";
  markBtn.textContent = isRedeemed ? "✅ ¡Vale ya canjeado!" : "🎟️ Marcar como canjeado";

  const markAsRedeemed = () => {
    isRedeemed = true;
    ticket.classList.add("is-redeemed");
    markBtn.textContent = "✅ ¡Vale ya canjeado!";
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
 * 3. QUIZ SOBRE VUESTRA HISTORIA
 */
function renderQuiz(container, dayData, onComplete) {
  const box = document.createElement("div");
  box.className = "quiz-box";

  const questionEl = document.createElement("h3");
  questionEl.className = "quiz-question";
  questionEl.textContent = dayData.question;

  const optionsGrid = document.createElement("div");
  optionsGrid.className = "quiz-options";

  const feedback = document.createElement("div");
  feedback.className = "game-feedback";
  feedback.setAttribute("aria-live", "polite");

  let solved = false;

  dayData.options.forEach((optText, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "quiz-option-btn";
    btn.textContent = optText;

    btn.addEventListener("click", () => {
      if (solved) return;

      if (idx === dayData.correctIndex) {
        solved = true;
        btn.classList.add("is-correct");
        optionsGrid.querySelectorAll("button").forEach((b) => {
          b.disabled = true;
        });
        feedback.className = "game-feedback is-success";
        feedback.innerHTML = `<p><strong>${dayData.rewardTitle || "¡Acertaste!"}</strong></p><p>${dayData.message}</p>`;
        if (dayData.fragmentLetter) {
          feedback.appendChild(createFragmentBadge(dayData.fragmentLetter));
        }
        onComplete(dayData);
      } else {
        btn.classList.add("is-wrong");
        feedback.className = "game-feedback is-hint";
        feedback.textContent = dayData.wrongHint || "¡Casi! Prueba con otra opción 😉";
      }
    });

    optionsGrid.appendChild(btn);
  });

  box.append(questionEl, optionsGrid, feedback);
  container.appendChild(box);
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

  const hintBox = document.createElement("p");
  hintBox.className = "wordle-hint";
  hintBox.textContent = `💡 ${dayData.hint}`;

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

  wrapper.append(hintBox, board, statusMsg, keyboardEl);
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
  fallbackBtn.textContent = "✨ Descubrir directamente";

  card.append(underneath, canvas);
  wrap.append(card, feedback, fallbackBtn);
  container.appendChild(wrap);

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  // Pintamos la lámina dorada metálica
  const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grad.addColorStop(0, "#d4af37");
  grad.addColorStop(0.5, "#f7df8d");
  grad.addColorStop(1, "#b88a1e");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Detalles festivos encima del dorado
  ctx.fillStyle = "rgba(92, 19, 30, 0.25)";
  for (let i = 0; i < 36; i++) {
    const sx = (i * 73) % canvas.width;
    const sy = (i * 41) % canvas.height;
    ctx.beginPath();
    ctx.arc(sx, sy, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "#4a0e17";
  ctx.font = "bold 24px Georgia, serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("✨ RASCA AQUÍ ✨", canvas.width / 2, canvas.height / 2 - 12);
  ctx.font = "16px system-ui, sans-serif";
  ctx.fillText("Desliza el dedo o el ratón", canvas.width / 2, canvas.height / 2 + 20);

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
  helpBtn.textContent = "💡 Completar puzzle";
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
 * 7. GRAN FINAL DÍA 24: COFRE SECRETO CON CÓDIGO "NORITA"
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
        <div class="finale-confetti" aria-hidden="true">✨ 🎁 🎄 ❤️ ✨</div>
        <h3 class="finale-title">${config.finaleLetterTitle}</h3>
        <p class="finale-body">${config.finaleLetterBody}</p>
        <div class="finale-gift-box">
          <span class="finale-gift-label">🗝️ TU MISIÓN FINAL:</span>
          <p class="finale-gift-text">${config.physicalGiftInstruction}</p>
        </div>
        <div class="dialog-actions-center">
          <a class="btn-whatsapp" href="${buildWhatsAppUrl(
            config.whatsappNumber,
            config.finaleWhatsAppText
          )}" target="_blank" rel="noopener noreferrer">
            📲 Reclamar mi regalo a ${config.senderName} por WhatsApp
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
        <label for="vault-code-input" class="vault-label">Código secreto de 6 letras:</label>
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
          <button type="submit" class="btn-gold">🔓 Abrir Cofre de Nochebuena</button>
          <button type="button" id="vault-autofill-btn" class="btn-outline">
            ✨ Rellenar con mis fragmentos (${fragInfo.unlockedCount}/${fragInfo.totalCount})
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
      feedback.textContent = `Aún te faltan letras por descubrir (tienes ${fragInfo.unlockedCount} de ${fragInfo.totalCount}), ¡pero puedes completar las que faltan si las adivinas!`;
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
        "Ese no es el código mágico... ¡Pista: es un diminutivo muy bonito de Nora de 6 letras! ❤️";
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
    case "quiz":
      renderQuiz(container, dayData, onComplete);
      return null;
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
