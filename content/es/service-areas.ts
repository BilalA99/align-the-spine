import { serviceAreas } from "@/content/service-areas";

/** Spanish copy for /es/areas-de-servicio — the counterpart of the English
 * /service-areas hub.
 *
 * Each of the nineteen communities now has its own Spanish page under
 * /es/areas-de-servicio/[slug] (content/es/service-areas-cities.ts), so
 * this hub links Spanish-to-Spanish throughout. It previously linked out to
 * the English city guides with an "(en inglés)" label; that is no longer
 * needed and has been removed.
 *
 * The duplicate-content caveat behind those pages has NOT gone away and is
 * documented at SPANISH_SEO_IMPLEMENTATION_REPORT.md §11b: the nineteen
 * ENGLISH city pages average 88.3% textual similarity to one another, and
 * the Spanish set mirrors their structure exactly — one translated template
 * interpolated with each city's verified facts. That was a deliberate
 * choice over nineteen independent translations, so the PIP and
 * home-visit-eligibility claims are provably identical across all of them
 * rather than drifting city by city.
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
      href: `/es/areas-de-servicio/${entry.slug}`,
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
    intro:
      "Estas son las comunidades para las que el consultorio considera atención relacionada con accidentes de auto, además del consultorio en Deerfield Beach. Aparecer en esta lista no garantiza una visita a domicilio: significa que vale la pena preguntar.",
    spanishNote:
      "Cada ciudad tiene su propia página en español con los datos de choques de su condado y las vías donde ocurren. Para hablar en español sobre su caso, llame al consultorio o envíe una solicitud desde esta página.",
    guideLabel: "Ver la guía de esta ciudad",
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
