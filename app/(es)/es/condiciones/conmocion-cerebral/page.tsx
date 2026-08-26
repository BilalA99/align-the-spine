import type { Metadata } from "next";

import { EsConditionPage } from "@/components/sections/es-condition-page";
import { JsonLd } from "@/components/seo/json-ld";
import { esConcussion } from "@/content/es/conditions";
import { getEsRoute } from "@/content/es/seo";
import { HREFLANG } from "@/content/i18n";
import { buildWebPage } from "@/lib/schema";
import { buildEsRouteMetadata } from "@/lib/seo/metadata";

const route = getEsRoute("/es/condiciones/conmocion-cerebral");

export const metadata: Metadata = buildEsRouteMetadata(route);

/** /es/condiciones/conmocion-cerebral — Spanish counterpart of /conditions/concussion.
 *
 * Composed from the shared Spanish condition template
 * (components/sections/es-condition-page.tsx), driven by `esConcussion` in
 * content/es/conditions.ts. See that template's doc comment for why the
 * Spanish condition pages share one component where the English ones are
 * hand-built per Figma frame.
 *
 * `status: "draft"` in content/es/seo.ts, mirroring the English original —
 * noindex and out of the sitemap pending clinician review of the medical
 * content, but reachable and linkable from the Spanish nav.
 */
export default function EsConcussionPage() {
  return (
    <>
      <JsonLd
        data={buildWebPage({
          path: route.path,
          name: route.title,
          description: route.description,
          inLanguage: HREFLANG.es,
        })}
      />
      <EsConditionPage condition={esConcussion} />
    </>
  );
}
