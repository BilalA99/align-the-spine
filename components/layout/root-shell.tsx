"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { getChromeLabels } from "@/content/chrome";
import { DEFAULT_LOCALE, type Locale } from "@/content/i18n";

import { Footer } from "./footer";
import { Navbar } from "./navbar";
import { TopStatsBar } from "./top-stats-bar";

interface RootShellProps {
  children: ReactNode;
  /** Which language this document is. Set by the locale root layout
   * (app/(en)/layout.tsx or app/(es)/layout.tsx) — the shell never guesses
   * it, so the chrome can't end up in a different language from the page
   * it's wrapping. */
  locale?: Locale;
}

/** Global chrome shell: skip link, TopStatsBar, Navbar, main landmark, and
 * the standard Footer. Mounted once per locale root layout
 * (app/(en)/layout.tsx and app/(es)/layout.tsx). LocationIntro/
 * LocationFooter are page-level sections now (Home/Services/About/Book each
 * import and place them directly — see app/(en)/page.tsx), not part of this
 * shell. */
export function RootShell({ children, locale = DEFAULT_LOCALE }: RootShellProps) {
  const pathname = usePathname();
  const editorial = pathname.startsWith("/admin") || pathname.startsWith("/preview");
  const labels = getChromeLabels(locale);
  if (editorial) {
    return (
      <>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-20 focus:bg-white focus:px-4 focus:py-2 focus:text-ink-900"
        >
          {labels.skipToContent}
        </a>
        {children}
      </>
    );
  }
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-20 focus:bg-white focus:px-4 focus:py-2 focus:text-ink-900"
      >
        {labels.skipToContent}
      </a>
      {/* Every Hero/HeroSolidPanel page bleeds its photo up over this bar so
       * it was never actually visible below `lg` in practice — the bleed
       * margin was fragile (see hero-solid-panel.tsx's CRO-pass comment for
       * where it broke), so this makes that always-hidden-below-lg intent
       * explicit instead of relying on pixel-matching a margin to it.
       * HeroSolidPanel's own in-panel trust line covers social proof below
       * `lg` instead (see hero-solid-panel.tsx). */}
      <TopStatsBar locale={locale} className="container hidden py-4 lg:block lg:py-6" />
      <Navbar locale={locale} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer locale={locale} />
    </>
  );
}
