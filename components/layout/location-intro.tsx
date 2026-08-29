import Image from "next/image";
import Link from "next/link";

import { ArrowRightIcon } from "@/components/ui/icons/arrow-right";
import { MailIcon } from "@/components/ui/icons/mail";
import { PhoneIcon } from "@/components/ui/icons/phone";
import { PinIcon } from "@/components/ui/icons/pin";
import { LiquidGlass } from "@/components/ui/liquid-glass";
import { esLocationCopy } from "@/content/es/home";
import { DEFAULT_LOCALE, type Locale } from "@/content/i18n";
import { siteConfig } from "@/content/site";

interface LocationIntroCopy {
  headingLines: [string, string];
  sendLabel: string;
  exteriorAlt: string;
  plazaCaption: string;
}

/** The plaza name and the "far-right corner" wayfinding note are real,
 * already-published location facts — the Spanish version translates
 * them rather than inventing new ones. */
const COPY: Record<Locale, LocationIntroCopy> = {
  en: {
    headingLines: ["Serving", "South Florida"],
    sendLabel: "Send",
    exteriorAlt: "Palm Plaza exterior, home of Align the Spine Chiropractic",
    plazaCaption: "After you enter the plaza, we are the building on the far-right corner.",
  },
  es: {
    headingLines: ["Atendemos al", "sur de la Florida"],
    sendLabel: esLocationCopy.sendLabel,
    exteriorAlt: "Fachada de Palm Plaza, donde se encuentra Align the Spine Chiropractic",
    plazaCaption: "Al entrar a la plaza, somos el edificio de la esquina del extremo derecho.",
  },
};

export interface LocationIntroProps {
  /** Defaults to the homepage's embedded contact form. Override on pages
   * with their own hero-level contact form (e.g. /contact-us) so "Send"
   * jumps there instead of navigating away. */
  sendHref?: string;
  locale?: Locale;
}

/** Intro/contact section per ATS-013: heading + address/phone/email + a
 * "Send Message" CTA on the left, an exterior building photo with a caption
 * overlay on the right. Rendered directly above LocationFooter on Home,
 * Services, About, Book, Contact Us. */
export function LocationIntro({ sendHref, locale = DEFAULT_LOCALE }: LocationIntroProps = {}) {
  const copy = COPY[locale];
  const resolvedSendHref = sendHref ?? (locale === "es" ? "/es#contact" : "/#contact");

  return (
    <section className="bg-white">
      <div className="container grid gap-10 pt-16 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="flex flex-col justify-between h-full sm:gap-auto gap-10">
          <h2 className="font-display text-h2 leading-tight font-normal whitespace-pre-line text-navy-900">
            {copy.headingLines[0]}
            <br />
            {copy.headingLines[1]}
          </h2>

          <div className="flex flex-col sm:gap-8 gap-6">
            <div className="flex flex-col gap-5">
              <div className="flex items-start gap-3">
                <PinIcon className="size-8 shrink-0 bg-[#58A0A0] rounded-full px-2 text-white" />
                <address className="font-alt text-footer-copy not-italic text-navy-900">
                  {siteConfig.business.address.line1} {siteConfig.business.address.suite}
                  <br />
                  {siteConfig.business.address.city}, {siteConfig.business.address.state}{" "}
                  {siteConfig.business.address.zip}
                </address>
              </div>

              <a
                href={siteConfig.business.phoneHref}
                className="flex items-center gap-3 font-alt text-footer-copy text-navy-900 transition-colors hover:text-navy-700"
              >
                <PhoneIcon className="size-8 shrink-0 bg-[#58A0A0] rounded-full px-2 text-white" />
                {siteConfig.business.phone}
              </a>

              <a
                href={`mailto:${siteConfig.business.email}`}
                className="flex min-w-0 items-center gap-3 break-all font-alt text-footer-copy text-navy-900 transition-colors hover:text-navy-700"
              >
                <MailIcon className="size-8 shrink-0 bg-[#58A0A0] rounded-full px-2 text-white" />
                {siteConfig.business.email}
              </a>
            </div>

            <Link
              href={resolvedSendHref}
              className="group flex h-12 w-fit items-center justify-center gap-3 rounded-full bg-navy-900 px-8 font-sans text-button text-white transition-colors hover:bg-navy-700"
            >
              <span>{copy.sendLabel}</span>
              <ArrowRightIcon className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <div className="relative h-105 overflow-hidden  lg:h-130">
          <Image
            src="/figma-exports/exterior-img.png"
            alt={copy.exteriorAlt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
          <LiquidGlass
            radius="rounded-none"
            className="absolute p-7 w-[90%] mx-auto max-w-md left-7 bottom-7 bg-white border-l-4 border-teal-500"
          >
            {/* h3, not h2: this is a photo caption inside the "Serving South
             * Florida" section above, not its own top-level section. */}
            <h3 className="font-display text-3xl text-button">Palm Plaza</h3>
            <p className="mt-1 font-alt text-footer-copy text-lg">{copy.plazaCaption}</p>
          </LiquidGlass>
        </div>
      </div>
    </section>
  );
}
