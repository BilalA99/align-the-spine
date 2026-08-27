import { describe, expect, it } from "vitest";

import { accidentInjuries } from "@/content/accident-injuries";
import { esAccidentInjuries, esServices } from "@/content/es/home";
import { esLeadFormVariants } from "@/content/es/lead-forms";
import { esServicesGrid } from "@/content/es/pages";
import { leadFormVariants } from "@/content/lead-forms";
import { services } from "@/content/services";
import { servicesGrid } from "@/content/services-grid";

/** Spanish ↔ English content parity.
 *
 * The Spanish content modules under content/es/ are hand-written mirrors of
 * the English ones. Nothing structurally forces them to stay in step: an
 * English array can gain an entry, lose one, or reorder, and the Spanish
 * copy will keep compiling and keep rendering — just showing a different,
 * staler set of things than the English page does.
 *
 * That is exactly what happened once already. Upstream added "Car
 * Accidents" and "Cupping Therapy" to `servicesGrid` while the Spanish
 * layer was being built on an older base; after the rebase, /services
 * listed eight services and /es/servicios listed six, silently.
 *
 * These tests compare on `slug` / field `name` — the structural identity of
 * each item — not on prose, which is *supposed* to differ. They can't
 * detect a stale sentence, but they do catch the failure that actually
 * bites: the two languages offering a different set of things.
 */

const slugs = (items: { slug: string }[]) => items.map((item) => item.slug).sort();

describe("service lists", () => {
  it("offers the same services on the homepage list in both languages", () => {
    expect(slugs(esServices)).toEqual(slugs(services));
  });

  it("offers the same services in the /services grid in both languages", () => {
    expect(slugs(esServicesGrid)).toEqual(slugs(servicesGrid));
  });

  it("lists the same accident injuries in both languages", () => {
    expect(slugs(esAccidentInjuries)).toEqual(slugs(accidentInjuries));
  });
});

describe("lead forms", () => {
  /** The Spanish presets deliberately cover a subset of the English
   * variants — only the ones a Spanish page actually renders. What must
   * hold is that where a variant exists in both, it posts an identical
   * payload: /api/lead picks its server-side schema by variant name and
   * re-validates the submitted field names, so a Spanish form that asked
   * for different fields would be rejected outright. */
  const sharedVariants = Object.keys(esLeadFormVariants).filter(
    (key) => key in leadFormVariants,
  ) as (keyof typeof esLeadFormVariants & keyof typeof leadFormVariants)[];

  it("covers at least the variants the Spanish pages render", () => {
    expect(sharedVariants.length).toBe(Object.keys(esLeadFormVariants).length);
  });

  it.each(sharedVariants)("posts identical field names for %s", (variant) => {
    const en = leadFormVariants[variant];
    const es = esLeadFormVariants[variant];
    expect(es.fields.map((field) => field.name)).toEqual(en.fields.map((field) => field.name));
  });

  it.each(sharedVariants)("keeps the same variant key for %s", (variant) => {
    expect(esLeadFormVariants[variant].variant).toBe(leadFormVariants[variant].variant);
  });

  it.each(sharedVariants)("keeps identical select option values for %s", (variant) => {
    const enOptions = leadFormVariants[variant].fields.flatMap((field) =>
      (field.options ?? []).map((option) => option.value),
    );
    const esOptions = esLeadFormVariants[variant].fields.flatMap((field) =>
      (field.options ?? []).map((option) => option.value),
    );
    // Labels are translated; values are the payload the practice's pipeline
    // reads, so they must match exactly.
    expect(esOptions).toEqual(enOptions);
  });
});

describe("images stay shared across languages", () => {
  /** Spanish entries translate `alt` but must point at the same asset —
   * a Spanish page showing a different photo than its English counterpart
   * is drift, not localization. */
  it("uses the same service images", () => {
    const enBySlug = new Map(servicesGrid.map((item) => [item.slug, item.image.src]));
    for (const item of esServicesGrid) {
      expect(item.image.src).toBe(enBySlug.get(item.slug));
    }
  });

  it("uses the same accident-injury images", () => {
    const enBySlug = new Map(accidentInjuries.map((item) => [item.slug, item.image.src]));
    for (const item of esAccidentInjuries) {
      expect(item.image.src).toBe(enBySlug.get(item.slug));
    }
  });
});
