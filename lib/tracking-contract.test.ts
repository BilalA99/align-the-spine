import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const read = (path: string) => readFileSync(join(root, path), "utf8");

describe("static ATS tracking contract", () => {
  it.each([
    "components/ui/lead-form.tsx",
    "components/ui/underline-form.tsx",
    "components/sections/booking-form.tsx",
  ])("%s explicitly uses POST", (path) => {
    expect(read(path)).toMatch(/<form[\s\S]*?method="post"/);
  });

  it("the thank-you page does not produce a conversion", () => {
    expect(read("app/thank-you/page.tsx")).not.toContain("ats_lead_success");
    expect(read("app/thank-you/page.tsx")).not.toContain("trackLeadSuccess");
  });

  it("Enhanced Conversions infrastructure remains isolated from ATS forms", () => {
    const enhanced = read("lib/analytics/enhanced-conversions.ts");
    expect(enhanced).toContain("NEXT_PUBLIC_GOOGLE_ADS_ENHANCED_CONVERSIONS");
    expect(enhanced).toContain('"user_data"');
    for (const path of [
      "components/ui/lead-form.tsx",
      "components/ui/underline-form.tsx",
      "components/sections/booking-form.tsx",
      "lib/lead/submit-client.ts",
      "lib/analytics/lead-events.ts",
    ]) {
      expect(read(path)).not.toContain("enhanced-conversions");
      expect(read(path)).not.toContain("user_data");
    }
  });
});
