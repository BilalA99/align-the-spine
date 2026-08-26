import type { ConditionFaq } from "@/content/conditions/types";

/** Bespoke content for the dedicated /conditions/tmj-jaw-pain page — same
 * per-condition, hand-built approach as the other condition pages and the
 * /services/* pages built this pass. Pulled from the Figma `TMJ/Jawpain`
 * frame (file 3oNk0hDle8VMrPJQ0W0pDG, node 273:872) via get_metadata
 * (get_design_context and download_assets were both unavailable — Figma
 * MCP tool-call limit reached mid-session, same constraint noted on
 * cervicogenic-headache-page.ts and concussion-page.ts).
 *
 * Same pattern as the other two "accident injury" frames built this pass:
 * - The hero eyebrow was literal leftover concussion-page copy ("Hit your
 *   head or felt dazed after a car accident?" on a jaw-pain page) —
 *   replaced with genuine TMJ-appropriate copy.
 * - The doctor-bio band and FAQ are the same leftover massage-soft-tissue
 *   copy found on every other frame this pass — bio reuses the shared,
 *   scrubbed doctorProfileContent instead, FAQ is bespoke.
 * - A "types-of-tmj-dysfunction" section exists (symptom list, related
 *   conditions, a "spectrum" bar from acute to chronic, a bruxism note)
 *   but all of its text lives inside a component instance (SectionTitle/
 *   SymptomText/CardTitle/SpectrumHeading/etc. slot names, not literal
 *   text) that only get_design_context can resolve — unavailable this
 *   pass, so it's skipped rather than guessed, same as the equivalent
 *   section on concussion-page.ts.
 *
 * What IS genuine to this frame: the Hero and the Understanding section
 * below.
 *
 * ATS-E4 compliance scrubbing applied, same as every other page this pass
 * touched: the hero footerNote's hardcoded city list is neutralized, and
 * the closing CTA band's "Same-day visits, seven days a week" claim is
 * removed.
 *
 * Deviation from the design-to-code skill's normal asset flow: the hero
 * background photo shares the same Figma source node
 * (hf_20260717_002604_...) as the cervicogenic-headache and concussion
 * pages' heroes, which also couldn't be downloaded — reuses the same
 * /figma-exports/drabe-headache.png substitute for consistency. No photo
 * was specified for the Understanding section in this frame (unlike the
 * other two), so it reuses /figma-exports/dr-abe-neck.png, matching the
 * other two pages' Understanding-section photo. */

export const tmjJawPainHero = {
  eyebrowChip: "Jaw pain, tightness, or clicking?",
  h1: "TMJ / Jaw Pain Chiropractor in Deerfield Beach, FL",
  subhead:
    "Dr. Abe evaluates jaw-joint movement, surrounding muscle tension, and neck-related factors before deciding whether chiropractic care may be appropriate.",
  backgroundImage: {
    src: "/figma-exports/drabe-headache.png",
    alt: "Dr. Abe Nasser examining a patient after a car accident",
  },
};

// ATS-SEO-043: plain path config — see content/back-pain-page.ts's
// identical note for why (circular import via content/seo.ts).
export const tmjJawPainRelatedBottomConfig = {
  paths: [
    "/conditions/neck-pain",
    "/conditions/cervicogenic-headache",
    "/conditions",
    "/car-accident-chiropractor",
    "/blog",
    "/book-an-appointment",
  ],
  highlightPath: "/book-an-appointment",
};

export const tmjJawPainFaq: ConditionFaq = {
  headerTail: "TMJ and jaw pain",
  items: [
    {
      q: "Can a car accident really cause TMJ problems?",
      a: "A collision can strain the jaw joint or surrounding muscles, especially when the jaw is clenched during impact. An evaluation is needed because jaw symptoms can have several causes.",
    },
    {
      q: "What does TMJ dysfunction feel like?",
      a: "Common signs include clicking or popping when you open your mouth, jaw pain or tightness, difficulty chewing, and headaches that trace back to the jaw joint rather than the neck.",
    },
    {
      q: "How is TMJ dysfunction treated?",
      a: "Treatment depends on what the evaluation finds — it can include gentle joint mobilization, soft-tissue work on the surrounding muscles, and guidance on habits (like clenching) that keep aggravating it.",
    },
    {
      q: "How many visits will I need?",
      a: "It varies with the cause, exam findings, and ongoing factors such as clenching or grinding. Dr. Abe reassesses progress rather than promising a fixed number of visits.",
    },
  ],
};
