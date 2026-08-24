/* ============================================================
   CHATBOT "LOG POSE"
   Bot basado en reglas (sin servidor): detecta palabras clave
   y responde sobre Luffy, la tripulación, el manga/anime,
   las películas y dónde ver la serie de forma oficial.
   Incluye chips de sugerencias y efecto de "escribiendo…".
   ============================================================ */

(function chatbot() {
  const fab = document.getElementById("chatFab");
  const win = document.getElementById("chatWindow");
  const closeBtn = document.getElementById("chatClose");
  const messages = document.getElementById("chatMessages");
  const chipsBox = document.getElementById("chatChips");
  const form = document.getElementById("chatForm");
  const input = document.getElementById("chatInput");
  if (!fab || !win) return;

  /* ---------- Base de conocimiento ---------- */
  /* Cada regla: palabras clave (en minúscula, sin tildes) + respuesta.
     Se evalúan en orden; gana la primera que coincida. */
  const KB = [
    {
      keys: ["luffy", "gomu gomu", "rey de los piratas", "capitan"],
      reply:
        "👑 <strong>Monkey D. Luffy</strong> es el capitán de los Sombrero de Paja. Comió la " +
        "<strong>Gomu Gomu no Mi</strong>, una fruta del diablo que volvió su cuerpo elástico, y sueña " +
        "con encontrar el One Piece para ser el Rey de los Piratas. Su recompensa actual supera " +
        "los 3 mil millones de berries."
    },
    {
      keys: ["zoro", "roronoa", "katanas", "espada"],
      reply:
        "⚔️ <strong>Roronoa Zoro</strong> es el espadachín de la tripulación y el primero en unirse a Luffy. " +
        "Pelea con su estilo de <em>tres katanas</em> (Santoryu) y quiere derrotar al mejor espadachín " +
        "del mundo, Dracule Mihawk, para cumplir una promesa."
    },
    {
      keys: ["nami", "navegante", "mapas"],
      reply:
        "🧭 <strong>Nami</strong> es la navegante: lee el clima del Grand Line como nadie gracias a su " +
        "<strong>Log Pose</strong>. Su sueño es dibujar el primer mapa completo del mundo. " +
        "Ojo con su Clima-Tact y con su amor por el dinero 💰"
    },
    {
      keys: ["sanji", "cocinero", "cocina"],
      reply:
        "🍳 <strong>Sanji</strong> es el cocinero del barco, discípulo del Zeff del Baratie. Pelea solo con " +
        "piernas (para no dañar sus manos de chef) y tiene una regla de oro: nunca patearía a una dama. " +
        "Su sueño es encontrar el All Blue, el mar donde confluyen todos los peces."
    },
    {
      keys: ["chopper", "reno", "medico", "doctor"],
      reply:
        "🦌 <strong>Tony Tony Chopper</strong> es el médico a bordo: un reno que comió la " +
        "<strong>Hito Hito no Mi</strong> y ganó conciencia y forma humana. Viene de Drum Island, " +
        "donde aprendió medicina con la doctora Kureha. Es adorable… y letal en sus transformaciones."
    },
    {
      keys: ["brook", "esqueleto", "musico"],
      reply:
        "🎻 <strong>Brook</strong> es el músico: un esqueleto gentleman revivido por la Yomi Yomi no Mi. " +
        "Toca la viola, canta <em>Binks' Sake</em> y lleva décadas esperando reencontrarse con Laboon, " +
        "la ballena que dejó esperándolo. ¡Yohohoho!"
    },
    {
      keys: ["tripulacion", "tripulantes", "miembros", "integrantes", "mugiwaras"],
      reply:
        "🏴‍☠️ La <strong>tripulación de los Sombrero de Paja</strong>:<br>" +
        "• <strong>Luffy</strong> — capitán<br>" +
        "• <strong>Zoro</strong> — espadachín<br>" +
        "• <strong>Nami</strong> — navegante<br>" +
        "• <strong>Usopp</strong> — francotirador<br>" +
        "• <strong>Sanji</strong> — cocinero<br>" +
        "• <strong>Chopper</strong> — médico<br>" +
        "• <strong>Robin</strong> — arqueóloga<br>" +
        "• <strong>Franky</strong> — carpintero<br>" +
        "• <strong>Brook</strong> — músico<br>" +
        "• <strong>Jinbe</strong> — timonel"
    },
    {
      keys: ["fruta del diablo", "frutas del diablo", "akuma no mi", "poderes"],
      reply:
        "🍎 Las <strong>frutas del diablo</strong> otorgan poderes únicos a cambio de que el mar te rechace: " +
        "quien las come no puede nadar. Hay tres tipos: <strong>Paramecia</strong> (poderes varios), " +
        "<strong>Zoan</strong> (transformación animal) y <strong>Logia</strong> (elementos naturales). " +
        "Luffy es Paramecia… o eso parecía hasta el despertar de su Gear 5."
    },
    {
      keys: ["haki", "ambicion"],
      reply:
        "💪 El <strong>Haki</strong> es la ambición hecha poder. Existen tres tipos: el de " +
        "<strong>Percepción</strong>, el de <strong>Armamento</strong> y el rarísimo " +
        "<strong>Haki del Rey Conquistador</strong>, capaz de dejar inconscientes a los débiles. " +
        "Solo uno entre millones nace con él… y Luffy es uno de esos."
    },
    {
      keys: ["oda", "autor", "creador", "quien escribio", "quien dibuja"],
      reply:
        "✏️ <strong>Eiichiro Oda</strong> (Kumamoto, 1975) creó One Piece. Publicó los one-shots de " +
        "<em>Romance Dawn</em> en 1996 y en 1997 debutó la serie en la Weekly Shōnen Jump. Ostenta " +
        "el Récord Guinness al cómic con más copias publicadas por un único autor."
    },
    {
      keys: ["manga", "1997", "shonen jump", "cuando empezo", "capitulos"],
      reply:
        "📖 El manga debutó el <strong>22 de julio de 1997</strong> en la Weekly Shōnen Jump y sigue en " +
        "publicación: supera los <strong>1.100 capítulos</strong> recopilados en más de 100 tomos. " +
        "Se lee legalmente y gratis en Manga Plus de Shueisha."
    },
    {
      keys: ["anime", "1999", "toei", "episodios"],
      reply:
        "📺 El anime se estrenó el <strong>20 de octubre de 1999</strong> en Fuji TV, producido por " +
        "Toei Animation, y ya supera los <strong>1.100 episodios</strong>. En Crunchyroll se sigue con " +
        "simulcast simultáneo a Japón. La sección <a href=\"#video\">Opening</a> recuerda cómo empezó todo."
    },
    {
      keys: ["netflix", "live action", "live-action", "serie real", "godoy"],
      reply:
        "🎬 El <strong>live-action de Netflix</strong> (2023) adapta el arco de East Blue con Iñaki Godoy " +
        "como Luffy y supervisión directa de Oda. Fue renovada por varias temporadas; la segunda pondrá " +
        "rumbo a Loguetown y Alabasta."
    },
    {
      keys: ["pelicula", "film red", "stampede", "uta", "cine"],
      reply:
        "🍿 Entre las películas destacan <strong>One Piece Film: Red</strong> (2022), la más taquillera " +
        "de la franquicia con Uta, hija de Shanks, y <strong>One Piece: Stampede</strong> (2019), el " +
        "festival pirata del 20.º aniversario. En la sección <a href=\"#obras\">La saga</a> hay más info."
    },
    {
      keys: ["odyssey", "videojuego", "consola"],
      reply:
        "🎮 <strong>One Piece Odyssey</strong> (2023) es un RPG por turnos donde la tripulación despierta " +
        "en la isla de Waford sin sus recuerdos y debe reconstruir su historia. Hay más títulos: Pirate " +
        "Warriors (musou) y World Seeker."
    },
    {
      keys: ["tesoro", "one piece es real", "laugh tale", "raftel", "roger", "recompensa"],
      reply:
        "💰 El <strong>One Piece</strong> es el gran tesoro dejado por Gol D. Roger en la isla final, " +
        "<strong>Laugh Tale</strong>. Quien lo encuentre heredará su título de Rey de los Piratas. " +
        "Nadie sabe aún qué es: ni los lectores. Ese misterio mueve más de 25 años de historia."
    },
    {
      keys: ["grand line", "gran line", "log pose", "nuevo mundo"],
      reply:
        "🌊 El <strong>Grand Line</strong> es el mar más peligroso del mundo: clima imposible, islas con " +
        "magnetismo propio y monstruos marinos. Para navegarlo se usa el <strong>Log Pose</strong>, una " +
        "brújula que apunta a la siguiente isla. Después llega el Nuevo Mundo… si sobrevives al primero."
    },
    {
      keys: ["record", "guinness", "500 millones", "ventas", "copias"],
      reply:
        "🏆 One Piece ostenta el <strong>Récord Guinness</strong> como el cómic con más ejemplares " +
        "publicados de una misma serie por un único autor, y superó los <strong>500 millones de copias</strong> " +
        "en circulación en 2022. Nada comparable en la historia del manga."
    },
    {
      keys: ["opening", "we are", "kitadani", "cancion", "youtube"],
      reply:
        "🎵 <strong>We Are!</strong>, cantado por Hiroshi Kitadani, fue el primer opening del anime en 1999 " +
        "y es el himno oficial de la saga. Puedes verlo en la sección <a href=\"#video\">Opening</a> de esta página."
    },
    {
      keys: ["oficial", "crunchyroll", "donde ver", "plataformas", "legal", "manga plus"],
      reply:
        "🧭 Para seguir la aventura de forma oficial:<br>" +
        "• <strong>Manga Plus</strong> — capítulos gratis y legales<br>" +
        "• <strong>Crunchyroll</strong> — anime al día<br>" +
        "• <strong>Netflix</strong> — sagas clásicas y live-action<br>" +
        '• <a href="https://one-piece.com/" target="_blank" rel="noopener">one-piece.com</a> — web oficial japonesa.<br>' +
        'También tienes la sección <a href="#oficial">Oficial</a> de esta página.'
    },
    {
      keys: ["juego", "jugar", "memoria"],
      reply:
        '🎮 ¡Claro! Sube a la sección <a href="#juego">Memoria del Grand Line</a> y reúne a toda la ' +
        "tripulación encontrando sus parejas. A ver en cuántos movimientos lo logras 😉"
    },
    {
      keys: ["gabo", "garcia marquez", "macondo", "cien anos"],
      reply:
        "🤔 Creo que estás pensando en otra página 😄 Aquí solo hablamos de piratas, frutas del diablo " +
        "y del gran tesoro. ¿Quieres saber por <strong>Luffy</strong>, la <strong>tripulación</strong> o " +
        "<strong>dónde ver la serie</strong>?"
    },
    {
      keys: ["hola", "buenas", "hey", "saludos", "hi"],
      reply:
        "¡Ahoy! 🏴‍☠️ Soy el bot Log Pose de este sitio. Puedo contarte sobre <strong>Luffy y la " +
        "tripulación</strong>, las <strong>frutas del diablo</strong>, el <strong>manga y el anime</strong>, " +
        "las <strong>películas</strong> o <strong>dónde verlo de forma legal</strong>. ¿Qué quieres saber?"
    },
    {
      keys: ["gracias", "genial", "perfecto"],
      reply: "¡A tu orden, marinero! ⚓ Si quieres saber algo más del Grand Line, aquí estoy."
    }
  ];

  const FALLBACK =
    "Ese dato se me cayó al mar 🤔. Prueba preguntarme por: " +
    "<em>Luffy</em>, <em>la tripulación</em>, <em>las frutas del diablo</em>, " +
    "<em>el anime</em>, <em>las películas</em>, <em>los récords del manga</em> o <em>dónde verlo legal</em>.";

  const CHIPS = [
    "¿Quién es Luffy?",
    "Tripulación completa",
    "Frutas del diablo",
    "Récords del manga",
    "Dónde verlo legal",
    "El juego de memoria"
  ];

  /* ---------- Utilidades ---------- */
  // Quita tildes y pasa a minúsculas para comparar sin errores
  const normalize = (s) =>
    s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  function answerFor(text) {
    const q = normalize(text);
    for (const rule of KB) {
      if (rule.keys.some((k) => q.includes(k))) return rule.reply;
    }
    return FALLBACK;
  }

  function addMessage(html, who) {
    const div = document.createElement("div");
    div.className = "chat-msg " + who; // "bot" o "user"
    div.innerHTML = html;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }

  function botReply(text) {
    // Burbuja "escribiendo…" y respuesta con retraso natural
    const typing = addMessage('<span class="typing"><i></i><i></i><i></i></span>', "bot");
    setTimeout(() => {
      typing.innerHTML = answerFor(text);
      messages.scrollTop = messages.scrollHeight;
    }, 550 + Math.random() * 450);
  }

  function send(text) {
    if (!text.trim()) return;
    addMessage(text.replace(/</g, "&lt;"), "user");
    botReply(text);
  }

  /* ---------- Chips de sugerencias ---------- */
  CHIPS.forEach((label) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip";
    b.textContent = label;
    b.addEventListener("click", () => send(label));
    chipsBox.appendChild(b);
  });

  /* ---------- Abrir / cerrar ---------- */
  let greeted = false;
  function openChat() {
    win.hidden = false;
    fab.setAttribute("aria-expanded", "true");
    requestAnimationFrame(() => win.classList.add("open"));
    if (!greeted) {
      greeted = true;
      setTimeout(() => {
        addMessage(
          "¡Ahoy! 🏴‍☠️ Pregúntame por <strong>Luffy</strong>, la <strong>tripulación</strong>, " +
          "las <strong>frutas del diablo</strong>, el <strong>anime</strong> o <strong>dónde ver la " +
          "serie legalmente</strong>. También puedes tocar una sugerencia aquí abajo.",
          "bot"
        );
      }, 350);
    }
    input.focus();
  }
  function closeChat() {
    win.classList.remove("open");
    fab.setAttribute("aria-expanded", "false");
    setTimeout(() => { win.hidden = true; }, 300);
  }

  fab.addEventListener("click", () => (win.hidden ? openChat() : closeChat()));
  closeBtn.addEventListener("click", closeChat);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    send(input.value);
    input.value = "";
  });
})();
