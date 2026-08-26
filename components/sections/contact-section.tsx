import Image from "next/image";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { UnderlineForm } from "@/components/ui/underline-form";
import { esLeadFormVariants } from "@/content/es/lead-forms";
import { esContactSectionCopy } from "@/content/es/pages";
import { DEFAULT_LOCALE, type Locale } from "@/content/i18n";
import { leadFormVariants } from "@/content/lead-forms";
import { siteConfig } from "@/content/site";

/** Homepage "Contact us" block per the contact-us-final design: copy + logo
 * lockup on the left, a borderless/underline-only field form on the right
 * (via <UnderlineForm>, not the shared boxed <LeadForm> field set). Sits
 * above LocationIntro/LocationFooter. */
export function ContactSection({ locale = DEFAULT_LOCALE }: { locale?: Locale } = {}) {
  // The business name lockup below is never translated — it's the
  // practice's registered name and its search entity.
  const copy =
    locale === "es"
      ? esContactSectionCopy
      : {
          heading: "Contact us",
          body: (
            <>
              Injured or just have a question? Reach out <br /> anytime — we respond fast, no call
              center.
            </>
          ),
          lockupSubtitle: "Chiropractic and Wellness Center",
        };
  const formVariant = locale === "es" ? esLeadFormVariants.contactUs : leadFormVariants.contact;

  return (
    <Section id="contact" spacing="lg">
      <Container className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col justify-between gap-16">
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-5xl text-navy-800">{copy.heading}</h2>
            <p className="font-sans text-body-lg text-ink-900">{copy.body}</p>
          </div>

          <div className="flex items-center gap-4">
            <Image
              src="/figma-exports/logo.png"
              alt={siteConfig.business.name}
              width={200}
              height={200}
              className="size-32 shrink-0"
            />
            <div className="flex flex-col">
              <span className="text-2xl sm:text-4xl text-navy-900 font-sans">Align the Spine</span>
              <span className="font-sans text-body-lg text-navy-900">{copy.lockupSubtitle}</span>
            </div>
          </div>
        </div>

        <UnderlineForm
          variant={formVariant.variant}
          submitLabel={formVariant.submitLabel}
          fields={formVariant.fields}
          locale={locale}
          className="w-full min-[500px]:ml-auto min-[500px]:w-[80%]"
        />
      </Container>
    </Section>
  );
}
