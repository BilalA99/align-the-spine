import type { Metadata } from "next";

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
import {
  esDoctorHistoryContent,
  esDoctorPage,
  esDoctorProfileContent,
  esHowHePracticesCards,
} from "@/content/es/pages";
import { getEsRoute } from "@/content/es/seo";
import { HREFLANG } from "@/content/i18n";
import { siteConfig } from "@/content/site";
import { heroReviewsCarousel } from "@/content/testimonials";
import { buildPerson, buildWebPage } from "@/lib/schema";
import { buildEsRouteMetadata } from "@/lib/seo/metadata";

const route = getEsRoute("/es/dr-abe-nasser");

export const metadata: Metadata = buildEsRouteMetadata(route);

/** /es/dr-abe-nasser — Spanish counterpart of /about.
 *
 * The Person entity is emitted with the same `@id` the English /about page
 * uses (lib/schema.ts's DR_ABE_PERSON_ID). That's intentional and it is not
 * duplication: there is one Dr. Abe, and both language versions of his page
 * describe that one entity. Minting a second `@id` for the Spanish page
 * would split him into two people in the graph, which is exactly the
 * entity-fragmentation this site's schema conventions exist to prevent
 * (ATS schema ticket §2.8).
 *
 * No credential, degree, school, license number or years-of-practice claim
 * appears anywhere on this page. `doctorCredentials.verified` is still
 * false (content/doctor-profile.ts), so buildPerson() omits
 * alumniOf/hasCredential — and the Spanish prose doesn't smuggle in a claim
 * the structured data is careful to leave out.
 */
export default function EsDoctorPage() {
  return (
    <>
      <JsonLd data={buildPerson()} />
      <JsonLd
        data={buildWebPage({
          path: route.path,
          name: route.title,
          description: route.description,
          inLanguage: HREFLANG.es,
        })}
      />
      <HeroSolidPanel
        locale="es"
        breadcrumbs={[
          { name: "Inicio", path: "/es" },
          { name: esDoctorPage.breadcrumb, path: route.path },
        ]}
        background={{
          src: "/figma-exports/dr-abe-neck.png",
          alt: "El Dr. Abe Nasser evaluando el cuello de un paciente",
        }}
        eyebrow={esDoctorPage.hero.eyebrow}
        title={
          <>
            {esDoctorPage.hero.titleLines[0]}
            <br />
            {esDoctorPage.hero.titleLines[1]}
          </>
        }
        subhead={esDoctorPage.hero.subhead}
        callPill={{
          eyebrow: esDoctorPage.hero.callPillEyebrow,
          phone: `Llamar al ${siteConfig.business.phone}`,
        }}
      />
      <HeroReviewsCarousel testimonials={heroReviewsCarousel} locale="es" />
      <DoctorProfile
        variant="long"
        content={esDoctorProfileContent}
        extended={<DoctorHistory content={esDoctorHistoryContent} />}
      />
      <HowHePractices
        cards={esHowHePracticesCards}
        eyebrow={esDoctorPage.practices.eyebrow}
        heading={esDoctorPage.practices.heading}
        callout={esDoctorPage.practices.officeCallout}
      />
      <PhotoGallery />
      <LocationIntro locale="es" />
      <LocationFooter locale="es" />
      <ContactSection locale="es" />
    </>
  );
}
