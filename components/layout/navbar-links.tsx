"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { getNav } from "@/content/chrome";
import { DEFAULT_LOCALE, type Locale } from "@/content/i18n";

import { NavbarDropdown } from "./navbar-dropdown";

export function NavbarLinks({
  isGlass,
  className = "",
  locale = DEFAULT_LOCALE,
}: {
  isGlass: boolean;
  className?: string;
  locale?: Locale;
}) {
  const pathname = usePathname();
  // Spanish uses a flat nav (no mega-menus) — see content/es/chrome.ts for
  // why. The `link.menu` branch below simply never fires for it.
  const nav = getNav(locale);

  return (
    <ul
      className={`items-center gap-5 rounded-40 px-6 py-2 transition-colors duration-300 xl:gap-7 2xl:gap-9 ${className}`}
    >
      {nav.map((link) => {
        if (link.menu) return <NavbarDropdown key={link.label} link={link} />;

        const active = pathname === link.href;
        return (
          <li key={link.label}>
            <Link
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={`text-nav uppercase text-white underline-offset-4 transition-opacity duration-300 ${
                active ? "opacity-100 underline" : "opacity-70 hover:underline hover:opacity-100"
              }`}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
