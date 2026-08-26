import type { ConditionFaq, ConditionTreatmentItem } from "@/content/conditions/types";
import { siteConfig } from "@/content/site";

/** Bespoke content for the dedicated /conditions/concussion page — same
 * per-condition, hand-built approach as the other condition pages and the
 * /services/* pages built this pass. Pulled from the Figma `Concussion`
 * frame (file 3oNk0hDle8VMrPJQ0W0pDG, node 251:771) via get_metadata
 * (get_design_context and download_assets were both unavailable — Figma
 * MCP tool-call limit reached mid-session, same constraint noted on
 * cervicogenic-headache-page.ts).
 *
 * Like the cervicogenic-headache frame, this one reuses large chunks of
 * boilerplate from other frames rather than being built from scratch:
 * - The "Conditions X relieves" list (Whiplash/Neck Pain rows) is literal
 *   leftover massage-soft-tissue copy — skipped entirely rather than
 *   force unrelated content onto a concussion page.
 * - The doctor-bio band is the same leftover massage-page bio with an
 *   unverified PIP-billing claim — page reuses the shared, scrubbed
 *   doctorProfileContent bio instead.
 * - The FAQ heading/items are literal leftover massage-soft-tissue copy
 *   ("Everything you need to know about soft tissue therapy" on a
 *   concussion page) — replaced with real, concussion-specific questions.
 * - A "types-of-concussion-trauma" section exists in the frame but its
 *   text lives inside a component instance (SectionTitle/SymptomText/
 *   ItemTitle/ItemDescription slot names, not literal text) that only
 *   get_design_context can resolve — unavailable this pass, so it's
 *   skipped rather than guessed.
 * - A "HOW WE TREAT" section exists too, but its 4 treatment
 *   cards are literal leftover back-pain-page copy (titles like
 *   "Myofasial Release/Trigger Point" paired with a description about
 *   "lower back strain") — clinically inappropriate for a concussion page
 *   (concussion isn't treated with adjustments/traction), so skipped
 *   rather than reused as-is.
 *
 * What IS genuine to this frame: the Hero, the interactive "check your
 * symptoms" widget (SymptomChecklist component), and the Understanding
 * section below.
 *
 * ATS-E4 compliance scrubbing applied, same as every other page this pass
 * touched: the hero footerNote's hardcoded city list is neutralized, and
 * the closing CTA band's "Same-day visits, seven days a week" claim is
 * removed.
 *
 * Deviation from the design-to-code skill's normal asset flow: the hero
 * background photo shares the same Figma source node
 * (hf_20260717_002604_...) as the cervicogenic-headache page's hero,
 * which also couldn't be downloaded — reuses the same
 * /figma-exports/drabe-headache.png substitute for consistency. */

export const concussionHero = {
  eyebrowChip: "Hit your head or felt dazed after a car accident?",
  h1: "Concussion Symptoms After a Car Accident",
  subhead:
    "A concussion is a mild traumatic brain injury that needs medical evaluation. Chiropractic care is not a substitute for emergency or neurological assessment.",
  backgroundImage: {
    src: "/figma-exports/drabe-headache.png",
    alt: "Dr. Abe Nasser examining a patient after a car accident",
  },
};

export const concussionSymptoms: string[] = [
  "Headache or pressure in the head",
  "Dizziness or balance problems",
  "Sensitivity to light or noise",
  'Difficulty concentrating or "brain fog"',
  "Fatigue or sleep disturbances",
  "Irritability or mood changes",
];

export const concussionSymptomNote =
  "Seek prompt medical evaluation for possible concussion symptoms after an accident, and emergency care for severe or worsening symptoms.";

export const concussionSupportItems: ConditionTreatmentItem[] = [
  {
    title: "Medical evaluation first",
    desc: "Possible concussion symptoms require assessment by an appropriate medical professional. Emergency warning signs should not wait for a chiropractic visit.",
    image: {
      src: "/figma-exports/how-we-treat-1.png",
      alt: "Myofascial release and trigger point therapy with a Graston tool",
    },
    meta: "Safety first",
    ctaLabel: "REQUEST EVALUATION",
    ctaHref: siteConfig.bookingCta.href,
  },
  {
    title: "Neck and whiplash review",
    desc: "After medical clearance, Dr. Abe can evaluate whether separate neck pain, stiffness, or whiplash-related musculoskeletal concerns are present.",
    image: {
      src: "/figma-exports/how-we-treat-2.png",
      alt: "Dr. Abe performing a chiropractic adjustment",
    },
    meta: "After clearance",
    ctaLabel: "REQUEST EVALUATION",
    ctaHref: siteConfig.bookingCta.href,
  },
  {
    title: "Care only when appropriate",
    desc: "Any chiropractic care is limited to suitable musculoskeletal findings and coordinated with medical guidance when concussion symptoms are involved.",
    image: {
      src: "/figma-exports/how-we-treat-3.png",
      alt: "Spinal traction and decompression therapy",
    },
    meta: "Case by case",
    ctaLabel: "REQUEST EVALUATION",
    ctaHref: siteConfig.bookingCta.href,
  },
  {
    title: "Ongoing reassessment",
    desc: "New neurological symptoms, worsening headache, repeated vomiting, confusion, weakness, or loss of consciousness require urgent medical care.",
    image: {
      src: "/figma-exports/how-we-treat-4.png",
      alt: "Dr. Abe providing chiropractic care at a patient's home",
    },
    meta: "Know the red flags",
    ctaLabel: "REQUEST EVALUATION",
    ctaHref: siteConfig.bookingCta.href,
  },
];

export const concussionTypesHeading = "Types of concussion trauma";

export const concussionSymptomsHeading = "Classic symptoms";

export const concussionRelatedTypesHeading = "Related concussion conditions";

// ATS-SEO-043: plain path config, resolved by buildRelatedLinks()
// (content/related-links.ts) from the page component — see
// content/back-pain-page.ts's identical note for why not here directly
// (circular import via content/seo.ts). Replaces a hand-typed label/href
// array after an audit found several of these had drifted into real bugs
// elsewhere (self-links, mismatched anchor text, direct links to draft
// pages).
export const concussionRelatedTypesConfig = {
  paths: [
    "/conditions/whiplash",
    "/conditions/cervicogenic-headache",
    "/car-accident-chiropractor",
  ],
};

export const concussionCauseCategories = [
  {
    label: "From an accident",
    items: [
      {
        name: "Mild traumatic brain injury",
        description:
          "Direct impact or the brain's sudden movement inside the skull from a collision's force.",
      },
      {
        name: "Post-concussion syndrome",
        description: "Symptoms that persist beyond the typical two-to-four week recovery window.",
      },
    ],
  },
  {
    label: "Everyday causes",
    items: [
      {
        name: "Sports-related concussion",
        description: "From contact sports or falls, unrelated to a vehicle collision.",
      },
      {
        name: "Cumulative concussion effects",
        description: "Effects that build from multiple head injuries over time.",
      },
    ],
  },
];

export const concussionRelatedMidPageHeading = "Often needed alongside other post-accident care";

// Plain path config — see concussionRelatedTypesConfig's doc comment above.
export const concussionRelatedMidPageConfig = {
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

export const concussionFaq: ConditionFaq = {
  headerTail: "concussion and post-concussion care",
  items: [
    {
      q: "Can you have a concussion without losing consciousness or hitting your head?",
      a: "Yes. A concussion can occur without loss of consciousness or a direct blow to the head. Anyone with possible symptoms after a collision should receive appropriate medical evaluation.",
    },
    {
      q: "How long do concussion symptoms typically last?",
      a: "Recovery time varies. Persistent headache, dizziness, concentration problems, or other symptoms should be reviewed by an appropriate medical professional rather than judged by a fixed timeline.",
    },
    {
      q: "Is chiropractic care safe after a concussion?",
      a: "Chiropractic care does not diagnose or treat the brain injury itself. After appropriate medical evaluation, Dr. Abe may assess separate neck or musculoskeletal symptoms and determine whether care or referral is appropriate.",
    },
    {
      q: "Why do concussion and whiplash so often get missed together?",
      a: "The conditions can share symptoms after a collision, including headache and dizziness. Medical evaluation addresses possible brain injury, while a separate musculoskeletal exam can assess neck pain or whiplash after clearance.",
    },
  ],
};
