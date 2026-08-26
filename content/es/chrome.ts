import { ActivityIcon } from "@/components/ui/icons/activity";
import { ExpandVerticalIcon } from "@/components/ui/icons/expand-vertical";
import { HandIcon } from "@/components/ui/icons/hand";
import { RingsIcon } from "@/components/ui/icons/rings";
import type { NavLink } from "@/content/site";

/** Spanish site chrome: navigation, footer, and the handful of UI strings
 * the shell renders directly (skip link, menu button, language switch).
 *
 * The Servicios entry carries the same mega-menu the English nav does, with
 * the same four services, the same icons and the same preview photos — the
 * dropdown behaves identically in both languages (hover panel on desktop,
 * expandable accordion in the drawer). Its items point at the Spanish
 * service pages under /es/servicios/*, so a Spanish reader never leaves
 * Spanish by using the nav.
 *
 * Those four Spanish pages are `status: "draft"` in content/es/seo.ts,
 * exactly like their English originals — noindex and out of the sitemap
 * pending clinician review of the medical content, but reachable and
 * linkable. That mirrors how the English nav already links its own draft
 * service pages, so neither language is treated differently.
 *
 * Every href here is a Spanish route registered in content/i18n.ts;
 * content/i18n.test.ts asserts that, so a nav link can't point at a
 * Spanish URL that no page serves.
 */
export const esNav: NavLink[] = [
  {
    label: "Servicios",
    href: "/es/servicios",
    menu: [
      {
        label: "Ajustes quiroprácticos",
        href: "/es/servicios/ajustes-quiropracticos",
        description: "Devolver el movimiento que se llevó la colisión.",
        icon: ActivityIcon,
        image: {
          src: "/figma-exports/adjustments-hero.png",
          alt: "El Dr. Abe realizando un ajuste quiropráctico",
        },
      },
      {
        label: "Descompresión espinal",
        href: "/es/servicios/descompresion-espinal",
        description: "Tracción suave para aliviar la presión sobre discos y nervios.",
        icon: ExpandVerticalIcon,
        image: {
          src: "/figma-exports/spinal-decompression-hero.png",
          alt: "Terapia de descompresión espinal",
        },
      },
      {
        label: "Masaje / tejidos blandos",
        href: "/es/servicios/terapia-de-tejidos-blandos",
        description: "Terapia dirigida para la tensión muscular y el tejido cicatricial.",
        icon: HandIcon,
        image: {
          src: "/figma-exports/massage-soft-tissue-hero.png",
          alt: "Sesión de masaje y terapia de tejidos blandos",
        },
      },
      {
        label: "Terapia de ventosas",
        href: "/es/servicios/terapia-de-ventosas",
        description: "Succión localizada para zonas seleccionadas de tensión muscular.",
        icon: RingsIcon,
        image: {
          src: "/figma-exports/cupping-drabe.png",
          alt: "Sesión de terapia de ventosas",
        },
      },
    ],
  },
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
  /** Drawer submenu "view all" link, e.g. "Ver todo: Servicios".
   * Rendered as `All {label}` before this existed, which read as
   * "All Servicios" on the Spanish drawer. */
  viewAll: (label: string) => `Ver todo: ${label}`,
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
  viewAll: (label: string) => `All ${label}`,
  callUs: "Speak with us today",
  languageSwitch: "Ver esta página en español",
  languageSwitchShort: "Español",
};
