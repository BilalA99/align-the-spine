"use client";

import Link from "next/link";

import { ArrowRightIcon } from "@/components/ui/icons/arrow-right";
import { DEFAULT_LOCALE, type Locale } from "@/content/i18n";
import { siteConfig } from "@/content/site";
import { cn } from "@/lib/cn";
import { buildMapEmbedSrc } from "@/lib/maps";

import { LiquidGlass } from "../ui/liquid-glass";

/** Larger location/contact block per ATS-013: map with a floating glass
 * address card + an hours table (today's row highlighted) + dual CTAs.
 * Used as the "location" footer variant on Home, Services, About. */
interface LocationFooterCopy {
  ourLocation: string;
  hours: string;
  bookCta: string;
  mapTitlePrefix: string;
  confirmHours: (phone: string) => string;
  day: Record<string, string>;
}

const COPY: Record<Locale, LocationFooterCopy> = {
  en: {
    ourLocation: "Our Location",
    hours: "Hours of operation",
    bookCta: "Book Your Visit",
    mapTitlePrefix: "Map to",
    confirmHours: (phone) => `Call ${phone} to confirm today's hours.`,
    day: {},
  },
  es: {
    ourLocation: "Nuestra ubicación",
    hours: "Horario de atención",
    bookCta: "Solicitar su cita",
    mapTitlePrefix: "Mapa hacia",
    confirmHours: (phone) => `Llame al ${phone} para confirmar el horario de hoy.`,
    day: {
      Monday: "Lunes",
      Tuesday: "Martes",
      Wednesday: "Miércoles",
      Thursday: "Jueves",
      Friday: "Viernes",
      Saturday: "Sábado",
      Sunday: "Domingo",
    },
  },
};

export function LocationFooter({ locale = DEFAULT_LOCALE }: { locale?: Locale } = {}) {
  // Always resolved against the en-US weekday name: siteConfig.hours keys
  // its rows by English day name, so localizing this lookup would silently
  // stop highlighting today's row on the Spanish page. Only the *label*
  // below is translated.
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const copy = COPY[locale];

  return (
    <section className=" bg-white">
      <div className="container flex flex-col lg:flex-row lg:items-stretch">
        <div className="relative min-h-[420px] flex-1 lg:min-h-[560px]">
          <iframe
            title={`${copy.mapTitlePrefix} ${siteConfig.business.name}`}
            src={buildMapEmbedSrc()}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full border-0"
          />
          <LiquidGlass
            radius="rounded-none"
            className="absolute inset-x-4 bottom-4 bg-white/10 backdrop-blur-md backdrop-saturate-150 sm:inset-x-8 sm:bottom-8 sm:p-8"
          >
            <h2 className="font-display text-h2 text-navy-900">{copy.ourLocation}</h2>
            <address className="mt-2 font-alt text-footer-copy not-italic text-navy-900">
              {siteConfig.business.address.line1}, {siteConfig.business.address.suite}
              <br />
              {siteConfig.business.address.city}, {siteConfig.business.address.state}{" "}
              {siteConfig.business.address.zip}
            </address>
          </LiquidGlass>
        </div>

        <div className="flex flex-col gap-2 px-6 py-10 lg:w-[420px] lg:shrink-0 lg:py-16 lg:pl-14">
          <div>
            <h3 className="font-display text-3xl text-navy-900">{copy.hours}</h3>
            <div className="h-px w-full bg-navy-700" />
          </div>

          {siteConfig.hoursVerified ? (
            <table className="w-full font-alt text-footer-copy">
              <tbody>
                {siteConfig.hours.map((hours) => {
                  const isToday = hours.day === today;
                  return (
                    <tr key={hours.day} className="group border-t border-gray-200 first:border-t-0">
                      <th
                        scope="row"
                        className={cn(
                          "py-2 text-left font-normal text-navy-900 transition-colors duration-200 group-hover:text-teal-500",
                          isToday && "text-teal-500",
                        )}
                      >
                        {copy.day[hours.day] ?? hours.day}
                      </th>
                      <td
                        className={cn(
                          "py-2 text-right font-bold text-navy-900 transition-colors duration-200 group-hover:text-teal-500",
                          isToday && "text-teal-500",
                        )}
                      >
                        {hours.open} – {hours.close}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            // ATS-E4 (4.2): hours aren't confirmed yet — show a neutral
            // call-to-confirm instead of asserting unverified daily hours.
            <p className="font-alt text-footer-copy text-mute-400">
              {copy.confirmHours(siteConfig.business.phone)}
            </p>
          )}

          <div className=" gap-4 pt-4 sm:flex-row sm:items-center">
            <Link
              href={locale === "es" ? "/es/solicitar-cita" : siteConfig.bookingCta.href}
              className="group flex h-12 items-center justify-center gap-3 rounded-full bg-navy-900 px-8 font-sans text-button text-white transition-colors hover:bg-navy-700"
            >
              {copy.bookCta}
              <ArrowRightIcon className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
