import type { ConditionFaq, ConditionTreatmentItem } from "@/content/conditions/types";

/** Spanish content for the seven `/es/condiciones/*` pages.
 *
 * ── Why one shape instead of seven bespoke pages ────────────────────────
 * The English condition pages are hand-built per Figma frame, so each one
 * composes a slightly different set of sections. The Spanish pages are new,
 * which means they don't have to inherit that: they share one template
 * (components/sections/es-condition-page.tsx) driven by the objects below.
 * Optional sections simply render when the condition supplies them. One
 * template is far easier to keep faithful to seven English originals than
 * seven near-duplicate files would be.
 *
 * ── Claim discipline ────────────────────────────────────────────────────
 * Every English hedge is preserved, not softened: "may"/"can" →
 * "puede"/"podría", "after an evaluation" → "después de una evaluación",
 * "when appropriate" → "cuando corresponde". No outcome, timeframe,
 * recovery or coverage is promised anywhere, and no visit count is quoted —
 * every page says Dr. Abe reassesses instead.
 *
 * The concussion page keeps the English page's most important property: it
 * states up front that chiropractic care is not a substitute for emergency
 * or neurological assessment, and that medical evaluation comes first.
 * That framing is the whole point of the page and must never be softened
 * in translation.
 *
 * All seven routes are `status: "draft"` in content/es/seo.ts, mirroring
 * their English originals — noindex and out of the sitemap pending
 * clinician review, but reachable and linkable from the Spanish nav.
 */

export interface EsConditionListSection {
  heading: string;
  items: string[];
  /** Optional note under the list — used by the concussion page to repeat
   * the "seek medical evaluation" instruction next to the symptom list. */
  note?: string;
}

export interface EsConditionCard {
  title: string;
  desc: string;
}

export interface EsCondition {
  slug: string;
  /** Route path, for self-link exclusion in the related-links row. */
  path: string;
  hero: {
    eyebrowChip: string;
    h1: string;
    subhead: string;
    backgroundImage: { src: string; alt: string };
  };
  /** Breadcrumb label for this condition. */
  breadcrumb: string;
  understanding: {
    eyebrow: string;
    heading: string;
    /** Rendered as separate paragraphs. */
    paragraphs: string[];
    image: { src: string; alt: string };
  };
  /** Symptom or cause list. */
  list?: EsConditionListSection;
  /** "What it feels like" cards. */
  feelsLike?: { heading: string; items: EsConditionCard[] };
  /** Treatment/support cards. */
  howWeTreat?: { heading: string; items: ConditionTreatmentItem[] };
  /** Red-flag band. Every condition that can present with a neurological
   * or emergency sign carries one. */
  warning?: { heading: string; bullets: string[] };
  faq: ConditionFaq;
  relatedConfig: { paths: string[]; highlightPath?: string };
}

/** The four standard treatment cards, shared by the musculoskeletal
 * conditions exactly as the English pages share theirs — same images, same
 * order. `desc` is overridden per condition where the English differs. */
function treatmentCards(descriptions: [string, string, string, string]): ConditionTreatmentItem[] {
  const shared = [
    {
      title: "Liberación miofascial / puntos gatillo",
      image: {
        src: "/figma-exports/how-we-treat-1.png",
        alt: "Liberación miofascial y terapia de puntos gatillo con la herramienta Graston",
      },
      meta: "1 h",
    },
    {
      title: "Ajuste quiropráctico",
      image: {
        src: "/figma-exports/how-we-treat-2.png",
        alt: "El Dr. Abe realizando un ajuste quiropráctico",
      },
      meta: "1 h",
    },
    {
      title: "Tracción / descompresión",
      image: {
        src: "/figma-exports/how-we-treat-3.png",
        alt: "Terapia de tracción y descompresión espinal",
      },
      meta: "1 h",
    },
    {
      title: "Visita a domicilio",
      image: {
        src: "/figma-exports/how-we-treat-4.png",
        alt: "El Dr. Abe atendiendo a un paciente en su casa",
      },
      meta: "Consultar elegibilidad",
    },
  ];
  return shared.map((card, index) => ({
    ...card,
    desc: descriptions[index],
    ctaLabel: index === 3 ? "CONSULTAR ELEGIBILIDAD" : "SOLICITAR CITA",
    // The home-visit card points at the accident page rather than the
    // English /home-visit-chiropractor, which is draft and English-only.
    ctaHref: index === 3 ? "/es/quiropractico-accidentes-de-auto" : "/es/solicitar-cita",
  }));
}

const RED_FLAG_HEADING = "Consulte pronto a un médico si nota:";

export const esBackPain: EsCondition = {
  slug: "back-pain",
  path: "/es/condiciones/dolor-de-espalda",
  breadcrumb: "Dolor de espalda",
  hero: {
    eyebrowChip: "¿Dolor de espalda después de un accidente de auto?",
    h1: "Quiropráctico para Dolor de Espalda en Deerfield Beach, FL",
    subhead:
      "Evaluación quiropráctica para el dolor de espalda baja, la rigidez y el dolor que puede extenderse hacia la cadera o la pierna, incluidos los síntomas después de un accidente de auto.",
    backgroundImage: {
      src: "/figma-exports/drabe-backpain-front.png",
      alt: "Tratamiento manual de tejidos blandos en la espalda baja",
    },
  },
  understanding: {
    eyebrow: "Entender el dolor de espalda",
    heading:
      "El dolor de espalda tiene muchas causas posibles. Encontrar la suya es el primer paso",
    paragraphs: [
      "El dolor de espalda baja puede venir de un músculo, de un ligamento, de una articulación que dejó de moverse bien o de un disco. Cada uno de esos orígenes responde a un tratamiento distinto, y por eso la primera visita empieza con un examen y no con un tratamiento asumido.",
      "Considere una evaluación si el dolor lleva más de una o dos semanas, si le interrumpe el sueño o el movimiento diario, o si apareció después de un accidente de auto, una caída o un impacto repentino. En Florida, el seguro PIP generalmente exige que la atención inicial comience dentro de los 14 días posteriores a un accidente de vehículo.",
    ],
    image: {
      src: "/figma-exports/drabe-back.png",
      alt: "El Dr. Abe revisando el historial de dolor de espalda de un paciente",
    },
  },
  list: {
    heading: "Causas frecuentes",
    items: [
      "Distensión muscular o de ligamentos",
      "Hernia o abultamiento de disco",
      "Mala postura y estar sentado mucho tiempo",
      "Cambios articulares relacionados con el embarazo",
      "Deporte o esfuerzo repetitivo",
      "Accidentes de auto e impactos repentinos",
    ],
  },
  feelsLike: {
    heading: "Cómo se siente",
    items: [
      {
        title: "Rigidez sorda y constante",
        desc: "Una molestia continua de baja intensidad, peor después de estar sentado o de pie mucho rato.",
      },
      {
        title: "Punzada al moverse",
        desc: "Una flexión o giro concreto que provoca un tirón repentino y agudo — con frecuencia muscular.",
      },
      {
        title: "Dolor que no cede",
        desc: "Molestia que lleva semanas o meses, no solo un mal día.",
      },
      {
        title: "Dolor irradiado",
        desc: "Dolor que viaja hacia la cadera o la pierna en lugar de quedarse en la espalda baja.",
      },
    ],
  },
  howWeTreat: {
    heading: "Cómo lo tratamos",
    items: treatmentCards([
      "La distensión de la espalda baja suele presentarse como músculo tenso y con espasmo a lo largo de la columna. La herramienta Graston trabaja esa tensión directamente, deshaciendo adherencias de forma parecida a un masaje profundo.",
      "El dolor de espalda viene con frecuencia de fijaciones: segmentos de la columna, sobre todo en la zona lumbar, que perdieron su movimiento normal. El ajuste devuelve ese movimiento para que los músculos de alrededor dejen de compensar.",
      "Para el dolor de espalda relacionado con un disco o de larga evolución, la tracción estira la columna lumbar para aliviar la presión sobre discos y nervios.",
      "Cuando hasta subirse al auto duele, llevamos el examen y el tratamiento manual a su casa.",
    ]),
  },
  warning: {
    heading: RED_FLAG_HEADING,
    bullets: [
      "Entumecimiento o debilidad en la pierna",
      "Dolor que empeora de noche o que no mejora con el reposo",
      "Pérdida del control de la vejiga o del intestino — busque atención de emergencia",
    ],
  },
  faq: {
    headerTail: "el dolor de espalda",
    items: [
      {
        q: "¿Es seguro que me ajusten si tengo una hernia de disco?",
        a: "Depende de la lesión del disco, de los síntomas y de los hallazgos del examen. El Dr. Abe evalúa si corresponde un ajuste, la descompresión, otra opción conservadora o una referencia médica antes de tratar.",
      },
      {
        q: "¿Debo reposar o mantenerme activo con dolor de espalda?",
        a: "Algo de reposo ayuda al principio, pero demasiado puede retrasar la recuperación. Le damos un plan concreto de qué hacer y qué evitar según lo que realmente esté causando su dolor.",
      },
      {
        q: "¿Y si el dolor de espalda me baja por la pierna?",
        a: "El dolor que viaja hacia la pierna puede implicar un nervio irritado, incluida la ciática, pero hace falta un examen para valorar la causa. Busque atención urgente si hay debilidad progresiva o cambios en la vejiga o el intestino.",
      },
      {
        q: "¿Cuántas visitas suele tomar que mejore el dolor de espalda?",
        a: "La distensión mecánica suele mejorar en unas pocas visitas; el dolor relacionado con un disco puede tardar más. Reevaluamos sobre la marcha y ajustamos el plan.",
      },
    ],
  },
  relatedConfig: {
    paths: [
      "/es/condiciones/ciatica",
      "/es/condiciones/dolor-de-cuello",
      "/es/servicios/descompresion-espinal",
      "/es/condiciones",
      "/es/quiropractico-accidentes-de-auto",
      "/es/solicitar-cita",
    ],
    highlightPath: "/es/solicitar-cita",
  },
};

export const esNeckPain: EsCondition = {
  slug: "neck-pain",
  path: "/es/condiciones/dolor-de-cuello",
  breadcrumb: "Dolor de cuello",
  hero: {
    eyebrowChip: "¿Dolor de cuello después de un accidente de auto?",
    h1: "Quiropráctico para Dolor de Cuello en Deerfield Beach, FL",
    subhead:
      "Evaluación quiropráctica para el dolor de cuello, la rigidez y la movilidad limitada, incluido el dolor de cuello que empieza después de un accidente de auto o un latigazo cervical.",
    backgroundImage: {
      src: "/figma-exports/dr-abe-neck.png",
      alt: "El Dr. Abe Nasser evaluando el cuello de un paciente",
    },
  },
  understanding: {
    eyebrow: "Entender el dolor de cuello",
    heading: "El cuello sostiene mucho peso con muy poco margen",
    paragraphs: [
      "La columna cervical sostiene la cabeza con un rango de movimiento amplio y poco soporte estructural, y por eso acusa rápido la postura, el estrés y el impacto. Un impacto repentino puede distender los músculos y ligamentos que la sostienen, y los síntomas pueden aparecer después.",
      "En Florida, el seguro PIP generalmente exige que la atención inicial comience dentro de los 14 días posteriores a un accidente de vehículo. La elegibilidad y el reembolso dependen de su póliza y de las circunstancias.",
    ],
    image: {
      src: "/figma-exports/drabe-releasetool.png",
      alt: "Tratamiento de tejidos blandos en el cuello y el hombro",
    },
  },
  list: {
    heading: "Causas frecuentes",
    items: [
      "Accidentes de auto e impactos repentinos",
      "Latigazo cervical por una colisión por alcance",
      "Mala postura al dormir",
      "Tensión muscular relacionada con el estrés",
      "Cambios articulares degenerativos",
    ],
  },
  feelsLike: {
    heading: "Cómo se siente",
    items: [
      {
        title: "Rigidez matutina",
        desc: "Tenso y difícil de girar al levantarse, que va soltándose durante el día.",
      },
      {
        title: "Molestia de «cuello tecnológico»",
        desc: "Una tensión sorda y persistente en la base del cráneo tras horas de escritorio o teléfono.",
      },
      {
        title: "Tensión irradiada",
        desc: "Tirantez que se extiende a los hombros y la espalda alta, no solo al cuello.",
      },
      {
        title: "Dolor agudo o repentino",
        desc: "Un movimiento o ángulo concreto que provoca una punzada, con frecuencia señal de algo más estructural.",
      },
    ],
  },
  howWeTreat: {
    heading: "Cómo lo tratamos",
    items: treatmentCards([
      "La tensión por postura, estrés o posición al dormir tiende a acumularse como nudos en el cuello y los hombros. La herramienta Graston trabaja esa tensión de forma dirigida a los puntos concretos que la acumulan.",
      "La rigidez cotidiana viene con frecuencia de pequeñas fijaciones en las vértebras cervicales — segmentos que no se mueven como deberían. El ajuste devuelve ese movimiento.",
      "Para casos seleccionados de dolor de cuello que implican un disco o una articulación, la tracción controlada puede reducir la presión entre vértebras. La evaluación determina si corresponde.",
      "Cuando el dolor de cuello es tal que girar la cabeza para manejar resulta incómodo, llevamos el examen y el tratamiento a su casa.",
    ]),
  },
  warning: {
    heading: RED_FLAG_HEADING,
    bullets: [
      "Entumecimiento, hormigueo o debilidad en un brazo",
      "Dolor de cabeza intenso, mareo o confusión después de un choque",
      "Dolor que empeora rápidamente en lugar de mejorar",
    ],
  },
  faq: {
    headerTail: "el dolor de cuello",
    items: [
      {
        q: "¿Es normal que el dolor de cuello se extienda a los hombros?",
        a: "Sí. Los músculos y nervios del cuello conectan directamente con los hombros y la espalda alta, así que el dolor referido y la rigidez en esa zona son frecuentes tanto en el dolor agudo como en el crónico.",
      },
      {
        q: "¿Un quiropráctico puede ayudar con un nervio pinzado en el cuello?",
        a: "La atención quiropráctica puede ser apropiada para algunas causas musculoesqueléticas de irritación nerviosa. Primero hace falta un examen para determinar si el ajuste, el trabajo de tejidos blandos, la revisión de imágenes o una referencia es el siguiente paso más seguro.",
      },
      {
        q: "¿Cuánto puede tardar en mejorar el dolor de cuello?",
        a: "Depende de la causa, la severidad y cuánto tiempo lleva con síntomas. El Dr. Abe reevalúa su respuesta a la atención y ajusta el plan, en lugar de prometer un número fijo de visitas.",
      },
      {
        q: "¿Debo ir aunque el dolor de cuello haya empezado hace semanas?",
        a: "Sí. Una evaluación puede ayudar a identificar factores musculoesqueléticos y si la atención quiropráctica u otro tipo de atención corresponde, incluso cuando los síntomas empezaron hace semanas.",
      },
    ],
  },
  relatedConfig: {
    paths: [
      "/es/condiciones/latigazo-cervical",
      "/es/condiciones/dolor-de-espalda",
      "/es/servicios/descompresion-espinal",
      "/es/condiciones",
      "/es/quiropractico-accidentes-de-auto",
      "/es/solicitar-cita",
    ],
    highlightPath: "/es/solicitar-cita",
  },
};

export const esWhiplash: EsCondition = {
  slug: "whiplash",
  path: "/es/condiciones/latigazo-cervical",
  breadcrumb: "Latigazo cervical",
  hero: {
    eyebrowChip: "¿Latigazo cervical después de un accidente?",
    h1: "Quiropráctico para Latigazo Cervical en Deerfield Beach, FL",
    subhead:
      "El latigazo cervical es una lesión de cuello por un movimiento brusco de ida y vuelta, frecuente en colisiones por alcance. El Dr. Abe evalúa la rigidez, la movilidad limitada y los dolores de cabeza relacionados.",
    backgroundImage: {
      src: "/figma-exports/drabe-whiplash-man.png",
      alt: "El Dr. Abe tratando a un paciente por latigazo cervical",
    },
  },
  understanding: {
    eyebrow: "Entender el latigazo cervical",
    heading: "Sentirse bien en el lugar del choque no significa que no haya lesión",
    paragraphs: [
      "El latigazo cervical ocurre cuando la cabeza se desplaza rápidamente hacia atrás y hacia adelante, distendiendo los músculos y ligamentos del cuello más allá de su rango normal. Los síntomas pueden acumularse en las horas o días posteriores a la colisión, no en el momento.",
      "En Florida, el seguro PIP generalmente exige que la atención inicial comience dentro de los 14 días posteriores a un accidente de vehículo; la cobertura depende de la elegibilidad y de los términos de la póliza.",
    ],
    image: {
      src: "/figma-exports/drabe-whiplash.png",
      alt: "Evaluación del cuello de un paciente por latigazo cervical",
    },
  },
  list: {
    heading: "Síntomas frecuentes",
    items: [
      "Dolor y rigidez de cuello que empeoran al día siguiente del accidente",
      "Dolores de cabeza que empiezan en la base del cráneo",
      "Menor rango de movimiento — dificultad para girar la cabeza",
      "Dolor de hombro y de espalda alta",
      "Hormigueo o entumecimiento en los brazos",
    ],
  },
  feelsLike: {
    heading: "Cómo se siente",
    items: [
      {
        title: "Aparición tardía",
        desc: "Sentirse bien en el lugar del choque y despertar sin poder girar el cuello.",
      },
      {
        title: "Rigidez de cuello",
        desc: "Suele ser el primer síntoma: tenso, restringido, incómodo al girar.",
      },
      {
        title: "Dolores de cabeza",
        desc: "Empiezan con frecuencia en la base del cráneo, a veces días después del impacto.",
      },
      {
        title: "Movilidad reducida",
        desc: "Dificultad para girar la cabeza por completo hacia uno o ambos lados.",
      },
    ],
  },
  howWeTreat: {
    heading: "Cómo lo tratamos",
    items: treatmentCards([
      "Usamos la herramienta Graston para trabajar el tejido cicatricial y el espasmo muscular del cuello y la espalda alta que se acumulan tras una colisión, ayudando a recuperar el movimiento normal del tejido blando.",
      "Después de un latigazo cervical, algunas articulaciones del cuello pueden tener el movimiento restringido. Si la evaluación lo respalda, puede incluirse un ajuste controlado.",
      "Cuando los hallazgos sugieren una afectación de disco cervical, puede considerarse tracción controlada para reducir la presión. Se usa solo cuando la evaluación lo respalda.",
      "Girar la cabeza para revisar los espejos suele ser lo más difícil al principio. Vamos a su casa en esos primeros días, cuando manejar todavía no es realista.",
    ]),
  },
  warning: {
    heading: RED_FLAG_HEADING,
    bullets: [
      "Entumecimiento, hormigueo o debilidad en brazos o manos",
      "Dolor de cabeza intenso, mareo, vómito o confusión",
      "Dolor que empeora rápidamente en lugar de mejorar",
    ],
  },
  faq: {
    headerTail: "el latigazo cervical",
    items: [
      {
        q: "¿Cuánto tarda en sanar un latigazo cervical?",
        a: "Los casos leves suelen mejorar en unas semanas de atención constante; las lesiones más significativas pueden tardar algunos meses. Reevaluamos con regularidad y ajustamos su plan conforme avanza.",
      },
      {
        q: "¿Qué significa el «grado» de un latigazo cervical?",
        a: "El grado describe la severidad, desde síntomas de cuello sin signos físicos hasta fractura o luxación. Un profesional calificado debe valorar la lesión en lugar de basarse solo en los síntomas.",
      },
      {
        q: "¿El latigazo cervical puede causar dolores de cabeza semanas después?",
        a: "Sí. Los dolores de cabeza cervicogénicos, que tienen su origen en el cuello, son uno de los síntomas tardíos más frecuentes del latigazo cervical, y a veces aparecen bastante después de que cede la rigidez inicial.",
      },
      {
        q: "¿Cómo funciona la cobertura PIP para mi visita?",
        a: "En Florida, el PIP generalmente exige que la atención inicial comience dentro de los 14 días posteriores a un accidente de vehículo. Los límites de beneficios y el pago dependen de su elegibilidad, su póliza, la necesidad médica y los detalles del reclamo.",
      },
    ],
  },
  relatedConfig: {
    paths: [
      "/es/condiciones/dolor-de-cuello",
      "/es/condiciones/dolor-de-cabeza-cervicogenico",
      "/es/servicios/terapia-de-tejidos-blandos",
      "/es/condiciones",
      "/es/quiropractico-accidentes-de-auto",
      "/es/solicitar-cita",
    ],
    highlightPath: "/es/solicitar-cita",
  },
};

export const esSciatica: EsCondition = {
  slug: "sciatica",
  path: "/es/condiciones/ciatica",
  breadcrumb: "Ciática",
  hero: {
    eyebrowChip: "¿Ciática o dolor nervioso que baja por la pierna?",
    h1: "Quiropráctico para Ciática en Deerfield Beach, FL",
    subhead:
      "Evaluación y tratamiento enfocado en la descompresión para el dolor ciático y el dolor nervioso irradiado, con visitas a domicilio cuando corresponde a su caso.",
    backgroundImage: {
      src: "/figma-exports/drabe-backpain-front.png",
      alt: "El Dr. Abe evaluando a un paciente por ciática",
    },
  },
  understanding: {
    eyebrow: "Entender la ciática",
    heading: "La ciática no se queda en la espalda: viaja",
    paragraphs: [
      "El dolor de espalda baja común se queda en la espalda baja. La ciática se irradia: baja por el glúteo y la pierna porque la raíz nerviosa misma está comprimida o irritada, no solo el músculo o la articulación de alrededor.",
      "Una colisión puede agravar la espalda baja y contribuir a síntomas irradiados en la pierna. En Florida, el seguro PIP generalmente exige que la atención inicial comience dentro de los 14 días posteriores a un accidente de vehículo.",
    ],
    image: {
      src: "/figma-exports/drabe-back.png",
      alt: "El Dr. Abe evaluando la espalda baja de un paciente",
    },
  },
  list: {
    heading: "Síntomas frecuentes",
    items: [
      "Dolor agudo, ardiente o parecido a una descarga eléctrica",
      "Dolor que empeora al sentarse o al toser",
      "Entumecimiento y hormigueo en la pierna o el pie",
      "Debilidad muscular en la pierna afectada",
      "Dolor localizado en la zona del glúteo",
    ],
  },
  feelsLike: {
    heading: "Cómo se siente",
    items: [
      {
        title: "Dolor irradiado a la pierna",
        desc: "Dolor que viaja desde la espalda baja, pasa por el glúteo y baja por la pierna.",
      },
      {
        title: "Punzante o ardiente",
        desc: "Una sensación aguda, como eléctrica, que recorre el trayecto del nervio ciático.",
      },
      {
        title: "Entumecimiento u hormigueo",
        desc: "Sensación de agujas o pérdida de sensibilidad concretamente en la pierna o el pie.",
      },
      {
        title: "Debilidad muscular",
        desc: "Dificultad para mover el pie o la pierna, que se sienten «pesados» o poco responsivos.",
      },
    ],
  },
  howWeTreat: {
    heading: "Cómo lo tratamos",
    items: treatmentCards([
      "El piriforme y los músculos de alrededor suelen tensarse en torno al nervio ciático y sumar dolor. La herramienta Graston libera esa tensión directamente en la zona que comprime el nervio.",
      "Cuando los hallazgos sugieren que el movimiento articular restringido de la zona lumbar contribuye a los síntomas, el Dr. Abe puede incluir un ajuste controlado en el plan.",
      "Cuando un disco o un estrechamiento alrededor del nervio pueden contribuir a los síntomas, la tracción controlada puede considerarse después de valorar si es adecuada.",
      "La ciática puede hacer insoportable sentarse en el auto. Llevamos el examen completo y el tratamiento a su casa cuando llegar al consultorio no es realista.",
    ]),
  },
  warning: {
    heading: RED_FLAG_HEADING,
    bullets: [
      "Debilidad progresiva en la pierna o el pie",
      "Entumecimiento en la zona de la ingle o la parte interna de los muslos",
      "Pérdida del control de la vejiga o del intestino — busque atención de emergencia",
    ],
  },
  faq: {
    headerTail: "la ciática",
    items: [
      {
        q: "¿Un accidente de auto puede causar ciática?",
        a: "Un accidente de auto puede agravar la espalda baja y contribuir a síntomas del nervio ciático, pero hace falta un examen para identificar las causas probables. Mencione la colisión y cuándo aparecieron los síntomas durante su evaluación.",
      },
      {
        q: "¿En qué se diferencia la ciática del dolor de espalda común?",
        a: "El dolor de espalda común se queda en la espalda baja. La ciática se irradia: baja por el glúteo y la pierna porque hay una raíz nerviosa comprimida, no solo el músculo o la articulación de alrededor.",
      },
      {
        q: "¿Voy a necesitar cirugía por una hernia de disco?",
        a: "No necesariamente. Muchas personas empiezan con atención conservadora dirigida por un profesional, pero la debilidad progresiva, los síntomas severos o ciertos hallazgos del examen pueden requerir una valoración médica o quirúrgica pronta.",
      },
      {
        q: "¿Cuánto suele tardar en mejorar la ciática?",
        a: "Depende de la causa y de la severidad. Un episodio muscular puede evolucionar distinto a unos síntomas que involucran un disco o un nervio, así que el Dr. Abe reevalúa el progreso y ajusta el plan según haga falta.",
      },
    ],
  },
  relatedConfig: {
    paths: [
      "/es/condiciones/dolor-de-espalda",
      "/es/servicios/descompresion-espinal",
      "/es/condiciones",
      "/es/quiropractico-accidentes-de-auto",
      "/es/solicitar-cita",
    ],
    highlightPath: "/es/solicitar-cita",
  },
};

export const esCervicogenicHeadache: EsCondition = {
  slug: "cervicogenic-headache",
  path: "/es/condiciones/dolor-de-cabeza-cervicogenico",
  breadcrumb: "Dolor de cabeza cervicogénico",
  hero: {
    eyebrowChip: "¿Dolores de cabeza que empezaron después de un accidente de auto?",
    h1: "Quiropráctico para Dolor de Cabeza Cervicogénico en Deerfield Beach, FL",
    subhead:
      "El dolor de cabeza cervicogénico es dolor referido desde el cuello. El Dr. Abe evalúa la movilidad cervical y otros factores musculoesqueléticos antes de recomendar atención.",
    backgroundImage: {
      src: "/figma-exports/drabe-headache.png",
      alt: "El Dr. Abe evaluando a un paciente por tensión de cuello relacionada con dolor de cabeza",
    },
  },
  understanding: {
    eyebrow: "Entender el dolor de cabeza cervicogénico",
    heading: "Un dolor de cabeza que en realidad empieza en el cuello",
    paragraphs: [
      "El dolor de cabeza cervicogénico no se origina en la cabeza: es dolor referido desde las articulaciones, los músculos o los nervios del cuello. Por eso puede persistir aunque el medicamento alivie el dolor, y por eso la evaluación se centra en el movimiento cervical.",
      "Varios tipos de dolor de cabeza pueden solaparse, así que un profesional debe valorar los síntomas. Un dolor de cabeza nuevo, intenso o que empeora después de una colisión necesita valoración médica pronta.",
    ],
    image: {
      src: "/figma-exports/align-thespne-neck.png",
      alt: "Evaluación del cuello relacionada con el dolor de cabeza",
    },
  },
  feelsLike: {
    heading: "Cómo se siente",
    items: [
      {
        title: "Molestia en la base del cráneo",
        desc: "Empieza en la parte posterior de la cabeza y se irradia hacia adelante.",
      },
      {
        title: "Presión de un solo lado",
        desc: "Se mantiene en un lado, a diferencia de un dolor de cabeza tensional típico.",
      },
      {
        title: "Peor con el movimiento",
        desc: "Girar o inclinar la cabeza lo desencadena o lo intensifica.",
      },
      {
        title: "Puede persistir con medicamento",
        desc: "El medicamento puede aliviar el dolor sin atender el factor cervical que lo contribuye.",
      },
    ],
  },
  warning: {
    heading: RED_FLAG_HEADING,
    bullets: [
      "Un dolor de cabeza nuevo, intenso o que empeora rápidamente",
      "Confusión, vómito o pérdida del conocimiento después de un choque",
      "Entumecimiento, hormigueo o debilidad en brazos o piernas",
    ],
  },
  faq: {
    headerTail: "los dolores de cabeza cervicogénicos",
    items: [
      {
        q: "¿Un accidente de auto puede causar dolores de cabeza que aparecen semanas después?",
        a: "Los dolores de cabeza pueden empezar después de un accidente o hacerse notorios más tarde, pero el momento en que aparecen no identifica la causa por sí solo. Un dolor de cabeza nuevo, intenso o que empeora después de una colisión necesita valoración médica pronta.",
      },
      {
        q: "¿Cómo sé si mi dolor de cabeza viene del cuello?",
        a: "Los dolores de cabeza cervicogénicos pueden ser de un solo lado y empeorar con el movimiento del cuello o con un rango de movimiento limitado. Un profesional debe evaluar los síntomas porque varios tipos de dolor de cabeza pueden solaparse.",
      },
      {
        q: "¿El medicamento para el dolor ayuda?",
        a: "El medicamento puede reducir el dolor en algunas personas, pero no determina si el cuello está contribuyendo. Consulte las dudas sobre medicamentos con quien se los receta, y busque una evaluación si los síntomas persisten.",
      },
      {
        q: "¿Cuántas visitas voy a necesitar?",
        a: "Depende de la causa, de los hallazgos del examen y de la respuesta a la atención. El Dr. Abe reevalúa el progreso en lugar de prometer un número fijo de visitas.",
      },
    ],
  },
  relatedConfig: {
    paths: [
      "/es/condiciones/latigazo-cervical",
      "/es/condiciones/dolor-de-cuello",
      "/es/condiciones",
      "/es/quiropractico-accidentes-de-auto",
      "/es/solicitar-cita",
    ],
    highlightPath: "/es/solicitar-cita",
  },
};

export const esTmjJawPain: EsCondition = {
  slug: "tmj-jaw-pain",
  path: "/es/condiciones/dolor-de-mandibula-atm",
  breadcrumb: "ATM / dolor de mandíbula",
  hero: {
    eyebrowChip: "¿Dolor, tensión o chasquido en la mandíbula?",
    h1: "Quiropráctico para ATM y Dolor de Mandíbula en Deerfield Beach, FL",
    subhead:
      "El Dr. Abe evalúa el movimiento de la articulación de la mandíbula, la tensión muscular de alrededor y los factores cervicales antes de decidir si la atención quiropráctica puede ser apropiada.",
    backgroundImage: {
      src: "/figma-exports/drabe-headache.png",
      alt: "El Dr. Abe evaluando la mandíbula de un paciente",
    },
  },
  understanding: {
    eyebrow: "Entender el trauma de la ATM",
    heading: "La misma fuerza que causa el latigazo cervical llega a la mandíbula",
    paragraphs: [
      "La articulación temporomandibular está a centímetros de la columna cervical, y el impacto que provoca un latigazo cervical puede tensar también la mandíbula — sobre todo cuando se aprieta durante la colisión. Por eso el dolor de mandíbula y el dolor de cuello aparecen juntos con frecuencia después de un accidente.",
      "Los síntomas de la mandíbula pueden tener varias causas, así que hace falta una evaluación. El Dr. Abe revisa el movimiento articular, la musculatura de alrededor y la relación con el cuello antes de decidir si corresponde tratar o referir.",
    ],
    image: {
      src: "/figma-exports/dr-abe-neck.png",
      alt: "El Dr. Abe evaluando el cuello y la mandíbula de un paciente",
    },
  },
  feelsLike: {
    heading: "Cómo se siente",
    items: [
      {
        title: "Chasquido al abrir",
        desc: "Un clic o un salto al abrir la boca o al masticar.",
      },
      {
        title: "Tensión en la mandíbula",
        desc: "Dolor o rigidez en la articulación, a veces al despertar.",
      },
      {
        title: "Dificultad para masticar",
        desc: "Molestia que aparece al comer o al abrir del todo la boca.",
      },
      {
        title: "Dolor de cabeza desde la mandíbula",
        desc: "Dolor que se rastrea hasta la articulación de la mandíbula y no hasta el cuello.",
      },
    ],
  },
  warning: {
    heading: RED_FLAG_HEADING,
    bullets: [
      "Mandíbula bloqueada, que no abre o no cierra",
      "Hinchazón o dolor intenso en la articulación después de un golpe",
      "Entumecimiento en la cara después de una colisión",
    ],
  },
  faq: {
    headerTail: "la ATM y el dolor de mandíbula",
    items: [
      {
        q: "¿De verdad un accidente de auto puede causar problemas de ATM?",
        a: "Una colisión puede distender la articulación de la mandíbula o los músculos de alrededor, sobre todo cuando se aprieta la mandíbula durante el impacto. Hace falta una evaluación porque los síntomas de mandíbula pueden tener varias causas.",
      },
      {
        q: "¿Cómo se siente la disfunción de la ATM?",
        a: "Los signos frecuentes incluyen chasquido al abrir la boca, dolor o tensión en la mandíbula, dificultad para masticar y dolores de cabeza que se rastrean hasta la articulación de la mandíbula y no hasta el cuello.",
      },
      {
        q: "¿Cómo se trata la disfunción de la ATM?",
        a: "El tratamiento depende de lo que encuentre la evaluación: puede incluir movilización suave de la articulación, trabajo de tejidos blandos en la musculatura de alrededor y orientación sobre hábitos, como apretar la mandíbula, que la siguen agravando.",
      },
      {
        q: "¿Cuántas visitas voy a necesitar?",
        a: "Varía según la causa, los hallazgos del examen y factores en curso como apretar o rechinar los dientes. El Dr. Abe reevalúa el progreso en lugar de prometer un número fijo de visitas.",
      },
    ],
  },
  relatedConfig: {
    paths: [
      "/es/condiciones/dolor-de-cuello",
      "/es/condiciones/dolor-de-cabeza-cervicogenico",
      "/es/condiciones",
      "/es/quiropractico-accidentes-de-auto",
      "/es/solicitar-cita",
    ],
    highlightPath: "/es/solicitar-cita",
  },
};

export const esConcussion: EsCondition = {
  slug: "concussion",
  path: "/es/condiciones/conmocion-cerebral",
  breadcrumb: "Conmoción cerebral",
  hero: {
    eyebrowChip: "¿Se golpeó la cabeza o se sintió aturdido tras un accidente?",
    h1: "Síntomas de Conmoción Cerebral Después de un Accidente de Auto",
    subhead:
      "Una conmoción cerebral es una lesión cerebral traumática leve que necesita valoración médica. La atención quiropráctica no sustituye una evaluación de emergencia ni neurológica.",
    backgroundImage: {
      src: "/figma-exports/drabe-headache.png",
      alt: "El Dr. Abe evaluando a un paciente después de un accidente de auto",
    },
  },
  understanding: {
    eyebrow: "Entender la conmoción cerebral",
    heading: "Primero la valoración médica — siempre",
    paragraphs: [
      "Una conmoción cerebral puede ocurrir sin pérdida del conocimiento y sin un golpe directo en la cabeza: basta con que la fuerza de la colisión mueva el cerebro dentro del cráneo. Cualquier persona con posibles síntomas después de un choque debe recibir una valoración médica adecuada.",
      "Esta página es información general. Align the Spine no diagnostica ni trata la lesión cerebral en sí. Después de una valoración médica, el Dr. Abe puede evaluar por separado síntomas de cuello o musculoesqueléticos y determinar si corresponde atención o una referencia.",
    ],
    image: {
      src: "/figma-exports/drabe-headache.png",
      alt: "Evaluación de un paciente después de un accidente de auto",
    },
  },
  list: {
    heading: "Síntomas clásicos",
    items: [
      "Dolor de cabeza o presión en la cabeza",
      "Mareo o problemas de equilibrio",
      "Sensibilidad a la luz o al ruido",
      "Fatiga o alteraciones del sueño",
      "Irritabilidad o cambios de ánimo",
    ],
    note: "Busque una valoración médica pronta ante posibles síntomas de conmoción cerebral después de un accidente, y atención de emergencia si los síntomas son graves o empeoran.",
  },
  howWeTreat: {
    heading: "Cómo funciona nuestro papel",
    items: [
      {
        title: "Primero la valoración médica",
        desc: "Los posibles síntomas de conmoción cerebral requieren la valoración de un profesional médico adecuado. Las señales de alarma no deben esperar a una visita quiropráctica.",
        image: {
          src: "/figma-exports/how-we-treat-1.png",
          alt: "Valoración médica después de un accidente",
        },
        meta: "La seguridad primero",
        ctaLabel: "LLAMAR AL CONSULTORIO",
        ctaHref: "/es/contacto",
      },
      {
        title: "Revisión de cuello y latigazo cervical",
        desc: "Después del alta médica, el Dr. Abe puede evaluar si existen además dolor de cuello, rigidez o problemas musculoesqueléticos relacionados con un latigazo cervical.",
        image: {
          src: "/figma-exports/how-we-treat-2.png",
          alt: "Evaluación del cuello después del alta médica",
        },
        meta: "Después del alta",
        ctaLabel: "VER LATIGAZO CERVICAL",
        ctaHref: "/es/condiciones/latigazo-cervical",
      },
      {
        title: "Atención solo cuando corresponde",
        desc: "Cualquier atención quiropráctica se limita a hallazgos musculoesqueléticos adecuados y se coordina con la orientación médica cuando hay síntomas de conmoción cerebral de por medio.",
        image: {
          src: "/figma-exports/how-we-treat-3.png",
          alt: "Atención quiropráctica coordinada con orientación médica",
        },
        meta: "Caso por caso",
        ctaLabel: "SOLICITAR CITA",
        ctaHref: "/es/solicitar-cita",
      },
      {
        title: "Reevaluación continua",
        desc: "Los síntomas neurológicos nuevos, el dolor de cabeza que empeora, el vómito repetido, la confusión, la debilidad o la pérdida del conocimiento requieren atención médica urgente.",
        image: {
          src: "/figma-exports/how-we-treat-4.png",
          alt: "Seguimiento de síntomas después de una conmoción cerebral",
        },
        meta: "Conozca las señales de alarma",
        ctaLabel: "VER SEÑALES DE ALARMA",
        ctaHref: "/es/quiropractico-accidentes-de-auto",
      },
    ],
  },
  warning: {
    heading: "Busque atención de emergencia de inmediato si aparece:",
    bullets: [
      "Pérdida del conocimiento, aunque haya sido breve",
      "Dolor de cabeza que empeora, vómito repetido o convulsiones",
      "Confusión, dificultad para hablar, debilidad o entumecimiento",
    ],
  },
  faq: {
    headerTail: "la conmoción cerebral y la atención posterior",
    items: [
      {
        q: "¿Se puede tener una conmoción cerebral sin perder el conocimiento ni golpearse la cabeza?",
        a: "Sí. Una conmoción cerebral puede ocurrir sin pérdida del conocimiento y sin un golpe directo en la cabeza. Cualquier persona con posibles síntomas después de una colisión debe recibir una valoración médica adecuada.",
      },
      {
        q: "¿Cuánto suelen durar los síntomas de una conmoción cerebral?",
        a: "El tiempo de recuperación varía. El dolor de cabeza persistente, el mareo, los problemas de concentración u otros síntomas deben ser revisados por un profesional médico adecuado, en lugar de juzgarse por un plazo fijo.",
      },
      {
        q: "¿Es segura la atención quiropráctica después de una conmoción cerebral?",
        a: "La atención quiropráctica no diagnostica ni trata la lesión cerebral en sí. Después de una valoración médica adecuada, el Dr. Abe puede valorar síntomas de cuello o musculoesqueléticos por separado y determinar si corresponde atención o una referencia.",
      },
      {
        q: "¿Por qué la conmoción cerebral y el latigazo cervical se pasan por alto tan a menudo juntos?",
        a: "Ambas condiciones pueden compartir síntomas después de una colisión, incluidos el dolor de cabeza y el mareo. La valoración médica atiende la posible lesión cerebral, mientras que un examen musculoesquelético aparte puede valorar el dolor de cuello o el latigazo cervical tras el alta.",
      },
    ],
  },
  relatedConfig: {
    paths: [
      "/es/condiciones/latigazo-cervical",
      "/es/condiciones/dolor-de-cuello",
      "/es/condiciones",
      "/es/quiropractico-accidentes-de-auto",
      "/es/solicitar-cita",
    ],
    highlightPath: "/es/solicitar-cita",
  },
};

/** Every Spanish condition, in the order the nav dropdown and the
 * /es/condiciones hub render them — the same order as the English nav. */
export const esConditions: EsCondition[] = [
  esBackPain,
  esNeckPain,
  esWhiplash,
  esSciatica,
  esConcussion,
  esCervicogenicHeadache,
  esTmjJawPain,
];

/** Shared section copy for the Spanish condition template. */
export const esConditionPageCopy = {
  readyHeading: "Cuando usted esté listo",
  readyBody:
    "Solicite una evaluación en el consultorio, o pregunte si una visita a domicilio corresponde a su caso y su ubicación.",
  readyCta: "Solicitar mi evaluación",
  relatedHeading: "Condiciones y tratamientos relacionados",
  accidentEyebrow: "¿Fue por un accidente?",
  callEyebrow: "Hablemos hoy",
};
