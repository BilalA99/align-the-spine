import type { ConditionRelatedLink } from "@/content/conditions/types";
import { getRoute, isPublished } from "@/content/seo";

/** ATS-SEO-043: single source of truth for every "related content" pill
 * label, keyed by the exact route path — the same path is used to resolve
 * both the label (below) and the href (via getRouteHref), so a label can
 * never point at a different destination than what it says, and a route
 * rename only needs updating in one place. Every entry here must be a real
 * path registered in content/seo.ts (buildRelatedLinks throws otherwise —
 * see its own doc comment). */
const RELATED_LINK_LABELS: Record<string, string> = {
  "/conditions": "All Conditions We Treat",
  "/conditions/back-pain": "Lower Back Pain",
  "/conditions/neck-pain": "Neck Pain",
  "/conditions/sciatica": "Sciatica",
  "/conditions/whiplash": "Whiplash",
  "/conditions/cervicogenic-headache": "Cervicogenic Headache",
  "/conditions/concussion": "Concussion",
  "/conditions/tmj-jaw-pain": "TMJ / Jaw Pain",
  "/services": "View All Services",
  "/services/chiropractic-adjustments": "Chiropractic Adjustments",
  "/services/spinal-decompression": "Spinal Decompression",
  "/services/soft-tissue-therapy": "Soft Tissue Therapy",
  "/services/cupping-therapy": "Cupping Therapy",
  "/car-accident-chiropractor": "Car Accident Care",
  "/home-visit-chiropractor": "Home Visit Care",
  "/blog": "Patient Resources",
  "/book-an-appointment": "Request an Appointment",
};

export interface BuildRelatedLinksOptions {
  /** Path of the page rendering these links — excluded from the result so
   * a page never links to itself in its own "related" row. */
  currentPath: string;
  /** Route paths to include, in the order they should render. A path whose
   * route is still `status: "draft"` (getRouteHref returns null) is
   * silently dropped rather than linking to a noindex page — the row just
   * gets shorter, not wrong. */
  paths: string[];
  /** Path to render as the highlighted (solid) pill — the module's
   * "next-step" CTA, e.g. "/book-an-appointment". */
  highlightPath?: string;
}

/** Resolves a page's "related content" pill row from route paths instead of
 * hand-typed label/href pairs — see this file's own doc comment for why
 * that hand-typed pattern had drifted into real bugs (self-links, a label
 * naming one condition while linking to a different one, direct links to
 * draft pages) across several condition/service pages before this ticket. */
export function buildRelatedLinks({
  currentPath,
  paths,
  highlightPath,
}: BuildRelatedLinksOptions): ConditionRelatedLink[] {
  const links: ConditionRelatedLink[] = [];
  for (const path of paths) {
    if (path === currentPath) continue;
    // getRoute() throws for a path that isn't registered in content/seo.ts
    // at all (e.g. a typo) — a real bug, so it fails the build. A
    // registered-but-draft route is a normal, expected state: skip it
    // silently, the row just gets shorter.
    const route = getRoute(path);
    if (!isPublished(route)) continue;
    const label = RELATED_LINK_LABELS[path];
    if (!label) {
      throw new Error(`content/related-links.ts: no label registered for path "${path}"`);
    }
    links.push({ label, href: route.path, highlighted: path === highlightPath });
  }
  return links;
}
