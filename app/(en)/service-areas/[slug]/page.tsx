import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AccidentImpactVisual } from "@/components/content/accident-impact-visual";
import { ContentArticle } from "@/components/content/content-article";
import { ServiceAreaHero } from "@/components/content/service-area-hero";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { LeadFormPopup } from "@/components/ui/lead-form-popup";
import { Section } from "@/components/ui/section";
import { siteConfig } from "@/content/site";
import { getPublicContentBySlug, listPublicContentByIds } from "@/lib/content/public-content";
import { buildMedicalWebPage, buildServiceAreaSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo/metadata";

// No service-area page has a per-city photo (featuredImageDecorative is
// always true there — see static-service-area-repository.ts), so
// item.featuredImage is always undefined and the OG/Twitter card would
// otherwise fall back to a text-only card. This is the same real photo the
// page's own hero (ServiceAreaHero) already shows, reused here purely for
// the social-share preview.
const SHARED_OG_IMAGE = {
  src: "https://align-the-spine.b-cdn.net/images/WhatsApp%20Image%202026-08-17%20at%2017.38.56%20(1).jpeg",
  alt: "Align the Spine Chiropractic treatment room in Deerfield Beach, FL",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPublicContentBySlug("service_area", slug);
  if (!item) return { title: "Service area not found", robots: { index: false, follow: false } };
  return buildMetadata({
    path: `/service-areas/${item.slug}`,
    title: item.seoTitle,
    description: item.metaDescription,
    image: item.featuredImage
      ? { src: item.featuredImage.url, alt: item.featuredImage.alt }
      : SHARED_OG_IMAGE,
  });
}

export default async function ServiceAreaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getPublicContentBySlug("service_area", slug);
  if (!item) notFound();
  const relatedItems = await listPublicContentByIds(item.relatedContentIds);
  const breadcrumbs = [
    { name: "Home", path: "" },
    { name: "Service areas", path: "/service-areas" },
    { name: item.title, path: `/service-areas/${item.slug}` },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      {item.serviceArea ? (
        <JsonLd
          data={buildServiceAreaSchema({
            slug: item.slug,
            communityName: item.serviceArea.communityName,
            metaDescription: item.metaDescription,
          })}
        />
      ) : null}
      <JsonLd
        data={buildMedicalWebPage({
          path: `/service-areas/${item.slug}`,
          name: item.title,
          description: item.metaDescription,
          datePublished: item.publishedAt,
          dateModified: item.updatedAt,
          aboutTopic: item.serviceArea?.communityName
            ? `Chiropractic care after a motor vehicle accident for ${item.serviceArea.communityName} residents`
            : "Chiropractic care after a motor vehicle accident",
        })}
      />
      <ServiceAreaHero
        breadcrumbs={breadcrumbs}
        eyebrow={item.serviceArea?.county ? `${item.serviceArea.county} County` : "Service area"}
        title={item.title}
        subhead={item.excerpt}
        cityName={item.serviceArea?.communityName}
        county={item.serviceArea?.county}
      >
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={siteConfig.business.phoneHref}
            className="inline-flex min-h-11 items-center rounded-full bg-white px-6 font-semibold text-navy-900 transition-colors hover:bg-mute-300"
          >
            Call {siteConfig.business.phone}
          </a>
          {/* Hidden below `lg` (owner direction 2026-08-19): the compact
           * tap-to-expand eligibility card further down the mobile layout
           * (ServiceAreaHero's own MobileLeadPreviewCard) already serves as
           * this same CTA on mobile — showing this button too duplicated
           * it. Desktop keeps it since the always-visible full form panel
           * there is a separate, further-down element this button still
           * usefully jumps to. */}
          <LeadFormPopup
            formHeading={`Check Eligibility in ${item.serviceArea?.communityName ?? item.title}`}
            formVariant="eligibility"
            triggerClassName="hidden min-h-11 items-center rounded-full border border-white px-6 py-2 font-semibold text-white transition-colors hover:border-teal-500 hover:bg-teal-500 lg:inline-flex"
          >
            Hurt in a car accident? See a chiropractor today
          </LeadFormPopup>
        </div>
      </ServiceAreaHero>
      <ContentArticle
        item={item}
        area
        hideHeader
        relatedItems={relatedItems}
        topSlot={
          item.serviceArea?.county ? (
            <AccidentImpactVisual county={item.serviceArea.county} />
          ) : undefined
        }
      />
      {/* ATS-SEO-041: no service-area page linked to the verified
       * Deerfield Beach office or the dedicated accident-care page —
       * ContentArticle's own closing CTA only links to
       * /book-an-appointment. Scoped to this page (not ContentArticle
       * itself) so /blog/[slug] posts aren't affected. */}
      <Section spacing="sm">
        <Container className="flex flex-wrap justify-center gap-8 text-center font-sans text-card-body">
          <Link href="/contact-us" className="text-navy-900 underline underline-offset-4">
            Our verified Deerfield Beach office
          </Link>
          <Link
            href="/car-accident-chiropractor"
            className="text-navy-900 underline underline-offset-4"
          >
            Car accident chiropractic care
          </Link>
        </Container>
      </Section>
    </>
  );
}
