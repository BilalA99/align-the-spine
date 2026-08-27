import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContentArticle } from "@/components/content/content-article";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/content/site";
import { getPublicContentBySlug, listPublicContentByIds } from "@/lib/content/public-content";
import { buildMedicalWebPage, DR_ABE_PERSON_ID, ORGANIZATION_ID } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo/metadata";

// Fallback social-share image for posts that don't have a featured image
// yet (no per-post photo set via the CMS's "Featured image URL" field) —
// same reasoning as the service-area pages' fallback: a text-only OG/Twitter
// card is worse than a real, on-brand photo even if it's not unique to the
// post.
const SHARED_OG_IMAGE = {
  src: "https://align-the-spine.b-cdn.net/images/WhatsApp%20Image%202026-08-17%20at%2017.38.56%20(1).jpeg",
  alt: "Align the Spine Chiropractic treatment room in Deerfield Beach, FL",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPublicContentBySlug("blog_post", slug);
  if (!item) return { title: "Resource not found", robots: { index: false, follow: false } };
  return buildMetadata({
    path: `/blog/${item.slug}`,
    title: item.seoTitle,
    description: item.metaDescription,
    image: item.featuredImage
      ? { src: item.featuredImage.url, alt: item.featuredImage.alt }
      : SHARED_OG_IMAGE,
  });
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getPublicContentBySlug("blog_post", slug);
  if (!item) notFound();
  const relatedItems = await listPublicContentByIds(item.relatedContentIds);
  const canonical = `${siteConfig.siteUrl}/blog/${item.slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: canonical,
    headline: item.title,
    description: item.metaDescription,
    // item.featuredImage.url is already absolute (a CDN URL) — prefixing it
    // with siteUrl here previously produced a malformed double-domain URL
    // (confirmed real bug, fixed 2026-08-18).
    image: item.featuredImage ? [item.featuredImage.url] : undefined,
    datePublished: item.publishedAt,
    dateModified: item.updatedAt,
    author: {
      "@type": "Person",
      "@id":
        item.author.slug === "dr-abe-nasser"
          ? DR_ABE_PERSON_ID
          : `${siteConfig.siteUrl}${item.author.profileUrl}`,
      name: item.author.name,
    },
    publisher: { "@id": ORGANIZATION_ID },
    url: canonical,
  };
  return (
    <>
      <JsonLd data={schema} />
      <JsonLd
        data={buildMedicalWebPage({
          path: `/blog/${item.slug}`,
          name: item.title,
          description: item.metaDescription,
          datePublished: item.publishedAt,
          dateModified: item.updatedAt,
          aboutTopic: item.title,
        })}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "" },
          { name: "Blog", path: "/blog" },
          { name: item.title, path: `/blog/${item.slug}` },
        ]}
      />
      <ContentArticle item={item} relatedItems={relatedItems} />
    </>
  );
}
