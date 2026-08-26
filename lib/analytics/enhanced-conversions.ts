declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * IMPORTANT — INTENTIONALLY PRESERVED, BUT NOT ACTIVE FOR ATS LEADS.
 *
 * This generic Enhanced Conversions capability remains in the repository so
 * the existing environment contract is not lost. Align the Spine provides
 * healthcare services: ATS lead forms MUST NOT call this module or transmit
 * their name, email, phone, address, intake answers, or medical information as
 * Google Ads `user_data`. A future activation requires a fresh Google policy,
 * privacy, and compliance review. Setting the flag alone has no effect because
 * there are deliberately no ATS lead-form call sites.
 */
export const GOOGLE_ADS_ENHANCED_CONVERSIONS =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_ENHANCED_CONVERSIONS === "true";

export function toE164(phone: string): string | undefined {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return undefined;
}

/** Generic infrastructure only. Do not call with ATS healthcare lead data. */
export function setEnhancedConversionUserData(userData: {
  email?: string;
  phoneNumber?: string;
}): void {
  if (!GOOGLE_ADS_ENHANCED_CONVERSIONS) return;
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;

  const phoneNumber = userData.phoneNumber ? toE164(userData.phoneNumber) : undefined;
  if (!userData.email && !phoneNumber) return;
  window.gtag("set", "user_data", {
    ...(userData.email ? { email: userData.email } : {}),
    ...(phoneNumber ? { phone_number: phoneNumber } : {}),
  });
}
