import { ActivityIcon } from "@/components/ui/icons/activity";
import { ExpandVerticalIcon } from "@/components/ui/icons/expand-vertical";
import { HandIcon } from "@/components/ui/icons/hand";
import { PinIcon } from "@/components/ui/icons/pin";
import { RingsIcon } from "@/components/ui/icons/rings";
import { WavesIcon } from "@/components/ui/icons/waves";
import { ZapIcon } from "@/components/ui/icons/zap";
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
  {
    label: "Condiciones",
    href: "/es/condiciones",
    menu: [
      {
        label: "Dolor de espalda baja",
        href: "/es/condiciones/dolor-de-espalda",
        description: "Dolor de disco, muscular y nervioso después de un accidente.",
        icon: ActivityIcon,
        image: {
          src: "/figma-exports/drabe-backpain-front.png",
          alt: "El Dr. Abe evaluando la espalda baja de un paciente",
        },
      },
      {
        label: "Dolor de cuello",
        href: "/es/condiciones/dolor-de-cuello",
        description: "Rigidez y tensión que se extiende hacia los hombros.",
        icon: WavesIcon,
        image: {
          src: "/figma-exports/dr-abe-neck.png",
          alt: "El Dr. Abe evaluando el cuello de un paciente",
        },
      },
      {
        label: "Latigazo cervical",
        href: "/es/condiciones/latigazo-cervical",
        description: "La lesión de cuello por impacto que causan casi todos los accidentes.",
        icon: ZapIcon,
        image: {
          src: "/figma-exports/drabe-whiplash-man.png",
          alt: "El Dr. Abe tratando a un paciente por latigazo cervical",
        },
      },
      {
        label: "Ciática",
        href: "/es/condiciones/ciatica",
        description: "Dolor nervioso que se irradia por la pierna.",
        icon: ZapIcon,
        image: {
          src: "/figma-exports/drabe-backpain-front.png",
          alt: "El Dr. Abe evaluando a un paciente por ciática",
        },
      },
      {
        label: "Conmoción cerebral",
        href: "/es/condiciones/conmocion-cerebral",
        description: "Lesión cerebral que puede ocurrir sin golpearse la cabeza.",
        icon: RingsIcon,
        image: {
          src: "/figma-exports/drabe-headache.png",
          alt: "El Dr. Abe evaluando a un paciente después de un accidente",
        },
      },
      {
        label: "Dolor de cabeza cervicogénico",
        href: "/es/condiciones/dolor-de-cabeza-cervicogenico",
        description: "Dolores de cabeza que en realidad empiezan en el cuello.",
        icon: WavesIcon,
        image: {
          src: "/figma-exports/drabe-headache.png",
          alt: "Evaluación de tensión cervical relacionada con dolor de cabeza",
        },
      },
      {
        label: "ATM / dolor de mandíbula",
        href: "/es/condiciones/dolor-de-mandibula-atm",
        description: "El mismo impacto que causa el latigazo cervical llega a la mandíbula.",
        icon: RingsIcon,
        image: {
          src: "/figma-exports/drabe-headache.png",
          alt: "El Dr. Abe evaluando la mandíbula de un paciente",
        },
      },
    ],
  },
  { label: "Accidentes de Auto", href: "/es/quiropractico-accidentes-de-auto" },
  {
    label: "Recursos",
    href: "/es/dr-abe-nasser",
    // No blog entry: the blog is CMS-driven and English-only. Adding it
    // would drop a Spanish reader into English on their first click — the
    // Spanish nav stays inside Spanish (content/i18n.test.ts enforces it).
    menu: [
      {
        label: "Sobre el Dr. Abe",
        href: "/es/dr-abe-nasser",
        description: "Conozca al quiropráctico detrás del consultorio en Deerfield Beach.",
        icon: HandIcon,
        image: {
          src: "/figma-exports/dr-abe-neck.png",
          alt: "El Dr. Abe Nasser evaluando el cuello de un paciente",
        },
      },
      {
        label: "Reseñas de pacientes",
        href: "/es/resenas",
        description: "Lea las reseñas de pacientes, traducidas del inglés.",
        icon: RingsIcon,
        image: {
          src: "/figma-exports/interior-reception.png",
          alt: "Área de recepción de Align the Spine",
        },
      },
      {
        label: "Contacto",
        href: "/es/contacto",
        description: "Dirección, teléfono y horario del consultorio.",
        icon: ActivityIcon,
        image: {
          src: "/figma-exports/interior-corridor.png",
          alt: "Pasillo de recepción de Align the Spine",
        },
      },
      // The English nav gives Service Areas its own dropdown listing
      // individual cities. The Spanish nav gives it one link instead, on
      // purpose: there are no Spanish city pages to list, and a menu of
      // nineteen items that all leave Spanish would be worse on mobile and
      // dishonest on any screen. The hub itself names every community and
      // links each city's English guide with a visible "(en inglés)"
      // label. See content/es/service-areas.ts.
      {
        label: "Áreas de servicio",
        href: "/es/areas-de-servicio",
        description: "Un consultorio en Deerfield Beach y las comunidades que consideramos.",
        icon: PinIcon,
        image: {
          src: "/figma-exports/exterior-img.png",
          alt: "Exterior del edificio del consultorio en Deerfield Beach",
        },
      },
    ],
  },
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
    // Mirrors the English footer's own "Service Areas" link, and carries
    // real weight here: the Recursos mega-menu is client-rendered on hover
    // and absent from raw HTML (true of the English nav too — see
    // components/layout/navbar-dropdown.tsx), so without this footer entry
    // /es/areas-de-servicio would have no crawlable internal link at all,
    // only a sitemap entry. footer.tsx renders this list server-side on
    // every page.
    { label: "Áreas de servicio", href: "/es/areas-de-servicio" },
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
