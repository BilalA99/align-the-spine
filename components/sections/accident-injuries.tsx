import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { ServiceGrid } from "@/components/ui/service-grid";
import { accidentInjuries, buildAccidentInjuries } from "@/content/accident-injuries";

/** "Common accident injuries we treat" grid per homepage artboard (Group 17,
 * 96:292–96:325): reuses ServiceGrid/ServiceCard, fed by
 * content/accident-injuries.ts.
 *
 * ATS-SEO-042: a still-draft card falls back to linking the
 * /car-accident-chiropractor page — pass `isAccidentPage` on that one page
 * itself so a card doesn't link back to the page it's already on. */
export function AccidentInjuries({ isAccidentPage = false }: { isAccidentPage?: boolean } = {}) {
  const items = isAccidentPage
    ? buildAccidentInjuries({ skipAccidentPageFallback: true })
    : accidentInjuries;
  return (
    <Section>
      <Container className="flex flex-col gap-14">
        <SectionHeading eyebrow="What we treat" className="items-center font-semibold text-center">
          Common accident injuries we treat
        </SectionHeading>
        <ServiceGrid items={items} />
      </Container>
    </Section>
  );
}
