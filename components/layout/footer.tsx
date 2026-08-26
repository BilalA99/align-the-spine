import Image from "next/image";
import Link from "next/link";

import { getFooterConfig } from "@/content/chrome";
import { DEFAULT_LOCALE, HREFLANG, type Locale } from "@/content/i18n";
import { siteConfig } from "@/content/site";

import { LanguageSwitcher } from "./language-switcher";

/** Rendered in both languages off one component (see content/chrome.ts's
 * getFooterConfig). The NAP block below is deliberately *not* localized:
 * the business name, street address, email and phone number are the
 * practice's identity, and they must read identically in English and
 * Spanish for local-search/NAP consistency. Only the surrounding labels
 * change language.
 *
 * Simple 3-column grid (brand / contact / site links) instead of the old
 * `w-[40vw]`/`w-[60vw]` split — viewport-width units inside a max-width
 * `.container` don't track the container's own width, so those two columns
 * could drift out of proportion with it at in-between sizes. A plain
 * responsive grid keeps the columns' widths tied to the row they're
 * actually in. */
export function Footer({ locale = DEFAULT_LOCALE }: { locale?: Locale } = {}) {
  const year = new Date().getFullYear();
  const footer = getFooterConfig(locale);

  return (
    <footer className="border-t border-white/10 bg-navy-900">
      <div className="container grid grid-cols-1 gap-12 py-14 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr] lg:gap-8">
        <div className="flex flex-col gap-5 sm:col-span-2 lg:col-span-1">
          <Image
            src="/figma-exports/logo_blue.png"
            alt={siteConfig.business.name}
            width={88}
            height={88}
          />
          <p className="max-w-sm text-footer-tagline text-mute-300">{footer.tagline}</p>
        </div>

        <div className="flex flex-col gap-4">
          {/* h3, not h2: footer link-group labels shouldn't compete with
           * the page's real h2 content sections in the heading outline. */}
          <h3 className="text-footer-heading uppercase text-white">{footer.contactHeading}</h3>
          <a
            href={siteConfig.business.phoneHref}
            className="inline-flex min-h-11 w-fit items-center text-footer-copy text-mute-300 transition-colors hover:text-white"
          >
            {siteConfig.business.phone}
          </a>
          <a
            href={`mailto:${siteConfig.business.email}`}
            className="-mt-2 inline-flex min-h-11 w-fit items-center text-footer-copy text-mute-300 transition-colors hover:text-white"
          >
            {siteConfig.business.email}
          </a>
          <address className="-mt-2 text-footer-copy not-italic leading-6 text-mute-300">
            {siteConfig.business.address.line1}, {siteConfig.business.address.suite}
            <br />
            {siteConfig.business.address.city}, {siteConfig.business.address.state}{" "}
            {siteConfig.business.address.zip}
          </address>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-footer-heading uppercase text-white">{footer.siteHeading}</h3>
          <nav className="flex flex-col gap-1">
            {footer.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex min-h-11 w-fit items-center text-footer-copy text-mute-300 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="container flex flex-col gap-2 border-t border-white/10 py-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-footer-copy text-mute-300">
          {year} {footer.copyrightName}. {footer.licenseLine}
        </p>
        <div className="flex flex-wrap items-center gap-6 text-mute-300">
          <LanguageSwitcher locale={locale} className="text-mute-300 hover:text-white" />
          {/* On /es this crosses into the English privacy notice (no Spanish
           * version exists yet — see content/i18n.ts), so it carries an
           * explicit hrefLang/lang rather than pretending to be Spanish. */}
          <Link
            href={footer.privacyHref}
            {...(footer.privacyIsForeignLanguage
              ? { hrefLang: HREFLANG.en, lang: HREFLANG.en }
              : {})}
            className="inline-flex min-h-11 items-center text-footer-copy text-mute-300 transition-colors hover:text-white"
          >
            {footer.privacyLabel}
          </Link>
        </div>
      </div>
    </footer>
  );
}
