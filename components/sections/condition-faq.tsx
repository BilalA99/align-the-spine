import dynamic from "next/dynamic";

import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import type { ConditionFaq as ConditionFaqData } from "@/content/conditions/types";
import type { FAQ } from "@/content/faqs";
import { DEFAULT_LOCALE, type Locale } from "@/content/i18n";

/** Code-split (Epic 12): FaqAccordion's Framer Motion out of the initial
 * page JS bundle. */
const FaqAccordion = dynamic(() =>
  import("@/components/ui/faq-accordion").then((m) => m.FaqAccordion),
);

export interface ConditionFaqProps {
  faq: ConditionFaqData;
  className?: string;
  /** Language for the two strings this section owns (the eyebrow and the
   * "Everything you need to know about …" lead-in). `faq.headerTail`
   * supplies the tail in whichever language the caller's content is. */
  locale?: Locale;
}

const COPY: Record<Locale, { eyebrow: string; headingLead: string }> = {
  en: {
    eyebrow: "Frequently asked questions",
    headingLead: "Everything you need to know about",
  },
  es: {
    eyebrow: "Preguntas frecuentes",
    headingLead: "Todo lo que necesita saber sobre",
  },
};

/** FAQ section per condition-page-spec §B11/§C. Takes the faq fields
 * directly (not a whole Condition) so both the shared [slug] template and
 * bespoke per-condition pages can use it. Counterpart to FaqSection:
 * FaqSection is keyed by a static pageKey lookup with {question, answer}
 * items, while ConditionFaqData.items is {q, a} — mapped inline here rather
 * than widening FaqSection's prop union for one caller. Ships its own
 * FAQPage JSON-LD from the same items shown on screen, per Google's
 * requirement that structured data match visible content (same pairing
 * FaqSection already establishes). */
export function ConditionFaq({ faq, className, locale = DEFAULT_LOCALE }: ConditionFaqProps) {
  const copy = COPY[locale];
  const items: FAQ[] = faq.items.map(({ q, a }) => ({ question: q, answer: a }));

  return (
    <Section className={className}>
      <Container className="flex flex-col gap-8">
        <SectionHeading
          eyebrow={copy.eyebrow}
          className="mx-auto max-w-2xl items-center text-center"
        >
          {copy.headingLead} {faq.headerTail}
        </SectionHeading>
        <div className="mx-auto w-full max-w-3xl">
          <FaqAccordion items={items} />
        </div>
        <FaqJsonLd items={items} />
      </Container>
    </Section>
  );
}
