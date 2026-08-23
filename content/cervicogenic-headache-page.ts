import type { ConditionFaq, ConditionFeelsLikeItem } from "@/content/conditions/types";

/** Bespoke content for the dedicated /conditions/cervicogenic-headache page
 * — same per-condition, hand-built approach as /conditions/back-pain and
 * /conditions/neck-pain (ATS-137), and the same per-page approach as the
 * 3 /services/* pages built this pass. Pulled from the Figma
 * `Cervicogenic Headache` frame (file 3oNk0hDle8VMrPJQ0W0pDG, node
 * 138:462) via get_metadata (get_design_context and download_assets were
 * both unavailable — Figma MCP tool-call limit reached mid-session).
 *
 * This frame is built on top of the massage-soft-tissue frame rather than
 * from scratch: only the Hero and "Understanding"/"What it feels like"
 * sections are genuinely cervicogenic-headache content — everything below
 * that (the FAQ, the "Conditions X relieves" list, the doctor-bio band) is
 * literal leftover massage-soft-tissue copy, unchanged apart from the H1.
 * Kept genuinely headache-specific content for the FAQ and skipped the
 * leftover "Conditions X relieves" list entirely rather than force
 * unrelated content onto a headache page (its differentiation job is
 * already done by the "what it feels like" grid below).
 *
 * ATS-E4 compliance scrubbing applied, same as every other page this pass
 * touched: the hero subhead's "Same-day evaluation... billed directly to
 * PIP" claim is removed/neutralized, and the closing CTA band's "Same-day
 * visits, seven days a week" claim is removed. The doctor-bio band's
 * "billed directly to your PIP claim" claim is dropped entirely (page
 * reuses the already-scrubbed shared doctorProfileContent bio instead).
 *
 * Deviation from the design-to-code skill's normal asset flow: the hero
 * background photo (node "hf_20260717_002604_...") couldn't be downloaded
 * because of the Figma tool-call limit, so this reuses the existing
 * /figma-exports/drabe-headache.png asset (already shipped on /services,
 * same subject matter) rather than inventing or guessing a substitute. */

export const cervicogenicHeadacheHero = {
  eyebrowChip: "Headaches that started after a car accident?",
  h1: "Cervicogenic Headache Chiropractor in Deerfield Beach, FL",
  subhead:
    "A cervicogenic headache is referred pain from the neck. Dr. Abe evaluates neck motion and related musculoskeletal factors before recommending care.",
  backgroundImage: {
    src: "/figma-exports/drabe-headache.png",
    alt: "Dr. Abe Nasser examining a patient for headache-related neck tension",
  },
};

export const cervicogenicHeadacheFeelsLike: ConditionFeelsLikeItem[] = [
  {
    title: "Base-of-skull ache",
    desc: "Starts at the back of the head and radiates forward.",
    learnMoreHref: "/conditions/neck-pain",
  },
  {
    title: "One-sided pressure",
    desc: "Stays on one side, unlike a typical tension headache.",
    learnMoreHref: "/conditions/whiplash",
  },
  {
    title: "Worse with movement",
    desc: "Turning or tilting the head triggers or intensifies it.",
    learnMoreHref: "/services/chiropractic-adjustments",
  },
  {
    title: "May persist with medication",
    desc: "Medication may ease pain without addressing a neck-related contributor.",
    learnMoreHref: "/services/spinal-decompression",
  },
];

export interface CervicogenicHeadacheCondition {
  name: string;
  description: string;
  image: { src: string; alt: string };
}

/** "Conditions cervicogenic headache relieves" list — related conditions
 * that either cause or commonly overlap with a cervicogenic headache after
 * a collision, each linking to its own dedicated condition page. */
export const cervicogenicHeadacheConditions: CervicogenicHeadacheCondition[] = [
  {
    name: "Whiplash",
    description:
      "The neck injury that most often triggers this type of headache after a collision.",
    image: {
      src: "/figma-exports/decompression-whiplash-disc.png",
      alt: "Hand assessing a patient's neck after whiplash",
    },
  },
  {
    name: "Neck Pain",
    description: "Ongoing stiffness and tension in the neck that radiates upward into a headache.",
    image: {
      src: "/figma-exports/drabe-shoulder.png",
      alt: "Dr. Abe Nasser treating a patient's neck and shoulder",
    },
  },
  {
    name: "TMJ / Jaw Pain",
    description: "Jaw clenching and joint strain from impact that can compound headache symptoms.",
    image: {
      src: "/figma-exports/drabe-head.png",
      alt: "Hands treating a patient's head and jaw",
    },
  },
  {
    name: "Concussion",
    description: "A head injury that can overlap with or mask a cervicogenic headache's symptoms.",
    image: {
      src: "/figma-exports/align-thespne-neck.png",
      alt: "Dr. Abe Nasser examining a patient's neck",
    },
  },
];

// ATS-SEO-043: this page's own doc comment (app/conditions/
// cervicogenic-headache/page.tsx) already documented a "RelatedConditions
// (8-pill bottom row)" section in its stated section order, but no such
// component was ever actually rendered — a real doc/implementation drift,
// and this page's own family (condition pages) is exactly where this
// ticket's audit was scoped to look. Plain path config, resolved by
// buildRelatedLinks() (content/related-links.ts) from the page component,
// not here — content/seo.ts imports cervicogenicHeadacheHero from this
// same file, so importing related-links.ts here (which itself imports
// content/seo.ts) would be a circular import.
export const cervicogenicHeadacheRelatedBottomConfig = {
  paths: [
    "/conditions/whiplash",
    "/conditions/neck-pain",
    "/conditions",
    "/car-accident-chiropractor",
    "/blog",
    "/book-an-appointment",
  ],
  highlightPath: "/book-an-appointment",
};

export const cervicogenicHeadacheFaq: ConditionFaq = {
  headerTail: "cervicogenic headaches",
  items: [
    {
      q: "Can a car accident cause headaches that show up weeks later?",
      a: "Headaches can begin after an accident or become noticeable later, but timing alone does not identify the cause. New, severe, or worsening headaches after a collision need prompt medical evaluation.",
    },
    {
      q: "How do I know if my headache is coming from my neck?",
      a: "Cervicogenic headaches may be one-sided and may worsen with neck movement or limited range of motion. A clinician must evaluate the symptoms because several headache types can overlap.",
    },
    {
      q: "Will pain medication help?",
      a: "Medication may reduce pain for some people, but it does not determine whether the neck is contributing. Discuss medication questions with the prescribing clinician and seek evaluation for persistent symptoms.",
    },
    {
      q: "How many visits will I need?",
      a: "It depends on the cause, exam findings, and response to care. Dr. Abe reassesses progress rather than promising a fixed number of visits.",
    },
  ],
};
