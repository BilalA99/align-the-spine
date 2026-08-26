"use client";

import { usePathname } from "next/navigation";

import { GlobeIcon } from "@/components/ui/icons/globe";
import { getChromeLabels } from "@/content/chrome";
import { counterpartPath, HREFLANG, type Locale } from "@/content/i18n";
import { cn } from "@/lib/cn";

export interface LanguageSwitcherProps {
  locale: Locale;
  className?: string;
  /** "inline" is the navbar/footer pill; "block" is the full-width row the
   * mobile drawer uses. */
  variant?: "inline" | "block";
}

/** English ⇄ Spanish switch.
 *
 * Resolves the *equivalent* page rather than dumping the visitor on the
 * other language's home page: on /car-accident-chiropractor it points at
 * /es/quiropractico-accidentes-de-auto, and vice versa. That mapping comes
 * from content/i18n.ts's route pairs, so it can't drift from the hreflang
 * annotations or the sitemap — they all read the same table.
 *
 * Renders nothing when the current page has no counterpart (every route
 * with `es: null` in content/i18n.ts — the draft condition/service pages
 * and /privacy-policy). Offering a switch that silently redirects somewhere
 * else is worse than not offering one: the visitor asked for *this page* in
 * the other language, and there isn't one.
 *
 * A plain <a>, not next/link, on purpose. The two locales live in separate
 * route groups with separate root layouts, so this crossing is a full
 * document load either way — and a real anchor with `hreflang`/`lang` is
 * both a crawlable signal and the thing a screen reader needs to announce
 * the destination language correctly. `lang` on the element also makes the
 * label itself ("Español") pronounce correctly inside an English document.
 */
export function LanguageSwitcher({ locale, className, variant = "inline" }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const target: Locale = locale === "en" ? "es" : "en";
  const href = counterpartPath(pathname, locale, target);

  // `null` means "no counterpart" -> render nothing. `""` is the English
  // home page's registry path (content/seo.ts stores it as "" so that
  // `${siteUrl}${path}` yields a bare origin) and is a perfectly valid
  // target -- a plain falsy check here silently hid the switcher on /es.
  if (href === null) return null;
  const linkHref = href === "" ? "/" : href;

  const labels = getChromeLabels(locale);

  return (
    <a
      href={linkHref}
      hrefLang={HREFLANG[target]}
      lang={HREFLANG[target]}
      // The visible label is one word ("Español"/"English"); the full
      // sentence goes to assistive tech so the control isn't just a
      // language name floating next to a globe.
      aria-label={labels.languageSwitch}
      className={cn(
        "group inline-flex items-center gap-2 font-sans text-nav uppercase underline-offset-4 transition-opacity duration-300 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2",
        variant === "inline" ? "opacity-70 hover:opacity-100" : "w-full justify-between py-3",
        className,
      )}
    >
      <span className="inline-flex items-center gap-2">
        <GlobeIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
        {labels.languageSwitchShort}
      </span>
    </a>
  );
}
