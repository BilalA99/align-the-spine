import type { ConditionRelatedLink } from "@/content/conditions/types";
import { esRoutes } from "@/content/es/seo";
import { isPublished } from "@/content/seo";

/** Spanish counterpart of content/related-links.ts — the "related content"
 * pill rows at the bottom of the Spanish service and condition pages.
 *
 * Same contract as the English version: labels are keyed by the exact
 * Spanish route path, so a label can never point somewhere other than what
 * it says, and a draft route is dropped from the row rather than linked.
 * Every key must be a real path in content/es/seo.ts —
 * buildEsRelatedLinks() throws otherwise, so a typo fails the build instead
 * of rendering a dead pill.
 */
const ES_RELATED_LINK_LABELS: Record<string, string> = {
  "/es/servicios": "Ver todos los servicios",
  "/es/servicios/ajustes-quiropracticos": "Ajustes quiroprácticos",
  "/es/servicios/descompresion-espinal": "Descompresión espinal",
  "/es/servicios/terapia-de-tejidos-blandos": "Terapia de tejidos blandos",
  "/es/servicios/terapia-de-ventosas": "Terapia de ventosas",
  "/es/quiropractico-accidentes-de-auto": "Atención tras un accidente",
  "/es/dr-abe-nasser": "Sobre el Dr. Abe",
  "/es/resenas": "Reseñas de pacientes",
  "/es/contacto": "Contacto",
  "/es/solicitar-cita": "Solicitar una cita",
};

export interface BuildEsRelatedLinksOptions {
  /** Path of the page rendering these links — excluded so a page never
   * links to itself in its own "related" row. */
  currentPath: string;
  /** Spanish route paths to include, in render order. A path whose route is
   * still `status: "draft"` is silently dropped rather than linked: the row
   * just gets shorter, not wrong. */
  paths: string[];
  /** Path rendered as the highlighted (solid) pill — the next-step CTA. */
  highlightPath?: string;
}

export function buildEsRelatedLinks({
  currentPath,
  paths,
  highlightPath,
}: BuildEsRelatedLinksOptions): ConditionRelatedLink[] {
  const links: ConditionRelatedLink[] = [];
  for (const path of paths) {
    if (path === currentPath) continue;
    const route = esRoutes.find((entry) => entry.path === path);
    if (!route) {
      throw new Error(`content/es/related-links.ts: no Spanish route registered for "${path}"`);
    }
    if (!isPublished(route)) continue;
    const label = ES_RELATED_LINK_LABELS[path];
    if (!label) {
      throw new Error(`content/es/related-links.ts: no label registered for path "${path}"`);
    }
    links.push({ label, href: route.path, highlighted: path === highlightPath });
  }
  return links;
}
