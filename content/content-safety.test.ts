import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/** ATS-E4 (4.17): fails CI if a forbidden placeholder/unverified-claim
 * string, or a placeholder `#` link, shows up in source that ships to
 * production. Scans app/, components/, content/, and lib/ — everywhere
 * page copy and content records live.
 *
 * Comments are stripped before matching (both `/* * /` block comments and
 * `//` line comments) so this file's own doc comments — which quote these
 * same forbidden strings while documenting that they were removed — don't
 * trip the check. This is a line-based heuristic, not a real parser: it
 * doesn't understand strings containing `//`, but nothing in this codebase
 * does. If a legitimate future value would trip this test (e.g. a real
 * approved $50 offer with client sign-off), update FORBIDDEN_STRINGS
 * deliberately — don't work around it by re-wording the string. */
const SCAN_ROOTS = ["app", "components", "content", "lib"];
const EXCLUDE_DIRS = new Set(["node_modules", ".next", "__snapshots__"]);
const SCAN_EXTENSIONS = [".ts", ".tsx"];
const SELF_EXCLUDE = "content/content-safety.test.ts";

interface ForbiddenString {
  label: string;
  needle: string;
}

const FORBIDDEN_STRINGS: ForbiddenString[] = [
  { label: "placeholder phone number", needle: "(954) 123-4576" },
  { label: "removed emergency-priority claim", needle: "Priority for emergency cases" },
  // "$50 office visit" offer is client-approved — allowlisted deliberately per the
  // note above (real approved offer with sign-off), not by re-wording the string.
  { label: "unverified $0/PIP insurance claim", needle: "$0" },
  { label: "unverified insurance-acceptance claim", needle: "most major insurance" },
  { label: "unverified insurance-acceptance claim", needle: "all major insurance" },
  { label: "unverified review count", needle: "152 reviews" },
  {
    label: "unverified accident-patient-referral claim",
    needle: "the doctor South Florida refers accident patients to",
  },
  { label: "placeholder testimonial author", needle: "Maria G." },
  { label: "PIP coverage guarantee", needle: "PIP-covered" },
  { label: "PIP coverage guarantee", needle: "Covered entirely by" },
  { label: "banned superlative", needle: "Elite spinal" },
  { label: "banned superlative", needle: "medical excellence" },
  { label: "banned superlative", needle: "Premium chiropractic care" },
  // ATS-E4a: shipped twice already (once caught under ATS-E4, then
  // reintroduced) — the source Figma frame carries the same misspelling, so
  // this is the guard against a third occurrence. Deliberately doesn't ban
  // "Myofasial"/"gratson" inside content/concussion-page.ts's own doc
  // comment, which quotes them while documenting why that Figma copy was
  // rejected — stripComments() already exists for exactly that case.
  { label: "misspelling: Myofasial (should be Myofascial)", needle: "Myofasial" },
  { label: "misspelling: gratson (should be Graston)", needle: "gratson" },
  { label: "misspelling: Gratson (should be Graston)", needle: "Gratson" },
];

function stripComments(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .split("\n")
    .map((line) => {
      const idx = line.indexOf("//");
      return idx === -1 ? line : line.slice(0, idx);
    })
    .join("\n");
}

function collectFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    if (EXCLUDE_DIRS.has(entry)) continue;
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      files.push(...collectFiles(fullPath));
    } else if (SCAN_EXTENSIONS.some((ext) => entry.endsWith(ext)) && !entry.endsWith(".test.ts")) {
      files.push(fullPath);
    }
  }
  return files;
}

const repoRoot = join(__dirname, "..");
const allFiles = SCAN_ROOTS.flatMap((root) => collectFiles(join(repoRoot, root))).filter(
  (file) => !file.replace(repoRoot + "/", "").startsWith(SELF_EXCLUDE),
);

describe("content safety (ATS-E4 4.17)", () => {
  it.each(FORBIDDEN_STRINGS)(
    'does not contain the forbidden string "$needle" ($label)',
    ({ needle }) => {
      const offenders: string[] = [];
      for (const file of allFiles) {
        const code = stripComments(readFileSync(file, "utf8"));
        if (code.includes(needle)) {
          offenders.push(file.replace(repoRoot + "/", ""));
        }
      }
      expect(offenders).toEqual([]);
    },
  );

  it('contains no placeholder href="#" links', () => {
    const offenders: string[] = [];
    for (const file of allFiles) {
      const code = stripComments(readFileSync(file, "utf8"));
      if (/href\s*[:=]\s*["']#["']/.test(code)) {
        offenders.push(file.replace(repoRoot + "/", ""));
      }
    }
    expect(offenders).toEqual([]);
  });
});
