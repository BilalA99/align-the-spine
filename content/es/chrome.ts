import type { NavLink } from "@/content/site";

/** Spanish site chrome: navigation, footer, and the handful of UI strings
 * the shell renders directly (skip link, menu button, language switch).
 *
 * Why the Spanish nav is flat where the English nav has mega-menus: the
 * English "Services" and "Conditions" dropdowns link to pages that are
 * `status: "draft"` today (noindex, pending clinician review — see
 * content/seo.ts). Reproducing those dropdowns in Spanish would either
 * link Spanish readers into English pages on every hover, or advertise
 * Spanish pages that don't exist. A flat Spanish nav that points only at
 * real, published Spanish URLs is the honest version, and it keeps the
 * Spanish internal-link graph inside Spanish (§Internal linking in the
 * report). The dropdowns come back on the Spanish side when the underlying
 * condition/service pages clear review and get translated.
 *
 * Every href here is a Spanish route registered in content/i18n.ts;
 * content/i18n.test.ts asserts that, so a nav link can't point at a
 * Spanish URL that no page serves.
 */
export const esNav: NavLink[] = [
  { label: "Servicios", href: "/es/servicios" },
  { label: "Accidentes de Auto", href: "/es/quiropractico-accidentes-de-auto" },
  { label: "Dr. Abe", href: "/es/dr-abe-nasser" },
  { label: "Reseñas", href: "/es/resenas" },
  { label: "Contacto", href: "/es/contacto" },
];

/** "Solicitar Cita", not "Reservar"/"Agendar": the form sends a request and
 * the office calls back — it does not confirm a time slot. The English CTA
 * was deliberately reworded off "Book" for exactly this reason (ATS-E3
 * 3.4); the Spanish CTA must not quietly reintroduce the promise. */
export const esBookingCta: NavLink = { label: "Solicitar Cita", href: "/es/solicitar-cita" };

export const esFooter = {
  tagline:
    "Atención quiropráctica en Deerfield Beach, desde su primera evaluación hasta su recuperación.",
  links: [
    { label: "Atención tras un accidente", href: "/es/quiropractico-accidentes-de-auto" },
    { label: "Sobre el Dr. Abe", href: "/es/dr-abe-nasser" },
    { label: "Reseñas", href: "/es/resenas" },
  ] as NavLink[],
  copyrightName: "Align the Spine Chiropractic",
  /** /privacy-policy has no Spanish version (a legal notice needs counsel
   * review, not a content translation — see content/i18n.ts). The Spanish
   * footer still links to it, but the link is marked `hrefLang="en"` so
   * both the reader and Google know they're crossing into English. */
  privacyPolicy: { label: "Política de Privacidad (en inglés)", href: "/privacy-policy" },
};

/** Chrome strings the shell renders outside of any content module. */
export const esChromeLabels = {
  skipToContent: "Saltar al contenido",
  openMenu: "Abrir menú",
  closeMenu: "Cerrar menú",
  callUs: "Llámenos hoy",
  languageSwitch: "View this page in English",
  languageSwitchShort: "English",
  /** Spanish labels for content/site.ts's verified stat chips. Only the
   * label is translated — the values are verified factual claims and stay
   * as approved (see getVerifiedStats). */
  stats: {
    Reviews: "Reseñas",
    Visits: "Citas",
    "When it applies": "Cuando corresponde",
    "Bilingual care": "Atención bilingüe",
    Insurance: "Seguro",
  } as Record<string, string>,
  /** Values that are English display strings rather than numbers need a
   * Spanish rendering too — "Same-day"/"Home visits"/"PIP accepted" are
   * approved claims, so these are translations of the same claim, not new
   * or broader ones. "EN/ES" is left as-is: it's a language-pair token,
   * identical in both languages. */
  statValues: {
    "Same-day": "El mismo día",
    "Home visits": "Visitas a domicilio",
    "PIP accepted": "Aceptamos PIP",
  } as Record<string, string>,
};

export const enChromeLabels = {
  skipToContent: "Skip to content",
  openMenu: "Open menu",
  closeMenu: "Close menu",
  callUs: "Speak with us today",
  languageSwitch: "Ver esta página en español",
  languageSwitchShort: "Español",
};
