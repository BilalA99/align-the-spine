import Link from "next/link";
import { notFound } from "next/navigation";

import { EditorialForm } from "@/components/admin/editorial-form";
import { getEditorialContentRepository } from "@/lib/content";
import { requireEditorialActor } from "@/lib/content/authorization";
import { evaluatePublicationGates } from "@/lib/content/publication-gates";

export const dynamic = "force-dynamic";

export default async function AdminEditorPage({ params }: { params: Promise<{ id: string }> }) {
  await requireEditorialActor();
  const { id } = await params;
  const item = await (await getEditorialContentRepository()).getEditorialById(id);
  if (!item) notFound();
  const gates = evaluatePublicationGates(item);
  return (
    <main id="main-content" className="container py-10">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <Link
            href="/admin/content"
            className="text-sm font-semibold text-teal-500 underline underline-offset-4"
          >
            ← Content
          </Link>
          <h1 className="mt-3 font-display text-4xl text-navy-800">{item.title}</h1>
          <p className="mt-2 text-sm text-ink-500">
            {item.status.replaceAll("_", " ")} · version {item.version} · autosave unavailable in
            fixture demo
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/admin/content/${item.id}/preview`}
            className="inline-flex min-h-11 items-center rounded-full border border-navy-800 px-5 font-semibold text-navy-800"
          >
            Preview
          </Link>
          <button
            type="button"
            disabled
            className="min-h-11 rounded-full bg-navy-900 px-5 font-semibold text-white disabled:opacity-50"
          >
            Save draft
          </button>
        </div>
      </div>
      <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
        <EditorialForm item={item} editable={process.env.CONTENT_REPOSITORY_MODE === "supabase"} />
        <aside className="space-y-6">
          <section
            className="rounded-30 bg-white p-6 shadow-comparison"
            aria-labelledby="gate-heading"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 id="gate-heading" className="font-display text-2xl text-navy-800">
                Publication checklist
              </h2>
              <span
                className={`rounded-full px-3 py-1 text-sm font-semibold ${gates.passed ? "bg-[#e9f7f5] text-teal-500" : "bg-red-50 text-error"}`}
              >
                {gates.passed ? "Pass" : "Blocked"}
              </span>
            </div>
            {gates.blockers.length ? (
              <ul className="mt-5 space-y-3">
                {gates.blockers.map((blocker) => (
                  <li key={blocker} className="flex gap-2 text-sm leading-6 text-error">
                    <span aria-hidden="true">●</span>
                    {blocker}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-ink-500">All hard gates pass.</p>
            )}
            {gates.recommendations.length ? (
              <div className="mt-6 border-t pt-5">
                <h3 className="font-semibold text-navy-800">Recommendations</h3>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-ink-500">
                  {gates.recommendations.map((entry) => (
                    <li key={entry}>{entry}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </section>
          <section className="rounded-30 bg-white p-6 shadow-comparison">
            <h2 className="font-display text-2xl text-navy-800">Sources</h2>
            <ul className="mt-4 space-y-3 text-sm text-ink-500">
              {item.sources.length ? (
                item.sources.map((source) => (
                  <li key={source.id}>
                    <span className="font-semibold text-navy-800">{source.title}</span>
                    <span className="block">Supports: {source.claimSupported}</span>
                  </li>
                ))
              ) : (
                <li>No sources attached.</li>
              )}
            </ul>
          </section>
        </aside>
      </div>
    </main>
  );
}
