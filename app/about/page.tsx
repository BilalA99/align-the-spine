import type { Metadata } from "next";
import Link from "next/link";

import { LocationFooter } from "@/components/layout/location-footer";
import { LocationIntro } from "@/components/layout/location-intro";
import { ContactSection } from "@/components/sections/contact-section";
import { DoctorHistory } from "@/components/sections/doctor-history";
import { DoctorProfile } from "@/components/sections/doctor-profile";
import { HeroReviewsCarousel } from "@/components/sections/hero-reviews-carousel";
import { HeroSolidPanel } from "@/components/sections/hero-solid-panel";
import { HowHePractices } from "@/components/sections/how-he-practices";
import { PhotoGallery } from "@/components/sections/photo-gallery";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { aboutHero } from "@/content/about-page";
import { doctorHistoryContent, doctorProfileContent } from "@/content/doctor-profile";
import { getRoute } from "@/content/seo";
import { siteConfig } from "@/content/site";
import { heroReviewsCarousel } from "@/content/testimonials";
import { buildPerson } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata(getRoute("/about"));

/** /about page assembly (ATS-090) per the about-drabe artboard (frame
 * 96:2442 — the ticket's node refs 1:3379/1:3512 don't resolve in the file,
 * same stale-ID issue as ATS-081's services artboard ref): Hero (no lead
 * form on this artboard, unlike Home/Services — bilingual note, no stat
 * callout) → DoctorProfile long variant (short profile block + HISTORY long
 * bio in the `extended` slot) → HowHePractices (ATS-091, built here since
 * /about's acceptance criteria required it) → PhotoGallery →
 * LocationIntro/LocationFooter (shared with Home/Services/Book) → contact
 * LeadForm, which sits below Hours of Operation per the artboard, same as
 * /services.
 *
 * ATS-SEO-022: the Hero's eyebrow/title/subhead were previously copy-pasted
 * from /services (identical H1 text, plus a sciatica-condition eyebrow) —
 * doctor/about-metadata on a Services-intent hero. Now sourced from
 * `aboutHero` (content/about-page.ts), built from facts already
 * established elsewhere in the repo — see that file's doc comment. */
export default function AboutPage() {
  return (
    <>
      <JsonLd data={buildPerson()} />
      <HeroSolidPanel
        breadcrumbs={[
          { name: "Home", path: "" },
          { name: "About", path: "/about" },
        ]}
        background={aboutHero.backgroundImage}
        eyebrow={aboutHero.eyebrowChip}
        title={aboutHero.h1}
        subhead={aboutHero.subhead}
        callPill={{ eyebrow: "Speak with us today", phone: `Call ${siteConfig.business.phone}` }}
        bilingualNote={aboutHero.bilingualNote}
      />
      <HeroReviewsCarousel testimonials={heroReviewsCarousel} />
      <DoctorProfile
        variant="long"
        content={doctorProfileContent}
        extended={<DoctorHistory content={doctorHistoryContent} />}
      />
      <HowHePractices />
      {/* ATS-SEO-041: /about had no outbound link to /services or
       * /car-accident-chiropractor anywhere in its own body content —
       * only the shared global nav covered either. */}
      <Section spacing="sm">
        <Container className="flex flex-wrap justify-center gap-8 text-center font-sans text-card-body">
          <Link href="/services" className="text-navy-900 underline underline-offset-4">
            Explore our services
          </Link>
          <Link
            href="/car-accident-chiropractor"
            className="text-navy-900 underline underline-offset-4"
          >
            Car accident care with Dr. Abe
          </Link>
        </Container>
      </Section>
      <PhotoGallery />
      <LocationIntro />
      <LocationFooter />
      <ContactSection />
    </>
  );
}
