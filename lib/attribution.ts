/** Marketing attribution is deliberately limited to click/campaign identifiers. */
const ATTRIBUTION_PARAMS = [
  "gclid",
  "gbraid",
  "wbraid",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

type AttributionKey = (typeof ATTRIBUTION_PARAMS)[number];
export type Attribution = Partial<Record<AttributionKey, string>>;

const STORAGE_KEY = "ats_attribution_v3";
const LEGACY_SESSION_KEYS = ["ats_attribution_v2", "ats_attribution"] as const;
const STORAGE_VERSION = 3;
const ATTRIBUTION_TTL_MS = 90 * 24 * 60 * 60 * 1_000;
const MAX_VALUE_LENGTH = 512;

interface AttributionEnvelope {
  version: typeof STORAGE_VERSION;
  capturedAt: string;
  expiresAt: string;
  attribution: Attribution;
}

function makeEnvelope(attribution: Attribution, now = Date.now()): AttributionEnvelope {
  return {
    version: STORAGE_VERSION,
    capturedAt: new Date(now).toISOString(),
    expiresAt: new Date(now + ATTRIBUTION_TTL_MS).toISOString(),
    attribution,
  };
}

/** Server-side authoritative whitelist and length ceiling for untrusted input. */
export function sanitizeAttribution(input: unknown): Attribution {
  if (typeof input !== "object" || input === null) return {};
  const record = input as Record<string, unknown>;
  const result: Attribution = {};
  for (const key of ATTRIBUTION_PARAMS) {
    const value = record[key];
    if (typeof value !== "string") continue;
    const trimmed = value.trim();
    if (trimmed) result[key] = trimmed.slice(0, MAX_VALUE_LENGTH);
  }
  return result;
}

function parseEnvelope(raw: string | null, now = Date.now()): Attribution | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return null;
    const envelope = parsed as Partial<AttributionEnvelope>;
    if (envelope.version !== STORAGE_VERSION || typeof envelope.expiresAt !== "string") return null;
    const expiresAt = Date.parse(envelope.expiresAt);
    if (!Number.isFinite(expiresAt) || expiresAt <= now) return null;
    return sanitizeAttribution(envelope.attribution);
  } catch {
    return null;
  }
}

function parseLegacy(raw: string | null): Attribution {
  if (!raw) return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return {};
    const record = parsed as Record<string, unknown>;
    return sanitizeAttribution(
      typeof record.attribution === "object" && record.attribution !== null
        ? record.attribution
        : record,
    );
  } catch {
    return {};
  }
}

function writePersistent(attribution: Attribution): boolean {
  const envelope = JSON.stringify(makeEnvelope(attribution));
  try {
    window.localStorage.setItem(STORAGE_KEY, envelope);
    for (const key of LEGACY_SESSION_KEYS) window.sessionStorage.removeItem(key);
    window.sessionStorage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, envelope);
    } catch {
      // Storage may be unavailable in private/restricted browser contexts.
    }
    return false;
  }
}

function readPersistent(): Attribution | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const attribution = parseEnvelope(raw);
    if (attribution) return attribution;
    if (raw) window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Fall through to bounded session storage and legacy migration.
  }

  try {
    const sessionAttribution = parseEnvelope(window.sessionStorage.getItem(STORAGE_KEY));
    if (sessionAttribution) return sessionAttribution;
  } catch {
    // Fall through to legacy keys.
  }
  return null;
}

function migrateLegacyAttribution(): Attribution {
  for (const key of LEGACY_SESSION_KEYS) {
    try {
      const attribution = parseLegacy(window.sessionStorage.getItem(key));
      if (Object.keys(attribution).length > 0) {
        writePersistent(attribution);
        return attribution;
      }
    } catch {
      // Try the next exact legacy key; never inspect arbitrary storage data.
    }
  }
  return {};
}

/** Captures a fresh click/campaign value and extends the bounded 90-day window. */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const found: Attribution = {};
  for (const key of ATTRIBUTION_PARAMS) {
    const value = params.get(key)?.trim();
    if (value) found[key] = value.slice(0, MAX_VALUE_LENGTH);
  }
  if (Object.keys(found).length === 0) return;

  const existing = getStoredAttribution();
  writePersistent({ ...existing, ...found });
}

export function getStoredAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  return readPersistent() ?? migrateLegacyAttribution();
}
