/* ============================================================
   JUEGO: MEMORIA DEL GRAND LINE
   Juego de parejas sobre la tripulación de Luffy.
   Cada personaje tiene dos cartas: su NOMBRE y su ROL + PISTA.
   Animaciones: volteo 3D en CSS, sacudida al fallar,
   pulso al acertar y celebración al ganar.
   ============================================================ */

(function memoryGame() {
  const board = document.getElementById("gameBoard");
  if (!board) return;

  const movesEl = document.getElementById("gameMoves");
  const pairsEl = document.getElementById("gamePairs");
  const timeEl = document.getElementById("gameTime");
  const winBox = document.getElementById("gameWin");
  const winText = document.getElementById("gameWinText");

  /* ---------- Datos: 6 personajes = 12 cartas ---------- */
  const TRIPULACION = [
    { id: "luffy",   titulo: "Monkey D. Luffy",    pista: "Capitán · Sueña con ser el Rey de los Piratas" },
    { id: "zoro",    titulo: "Roronoa Zoro",       pista: "Espadachín · Pelea con tres katanas" },
    { id: "nami",    titulo: "Nami",               pista: "Navegante · Quiere dibujar el mapa del mundo" },
    { id: "sanji",   titulo: "Sanji",              pista: "Cocinero · Nunca patearía a una dama" },
    { id: "chopper", titulo: "Tony Tony Chopper",  pista: "Médico · Un reno que comió la Hito Hito no Mi" },
    { id: "brook",   titulo: "Brook",              pista: "Músico · Un esqueleto muy gentleman" }
  ];

  let deck = [];        // cartas mezcladas
  let flipped = [];     // cartas volteadas en el turno actual (máx. 2)
  let matched = 0;      // parejas encontradas
  let moves = 0;
  let lock = false;     // bloquea clics mientras se resuelve un turno
  let timer = null, seconds = 0, started = false;

  /* ---------- Utilidades ---------- */
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function formatTime(s) {
    const m = Math.floor(s / 60);
    return m + ":" + String(s % 60).padStart(2, "0");
  }

  function startTimer() {
    if (started) return;
    started = true;
    timer = setInterval(() => {
      seconds++;
      timeEl.textContent = formatTime(seconds);
    }, 1000);
  }

  /* ---------- Construcción del tablero ---------- */
  function buildDeck() {
    deck = [];
    TRIPULACION.forEach((o) => {
      deck.push({ pair: o.id, face: o.titulo, kind: "titulo" });
      deck.push({ pair: o.id, face: o.pista,  kind: "pista"  });
    });
    shuffle(deck);
  }

  function render() {
    board.innerHTML = "";
    deck.forEach((card, i) => {
      const btn = document.createElement("button");
      btn.className = "mcard";
      btn.type = "button";
      btn.dataset.pair = card.pair;
      btn.dataset.index = i;
      btn.setAttribute("aria-label", "Carta oculta " + (i + 1));
      btn.style.animationDelay = (i * 45) + "ms"; // entrada escalonada
      btn.innerHTML =
        '<span class="mcard-inner">' +
        '  <span class="mcard-front" aria-hidden="true">🏴‍☠️</span>' +
        '  <span class="mcard-back ' + card.kind + '">' + card.face + "</span>" +
        "</span>";
      btn.addEventListener("click", () => flip(btn));
      board.appendChild(btn);
    });
  }

  /* ---------- Lógica del juego ---------- */
  function flip(cardEl) {
    if (lock || cardEl.classList.contains("is-flipped") || cardEl.classList.contains("is-matched")) return;

    startTimer();
    cardEl.classList.add("is-flipped");
    flipped.push(cardEl);

    if (flipped.length < 2) return;

    // Turno completo
    moves++;
    movesEl.textContent = moves;
    const [a, b] = flipped;

    if (a.dataset.pair === b.dataset.pair) {
      // ¡Pareja!
      matched++;
      pairsEl.textContent = matched;
      a.classList.add("is-matched");
      b.classList.add("is-matched");
      flipped = [];
      if (matched === TRIPULACION.length) setTimeout(win, 650);
    } else {
      // Fallo: sacudida y se ocultan de nuevo
      lock = true;
      a.classList.add("shake");
      b.classList.add("shake");
      setTimeout(() => {
        a.classList.remove("is-flipped", "shake");
        b.classList.remove("is-flipped", "shake");
        flipped = [];
        lock = false;
      }, 900);
    }
  }

  function win() {
    clearInterval(timer);
    winText.textContent =
      "Reuniste a los 6 tripulantes en " + moves + " movimientos y " + formatTime(seconds) + ".";
    winBox.hidden = false;
    requestAnimationFrame(() => winBox.classList.add("show"));
  }

  function reset() {
    clearInterval(timer);
    timer = null; seconds = 0; started = false;
    moves = 0; matched = 0; flipped = []; lock = false;
    movesEl.textContent = "0";
    pairsEl.textContent = "0";
    timeEl.textContent = "0:00";
    winBox.classList.remove("show");
    winBox.hidden = true;
    buildDeck();
    render();
  }

  document.getElementById("gameRestart").addEventListener("click", reset);
  document.getElementById("gamePlayAgain").addEventListener("click", reset);

  reset(); // primer tablero
})();
