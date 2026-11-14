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

  // Código secreto para activar el Modo Creador y previsualizar cualquier día antes de tiempo
  creatorCode: "VICENT",

  // Teléfono de Vicent en formato internacional (sin '+' ni espacios) para los vales de WhatsApp
  whatsappNumber: "34626661315",

  // Palabra secreta formada por los 6 fragmentos dorados (días 4, 8, 12, 16, 20 y 23)
  secretWord: "NORITA",

  // Año del calendario de adviento (se desbloquea del 1 al 24 de diciembre de este año)
  targetYear: 2026,

  // Mensaje final del Día 24 tras introducir el código NORITA
  finaleLetterTitle: "¡Código NORITA verificado! Tu regalo real te está esperando 🎁",
  finaleLetterBody:
    "Feliz Navidad, mi Nori preciosa ❤️ Si has llegado hasta aquí después de estos 24 días, es hora de la sorpresa de verdad en el mundo real.",
  physicalGiftInstruction:
    "Acércate ahora mismo a Vicent, dale un abrazo gigante y susúrrale la contraseña secreta «NORITA» para que te entregue tu regalo de Navidad en mano (o busca junto al árbol de Navidad 😉).",
  finaleWhatsAppText:
    "¡Vicent! Acabo de descifrar el código secreto NORITA en el Día 24 de mi calendario de adviento 🎁✨ ¡Quiero reclamar mi gran regalo de Navidad!"
};

/**
 * Los 24 días del calendario.
 * Tipos disponibles:
 * - "polaroid": Foto (assets/photos/dia-X.jpg o ilustración SVG romántica) que gira en 3D con dedicatoria y audio opcional.
 * - "voucher": Ticket dorado canjeable con botón de marcado y envío directo por WhatsApp a Vicent.
 * - "quiz": Pregunta tipo test sobre vuestra historia.
 * - "wordle": Mini-Wordle de 5 letras con pista.
 * - "scratch": Tarjeta "Rasca y gana" con el dedo/ratón.
 * - "puzzle": Puzzle deslizante/intercambiable 3x3 con foto o ilustración.
 * - "finale": Día 24 con caja fuerte para introducir el código secreto NORITA.
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
      "Hola Nori ❤️ He programado este calendario de adviento pieza a pieza para ti. Desde que nuestros caminos se cruzaron en Les Coves de Vinromà hasta hoy, cada día contigo es un regalo. Abre una puerta cada mañana... y guarda bien los fragmentos dorados para Nochebuena. Te quiero, Vicent."
  },
  {
    day: 2,
    type: "quiz",
    title: "¿Cuánto recuerdas de nuestro principio? 💫",
    subtitle: "Pregunta sobre nuestra historia",
    question: "¿Dónde tuvimos nuestra primera cita oficial?",
    options: ["Torreblanca", "Peñíscola", "Castellón", "Benicàssim"],
    correctIndex: 0,
    wrongHint: "Pista: está cerquita del mar y empezó todo con mucha magia...",
    rewardTitle: "¡Memoria de 10!",
    message:
      "¡Siii, en Torreblanca! Todavía me acuerdo de los nervios y de lo mucho que me gustó hablar contigo desde el primer minuto."
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
    fragmentLetter: "N",
    title: "Wordle viajero: ¡Prepara la maleta! ✈️",
    subtitle: "Adivina la palabra de 5 letras",
    word: "MILAN",
    hint: "Tiene 5 letras: nuestro destino de este puente de diciembre 🇮🇹",
    rewardTitle: "¡Fragmento N desbloqueado!",
    message:
      "¡Nos vamos a Milán este puente, Nori! 🇮🇹✨ Qué ganas de recorrer cada calle contigo. Además, has desbloqueado el 1.er fragmento secreto: la letra N."
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
    type: "quiz",
    fragmentLetter: "O",
    title: "El test gastronómico de Nori 🍲",
    subtitle: "Acierta para ganar el 2.º fragmento",
    question:
      "Si hace frío en diciembre y Nori puede pedir su plato reconfortante favorito del mundo, ¿cuál elige sin dudar?",
    options: [
      "Una buena sopa calentita 🍲",
      "Sushi helado 🍣",
      "Gazpacho con hielo 🍅",
      "Ensalada de lechuga 🥗"
    ],
    correctIndex: 0,
    wrongHint: "Pista: lleva cuchara, sale humeante y te encanta hacerla en invierno...",
    rewardTitle: "¡Fragmento O desbloqueado!",
    message:
      "¡Nadie ama la sopa tanto como mi Nori! Hoy te has ganado un plato bien calentito hecho con amor y el 2.º fragmento del código: la letra O."
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
    title: "Wordle con raíces especiales 🏡",
    subtitle: "Palabra de 5 letras",
    word: "COVES",
    hint: "5 letras: el pueblo de Vicent donde nos conocimos (Les ... de Vinromà)",
    rewardTitle: "¡Palabra acertada!",
    message:
      "¡Les Coves de Vinromà! Qué casualidad tan bonita que nos conociéramos en Coves y que tu rincón favorito sea Cuevas de Cañart ❤️"
  },
  {
    day: 12,
    type: "scratch",
    fragmentLetter: "R",
    title: "Ecuador de diciembre: Rasca tu mimo de hoy ✨",
    subtitle: "Rasca para descubrir premio + fragmento",
    scratchHeadline: "💆‍♀️ Masaje relajante + Letra R",
    scratchPrize:
      "💆‍♀️ ¡Vale por un masaje relajante de 25 minutos sin prisas! + 3.er fragmento secreto: la letra R.",
    rewardTitle: "¡Fragmento R desbloqueado!",
    message:
      "Has llegado a la mitad del calendario, Nori. Disfruta de tu masaje cuando quieras y guarda la letra R en tu colección secreta."
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
    type: "quiz",
    title: "Coincidencias del destino ✨",
    subtitle: "Un guiño a nuestros pueblos",
    question:
      "¿Qué curioso detalle tienen en común el pueblo donde nos conocimos y tu pueblo favorito?",
    options: [
      "¡Los dos se llaman Cuevas / Coves!",
      "Los dos tienen aeropuerto internacional",
      "En los dos se habla italiano",
      "Los dos tienen playa tropical"
    ],
    correctIndex: 0,
    wrongHint: "Fíjate bien en los nombres: Les Coves de Vinromà y Cuevas de Cañart...",
    rewardTitle: "¡Destino puro!",
    message:
      "¡De Les Coves de Vinromà a Cuevas de Cañart! Estábamos destinados desde el nombre de nuestros pueblos."
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
    fragmentLetter: "I",
    title: "Wordle de cucharón y puchero 🥄",
    subtitle: "Acierta para conseguir el 4.º fragmento",
    word: "SOPAS",
    hint: "5 letras (en plural): el plato de cuchara que vuelve loca a Nori",
    rewardTitle: "¡Fragmento I desbloqueado!",
    message:
      "¡SOPAS! No podía faltar en tu calendario de adviento 😄 Y con esto consigues el 4.º fragmento secreto: la letra I."
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
    fragmentLetter: "T",
    title: "Cena romántica a la luz de las velas 🍷🕯️",
    subtitle: "Vale dorado + 5.º fragmento secreto",
    voucherTitle: "Vale por una cena romántica donde tú elijas (invita Vicent) 🍷🕯️",
    voucherCode: "NORI-CENA-20",
    rewardTitle: "¡Fragmento T desbloqueado!",
    message:
      "Ponte guapa que nos vamos a cenar a tu restaurante favorito. Además, ¡tienes el 5.º fragmento secreto: la letra T!",
    whatsappText:
      "¡Hola Vicent! Canjeo mi vale del Día 20 (NORI-CENA-20): ¡elijo restaurante para nuestra cena romántica! 🍷🕯️✨"
  },
  {
    day: 21,
    type: "quiz",
    title: "Llega el invierno ❄️",
    subtitle: "Pregunta oficial del 21 de diciembre",
    question: "¿Quién es la persona que más ganas tiene de pasar todas las Navidades contigo?",
    options: ["Vicent ❤️", "El Grinch", "Papá Noel", "El alcalde de Milán"],
    correctIndex: 0,
    wrongHint: "¡Pista fácil! Empieza por V y te quiere muchísimo...",
    rewardTitle: "¡Respuesta correcta!",
    message: "¡Obvio que yo! No cambiaría un invierno a tu lado por nada del mundo."
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
    fragmentLetter: "A",
    title: "¡La víspera de Nochebuena! Rasca para el último fragmento 🗝️",
    subtitle: "Consigue la última letra del código secreto",
    scratchHeadline: "🗝️ ¡Último fragmento: Letra A!",
    scratchPrize:
      "🎉 ¡Has conseguido el 6.º y último fragmento: la letra A! Mañana día 24 podrás usar el código completo (NORITA) para abrir tu gran sorpresa.",
    rewardTitle: "¡Código NORITA completo!",
    message:
      "Ya tienes todas las piezas del código secreto: N · O · R · I · T · A. ¡Mañana se abre la puerta más especial!"
  },
  {
    day: 24,
    type: "finale",
    title: "¡Feliz Nochebuena, Nori! El Cofre Secreto 🎁🎄",
    subtitle: "Introduce tu código secreto de 6 letras",
    rewardTitle: "El Gran Regalo de Nochebuena",
    message:
      "¡Has llegado al día 24! Introduce las 6 letras doradas que has reunido durante diciembre para abrir tu cofre."
  }
];
