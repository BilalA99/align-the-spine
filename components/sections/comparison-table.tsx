import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { CheckIcon } from "@/components/ui/icons/check";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  autoAccidentComparisonRows,
  comparisonTableColumnHeadings,
  comparisonTableEyebrow,
  comparisonTableFootnote,
  comparisonTableHeading,
  comparisonTableRows,
  comparisonTableSubheading,
  type ComparisonRow,
} from "@/content/comparison-table";
import { esComparisonCopy } from "@/content/es/auto-accident";
import { DEFAULT_LOCALE, type Locale } from "@/content/i18n";
import { cn } from "@/lib/cn";

export interface ComparisonTableProps {
  variant?: "default" | "auto-accident";
  className?: string;
  /** Language for the headings, column labels, rows and footnote.
   * Defaults to English; content/es/auto-accident.ts holds the Spanish
   * set, including the Spanish rows (a translated row is still the same
   * claim, so the two lists stay in lockstep by construction). */
  locale?: Locale;
}

/** "Align the Spine vs Traditional Clinic" comparison per condition-page-spec
 * §B5, §C. Rows are data-driven (content/comparison-table.ts); the
 * "auto-accident" variant appends 2 extra rows (continuity-of-doctor,
 * attorney-referral note) for /auto-accidents. The 3-column grid table only
 * renders at `lg`+ — below that it collapsed to a horizontally scrolling
 * grid that cut columns off mid-word, so <lg renders each row as its own
 * stacked card instead (no scroll needed at any width). */
export function ComparisonTable({
  variant = "default",
  className,
  locale = DEFAULT_LOCALE,
}: ComparisonTableProps) {
  const copy =
    locale === "es"
      ? {
          eyebrow: esComparisonCopy.eyebrow,
          heading: esComparisonCopy.heading,
          subheading: esComparisonCopy.subheading,
          columnHeadings: esComparisonCopy.columnHeadings,
          footnote: esComparisonCopy.footnote,
          rows: esComparisonCopy.rows,
          autoAccidentRows: esComparisonCopy.autoAccidentRows,
        }
      : {
          eyebrow: comparisonTableEyebrow,
          heading: comparisonTableHeading,
          subheading: comparisonTableSubheading,
          columnHeadings: comparisonTableColumnHeadings,
          footnote: comparisonTableFootnote,
          rows: comparisonTableRows,
          autoAccidentRows: autoAccidentComparisonRows,
        };
  const rows = variant === "auto-accident" ? [...copy.rows, ...copy.autoAccidentRows] : copy.rows;

  return (
    <Section className={className}>
      <Container>
        <div className="flex flex-col gap-10 md:gap-12">
          <SectionHeading
            eyebrow={comparisonTableEyebrow}
            tone="navy-900"
            sub={comparisonTableSubheading}
            className="mx-auto max-w-2xl font-semibold items-center text-center"
          >
            {comparisonTableHeading}
          </SectionHeading>

          <Card radius={30} shadow="comparison" className="hidden overflow-hidden lg:block">
            <div className="grid grid-cols-3">
              <div className="bg-panel-100 px-3 py-4 md:px-8">
                <p className="font-display text-3xl font-normal text-ink-900">
                  {comparisonTableColumnHeadings.careBenefits}
                </p>
              </div>
              <div className=" bg-navy-900 px-3 py-4 md:px-8">
                <p className="font-display text-3xl font-normal text-white">
                  {comparisonTableColumnHeadings.alignTheSpine}
                </p>
              </div>
              <div className="px-3 py-4 md:px-8">
                <p className="font-display text-3xl font-normal text-mute-350">
                  {comparisonTableColumnHeadings.traditionalClinic}
                </p>
              </div>

              {rows.map((row, index) => (
                <ComparisonRowCells key={row.label} row={row} isLast={index === rows.length - 1} />
              ))}
            </div>

            <p className="border-t border-mute-300 px-6 py-6 text-center font-sans text-small-print text-mute-400 md:px-8">
              {comparisonTableFootnote}
            </p>
          </Card>

          <div className="flex flex-col gap-4 lg:hidden">
            {rows.map((row) => (
              <ComparisonRowCard key={row.label} row={row} />
            ))}
            <p className="px-2 text-center font-sans text-small-print text-mute-400">
              {comparisonTableFootnote}
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}

function ComparisonRowCells({ row, isLast }: { row: ComparisonRow; isLast: boolean }) {
  return (
    <>
      <div className="flex items-center border-t border-mute-300 px-6 py-6 md:px-8">
        <p className="font-sans text-stat-label text-ink-900">{row.label}</p>
      </div>
      <div className={cn("flex items-center gap-3 bg-navy-900 px-6 py-6 md:px-8")}>
        <CheckIcon className="h-4 w-4 shrink-0 text-teal-500" />
        <p className="font-sans text-stat-label text-white">{row.alignTheSpine}</p>
      </div>
      <div className="flex items-center border-t border-mute-300 px-6 py-6 md:px-8">
        <p className="font-sans text-stat-label text-ink-500">{row.traditionalClinic}</p>
      </div>
    </>
  );
}

/** <lg row card: label, then the two options stacked instead of side by
 * side, so nothing needs a min-width or horizontal scroll to stay legible. */
function ComparisonRowCard({ row }: { row: ComparisonRow }) {
  return (
    <Card radius={20} shadow="card" className="overflow-hidden">
      <div className="border-b border-mute-300 px-4 py-2">
        <p className="font-sans text-stat-label font-medium text-ink-900">{row.label}</p>
      </div>
      <div className="flex items-start gap-3 bg-navy-900 px-4 py-2">
        <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" />
        <div className="flex flex-col gap-0.5">
          <span className="font-sans text-[11px] uppercase tracking-wide text-mute-300">
            {comparisonTableColumnHeadings.alignTheSpine}
          </span>
          <span className="font-sans text-stat-label text-white">{row.alignTheSpine}</span>
        </div>
      </div>
      <div className="flex flex-col gap-0.5 px-4 py-2">
        <span className="font-sans text-[11px] uppercase tracking-wide text-mute-400">
          {comparisonTableColumnHeadings.traditionalClinic}
        </span>
        <span className="font-sans text-stat-label text-ink-500">{row.traditionalClinic}</span>
      </div>
    </Card>
  );
}
