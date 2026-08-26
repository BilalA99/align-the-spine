import type {
  ConditionAccident,
  ConditionFaq,
  ConditionFeelsLikeItem,
  ConditionTreatmentItem,
  ConditionWarning,
} from "@/content/conditions/types";
import { siteConfig } from "@/content/site";

/** Bespoke content for the dedicated /conditions/whiplash page — same
 * per-condition, hand-built approach as back-pain/neck-pain/sciatica
 * (ATS-137, final condition off the generic [slug] template). Pulled from
 * the Figma `whiplash` frame (file 4mb4VDHszsaj2KEZzyjOjf, node 96:2629)
 * via get_metadata/get_design_context, cross-checked against the 11
 * design screenshots provided directly.
 *
 * Unlike back-pain/neck-pain, most of this frame's copy (hero, accident
 * banner, FAQ headers/questions) is genuinely whiplash-specific — not a
 * copy-paste mismatch. The one exception: the FAQ's first item pairs the
 * correct whiplash question ("How long does whiplash take to heal?") with
 * the wrong answer (literally the sciatica/back-pain FAQ's PIP-billing
 * answer, copy-pasted again). Wrote a real answer for that item, and for
 * the other 3 whiplash questions the Figma frame left with collapsed/empty
 * answer text — adapted from the previous Condition-schema whiplash.ts
 * (now deleted), which already had solid whiplash-specific FAQ copy. */

export const whiplashHero = {
  eyebrowChip: "Whiplash after an accident?",
  h1: "Whiplash Chiropractor in Deerfield Beach, FL",
  subhead:
    "Whiplash is a neck injury from rapid back-and-forth movement, often in a rear-end collision. Dr. Abe evaluates stiffness, limited motion, and related headaches.",
  backgroundImage: {
    src: "/figma-exports/drabe-whiplash-man.png",
    alt: "Dr. Abe treating a patient's neck",
  },
};

export const whiplashSymptoms: string[] = [
  "Neck pain and stiffness that worsens the day after the accident",
  "Headaches starting at the base of the skull",
  "Reduced range of motion — difficulty turning the head",
  "Shoulder and upper back pain",
  "Tingling or numbness in the arms",
  'Fatigue and difficulty concentrating ("brain fog")',
];

// ATS-SEO-043: this array previously had 3 pills whose label named one
// condition (Cervicogenic Headache, TMJ / Jaw Pain, Concussion) while the
// href actually pointed somewhere else entirely (neck-pain, a services
// anchor, and the accident page respectively) — a real, live anchor/
// destination mismatch. buildRelatedLinks() (content/related-links.ts)
// makes that specific bug impossible: the label and href are always
// resolved from the same input path.
// Plain path config — see content/back-pain-page.ts's identical note for
// why not resolved here directly (circular import via content/seo.ts).
export const whiplashRelatedMidPageConfig = {
  paths: [
    "/conditions/cervicogenic-headache",
    "/conditions/neck-pain",
    "/services/soft-tissue-therapy",
    "/car-accident-chiropractor",
  ],
  highlightPath: "/car-accident-chiropractor",
};

export const whiplashHowWeTreat: ConditionTreatmentItem[] = [
  {
    title: "Myofascial Release/Trigger Point",
    desc: "We use the Graston tool to break up scar tissue and muscle spasm in the neck and upper back that build up after a collision. This can feel similar to a deep massage and helps restore the soft tissue's normal movement.",
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
    desc: "After whiplash, selected neck joints may have restricted motion. If appropriate after evaluation, a controlled adjustment may be included to address that restriction.",
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
    desc: "When exam findings suggest a cervical disc concern, controlled traction may be considered to reduce pressure. It is used only when the evaluation supports it.",
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
    desc: "Turning your head to check mirrors or drive is often the hardest part of whiplash recovery. We come to you in the early days when driving isn't realistic yet — full exam and treatment, wherever you're most comfortable.",
    image: {
      src: "/figma-exports/how-we-treat-4.png",
      alt: "Dr. Abe providing chiropractic care at a patient's home",
    },
    meta: "Check eligibility",
    ctaLabel: "CHECK ELIGIBILITY",
    ctaHref: "/home-visit-chiropractor",
  },
];

export const whiplashFeelsLike: ConditionFeelsLikeItem[] = [
  {
    title: "Delayed onset",
    desc: "Feeling fine at the scene, then waking up unable to turn your head.",
    learnMoreHref: "/car-accident-chiropractor",
  },
  {
    title: "Neck stiffness",
    desc: "Usually the first symptom — tight, restricted, uncomfortable to turn.",
    learnMoreHref: "/services#adjustments",
  },
  {
    title: "Headaches",
    desc: "Often start at the base of the skull, sometimes days after impact.",
    learnMoreHref: "/conditions/neck-pain",
  },
  {
    title: "Reduced range of motion",
    desc: "Trouble turning your head fully in one or both directions.",
    learnMoreHref: "/services/soft-tissue-therapy",
  },
];

export const whiplashWarning: ConditionWarning = {
  heading: "See a doctor promptly if you notice:",
  image: {
    src: "/figma-exports/drabe-whiplash.png",
    alt: "Dr. Abe examining a patient's neck",
  },
  bullets: [
    { label: "Pain radiating down the arm", href: "/conditions/neck-pain" },
    { label: "Severe headache that won't resolve", href: "/conditions/neck-pain" },
    { label: "Vision changes or dizziness" },
  ],
};

export const whiplashAccident: ConditionAccident = {
  headline: "Florida gives you 14 days from the accident",
  body: "Whiplash symptoms can build after the collision. Florida PIP generally requires initial services and care within 14 days of a motor vehicle accident; coverage depends on eligibility and policy terms.",
  smallprint:
    "Coverage and payment depend on your policy, eligibility, medical necessity, and the circumstances of your claim.",
};

// Plain path config — see whiplashRelatedMidPageConfig's doc comment above.
export const whiplashRelatedBottomConfig = {
  paths: [
    "/conditions/neck-pain",
    "/conditions/back-pain",
    "/services/spinal-decompression",
    "/conditions",
    "/car-accident-chiropractor",
    "/blog",
    "/book-an-appointment",
  ],
  highlightPath: "/book-an-appointment",
};

export const whiplashFaq: ConditionFaq = {
  headerTail: "treating whiplash",
  items: [
    {
      q: "How long does whiplash take to heal?",
      a: "Mild cases often improve within a few weeks of consistent care; more significant injuries can take a few months. We reassess regularly and adjust your plan as you progress.",
    },
    {
      q: 'What does a whiplash "grade" mean?',
      a: "A whiplash grade describes severity, from neck symptoms without physical signs to fracture or dislocation. A qualified clinician should assess the injury rather than relying on symptoms alone.",
    },
    {
      q: "Can whiplash cause headaches weeks later?",
      a: "Yes — cervicogenic headaches that trace back to the neck are one of the most common delayed whiplash symptoms, sometimes showing up well after the initial stiffness eases.",
    },
    {
      q: "How does PIP coverage work for my visit?",
      a: "Florida PIP generally requires initial services and care within 14 days of a motor vehicle accident. Benefit limits and payment depend on your eligibility, policy, medical necessity, and claim details.",
    },
  ],
};
