import { serviceAreas } from "@/content/service-areas";
import type { ContentBlock, ContentFaqItem } from "@/lib/content/types";

/** The nineteen Spanish city pages under /es/areas-de-servicio.
 *
 * WHY THIS IS A TEMPLATE AND NOT NINETEEN HAND TRANSLATIONS
 *
 * The English city pages in content/service-areas.ts are one template with
 * city-specific facts interpolated into it — measured at 88.3% mean textual
 * similarity across all 171 pairs (see SPANISH_SEO_IMPLEMENTATION_REPORT.md
 * §11b for the full numbers). Every page repeats the same PIP claims, the
 * same home-visit eligibility language, the same emergency-care callout, and
 * the same Chapter 460 claim-denial explanation. Only the city name, its
 * county's crash statistics, its named roads, and one or two local crash
 * findings actually differ.
 *
 * Hand-translating that nineteen times would mean nineteen independent
 * chances to subtly alter a legally-sensitive claim — a 14-day PIP deadline
 * that becomes a guarantee in one city's Spanish, an "eligible" that quietly
 * becomes "available" in another's. Those claims are the ones that must not
 * drift. So the template is translated ONCE, below, and the verified
 * city-specific facts are interpolated into it, exactly as the English side
 * does it.
 *
 * The result is that the Spanish pages are precisely as differentiated as
 * their English counterparts — no more, no less — and every PIP, EMC and
 * eligibility sentence is provably identical across all nineteen because it
 * is literally the same string.
 *
 * WHAT IS AND ISN'T TRANSLATED
 *
 * Road and place names stay in English: "Glades Road", "Federal Highway",
 * "Sample Road". They're proper nouns and they're what a sign says, what a
 * map says, and what a Spanish-speaking South Florida driver says out loud.
 * Translating them would make the page harder to use, not easier. Connecting
 * words around them are Spanish ("el cruce de Atlantic Boulevard con la
 * U.S. 1"), which is how the register actually reads here.
 *
 * Statistics are carried over verbatim — same numbers, same hedging
 * ("aproximadamente", "según datos preliminares"), same attribution to
 * FLHSMV. A statistic that gains or loses a qualifier in translation is a
 * different claim.
 *
 * SLUGS
 *
 * City slugs are NOT translated: /es/areas-de-servicio/boca-raton, not
 * .../boca-raton-es. The city is a proper noun and "quiropráctico en Boca
 * Raton" is the Spanish query. content/i18n.ts derives the hreflang pairs
 * from this, so the two sides can't drift apart.
 */

export type EsCounty = "Broward" | "Palm Beach" | "Miami-Dade";

export interface EsServiceAreaCity {
  /** Same slug as the English page — see SLUGS above. */
  slug: string;
  communityName: string;
  county: EsCounty;
  /** Named roads/corridors, in Spanish framing but keeping the English
   * proper nouns. Mirrors the English page's own list block. */
  routes: string[];
  /** One sentence on why this city's roads produce the crashes they do. */
  congestion: string;
  /** A documented local crash finding, where the English page has one.
   * `null` where it doesn't — those pages simply don't render the block,
   * exactly as the English ones don't. */
  intersection: string | null;
  relatedSlugs: string[];
}

/** County-level crash statistics, translated once per county rather than
 * per city — the English pages already share one sentence per county, and
 * the three sentences are structurally different enough that templating the
 * numbers out of them would risk changing what each one claims. */
const COUNTY_CRASH: Record<EsCounty, string> = {
  "Palm Beach":
    "En 2025, el condado de Palm Beach registró 25,349 choques de tránsito con 16,014 lesiones relacionadas, incluidos 6,614 choques con fuga, según datos preliminares del FLHSMV.",
  Broward:
    "En 2025, el condado de Broward registró 36,871 choques de tránsito —un promedio de poco más de 101 por día—, incluidos 11,301 choques con fuga y 210 muertes de tránsito, según datos del FLHSMV.",
  "Miami-Dade":
    "En 2025, el condado de Miami-Dade registró aproximadamente 55,530 choques de tránsito —cerca de 152 cada día—, incluidas unas 26,420 lesiones relacionadas, según datos preliminares del Departamento de Seguridad Vial y Vehículos Motorizados de Florida (FLHSMV).",
};

/** The crash-count figure each county's key-takeaway line cites. Kept
 * separate from the paragraph above so the shorter takeaway can't drift
 * from the longer sentence. */
const COUNTY_CRASH_COUNT: Record<EsCounty, string> = {
  "Palm Beach": "25,349",
  Broward: "36,871",
  "Miami-Dade": "55,530",
};

const COUNTY_ES: Record<EsCounty, string> = {
  Broward: "condado de Broward",
  "Palm Beach": "condado de Palm Beach",
  "Miami-Dade": "condado de Miami-Dade",
};

export const esServiceAreaCities: EsServiceAreaCity[] = [
  {
    slug: "boca-raton",
    communityName: "Boca Raton",
    county: "Palm Beach",
    routes: ["Glades Road", "El corredor sur del Florida's Turnpike"],
    congestion:
      "Boca Raton presenta congestión densa a lo largo de Glades Road y del corredor sur del Turnpike, sobre todo en horas pico y durante aguaceros repentinos.",
    intersection:
      "Los datos documentados de choques de la zona también señalan el intercambio de Glades Road con la I-95 como un sitio recurrente de choques múltiples y colisiones a alta velocidad.",
    relatedSlugs: ["delray-beach", "boynton-beach"],
  },
  {
    slug: "boynton-beach",
    communityName: "Boynton Beach",
    county: "Palm Beach",
    routes: ["Congress Avenue"],
    congestion:
      "Congress Avenue, en Boynton Beach, es un corredor de uso mixto muy transitado que soporta tráfico comercial y residencial constante.",
    intersection:
      "Los datos documentados de choques de la zona también ubican a Boynton Beach Boulevard y Congress Avenue entre las intersecciones más peligrosas del condado de Palm Beach.",
    relatedSlugs: ["west-palm-beach", "boca-raton"],
  },
  {
    slug: "coconut-creek",
    communityName: "Coconut Creek",
    county: "Broward",
    routes: ["Lyons Road y Sample Road"],
    congestion:
      "Las principales rutas de traslado de Coconut Creek, por Lyons Road y Sample Road, conectan directamente con los corredores comerciales de Coral Springs y Margate.",
    intersection: null,
    relatedSlugs: ["coral-springs", "margate"],
  },
  {
    slug: "coral-springs",
    communityName: "Coral Springs",
    county: "Broward",
    routes: ["Sample Road y University Drive"],
    congestion:
      "Los corredores comerciales de Coral Springs, por Sample Road y University Drive, soportan tráfico pesado de pare y siga, un escenario común para las colisiones por alcance.",
    intersection:
      "Reportes locales también mencionan Sample Road con University Drive, Wiles Road con la State Road 7/441, Royal Palm Boulevard con University Drive y Atlantic Boulevard con University Drive entre las intersecciones más documentadas de la ciudad.",
    relatedSlugs: ["coconut-creek", "margate"],
  },
  {
    slug: "davie",
    communityName: "Davie",
    county: "Broward",
    routes: ["State Road 84 y University Drive"],
    congestion:
      "En Davie, la mezcla de vecindarios residenciales y corredores comerciales del oeste de Broward genera conflictos frecuentes al girar y al incorporarse.",
    intersection:
      "Los datos documentados de choques de la zona vinculan la State Road 27 y Griffin Road con más de 1,000 choques con daños materiales en un periodo de observación reciente.",
    relatedSlugs: ["fort-lauderdale", "hollywood"],
  },
  {
    slug: "delray-beach",
    communityName: "Delray Beach",
    county: "Palm Beach",
    routes: ["Atlantic Avenue"],
    congestion:
      "Atlantic Avenue, en Delray Beach, soporta tráfico peatonal y vehicular intenso, lo que crea puntos de conflicto frecuentes.",
    intersection:
      "Los datos documentados de choques de la zona también ubican los cruces de Atlantic Avenue con Congress Avenue y con la I-95, junto con los de Military Trail con Atlantic Avenue y Linton Boulevard, entre las intersecciones más peligrosas del condado de Palm Beach.",
    relatedSlugs: ["boynton-beach", "boca-raton"],
  },
  {
    slug: "fort-lauderdale",
    communityName: "Fort Lauderdale",
    county: "Broward",
    routes: ["El intercambio de la I-595 con la I-95", "A1A y Las Olas Boulevard"],
    congestion:
      "Los corredores costeros y del centro de Fort Lauderdale soportan tráfico intenso de residentes y visitantes, y el cruce de A1A con Las Olas ha sido señalado entre las intersecciones de mayor riesgo de la región.",
    intersection:
      "Los datos documentados de choques de la zona mencionan Sunrise Boulevard con Andrews Avenue, la NE 26th Street con Federal Highway y el cruce de A1A con Las Olas Boulevard —este último vinculado por sí solo a más de 1,000 accidentes con lesiones en un año reciente— como sitios de choque recurrentes.",
    relatedSlugs: ["hollywood", "pembroke-pines"],
  },
  {
    slug: "hialeah",
    communityName: "Hialeah",
    county: "Miami-Dade",
    routes: ["La densa cuadrícula de calles del centro de Hialeah"],
    congestion:
      "La cuadrícula estrecha y congestionada de Hialeah es propensa al tipo de impactos de pare y siga, a velocidad baja o media, que suelen causar latigazo cervical.",
    intersection:
      "Los datos documentados de choques también mencionan el cruce de North Okeechobee Road con Hialeah Gardens Boulevard entre las cinco intersecciones más peligrosas de Florida.",
    relatedSlugs: ["miami-beach", "miami-gardens"],
  },
  {
    slug: "hollywood",
    communityName: "Hollywood",
    county: "Broward",
    routes: ["La I-95 y Sheridan Street"],
    congestion:
      "Los vecindarios suburbanos densos de Hollywood están ubicados donde el tráfico local cruza con regularidad los principales corredores interestatales de Broward.",
    intersection: null,
    relatedSlugs: ["pembroke-pines", "pompano-beach"],
  },
  {
    slug: "lighthouse-point",
    communityName: "Lighthouse Point",
    county: "Broward",
    routes: ["Federal Highway (US-1) entre Hillsboro Boulevard y Sample Road"],
    congestion:
      "Lighthouse Point se encuentra justo sobre el corredor de Federal Highway que conecta Deerfield Beach con Pompano Beach, donde son comunes las entradas comerciales y los giros a la izquierda sin protección.",
    intersection: null,
    relatedSlugs: ["pompano-beach", "fort-lauderdale"],
  },
  {
    slug: "margate",
    communityName: "Margate",
    county: "Broward",
    routes: ["Atlantic Boulevard y la State Road 7 (US-441)"],
    congestion:
      "El eje comercial de Margate, por Atlantic Boulevard y la State Road 7, mezcla tráfico local con tráfico de paso más pesado que se dirige a las ciudades vecinas.",
    intersection: null,
    relatedSlugs: ["coconut-creek", "coral-springs"],
  },
  {
    slug: "miami",
    communityName: "Miami",
    county: "Miami-Dade",
    routes: [
      "El intercambio de la SR-836 (Dolphin Expressway) con la I-95",
      "La NW 7th Avenue y la NW 79th Street",
      "La US-1 (Biscayne Boulevard) por el centro de Miami",
    ],
    congestion:
      "El denso núcleo urbano de Miami y sus intercambios viales complejos concentran parte del mayor volumen de choques en intersecciones y por alcance de todo el condado.",
    intersection:
      "Miami también ha sido señalada entre las ciudades más difíciles para conducir en Estados Unidos, con una tasa reportada de aproximadamente 5.4 accidentes por cada 1,000 conductores; los vehículos comerciales estuvieron involucrados en cerca del 14% de los choques del condado de Miami-Dade en un año reciente.",
    relatedSlugs: ["hialeah", "miami-beach"],
  },
  {
    slug: "miami-beach",
    communityName: "Miami Beach",
    county: "Miami-Dade",
    routes: ["Las calzadas MacArthur y Julia Tuttle", "Collins Avenue"],
    congestion:
      "El tráfico intenso de turistas y visitantes, muchos de ellos poco familiarizados con las vías locales, hace más frecuentes los cambios de carril repentinos y los choques con peatones.",
    intersection: null,
    relatedSlugs: ["miami-gardens", "miami"],
  },
  {
    slug: "miami-gardens",
    communityName: "Miami Gardens",
    county: "Miami-Dade",
    routes: ["El Palmetto Expressway (SR-826)"],
    congestion:
      "Como corredor principal de traslado sobre el Palmetto Expressway, Miami Gardens presenta congestión frecuente de pare y siga en horas pico.",
    intersection: null,
    relatedSlugs: ["miami", "hialeah"],
  },
  {
    slug: "pembroke-pines",
    communityName: "Pembroke Pines",
    county: "Broward",
    routes: ["Pines Boulevard y Flamingo Road"],
    congestion:
      "Las arterias suburbanas anchas y de varios carriles de Pembroke Pines favorecen velocidades más altas, y el cruce de Pines Boulevard con Flamingo Road ha sido señalado históricamente entre las intersecciones más peligrosas del país.",
    intersection:
      "Los datos documentados de choques de la zona muestran que Pines Boulevard y South Flamingo Road se han vinculado con aproximadamente 100 muertes de peatones en un periodo de cinco años, lo que lo convierte en una de las zonas de mayor riesgo del corredor.",
    relatedSlugs: ["pompano-beach", "davie"],
  },
  {
    slug: "pompano-beach",
    communityName: "Pompano Beach",
    county: "Broward",
    routes: ["Federal Highway (US-1) y Atlantic Boulevard"],
    congestion:
      "Los corredores comerciales de Pompano Beach, en el norte del condado, soportan una mezcla intensa de tráfico local y de paso.",
    intersection:
      "Los datos documentados de choques de la zona vinculan Atlantic Boulevard y la U.S. 1 con más de 6,000 choques en un periodo reciente de varios años.",
    relatedSlugs: ["davie", "fort-lauderdale"],
  },
  {
    slug: "sunrise",
    communityName: "Sunrise",
    county: "Broward",
    routes: ["Oakland Park Boulevard cerca de la NW 50th Avenue"],
    congestion:
      "El tramo de Oakland Park Boulevard que cruza Sunrise es un corredor de alto volumen y varios carriles que comparte con la vecina Tamarac.",
    intersection:
      "Los datos documentados de choques de la zona mencionan West Oakland Park Boulevard y la NW 50th Avenue como un sitio de choque recurrente, consistente con el tráfico comercial pesado que soporta el corredor.",
    relatedSlugs: ["tamarac", "davie"],
  },
  {
    slug: "tamarac",
    communityName: "Tamarac",
    county: "Broward",
    routes: ["University Drive y Commercial Boulevard"],
    congestion:
      "El corredor de University Drive y Commercial Boulevard, en Tamarac, soporta tráfico pesado de traslado entre Sunrise y Coral Springs.",
    intersection: null,
    relatedSlugs: ["sunrise", "coral-springs"],
  },
  {
    slug: "west-palm-beach",
    communityName: "West Palm Beach",
    county: "Palm Beach",
    routes: ["Military Trail y Okeechobee Boulevard"],
    congestion:
      "Como centro urbano y comercial del condado, West Palm Beach concentra su mayor volumen de tráfico, y el cruce de Military Trail con Okeechobee Boulevard ha sido señalado como uno de los más propensos a choques del condado.",
    intersection:
      "Los datos documentados de choques de la zona también señalan el cruce de Okeechobee Boulevard con Military Trail como un sitio recurrente de colisiones por alcance y de impacto lateral.",
    relatedSlugs: ["boca-raton", "boynton-beach"],
  },
];

/* ------------------------------------------------------------------ */
/* The shared template — translated once, interpolated nineteen times. */
/* ------------------------------------------------------------------ */

export function esServiceAreaTitle(city: EsServiceAreaCity): string {
  return `Quiropráctico a Domicilio para Accidentes de Auto en ${city.communityName}, FL`;
}

export function esServiceAreaMetaDescription(city: EsServiceAreaCity): string {
  return `Atención quiropráctica a domicilio para pacientes elegibles de accidente de auto y PIP en ${city.communityName}, FL — el plazo de 14 días del PIP en Florida y elegibilidad caso por caso.`;
}

export function esServiceAreaExcerpt(city: EsServiceAreaCity): string {
  return `El Dr. Abe Nasser ofrece evaluaciones quiroprácticas a domicilio por accidente de auto y PIP para pacientes elegibles en ${city.communityName}, FL, y explica qué significa el plazo de 14 días del PIP de Florida para su reclamo.`;
}

export function esServiceAreaDirectAnswer(city: EsServiceAreaCity): string {
  return `El Dr. Abe Nasser ofrece evaluaciones quiroprácticas a domicilio para pacientes elegibles de accidente de auto y PIP en ${city.communityName}, además de las citas en el consultorio de Deerfield Beach. Las visitas a domicilio dependen de su caso y de su ubicación, y se confirman directamente con usted antes de agendar.`;
}

export function esServiceAreaKeyTakeaways(city: EsServiceAreaCity): string[] {
  return [
    `Las visitas a domicilio se consideran caso por caso para situaciones elegibles de accidente de auto y PIP en ${city.communityName}; no son un servicio general sin cita.`,
    "Las reglas del PIP de Florida pueden exigir recibir la atención inicial dentro de los 14 días posteriores al accidente.",
    `El ${COUNTY_ES[city.county]} registró ${COUNTY_CRASH_COUNT[city.county]} choques de tránsito en 2025 — documentar a tiempo importa.`,
  ];
}

export function esServiceAreaFaqs(city: EsServiceAreaCity): ContentFaqItem[] {
  return [
    {
      id: "faq-does-my-auto-insurance-cover-a-home-visi",
      question: `¿Mi seguro de auto cubre una visita a domicilio en ${city.communityName}?`,
      answer:
        "La cobertura y el pago dependen de su póliza, de su elegibilidad, de la necesidad médica y de las circunstancias de su reclamo. Llame al consultorio y repasamos qué esperar antes de su primera visita.",
    },
    {
      id: "faq-what-if-the-other-driver-left-the-scene",
      question: "¿Y si el otro conductor se fue del lugar del accidente?",
      answer:
        "Los accidentes con fuga aún pueden calificar para el PIP y para otras coberturas, según su póliza. Llámenos y le ayudamos a entender sus opciones.",
    },
    {
      id: "faq-do-i-need-a-referral-before-a-home-visit",
      question: "¿Necesito una referencia antes de una visita a domicilio?",
      answer:
        "No: puede llamar directamente. Si ya tiene un reporte policial, un abogado u otro proveedor involucrado, con gusto coordinamos con ellos.",
    },
    {
      id: "faq-14-day-pip-rule",
      question: "¿Qué es la regla de los 14 días del PIP en Florida?",
      answer: `La ley de Protección contra Lesiones Personales (PIP) de Florida generalmente exige que usted reciba servicios y atención médica inicial dentro de los 14 días posteriores a un accidente de auto para que el reclamo siga siendo elegible para los beneficios del PIP. Esto es información general, no asesoría legal: esperar a ver si el dolor se resuelve solo es una de las razones más comunes por las que residentes de ${city.communityName} pierden ese plazo.`,
    },
    {
      id: "faq-what-is-an-emergency-medical-condition",
      question: "¿Qué es una Condición Médica de Emergencia (EMC) y por qué importa?",
      answer:
        "Una Condición Médica de Emergencia (EMC, por sus siglas en inglés) es una determinación que hace un proveedor médico calificado sobre la gravedad de su lesión. Bajo el PIP de Florida, esa determinación afecta su límite de beneficios: hasta $10,000 con un diagnóstico de EMC, frente a $2,500 sin él. Pregunte a su aseguradora, a sus proveedores tratantes o a un profesional legal calificado cómo aplica esto a su reclamo específico — esto es información general, no asesoría legal ni médica.",
    },
  ];
}

/** The page body. Block ids mirror the English page's so the two are
 * diffable side by side; blocks the English page omits for a given city
 * (the intersection paragraph) are omitted here too. */
export function esServiceAreaBlocks(city: EsServiceAreaCity): ContentBlock[] {
  const blocks: ContentBlock[] = [
    {
      id: "block-1",
      type: "heading",
      level: 2,
      text: `¿Se lesionó en un accidente de auto en ${city.communityName}? La atención puede ir a usted.`,
    },
    {
      id: "block-2",
      type: "paragraph",
      text: `El Dr. Abe Nasser evalúa y trata a pacientes elegibles de accidente de auto y PIP en ${city.communityName} mediante visitas a domicilio, además de atender pacientes en el consultorio de Deerfield Beach. Una visita a domicilio se ofrece según su caso y su ubicación —no está garantizada para toda situación— y se confirma directamente con usted antes de agendar.`,
    },
    {
      id: "block-3",
      type: "heading",
      level: 2,
      text: "El plazo de 14 días del PIP en Florida",
    },
    {
      id: "block-4",
      type: "paragraph",
      text: "El PIP de Florida generalmente exige recibir servicios y atención inicial dentro de los 14 días posteriores a un accidente vehicular. La elegibilidad, el reembolso y los límites de beneficios dependen de la póliza y de las circunstancias. Esperar a ver si el dolor se resuelve solo puede dejarle sin documentación oportuna para su reclamo.",
    },
    {
      id: "block-5",
      type: "heading",
      level: 3,
      text: "La Condición Médica de Emergencia y su límite de cobertura",
    },
    {
      id: "block-6",
      type: "paragraph",
      text: "La ley de Florida también distingue los reclamos de PIP según si un proveedor médico calificado diagnostica una Condición Médica de Emergencia (EMC), lo cual afecta el límite de beneficios disponible bajo una póliza. Pregunte a su aseguradora, a sus otros proveedores tratantes o a un profesional legal calificado cómo aplica esto a su reclamo específico — esta página es información general, no asesoría legal.",
    },
    {
      id: "block-7",
      type: "heading",
      level: 2,
      text: `Datos de choques del ${COUNTY_ES[city.county]}`,
    },
    {
      id: "block-8",
      type: "paragraph",
      text: COUNTY_CRASH[city.county],
    },
    {
      id: "block-9",
      type: "heading",
      level: 3,
      text: `Vías que los conductores de ${city.communityName} conocen bien`,
    },
    {
      id: "block-10",
      type: "list",
      style: "unordered",
      items: city.routes,
    },
    {
      id: "block-11",
      type: "paragraph",
      text: city.congestion,
    },
  ];

  if (city.intersection) {
    blocks.push({ id: "block-25", type: "paragraph", text: city.intersection });
  }

  blocks.push(
    {
      id: "block-12",
      type: "heading",
      level: 2,
      text: "Condiciones que se evalúan después de un choque",
    },
    {
      id: "block-13",
      type: "list",
      style: "unordered",
      items: [
        "Latigazo cervical y distensión por aceleración-desaceleración cervical (CAD)",
        "Esguince o distensión lumbar y torácica",
        "Dolor irradiado a la pierna o al brazo (síntomas tipo ciática)",
        "Irritación de las articulaciones facetarias y rango de movimiento limitado",
        "Lesión general de tejidos blandos por la colisión",
      ],
    },
    {
      id: "block-14",
      type: "callout",
      tone: "emergency",
      title: "Cuándo buscar atención de emergencia en lugar de esto",
      text: "Busque atención de emergencia de inmediato si tiene dolor intenso o que empeora, pérdida del conocimiento, entumecimiento, debilidad o cualquier síntoma que le preocupe. Esta página es educativa y no sustituye una evaluación médica de emergencia.",
    },
    {
      id: "block-15",
      type: "heading",
      level: 2,
      text: "Trabajo conjunto con sus otros proveedores",
    },
    {
      id: "block-16",
      type: "paragraph",
      text: "Si ya trabaja con un abogado o con otro proveedor médico, el Dr. Abe Nasser coordina la documentación y los registros de tratamiento para que su expediente se mantenga consistente. La cobertura, la facturación y cualquier arreglo relacionado con su abogado se confirman directamente con usted antes de iniciar el tratamiento.",
    },
    {
      id: "block-17",
      type: "heading",
      level: 2,
      text: "Qué incluye una evaluación a domicilio",
    },
    {
      id: "block-18",
      type: "paragraph",
      text: "Una visita a domicilio suele comenzar igual que una evaluación en el consultorio: un repaso de cómo ocurrió el accidente, un examen manual de la zona afectada y un plan de próximos pasos. Cambia el entorno; el proceso clínico no.",
    },
    {
      id: "block-21",
      type: "heading",
      level: 2,
      text: "La visita a domicilio comparada con manejar hasta el consultorio",
    },
    {
      id: "block-22",
      type: "paragraph",
      text: `Después de un accidente de auto, ir sentado en un vehículo hasta una clínica puede agravar un cuello y una espalda rígidos o distendidos incluso antes de que los evalúen. Una visita a domicilio permite que los pacientes elegibles de ${city.communityName} reciban ese mismo examen manual y la atención inicial sin el traslado, lo cual puede importar cuando la prioridad es documentar dentro del plazo de 14 días del PIP de Florida. Las citas en el consultorio de Deerfield Beach siguen disponibles para quien las prefiera o cuyo caso no sea elegible para una visita a domicilio.`,
    },
    {
      id: "block-23",
      type: "heading",
      level: 2,
      text: "Cómo se impugnan las negaciones de reclamos",
    },
    {
      id: "block-24",
      type: "paragraph",
      text: "La ley de Florida limita cómo una aseguradora puede dejar de pagar una atención quiropráctica que ya está en curso: bajo el Estatuto 627.736 de Florida, por lo general una aseguradora no puede retirar el pago a un proveedor tratante sin un informe válido de un proveedor con licencia bajo ese mismo capítulo. Como los quiroprácticos tienen licencia bajo el Capítulo 460, un informe de un médico por sí solo no basta para justificar la suspensión de la atención quiropráctica. El reembolso por servicios elegibles es generalmente el 80% del gasto razonable y médicamente necesario. Esta es información general sobre cómo funcionan los reclamos de PIP, no asesoría legal — un abogado con licencia puede asesorarle sobre su reclamo específico.",
    },
  );

  return blocks;
}

/** Every Spanish city page, assembled. */
export interface EsServiceAreaPage {
  slug: string;
  path: string;
  /** The English page this one is the counterpart of. */
  enPath: string;
  communityName: string;
  county: EsCounty;
  countyEs: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  excerpt: string;
  directAnswer: string;
  keyTakeaways: string[];
  faqs: ContentFaqItem[];
  blocks: ContentBlock[];
  relatedSlugs: string[];
}

export const esServiceAreaPages: EsServiceAreaPage[] = esServiceAreaCities.map((city) => ({
  slug: city.slug,
  path: `/es/areas-de-servicio/${city.slug}`,
  enPath: `/service-areas/${city.slug}`,
  communityName: city.communityName,
  county: city.county,
  countyEs: COUNTY_ES[city.county],
  title: esServiceAreaTitle(city),
  seoTitle: esServiceAreaTitle(city),
  metaDescription: esServiceAreaMetaDescription(city),
  excerpt: esServiceAreaExcerpt(city),
  directAnswer: esServiceAreaDirectAnswer(city),
  keyTakeaways: esServiceAreaKeyTakeaways(city),
  faqs: esServiceAreaFaqs(city),
  blocks: esServiceAreaBlocks(city),
  relatedSlugs: city.relatedSlugs,
}));

export function getEsServiceAreaPage(slug: string): EsServiceAreaPage | undefined {
  return esServiceAreaPages.find((page) => page.slug === slug);
}

/** Fails the build if this file and content/service-areas.ts ever disagree
 * about which cities exist. The Spanish set is defined independently above
 * (so a Spanish page is a deliberate act, not an automatic side effect of
 * adding an English one), which is exactly why it needs checking. */
const enSlugs = new Set(serviceAreas.map((entry) => entry.slug));
const esSlugs = new Set(esServiceAreaCities.map((city) => city.slug));
for (const slug of esSlugs) {
  if (!enSlugs.has(slug)) {
    throw new Error(
      `content/es/service-areas-cities.ts: "${slug}" has no English counterpart in content/service-areas.ts`,
    );
  }
}
for (const slug of enSlugs) {
  if (!esSlugs.has(slug)) {
    throw new Error(
      `content/es/service-areas-cities.ts: English city "${slug}" has no Spanish page — add it here or remove it from content/service-areas.ts`,
    );
  }
}
