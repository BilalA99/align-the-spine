import { notFound } from "next/navigation";

import { ContentArticle } from "@/components/content/content-article";
import { getEditorialContentRepository } from "@/lib/content";
import { requireEditorialActor } from "@/lib/content/authorization";
import { fixtureAssets, fixtureAuthors } from "@/lib/content/fixtures";
import { estimatedReadingMinutes } from "@/lib/content/schemas";

export const dynamic = "force-dynamic";

export default async function AdminPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  await requireEditorialActor();
  const { id } = await params;
  const item = await (await getEditorialContentRepository()).getEditorialById(id);
  if (!item) notFound();
  const author = item.author ?? fixtureAuthors.find((entry) => entry.id === item.authorId);
  if (!author) notFound();
  const featuredImage =
    item.featuredImage ?? fixtureAssets.find((entry) => entry.id === item.featuredImageAssetId);
  const {
    primaryKeyword: _p,
    searchIntent: _s,
    audience: _a,
    canonicalOverride: _c,
    version: _v,
    author: _author,
    featuredImage: _featuredImage,
    ...fields
  } = item;
  void [_p, _s, _a, _c, _v, _author, _featuredImage];
  const previewItem = {
    ...fields,
    author,
    featuredImage,
    estimatedReadingMinutes: estimatedReadingMinutes(item.blocks),
  };
  return (
    <main id="main-content">
      <div
        role="status"
        aria-live="polite"
        className="fixed inset-x-0 top-[64px] z-40 bg-amber-100 px-4 py-2 text-center text-sm font-semibold text-amber-950"
      >
        Draft preview · noindex · not public
      </div>
      <div className="pt-10">
        <ContentArticle item={previewItem} area={item.contentType === "service_area"} />
      </div>
    </main>
  );
}
