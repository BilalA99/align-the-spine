import type { ReactNode } from "react";

import type { ServiceCardItem } from "@/components/ui/service-card";
import type { DoctorHistoryContent, DoctorProfileContent } from "@/content/doctor-profile";
import type { PracticeCard } from "@/content/how-he-practices";
import { siteConfig } from "@/content/site";
import { mapVerified } from "@/content/verified-value";

/** Spanish copy for /es/servicios, /es/dr-abe-nasser, /es/resenas,
 * /es/contacto and /es/solicitar-cita.
 *
 * Same claim discipline as everywhere else in this codebase: no credential,
 * price, statistic, or outcome appears here that isn't already verified on
 * the English side. Two places where that visibly constrains the Spanish
 * copy, both deliberate:
 *
 *   - The doctor's degree, school, license and years of practice are still
 *     `doctorCredentials.verified: false` (content/doctor-profile.ts), so
 *     the Spanish bio describes what he does and who he treats, and claims
 *     no qualification beyond "quiropráctico" — the same job title the site
 *     already publishes in plain copy everywhere.
 *   - New-patient pricing is generalized rather than stated as a figure,
 *     matching how content/doctor-profile.ts handles the same sentence in
 *     English and why (see its ATS-E4 4.17 note).
 */

// ─────────────────────────────────────────────────────────── shared sections

/** Homepage/contact "Contact us" band, rendered by ContactSection. */
export const esContactSectionCopy: {
  heading: string;
  body: ReactNode;
  lockupSubtitle: string;
} = {
  heading: "Contáctenos",
  body: "¿Se lesionó o simplemente tiene una pregunta? Escríbanos cuando quiera — respondemos rápido y sin centro de llamadas.",
  lockupSubtitle: "Chiropractic and Wellness Center",
};

/** Spanish DoctorProfile block, shared by the Spanish home, services,
 * accident and doctor pages. The rating is derived from the same
 * siteConfig.reviewsRating source the English profile derives from — one
 * verified number, two languages, no second assertion. */
export const esDoctorProfileContent: DoctorProfileContent = {
  eyebrow: "EL DOCTOR DETRÁS DE SU ATENCIÓN",
  name: "Dr. Abe Nasser",
  bio: "El Dr. Abe Nasser es el quiropráctico de Align the Spine Chiropractic en Deerfield Beach. Ha atendido a pacientes en los condados de Broward y Palm Beach, incluidos atletas, adultos mayores y personas en recuperación posquirúrgica o con necesidades relacionadas con el embarazo. Atiende en español y en inglés.",
  cta: { label: "Solicitar cita con el Dr. Abe", href: "/es/solicitar-cita" },
  rating: mapVerified(siteConfig.reviewsRating, (r) => ({
    value: r.rating,
    count: r.count,
    location: "Deerfield Beach, Florida",
  })),
  portrait: { src: "/figma-exports/portrait.png", alt: "Dr. Abe Nasser" },
};

// ──────────────────────────────────────────────────────────── /es/servicios

export const esServicesPage = {
  hero: {
    eyebrow: "Cada tratamiento se define según su evaluación",
    titleLines: ["Servicios quiroprácticos", "en Deerfield Beach, FL"] as const,
    subhead:
      "Desde los ajustes de rutina hasta la atención especializada de recuperación — el mismo doctor en cada visita, en el consultorio o en su casa cuando corresponde.",
    callPillEyebrow: "Hablemos hoy",
    bilingualNote: "El Dr. Abe atiende en español. Llame y pregunte por él directamente.",
    form: {
      heading: "Solicite su evaluación",
      footerNote:
        "Atendemos en Deerfield Beach. Llame para preguntar si una visita a domicilio corresponde a su caso y su ubicación.",
    },
  },
  catalog: {
    eyebrow: "Nuestros servicios",
    heading: "Atención completa, adaptada a su caso",
  },
  breadcrumb: "Servicios",
};

/** Spanish rendering of content/services-grid.ts.
 *
 * `href`/`ctaLabel` are deliberately absent on every card. Three of the
 * English cards link to dedicated service pages that are `status: "draft"`
 * (noindex, awaiting clinician review — content/seo.ts) and exist only in
 * English. Carrying those links over would push Spanish readers into
 * English pages the practice hasn't cleared for publication yet, and would
 * leak /es link equity into noindex URLs. The cards describe the service
 * and the page's CTAs handle the next step; the links return when the
 * underlying pages are reviewed and translated. */
export const esServicesGrid: ServiceCardItem[] = [
  {
    slug: "adjustments",
    name: "Ajustes quiroprácticos",
    duration: "",
    summary:
      "Ajustes manuales con presión controlada para mejorar el movimiento de las articulaciones del cuello, la espalda media o la espalda baja cuando corresponde.",
    image: {
      src: "/figma-exports/drabeadjust.png",
      alt: "El Dr. Abe realizando un ajuste quiropráctico",
    },
  },
  {
    slug: "sports-injury",
    name: "Lesiones deportivas",
    duration: "",
    summary:
      "Evaluación y tratamiento manual para distensiones, esguinces y lesiones por sobreuso, con un plan pensado para volver a su deporte.",
    image: {
      src: "/figma-exports/abe-back-turn.png",
      alt: "Evaluación y tratamiento de una lesión deportiva",
    },
  },
  {
    slug: "posture-corrective",
    name: "Postura y corrección",
    duration: "",
    summary:
      "Evaluación y atención quiropráctica para la tensión postural que se acumula por el trabajo de escritorio, manejar o los movimientos repetitivos.",
    image: {
      src: "/figma-exports/drabe-spine.png",
      alt: "Atención postural y correctiva de la columna",
    },
  },
  {
    slug: "spinal-decompression",
    name: "Descompresión espinal",
    duration: "",
    summary:
      "Descompresión espinal por tracción controlada para molestias seleccionadas de disco, articulación y dolor nervioso irradiado, después de una evaluación completa.",
    image: {
      src: "/figma-exports/drabe-traction_compression.png",
      alt: "Terapia de tracción y descompresión espinal",
    },
  },
  {
    slug: "headache-migraine",
    name: "Dolor de cabeza y migraña",
    duration: "",
    summary:
      "Evaluación centrada en el cuello y atención quiropráctica para dolores de cabeza que pueden tener un componente musculoesquelético o cervical.",
    image: {
      src: "/figma-exports/drabe-headache.png",
      alt: "Tratamiento de dolor de cabeza y migraña",
    },
  },
  {
    slug: "massage-soft-tissue",
    name: "Masaje / tejidos blandos",
    duration: "",
    summary:
      "Liberación miofascial y atención dirigida de tejidos blandos para la tensión muscular, la movilidad restringida y el dolor posterior a una lesión.",
    image: {
      src: "/figma-exports/drabe-soft-tissue.png",
      alt: "Terapia de masaje y tejidos blandos",
    },
  },
];

// ────────────────────────────────────────────────────── /es/dr-abe-nasser

export const esDoctorPage = {
  hero: {
    eyebrow: "El quiropráctico que lo va a atender",
    titleLines: ["Dr. Abe Nasser,", "quiropráctico en", "Deerfield Beach"] as const,
    subhead:
      "El mismo doctor en cada visita, en español o en inglés — desde la primera evaluación hasta el final de su recuperación.",
    callPillEyebrow: "Hablemos hoy",
  },
  breadcrumb: "Dr. Abe Nasser",
  practices: {
    eyebrow: "CÓMO TRABAJA",
    heading: "Lo que los pacientes realmente notan",
    officeCallout: {
      heading: "El consultorio, cuando prefiere venir usted",
      body: "Las visitas a domicilio se ofrecen según su caso y su ubicación — pero el consultorio de Deerfield Beach siempre está aquí.",
    },
  },
  galleryHeading: "Nuestro consultorio en Deerfield Beach",
};

export const esDoctorHistoryContent: DoctorHistoryContent = {
  eyebrow: "TRAYECTORIA",
  heading: "Construido sobre la idea de ser el doctor que sí está",
  paragraphs: [
    "El Dr. Abe comenzó su carrera quiropráctica atendiendo en los condados de Broward y Palm Beach, con pacientes en todas las etapas de la recuperación — antes y después del embarazo, posquirúrgicos, adultos mayores y atletas. En el camino notó siempre el mismo patrón: los pacientes rebotaban entre el proveedor que estuviera disponible ese día, sin llegar nunca a la continuidad que de verdad acelera la recuperación.",
    "Align the Spine nació de la idea contraria. Un solo doctor, en cada visita. Precios claros en lugar de un laberinto de códigos, y una primera evaluación accesible, porque la primera visita no debería ser la apuesta cara que impide que la gente se revise.",
    "Es bilingüe — inglés y español — y lo considera parte del trabajo, no un extra. Si un paciente se siente más cómodo explicando lo que le duele en español, esa es la conversación que debería poder tener.",
  ],
};

export const esHowHePracticesCards: PracticeCard[] = [
  {
    title: "Atención accesible",
    description:
      "Precios claros — la buena atención quiropráctica no debería ser un lujo. Llámenos para conocer el precio vigente para pacientes nuevos.",
    image: {
      src: "/figma-exports/drabe-whiplash.png",
      alt: "Sesión de tratamiento quiropráctico",
    },
  },
  {
    title: "Siempre el mismo doctor",
    description:
      "Sin proveedores rotativos. En cada visita lo atiende el Dr. Abe — conoce su caso porque es él quien lo trata.",
    image: {
      src: "/figma-exports/drabe-backpain.png",
      alt: "El Dr. Abe atendiendo a un paciente",
    },
  },
  {
    title: "En cada etapa de la vida",
    description:
      "Antes y después del embarazo, posquirúrgicos, adultos mayores, atletas — atención pensada para el momento en que usted está.",
    image: {
      src: "/figma-exports/athome-drabe.png",
      alt: "El Dr. Abe atendiendo a un paciente en su casa",
    },
  },
];

// ───────────────────────────────────────────────────────────── /es/resenas

export const esReviewsPage = {
  h1: "Reseñas de pacientes de Align the Spine Chiropractic",
  intro:
    "Estas son reseñas reales de pacientes en Deerfield Beach. Vea por qué el sur de la Florida confía en el Dr. Abe, y después empiece su propia recuperación.",
  ratingSuffix: "reseñas de cinco estrellas",
  ratingTail: "y contando",
  /** Shown above the carousel.
   *
   * Patient reviews are published exactly as each patient wrote them —
   * they are not translated. A translated testimonial presented as the
   * patient's own words is no longer their testimony, and Google's review
   * guidelines (and basic honesty) treat rewritten reviews as fabricated
   * ones. This note explains that to a Spanish reader rather than leaving
   * them to wonder why the quotes are in English. */
  languageNote:
    "Publicamos cada reseña tal como la escribió el paciente, sin traducirla — por eso algunas aparecen en inglés.",
  formHeading: "Reciba la misma atención de 5 estrellas",
  formFootnote:
    "Con frecuencia hay citas disponibles el mismo día. Atendemos en Deerfield Beach y comunidades cercanas del sur de la Florida.",
  heroAlt: "Align the Spine Chiropractic and Wellness Center",
  carouselHeading: "Lo que dicen nuestros pacientes",
};

// ──────────────────────────────────────────────────────────── /es/contacto

export const esContactPage = {
  hero: {
    eyebrow: "Estamos en Deerfield Beach",
    h1: "Contacte a Align the Spine",
    subhead: `Llámenos al ${siteConfig.business.phone}, escríbanos, o envíe el formulario y le devolvemos la llamada.`,
    formHeading: "Envíenos un mensaje",
  },
  breadcrumb: "Contacto",
  faqEyebrow: "Preguntas frecuentes",
  faqHeading: "Antes de su primera visita",
  faq: [
    {
      question: "¿Cómo solicito una cita?",
      answer: `Llame al ${siteConfig.business.phone} o envíe el formulario de esta página. Le devolvemos la llamada para confirmar el horario — el formulario no reserva la cita automáticamente.`,
    },
    {
      question: "¿Atienden en español?",
      answer:
        "Sí. El Dr. Abe atiende en español y en inglés, y él mismo contesta el teléfono del consultorio.",
    },
    {
      question: "¿Dónde queda el consultorio?",
      answer: `Estamos en ${siteConfig.business.address.line1}, ${siteConfig.business.address.suite}, Deerfield Beach, FL ${siteConfig.business.address.zip}, dentro de Palm Plaza. Al entrar a la plaza, somos el edificio de la esquina del extremo derecho.`,
    },
    {
      question: "¿Qué llevo a mi primera visita?",
      answer:
        "Una identificación y la información de su seguro. Si su caso es por un accidente de auto y ya tiene un reporte policial, un número de reclamo o un abogado, tráigalo — pero no es requisito para que lo atendamos.",
    },
  ],
};

// ─────────────────────────────────────────────────────── /es/solicitar-cita

export const esBookingPage = {
  hero: {
    eyebrow: "Solicite su cita",
    h1: "Solicitar una cita quiropráctica",
    /** States plainly that this is a request, not a confirmed booking —
     * the same promise-discipline the English page adopted (ATS-E3 3.4). */
    subhead:
      "Complete el formulario y le devolvemos la llamada para confirmar el horario. Si prefiere resolverlo por teléfono, llame al " +
      siteConfig.business.phone +
      " y hable directamente con el Dr. Abe.",
    formHeading: "Solicite su evaluación",
    footerNote:
      "Este formulario envía una solicitud; no confirma un horario. Le llamamos para coordinar la cita.",
  },
  breadcrumb: "Solicitar cita",
  faqEyebrow: "Antes de solicitar",
  faqHeading: "Sobre la solicitud de cita",
  /** Distinct from esContactPage.faq on purpose. The English site renders
   * the same `bookFaqs` block on both /contact-us and /book-an-appointment;
   * repeating that on the Spanish side would put two near-identical
   * question sets (and two identical FAQPage blocks) on two competing URLs.
   * These four answer what someone actually wants to know at the moment
   * they're filling in the request form. */
  faq: [
    {
      question: "¿Enviar el formulario confirma mi cita?",
      answer: `No. El formulario envía una solicitud; nosotros le devolvemos la llamada para acordar el día y la hora. Si prefiere confirmar de una vez, llámenos al ${siteConfig.business.phone}.`,
    },
    {
      question: "¿Cuánto tardan en llamarme?",
      answer:
        "Le llamamos lo antes posible en horario de atención. Si su caso es por un accidente reciente y le preocupa el plazo de 14 días del PIP, llámenos directamente en lugar de esperar la devolución de la llamada.",
    },
    {
      question: "¿Qué información me piden en el formulario?",
      answer:
        "Nombre, teléfono y el motivo general de la consulta. No le pedimos historial médico detallado ni la descripción de su accidente por formulario — eso se conversa en la visita.",
    },
    {
      question: "¿Puedo solicitar una visita a domicilio desde aquí?",
      answer:
        "Sí, seleccione “Visita a domicilio” como motivo. Confirmamos si corresponde a su caso y su ubicación cuando le llamemos; no es un servicio garantizado.",
    },
  ],
  whatHappensNext: {
    eyebrow: "Qué sigue",
    heading: "Cómo funciona",
    steps: [
      {
        title: "Usted envía la solicitud",
        body: "Nombre, teléfono y el motivo de la consulta. Nada de historial médico detallado en el formulario.",
      },
      {
        title: "Le devolvemos la llamada",
        body: "Coordinamos un horario que le sirva y le decimos qué llevar.",
      },
      {
        title: "Viene a su evaluación",
        body: "El Dr. Abe revisa sus síntomas, hace un examen enfocado y le explica si la atención quiropráctica corresponde a su caso.",
      },
    ],
  },
};

/** /es/gracias — the Spanish post-conversion page. Noindex, like its
 * English counterpart. */
export const esThankYouPage = {
  h1: "Gracias — recibimos su solicitud",
  body: "Le devolveremos la llamada para confirmar el horario de su cita. Si necesita hablar con alguien ahora mismo, llame al consultorio y el Dr. Abe le atiende directamente.",
  homeCta: "Volver al inicio",
};
