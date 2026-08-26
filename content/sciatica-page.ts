import type {
  ConditionAccident,
  ConditionFaq,
  ConditionFeelsLikeItem,
  ConditionTreatmentItem,
  ConditionWarning,
} from "@/content/conditions/types";
import { siteConfig } from "@/content/site";

/** Bespoke content for the dedicated /conditions/sciatica page — same
 * per-condition, hand-built approach as back-pain/neck-pain (ATS-137).
 * Pulled from the Figma `sciatica` frame (file 4mb4VDHszsaj2KEZzyjOjf,
 * node 96:813) via get_metadata/get_design_context, cross-checked against
 * the 12 design screenshots provided directly.
 *
 * Unlike back-pain and neck-pain, this frame's "Was this from an
 * accident?" banner and FAQ are NOT a copy-paste mismatch — this genuinely
 * is the Sciatica page, so that literal Figma copy is kept as-is (no
 * deviation needed here). The FAQ's 4th item is a literal duplicate of the
 * 3rd in the Figma frame ("Will I need surgery for a herniated disc?"
 * twice) — replaced with a distinct 4th question instead of shipping a
 * duplicate. */

export const sciaticaHero = {
  eyebrowChip: "Sciatica or nerve pain radiating down?",
  h1: "Sciatica Chiropractor in Deerfield Beach, FL",
  subhead:
    "Evaluation and decompression-focused treatment for sciatic and radiating nerve pain, with in-home visits available when it applies to your case.",
  backgroundImage: {
    src: "/figma-exports/drabe-backpain-front.png",
    alt: "Hands-on lower-back soft-tissue treatment",
  },
};

export const sciaticaSymptoms: string[] = [
  "Sharp, burning, or electric-shock-like pain",
  "Pain that worsens with sitting or coughing",
  "Numbness and tingling in the leg or foot",
  "Muscle weakness in the affected leg",
  "Localized pain in the buttock area",
];

// ATS-SEO-043: plain path config — see content/back-pain-page.ts's
// identical note for why (circular import via content/seo.ts).
export const sciaticaRelatedMidPageConfig = {
  paths: ["/conditions/back-pain", "/services/spinal-decompression", "/car-accident-chiropractor"],
  highlightPath: "/services/spinal-decompression",
};

export const sciaticaHowWeTreat: ConditionTreatmentItem[] = [
  {
    title: "Myofascial Release/Trigger Point",
    desc: "The piriformis and surrounding muscles often tighten around the sciatic nerve, adding to the pain. The Graston tool releases that tension directly, similar to a deep massage focused on the area compressing the nerve.",
    image: {
      src: "/figma-exports/how-we-treat-1.png",
      alt: "Myofascial release and trigger point therapy with the Graston tool",
    },
    meta: "1 hr",
    ctaLabel: "BOOK NOW",
    ctaHref: siteConfig.bookingCta.href,
  },
  {
    title: "Adjustment",
    desc: "When exam findings suggest restricted lower-spine joint motion contributes to symptoms, Dr. Abe may include a controlled adjustment as part of the care plan.",
    image: {
      src: "/figma-exports/how-we-treat-2.png",
      alt: "Dr. Abe performing a chiropractic adjustment",
    },
    meta: "1 hr",
    ctaLabel: "BOOK NOW",
    ctaHref: siteConfig.bookingCta.href,
  },
  {
    title: "Traction/Decompression",
    desc: "When a disc or narrowing around a nerve may contribute to sciatica symptoms, controlled traction can be considered after evaluation for suitability.",
    image: {
      src: "/figma-exports/how-we-treat-3.png",
      alt: "Spinal traction and decompression therapy",
    },
    meta: "1 hr",
    ctaLabel: "BOOK NOW",
    ctaHref: siteConfig.bookingCta.href,
  },
  {
    title: "Home Visit Care",
    desc: "Sciatica can make sitting in a car unbearable. We bring the full exam and treatment to you when getting to the office isn't realistic.",
    image: {
      src: "/figma-exports/how-we-treat-4.png",
      alt: "Dr. Abe providing chiropractic care at a patient's home",
    },
    meta: "Check eligibility",
    ctaLabel: "CHECK ELIGIBILITY",
    ctaHref: "/home-visit-chiropractor",
  },
];

export const sciaticaFeelsLike: ConditionFeelsLikeItem[] = [
  {
    title: "Radiating leg pain",
    desc: "Pain that travels from the lower back through the buttocks and down the leg.",
    learnMoreHref: "/services/spinal-decompression",
  },
  {
    title: "Shooting or burning",
    desc: "A sharp, electric sensation that travels along the sciatic nerve path.",
    learnMoreHref: "/services#adjustments",
  },
  {
    title: "Numbness or tingling",
    desc: "Pins and needles or loss of sensation specifically in the leg or foot.",
    learnMoreHref: "/services/spinal-decompression",
  },
  {
    title: "Muscle weakness",
    desc: 'Difficulty moving the foot or leg, often feeling "heavy" or unresponsive during activity.',
    learnMoreHref: "/services/soft-tissue-therapy",
  },
];

export const sciaticaWarning: ConditionWarning = {
  heading: "See a doctor promptly if you notice:",
  image: {
    src: "/figma-exports/drabe-back.png",
    alt: "Dr. Abe examining a patient's lower back",
  },
  bullets: [
    { label: "Pain radiating below the knee", href: "/services/spinal-decompression" },
    { label: "Numbness or weakness in the foot", href: "/conditions/back-pain" },
    { label: "Loss of bladder or bowel control — seek emergency care" },
  ],
};

export const sciaticaAccident: ConditionAccident = {
  headline: "Did sciatica symptoms begin after a car accident?",
  body: "A collision can aggravate the lower back and may contribute to radiating leg symptoms. Florida PIP generally requires initial services and care within 14 days of a motor vehicle accident.",
  smallprint:
    "Coverage and payment depend on your policy, eligibility, medical necessity, and the circumstances of your claim.",
};

// Plain path config — see sciaticaRelatedMidPageConfig's doc comment above.
export const sciaticaRelatedBottomConfig = {
  paths: [
    "/conditions/back-pain",
    "/services/spinal-decompression",
    "/conditions",
    "/car-accident-chiropractor",
    "/blog",
    "/book-an-appointment",
  ],
  highlightPath: "/book-an-appointment",
};

export const sciaticaFaq: ConditionFaq = {
  headerTail: "treating sciatica",
  items: [
    {
      q: "Can a car accident cause sciatica?",
      a: "A car accident can aggravate the lower back and may contribute to sciatic nerve symptoms, but an exam is needed to identify likely causes. Mention the collision and symptom timing during your evaluation.",
    },
    {
      q: "How is sciatica different from regular lower back pain?",
      a: "Regular lower back pain stays in the lower back. Sciatica radiates — it travels down through the buttock and leg because a nerve root itself is compressed, not just the surrounding muscle or joint.",
    },
    {
      q: "Will I need surgery for a herniated disc?",
      a: "Not necessarily. Many people begin with clinician-directed conservative care, but progressive weakness, severe symptoms, or certain exam findings can require prompt medical or surgical evaluation.",
    },
    {
      q: "How long does sciatica usually take to improve?",
      a: "Timing varies with the cause and severity. A muscular flare may improve differently from symptoms involving a disc or nerve, so Dr. Abe reassesses progress and adjusts the plan as needed.",
    },
  ],
};
