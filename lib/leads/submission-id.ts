/**
 * Client-safe generator for the per-submission idempotency key. Held in a ref
 * per form instance and reused across retries, so a double-click or a
 * retried-after-error submit collapses to ONE lead server-side (the leads table
 * is unique on submission_id). Contains no server imports — safe in "use client"
 * components.
 */
export function newSubmissionId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // Fallback for non-secure/older contexts.
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** Shared client/server validation for the canonical technical submission ID. */
export function isSubmissionId(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
  );
}
