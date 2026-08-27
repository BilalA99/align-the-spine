import Image from "next/image";

import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PipCalculator } from "@/components/ui/pip-calculator";
import { Section } from "@/components/ui/section";
import type { ConditionAccident } from "@/content/conditions/types";
import { DEFAULT_LOCALE, type Locale } from "@/content/i18n";

export interface AccidentBannerProps {
  accident: ConditionAccident;
  className?: string;
  locale?: Locale;
  /** Eyebrow above the headline. Defaults to the English copy. */
  eyebrow?: string;
}

/** "Was this from an accident?" band per condition-page-spec §B4, §C:
 * full-bleed navy band with a cervical-spine photo background, caller-driven
 * headline/body/smallprint on the left, PIPCalculator (ATS-032) on the
 * right. Eyebrow is static — everything else varies per caller. Takes the
 * accident fields directly (not a whole Condition) so both the shared
 * [slug] template and bespoke per-condition pages (e.g.
 * /conditions/back-pain, ATS-137 full-fidelity pass) can use it without
 * depending on the Condition schema. The background photo is fixed across
 * every caller — it already carries its own dark-to-light gradient, so no
 * extra overlay is layered on top. Same full-bleed structure as
 * FeelsLikeBand: Section spacing="none" + an outer relative/overflow-hidden
 * wrapper for the image, Container only wraps the inner content. */
export function AccidentBanner({
  accident,
  className,
  locale = DEFAULT_LOCALE,
  eyebrow = "Was this from an accident?",
}: AccidentBannerProps) {
  return (
    <Section spacing="none" className={className}>
      <div className="relative overflow-hidden bg-navy-900">
        <div className="absolute inset-0">
          <Image
            src="/figma-exports/accident-banner-spine-bg.png"
            alt="Cervical spine x-ray in a dark blue gradient"
            fill
            className="object-cover"
          />
        </div>
        <Container className="relative grid grid-cols-1 gap-10 py-16 md:py-20 lg:grid-cols-2 lg:items-center">
          <div className="flex flex-col gap-6">
            <Eyebrow variant="onDark">{eyebrow}</Eyebrow>
            <h2 className="font-display text-h2 md:text-understanding-intro text-white">
              {accident.headline}
            </h2>
            <p className="font-sans text-body-lg text-mute-300">{accident.body}</p>

            <div className="flex items-start gap-4 rounded-30 bg-overlay-white-15 px-5 py-4 lg:items-center lg:rounded-full mt-20">
              <span
                aria-hidden="true"
                className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#58A0A0] font-sans text-xl font-bold text-white"
              >
                !
              </span>
              <p className="font-sans text-small-print text-mute-300">{accident.smallprint}</p>
            </div>
          </div>

          <div className="w-full lg:ml-auto lg:max-w-md">
            <PipCalculator locale={locale} />
          </div>
        </Container>
      </div>
    </Section>
  );
}
