import type { Metadata } from "next";
import Image from "next/image";

import { LocationFooter } from "@/components/layout/location-footer";
import { LocationIntro } from "@/components/layout/location-intro";
import { ContactSection } from "@/components/sections/contact-section";
import { ReviewsCarousel } from "@/components/sections/reviews-carousel";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { LeadForm } from "@/components/ui/lead-form";
import { Rating } from "@/components/ui/rating";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { getLocalizedStats } from "@/content/chrome";
import { esLeadFormVariants } from "@/content/es/lead-forms";
import { esReviewsPage } from "@/content/es/pages";
import { getEsRoute } from "@/content/es/seo";
import { HREFLANG } from "@/content/i18n";
import { siteConfig } from "@/content/site";
import { testimonials } from "@/content/testimonials";
import { isVerified } from "@/content/verified-value";
import { buildWebPage } from "@/lib/schema";
import { buildEsRouteMetadata } from "@/lib/seo/metadata";

const route = getEsRoute("/es/resenas");

export const metadata: Metadata = buildEsRouteMetadata(route);

/** /es/resenas — Spanish counterpart of /reviews.
 *
 * The reviews themselves are rendered verbatim, in whatever language each
 * patient wrote them. They are not translated, and there is no Spanish
 * "version" of any review. Rewriting a testimonial and presenting it as the
 * patient's own words makes it a fabricated review, which is both a Google
 * review-policy violation and simply untrue. `languageNote` below tells the
 * Spanish reader that plainly, so English quotes on a Spanish page read as
 * a deliberate choice rather than an untranslated page.
 *
 * No AggregateRating markup is emitted here, exactly as on the English
 * page: the 5.0/164 figure is a client-asserted number rather than one read
 * from a live source (see docs/CLAIMS_PENDING.md), and rating markup is a
 * stronger, machine-consumed claim than displaying the same figure as copy.
 * The visible rating renders only while siteConfig.reviewsRating is
 * verified, through the same gate the English page uses.
 */
const breadcrumbs = [
  { name: "Inicio", path: "/es" },
  { name: "Reseñas", path: route.path },
];

export default function EsReviewsPage() {
  const reviews = siteConfig.reviewsRating;
  const otherStats = getLocalizedStats("es").filter((stat) => stat.label !== "Reseñas");

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <JsonLd
        data={buildWebPage({
          path: route.path,
          name: route.title,
          description: route.description,
          inLanguage: HREFLANG.es,
        })}
      />

      <section className="relative flex flex-col overflow-hidden pt-10 lg:-mt-[176px] lg:min-h-[860px] lg:flex-row">
        <div className="relative min-h-[560px] min-w-0 lg:min-h-full lg:flex-1">
          <Image
            src="https://align-the-spine.b-cdn.net/images/review-page-hero.png"
            alt={esReviewsPage.heroAlt}
            fill
            priority
            sizes="(min-width: 1024px) 62vw, 100vw"
            className="object-cover object-[75%_center]"
          />
          <div className="absolute inset-0 bg-[#2a2318]/45 lg:bg-gradient-to-r lg:from-[#2a2318]/70 lg:via-[#2a2318]/35 lg:to-transparent" />
          <Container>
            <div className="container relative z-10 flex h-full flex-col justify-start pb-16 pt-[120px] lg:pb-16 lg:pr-12 lg:pt-[170px]">
              <div className="max-w-lg">
                <BreadcrumbTrail items={breadcrumbs} className="mb-4" />
                <h1 className="font-display text-5xl font-medium text-white">{esReviewsPage.h1}</h1>
                <p className="mt-4 font-sans text-body-lg text-white">{esReviewsPage.intro}</p>

                {isVerified(reviews) && (
                  <div className="mt-8 flex flex-wrap items-center gap-4 sm:gap-6">
                    <span className="font-display text-hero text-yellow-400">
                      {reviews.value.rating.toFixed(1)}
                    </span>
                    <div className="flex flex-col gap-2">
                      <Rating
                        value={reviews.value.rating}
                        filledClassName="text-yellow-400 h-6 w-6 sm:h-7 sm:w-7"
                        emptyClassName="text-white/20 h-6 w-6 sm:h-7 sm:w-7"
                      />
                      <span className="font-sans text-body-lg text-white">
                        <strong className="font-semibold">
                          {reviews.value.count} {esReviewsPage.ratingSuffix}
                        </strong>{" "}
                        {esReviewsPage.ratingTail}
                      </span>
                    </div>
                  </div>
                )}

                {otherStats.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {otherStats.map((stat) => (
                      <span
                        key={stat.label}
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 py-1.5 pl-3 pr-3.5 font-sans text-stat-label text-white"
                      >
                        {stat.value}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Container>
        </div>

        <div className="relative flex flex-col bg-navy-900 px-6 pb-16 pt-10 sm:px-10 lg:w-[640px] lg:shrink-0 lg:px-16 lg:pb-16 lg:pt-[170px] xl:w-[760px] 2xl:w-[800px]">
          <LeadForm
            locale="es"
            heading={esReviewsPage.formHeading}
            variant={esLeadFormVariants.reviewsEval.variant}
            fields={esLeadFormVariants.reviewsEval.fields}
            submitLabel={esLeadFormVariants.reviewsEval.submitLabel}
            submitVariant="teal"
            fieldOutline
            labelCase="none"
            headingClassName="mb-4 font-display text-3xl text-white"
            className="gap-y-4"
          />
          <p className="mt-6 font-sans text-body-lg text-mute-300">{esReviewsPage.formFootnote}</p>
        </div>
      </section>

      <Section spacing="lg" className="container">
        <div className="flex flex-col gap-8">
          <SectionHeading eyebrow="Reseñas" sub={esReviewsPage.languageNote}>
            {esReviewsPage.carouselHeading}
          </SectionHeading>
          <ReviewsCarousel reviews={testimonials} quoteLang="en-US" />
        </div>
      </Section>

      <LocationIntro locale="es" />
      <LocationFooter locale="es" />
      <ContactSection locale="es" />
    </>
  );
}
