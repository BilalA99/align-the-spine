import type { RouteMeta } from "@/content/seo";
import { siteConfig } from "@/content/site";

/** Spanish route registry — the `/es` mirror of content/seo.ts.
 *
 * Same `RouteMeta` shape and the same rules: app/sitemap.ts maps over it,
 * and each Spanish page's `metadata` export pulls its entry by path via
 * getEsRoute() instead of re-declaring title/description, so the two can't
 * drift. content/i18n.test.ts asserts every path here is registered as the
 * `es` half of a pair in content/i18n.ts (and vice versa), so a Spanish
 * page can't ship with a canonical but no hreflang partner.
 *
 * Titles use `siteConfig.business.shortName`, matching ATS-SEO-021's fix on
 * the English side — the full "Align the Spine Chiropractic" suffix pushed
 * titles past Google's ~60-character truncation point before the
 * page-specific part was even counted. That matters more here, not less:
 * Spanish renders longer than English for the same meaning
 * ("Quiropráctico para Accidentes de Auto" vs "Car Accident Chiropractor").
 *
 * `primaryQuery`/`justification` follow IA-01. Every Spanish entry names a
 * Spanish-language query, which is why none of them collide with the
 * English registry's values under seo.test.ts's "no two indexable routes
 * target the same primary query" rule: a Spanish page and its English
 * counterpart are not competing for one query, they're each owning their
 * own language's version of it, joined by hreflang rather than left to
 * fight. That is the whole point of the locale split, and it's why these
 * pages are not cannibalization.
 *
 * Titles and descriptions are written against Spanish query intent, not
 * translated from the English registry. Two things drove the wording:
 *
 *  1. "Quiropráctico" is the head term for both the practitioner and the
 *     care in Spanish-language local search, and it's what the geo modifier
 *     attaches to ("quiropráctico en Deerfield Beach"), so it leads the
 *     title rather than sitting mid-string where the English version has
 *     "Chiropractor".
 *  2. South Florida Spanish uses "carro" at least as readily as "auto" for
 *     accident queries. Titles use "auto" (the form that also reads
 *     naturally in a formal healthcare context), and the page body covers
 *     "carro" and "choque" in prose — one page serving the cluster, rather
 *     than near-duplicate pages per variant. See §Keyword cannibalization
 *     in SPANISH_SEO_IMPLEMENTATION_REPORT.md.
 *
 * SEARCH-VOLUME UNVERIFIED: no Search Console, Keyword Planner, or Ahrefs
 * data for this property's Spanish queries was available at implementation
 * time, so these are intent-based groupings, not volume-ranked targets. The
 * report lists how to confirm them once /es has impressions.
 */
export const esRoutes: RouteMeta[] = [
  {
    path: "/es",
    title: `Quiropráctico en Deerfield Beach, FL | ${siteConfig.business.shortName}`,
    description:
      "Atención quiropráctica en Deerfield Beach para dolor de espalda, dolor de cuello y movilidad, con evaluaciones enfocadas después de un accidente de auto.",
    image: {
      src: "/figma-exports/interior-reception.png",
      alt: "Área de recepción de Align the Spine en Deerfield Beach",
    },
    changeFrequency: "weekly",
    priority: 1,
    lastModified: "2026-08-26",
    primaryQuery: "Spanish-language Deerfield Beach general chiropractic intent",
    justification:
      "Owns broad 'quiropráctico Deerfield Beach' intent for Spanish searchers. Does not compete with the English home page — the two are hreflang alternates of one another, each serving a different language's version of the same intent.",
  },
  {
    path: "/es/quiropractico-accidentes-de-auto",
    title: `Quiropráctico para Accidentes de Auto | Deerfield Beach, FL | ${siteConfig.business.shortName}`,
    description:
      "Evaluación quiropráctica después de un accidente de auto en Deerfield Beach: dolor de cuello, dolor de espalda y latigazo cervical. Ley PIP: 14 días para iniciar atención.",
    image: {
      src: "/figma-exports/interior-corridor.png",
      alt: "Pasillo de recepción de Align the Spine en Deerfield Beach",
    },
    changeFrequency: "monthly",
    priority: 0.9,
    lastModified: "2026-08-26",
    primaryQuery: "Spanish-language car-accident chiropractic intent",
    justification:
      "Owns the whole Spanish accident cluster ('accidente de auto', 'accidente de carro', 'choque') on one URL rather than one page per synonym, and carries the PIP timing explainer. hreflang alternate of /car-accident-chiropractor.",
  },
  {
    path: "/es/servicios",
    title: `Servicios Quiroprácticos en Deerfield Beach, FL | ${siteConfig.business.shortName}`,
    description:
      "Servicios quiroprácticos en Deerfield Beach: ajustes, descompresión espinal y terapia de tejidos blandos con el Dr. Abe Nasser. Consulte qué opción corresponde a su caso.",
    image: {
      src: "/figma-exports/dr-abe-neck.png",
      alt: "El Dr. Abe Nasser evaluando el cuello de un paciente",
    },
    changeFrequency: "monthly",
    priority: 0.9,
    lastModified: "2026-08-26",
    primaryQuery: "Spanish-language general-care services hub",
    justification:
      "Owns 'servicios quiroprácticos Deerfield Beach' hub intent in Spanish. Individual service pages are English-only and draft today, so nothing under it competes with it.",
  },
  // ── Service pages ────────────────────────────────────────────────────
  // All four are `status: "draft"`, mirroring their English originals:
  // they carry clinical guidance that hasn't had a clinician's sign-off,
  // so they're served noindex and kept out of the sitemap while remaining
  // reachable (and linkable from the Spanish nav) by direct URL.
  {
    path: "/es/servicios/ajustes-quiropracticos",
    title: `Ajustes Quiroprácticos en Deerfield Beach, FL | ${siteConfig.business.shortName}`,
    description:
      "Ajustes quiroprácticos en Deerfield Beach: presión controlada para mejorar el movimiento articular del cuello, la espalda media o la espalda baja, tras una evaluación.",
    image: {
      src: "/figma-exports/adjustments-hero.png",
      alt: "Sala de tratamiento preparada para un ajuste quiropráctico",
    },
    changeFrequency: "monthly",
    priority: 0.7,
    lastModified: "2026-08-26",
    status: "draft",
    primaryQuery: "Spanish-language chiropractic adjustment treatment intent",
    justification:
      "Owns 'ajuste quiropráctico Deerfield Beach' treatment intent in Spanish. Draft until the English original clears clinician review; hreflang alternate of /services/chiropractic-adjustments.",
  },
  {
    path: "/es/servicios/descompresion-espinal",
    title: `Descompresión Espinal en Deerfield Beach, FL | ${siteConfig.business.shortName}`,
    description:
      "Descompresión espinal no quirúrgica en Deerfield Beach: tracción controlada para reducir la presión sobre discos y articulaciones, cuando la evaluación lo indica.",
    image: {
      src: "/figma-exports/spinal-decompression-hero.png",
      alt: "Sala de tratamiento preparada para terapia de descompresión espinal",
    },
    changeFrequency: "monthly",
    priority: 0.7,
    lastModified: "2026-08-26",
    status: "draft",
    primaryQuery: "Spanish-language spinal decompression treatment intent",
    justification:
      "Owns 'descompresión espinal Deerfield Beach' intent in Spanish, distinct from the adjustment page's. Draft until the English original clears clinician review.",
  },
  {
    path: "/es/servicios/terapia-de-tejidos-blandos",
    title: `Masaje y Terapia de Tejidos Blandos | Deerfield Beach, FL | ${siteConfig.business.shortName}`,
    description:
      "Terapia de tejidos blandos en Deerfield Beach: liberación miofascial, técnica Graston y tejido profundo para tensión muscular y dolor posterior a una lesión.",
    image: {
      src: "/figma-exports/massage-soft-tissue-hero.png",
      alt: "Sala de tratamiento de masaje y terapia de tejidos blandos",
    },
    changeFrequency: "monthly",
    priority: 0.7,
    lastModified: "2026-08-26",
    status: "draft",
    primaryQuery: "Spanish-language soft-tissue therapy treatment intent",
    justification:
      "Owns 'terapia de tejidos blandos / masaje quiropráctico' intent in Spanish. Draft until the English original clears clinician review.",
  },
  {
    path: "/es/servicios/terapia-de-ventosas",
    title: `Terapia de Ventosas en Deerfield Beach, FL | ${siteConfig.business.shortName}`,
    description:
      "Terapia de ventosas en Deerfield Beach: succión localizada en zonas seleccionadas de tensión muscular, usada cuando corresponde junto con una evaluación quiropráctica.",
    image: { src: "/figma-exports/cupping-drabe.png", alt: "Sesión de terapia de ventosas" },
    changeFrequency: "monthly",
    priority: 0.6,
    lastModified: "2026-08-26",
    status: "draft",
    primaryQuery: "Spanish-language cupping therapy treatment intent",
    justification:
      "Owns 'terapia de ventosas Deerfield Beach' intent in Spanish — a single technique, distinct from the broader soft-tissue page. Draft until the English original clears clinician review.",
  },
  {
    path: "/es/dr-abe-nasser",
    title: `Dr. Abe Nasser, D.C. | Quiropráctico en Deerfield Beach`,
    description:
      "Conozca al Dr. Abe Nasser, el quiropráctico de Align the Spine en Deerfield Beach, su forma de evaluar a cada paciente y cómo se comunica en español e inglés.",
    image: {
      src: "/figma-exports/dr-abe-neck.png",
      alt: "El Dr. Abe Nasser evaluando el cuello de un paciente",
    },
    changeFrequency: "monthly",
    priority: 0.7,
    lastModified: "2026-08-26",
    primaryQuery: "Spanish-language practitioner/entity intent for Dr. Abe Nasser",
    justification:
      "Owns branded and 'quiropráctico que habla español' intent. Emits the same Person @id as /about, so both languages describe one doctor rather than two entities.",
  },
  {
    path: "/es/resenas",
    title: `Reseñas de Pacientes | ${siteConfig.business.shortName}`,
    description:
      "Reseñas verificadas de pacientes de Align the Spine Chiropractic en Deerfield Beach, FL, publicadas en el idioma en que las escribió cada paciente.",
    changeFrequency: "monthly",
    priority: 0.6,
    lastModified: "2026-08-26",
    primaryQuery: "Spanish-language reviews/social-proof intent",
    justification:
      "Owns 'reseñas quiropráctico Deerfield Beach' validation intent. Publishes reviews verbatim rather than translated, and says so on the page.",
  },
  {
    path: "/es/contacto",
    title: `Contacto | Deerfield Beach, FL | ${siteConfig.business.shortName}`,
    description:
      "Comuníquese con Align the Spine Chiropractic en 811 SE 8th Ave, Ste 101, Deerfield Beach, FL. Llame o envíe el formulario para preguntar por una cita.",
    changeFrequency: "monthly",
    priority: 0.6,
    lastModified: "2026-08-26",
    primaryQuery: "Spanish-language navigational contact/location intent",
    justification:
      "Owns address/phone/hours lookups in Spanish, and is the page whose visible content the LocalBusiness structured data actually matches.",
  },
  {
    path: "/es/solicitar-cita",
    title: `Solicitar una Cita Quiropráctica | Deerfield Beach, FL | ${siteConfig.business.shortName}`,
    description:
      "Solicite una cita con el Dr. Abe en Deerfield Beach. Envíe sus datos y le devolvemos la llamada para confirmar el horario; no es una reserva automática.",
    image: {
      src: "/figma-exports/phone-mockup.png",
      alt: "Paciente llamando a Align the Spine para solicitar una cita",
    },
    changeFrequency: "monthly",
    priority: 0.9,
    lastModified: "2026-08-26",
    primaryQuery: "Spanish-language appointment-request conversion action",
    justification:
      "Owns the Spanish booking-form action itself, not a topical query — the CTA target every Spanish page links to, so it can't cannibalize anything.",
  },
];

/** Spanish counterpart of content/seo.ts's getRoute() — throws on an
 * unregistered path so a Spanish page that forgets to register itself
 * fails the build instead of shipping without a canonical. */
export function getEsRoute(path: string): RouteMeta {
  const route = esRoutes.find((entry) => entry.path === path);
  if (!route) throw new Error(`content/es/seo.ts: no route registered for path "${path}"`);
  return route;
}
