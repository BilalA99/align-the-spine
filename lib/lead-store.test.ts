import { beforeEach, describe, expect, it, vi } from "vitest";

import { getSupabaseAdmin } from "@/lib/supabase-admin";

vi.mock("@/lib/supabase-admin", () => ({
  getSupabaseAdmin: vi.fn(),
}));

/** Minimal fake standing in for the Supabase JS client, backed by an
 * in-memory array — just enough chainable surface for lib/lead-store.ts's
 * two query shapes (insert().select().maybeSingle(), select().eq().single(),
 * update().eq()). Real enough to exercise the UNIQUE-violation / dedupe path
 * (Postgres error code 23505) without needing a live database in CI. */
function createFakeSupabase() {
  const rows: Record<string, unknown>[] = [];
  let nextId = 1;

  const client = {
    from(_table: string) {
      return {
        insert(row: Record<string, unknown>) {
          const conflict = rows.find((r) => r.idempotency_key === row.idempotency_key);
          return {
            select() {
              return {
                async maybeSingle() {
                  if (conflict) {
                    return { data: null, error: { code: "23505", message: "duplicate key" } };
                  }
                  const inserted = {
                    id: `lead-${nextId++}`,
                    created_at: new Date().toISOString(),
                    ...row,
                  };
                  rows.push(inserted);
                  return { data: inserted, error: null };
                },
              };
            },
          };
        },
        select() {
          return {
            eq(column: string, value: unknown) {
              return {
                async single() {
                  const found = rows.find((r) => r[column] === value);
                  return found
                    ? { data: found, error: null }
                    : { data: null, error: { message: "not found" } };
                },
              };
            },
          };
        },
        update(patch: Record<string, unknown>) {
          return {
            eq(column: string, value: unknown) {
              const target = rows.find((r) => r[column] === value);
              if (target) Object.assign(target, patch);
              return Promise.resolve({ error: target ? null : { message: "not found" } });
            },
          };
        },
      };
    },
  };

  return { client, rows };
}

describe("lib/lead-store", () => {
  let fake: ReturnType<typeof createFakeSupabase>;

  beforeEach(() => {
    fake = createFakeSupabase();
    vi.mocked(getSupabaseAdmin).mockReturnValue(fake.client as never);
  });

  it("persists a new lead and returns isDuplicate: false", async () => {
    const { persistLead } = await import("@/lib/lead-store");
    const { lead, isDuplicate } = await persistLead({
      variant: "heroEval",
      values: { name: "Jane Doe", phone: "5551234567" },
      attribution: { gclid: "abc123" },
      priority: "normal",
    });

    expect(isDuplicate).toBe(false);
    expect(lead.variant).toBe("heroEval");
    expect(lead.fields).toEqual({ name: "Jane Doe", phone: "5551234567" });
    expect(fake.rows).toHaveLength(1);
  });

  it("deduplicates an identical resubmission and preserves the original row", async () => {
    const { persistLead } = await import("@/lib/lead-store");
    const input = {
      variant: "heroEval",
      values: { name: "Jane Doe", phone: "5551234567" },
      attribution: { gclid: "original-click" },
      priority: "normal",
    };

    const first = await persistLead(input);
    // A retry that arrives with different (or missing) attribution must NOT
    // overwrite the original — this is exactly what 5.7 requires.
    const second = await persistLead({ ...input, attribution: { gclid: "retry-click" } });

    expect(second.isDuplicate).toBe(true);
    expect(second.lead.id).toBe(first.lead.id);
    expect(second.lead.attribution).toEqual({ gclid: "original-click" });
    expect(fake.rows).toHaveLength(1);
  });

  it("throws (never silently succeeds) when the datastore itself fails", async () => {
    vi.mocked(getSupabaseAdmin).mockReturnValue({
      from: () => ({
        insert: () => ({
          select: () => ({
            maybeSingle: async () => ({
              data: null,
              error: { code: "08006", message: "connection refused" },
            }),
          }),
        }),
      }),
    } as never);

    const { persistLead } = await import("@/lib/lead-store");
    await expect(
      persistLead({
        variant: "heroEval",
        values: { name: "Jane" },
        attribution: {},
        priority: "normal",
      }),
    ).rejects.toThrow(/persist failed/);
  });

  it("records a failed delivery outcome without throwing", async () => {
    const { persistLead, recordDeliveryOutcome } = await import("@/lib/lead-store");
    const { lead } = await persistLead({
      variant: "heroEval",
      values: { name: "Jane" },
      attribution: {},
      priority: "normal",
    });

    await recordDeliveryOutcome(lead.id, {
      deliveryStatus: "failed",
      retryCount: 3,
      finalFailureState: true,
    });

    expect(fake.rows[0]).toMatchObject({ delivery_status: "failed", final_failure_state: true });
  });

  it("records a safe error_category, never the raw failure reason, on a failed outcome", async () => {
    const { persistLead, recordDeliveryOutcome } = await import("@/lib/lead-store");
    const { lead } = await persistLead({
      variant: "heroEval",
      values: { name: "Jane" },
      attribution: {},
      priority: "normal",
    });

    await recordDeliveryOutcome(lead.id, {
      deliveryStatus: "failed",
      retryCount: 3,
      finalFailureState: true,
      errorCategory: "provider_outage",
    });

    expect(fake.rows[0]).toMatchObject({ error_category: "provider_outage" });
    expect(fake.rows[0].failed_at).toBeTruthy();
  });
});

/** ATS-E5a Step 5/6: findStuckPendingLeads/countStuckPendingLeads use a
 * different Supabase query shape (select().eq().lt().order().limit(),
 * directly awaited with no terminal .single()/.maybeSingle() call, plus a
 * count-mode select()) — a separate, purpose-built fake rather than
 * stretching createFakeSupabase's insert/select/update closures to cover a
 * shape they were never written for. */
function createFakeSupabaseForStuckQueries(
  rows: { id: string; delivery_status: string; created_at: string }[],
) {
  return {
    from(_table: string) {
      return {
        select(_cols?: string, opts?: { count?: string; head?: boolean }) {
          const filters: ((r: (typeof rows)[number]) => boolean)[] = [];
          let limitN: number | undefined;
          const query = {
            eq(column: string, value: unknown) {
              filters.push((r) => (r as Record<string, unknown>)[column] === value);
              return query;
            },
            lt(column: string, value: string) {
              filters.push((r) => String((r as Record<string, unknown>)[column]) < value);
              return query;
            },
            order() {
              return query;
            },
            limit(n: number) {
              limitN = n;
              return query;
            },
            then(resolve: (result: { data?: unknown; count?: number; error: null }) => unknown) {
              let matched = rows.filter((r) => filters.every((f) => f(r)));
              if (limitN !== undefined) matched = matched.slice(0, limitN);
              if (opts?.count) return resolve({ count: matched.length, error: null });
              return resolve({ data: matched, error: null });
            },
          };
          return query;
        },
      };
    },
  };
}

describe("lib/lead-store: findStuckPendingLeads / countStuckPendingLeads (ATS-E5a)", () => {
  const now = Date.now();
  const rows = [
    {
      id: "lead-old-pending",
      delivery_status: "pending",
      created_at: new Date(now - 10 * 60 * 1000).toISOString(), // 10 min old
    },
    {
      id: "lead-fresh-pending",
      delivery_status: "pending",
      created_at: new Date(now - 30 * 1000).toISOString(), // 30s old — after() likely still in flight
    },
    {
      id: "lead-delivered",
      delivery_status: "delivered",
      created_at: new Date(now - 10 * 60 * 1000).toISOString(),
    },
  ];

  it("findStuckPendingLeads only returns pending leads older than the threshold", async () => {
    vi.mocked(getSupabaseAdmin).mockReturnValue(createFakeSupabaseForStuckQueries(rows) as never);
    const { findStuckPendingLeads } = await import("@/lib/lead-store");

    const stuck = await findStuckPendingLeads(2 * 60 * 1000);
    expect(stuck.map((l) => l.id)).toEqual(["lead-old-pending"]);
  });

  it("countStuckPendingLeads counts pending leads past the escalation threshold", async () => {
    vi.mocked(getSupabaseAdmin).mockReturnValue(createFakeSupabaseForStuckQueries(rows) as never);
    const { countStuckPendingLeads } = await import("@/lib/lead-store");

    // 10-minute-old pending lead does NOT count against a 30-minute threshold.
    expect(await countStuckPendingLeads(30 * 60 * 1000)).toBe(0);
    // ...but does against a 5-minute one.
    expect(await countStuckPendingLeads(5 * 60 * 1000)).toBe(1);
  });
});
