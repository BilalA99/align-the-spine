import Link from "next/link";

import type { BreadcrumbItemInput } from "@/lib/schema";

export interface BreadcrumbTrailProps {
  items: BreadcrumbItemInput[];
  className?: string;
}

/** LINK-02: the VISIBLE half of a page's breadcrumb trail — takes the exact
 * same `items` prop as BreadcrumbJsonLd (usually rendered alongside it, see
 * HeroSolidPanel's `breadcrumbs` prop) so the rendered trail and the
 * BreadcrumbList JSON-LD can never drift apart; there's only one source of
 * truth per page, not two hand-maintained copies.
 *
 * Styled for this site's dark hero/header treatment (every page that needs
 * breadcrumbs opens on a dark navy or photo-with-dark-overlay band — see
 * HeroSolidPanel, and the custom hero markup on /reviews and
 * /privacy-policy) — white current-page text, mute-300 for ancestors and
 * separators, matching HeroSolidPanel's existing on-dark palette. */
export function BreadcrumbTrail({ items, className }: BreadcrumbTrailProps) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-2 font-sans text-sm text-mute-300">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-2">
              {index > 0 && (
                <span aria-hidden="true" className="text-mute-300/60">
                  /
                </span>
              )}
              {isLast ? (
                <span aria-current="page" className="text-white">
                  {item.name}
                </span>
              ) : (
                <Link href={item.path || "/"} className="transition-colors hover:text-white">
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
