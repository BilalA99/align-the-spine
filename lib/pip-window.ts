/** Florida PIP: treatment must begin within 14 days of the accident
 * (condition-page-spec §B4). Pure date math — no DOM, unit-tested. */

export const PIP_WINDOW_DAYS = 14;

/** Days remaining at or below this count as "act now" urgency. */
const URGENT_THRESHOLD = 3;

export type PipStatus = "future" | "active" | "urgent" | "expired";

export interface PipWindowResult {
  status: PipStatus;
  /** Calendar days left to begin treatment. 0 = today is the last day;
   * negative once expired; PIP_WINDOW_DAYS when the accident was today. */
  daysRemaining: number;
  message: string;
}

/** Calendar-day index, immune to DST and time-of-day differences. */
function dayNumber(date: Date) {
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
}

/** Per-locale message set. The date arithmetic is shared and identical —
 * only the wording differs.
 *
 * Both languages are deliberately non-promissory. Under Fla. Stat.
 * § 627.736(1)(a) the 14-day rule governs whether *initial services and
 * care* began in time; the benefit amount then turns on an
 * emergency-medical-condition determination a chiropractic physician is not
 * authorized to make. So neither language says calling "protects your
 * benefits" — they state that the timing period is running and that
 * coverage depends on the policy and the circumstances, and they point
 * coverage questions at the insurer or a qualified professional.
 *
 * The Spanish mirrors the English claim-for-claim: same hedging, same
 * referral, no extra assurance. A Spanish reader must not be told anything
 * an English reader isn't. */
export interface PipWindowMessages {
  future: string;
  expired: string;
  lastDay: string;
  urgent: (days: number) => string;
  active: (days: number) => string;
}

export const enPipWindowMessages: PipWindowMessages = {
  future: "That date is in the future — double-check the date of your accident.",
  expired:
    "The 14-day PIP window has passed, but you may still have options — call us to discuss your case.",
  lastDay:
    "The general 14-day initial-care timing period ends today. Coverage depends on the policy and circumstances; contact your insurer or a qualified professional for guidance.",
  urgent: (days) =>
    `${days} ${days === 1 ? "day remains" : "days remain"} in the general 14-day initial-care timing period. Coverage depends on the policy and circumstances.`,
  active: (days) =>
    `${days} days remain in the general 14-day initial-care timing period. Coverage and eligibility depend on the policy and circumstances.`,
};

export const esPipWindowMessages: PipWindowMessages = {
  future: "Esa fecha es futura — verifique la fecha de su accidente.",
  expired:
    "El plazo de 14 días del PIP ya pasó, pero aún podría tener opciones — llámenos para conversar sobre su caso.",
  lastDay:
    "El plazo general de 14 días para iniciar la atención termina hoy. La cobertura depende de su póliza y de las circunstancias; consulte a su aseguradora o a un profesional calificado.",
  urgent: (days) =>
    `${days === 1 ? "Queda 1 día" : `Quedan ${days} días`} del plazo general de 14 días para iniciar la atención. La cobertura depende de su póliza y de las circunstancias.`,
  active: (days) =>
    `Quedan ${days} días del plazo general de 14 días para iniciar la atención. La cobertura y la elegibilidad dependen de su póliza y de las circunstancias.`,
};

export function calculatePipWindow(
  accidentDate: Date,
  today: Date = new Date(),
  messages: PipWindowMessages = enPipWindowMessages,
): PipWindowResult {
  const elapsed = dayNumber(today) - dayNumber(accidentDate);
  const daysRemaining = PIP_WINDOW_DAYS - elapsed;

  if (elapsed < 0) {
    return { status: "future", daysRemaining, message: messages.future };
  }

  if (daysRemaining < 0) {
    return { status: "expired", daysRemaining, message: messages.expired };
  }

  if (daysRemaining === 0) {
    return { status: "urgent", daysRemaining, message: messages.lastDay };
  }

  if (daysRemaining <= URGENT_THRESHOLD) {
    return { status: "urgent", daysRemaining, message: messages.urgent(daysRemaining) };
  }

  return { status: "active", daysRemaining, message: messages.active(daysRemaining) };
}

/** Strict mm/dd/yyyy parser. Returns null for incomplete or impossible dates
 * (e.g. 02/30/2026) instead of letting Date roll them over. */
export function parseUsDate(value: string): Date | null {
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(value.trim());
  if (!match) return null;
  const month = Number(match[1]);
  const day = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }
  return date;
}
