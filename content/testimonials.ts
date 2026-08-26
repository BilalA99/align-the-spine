export interface Testimonial {
  /** The review exactly as the patient wrote it. Never edited. */
  quote: string;
  author: string;
  /** Spanish translation of `quote`, shown on /es pages.
   *
   * This is a translation, not the patient's own words, and the UI says so:
   * every component that renders it also renders a visible "traducida del
   * inglés" note and marks the text `lang="es-US"`. That distinction is the
   * whole point — presenting a rewritten review as the reviewer's own
   * wording would make it a fabricated review under Google's review
   * policies, and simply untrue. Translations preserve meaning and register
   * (including how casual the original is); they do not upgrade a review's
   * enthusiasm, add claims, or tidy up the patient's point.
   *
   * Optional: a review with no translation falls back to the English
   * original, marked `lang="en-US"`, rather than being hidden. */
  quoteEs?: string;
}

/** Real, client-supplied Google reviews (screenshots provided directly by
 * the practice, 2026-08-12) — copied verbatim, including each reviewer's
 * own phrasing/typos, same as every other real review on this site. Do not
 * invent or embellish entries here — a prior version fabricated "Maria G."
 * placeholder testimonials and that's what content-safety.test.ts's rule
 * exists to catch. All are 5-star; no date field since none of the
 * consuming UI (ReviewsCarousel, HeroReviewsCarousel, PatientReviews)
 * displays one. */
export const testimonials: Testimonial[] = [
  {
    quote:
      "Dr. Abe is a very dedicated, committed, and knowledgeable professional. He helped me a lot with my pain after my car accident.",
    quoteEs:
      "El Dr. Abe es un profesional muy dedicado, comprometido y con mucho conocimiento. Me ayudó muchísimo con el dolor que tenía después de mi accidente de auto.",
    author: "Sheila Pimentel",
  },
  {
    quote:
      "Amazing service! I am a professional fighter, DR Abe has helped me recover and fix any injuries I get from my fights and training",
    quoteEs:
      "¡Excelente servicio! Soy peleador profesional y el Dr. Abe me ha ayudado a recuperarme y a tratar las lesiones que me dejan las peleas y los entrenamientos",
    author: "John Michael Escoboza",
  },
  {
    quote:
      "Very professional had great therapy here I would definitely recommend to anyone with knee and back pain. Dr. Abe is very helpful and I would definitely come back again for more treatment",
    quoteEs:
      "Muy profesional, recibí muy buena terapia aquí. Sin duda se lo recomendaría a cualquiera con dolor de rodilla y de espalda. El Dr. Abe ayuda muchísimo y definitivamente volvería para más tratamiento",
    author: "Josh Merulla",
  },
  {
    quote:
      "I contacted Dr. Nasser after being in so much pain. He litterely responded right away and saw me the next day. I left there feeling so much better and pain free. I Will most definitely recommend him and be back soon.",
    quoteEs:
      "Contacté al Dr. Nasser después de tener muchísimo dolor. Literalmente me respondió de inmediato y me atendió al día siguiente. Salí de ahí sintiéndome mucho mejor y sin dolor. Sin duda lo voy a recomendar y volveré pronto.",
    author: "Evolutionary physique Fitness",
  },
  {
    quote:
      "Very professional and clean office. I love that he offers mobile services. I highly recommend Dr. Nasser. I walk out of his office feeling relieved of my lower back pain.",
    quoteEs:
      "Consultorio muy profesional y limpio. Me encanta que ofrezca servicios a domicilio. Recomiendo mucho al Dr. Nasser. Salgo de su consultorio con alivio en el dolor de mi espalda baja.",
    author: "Sabrina Perez",
  },
  {
    quote:
      "Had some lower back pain and saw Dr. Abe he was very informative and helpful in assisting me to get my range of motion back. Highly recommend!",
    quoteEs:
      "Tenía dolor en la espalda baja y fui con el Dr. Abe. Me explicó todo muy bien y me ayudó mucho a recuperar mi rango de movimiento. ¡Muy recomendado!",
    author: "Mohammed Husein",
  },
  {
    quote:
      "Dr. Abe Nasser has me feeling great! Came in with shoulder, neck and knee pain and I feel great. Prices were spectacular compared to anyone else, great conversations. 100% recommended!",
    quoteEs:
      "¡El Dr. Abe Nasser me tiene sintiéndome muy bien! Llegué con dolor de hombro, cuello y rodilla y me siento muy bien. Los precios fueron espectaculares comparados con cualquier otro, y muy buenas conversaciones. ¡100% recomendado!",
    author: "Nash Husein",
  },
];

export interface ResolvedQuote {
  text: string;
  /** BCP-47 tag for the text actually rendered — drives the `lang`
   * attribute so a screen reader pronounces it correctly. */
  lang: string;
  /** True when `text` is a translation rather than the patient's own
   * words. Callers MUST surface this to the reader (see Testimonial.quoteEs). */
  translated: boolean;
}

/** Picks the quote text to render for a locale, and reports honestly which
 * one it picked. On /es this returns the Spanish translation when one
 * exists (translated: true) and otherwise falls back to the untouched
 * English original (translated: false) rather than hiding the review. */
export function resolveTestimonialQuote(
  testimonial: Testimonial,
  locale: "en" | "es",
): ResolvedQuote {
  if (locale === "es" && testimonial.quoteEs) {
    return { text: testimonial.quoteEs, lang: "es-US", translated: true };
  }
  if (locale === "es") {
    return { text: testimonial.quote, lang: "en-US", translated: false };
  }
  return { text: testimonial.quote, lang: "en-US", translated: false };
}

export const featuredTestimonial: Testimonial | undefined = testimonials[0];
export const homeFeaturedTestimonial: Testimonial | undefined = testimonials[0];
export const homeReviews: Testimonial[] = testimonials;
export const heroReviewsCarousel: Testimonial[] = testimonials;
