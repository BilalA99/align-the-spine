import Image from "next/image";

import { DEFAULT_LOCALE, type Locale } from "@/content/i18n";
import type { ContentBlock } from "@/lib/content/types";

type HeadingBlock = Extract<ContentBlock, { type: "heading" }>;

function headingId(block: HeadingBlock) {
  return block.id;
}

export function ContentBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="article-prose">
      {blocks.map((block) => {
        switch (block.type) {
          case "paragraph":
            return <p key={block.id}>{block.text}</p>;
          case "heading": {
            const id = headingId(block);
            if (block.level === 2)
              return (
                <h2 key={block.id} id={id}>
                  {block.text}
                </h2>
              );
            if (block.level === 3)
              return (
                <h3 key={block.id} id={id}>
                  {block.text}
                </h3>
              );
            return (
              <h4 key={block.id} id={id}>
                {block.text}
              </h4>
            );
          }
          case "list": {
            const Tag = block.style === "ordered" ? "ol" : "ul";
            return (
              <Tag key={block.id}>
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </Tag>
            );
          }
          case "quote":
            return (
              <figure
                key={block.id}
                className="rounded-20 border-l-4 border-teal-500 bg-panel-100 p-6"
              >
                <blockquote>{block.text}</blockquote>
                {block.attribution ? (
                  <figcaption className="mt-3 text-sm text-ink-500">
                    — {block.attribution}
                  </figcaption>
                ) : null}
              </figure>
            );
          case "callout":
            return (
              <aside
                key={block.id}
                className={`content-callout content-callout-${block.tone}`}
                aria-label={block.title}
              >
                <h2>{block.title}</h2>
                <p>{block.text}</p>
              </aside>
            );
          case "image":
            return (
              <figure key={block.id}>
                <Image
                  src={`/api/content-assets/${block.assetId}`}
                  alt={block.decorative ? "" : block.alt}
                  width={1200}
                  height={800}
                  sizes="(min-width: 1024px) 760px, calc(100vw - 32px)"
                  className="h-auto w-full rounded-20 object-cover"
                />
                {block.caption ? <figcaption>{block.caption}</figcaption> : null}
              </figure>
            );
          case "table":
            return (
              <div
                key={block.id}
                className="overflow-x-auto"
                tabIndex={0}
                role="region"
                aria-label={block.caption}
              >
                <table>
                  <caption>{block.caption}</caption>
                  <thead>
                    <tr>
                      {block.headers.map((header) => (
                        <th key={header} scope="col">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <td key={`${rowIndex}-${cellIndex}`}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
        }
      })}
    </div>
  );
}

/** Groups a flat heading list into h2 sections with their h3s nested under
 * them, so the rendered list can actually show the nesting (a connecting
 * line + indent + weight/size step) instead of every heading reading as
 * the same flat, undifferentiated line of text. A leading h3 with no h2
 * yet (rare) still gets its own top-level entry rather than being dropped. */
function groupHeadings(headings: HeadingBlock[]) {
  const groups: { heading: HeadingBlock; children: HeadingBlock[] }[] = [];
  for (const heading of headings) {
    if (heading.level === 2 || groups.length === 0) {
      groups.push({ heading, children: [] });
    } else {
      groups[groups.length - 1].children.push(heading);
    }
  }
  return groups;
}

/** The only two strings this component owns, so the Spanish service-area
 * pages can reuse it rather than fork it. */
const TOC_LABEL: Record<Locale, string> = { en: "On this page", es: "En esta página" };

export function TableOfContents({
  blocks,
  locale = DEFAULT_LOCALE,
}: {
  blocks: ContentBlock[];
  locale?: Locale;
}) {
  const headings = blocks.filter(
    (block): block is HeadingBlock => block.type === "heading" && block.level <= 3,
  );
  if (headings.length < 3) return null;
  const groups = groupHeadings(headings);
  const label = TOC_LABEL[locale];
  return (
    <nav aria-label={label} className="rounded-20 bg-panel-100 p-6">
      <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.12em] text-navy-800">
        {label}
      </h2>
      <ol className="mt-4 space-y-4">
        {groups.map((group, index) => (
          <li key={group.heading.id}>
            <a
              href={`#${group.heading.id}`}
              className="flex items-baseline gap-2 font-sans text-[15px] font-semibold leading-snug text-navy-800 transition-colors hover:text-teal-500"
            >
              <span aria-hidden="true" className="shrink-0 text-xs font-semibold text-teal-500">
                {String(index + 1).padStart(2, "0")}
              </span>
              {group.heading.text}
            </a>
            {group.children.length > 0 && (
              <ol className="mt-2 ml-2.5 space-y-1.5 border-l-2 border-mute-300 pl-4">
                {group.children.map((child) => (
                  <li key={child.id}>
                    <a
                      href={`#${child.id}`}
                      className="block font-sans text-sm leading-snug text-ink-500 transition-colors hover:text-teal-500"
                    >
                      {child.text}
                    </a>
                  </li>
                ))}
              </ol>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
