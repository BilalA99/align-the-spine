import type { Metadata } from "next";

import { AnalyticsListeners } from "@/components/analytics/analytics-listeners";
import { AnalyticsScripts } from "@/components/analytics/analytics-scripts";
import { GtmScript } from "@/components/analytics/gtm-scripts";
import { TurnstileScript } from "@/components/analytics/turnstile-script";
import { RootShell } from "@/components/layout/root-shell";
import { HTML_LANG, OG_LOCALE } from "@/content/i18n";
import { isProduction, siteConfig } from "@/content/site";

import { fontVariables } from "../fonts";

import "../globals.css";

/** Spanish root layout — see app/(en)/layout.tsx for why there is one root
 * layout per locale rather than one shared layout.
 *
 * The only structural difference from the English layout is `lang`
 * (es-US) and the Spanish defaults below. Everything else — analytics,
 * fonts, shell — is the same code path, so Spanish pages can't drift into
 * a separate, half-instrumented version of the site. RootShell renders the
 * Spanish navigation and footer off the `locale` prop.
 *
 * `title.default`/`description` here are fallbacks only: every Spanish page
 * sets its own via lib/seo/metadata.ts's buildEsRouteMetadata(), which
 * emits `{ absolute }` titles. They exist so that a future Spanish route
 * that forgets to export metadata still describes itself in Spanish rather
 * than inheriting English copy under an /es URL.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: `${siteConfig.business.name} | Quiropráctico en Deerfield Beach`,
    template: `%s | ${siteConfig.business.name}`,
  },
  description: `Atención quiropráctica en Deerfield Beach, FL — evaluaciones después de un accidente de auto y visitas a domicilio cuando corresponde. Llame al ${siteConfig.business.phone}.`,
  openGraph: {
    siteName: siteConfig.business.name,
    type: "website",
    locale: OG_LOCALE.es,
    images: [
      {
        url: "/figma-exports/interior-reception.png",
        alt: "Área de recepción de Align the Spine",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/figma-exports/interior-reception.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  robots: isProduction() ? { index: true, follow: true } : { index: false, follow: false },
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export default function EsRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={HTML_LANG.es} className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <GtmScript />
        <AnalyticsScripts />
        <AnalyticsListeners />
        <TurnstileScript />
        <RootShell locale="es">{children}</RootShell>
      </body>
    </html>
  );
}
