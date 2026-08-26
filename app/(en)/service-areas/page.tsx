import type { Metadata } from "next";
import Link from "next/link";

import { ServiceAreaHero } from "@/components/content/service-area-hero";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { JsonLd } from "@/components/seo/json-ld";
import { ArrowRightIcon } from "@/components/ui/icons/arrow-right";
import { getRoute } from "@/content/seo";
import { siteConfig } from "@/content/site";
import { listPublicContent } from "@/lib/content/public-content";
import { buildMedicalBusiness } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo/metadata";

const GOOGLE_MAPS_URL = "https://share.google/9ln6JLZdTiphHnmzF";

// ATS-SEO-021: previously hardcoded its own title/description literal here,
// independent of content/seo.ts's registry entry for this same path — the
// two had drifted out of sync. Now pulls from the registry like every
// other static page, so there's one source of truth again.
export const metadata: Metadata = buildMetadata(getRoute("/service-areas"));

export default async function ServiceAreasPage() {
  const result = await listPublicContent({ contentType: "service_area", pageSize: 24 });
  const breadcrumbs = [
    { name: "Home", path: "" },
    { name: "Service areas", path: "/service-areas" },
  ];

  return (
    <div className="bg-panel-100 pb-24">
      <JsonLd data={buildMedicalBusiness()} />
      <BreadcrumbJsonLd items={breadcrumbs} />
      <ServiceAreaHero
        breadcrumbs={breadcrumbs}
        eyebrow="One verified office"
        title="One Deerfield Beach office. Clearly explained service areas."
        subhead={
          <>
            Align the Spine Chiropractic has one office at{" "}
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noreferrer"
              className="underline decoration-white/50 underline-offset-2 hover:decoration-white"
            >
              811 SE 8th Ave, Ste 101, Deerfield Beach, FL 33441
            </a>
            . People may visit that office from a legitimately served nearby community. In limited
            eligible car-accident/PIP circumstances, they may also ask whether a home visit fits the
            case and location.
          </>
        }
      >
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={siteConfig.business.phoneHref}
            className="inline-flex min-h-11 items-center rounded-full bg-white px-6 font-semibold text-navy-900 transition-colors hover:bg-mute-300"
          >
            Call {siteConfig.business.phone}
          </a>
          <Link
            href="/book-an-appointment"
            className="inline-flex min-h-11 items-center rounded-full border border-white px-6 font-semibold text-white transition-colors hover:border-teal-500 hover:bg-teal-500"
          >
            Request an appointment
          </Link>
        </div>
      </ServiceAreaHero>
      <section className="container mt-12 grid gap-6 lg:grid-cols-3" aria-labelledby="ways-heading">
        <div className="lg:col-span-3">
          <h2 id="ways-heading" className="font-display text-4xl text-navy-800">
            How service relationships are verified
          </h2>
        </div>
        <article className="rounded-30 bg-white p-8 shadow-comparison">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-teal-500">
            Office city
          </p>
          <h3 className="mt-3 font-display text-3xl text-navy-800">Deerfield Beach</h3>
          <p className="mt-4 leading-7 text-ink-500">
            This is the only physical practice location. Current hours and availability must be
            confirmed directly because public sources conflict.
          </p>
        </article>
        <article className="rounded-30 bg-white p-8 shadow-comparison">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-teal-500">
            Nearby in-office catchment
          </p>
          <h3 className="mt-3 font-display text-3xl text-navy-800">Evidence first</h3>
          <p className="mt-4 leading-7 text-ink-500">
            A community is listed only after operations, patient origin, realistic access, and
            unique local usefulness support it. A city name in old code is not evidence.
          </p>
        </article>
        <article className="rounded-30 bg-white p-8 shadow-comparison">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-teal-500">
            Eligible accident consideration
          </p>
          <h3 className="mt-3 font-display text-3xl text-navy-800">Case and location confirmed</h3>
          <p className="mt-4 leading-7 text-ink-500">
            Home visits are not universal mobile chiropractic. Eligibility, geography, timing, payer
            handling, and availability must be confirmed for each situation.
          </p>
        </article>
      </section>
      <section className="container mt-14" aria-labelledby="approved-areas">
        <h2 id="approved-areas" className="font-display text-4xl text-navy-800">
          Published area guides
        </h2>
        {result.items.length ? (
          <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {result.items.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/service-areas/${item.slug}`}
                  className="group flex min-h-11 flex-col gap-2 rounded-30 bg-white p-6 shadow-comparison transition-transform duration-300 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-500"
                >
                  {item.serviceArea?.county ? (
                    <span className="text-xs font-semibold uppercase tracking-[0.1em] text-teal-500">
                      {item.serviceArea.county} County
                    </span>
                  ) : null}
                  <span className="font-display text-2xl text-navy-800">
                    {item.serviceArea?.communityName ?? item.title}
                  </span>
                  <span className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-navy-800 opacity-70 transition-opacity group-hover:opacity-100">
                    View home-visit eligibility
                    <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-6 rounded-30 border border-mute-300 bg-white p-8">
            <h3 className="font-display text-3xl text-navy-800">No city guide is approved yet</h3>
            <p className="mt-3 max-w-3xl text-lg leading-8 text-ink-500">
              The Deerfield Beach office-city draft and every nearby candidate remain noindex until
              operational evidence, local sources, uniqueness, and clinical/compliance review pass.
              This keeps the hub useful without manufacturing doorway pages.
            </p>
          </div>
        )}
      </section>
      <section className="container mt-14 grid gap-8 rounded-40 bg-white p-8 sm:p-12 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-teal-500">Office</p>
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-3 block font-display text-4xl text-navy-800 underline decoration-navy-800/30 underline-offset-4 hover:decoration-navy-800"
          >
            811 SE 8th Ave, Ste 101
          </a>
          <address className="mt-4 not-italic leading-7 text-ink-500">
            Deerfield Beach, FL 33441
          </address>
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex min-h-11 items-center rounded-full bg-navy-900 px-6 font-semibold text-white transition-colors hover:bg-navy-700"
          >
            Get directions
          </a>
        </div>
        <div>
          <h2 className="font-display text-4xl text-navy-800">How eligibility is confirmed</h2>
          <ol className="mt-4 list-decimal space-y-3 pl-5 leading-7 text-ink-500">
            <li>Call or submit an appointment request without sensitive medical details.</li>
            <li>
              The practice confirms whether an office visit or limited accident-related home-visit
              question is appropriate.
            </li>
            <li>
              Availability, location, pricing, and payer handling are confirmed directly; none is
              promised by this page.
            </li>
          </ol>
        </div>
      </section>
    </div>
  );
}
