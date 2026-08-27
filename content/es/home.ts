import type { ServiceCardItem } from "@/components/ui/service-card";
import type { DoctorRating } from "@/content/doctor-profile";
import type { Service } from "@/content/services";
import { siteConfig } from "@/content/site";
import type { SpineOverviewContent } from "@/content/spine-overview";
import { verified } from "@/content/verified-value";
import type { WhyChooseContent } from "@/content/why-choose";

/** Spanish copy for the /es home page.
 *
 * Written against Spanish search intent rather than translated sentence by
 * sentence from content/*.ts. Where the English copy leans on phrasing that
 * only works in English ("a doctor who actually knows your name"), the
 * Spanish says the equivalent thing the way it would be said in Spanish
 * instead of reproducing the idiom.
 *
 * Claim discipline is identical to the English side: nothing here promises
 * relief, recovery, cure, or coverage, and no credential, service, or
 * statistic appears that isn't already verified in content/site.ts or
 * content/doctor-profile.ts. "Puede", "podría" and "según su evaluación"
 * do the same hedging work the English "may"/"can help" does.
 */

export const esHomeHero = {
  /** H1. Mirrors the English hero's two-line split (ATS-SEO-050 aligned it
   * to the title tag rather than leading with the brand name) and does the
   * same job in Spanish: the H1 now matches this route's <title>,
   * "Quiropráctico en Deerfield Beach, FL". The head term plus geo modifier
   * is also the order a Spanish query actually puts them in. */
  titleLines: ["Quiropráctico en", "Deerfield Beach, FL"] as const,
  /** Mirrors the English "We accept cash visits". This deliberately no
   * longer states a dollar figure: upstream removed the "$50 office visit"
   * badge from the English hero, and a Spanish page must not keep
   * advertising a price the English site has stopped quoting. */
  badge: "Aceptamos pagos en efectivo",
  subhead:
    "Atención quiropráctica en Deerfield Beach para dolor de espalda, dolor de cuello, movilidad y lesiones — con evaluaciones enfocadas después de un accidente de auto.",
  callPillEyebrow: "Hablemos hoy",
  /** The English hero carries a Spanish line telling Spanish speakers the
   * doctor speaks their language. On the Spanish page that line would be
   * redundant, so it's replaced by the reciprocal information a Spanish
   * reader actually needs: that they'll be attended in Spanish in person,
   * not just on the website. Backed by content/site.ts's `bilingualCare`,
   * which is client-verified ("EN/ES", 2026-08-11) — without that sign-off
   * this line would not exist, since a Spanish website proves nothing about
   * who answers the phone. */
  bilingualNote: "El Dr. Abe atiende en español. Llame y pregunte por él directamente.",
  form: {
    heading: "Solicite su evaluación quiropráctica",
    submitLabel: "Solicitar mi evaluación",
    footerNote:
      "Visítenos en Deerfield Beach, o llame para preguntar si una visita a domicilio corresponde a su caso y su ubicación.",
  },
};

/** Section headings the Spanish home page passes into shared components. */
export const esHomeSections = {
  servicesHeading: "Servicios quiroprácticos",
  accidentInjuriesEyebrow: "Lo que tratamos",
  accidentInjuriesHeading: "Lesiones comunes por accidente que tratamos",
};

/** Spanish rendering of content/services.ts's `services`.
 *
 * `slug` values are unchanged — they're the anchor ids the Service schema
 * (lib/schema.ts's buildService) and any inbound #fragment link use, and
 * they're not visitor-facing. The gated "New Patient Special" entry is
 * absent here for the same reason it's absent from the English list: it
 * bundles an X-ray-equipment claim and a pricing offer that don't have
 * sign-off (ATS-E4 4.9/4.13). Translating a claim doesn't verify it.
 */
export const esServices: Service[] = [
  {
    slug: "myofascial-release-trigger-point",
    name: "Liberación miofascial / puntos gatillo",
    duration: "1 h",
    summary:
      "El Dr. Abe utiliza una herramienta Graston y presión dirigida para trabajar la tensión muscular y la movilidad restringida del tejido blando, de forma similar a una técnica de masaje profundo enfocado.",
    image: {
      src: "/figma-exports/drabe-releasetool.png",
      alt: "Liberación miofascial y terapia de puntos gatillo con una herramienta Graston",
    },
  },
  {
    slug: "cupping-therapy",
    name: "Terapia de ventosas",
    duration: "1 h",
    summary:
      "La terapia de ventosas aplica succión localizada en zonas seleccionadas de tensión muscular y puede incluirse cuando corresponde para molestias de cuello, espalda u otros tejidos blandos.",
    image: {
      src: "/figma-exports/cupping-drabe.png",
      alt: "Sesión de terapia de ventosas",
    },
  },
  {
    slug: "adjustment",
    name: "Ajuste quiropráctico",
    duration: "1 h",
    summary:
      "Los ajustes quiroprácticos aplican presión controlada para mejorar el movimiento de articulaciones seleccionadas del cuello, la espalda media o la espalda baja, después de una evaluación adecuada.",
    image: {
      src: "/figma-exports/drabeadjust.png",
      alt: "El Dr. Abe realizando un ajuste quiropráctico",
    },
  },
  {
    slug: "traction-decompression",
    name: "Tracción / descompresión",
    duration: "1 h",
    summary:
      "La tracción y la descompresión espinal aplican una tracción controlada para molestias seleccionadas de cuello o espalda baja. Los parámetros se definen según la evaluación y se ajustan a cada paciente.",
    image: {
      src: "/figma-exports/drabe-traction_compression.png",
      alt: "Terapia de tracción y descompresión espinal",
    },
  },
  {
    slug: "car-accidents",
    name: "Accidentes de auto",
    duration: "1 h",
    summary:
      "Después de un accidente de auto, solicite una evaluación quiropráctica por dolor de cuello, dolor de espalda, rigidez, síntomas de latigazo cervical y otras molestias musculoesqueléticas.",
    image: {
      src: "/figma-exports/drabe-consult.png",
      alt: "Consulta con el Dr. Abe después de un accidente de auto",
    },
  },
];

/** Spanish rendering of content/accident-injuries.ts. Same six entries,
 * same images, same slugs. The summaries describe what the injury is and
 * what care addresses — they never state an outcome. */
export const esAccidentInjuries: ServiceCardItem[] = [
  {
    slug: "whiplash",
    name: "Latigazo cervical",
    duration: "",
    summary: "Distensión del cuello, rigidez y menor rango de movimiento por un impacto repentino.",
    image: {
      src: "/figma-exports/drabe-whiplash.png",
      alt: "Tratamiento del latigazo cervical",
    },
  },
  {
    slug: "lower-back-pain",
    name: "Dolor de espalda baja",
    duration: "",
    summary:
      "Trabajo sobre la alineación para atender la compresión de la columna lumbar y los espasmos musculares que dejan las colisiones por alcance.",
    image: {
      src: "/figma-exports/drabe-backpain.png",
      alt: "Tratamiento del dolor de espalda baja",
    },
  },
  {
    slug: "herniated-disc",
    name: "Hernia de disco",
    duration: "",
    summary:
      "Técnicas de descompresión para aliviar la presión sobre los nervios causada por el desplazamiento de un disco.",
    image: {
      src: "/figma-exports/drabe-herniated%20disc.png",
      alt: "Tratamiento de la hernia de disco",
    },
  },
  {
    slug: "shoulder-extremity",
    name: "Hombro y extremidades",
    duration: "",
    summary:
      "Atención para el trauma de hombro por el cinturón de seguridad y para lesiones articulares en brazos y piernas.",
    image: {
      src: "/figma-exports/drabe-shoulder.png",
      alt: "Tratamiento de hombro y extremidades",
    },
  },
  {
    slug: "headaches",
    name: "Dolores de cabeza",
    duration: "",
    summary:
      "Ajustes de la región cervical alta para aliviar los dolores de cabeza y la tensión que aparecen después de un traumatismo.",
    image: {
      src: "/figma-exports/drabe-headache.png",
      alt: "Tratamiento de dolores de cabeza",
    },
  },
  {
    slug: "soft-tissue",
    name: "Tejidos blandos",
    duration: "",
    summary:
      "Liberación miofascial para contusiones musculares profundas y distensiones de ligamentos en cualquier parte del cuerpo.",
    image: {
      src: "/figma-exports/drabe-soft-tissue.png",
      alt: "Tratamiento de tejidos blandos",
    },
  },
];

/** Spanish rendering of content/why-choose.ts.
 *
 * The rating reuses the same already-verified figure the English version
 * reuses — it is not a second, independently-asserted claim. The heading
 * keeps the brand name untranslated ("Align the Spine Chiropractic" is the
 * business's legal name and its search entity; translating it would break
 * NAP consistency across languages). */
export const esWhyChooseContent: WhyChooseContent = {
  headingLines: ["Por qué elegir", "Align the Spine", "Chiropractic"],
  body: "Desde el dolor de espalda cotidiano y las lesiones deportivas hasta la recuperación después de un accidente, Align the Spine nació de una idea: la buena atención quiropráctica debería estar al alcance de todos. Precios claros, explicados sin rodeos. Y un doctor que lo conoce por su nombre — porque en Align the Spine siempre lo atiende el Dr. Abe, en español o en inglés.",
  cta: { label: "Solicitar una cita", href: "/es/solicitar-cita" },
  rating: verified<DoctorRating>(
    { value: 5, count: 152, location: "Deerfield Beach, Florida" },
    "Matches the already-verified review count in siteConfig.stats",
    "2026-08-12",
  ),
  image: {
    src: "/figma-exports/interior-table.png",
    alt: "Sala de tratamiento de Align the Spine",
  },
};

/** Contact/location strings the shared LocationIntro, LocationFooter and
 * ContactSection render in Spanish. The address, suite, phone number and
 * business name are never translated or reformatted — they're the
 * practice's NAP, and they must be byte-identical across both languages so
 * local search sees one business, not two.
 *
 * `introBody` states the address and nothing else. Parking, entrance,
 * accessibility and wait-room details would all be genuinely useful local
 * information (§Local information value in the report) — but none of them
 * are recorded anywhere in this repo, and inventing them for a Spanish
 * page would be inventing them for the practice. They're listed as a
 * client question in the report's "Remaining work" instead. */
export const esLocationCopy = {
  introEyebrow: "Visítenos",
  introHeading: "Estamos en Deerfield Beach",
  introBody: `Nuestro consultorio está en ${siteConfig.business.address.line1}, ${siteConfig.business.address.suite}, Deerfield Beach, FL ${siteConfig.business.address.zip}. Llame al ${siteConfig.business.phone} si necesita indicaciones para llegar.`,
  addressLabel: "Dirección",
  phoneLabel: "Teléfono",
  emailLabel: "Correo electrónico",
  hoursLabel: "Horario de atención",
  directionsLabel: "Cómo llegar",
  sendLabel: "Enviar",
  todayLabel: "Hoy",
  mapTitle: "Mapa de la ubicación de Align the Spine en Deerfield Beach",
};

/** Spanish rendering of content/spine-overview.ts's static home-page spine
 * diagram. `id`, `position` and `labelSide` are layout data, not copy, and
 * are unchanged — only `name`/`description` and the alt text are Spanish.
 * The region names keep the clinical Latin term with the plain-language
 * gloss in parentheses, the same shape the English uses ("Cervical (Neck)"),
 * because "cervical"/"lumbar" are the words a Spanish-speaking patient will
 * also have heard from a doctor. */
export const esSpineOverviewContent: SpineOverviewContent = {
  eyebrow: "Entender la columna",
  heading: "Su columna lo controla todo",
  image: {
    src: "/figma-exports/spine-straight-poster.jpg",
    alt: "Una columna que pasa de una postura encorvada a una postura erguida y alineada",
  },
  video: "https://align-the-spine.b-cdn.net/images/spine-straight.mp4",
  videoPoster: "/figma-exports/spine-hunched-poster.jpg",
  segments: [
    {
      id: "cervical",
      name: "Cervical (cuello)",
      description:
        "Dolores de cabeza, rigidez de cuello y tensión en los hombros: la mayoría empieza aquí.",
      position: { x: 52, y: 22 },
      labelSide: "left",
    },
    {
      id: "thoracic",
      name: "Torácica (espalda media)",
      description: "La fuente de dolor más común. Soporta la mayor parte del peso del cuerpo.",
      position: { x: 52, y: 44 },
      labelSide: "right",
    },
    {
      id: "lumbar",
      name: "Lumbar (espalda baja)",
      description:
        "La mala postura, el trabajo de escritorio y el estrés comprimen esta zona todos los días.",
      position: { x: 52, y: 61 },
      labelSide: "left",
    },
    {
      id: "sacral",
      name: "Sacra (base)",
      description:
        "El dolor de cadera, la ciática y las molestias nerviosas suelen tener su origen en esta zona.",
      position: { x: 52, y: 76 },
      labelSide: "right",
    },
  ],
};
