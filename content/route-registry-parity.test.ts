import { readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { esRoutes } from "@/content/es/seo";
import { routes } from "@/content/seo";

/** Routes that intentionally have a page.tsx but no content/seo.ts entry —
 * see content/seo.ts's own comment on why /thank-you is absent (noindex,
 * post-conversion, doesn't belong in the sitemap). Keep this list small and
 * explicit; it's the only escape hatch this test allows. */
const UNREGISTERED_ALLOWLIST = new Set(["/thank-you", "/es/gracias"]);

const appDir = join(__dirname, "..", "app");

/** Walks app/ collecting every route path with a page.tsx — "" for the root
 * page, "/services" for app/(en)/services/page.tsx, "/es" for
 * app/(es)/es/page.tsx, etc.
 *
 * Route groups — a directory whose name is wrapped in parentheses, e.g.
 * `(en)` / `(es)` — are organizational only and contribute nothing to the
 * URL, so they're skipped when building the path. The app uses them to give
 * each locale its own root layout (and therefore its own `<html lang>`)
 * without changing a single URL; see app/(en)/layout.tsx. */
function isRouteGroup(name: string): boolean {
  return name.startsWith("(") && name.endsWith(")");
}

function collectPageRoutes(dir: string, routePath = ""): string[] {
  if (routePath.startsWith("/admin")) return [];
  const found: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      const nextPath = isRouteGroup(entry.name) ? routePath : `${routePath}/${entry.name}`;
      found.push(...collectPageRoutes(fullPath, nextPath));
      // Dynamic segments ("[slug]") are CMS-driven routes with no static
      // registry entry — the registry describes fixed pages only.
    } else if (entry.name === "page.tsx" && !routePath.includes("[")) {
      found.push(routePath);
    }
  }
  return found;
}

/** Build-time reconciliation (brief §1.5/§10): a registered-but-missing or
 * existing-but-unregistered route is exactly how a page ships without a
 * canonical, or a stale registry entry points at nothing. */
describe("route registry ↔ filesystem parity", () => {
  const filesystemRoutes = collectPageRoutes(appDir);
  // Both locales' registries: a Spanish page is held to exactly the same
  // rule as an English one — it must be registered (and therefore have a
  // canonical, a title and a description) or be explicitly allowlisted.
  const registeredPaths = new Set([...routes, ...esRoutes].map((route) => route.path));
  const filesystemPaths = new Set(filesystemRoutes);

  it("registers every page.tsx route, or lists it in the allowlist", () => {
    const unregistered = filesystemRoutes.filter(
      (path) => !registeredPaths.has(path) && !UNREGISTERED_ALLOWLIST.has(path),
    );
    expect(unregistered).toEqual([]);
  });

  it("has a page.tsx for every registered route", () => {
    const missing = [...registeredPaths].filter((path) => !filesystemPaths.has(path));
    expect(missing).toEqual([]);
  });

  it("keeps the allowlist free of stale entries", () => {
    const stale = [...UNREGISTERED_ALLOWLIST].filter(
      (path) => !filesystemPaths.has(path) || registeredPaths.has(path),
    );
    expect(stale).toEqual([]);
  });
});
