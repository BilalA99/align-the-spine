import type { Metadata } from "next";

import { RootShell } from "@/components/layout/root-shell";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { HTML_LANG } from "@/content/i18n";
import { siteConfig } from "@/content/site";

import { fontVariables } from "./fonts";

import "./globals.css";

/** Global 404 — the handler for URLs that match no route in either locale.
 *
 * Why this file exists: with one root layout per locale (app/(en)/layout.tsx
 * and app/(es)/layout.tsx) there is no single root layout left at app/ for a
 * top-level not-found to compose against, so Next routes unmatched URLs here
 * instead. That's also why it declares its own <html>/<body> and imports
 * globals.css and the fonts directly — it bypasses both layouts.
 *
 * The per-locale not-found files (app/(en)/not-found.tsx,
 * app/(es)/not-found.tsx) still exist and still handle a `notFound()` thrown
 * from inside their own segment; they are simply not what an unmatched URL
 * reaches.
 *
 * It's bilingual by design rather than by detection. This component receives
 * no props, and reading the request path via headers() would opt the whole
 * page into dynamic rendering just to pick a language for a 404 — so instead
 * the page leads in English (the site's hreflang x-default) and offers a
 * Spanish line and a Spanish home link beneath it, marked `lang`/`hrefLang`
 * so a Spanish speaker who mistyped an /es URL isn't stranded on an
 * English-only dead end.
 *
 * Next injects `<meta name="robots" content="noindex">` automatically for
 * anything returning a 404 status; the explicit `robots` below states the
 * same intent rather than relying on that.
 */
export const metadata: Metadata = {
  title: `Page Not Found | ${siteConfig.business.name}`,
  description: "The page you're looking for doesn't exist or may have moved.",
  robots: { index: false, follow: false },
};

export default function GlobalNotFound() {
  return (
    <html lang={HTML_LANG.en} className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <RootShell locale="en">
          <Section spacing="lg" className="container pt-40 md:pt-48">
            <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
              <p
                aria-hidden="true"
                className="font-display text-[clamp(80px,14vw,160px)] leading-none text-navy-900/10"
              >
                404
              </p>

              <h1 className="font-display text-display text-navy-900">Page not found</h1>

              <p className="font-sans text-body-lg text-ink-500">
                The page you&apos;re looking for doesn&apos;t exist or may have moved. Let&apos;s
                get you back on track.
              </p>

              <p lang={HTML_LANG.es} className="font-sans text-body text-ink-500">
                La página que busca no existe o fue movida.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button href="/" variant="primary">
                  Back to Home
                </Button>
                <Button href="/es" variant="ghost" hrefLang={HTML_LANG.es} lang={HTML_LANG.es}>
                  Ir al Inicio
                </Button>
              </div>
            </div>
          </Section>
        </RootShell>
      </body>
    </html>
  );
}
