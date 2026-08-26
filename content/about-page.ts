import { doctorProfileContent } from "@/content/doctor-profile";

/** ATS-SEO-022: dedicated hero content for /about, split out of
 * app/about/page.tsx (where it had been copy-pasted from /services —
 * same H1 text, "Chiropractic Services in Deerfield Beach, FL", and a
 * sciatica-condition eyebrow with no relation to the doctor/about intent
 * its title/meta already targeted). Every field below is sourced from
 * facts already established elsewhere in the repo (doctorProfileContent's
 * eyebrow, content/seo.ts's `/about` route title/description, the
 * already-verified bilingual claim from doctorHistoryContent's third
 * paragraph) — no new doctor-information claims are introduced. */
export const aboutHero = {
  eyebrowChip: doctorProfileContent.eyebrow,
  h1: "Dr. Abe Nasser, D.C.",
  subhead:
    "Meet Dr. Abe Nasser, the chiropractor behind Align the Spine Chiropractic in Deerfield Beach, and learn about his patient-centered approach to care.",
  bilingualNote: "¿Habla español? Dr. Abe habla su idioma.",
  backgroundImage: {
    src: "/figma-exports/dr-abe-neck.png",
    alt: "Dr. Abe Nasser treating a patient's neck",
  },
};
