import { describe, expect, it } from "vitest";

import { classifyLeadPriority } from "./priority";

describe("private lead priority", () => {
  it("classifies explicit accident answers and booking reasons as high", () => {
    expect(classifyLeadPriority("heroEval", { carAccident: "yes" })).toBe("high");
    expect(classifyLeadPriority("booking", { reason: "accident" })).toBe("high");
  });

  it("honors an explicit no before accident-form fallback", () => {
    expect(classifyLeadPriority("carAccident", { carAccident: "no" })).toBe("standard");
  });

  it("uses accident-specific variants as a private fallback", () => {
    expect(classifyLeadPriority("carAccident", {})).toBe("high");
    expect(classifyLeadPriority("accidentEval", {})).toBe("high");
  });

  it("classifies general intake as standard", () => {
    expect(classifyLeadPriority("heroEval", {})).toBe("standard");
    expect(classifyLeadPriority("booking", { reason: "back-pain" })).toBe("standard");
  });
});
