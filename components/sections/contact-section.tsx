import Image from "next/image";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { UnderlineForm } from "@/components/ui/underline-form";
import { leadFormVariants } from "@/content/lead-forms";
import { siteConfig } from "@/content/site";

/** Homepage "Contact us" block per the contact-us-final design: copy + logo
 * lockup on the left, a borderless/underline-only field form on the right
 * (via <UnderlineForm>, not the shared boxed <LeadForm> field set). Sits
 * above LocationIntro/LocationFooter. */
export function ContactSection() {
  return (
    <Section id="contact" spacing="lg">
      <Container className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col justify-between gap-16">
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-5xl text-navy-800">Contact us</h2>
            <p className="font-sans text-body-lg text-ink-900">
              Injured or just have a question? Reach out <br /> anytime — we respond fast, no call
              center.
            </p>
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
              <span className="font-sans text-body-lg text-navy-900">
                Chiropractic and Wellness Center
              </span>
            </div>
          </div>
        </div>

        <UnderlineForm
          variant={leadFormVariants.contact.variant}
          submitLabel={leadFormVariants.contact.submitLabel}
          fields={leadFormVariants.contact.fields}
          className="w-full min-[500px]:ml-auto min-[500px]:w-[80%]"
        />
      </Container>
    </Section>
  );
}
