/**
 * CONFIGURACIÓN CENTRAL DEL CALENDARIO DE ADVIENTO DE NORA ("NORI")
 *
 * Vicent: aquí puedes editar cualquier texto, el año objetivo, tu teléfono,
 * la clave de entrada, el mensaje del regalo físico del día 24 o las rutas de fotos/audios.
 */

export const CONFIG = {
  recipientName: "Nora",
  recipientNickname: "Nori",
  senderName: "Vicent",

  // Clave numérica o de texto para entrar al calendario
  pinCode: "0207",
  pinHint: "Nuestra fecha especial (4 dígitos)",

  // Código secreto para activar el Modo Creador (toca 5 veces seguidas el título "El Adviento de Nori ✨" o abre ?creador=1)
  creatorCode: "VICENT",

  // Teléfono de Vicent en formato internacional (sin '+' ni espacios) para los vales de WhatsApp
  whatsappNumber: "34626661315",

  // Código secreto de 6 caracteres (días 4, 8, 12, 16, 20 y 23): M-7-C-2-V-0
  secretWord: "M7C2V0",

  // Año del calendario de adviento (se desbloquea del 1 al 24 de diciembre de este año)
  targetYear: 2026,

  // Mensaje final del Día 24 tras introducir el código M7C2V0
  finaleLetterTitle: "¡Código M7C2V0 verificado! Tu regalo real te está esperando 🎁",
  finaleLetterBody:
    "Feliz Navidad, mi Nori preciosa ❤️ Si has llegado hasta aquí después de estos 24 días, es hora de la sorpresa de verdad en el mundo real.",
  physicalGiftInstruction:
    "Acércate ahora mismo a Vicent, dale un abrazo gigante y susúrrale la contraseña secreta «M7C2V0» para que te entregue tu regalo de Navidad en mano (o busca junto al árbol de Navidad 😉).",
  finaleWhatsAppText:
    "¡Vicent! Acabo de descifrar el código secreto M7C2V0 en el Día 24 de mi calendario de adviento 🎁✨ ¡Quiero reclamar mi gran regalo de Navidad!"
};

/**
 * Los 24 días del calendario.
 * Tipos disponibles:
 * - "polaroid": Foto (assets/photos/dia-X.jpg o ilustración SVG romántica) que gira en 3D con dedicatoria y audio opcional.
 * - "voucher": Ticket dorado canjeable con botón de marcado y envío directo por WhatsApp a Vicent.
 * - "wordle": Mini-Wordle de 5 letras (sin spoilers; pista opcional tras 3 intentos).
 * - "memory": Juego de encontrar 6 parejas en tablero 4x3.
 * - "catcher": Arcade táctil en canvas de atrapar ingredientes para la sopa.
 * - "simon": Juego musical/luminoso tipo Simon Says de 5 rondas.
 * - "whack": Juego arcade de reflejos para atrapar al Grinch.
 * - "scratch": Tarjeta "Rasca y gana" con el dedo/ratón.
 * - "puzzle": Puzzle intercambiable 3x3 con foto o ilustración.
 * - "finale": Día 24 con caja fuerte para introducir el código secreto M7C2V0.
 */
export const DAYS_DATA = [
  {
    day: 1,
    type: "polaroid",
    title: "Bienvenida a nuestro diciembre, Nori ✨",
    subtitle: "Una puerta cada mañana",
    photo: "assets/photos/dia-1.jpg",
    audio: "assets/audio/dia-1.mp3",
    caption: "1 de diciembre · Nuestro primer día",
    fallbackTheme: "couple-lights",
    rewardTitle: "Carta de bienvenida",
    message:
      "Hola Nori ❤️ He programado este calendario de adviento pieza a pieza para ti. Desde que nuestros caminos se cruzaron en Les Coves de Vinromà hasta hoy, cada día contigo es un regalo. Abre una puerta cada mañana... y guarda bien las 6 claves doradas para Nochebuena. Te quiero, Vicent."
  },
  {
    day: 2,
    type: "memory",
    title: "Parejas de Invierno 🃏",
    subtitle: "Encuentra las 6 parejas escondidas",
    pairs: ["🍲", "✈️", "🐾", "🌯", "🎬", "❤️"],
    rewardTitle: "¡Memoria de 10!",
    message:
      "¡Memoria de 10, Nori! Igual que estas parejas, me acuerdo perfecto de nuestra primera cita en Torreblanca y de las ganas que tenía de volver a verte ❤️"
  },
  {
    day: 3,
    type: "voucher",
    title: "Noche de sofá, manta y peli 🎬",
    subtitle: "Tu primer vale dorado",
    voucherTitle: "Vale por una noche de sofá, manta y peli (100% a tu elección) 🎬🍿",
    voucherCode: "NORI-PELI-03",
    rewardTitle: "Cupón canjeable",
    message:
      "Hoy mandas tú: eliges la película o serie sin que yo rechiste, y yo me encargo de las palomitas y de calentarte los pies.",
    whatsappText:
      "¡Hola Vicent! Canjeo mi vale del Día 3 (NORI-PELI-03): hoy toca noche de sofá, manta y peli elegida por mí 🎬🍿❤️"
  },
  {
    day: 4,
    type: "wordle",
    fragmentLetter: "M",
    title: "Reto Wordle #1 🟩",
    subtitle: "Adivina la palabra oculta de 5 letras",
    word: "MILAN",
    hint: "Es una ciudad famosa del norte de Italia, destino de puente de diciembre",
    rewardTitle: "¡Clave M desbloqueada!",
    message:
      "¡Era MILAN! Qué ganas de recorrer cada calle contigo este puente 🇮🇹✨ Has desbloqueado el 1.er carácter del código secreto: M."
  },
  {
    day: 5,
    type: "scratch",
    title: "¡Empieza el puente! Rasca tu sorpresa viajera 🪙",
    subtitle: "Desliza el dedo sobre el dorado",
    scratchHeadline: "🍨 ¡Gelato o Aperitivo en Milán!",
    scratchPrize:
      "🍨 ¡Vale por un auténtico Gelato o Aperitivo en Milán! Invita Vicent mientras paseamos por Italia.",
    rewardTitle: "Sorpresa descubierta",
    message:
      "Este puente en Milán te invito a lo que más te apetezca mientras nos perdemos por sus plazas y callecitas."
  },
  {
    day: 6,
    type: "polaroid",
    title: "Bajo el cielo de Milán contigo 🇮🇹❤️",
    subtitle: "Recuerdo Polaroid del puente",
    photo: "assets/photos/dia-6.jpg",
    audio: "assets/audio/dia-6.mp3",
    caption: "6 de diciembre · Milán & tú",
    fallbackTheme: "milan-duomo",
    rewardTitle: "Postal de invierno",
    message:
      "No importa si estamos en Italia, en tu pueblo o en casa: mi sitio favorito siempre es donde estés tú, Nori."
  },
  {
    day: 7,
    type: "voucher",
    title: "Desayuno de reina ☕🥐",
    subtitle: "Vale dorado de domingo",
    voucherTitle: "Vale por un desayuno de reina en la cama (o en tu cafetería favorita) ☕🥐",
    voucherCode: "NORI-DESAYUNO-07",
    rewardTitle: "Cupón canjeable",
    message:
      "Tú quédate calentita entre las sábanas; hoy el desayuno corre de mi cuenta.",
    whatsappText:
      "¡Buenos días Vicent! Canjeo mi vale del Día 7 (NORI-DESAYUNO-07): quiero mi desayuno de reina ☕🥐💛"
  },
  {
    day: 8,
    type: "catcher",
    fragmentLetter: "7",
    title: "¡La Sopa Calentita de Nori! 🍲",
    subtitle: "Desliza la olla y atrapa 10 ingredientes ricos (evita los calcetines y bombas)",
    targetScore: 10,
    rewardTitle: "¡Sopa perfecta! Clave 7 desbloqueada",
    message:
      "¡Nadie hace ni disfruta la sopa tanto como tú, Nori! 🍲❤️ Has desbloqueado el 2.º carácter del código secreto: 7."
  },
  {
    day: 9,
    type: "puzzle",
    title: "Pieza a pieza: Nuestra historia 🧩",
    subtitle: "Ordena la imagen tocando dos piezas para intercambiarlas",
    photo: "assets/photos/dia-9.jpg",
    fallbackTheme: "puzzle-hearts",
    rewardTitle: "Puzzle completado",
    message: "Igual que este puzzle, todo encaja mejor cuando estamos juntos."
  },
  {
    day: 10,
    type: "voucher",
    title: "Tu pinche de cocina oficial 👨‍🍳✨",
    subtitle: "Vale dorado entre fogones",
    voucherTitle: "Vale por ser tu pinche de cocina oficial y fregarlo todo 👨‍🍳✨",
    voucherCode: "NORI-COCINA-10",
    rewardTitle: "Cupón canjeable",
    message:
      "Sé cuánto te encanta cocinar, así que hoy elegimos la receta que más te apetezca: yo corto, ayudo en todo lo que me digas y al terminar dejo la cocina impecable.",
    whatsappText:
      "¡Chef Nori al habla! Canjeo mi vale del Día 10 (NORI-COCINA-10): hoy te toca ser mi pinche de cocina y fregarlo todo 👨‍🍳✨"
  },
  {
    day: 11,
    type: "wordle",
    title: "Reto Wordle #2 🟩",
    subtitle: "Palabra oculta de 5 letras",
    word: "COVES",
    hint: "Tiene que ver con el lugar donde se cruzaron nuestros caminos",
    rewardTitle: "¡Palabra acertada!",
    message:
      "¡Les Coves de Vinromà! Qué casualidad tan bonita que nos conociéramos en Coves y que tu rincón favorito sea Cuevas de Cañart ❤️"
  },
  {
    day: 12,
    type: "scratch",
    fragmentLetter: "C",
    title: "Ecuador de diciembre: Rasca tu mimo de hoy ✨",
    subtitle: "Rasca para descubrir premio + clave secreta",
    scratchHeadline: "💆‍♀️ Masaje relajante + Clave C",
    scratchPrize:
      "💆‍♀️ ¡Vale por un masaje relajante de 25 minutos sin prisas! + 3.er carácter secreto: C.",
    rewardTitle: "¡Clave C desbloqueada!",
    message:
      "Has llegado a la mitad del calendario, Nori. Disfruta de tu masaje cuando quieras y guarda el carácter C en tu colección secreta."
  },
  {
    day: 13,
    type: "polaroid",
    title: "De Cuevas de Cañart al fin del mundo 🏔️💕",
    subtitle: "Recuerdo Polaroid con encanto",
    photo: "assets/photos/dia-13.jpg",
    audio: "assets/audio/dia-13.mp3",
    caption: "13 de diciembre · Cuevas de Cañart",
    fallbackTheme: "mountain-village",
    rewardTitle: "Dedicatoria especial",
    message:
      "Me encanta ver cómo te brillan los ojos cuando estás en Cuevas de Cañart. Gracias por enseñarme a querer tus rincones tanto como tú."
  },
  {
    day: 14,
    type: "simon",
    title: "Luces de Cuevas a Coves 🔔",
    subtitle: "Memoriza y repite la secuencia navideña (5 rondas)",
    rounds: 5,
    rewardTitle: "¡Oído y memoria mágicos!",
    message:
      "¡De Les Coves de Vinromà a Cuevas de Cañart! Hasta nuestros pueblos parecían destinados a coincidir ✨"
  },
  {
    day: 15,
    type: "voucher",
    title: "Excursión de naturaleza y animales 🐾🌿",
    subtitle: "Vale dorado de aventura",
    voucherTitle: "Vale por una excursión de naturaleza y animales 🐾🌿",
    voucherCode: "NORI-ANIMALES-15",
    rewardTitle: "Cupón canjeable",
    message:
      "Un día de escapada al aire libre para desconectar, ver animales y disfrutar de la naturaleza como tanto te gusta.",
    whatsappText:
      "¡Vicent! Canjeo mi vale del Día 15 (NORI-ANIMALES-15): nos vamos de excursión a ver animales y naturaleza 🐾🌿💚"
  },
  {
    day: 16,
    type: "wordle",
    fragmentLetter: "2",
    title: "Reto Wordle #3 🟩",
    subtitle: "Palabra oculta de 5 letras",
    word: "SOPAS",
    hint: "Está en plural y se toma bien caliente con cuchara",
    rewardTitle: "¡Clave 2 desbloqueada!",
    message:
      "¡SOPAS! No podía faltar en tu calendario 😄 Y con esto consigues el 4.º carácter secreto: 2."
  },
  {
    day: 17,
    type: "polaroid",
    title: "Tu risa es mi canción favorita 🎶",
    subtitle: "Gira la Polaroid",
    photo: "assets/photos/dia-17.jpg",
    audio: "assets/audio/dia-17.mp3",
    caption: "17 de diciembre · Sonrisa infinita",
    fallbackTheme: "music-stars",
    rewardTitle: "Recuerdo luminoso",
    message:
      "Cada vez que sonríes haces que cualquier día gris parezca Navidad. Te adoro, Nori."
  },
  {
    day: 18,
    type: "scratch",
    title: "Un capricho dulce para hoy 🍫",
    subtitle: "Rasca la tarjeta dorada",
    scratchHeadline: "🍰 ¡Tu capricho dulce de hoy!",
    scratchPrize:
      "🍰 ¡Vale por tu postre, merienda o chocolate favorito hoy mismo! Pídemelo y es tuyo.",
    rewardTitle: "Capricho desbloqueado",
    message:
      "Hoy no hay excusas: dime qué dulce, tarta o chocolate te apetece y voy a por él."
  },
  {
    day: 19,
    type: "puzzle",
    title: "Otro recuerdo para armar juntos 🧩",
    subtitle: "Ordena las 9 piezas tocándolas",
    photo: "assets/photos/dia-19.jpg",
    fallbackTheme: "winter-cabin",
    rewardTitle: "Puzzle completado",
    message:
      "Gracias por cada risa, cada viaje y cada plato rico compartido este año."
  },
  {
    day: 20,
    type: "voucher",
    fragmentLetter: "V",
    title: "¡Noche de Burrito o Burguer! 🌯🍔",
    subtitle: "Vale dorado + 5.º carácter secreto",
    voucherTitle: "Vale por un buen burrito o una burguer bien rica (invita Vicent) 🌯🍔",
    voucherCode: "NORI-BURGER-20",
    rewardTitle: "¡Clave V desbloqueada!",
    message:
      "Nada de etiquetas ni platos diminutos: hoy te invito a un buen burrito o a una hamburguesa de las que se comen con las dos manos. ¡Tú eliges cuál cae! Además tienes la clave V.",
    whatsappText:
      "¡Hola Vicent! Canjeo mi vale del Día 20 (NORI-BURGER-20): ¡hoy me invitas a un burrito o una burguer! 🌯🍔😋"
  },
  {
    day: 21,
    type: "whack",
    title: "¡Que el Grinch no robe la Navidad! 👹",
    subtitle: "Toca 10 Grinches rápido (¡cuidado con los animalitos amigos!)",
    targetScore: 10,
    rewardTitle: "¡Navidad salvada!",
    message: "¡Reflejos de campeona! Ni el Grinch nos quita nuestras Navidades juntos ❤️🎄"
  },
  {
    day: 22,
    type: "polaroid",
    title: "Lo mejor de mi año eres tú 🌟",
    subtitle: "Ya casi es Nochebuena...",
    photo: "assets/photos/dia-22.jpg",
    audio: "assets/audio/dia-22.mp3",
    caption: "22 de diciembre · Contigo todo brilla",
    fallbackTheme: "couple-lights",
    rewardTitle: "Recuerdo del año",
    message:
      "Mirando atrás a todo este año, mis mejores recuerdos tienen todos algo en común: tú estás en ellos, Nori."
  },
  {
    day: 23,
    type: "scratch",
    fragmentLetter: "0",
    title: "¡La víspera de Nochebuena! Rasca la última clave 🗝️",
    subtitle: "Consigue el último carácter del código secreto",
    scratchHeadline: "🗝️ ¡Última clave: 0!",
    scratchPrize:
      "🎉 ¡Has conseguido el 6.º y último carácter secreto: 0! Mañana día 24 podrás usar el código completo (M7C2V0) para abrir tu gran sorpresa.",
    rewardTitle: "¡Código M7C2V0 completo!",
    message:
      "Ya tienes todas las piezas del código secreto: M · 7 · C · 2 · V · 0. ¡Mañana se abre la puerta más especial!"
  },
  {
    day: 24,
    type: "finale",
    title: "¡Feliz Nochebuena, Nori! El Cofre Secreto 🎁🎄",
    subtitle: "Introduce tu código secreto de 6 caracteres",
    rewardTitle: "El Gran Regalo de Nochebuena",
    message:
      "¡Has llegado al día 24! Introduce los 6 caracteres secretos que has reunido durante diciembre para abrir tu cofre."
  }
];
