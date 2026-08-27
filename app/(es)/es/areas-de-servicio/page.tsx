import type { Metadata } from "next";
import Link from "next/link";

import { ServiceAreaHero } from "@/components/content/service-area-hero";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { JsonLd } from "@/components/seo/json-ld";
import { ArrowRightIcon } from "@/components/ui/icons/arrow-right";
import { getEsRoute } from "@/content/es/seo";
import { esServiceAreaGroups, esServiceAreasCopy } from "@/content/es/service-areas";
import { siteConfig } from "@/content/site";
import { buildMedicalBusiness } from "@/lib/schema";
import { buildEsRouteMetadata } from "@/lib/seo/metadata";

const GOOGLE_MAPS_URL = "https://share.google/9ln6JLZdTiphHnmzF";

const route = getEsRoute("/es/areas-de-servicio");

export const metadata: Metadata = buildEsRouteMetadata(route);

/** /es/areas-de-servicio — Spanish counterpart of the /service-areas hub.
 *
 * Links Spanish-to-Spanish: each of the nineteen communities has its own
 * page at /es/areas-de-servicio/[slug]. The hub pair AND all nineteen city
 * pairs are registered in content/i18n.ts (the city pairs are derived, see
 * `serviceAreaLocalizedRoutes` there), so every one of them annotates its
 * English counterpart reciprocally.
 *
 * The duplicate-content caveat behind the city pages is documented in
 * content/es/service-areas-cities.ts and the report's §11b.
 */
export default function EsServiceAreasPage() {
  const breadcrumbs = [
    { name: "Inicio", path: "/es" },
    { name: esServiceAreasCopy.breadcrumb, path: route.path },
  ];
  const { address, phone, phoneHref } = siteConfig.business;
  const { hero, verification, communities, eligibility, office } = esServiceAreasCopy;

  return (
    <div className="bg-panel-100 pb-24">
      <JsonLd data={buildMedicalBusiness()} />
      <BreadcrumbJsonLd items={breadcrumbs} />
      <ServiceAreaHero
        locale="es"
        breadcrumbs={breadcrumbs}
        eyebrow={hero.eyebrow}
        title={hero.title}
        subhead={
          <>
            {hero.addressLead}{" "}
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noreferrer"
              className="underline decoration-white/50 underline-offset-2 hover:decoration-white"
            >
              {address.line1}, {address.suite}, {address.city}, {address.state} {address.zip}
            </a>
            {hero.addressTail}
          </>
        }
      >
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={phoneHref}
            className="inline-flex min-h-11 items-center rounded-full bg-white px-6 font-semibold text-navy-900 transition-colors hover:bg-mute-300"
          >
            {hero.callPrefix} {phone}
          </a>
          <Link
            href="/es/solicitar-cita"
            className="inline-flex min-h-11 items-center rounded-full border border-white px-6 font-semibold text-white transition-colors hover:border-teal-500 hover:bg-teal-500"
          >
            {hero.requestCta}
          </Link>
        </div>
      </ServiceAreaHero>

      <section className="container mt-12 grid gap-6 lg:grid-cols-3" aria-labelledby="ways-heading">
        <div className="lg:col-span-3">
          <h2 id="ways-heading" className="font-display text-4xl text-navy-800">
            {verification.heading}
          </h2>
        </div>
        {verification.cards.map((card) => (
          <article key={card.heading} className="rounded-30 bg-white p-8 shadow-comparison">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-teal-500">
              {card.eyebrow}
            </p>
            <h3 className="mt-3 font-display text-3xl text-navy-800">{card.heading}</h3>
            <p className="mt-4 leading-7 text-ink-500">{card.body}</p>
          </article>
        ))}
      </section>

      <section className="container mt-14" aria-labelledby="communities-heading">
        <h2 id="communities-heading" className="font-display text-4xl text-navy-800">
          {communities.heading}
        </h2>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-ink-500">{communities.intro}</p>
        <p className="mt-3 max-w-3xl leading-7 text-ink-500">{communities.spanishNote}</p>

        {esServiceAreaGroups.map((group) => (
          <div key={group.county} className="mt-10">
            <h3 className="font-display text-2xl text-navy-800">{group.countyEs}</h3>
            <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {group.communities.map((community) => (
                <li key={community.href}>
                  <Link
                    href={community.href}
                    className="group flex min-h-11 flex-col gap-2 rounded-30 bg-white p-6 shadow-comparison transition-transform duration-300 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-500"
                  >
                    <span className="text-xs font-semibold uppercase tracking-[0.1em] text-teal-500">
                      {group.countyEs}
                    </span>
                    <span className="font-display text-2xl text-navy-800">{community.name}</span>
                    <span className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-navy-800 opacity-70 transition-opacity group-hover:opacity-100">
                      {communities.guideLabel}
                      <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="container mt-14 grid gap-8 rounded-40 bg-white p-8 sm:p-12 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-teal-500">
            {office.eyebrow}
          </p>
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-3 block font-display text-4xl text-navy-800 underline decoration-navy-800/30 underline-offset-4 hover:decoration-navy-800"
          >
            {address.line1}, {address.suite}
          </a>
          <address className="mt-4 not-italic leading-7 text-ink-500">
            {address.city}, {address.state} {address.zip}
          </address>
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex min-h-11 items-center rounded-full bg-navy-900 px-6 font-semibold text-white transition-colors hover:bg-navy-700"
          >
            {office.directionsCta}
          </a>
        </div>
        <div>
          <h2 className="font-display text-4xl text-navy-800">{eligibility.heading}</h2>
          <ol className="mt-4 list-decimal space-y-3 pl-5 leading-7 text-ink-500">
            {eligibility.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
