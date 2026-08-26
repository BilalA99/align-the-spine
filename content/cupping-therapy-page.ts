import type { ConditionFaq } from "@/content/conditions/types";

/** Lean, dedicated content for /services/cupping-therapy (IA-03). No Figma
 * design exists for this route — cupping is a single technique, not a full
 * treatment category like the other 3 /services/* pages, so this
 * deliberately doesn't copy their full hero/comparison-table/doctor-bio/
 * FAQ template (see app/services/cupping-therapy/page.tsx's doc comment).
 * Content here stays close to the already-verified summary in
 * content/services.ts's "cupping-therapy" entry rather than introducing new
 * clinical claims. */

export const cuppingTherapyHero = {
  eyebrowChip: "Localized muscle tension?",
  h1: "Cupping Therapy in Deerfield Beach, FL",
  subhead:
    "Localized suction applied to selected areas of muscle tension, used when appropriate alongside a chiropractic evaluation by Dr. Abe.",
  backgroundImage: {
    src: "/figma-exports/cupping-drabe.png",
    alt: "Cupping therapy treatment",
  },
};

// ATS-SEO-043: this page had exactly one outbound link in its entire body
// (to /services/soft-tissue-therapy) — no accident-care, condition, or
// blog link at all, a genuinely weak-links page per this ticket's audit.
// Plain path config, resolved by buildRelatedLinks()
// (content/related-links.ts) from the page component, not here —
// content/seo.ts imports cuppingTherapyHero from this same file, so
// importing related-links.ts here (which itself imports content/seo.ts)
// would be a circular import.
export const cuppingTherapyRelatedConfig = {
  paths: [
    "/conditions/whiplash",
    "/conditions/neck-pain",
    "/car-accident-chiropractor",
    "/blog",
    "/book-an-appointment",
  ],
  highlightPath: "/book-an-appointment",
};

export const cuppingTherapyFaq: ConditionFaq = {
  headerTail: "cupping therapy",
  items: [
    {
      q: "What is cupping therapy?",
      a: "Cupping applies localized suction to selected areas of muscle tension using cups placed on the skin. It may be included alongside other soft-tissue work when appropriate for your neck, back, or other concerns.",
    },
    {
      q: "How is cupping different from a massage?",
      a: "A massage uses hands-on pressure; cupping uses suction to draw blood flow to a specific area of tension. Dr. Abe selects the technique — or combination — based on your evaluation, not a fixed routine.",
    },
    {
      q: "Is cupping right for everyone?",
      a: "It's used when appropriate for selected areas of muscle tension after an evaluation. Dr. Abe will let you know whether it fits your case, or whether a different soft-tissue technique is a better starting point.",
    },
    {
      q: "Is this covered under my accident claim?",
      a: "If your treatment is accident-related, we document every session so it's on record for your claim. Coverage details depend on your specific policy — we're happy to help however we can.",
    },
  ],
};
