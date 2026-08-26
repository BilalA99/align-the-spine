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

/** English root layout.
 *
 * This app has one root layout per locale, each rendering its own <html>
 * with the right `lang` (app/(es)/layout.tsx is the Spanish one). Next only
 * allows <html>/<body> in a root layout, and `lang` has to be correct in
 * the server-rendered response — reading the pathname in a shared layout
 * would force every page dynamic, and patching the attribute after
 * hydration would leave the served HTML wrong for both Googlebot and any
 * screen reader that reads the document before JS runs. Route groups give
 * each locale a real root layout at no URL cost: `(en)` and `(es)` are not
 * path segments, so every English URL below is byte-identical to what it
 * was before this restructure.
 *
 * The tradeoff is that crossing between the two groups is a full document
 * load rather than a client-side transition. That only happens on an
 * explicit language switch, where a fresh document is the correct
 * behaviour anyway.
 *
 * Site-wide metadata scaffolding (P0A SEO foundation) is otherwise
 * unchanged: every route sets its own title/description/OG/Twitter/robots
 * via lib/seo/metadata.ts's buildMetadata(), which wraps `title` in
 * `{ absolute }` — so `title.template` below only ever applies to a route
 * that doesn't call buildMetadata (none currently do). `robots` mirrors
 * buildMetadata's own isProduction() gate so a route can't ship indexable
 * in a nonproduction deploy by omission.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: `${siteConfig.business.name} | South Florida's Chiropractor`,
    template: `%s | ${siteConfig.business.name}`,
  },
  description: `Spinal health care in Deerfield Beach, FL — car accident evaluations and home visits when it fits your case. Call ${siteConfig.business.phone}.`,
  openGraph: {
    siteName: siteConfig.business.name,
    type: "website",
    locale: OG_LOCALE.en,
    images: [
      { url: "/figma-exports/interior-reception.png", alt: "Align the Spine reception area" },
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

export default function EnRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={HTML_LANG.en} className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <GtmScript />
        <AnalyticsScripts />
        <AnalyticsListeners />
        <TurnstileScript />
        <RootShell locale="en">{children}</RootShell>
      </body>
    </html>
  );
}
