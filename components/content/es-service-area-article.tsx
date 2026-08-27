import Link from "next/link";

import { AccidentImpactVisual } from "@/components/content/accident-impact-visual";
import { ContentBlocks, TableOfContents } from "@/components/content/content-blocks";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { ArrowRightIcon } from "@/components/ui/icons/arrow-right";
import { InfoIcon } from "@/components/ui/icons/info";
import type { EsServiceAreaPage } from "@/content/es/service-areas-cities";
import { siteConfig } from "@/content/site";

/** Spanish article body for /es/areas-de-servicio/[slug].
 *
 * A sibling of ContentArticle rather than a `locale` prop on it. That
 * component is shared by /blog/[slug] and /service-areas/[slug] and carries
 * roughly a dozen chrome strings, an author/reviewer byline, a sources
 * list, `toLocaleDateString("en-US")` calls, and a related-content grid
 * that hardcodes English URLs — threading a locale through all of it would
 * put every English article page at risk to serve nineteen Spanish ones.
 *
 * This renders the same layout from the same primitives (ContentBlocks,
 * TableOfContents, FaqAccordion, AccidentImpactVisual), which is where the
 * actual visual design lives, so the two stay consistent without sharing a
 * component that would have to know about both languages.
 *
 * Deliberately absent, matching what the Spanish content actually supports:
 * no byline/reviewer line (the Spanish pages assert no clinician review —
 * see the English page's own note about not claiming review it doesn't
 * have), and no Sources section (the English `sources` array is metadata on
 * the repository item, not part of this Spanish data file; the statistics'
 * attribution to FLHSMV is carried inline in the prose instead, exactly as
 * the English body text carries it).
 */
export function EsServiceAreaArticle({
  page,
  relatedPages,
}: {
  page: EsServiceAreaPage;
  relatedPages: EsServiceAreaPage[];
}) {
  return (
    <div className="bg-white pb-20">
      <FaqJsonLd items={page.faqs} />
      <div className="container pt-14">
        <div className="mx-auto mt-2 max-w-[1320px] lg:grid lg:grid-cols-[minmax(0,860px)_280px] lg:items-start lg:gap-16">
          <div>
            <section
              aria-labelledby="direct-answer"
              className="mb-10 rounded-20 border border-teal-500/30 bg-[#e9f7f5] p-6 sm:p-8"
            >
              <h2 id="direct-answer" className="font-display text-2xl text-navy-800">
                Puntos clave
              </h2>
              <p className="mt-3 text-lg leading-8 text-ink-900">{page.directAnswer}</p>
              <ul className="mt-4 list-disc space-y-2 pl-5 marker:text-teal-500">
                {page.keyTakeaways.map((takeaway) => (
                  <li key={takeaway} className="text-base leading-7 text-ink-900">
                    {takeaway}
                  </li>
                ))}
              </ul>
            </section>

            <div className="mb-10">
              <AccidentImpactVisual county={page.county} locale="es" />
            </div>

            <ContentBlocks blocks={page.blocks} />

            {relatedPages.length ? (
              <section
                className="mt-14 border-t border-mute-300 pt-8"
                aria-labelledby="related-heading"
              >
                <h2 id="related-heading" className="font-display text-3xl text-navy-800">
                  Áreas cercanas
                </h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {relatedPages.map((related) => (
                    <Link
                      key={related.slug}
                      href={related.path}
                      className="block rounded-20 border border-mute-300 bg-white p-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-teal-500">
                        Área de servicio
                      </p>
                      <p className="mt-2 font-display text-lg leading-tight text-navy-800">
                        {related.communityName}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            <section
              aria-labelledby="article-faq-heading"
              className="mt-14 rounded-30 border-2 border-teal-500/25 bg-[#eff8f7] p-6 sm:p-8"
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-500 text-white"
                >
                  <InfoIcon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-500">
                    Preguntas frecuentes
                  </p>
                  <h2
                    id="article-faq-heading"
                    className="font-display text-2xl text-navy-800 sm:text-3xl"
                  >
                    Preguntas frecuentes
                  </h2>
                </div>
              </div>
              <div className="mt-6">
                <FaqAccordion items={page.faqs} />
              </div>
            </section>

            <aside className="mt-12 rounded-30 bg-navy-900 p-8 text-white sm:p-10">
              <h2 className="font-display text-3xl">¿Tiene dudas sobre una evaluación?</h2>
              {/* Same non-promise the English CTA makes: a request confirms
               * nothing about time, coverage, eligibility or a home visit. */}
              <p className="mt-3 max-w-xl leading-7 text-white">
                Llame al consultorio de Deerfield Beach o solicite una cita. Una solicitud no
                confirma un horario, ni la cobertura, ni la elegibilidad, ni una visita a domicilio.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={siteConfig.business.phoneHref}
                  className="inline-flex min-h-11 items-center rounded-full bg-white px-6 font-semibold text-navy-900 transition-colors hover:bg-mute-300"
                >
                  Llamar al {siteConfig.business.phone}
                </a>
                <Link
                  href="/es/solicitar-cita"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white px-6 font-semibold text-white transition-colors hover:border-teal-500 hover:bg-teal-500"
                >
                  Solicitar una cita <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>
            </aside>
          </div>

          <aside className="hidden lg:sticky lg:top-[120px] lg:block">
            <TableOfContents blocks={page.blocks} locale="es" />
          </aside>
        </div>
      </div>
    </div>
  );
}
