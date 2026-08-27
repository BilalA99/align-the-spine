import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { esThankYouPage } from "@/content/es/pages";
import { siteConfig } from "@/content/site";
import { buildMetadata } from "@/lib/seo/metadata";

/** Spanish post-conversion page — the /es counterpart of /thank-you.
 *
 * Noindex and absent from both route registries, exactly like /thank-you:
 * it exists so a Spanish visitor who submits a form doesn't get bounced
 * into an English confirmation at the last step of the funnel, not to rank
 * for anything. app/robots.ts disallows /thank-you; this page carries the
 * same noindex via metadata (robots.txt is updated alongside it).
 *
 * Deliberately not paired in content/i18n.ts, so no hreflang annotation is
 * emitted for it — annotating a noindex page as the alternate of another
 * noindex page is pure noise. content/route-registry-parity.test.ts
 * allowlists it for the same reason it allowlists /thank-you.
 */
export const metadata: Metadata = buildMetadata({
  title: `Gracias | ${siteConfig.business.name}`,
  description: "Recibimos su solicitud. Le devolveremos la llamada para confirmar su cita.",
  path: "/es/gracias",
  robots: { index: false, follow: false },
  locale: "es",
});

export default function EsThankYouPage() {
  return (
    <Section spacing="lg" className="container pt-40 md:pt-48">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
        <h1 className="font-display text-display text-navy-900">{esThankYouPage.h1}</h1>

        <p className="font-sans text-body-lg text-ink-500">{esThankYouPage.body}</p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button href={siteConfig.business.phoneHref} variant="teal">
            Llamar al {siteConfig.business.phone}
          </Button>
          <Button href="/es" variant="primary">
            {esThankYouPage.homeCta}
          </Button>
        </div>
      </div>
    </Section>
  );
}
