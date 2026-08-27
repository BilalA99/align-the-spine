"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ArrowRightIcon } from "@/components/ui/icons/arrow-right";
import { MenuIcon } from "@/components/ui/icons/menu";
import { getBookingCta, getChromeLabels } from "@/content/chrome";
import { DEFAULT_LOCALE, type Locale } from "@/content/i18n";
import { siteConfig } from "@/content/site";

import { LanguageSwitcher } from "./language-switcher";
import { NavbarDrawer } from "./navbar-drawer";
import { NavbarLinks } from "./navbar-links";

export const SOLID_NAV_ROUTES = ["/privacy-policy", "/home-visit-chiropractor", "/thank-you"];

function usesSolidNavbar(pathname: string) {
  return (
    SOLID_NAV_ROUTES.includes(pathname) ||
    pathname.startsWith("/blog") ||
    pathname.startsWith("/service-areas")
  );
}

/** Pages whose Hero renders a solid navy-900 right-column panel
 * (components/sections/hero-solid-panel.tsx, or /reviews's matching
 * hand-built hero) — the same color as the default filled "Book
 * Appointment" pill, so it'd be invisible against it while the navbar is
 * still transparent (pre-scroll). Those pages get an outlined pill instead
 * until the navbar goes solid/glass. /home-visits also uses HeroSolidPanel
 * but is already in SOLID_NAV_ROUTES above (its navbar is never
 * transparent), so it doesn't need to be listed here too. */
export const OUTLINE_CTA_ROUTES = [
  "/",
  "/car-accident-chiropractor",
  "/services",
  "/reviews",
  // Spanish counterparts of the routes above — each renders the same
  // HeroSolidPanel/solid-navy hero, so the CTA pill needs the same outlined
  // treatment against it. Listed explicitly rather than derived, matching
  // how the English entries are declared.
  "/es",
  "/es/quiropractico-accidentes-de-auto",
  "/es/servicios",
  "/es/resenas",
  "/conditions/back-pain",
  "/conditions/cervicogenic-headache",
  "/conditions/concussion",
  "/conditions/neck-pain",
  "/conditions/sciatica",
  "/conditions/tmj-jaw-pain",
  "/conditions/whiplash",
];

const SCROLL_THRESHOLD = 40;

type NavbarVariant = "transparent" | "solid";

export function Navbar({
  variant,
  locale = DEFAULT_LOCALE,
}: { variant?: NavbarVariant; locale?: Locale } = {}) {
  const pathname = usePathname();
  const bookingCta = getBookingCta(locale);
  const labels = getChromeLabels(locale);
  const homeHref = locale === "es" ? "/es" : "/";
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  const resolvedVariant: NavbarVariant =
    variant ?? (usesSolidNavbar(pathname) ? "solid" : "transparent");
  const isGlass = resolvedVariant === "solid" || scrolled;
  const outlineCta = OUTLINE_CTA_ROUTES.includes(pathname) && !isGlass;

  // Close the drawer on route change. Adjusting state during render (rather
  // than in an effect) avoids an extra post-commit render pass — see
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes.
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setDrawerOpen(false);
  }

  useEffect(() => {
    if (resolvedVariant === "solid") return;

    const onScroll = () => setScrolled(window.scrollY >= SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [resolvedVariant]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 isolate flex h-[100px] items-center will-change-transform">
        <div
          className={`container relative flex items-center justify-between rounded-full px-6 py-2 transition-colors duration-300 ${
            isGlass ? "bg-navy-900" : "bg-transparent"
          }`}
        >
          <Link href={homeHref} className="shrink-0">
            {/* On scroll the logo scales down so it sits centered in the navy
                pill with clear breathing room, rather than filling it edge-to-edge. */}
            <Image
              src="/figma-exports/logo_blue.png"
              alt={siteConfig.business.name}
              width={65}
              height={65}
              className={`origin-left transition-transform duration-300 ${
                isGlass ? "scale-[0.8]" : "scale-100"
              }`}
            />
          </Link>

          <NavbarLinks isGlass={isGlass} locale={locale} className="hidden xl:flex" />

          <div className="hidden items-center gap-6 xl:flex">
            {/* Always white: the navbar sits on either the navy glass pill
             * or a dark hero photo, so the switcher's contrast doesn't
             * change with `isGlass` the way the CTA pill's does. */}
            <LanguageSwitcher locale={locale} className="text-white" />

            <Link
              href={bookingCta.href}
              className={`group flex h-[52px] items-center gap-2 whitespace-nowrap rounded-full px-6 text-button transition-colors duration-300 ${
                isGlass
                  ? "bg-white text-navy-900"
                  : outlineCta
                    ? "border border-white bg-transparent text-white"
                    : "bg-navy-900 text-white"
              }`}
            >
              {bookingCta.label}
              <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <button
            type="button"
            aria-label={labels.openMenu}
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen(true)}
            className="flex h-11 w-11 items-center justify-center text-white xl:hidden"
          >
            <MenuIcon className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* Rendered as a header sibling, not a child: header has
       * will-change-transform, which establishes a containing block for
       * position:fixed descendants (per spec, same as an actual transform)
       * — nesting the drawer inside it collapsed the drawer's fixed
       * inset-0/h-full to the header's own 100px height instead of the
       * viewport. */}
      <NavbarDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} locale={locale} />
    </>
  );
}
