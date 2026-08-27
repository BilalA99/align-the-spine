import Link from "next/link";

import { getEditorialContentRepository } from "@/lib/content";
import { requireEditorialActor } from "@/lib/content/authorization";

export const dynamic = "force-dynamic";

export default async function AdminContentPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; type?: string }>;
}) {
  const [actor, items, params] = await Promise.all([
    requireEditorialActor(),
    (await getEditorialContentRepository()).listEditorial(),
    searchParams,
  ]);
  const filtered = items.filter(
    (item) =>
      (!params.status || item.status === params.status) &&
      (!params.type || item.contentType === params.type),
  );
  const counts = {
    drafts: items.filter((item) => item.status === "draft").length,
    review: items.filter((item) => item.status === "in_review").length,
    scheduled: items.filter((item) => item.status === "scheduled").length,
    published: items.filter((item) => item.status === "published").length,
    blocked: items.filter((item) => !item.gateResult.passed).length,
  };
  return (
    <main id="main-content" className="container py-10">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-teal-500">
            Signed in as {actor.displayName}
          </p>
          <h1 className="mt-2 font-display text-5xl text-navy-800">Content dashboard</h1>
          <p className="mt-3 text-ink-500">
            Editorial content only—never enter patient or accident narrative data.
          </p>
        </div>
        <button
          type="button"
          disabled
          className="min-h-11 rounded-full bg-navy-900 px-6 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          title="Enabled after the authenticated mutation adapter is connected"
        >
          Create draft
        </button>
      </div>
      <section
        aria-label="Content status summary"
        className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
      >
        {Object.entries(counts).map(([label, value]) => (
          <div key={label} className="rounded-20 bg-white p-5 shadow-comparison">
            <p className="text-sm font-semibold capitalize text-ink-500">{label}</p>
            <p className="mt-2 font-display text-4xl text-navy-800">{value}</p>
          </div>
        ))}
      </section>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/admin/content"
          className="inline-flex min-h-11 items-center rounded-full border border-navy-800 px-5 text-sm font-semibold text-navy-800"
        >
          All
        </Link>
        {["draft", "in_review", "approved", "scheduled", "published", "archived"].map((status) => (
          <Link
            key={status}
            href={`/admin/content?status=${status}`}
            className="inline-flex min-h-11 items-center rounded-full border border-mute-300 bg-white px-5 text-sm font-semibold text-navy-800"
          >
            {status.replaceAll("_", " ")}
          </Link>
        ))}
      </div>
      <div
        className="mt-8 overflow-x-auto rounded-20 bg-white shadow-comparison"
        tabIndex={0}
        role="region"
        aria-label="Content items"
      >
        <table className="w-full min-w-[760px] text-left">
          <thead>
            <tr className="border-b border-mute-300 text-sm text-ink-500">
              <th className="p-4" scope="col">
                Title
              </th>
              <th className="p-4" scope="col">
                Type
              </th>
              <th className="p-4" scope="col">
                Status
              </th>
              <th className="p-4" scope="col">
                Version
              </th>
              <th className="p-4" scope="col">
                Publication gates
              </th>
              <th className="p-4" scope="col">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="border-b border-mute-300/70 last:border-0">
                <td className="p-4">
                  <span className="font-semibold text-navy-800">{item.title}</span>
                  <span className="mt-1 block text-sm text-ink-500">
                    /{item.contentType === "blog_post" ? "blog" : "service-areas"}/{item.slug}
                  </span>
                </td>
                <td className="p-4">{item.contentType.replaceAll("_", " ")}</td>
                <td className="p-4">
                  <span className="rounded-full bg-panel-100 px-3 py-1 text-sm">
                    {item.status.replaceAll("_", " ")}
                  </span>
                </td>
                <td className="p-4">{item.version}</td>
                <td className="p-4">
                  <span className={item.gateResult.passed ? "text-teal-500" : "text-error"}>
                    {item.gateResult.passed
                      ? "Pass"
                      : `${item.gateResult.blockers.length} blocker${item.gateResult.blockers.length === 1 ? "" : "s"}`}
                  </span>
                </td>
                <td className="p-4">
                  <Link
                    className="inline-flex min-h-11 items-center rounded-full border border-navy-800 px-4 font-semibold text-navy-800"
                    href={`/admin/content/${item.id}`}
                  >
                    Open
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
