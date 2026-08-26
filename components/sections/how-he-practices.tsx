import Image from "next/image";

import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Section } from "@/components/ui/section";
import {
  homeVisitCallout,
  howHePracticesCards,
  type HomeVisitCallout,
  type PracticeCard,
} from "@/content/how-he-practices";

/** "HOW HE PRACTICES" section per the about-drabe artboard (96:3244–96:4348),
 * ATS-090/091: a 3-card "What patients actually notice" row (image, title,
 * one-line description — no CTA, per artboard), then a full-width
 * home-vs-office callout image under "The office, when you'd rather come
 * to us". */
export interface HowHePracticesProps {
  cards?: PracticeCard[];
  eyebrow?: string;
  heading?: string;
  callout?: HomeVisitCallout;
}

export function HowHePractices({
  cards = howHePracticesCards,
  eyebrow = "How he practices",
  heading = "What patients actually notice",
  callout = homeVisitCallout,
}: HowHePracticesProps = {}) {
  return (
    <Section spacing="lg">
      <Container className="flex flex-col gap-14">
        <div className="flex flex-col items-center gap-3 text-center">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="font-display text-h2 text-navy-800">{heading}</h2>
        </div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          {cards.map((card) => (
            <div key={card.title} className="flex flex-col gap-4 group">
              <div className="relative aspect-507/283 w-full shrink-0 overflow-hidden">
                <Image
                  src={card.image.src}
                  alt={card.image.alt}
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="break-words font-display text-card-title text-navy-800 group-hover:text-teal-500 transition-colors duration-300">
                  {card.title}
                </h3>
                <hr className="border-t border-navy-900 transition-colors duration-300 group-hover:border-teal-500" />
                <p className="font-sans text-card-body text-ink-900">{card.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-3 text-center">
          <h2 className="font-display text-h2 text-navy-800">{callout.heading}</h2>
          <p className="max-w-2xl font-sans text-body-lg text-ink-900">{callout.body}</p>
        </div>
      </Container>
    </Section>
  );
}
