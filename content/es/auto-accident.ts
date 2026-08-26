import type { HowWeHelpStep } from "@/components/sections/how-we-help-steps";
import type { ComparisonRow } from "@/content/comparison-table";
import type { ConditionAccident, ConditionFaqItem } from "@/content/conditions/types";
import { siteConfig } from "@/content/site";
import { verified, type VerifiedValue } from "@/content/verified-value";

/** Spanish content for /es/quiropractico-accidentes-de-auto.
 *
 * This is the Spanish site's primary acquisition page, and it's written to
 * be retrievable for a cluster of related questions rather than for one
 * exact-match phrase. Spanish accident searchers in South Florida don't
 * converge on a single wording — "accidente de auto", "accidente de carro",
 * "choque", "accidente automovilístico" all occur, alongside questions
 * ("qué hacer después de un accidente de carro", "cuándo ver a un
 * quiropráctico"). Rather than spawning a near-duplicate page per variant
 * (which is how a site ends up competing with itself — see §Keyword
 * cannibalization in the report), one page covers the cluster: "auto" leads
 * in the title and H1, and "carro" and "choque" appear naturally in the
 * body where a person would actually say them.
 *
 * Each `pipAnswers` and `faq` entry is written answer-first: the direct
 * answer in the first sentence, the qualification after. That's what makes
 * a passage useful on its own to a reader skimming, and independently
 * quotable to a retrieval system that pulled just that block.
 *
 * SEARCH-VOLUME UNVERIFIED — see content/es/seo.ts.
 *
 * ── Legal accuracy ──────────────────────────────────────────────────────
 * Every statement about Florida PIP below was checked against Fla. Stat.
 * § 627.736 as it stands in August 2026 (verified at implementation time;
 * the 2026 legislative session closed 2026-03-13 without repealing
 * no-fault — SB 522 and HB 769 both died in committee, so the statute and
 * its 14-day rule remain in force). Specifically:
 *   - § 627.736(1)(a): medical benefits are 80% of reasonable expenses,
 *     within the $10,000 combined medical/disability limit, and require
 *     "initial services and care ... within 14 days after the motor
 *     vehicle accident".
 *   - Reimbursement is limited to $2,500 where a qualifying provider
 *     determines there was no emergency medical condition.
 *   - The providers who may make that emergency-medical-condition
 *     determination are physicians under ch. 458/459, dentists under
 *     ch. 466, physician assistants, and advanced practice registered
 *     nurses. A chiropractic physician is NOT among them.
 *
 * That last point is the one most competitor pages omit, and stating it
 * plainly is both the honest thing and the genuine information gain on
 * this page: it tells the reader why the number they may have seen
 * advertised ("$10,000!") is not something this practice can promise them.
 *
 * Nothing here tells a reader what their coverage is, what they're
 * entitled to, or what to do about a claim. Those are questions for their
 * insurer or a licensed attorney, and every block that touches them says
 * so.
 */

export const esAutoAccidentHero = {
  eyebrowChip: "ATENCIÓN QUIROPRÁCTICA DESPUÉS DE UN ACCIDENTE",
  /** H1. Kept short and human, matching the English page's Figma-approved
   * "Injured in an Accident?" rather than stuffing the keyword into the
   * headline — the head term is carried by the title tag, the eyebrow and
   * the opening paragraph, where it reads naturally. */
  titleLines: ["¿Lesionado en", "un accidente?"] as const,
  subhead:
    "El Dr. Abe realiza evaluaciones quiroprácticas en Deerfield Beach por dolor de cuello, dolor de espalda, rigidez y síntomas de latigazo cervical después de un accidente de auto, y documenta los hallazgos para su reclamo de seguro PIP cuando corresponde.",
  /** The phrase the subhead links to the PIP calculator on. Must appear
   * verbatim in `subhead` — the page splits on it. */
  pipLinkPhrase: "seguro PIP",
  callPillEyebrow: "Hablemos hoy",
  bilingualNote: "El Dr. Abe atiende en español. Llame y pregunte por él directamente.",
  form: {
    heading: "Solicite su evaluación por accidente",
    footerNote:
      "Visítenos en Deerfield Beach, o llame para preguntar si una visita a domicilio corresponde a su caso y su ubicación.",
  },
};

/** Spanish rendering of the same client-approved PIP stat the English hero
 * shows (content/conditions/auto-accident.ts's `flags.pipStat`). It carries
 * the same verification source and date because it is the same approved
 * claim in another language — not a new one. The description spells out
 * the condition attached to the figure, exactly as the English does. */
export const esPipStat: VerifiedValue<{ value: string; description: string }> = verified(
  {
    value: "$10,000",
    description:
      "de cobertura PIP disponible con una determinación de condición médica de emergencia — $2,500 sin ella",
  },
  "Client-provided design mockup (same approved stat as the English page)",
  "2026-08-11",
);

/** The PIP banner beside the 14-day calculator. */
export const esAutoAccidentAccident: ConditionAccident = {
  headline: "La ley PIP de Florida exige iniciar la atención dentro de 14 días",
  body: "En Florida, el seguro PIP generalmente exige que la atención inicial comience dentro de los 14 días posteriores al accidente. La elegibilidad, el reembolso y los límites de beneficios dependen de su póliza y de las circunstancias de su caso.",
  smallprint:
    "La cobertura y el pago dependen de su póliza, su elegibilidad, la necesidad médica y las circunstancias de su reclamo. Esta página es información general, no asesoría legal ni una promesa de cobertura.",
};

export interface EsAnswerBlock {
  /** Question or topic, rendered as the block's heading. */
  heading: string;
  /** The direct answer — one or two sentences, understandable on its own
   * without the rest of the page. */
  answer: string;
  /** Supporting explanation and the limits on that answer. */
  detail: string;
}

/** Answer-first blocks covering the questions that fan out from "quiropráctico
 * después de un accidente de carro". Each stands alone. */
export const esAutoAccidentAnswers: EsAnswerBlock[] = [
  {
    heading: "¿Qué debo hacer si me duele algo después de un accidente de auto?",
    answer:
      "Si tiene síntomas graves —dolor intenso, dificultad para respirar, confusión, entumecimiento o debilidad— busque atención de emergencia primero, no una cita quiropráctica.",
    detail:
      "Para molestias musculoesqueléticas que no son una emergencia, como rigidez de cuello, dolor de espalda o dolor de cabeza que aparece uno o dos días después del choque, una evaluación temprana permite documentar lo que encontramos y determinar si el tratamiento quiropráctico es apropiado en su caso o si conviene referirlo a otro profesional.",
  },
  {
    heading: "¿Cuándo debería ver a un quiropráctico después de un choque?",
    answer:
      "Cuanto antes se evalúe, mejor queda documentado el caso — y en Florida el seguro PIP generalmente exige que la atención inicial comience dentro de los 14 días posteriores al accidente.",
    detail:
      "No hace falta esperar a que el dolor empeore. Algunas molestias de tejidos blandos tardan horas o días en manifestarse, así que sentirse bien el mismo día del accidente no significa que no haya nada que evaluar. Si ya pasaron los 14 días, todavía puede recibir atención: lo que cambia es cómo su aseguradora trata el reclamo, y eso debe consultarlo con ella o con un abogado.",
  },
  {
    heading: "¿Qué pasa en la primera visita?",
    answer:
      "Hablamos de lo que ocurrió, revisamos sus síntomas y hacemos un examen físico enfocado en el cuello, la espalda y las zonas donde tiene molestias.",
    detail:
      "A partir de ese examen, el Dr. Abe le explica qué encontró y si la atención quiropráctica corresponde a su caso, si conviene una referencia a otro profesional, o ambas cosas. Los hallazgos relacionados con el accidente quedan documentados. Lo atiende el Dr. Abe directamente, en español o en inglés, y él contesta el teléfono del consultorio.",
  },
  {
    heading: "¿Cuánto cubre el seguro PIP en Florida?",
    answer:
      "Bajo la ley de Florida, el PIP cubre el 80 % de los gastos médicos razonables dentro de un límite combinado de $10,000 — pero ese límite baja a $2,500 si no hay una determinación de condición médica de emergencia.",
    detail:
      "Esa determinación solo la puede hacer un médico (MD o DO), un dentista, un asistente médico o un enfermero practicante registrado. Un quiropráctico no está autorizado por la ley de Florida a hacerla. Por eso no le prometemos una cifra: lo que su póliza cubra depende de su caso, de su cobertura y de esa determinación. Consulte a su aseguradora o a un abogado con licencia sobre su situación específica.",
  },
  {
    heading: "¿Necesito un reporte policial o un abogado para que me atiendan?",
    answer: "No. Puede venir solamente con la información de su seguro.",
    detail:
      "Si ya tiene un reporte policial, un abogado o un ajustador asignado, coordinamos la documentación directamente con ellos para que su plan de atención y sus registros estén listos cuando se necesiten. No referimos pacientes a abogados ni recibimos referencias a cambio.",
  },
  {
    heading: "Dolor de cuello y de espalda después del accidente",
    answer:
      "El dolor de cuello y de espalda baja son las molestias más frecuentes después de una colisión, sobre todo en choques por alcance.",
    detail:
      "La fuerza repentina puede distender músculos y ligamentos, irritar articulaciones y, en algunos casos, afectar los discos. Cuando el dolor se irradia hacia un brazo o una pierna, o viene acompañado de entumecimiento u hormigueo, es un hallazgo que debe evaluarse pronto y que puede requerir estudios de imagen o una referencia médica.",
  },
];

/** Emergency guidance. Rendered prominently, not buried: this practice is
 * not emergency care and the page must never read as though a chiropractic
 * appointment substitutes for an ER visit. */
export const esAutoAccidentRedFlags = {
  heading: "Cuándo buscar atención de emergencia, no una cita",
  intro:
    "Llame al 911 o acuda a una sala de emergencias si después del accidente presenta cualquiera de estos signos:",
  items: [
    "Entumecimiento, hormigueo o debilidad en brazos o piernas",
    "Dolor de cabeza intenso, mareo, vómito o confusión",
    "Pérdida del conocimiento, aunque haya sido breve",
    "Dolor en el pecho o el abdomen, o dificultad para respirar",
    "Dolor que empeora rápidamente en lugar de mejorar",
  ],
  footnote:
    "Align the Spine no es un servicio de emergencias y no diagnostica por internet. Esta página es información general y no reemplaza la evaluación de un profesional de la salud.",
};

/** "Cómo lo ayudamos" steps — the Spanish rendering of
 * content/auto-accident.ts's autoAccidentSteps, same three images. */
export const esAutoAccidentSteps: HowWeHelpStep[] = [
  {
    image: "/figma-exports/home-visits-step-call.png",
    alt: "Teléfono mostrando una llamada entrante",
    title: "Llame o solicite en línea",
    description: "Cuéntenos qué pasó. Sin centro de llamadas y sin música de espera.",
  },
  {
    image: "/figma-exports/home-visits-step-eligibility.png",
    alt: "Tabla con un formulario de evaluación",
    title: "Evaluación completa",
    description:
      "Un examen completo y la documentación que su reclamo realmente necesita — en el consultorio o en su casa.",
  },
  {
    image: "/figma-exports/home-visits-step-visit.png",
    alt: "Libreta y bolígrafo listos para un plan de tratamiento",
    title: "Un plan de atención documentado",
    description:
      "La atención se define según su evaluación, y los hallazgos relacionados con el accidente quedan documentados para su reclamo.",
  },
];

export const esAutoAccidentStepsHeading = "De la llamada a sentirse usted mismo otra vez";

/** Coordination line. Like the English original, it describes only what the
 * practice does — no attorney-referral claim, no coverage guarantee. */
export const esAutoAccidentCoordinationQuote =
  "Cuando su caso involucra a un abogado o a un ajustador de seguros, coordinamos directamente con ellos — para que su plan de tratamiento y su documentación estén listos cuando se necesiten.";

export const esAutoAccidentFaq: ConditionFaqItem[] = [
  {
    q: "Me siento bien — ¿de verdad necesito que me revisen?",
    a: "Algunos síntomas relacionados con un accidente aparecen después. Si tiene síntomas graves o que empeoran, busque atención médica urgente; de lo contrario, una evaluación oportuna permite documentar las molestias y determinar si el tratamiento o una referencia son apropiados.",
  },
  {
    q: "¿Esto me va a costar algo de mi bolsillo?",
    a: "Depende de su cobertura y de los detalles de su caso. Llámenos y le explicamos qué esperar antes de su primera visita. No podemos garantizarle que su seguro pague ni decirle cuánto cubrirá.",
  },
  {
    q: "¿Qué pasa si ya pasaron los 14 días?",
    a: "Todavía puede buscar la atención médica que corresponda, pero en Florida el pago del PIP generalmente depende de haber recibido la atención inicial dentro de los 14 días. Pregunte a su aseguradora o a un profesional legal calificado sobre su cobertura específica.",
  },
  {
    q: "¿Atienden en español?",
    a: "Sí. El Dr. Abe atiende en español y en inglés, y él mismo contesta el teléfono del consultorio.",
  },
  {
    q: "¿Puede el quiropráctico determinar si tuve una condición médica de emergencia?",
    a: "No. Bajo la ley de Florida, esa determinación solo la puede hacer un médico (MD o DO), un dentista, un asistente médico o un enfermero practicante registrado. Es un punto importante porque el límite de beneficios del PIP depende de ella.",
  },
  {
    q: "¿Puedo pedir una visita a domicilio después de un accidente?",
    a: "Puede preguntar. Las visitas a domicilio dependen de su caso y de su ubicación, y confirmamos la elegibilidad cuando llama — no es un servicio garantizado.",
  },
];

export const esAutoAccidentFaqHeading = {
  eyebrow: "Preguntas frecuentes",
  headingLead: "Todo lo que necesita saber sobre",
  headingTail: "las lesiones por accidente de auto",
};

/** Spanish comparison rows — same five rows the English auto-accident
 * variant renders. "Priority Scheduling" is rendered as "Agenda
 * prioritaria", not as a promise of same-day care: the approved claim in
 * content/site.ts is `sameDayAvailability: "Same-day"`, which the stat bar
 * already carries, and this row shouldn't quietly upgrade it. */
export const esComparisonCopy = {
  eyebrow: "Una mejor forma de recuperarse",
  heading: "¿Por qué llegar a duras penas a una clínica cuando le duele?",
  subheading:
    "El Dr. Abe Nasser arma el plan alrededor de su recuperación — incluidas las visitas a domicilio cuando corresponden.",
  columnHeadings: {
    careBenefits: "Beneficios de la atención",
    alignTheSpine: "Align the Spine",
    traditionalClinic: "Clínica tradicional",
  },
  footnote:
    "Las visitas a domicilio se ofrecen según su caso y su ubicación — confirmamos la elegibilidad cuando nos llama.",
  rows: [
    {
      label: "Traslado",
      alignTheSpine: "Visitas a domicilio, cuando corresponde",
      traditionalClinic: "Usted maneja con dolor",
    },
    {
      label: "Disponibilidad",
      alignTheSpine: "Agenda prioritaria",
      traditionalClinic: "Lista de espera de 2 a 3 semanas",
    },
    {
      label: "Comodidad",
      alignTheSpine: "Su propia sala",
      traditionalClinic: "Sala de espera clínica",
    },
  ] as ComparisonRow[],
  autoAccidentRows: [
    {
      label: "Su doctor",
      alignTheSpine: "El mismo doctor en cada visita",
      traditionalClinic: "Un proveedor distinto cada vez",
    },
    {
      label: "Referencias de abogados",
      alignTheSpine: "No se necesita referencia",
      traditionalClinic: "Se requiere referencia externa",
    },
  ] as ComparisonRow[],
};

/** The two navy CTA bands on the accident page. */
export const esAutoAccidentCtaBands = {
  ready: {
    heading: "Cuando usted esté listo",
    body: "Solicite una evaluación en el consultorio, o pregunte si una visita a domicilio corresponde a su caso y su ubicación.",
    cta: "Solicitar mi evaluación",
  },
  call: {
    heading: "¿Le quedan dudas? Solo llame",
    body: "El Dr. Abe contesta el teléfono. Sin centro de llamadas y sin música de espera.",
    eyebrow: "Hablemos hoy",
    cta: `Llamar al ${siteConfig.business.phone}`,
  },
};
