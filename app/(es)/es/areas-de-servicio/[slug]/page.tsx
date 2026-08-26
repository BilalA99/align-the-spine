import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { EsServiceAreaArticle } from "@/components/content/es-service-area-article";
import { ServiceAreaHero } from "@/components/content/service-area-hero";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { LeadFormPopup } from "@/components/ui/lead-form-popup";
import { Section } from "@/components/ui/section";
import {
  esServiceAreaPages,
  getEsServiceAreaPage,
  type EsServiceAreaPage,
} from "@/content/es/service-areas-cities";
import { HREFLANG } from "@/content/i18n";
import { siteConfig } from "@/content/site";
import { buildMedicalWebPage, buildServiceAreaSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo/metadata";

/** Same photo the English city pages use for their social card — these
 * pages have no per-city image either. */
const SHARED_OG_IMAGE = {
  src: "https://align-the-spine.b-cdn.net/images/WhatsApp%20Image%202026-08-17%20at%2017.38.56%20(1).jpeg",
  alt: "Sala de tratamiento de Align the Spine Chiropractic en Deerfield Beach, FL",
};

/** Statically generated, unlike the English /service-areas/[slug] route.
 * The English pages go through the content repository (which can serve
 * Supabase-backed records that change without a deploy, so that route stays
 * dynamic); the Spanish set is a committed data file with a fixed nineteen
 * entries, so there's nothing to defer to request time. */
export function generateStaticParams() {
  return esServiceAreaPages.map((page) => ({ slug: page.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getEsServiceAreaPage(slug);
  if (!page)
    return { title: "Área de servicio no encontrada", robots: { index: false, follow: false } };
  return buildMetadata({
    path: page.path,
    title: page.seoTitle,
    description: page.metaDescription,
    image: SHARED_OG_IMAGE,
    locale: "es",
  });
}

/** /es/areas-de-servicio/[slug] — the nineteen Spanish city pages.
 *
 * Content comes from content/es/service-areas-cities.ts, where one
 * translated template is interpolated with each city's verified facts. See
 * that file's header for why it is a template rather than nineteen
 * independent translations, and SPANISH_SEO_IMPLEMENTATION_REPORT.md §11b
 * for the duplicate-content measurements on the English originals that this
 * mirrors.
 *
 * hreflang comes from content/i18n.ts's `serviceAreaLocalizedRoutes`, which
 * is derived from the same city list, so a Spanish page and its English
 * counterpart always annotate each other.
 */
export default async function EsServiceAreaCityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getEsServiceAreaPage(slug);
  if (!page) notFound();

  const relatedPages = page.relatedSlugs
    .map((related) => getEsServiceAreaPage(related))
    .filter((related): related is EsServiceAreaPage => Boolean(related));

  const breadcrumbs = [
    { name: "Inicio", path: "/es" },
    { name: "Áreas de servicio", path: "/es/areas-de-servicio" },
    { name: page.communityName, path: page.path },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <JsonLd
        data={buildServiceAreaSchema({
          slug: page.slug,
          communityName: page.communityName,
          metaDescription: page.metaDescription,
          // Distinct @id from the English node — see buildServiceAreaSchema.
          path: page.path,
          name: `Atención quiropráctica para residentes de ${page.communityName}`,
        })}
      />
      <JsonLd
        data={buildMedicalWebPage({
          path: page.path,
          name: page.title,
          description: page.metaDescription,
          dateModified: "2026-08-26",
          aboutTopic: `Atención quiropráctica después de un accidente vehicular para residentes de ${page.communityName}`,
          inLanguage: HREFLANG.es,
        })}
      />
      <ServiceAreaHero
        locale="es"
        breadcrumbs={breadcrumbs}
        eyebrow={page.countyEs}
        title={page.title}
        subhead={page.excerpt}
        cityName={page.communityName}
        county={page.county}
      >
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={siteConfig.business.phoneHref}
            className="inline-flex min-h-11 items-center rounded-full bg-white px-6 font-semibold text-navy-900 transition-colors hover:bg-mute-300"
          >
            Llamar al {siteConfig.business.phone}
          </a>
          {/* Hidden below `lg`, matching the English city page: the compact
           * eligibility card inside ServiceAreaHero already serves as this
           * CTA on mobile. */}
          <LeadFormPopup
            formHeading={`Verifique su elegibilidad en ${page.communityName}`}
            formVariant="eligibility"
            locale="es"
            triggerClassName="hidden min-h-11 items-center rounded-full border border-white px-6 font-semibold text-white transition-colors hover:border-teal-500 hover:bg-teal-500 lg:inline-flex"
          >
            ¿Lesionado en un accidente? Vea a un quiropráctico hoy
          </LeadFormPopup>
        </div>
      </ServiceAreaHero>

      <EsServiceAreaArticle page={page} relatedPages={relatedPages} />

      {/* Mirrors the English page's ATS-SEO-041 links to the verified
       * office and the accident-care page — both to their Spanish
       * counterparts, so the Spanish nav graph stays inside Spanish. */}
      <Section spacing="sm">
        <Container className="flex flex-wrap justify-center gap-8 text-center font-sans text-card-body">
          <Link href="/es/contacto" className="text-navy-900 underline underline-offset-4">
            Nuestro consultorio verificado en Deerfield Beach
          </Link>
          <Link
            href="/es/quiropractico-accidentes-de-auto"
            className="text-navy-900 underline underline-offset-4"
          >
            Atención quiropráctica tras un accidente
          </Link>
        </Container>
      </Section>
    </>
  );
}
