import type { AdjustmentsStep } from "@/content/adjustments-page";
import type { ConditionFaq } from "@/content/conditions/types";
import type { MassageCondition, MassageTechnique } from "@/content/massage-soft-tissue-page";
import type {
  DecompressionCondition,
  DecompressionStep,
} from "@/content/spinal-decompression-page";

/** Spanish content for the four `/es/servicios/*` pages.
 *
 * Structure mirrors the English modules exactly (same fields, same images,
 * same ordering) so the Spanish pages compose from the same section
 * components. What differs is the prose, which is written as Spanish rather
 * than transliterated — Spanish clinical writing prefers the impersonal
 * ("se aplica…", "puede ser apropiado") where English uses "we apply" /
 * "Dr. Abe applies", and the copy follows that where it reads better.
 *
 * ── Claim discipline ────────────────────────────────────────────────────
 * These pages carry clinical guidance, which is exactly why their English
 * originals are still `status: "draft"` (noindex, out of the sitemap)
 * pending a clinician's sign-off. The Spanish pages are registered `draft`
 * too — `content/i18n.test.ts` enforces that a Spanish page can't be
 * published while its English original isn't. Nothing here adds, broadens,
 * or softens a clinical claim relative to the English: every hedge
 * ("cuando corresponde", "después de una evaluación", "puede") maps to an
 * English "when appropriate" / "after an evaluation" / "may", and no
 * outcome, timeframe, or coverage is promised.
 */

// ──────────────────────────────────── /es/servicios/ajustes-quiropracticos

export const esAdjustmentsHero = {
  eyebrowChip: "¿Rigidez articular o movimiento limitado?",
  h1: "Ajustes Quiroprácticos en Deerfield Beach, FL",
  subhead:
    "Los ajustes quiroprácticos manuales aplican presión controlada para mejorar el movimiento de una articulación. El Dr. Abe evalúa sus síntomas y su seguridad antes de tratar.",
  backgroundImage: {
    src: "/figma-exports/adjustments-hero.png",
    alt: "Sala de tratamiento preparada para un ajuste quiropráctico",
  },
};

export const esAdjustmentsHowItWorks: AdjustmentsStep[] = [
  {
    title: "Evaluación completa",
    description:
      "Identificamos qué segmentos perdieron movilidad en la colisión y descartamos primero cualquier hallazgo que requiera estudios de imagen o una referencia médica.",
    learnMoreHref: "/es/quiropractico-accidentes-de-auto",
  },
  {
    title: "Ajuste manual",
    description:
      "El Dr. Abe aplica presión precisa y controlada sobre la articulación que corresponda, según los hallazgos de su examen y su comodidad.",
    learnMoreHref: "/es/servicios",
  },
  {
    title: "Plan y reevaluación",
    description:
      "La frecuencia de las visitas depende de sus síntomas y de su respuesta a la atención. Los hallazgos relacionados con el accidente quedan documentados cuando corresponde a su reclamo.",
    learnMoreHref: "/es/quiropractico-accidentes-de-auto",
  },
];

export const esAdjustmentsFaq: ConditionFaq = {
  headerTail: "los ajustes quiroprácticos",
  items: [
    {
      q: "¿Duele un ajuste?",
      a: "La mayoría de los pacientes siente presión o una liberación, no dolor. Es común algo de sensibilidad después, parecida a la de empezar un estiramiento o ejercicio nuevo. Ajustamos el enfoque si algo no se siente bien durante su visita.",
    },
    {
      q: "¿Es seguro un ajuste después de un accidente de auto?",
      a: "Puede ser apropiado una vez que una evaluación descarta hallazgos que requieran estudios de imagen, atención urgente o una referencia. La primera visita empieza con un examen, no dando por hecho que el ajuste corresponde.",
    },
    {
      q: "¿En qué se diferencia un ajuste de un masaje?",
      a: "El masaje trabaja el tejido blando alrededor de la articulación; el ajuste actúa sobre la articulación misma, devolviendo movimiento a un segmento que dejó de moverse bien (una fijación), que muchas veces es el verdadero origen del dolor.",
    },
    {
      q: "¿Cuántos ajustes voy a necesitar?",
      a: "Depende de la condición, de los hallazgos del examen y de su respuesta a la atención. El Dr. Abe reevalúa el progreso en lugar de prometer de antemano un número fijo de visitas o un paquete.",
    },
  ],
};

// ───────────────────────────────────── /es/servicios/descompresion-espinal

export const esDecompressionHero = {
  eyebrowChip: "¿Dolor de disco o dolor nervioso irradiado?",
  h1: "Descompresión Espinal en Deerfield Beach, FL",
  subhead:
    "La descompresión espinal no quirúrgica utiliza tracción controlada para reducir la presión sobre las articulaciones y los discos de la columna. Una evaluación determina si corresponde a su caso.",
  backgroundImage: {
    src: "/figma-exports/spinal-decompression-hero.png",
    alt: "Sala de tratamiento preparada para terapia de descompresión espinal",
  },
};

export const esDecompressionHowItWorks: DecompressionStep[] = [
  {
    title: "Evaluación completa y revisión de imágenes",
    description:
      "Confirmamos si la colisión causó o agravó una lesión de disco, y revisamos los estudios de imagen que usted ya tenga.",
    learnMoreHref: "/es/quiropractico-accidentes-de-auto",
  },
  {
    title: "Sesiones de tracción controlada",
    description:
      "Se aplica una tracción específica sobre la columna, aliviando de forma gradual la presión que el choque dejó sobre el disco y el nervio.",
    learnMoreHref: "/es/servicios/descompresion-espinal",
  },
  {
    title: "Plan y reevaluación",
    description:
      "La frecuencia de las sesiones depende de sus hallazgos y de su respuesta. La atención relacionada con el accidente se documenta para su reclamo cuando corresponde.",
    learnMoreHref: "/es/quiropractico-accidentes-de-auto",
  },
];

export const esDecompressionConditions: DecompressionCondition[] = [
  {
    name: "Ciática",
    description:
      "Dolor irradiado hacia la pierna que puede implicar irritación o compresión de un nervio de la espalda baja.",
    image: {
      src: "/figma-exports/decompression-sciatica.png",
      alt: "Quiropráctico tratando la espalda baja de un paciente por ciática",
    },
  },
  {
    name: "Lesión de disco por latigazo cervical",
    description: "Cuando la colisión afecta al disco mismo, no solo al tejido blando que lo rodea.",
    image: {
      src: "https://align-the-spine.b-cdn.net/images/drabe-whiplash.png",
      alt: "Mano evaluando el cuello de un paciente por una lesión de disco tras latigazo cervical",
    },
  },
  {
    name: "Hernia de disco (espalda)",
    description:
      "Una condición de disco en la espalda baja que puede irritar nervios cercanos y afectar el movimiento.",
    image: {
      src: "https://align-the-spine.b-cdn.net/images/drabe-herniated%20disc.png",
      alt: "Manos tratando la espalda baja de un paciente por una hernia de disco",
    },
  },
  {
    name: "Hernia de disco (cuello)",
    description:
      "Cuando la fuerza del choque afecta un disco del cuello, no solo el músculo que lo rodea.",
    image: {
      src: "https://align-the-spine.b-cdn.net/images/drabe-head.png",
      alt: "Manos tratando el cuello de un paciente por una hernia de disco",
    },
  },
];

export const esDecompressionFaq: ConditionFaq = {
  headerTail: "la descompresión espinal",
  items: [
    {
      q: "¿Un accidente de auto puede causar una hernia de disco?",
      a: "Una colisión puede lesionar o agravar un disco de la columna, pero los síntomas por sí solos no confirman una hernia. Una evaluación y la revisión de los estudios de imagen que correspondan ayudan a determinar el origen más probable.",
    },
    {
      q: "¿La descompresión espinal duele?",
      a: "La descompresión espinal usa tracción controlada y se ajusta a su comodidad. Avísele al Dr. Abe si siente dolor o síntomas inusuales durante o después de una sesión para poder reevaluar el plan.",
    },
    {
      q: "¿En qué se diferencia de un ajuste quiropráctico?",
      a: "El ajuste devuelve movimiento a una articulación con un impulso rápido y controlado. La descompresión, en cambio, aplica una tracción lenta y sostenida para generar presión negativa dentro del disco. Con frecuencia se usan juntas, según lo que encuentre la evaluación.",
    },
    {
      q: "¿Cuántas sesiones voy a necesitar después de un accidente?",
      a: "El número de sesiones depende de los hallazgos del examen y de la respuesta a la atención. El Dr. Abe reevalúa el progreso y documenta el tratamiento relacionado con el accidente cuando corresponde.",
    },
  ],
};

// ────────────────────────────── /es/servicios/terapia-de-tejidos-blandos

export const esMassageHero = {
  eyebrowChip: "¿Tensión muscular o dolor en tejidos blandos?",
  h1: "Masaje y Terapia de Tejidos Blandos en Deerfield Beach, FL",
  subhead:
    "Atención dirigida de tejidos blandos para la tensión muscular, la movilidad restringida y el dolor posterior a una lesión, seleccionada después de una evaluación quiropráctica del Dr. Abe.",
  backgroundImage: {
    src: "/figma-exports/massage-soft-tissue-hero.png",
    alt: "Sala de tratamiento de masaje y terapia de tejidos blandos",
  },
};

export const esMassageTechniques: MassageTechnique[] = [
  {
    title: "Técnica Graston / puntos gatillo",
    description:
      "Utiliza una herramienta de acero inoxidable para trabajar el tejido cicatricial y el espasmo muscular que deja una colisión — parecido a un masaje profundo, pero más dirigido.",
    bestFor: "espasmo muscular, tejido cicatricial, tensión crónica",
    image: {
      src: "/figma-exports/drabe-releasetool.png",
      alt: "Tratamiento de tejidos blandos con la técnica Graston",
    },
  },
  {
    title: "Liberación miofascial",
    description:
      "La presión sostenida sobre la fascia que rodea los músculos libera la tensión acumulada en los días posteriores al impacto.",
    bestFor: "movimiento restringido, rigidez por latigazo cervical",
    image: {
      src: "/figma-exports/drabe-backpain.png",
      alt: "Tratamiento de liberación miofascial",
    },
  },
  {
    title: "Terapia de tejido profundo",
    description:
      "La presión lenta y firme alcanza las capas musculares más profundas afectadas por contusiones o distensiones del choque.",
    bestFor: "contusiones profundas, contractura muscular, dolor tras un accidente",
    image: {
      src: "/figma-exports/drabe-soft-tissue.png",
      alt: "Tratamiento de terapia de tejido profundo",
    },
  },
];

export const esMassageConditions: MassageCondition[] = [
  {
    name: "Latigazo cervical",
    description:
      "Trabaja el espasmo y la contractura muscular alrededor del cuello después de una evaluación adecuada.",
    image: {
      src: "https://align-the-spine.b-cdn.net/images/drabe-whiplash.png",
      alt: "Mano evaluando el cuello de un paciente después de un latigazo cervical",
    },
  },
  {
    name: "Dolor de cuello",
    description:
      "Para la tensión y la rigidez que siguen a una colisión, no solo la molestia del día a día.",
    image: {
      src: "https://align-the-spine.b-cdn.net/images/dr-abe-neck.png",
      alt: "El Dr. Abe Nasser tratando el cuello y el hombro de un paciente",
    },
  },
  {
    name: "Dolor de espalda",
    description:
      "Trabaja el espasmo muscular que puede acompañar una lesión de espalda, de disco o articular.",
    image: {
      src: "https://align-the-spine.b-cdn.net/images/drabe-backpain-front.png",
      alt: "Manos tratando la espalda baja de un paciente",
    },
  },
  {
    name: "Hombro y extremidades",
    description:
      "Contusiones y trauma de tejidos blandos en brazos y hombros causados por el cinturón de seguridad.",
    image: {
      src: "https://align-the-spine.b-cdn.net/images/align-the-spine-shoulders.png",
      alt: "Manos tratando el hombro de un paciente",
    },
  },
];

export const esMassageFaq: ConditionFaq = {
  headerTail: "la terapia de tejidos blandos",
  items: [
    {
      q: "¿El trabajo de tejidos blandos ayuda justo después de un accidente de auto?",
      a: "Puede ser apropiado una vez que una evaluación descarta lesiones que requieran atención urgente o una referencia. Mencione la colisión y cuándo aparecieron sus síntomas para que el Dr. Abe elija una técnica adecuada y documente la visita.",
    },
    {
      q: "¿En qué se diferencia de un masaje común?",
      a: "Un masaje común busca relajación general; esto es un tratamiento dirigido al tejido específico que afectó la colisión — Graston, liberación miofascial o tejido profundo, según se trate de tejido cicatricial, rigidez de la fascia o contusión profunda.",
    },
    {
      q: "¿Esto está cubierto por mi reclamo del accidente?",
      a: "Si su lesión está relacionada con el accidente, documentamos cada sesión para que quede registrada en su reclamo. Los detalles de cobertura dependen de su póliza — con gusto le ayudamos en lo que podamos.",
    },
    {
      q: "¿Cuántas sesiones voy a necesitar después de un accidente?",
      a: "Varía según la lesión y la respuesta a la atención. El Dr. Abe reevalúa sus síntomas en lugar de prometer de antemano un número fijo de sesiones o un paquete.",
    },
  ],
};

// ──────────────────────────────────── /es/servicios/terapia-de-ventosas

export const esCuppingHero = {
  eyebrowChip: "¿Tensión muscular localizada?",
  h1: "Terapia de Ventosas en Deerfield Beach, FL",
  subhead:
    "Succión localizada aplicada en zonas seleccionadas de tensión muscular, usada cuando corresponde junto con una evaluación quiropráctica del Dr. Abe.",
  backgroundImage: {
    src: "/figma-exports/cupping-drabe.png",
    alt: "Sesión de terapia de ventosas",
  },
};

/** Related-link paths for the Spanish cupping page — the Spanish
 * counterparts of content/cupping-therapy-page.ts's config. `/blog` is
 * omitted: the blog is CMS-driven and English-only, so it would drop a
 * Spanish reader into English. */
export const esCuppingRelatedConfig = {
  paths: [
    "/es/condiciones/latigazo-cervical",
    "/es/condiciones/dolor-de-cuello",
    "/es/quiropractico-accidentes-de-auto",
    "/es/solicitar-cita",
  ],
  highlightPath: "/es/solicitar-cita",
};

export const esCuppingFaq: ConditionFaq = {
  headerTail: "la terapia de ventosas",
  items: [
    {
      q: "¿Qué es la terapia de ventosas?",
      a: "La terapia de ventosas aplica succión localizada en zonas seleccionadas de tensión muscular, usando copas colocadas sobre la piel. Puede incluirse junto con otro trabajo de tejidos blandos cuando corresponde para molestias de cuello, espalda u otras zonas.",
    },
    {
      q: "¿En qué se diferencia de un masaje?",
      a: "El masaje usa presión manual; las ventosas usan succión para atraer flujo sanguíneo a una zona concreta de tensión. El Dr. Abe elige la técnica — o la combinación — según su evaluación, no según una rutina fija.",
    },
    {
      q: "¿Las ventosas son adecuadas para todos?",
      a: "Se usan cuando corresponde para zonas seleccionadas de tensión muscular, después de una evaluación. El Dr. Abe le dirá si encaja en su caso o si otra técnica de tejidos blandos es un mejor punto de partida.",
    },
    {
      q: "¿Esto está cubierto por mi reclamo del accidente?",
      a: "Si su tratamiento está relacionado con el accidente, documentamos cada sesión para que quede registrada en su reclamo. Los detalles de cobertura dependen de su póliza — con gusto le ayudamos en lo que podamos.",
    },
  ],
};

/** Section headings the Spanish service pages pass into shared components. */
export const esServicePageCopy = {
  howItWorksHeading: "Cómo funciona",
  isItRightHeading: "¿Corresponde a su caso?",
  readyHeading: "Cuando usted esté listo",
  readyBody:
    "Solicite una evaluación en el consultorio, o pregunte si una visita a domicilio corresponde a su caso y su ubicación.",
  readyCta: "Solicitar mi evaluación",
  faqEyebrow: "Preguntas frecuentes",
  faqHeadingLead: "Todo lo que necesita saber sobre",
  techniquesHeading: "Técnicas que utilizamos",
  conditionsHeading: "Condiciones que evaluamos",
  bestForLabel: "Indicado para",
};
