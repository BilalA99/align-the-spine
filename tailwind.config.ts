import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: "var(--color-navy-900)",
          800: "var(--color-navy-800)",
          700: "var(--color-navy-700)",
        },
        teal: {
          /* Light tint for use on navy/dark surfaces — see globals.css. */
          300: "var(--color-teal-300)",
          500: "var(--color-teal-500)",
        },
        gold: {
          400: "var(--color-gold-400)",
        },
        ink: {
          900: "var(--color-ink-900)",
          500: "var(--color-ink-500)",
        },
        mute: {
          300: "var(--color-mute-300)",
          400: "var(--color-mute-400)",
          350: "var(--color-mute-350)",
        },
        panel: {
          100: "var(--color-panel-100)",
        },
        overlay: {
          "navy-20": "var(--overlay-navy-20)",
          "white-15": "var(--overlay-white-15)",
          "white-16": "var(--overlay-white-16)",
          "ink-20": "var(--overlay-ink-20)",
          "teal-12": "var(--overlay-teal-12)",
        },
        error: "var(--color-error)",
      },
      borderRadius: {
        6: "var(--radius-6)",
        15: "var(--radius-15)",
        20: "var(--radius-20)",
        30: "var(--radius-30)",
        40: "var(--radius-40)",
        50: "var(--radius-50)",
        80: "var(--radius-80)",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        comparison: "var(--shadow-comparison)",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        alt: ["var(--font-alt)", "sans-serif"],
      },
      fontSize: {
        // Fluid clamp() per condition-page-spec §E: same 375->1728px
        // interpolation as display/h2/card-title below. Bumped +4px (size)
        // and +6px (leading) across the whole curve from the original
        // 32/64px + 38/68px endpoints per design feedback (headline read too
        // tight/small at mid-viewport widths).
        hero: [
          "clamp(36px, 2.37vw + 27.13px, 68px)",
          { lineHeight: "clamp(44px, 2.22vw + 35.69px, 74px)", fontWeight: "300" },
        ],
        // Fluid clamp() per condition-page-spec §E (ATS-112), same 375→1728px
        // interpolation the .container fluid gutter already uses (globals.css).
        // Minimums (36px / 24px) are a judgment call, not spec-confirmed — no
        // breakpoint frames exist in Figma to sample, per the ATS-002 design
        // doc's own note on this same gap.
        display: [
          "clamp(30px, 2.14vw + 27.96px, 65px)",
          { lineHeight: "clamp(34px, 2.22vw + 29.69px, 68px)", fontWeight: "500" },
        ],
        // Bumped to the Figma standard: max 48px (was 35px). The line-height
        // curve below was already sized for a ~48px heading (66px max ≈ 1.375
        // ratio), so only the font-size endpoints move — mobile min raised
        // 24→32px to keep the same ratio at the small end. Same 375→1728px
        // interpolation as every other fluid token here.
        h2: [
          "clamp(32px, 1.18vw + 27.57px, 48px)",
          { lineHeight: "clamp(45px, 1.55vw + 39.18px, 66px)", fontWeight: "600" },
        ],
        // Sourced from the Figma "Align the spine — Chiro" file (node 529:3292,
        // "Schedule Your Car Accident Evaluation"): Fraunces Regular, 27px /
        // 40px line-height. Pair with `font-display` (which sets the Fraunces
        // family + SOFT 0 / WONK 1 axes from globals.css). Made fluid to match
        // the heading family: the 27px/40px Figma values are the desktop max,
        // with a proportional mobile min (22px/33px), over the same 375→1728px
        // interpolation as hero/display/h2 above.
        h1: [
          "clamp(22px, 0.37vw + 20.61px, 27px)",
          { lineHeight: "clamp(33px, 0.52vw + 31.06px, 40px)", fontWeight: "400" },
        ],
        eyebrow: ["16px", { lineHeight: "26px", letterSpacing: "1.25px", fontWeight: "500" }],
        // Body copy uses leading-loose (line-height: 2) site-wide per design
        // direction — the value below and the other body-copy tokens
        // (card-body, faq-a, panel-body, small-print, redflag-bullet,
        // understanding-intro, footer-copy/tagline) all use the unitless "2"
        // multiplier so it scales with each token's (sometimes fluid) size.
        // Mobile override (below `sm`) lives in globals.css — see the
        // "Global body type sizes (mobile)" block there.
        "body-lg": ["18px", { lineHeight: "2", fontWeight: "400" }],
        button: ["16px", { lineHeight: "24px", fontWeight: "400" }],
        nav: ["16px", { lineHeight: "24px", letterSpacing: "0.85px", fontWeight: "400" }],
        "faq-q": ["19px", { lineHeight: "28px", fontWeight: "600" }],
        "faq-a": ["17px", { lineHeight: "2", fontWeight: "400" }],
        "faq-toggle": ["22px", { lineHeight: "28px", fontWeight: "400" }],
        "alt-label": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "stat-label": ["15px", { lineHeight: "22px", fontWeight: "500" }],
        "stat-value": ["18px", { lineHeight: "30px", fontWeight: "500" }],
        "btn-lg": ["22px", { lineHeight: "28px", fontWeight: "400" }],
        "btn-eyebrow": ["14px", { lineHeight: "18px", fontWeight: "400" }],
        field: ["15px", { lineHeight: "22px", fontWeight: "400" }],
        "calc-heading": ["19px", { lineHeight: "28px", fontWeight: "500" }],
        "calc-helper": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "field-error": ["13px", { lineHeight: "18px", fontWeight: "400" }],
        "footer-tagline": ["16px", { lineHeight: "2", fontWeight: "400" }],
        "footer-heading": [
          "17px",
          { lineHeight: "26px", letterSpacing: "1.25px", fontWeight: "500" },
        ],
        "footer-copy": ["15px", { lineHeight: "2", fontWeight: "400" }],
        // Fluid clamp() per condition-page-spec §E (ATS-073 responsive pass):
        // was a fixed 35px, which overflowed narrow flex columns at 375px
        // (one-word service names like "Traction/Decompression" in
        // ServiceListRow) and 768px (SpineAnatomy's 3-column grid). Same
        // 375→1728px interpolation as the display/h2 tokens above.
        "card-title": [
          "clamp(24px, 0.81vw + 20.95px, 35px)",
          { lineHeight: "clamp(25px, 0.89vw + 21.67px, 37px)", fontWeight: "500" },
        ],
        "card-body": ["16px", { lineHeight: "2", fontWeight: "400" }],
        // Fluid clamp() per condition-page-spec §E. 40px/48px is the
        // existing (desktop-sourced) value, kept as the max; 28px/34px is
        // a judgment-call mobile minimum, not spec-confirmed — no
        // breakpoint frames exist in Figma to sample (same caveat as the
        // display token above).
        "doctor-name": [
          "clamp(28px, 0.89vw + 24.67px, 40px)",
          { lineHeight: "clamp(34px, 1.03vw + 30.12px, 48px)", fontWeight: "500" },
        ],
        // Fluid clamp() per condition-page-spec §E. 30px/40px is the
        // existing (desktop-sourced) value, kept as the max; 22px/30px is
        // a judgment-call mobile minimum (same caveat as doctor-name above).
        "understanding-intro": [
          "clamp(22px, 0.59vw + 19.78px, 30px)",
          { lineHeight: "2", fontWeight: "400" },
        ],
        "type-name": ["22px", { lineHeight: "28px", fontWeight: "600" }],
        "redflag-bullet": ["17px", { lineHeight: "2", fontWeight: "400" }],
        "selected-label": [
          "25px",
          { lineHeight: "40px", letterSpacing: "1.25px", fontWeight: "600" },
        ],
        "panel-body": ["22px", { lineHeight: "2", fontWeight: "400" }],
        "small-print": ["16px", { lineHeight: "2", fontWeight: "400" }],
      },
    },
  },
};

export default config;
