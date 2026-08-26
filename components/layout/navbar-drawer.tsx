"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { createPortal } from "react-dom";

import { ChevronDownIcon } from "@/components/ui/icons/chevron-down";
import { CloseIcon } from "@/components/ui/icons/close";
import { getBookingCta, getChromeLabels, getNav } from "@/content/chrome";
import { DEFAULT_LOCALE, type Locale } from "@/content/i18n";

import { LanguageSwitcher } from "./language-switcher";
import { useFocusTrap } from "./use-focus-trap";

const noopSubscribe = () => () => {};

/** True only once hydrated on the client. document.body (the portal target
 * below) doesn't exist during SSR, and rendering straight off
 * `typeof document !== "undefined"` would mismatch between the server pass
 * and the client's first hydration pass — useSyncExternalStore is the
 * React-sanctioned way to have that first client render still match the
 * server (both read `getServerSnapshot`'s `false`) and only flip true on
 * the render after. */
function useHasMounted() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

export function NavbarDrawer({
  open,
  onClose,
  locale = DEFAULT_LOCALE,
}: {
  open: boolean;
  onClose: () => void;
  locale?: Locale;
}) {
  const containerRef = useFocusTrap(open);
  const nav = getNav(locale);
  const bookingCta = getBookingCta(locale);
  const labels = getChromeLabels(locale);
  // Which nav-item labels have their submenu accordion expanded — a Set
  // rather than a single value since there's no reason opening one should
  // close another in this short a list.
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const mounted = useHasMounted();

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  function toggleExpanded(label: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  }

  if (!mounted) return null;

  // Portaled to document.body rather than rendered in place: Navbar's
  // <header> carries `will-change-transform`, which per spec gives it a
  // containing block for `position: fixed` descendants — so without the
  // portal, this drawer's "fixed" overlay/panel were positioned relative to
  // that 100px-tall header instead of the viewport, clipping the whole
  // drawer down to a sliver at the top of the screen instead of covering
  // the full height.
  return createPortal(
    <div className="xl:hidden" aria-hidden={!open} inert={!open}>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-50 bg-navy-900/60 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-label={locale === "es" ? "Navegación del sitio" : "Site navigation"}
        // A plain shell now, not itself the scroll/padding container — with
        // 19 service areas the nav list can genuinely be taller than the
        // screen, and this used to be one big `flex-col overflow-y-auto`
        // box with the CTA button as its last child. Once that list
        // actually overflowed, the button (sized only by its own content,
        // no explicit width) stopped getting stretched to the container's
        // width by flex's default cross-axis stretch and rendered
        // shrink-wrapped instead (ATS-146). Splitting into a pinned header,
        // a scrollable nav region, and a pinned CTA footer fixes that
        // (each region's width is independent of the others' content) and
        // is also the right UX for a drawer that can overflow: the primary
        // CTA should never require scrolling past the whole nav to reach.
        className={`fixed right-0 top-0 z-50 flex h-full w-4/5 max-w-sm flex-col bg-navy-900 shadow-card transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex shrink-0 justify-end p-8 pb-4">
          <button
            type="button"
            aria-label={labels.closeMenu}
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>

        <ul className="flex flex-1 flex-col gap-6 overflow-y-auto px-8 pb-8">
          {nav.map((link) => {
            if (!link.menu) {
              return (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className="text-nav uppercase text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    {link.label}
                  </Link>
                </li>
              );
            }

            const isExpanded = expanded.has(link.label);
            return (
              <li key={link.label}>
                <button
                  type="button"
                  aria-expanded={isExpanded}
                  onClick={() => toggleExpanded(link.label)}
                  className="flex w-full items-center justify-between text-nav uppercase text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {link.label}
                  <ChevronDownIcon
                    className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <ul className="mt-4 flex flex-col gap-4 border-l border-white/15 pl-4">
                        <li>
                          <Link
                            href={link.href}
                            onClick={onClose}
                            className="font-alt text-alt-label text-mute-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                          >
                            All {link.label}
                          </Link>
                        </li>
                        {link.menu.map((item) => (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              onClick={onClose}
                              className="font-alt text-alt-label text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>

        {/* Mobile language switch. Pinned above the CTA and inside the focus
         * trap so it's keyboard-reachable, and it renders nothing at all on
         * a page with no counterpart in the other language. */}
        <div className="shrink-0 border-t border-white/10 px-8 pt-4 text-white">
          <LanguageSwitcher locale={locale} variant="block" />
        </div>

        <div className="shrink-0 border-t border-white/10 p-8 pt-6">
          <Link
            href={bookingCta.href}
            onClick={onClose}
            className="flex h-[52px] w-full items-center justify-center rounded-full bg-white px-6 text-button text-navy-900 transition-colors duration-300 hover:bg-teal-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900"
          >
            {bookingCta.label}
          </Link>
        </div>
      </div>
    </div>,
    document.body,
  );
}
