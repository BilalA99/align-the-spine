import type { Metadata } from "next";

import { OnThisPageNav } from "@/components/layout/on-this-page-nav";
import { LegalContent } from "@/components/sections/legal-content";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { Section } from "@/components/ui/section";
import { privacyPolicyEffectiveDate, privacyPolicySections } from "@/content/legal/privacy-policy";
import { getRoute } from "@/content/seo";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata(getRoute("/privacy-policy"));

/** /privacy-policy page assembly (ATS-120) per the privacy-policy artboard
 * (96:2098): navy header (title + effective date), then a sticky
 * OnThisPageNav sidebar next to the 9-section LegalContent body. Navbar/
 * standard footer come from RootShell. */
export default function PrivacyPolicyPage() {
  const breadcrumbs = [
    { name: "Home", path: "" },
    { name: "Privacy Policy", path: "/privacy-policy" },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      {/* Negative top margin matches Hero's (components/sections/hero.tsx):
          pulls this block up over TopStatsBar, which RootShell renders
          in-flow before the fixed Navbar. Hero pages hide it the same way;
          this page has no Hero to do it, so it needs the trick directly.
          Values must match Hero's exactly (including its min-[400px]
          sub-tier for the 400-639px range, where TopStatsBar's height
          steps down before the sm breakpoint) — this block previously used
          -516px/no sub-tier, which didn't actually match Hero's real
          (measured) values, so the block was pulled up too far: the H1 sat
          under the fixed Navbar and a sliver of TopStatsBar's last stat
          leaked out below the navy block at ~400-639px widths. Recompute
          (real-browser measurement, not
          guessed) if TopStatsBar's height changes. */}
      <div className="-mt-[460px] bg-navy-900 pb-16 pt-[340px] min-[400px]:-mt-[392px] min-[400px]:pt-[280px] sm:-mt-[304px] md:-mt-[240px] md:pt-[220px] lg:-mt-[176px] lg:pt-[260px]">
        <div className="container">
          <BreadcrumbTrail items={breadcrumbs} className="mb-4" />
          <h1 className="font-display text-hero text-white">Privacy Policy</h1>
          <p className="mt-4 font-sans text-body-lg text-mute-300">{privacyPolicyEffectiveDate}</p>
        </div>
      </div>

      <Section spacing="lg" className="container">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[280px_1fr] lg:gap-20">
          <OnThisPageNav sections={privacyPolicySections} />
          <LegalContent sections={privacyPolicySections} />
        </div>
      </Section>
    </>
  );
}
