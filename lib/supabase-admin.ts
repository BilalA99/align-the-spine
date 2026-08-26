import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** Server-only Supabase client using the `service_role` key, which bypasses
 * Row Level Security (see supabase/migrations/0001_leads.sql — the `leads`
 * table has RLS enabled with zero policies, so only this client can touch
 * it). Never import this from a "use client" component or expose
 * SUPABASE_SERVICE_ROLE_KEY as a NEXT_PUBLIC_* var — that would hand every
 * visitor full read/write access to every lead ever submitted. */

let cached: SupabaseClient | null = null;

/** Throws rather than falling back to a partially-configured client — a
 * missing key here means ATS-E5's entire durability guarantee is gone, so
 * failing loudly at first use is far better than silently no-op'ing (the
 * exact failure mode this ticket exists to eliminate from the old
 * `after()`-only email path). */
export function getSupabaseAdmin(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error(
      "lib/supabase-admin.ts: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must both be set.",
    );
  }

  cached = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
