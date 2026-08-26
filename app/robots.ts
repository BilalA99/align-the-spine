import type { MetadataRoute } from "next";

import { isProduction, siteConfig } from "@/content/site";

/** robots.txt (ATS-131). Production allows crawling site-wide except the
 * lead API route and the post-conversion thank-you pages (/thank-you and
 * its Spanish counterpart /es/gracias). The whole /es subtree is otherwise
 * deliberately crawlable — it's a primary-content locale, not a duplicate. Every
 * nonproduction deploy (local dev, CI, Vercel previews) disallows
 * everything — robots.txt alone can't reliably keep a preview out of
 * search (a crawler can ignore it), so this is paired with the per-page/
 * layout noindex in lib/seo/metadata.ts and app/layout.tsx. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: isProduction()
      ? {
          userAgent: "*",
          allow: "/",
          disallow: ["/api/", "/admin/", "/preview/", "/thank-you", "/es/gracias"],
        }
      : { userAgent: "*", disallow: "/" },
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
  };
}
