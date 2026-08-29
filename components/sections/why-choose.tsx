import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { StarIcon } from "@/components/ui/icons/star";
import { Section } from "@/components/ui/section";
import { isVerified } from "@/content/verified-value";
import type { WhyChooseContent } from "@/content/why-choose";

export interface WhyChooseProps {
  content: WhyChooseContent;
}

/** "Why Choose Align the Spine Chiropractic" value-prop block per homepage
 * artboard (96:496–96:503), ATS-072: copy + CTA left, treatment-room photo
 * with a rating-chip overlay right (same pattern as DoctorProfile's portrait). */
export function WhyChoose({ content }: WhyChooseProps) {
  const { headingLines, body, cta, rating, image } = content;
  return (
    <Section spacing="lg">
      <Container className="flex flex-col gap-10 md:flex-row md:items-center md:gap-16">
        <div className="flex min-w-0 flex-1 flex-col items-start gap-6">
          <h2 className="font-display text-display text-navy-800">
            {headingLines.map((line, i) => (
              <span key={line}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </h2>
          <p className="font-sans text-body-lg text-ink-900">{body}</p>
          <Button variant="primary" href={cta.href} className="w-fit px-[2em]">
            {cta.label}
          </Button>
        </div>

        <div className="relative aspect-[913/685] overflow-hidden w-full shrink-0 md:w-[45%]">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 768px) 45vw, 100vw"
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
          {isVerified(rating) && (
            <div className="absolute left-4 bottom-4 bg-white/10 backdrop-blur-3xl border border-white/40 backdrop-saturate-150 backdrop-brightness-90">
              <div className="flex flex-col gap-2 px-6 py-4">
                <span className="font-sans text-stat-label text-white">
                  {rating.value.location}
                </span>
                <span
                  className="inline-flex items-center gap-2"
                  role="img"
                  aria-label={`Rated ${rating.value.value} out of 5 stars from ${rating.value.count} reviews`}
                >
                  <span className="inline-flex gap-1">
                    {Array.from({ length: rating.value.value }, (_, i) => (
                      <StarIcon key={i} className="h-5 w-5 text-white" />
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
      </Container>
    </Section>
  );
}
