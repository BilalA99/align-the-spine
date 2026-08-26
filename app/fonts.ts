import { Fraunces, Geist, Poppins } from "next/font/google";

/** Shared font instances.
 *
 * Lifted out of the old single app/layout.tsx when the app moved to one
 * root layout per locale (app/(en)/layout.tsx and app/(es)/layout.tsx —
 * see content/i18n.ts). next/font requires these to be initialized at
 * module scope, and importing the same module from both layouts is what
 * keeps English and Spanish on one shared, already-subsetted font payload
 * instead of two. `subsets: ["latin"]` already covers the accented
 * characters Spanish needs (á é í ó ú ñ ü ¿ ¡), so no extra subset — and
 * no extra font download — is required for /es.
 */
export const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: "variable",
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
});

export const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

/** The `className` both root layouts put on <html>. */
export const fontVariables = `${fraunces.variable} ${poppins.variable} ${geist.variable}`;
