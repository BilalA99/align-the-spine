import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PinIcon } from "@/components/ui/icons/pin";
import { StarIcon } from "@/components/ui/icons/star";
import { Section } from "@/components/ui/section";
import type { DoctorProfileContent } from "@/content/doctor-profile";
import { isVerified } from "@/content/verified-value";

export interface DoctorProfileProps {
  variant: "short" | "long";
  content: DoctorProfileContent;
  /** Rendered as its own section right after the profile block, only when
   * variant is "long" — reserved for ATS-091's History + HOW HE PRACTICES
   * cards. */
  extended?: ReactNode;
  /** The "Meet Dr. Abe" cross-link rendered under the CTA on the "short"
   * variant. Defaults to the English /about page; the Spanish pages pass
   * their own so a Spanish reader isn't dropped into English. */
  doctorLink?: { href: string; label: string };
}

/** "THE DOCTOR BEHIND YOUR CARE" block per condition-page-spec §B6: portrait
 * (r30) with an overlaid rating chip (stars + count + location, r20, dark
 * 20%-opacity overlay) on the left, eyebrow/name/bio/CTA on the right.
 * Portrait-left matches the actual Figma layout (file NHwBqbGepOspY0GrCnECnj,
 * nodes 96:471–96:495), not the ticket text's stated left/right order.
 * Row split is `xl:`, not `md:` — the "cta" Button variant jumps to its
 * big 35px label + 64px icon badge at `sm:` and up, which doesn't fit the
 * 45/55 columns' text side until the column itself is wide enough (tested
 * clean at 1280/1440; 768–1024 wrapped the "Book with Dr. Abe" label and
 * clipped against the button's fixed height — ATS-092 responsive pass,
 * same class of tablet-cramping bug SpineAnatomy had in ATS-073).
 *
 * `extended` renders as a sibling of this component's own <Section>, not
 * nested inside it — the "long" variant's History band has its own
 * full-bleed navy background, distinct from this block's white one. */
export function DoctorProfile({
  variant,
  content,
  extended,
  doctorLink = { href: "/about", label: "Meet Dr. Abe" },
}: DoctorProfileProps) {
  const { eyebrow, name, bio, cta, rating, portrait } = content;
  return (
    <>
      <Section spacing="lg">
        <Container className="flex flex-col gap-10 xl:flex-row xl:items-center xl:gap-16">
          <div className="relative mx-auto aspect-square overflow-hidden w-full max-w-sm shrink-0 xl:mx-0 xl:w-[40%] xl:max-w-none">
            <Image
              src={portrait.src}
              alt={portrait.alt}
              fill
              sizes="(min-width: 1280px) 45vw, 100vw"
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
            {isVerified(rating) && (
              <div className="absolute inset-x-0 bottom-0 bg-white/10 backdrop-blur-3xl border border-white/40 backdrop-saturate-150 backdrop-brightness-90">
                <div className="flex items-center justify-between gap-3 px-6 py-4">
                  <span className="inline-flex items-center gap-2 font-sans text-stat-label text-white">
                    <PinIcon className="h-4 w-4 shrink-0" />
                    {rating.value.location}
                  </span>
                  <span
                    className="inline-flex items-center gap-2"
                    role="img"
                    aria-label={`Rated ${rating.value.value} out of 5 stars from ${rating.value.count} reviews`}
                  >
                    <span className="inline-flex gap-1">
                      {Array.from({ length: rating.value.value }, (_, i) => (
                        <StarIcon key={i} className="h-5 w-5 text-gold-400" />
                      ))}
                    </span>
                    <span aria-hidden="true" className="font-sans text-stat-label text-white">
                      {rating.value.count}
                    </span>
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col items-start gap-4">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 className="font-display font-semibold text-doctor-name text-navy-900">{name}</h2>
            <p className="font-sans text-body-lg text-ink-900">{bio}</p>
            <div className="flex flex-wrap items-center gap-6">
              <Button variant="primary" href={cta.href} className="w-fit px-[2em]">
                Call {cta.label}
              </Button>
              {/* ATS-SEO-050: variant "long" only ever renders on /about
               * itself (the one page that passes it) — every "short" usage
               * elsewhere is a real cross-page link, never a self-link. */}
              {variant === "short" && (
                <Link
                  href={doctorLink.href}
                  className="font-sans text-body-lg text-navy-900 underline"
                >
                  {doctorLink.label}
                </Link>
              )}
            </div>
          </div>
        </Container>
      </Section>
      {variant === "long" && extended}
    </>
  );
}
