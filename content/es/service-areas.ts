import { serviceAreas } from "@/content/service-areas";

/** Spanish copy for /es/areas-de-servicio — the counterpart of the English
 * /service-areas hub.
 *
 * WHAT THIS FILE DELIBERATELY IS NOT: a Spanish version of the nineteen
 * /service-areas/[slug] city pages. There is one Spanish coverage page, not
 * nineteen Spanish city pages, and that is a decision rather than an
 * omission.
 *
 * The nineteen English city pages are near-duplicates of one another.
 * Measured on their visible prose (every `text`/`answer`/`question`/
 * `excerpt`/`directAnswer` string in content/service-areas.ts, whitespace
 * normalized, difflib ratio over all 171 pairs): mean 88.3% similar, max
 * 96.7% (margate vs tamarac), min 81.9%. Every one of the 171 pairs sits
 * above 80%. Per page, only 0.6%-5.1% of distinct tokens appear on no other
 * page — the city name, its county, a couple of road names and crash
 * counts. Everything else is one template.
 *
 * Each entry's `serviceArea.similarityScore` says 22, and
 * lib/content/publication-gates.ts rejects anything above 40 — but that
 * number is a hand-entered constant, identical on all nineteen entries, not
 * a measurement. The gate is passing on an assertion the prose contradicts.
 * That is an English-side finding, reported and not silently "fixed" here:
 * rewriting or deindexing nineteen live, indexed pages is the practice's
 * call, not a side effect of adding Spanish.
 *
 * Translating that template nineteen times would take a duplicate-content
 * problem and run it again in a second language — the exact "thin
 * near-duplicate city pages" pattern content/seo.ts's own /service-areas
 * justification forbids ("individual /service-areas/[slug] pages must stay
 * genuinely differentiated, not templated city swaps"), and the doorway
 * pattern the Spanish SEO brief rules out. Nineteen Spanish pages competing
 * for "quiropráctico en [ciudad]" would also cannibalize each other, since
 * nothing would distinguish them beyond the city noun.
 *
 * So: one honest page. It says where the office actually is, names every
 * community the practice will consider, explains what "considered" means,
 * and links each city's detailed guide in English rather than pretending a
 * Spanish one exists. If genuinely city-specific Spanish material ever
 * exists for a given city — its own patient-origin evidence, its own local
 * sources — that city earns its own Spanish page then, on evidence, one at
 * a time.
 *
 * The community list below is derived from `serviceAreas` rather than
 * retyped, so a city added or removed on the English side can never leave a
 * stale name on the Spanish page.
 */

/** County names as South Florida Spanish actually writes them. The county
 * itself is a proper noun and stays in English ("Broward", not "Bróward"). */
const COUNTY_ES: Record<string, string> = {
  Broward: "Condado de Broward",
  "Palm Beach": "Condado de Palm Beach",
  "Miami-Dade": "Condado de Miami-Dade",
};

export interface EsServiceAreaGroup {
  county: string;
  countyEs: string;
  communities: { name: string; href: string }[];
}

/** The 19 communities grouped by county, in the order counties first appear
 * in content/service-areas.ts, communities alphabetical within each. */
export const esServiceAreaGroups: EsServiceAreaGroup[] = (() => {
  const groups = new Map<string, EsServiceAreaGroup>();
  for (const entry of serviceAreas) {
    const evidence = entry.serviceArea;
    if (!evidence) continue;
    const { county } = evidence;
    const countyEs = COUNTY_ES[county];
    if (!countyEs) {
      throw new Error(
        `content/es/service-areas.ts: no Spanish name registered for county "${county}"`,
      );
    }
    let group = groups.get(county);
    if (!group) {
      group = { county, countyEs, communities: [] };
      groups.set(county, group);
    }
    group.communities.push({
      name: evidence.communityName,
      href: `/service-areas/${entry.slug}`,
    });
  }
  for (const group of groups.values()) {
    group.communities.sort((a, b) => a.name.localeCompare(b.name, "es"));
  }
  return [...groups.values()];
})();

export const esServiceAreasCopy = {
  breadcrumb: "Áreas de servicio",
  hero: {
    eyebrow: "Un solo consultorio verificado",
    /** Mirrors the English H1's actual claim — one office, areas explained
     * — instead of the "quiropráctico en [ciudad]" phrasing a city landing
     * page would use. This page is not competing for city queries; it is
     * the honest answer to "¿hasta dónde llegan?". */
    title: "Un consultorio en Deerfield Beach. Áreas de servicio explicadas con claridad.",
    addressLead: "Align the Spine Chiropractic tiene un solo consultorio en",
    addressTail:
      ". Un paciente puede venir a ese consultorio desde una comunidad cercana que atendemos. En circunstancias limitadas relacionadas con un accidente de auto y cobertura PIP, también puede preguntar si una visita a domicilio corresponde a su caso y a su ubicación.",
    callPrefix: "Llamar al",
    requestCta: "Solicitar una cita",
  },
  verification: {
    heading: "Cómo verificamos la relación con cada comunidad",
    cards: [
      {
        eyebrow: "Ciudad del consultorio",
        heading: "Deerfield Beach",
        body: "Es la única ubicación física del consultorio. El horario y la disponibilidad actuales deben confirmarse directamente, porque las fuentes públicas no coinciden entre sí.",
      },
      {
        eyebrow: "Comunidades cercanas",
        heading: "Primero la evidencia",
        body: "Una comunidad aparece en esta lista solo cuando la operación del consultorio, el origen real de los pacientes, un acceso realista y una utilidad local concreta lo respaldan. Un nombre de ciudad escrito en el código no es evidencia.",
      },
      {
        eyebrow: "Casos de accidente elegibles",
        heading: "Caso y ubicación confirmados",
        body: "Las visitas a domicilio no son un servicio de quiropráctica móvil abierto a todos. La elegibilidad, la distancia, los tiempos, el manejo del seguro y la disponibilidad se confirman en cada situación.",
      },
    ],
  },
  communities: {
    heading: "Comunidades que atendemos",
    /** The one place this page tells the reader something the English hub
     * doesn't have to: the detailed per-city guide is in English. Saying so
     * plainly beats a Spanish link that lands on English without warning. */
    intro:
      "Estas son las comunidades para las que el consultorio considera atención relacionada con accidentes de auto, además del consultorio en Deerfield Beach. Aparecer en esta lista no garantiza una visita a domicilio: significa que vale la pena preguntar.",
    englishNote:
      "La guía detallada de cada ciudad está disponible por ahora solo en inglés. Para hablar en español sobre su caso, llame al consultorio o envíe una solicitud desde esta página.",
    guideLabel: "Ver la guía de esta ciudad (en inglés)",
  },
  eligibility: {
    heading: "Cómo se confirma la elegibilidad",
    steps: [
      "Llame o envíe una solicitud de cita, sin incluir detalles médicos delicados.",
      "El consultorio confirma si corresponde una visita al consultorio o si su caso permite considerar una visita a domicilio relacionada con el accidente.",
      "La disponibilidad, la ubicación, los costos y el manejo del seguro se confirman directamente con usted; esta página no promete ninguno de ellos.",
    ],
  },
  office: {
    eyebrow: "Consultorio",
    directionsCta: "Cómo llegar",
  },
} as const;
