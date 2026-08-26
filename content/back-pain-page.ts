import { DEFAULT_ACCIDENT_SMALLPRINT } from "@/content/conditions/types";
import type {
  ConditionAccident,
  ConditionFaq,
  ConditionFeelsLikeItem,
  ConditionTreatmentItem,
  ConditionWarning,
  ConditionWhenToSee,
} from "@/content/conditions/types";
import { siteConfig } from "@/content/site";

/** Bespoke content for the dedicated /conditions/back-pain page (not the
 * shared Condition schema / [slug] template — the user asked to move off
 * that generic approach: every condition page gets its own screenshots and
 * its own hand-built page, starting here). Pulled from the Figma
 * `back-pain` frame (file 4mb4VDHszsaj2KEZzyjOjf, node 96:3517) via
 * get_design_context, cross-checked against the 10 design screenshots
 * provided directly.
 *
 * One deliberate deviation from the literal Figma text, same class of
 * copy-paste mixup documented in the previous back-pain.ts (now removed):
 * the "Was this from an accident?" banner and the FAQ header both read as
 * written for the Sciatica page ("Sciatic pain after an accident...",
 * "...treating sciatica"), not Back Pain. Kept this page's own
 * back-pain-specific copy for both instead of copying the mismatched text
 * verbatim. */

export const backPainHero = {
  eyebrowChip: "Back pain after a car accident?",
  h1: "Back Pain Chiropractor in Deerfield Beach, FL",
  subhead:
    "Chiropractic evaluation for lower back pain, stiffness, and pain that may travel into the hip or leg, including symptoms after a car accident.",
  backgroundImage: {
    src: "/figma-exports/drabe-backpain-front.png",
    alt: "Hands-on lower-back soft-tissue treatment",
  },
};

export const backPainCauses: string[] = [
  "Muscle or ligament strain",
  "Herniated or bulging discs",
  "Poor posture and prolonged sitting",
  "Pregnancy-related joint shifts",
  "Sports or repetitive strain",
  "Car accidents and sudden impact",
];

// ATS-SEO-043: plain path config, resolved into real links by
// buildRelatedLinks() (content/related-links.ts) — but called from the
// page component (app/conditions/back-pain/page.tsx), not here: this file
// is on content/seo.ts's own load path (seo.ts imports backPainHero from
// it), so importing related-links.ts here — which itself imports
// content/seo.ts — would be a circular import. Keeping this file to plain
// data avoids that entirely. See that file's doc comment for why this
// replaced a hand-typed label/href array: it had drifted into real bugs
// (self-links, a label naming one condition while linking to a different
// one, direct links to draft pages).
export const backPainRelatedMidPageConfig = {
  paths: ["/conditions/sciatica", "/services/spinal-decompression", "/car-accident-chiropractor"],
  highlightPath: "/services/spinal-decompression",
};

export const backPainWhenToSee: ConditionWhenToSee = {
  heading: "When to See a Chiropractor for Back Pain",
  body: "Consider an evaluation if back pain lasts more than a week or two, interferes with sleep or daily movement, or follows a car accident, fall, or sudden impact. Florida PIP generally requires initial care within 14 days of a motor vehicle accident. Seek immediate medical attention for worsening numbness or weakness, or any loss of bladder or bowel control.",
  image: {
    src: "/figma-exports/drabe-back.png",
    alt: "Dr. Abe reviewing a patient's back pain history",
  },
};

export const backPainHowWeTreat: ConditionTreatmentItem[] = [
  {
    title: "Myofascial Release/Trigger Point",
    desc: "Lower back strain often carries as tight, spasming muscle along the spine. The Graston tool works through that tension directly, breaking up adhesions similar to a deep massage.",
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
    desc: "Back pain frequently comes from fixations — segments of the spine, especially in the low back, that have lost their normal movement. Adjustments restore that motion so the surrounding muscles can stop compensating.",
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
    desc: "For disc-related or chronic back pain, traction stretches the lower spine to relieve pressure on the discs and nerves, helping pump fluid back into the disc space between vertebrae.",
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
    desc: "When even getting into the car is painful, we bring the exam and hands-on treatment to your living room instead.",
    image: {
      src: "/figma-exports/how-we-treat-4.png",
      alt: "Dr. Abe providing chiropractic care at a patient's home",
    },
    meta: "Check eligibility",
    ctaLabel: "CHECK ELIGIBILITY",
    ctaHref: "/home-visit-chiropractor",
  },
];

export const backPainFeelsLike: ConditionFeelsLikeItem[] = [
  {
    title: "Dull, aching stiffness",
    desc: "A constant low-grade ache, worse after sitting or standing still too long.",
    learnMoreHref: "/services#adjustments",
  },
  {
    title: "Sharp catch on movement",
    desc: "A specific bend or twist that triggers a sudden, sharp pull — often muscular.",
    learnMoreHref: "/services/soft-tissue-therapy",
  },
  {
    title: "Pain that won't ease up",
    desc: "Discomfort that's stuck around for weeks or months, not just a bad day.",
    learnMoreHref: "/services/spinal-decompression",
  },
  {
    title: "Radiating pain",
    desc: "Pain that travels into the hip or leg rather than staying in the lower back.",
    learnMoreHref: "/conditions/sciatica",
  },
];

export const backPainWarning: ConditionWarning = {
  heading: "See a doctor promptly if you notice:",
  image: {
    src: "/figma-exports/drabe-back.png",
    alt: "Dr. Abe examining a patient's lower back",
  },
  bullets: [
    { label: "Numbness or weakness in the leg", href: "/conditions/sciatica" },
    {
      label: "Pain that worsens at night or doesn't improve with rest",
      href: "/services/spinal-decompression",
    },
    { label: "Loss of bladder or bowel control — seek emergency care" },
  ],
};

export const backPainAccident: ConditionAccident = {
  headline: "Back pain after a crash needs documentation, not just rest",
  body: "A sudden impact can strain the muscles, joints, or discs of the lower back, and symptoms may appear later. Florida PIP generally requires initial services and care within 14 days of a motor vehicle accident.",
  smallprint: DEFAULT_ACCIDENT_SMALLPRINT,
};

// Plain path config — see backPainRelatedMidPageConfig's doc comment above.
export const backPainRelatedBottomConfig = {
  paths: [
    "/conditions/neck-pain",
    "/conditions/whiplash",
    "/services/spinal-decompression",
    "/conditions",
    "/car-accident-chiropractor",
    "/blog",
    "/book-an-appointment",
  ],
  highlightPath: "/book-an-appointment",
};

export const backPainFaq: ConditionFaq = {
  headerTail: "back pain",
  items: [
    {
      q: "Is it safe to get adjusted if I have a herniated disc?",
      a: "It depends on the disc injury, symptoms, and exam findings. Dr. Abe evaluates whether an adjustment, decompression, another conservative option, or medical referral is appropriate before treatment.",
    },
    {
      q: "Should I rest or stay active with back pain?",
      a: "Some rest helps early on, but too much of it can slow recovery. We'll give you a specific plan for what to do and avoid based on what's actually causing your pain.",
    },
    {
      q: "What if my back pain radiates down my leg?",
      a: "Pain traveling into the leg can involve an irritated nerve, including sciatica, but an exam is needed to assess the cause. Seek urgent care for progressive weakness or bladder or bowel changes.",
    },
    {
      q: "How many visits does back pain usually take to improve?",
      a: "Mechanical strain often improves within a few visits; disc-related pain can take longer. We reassess along the way and adjust the plan as you go.",
    },
  ],
};
