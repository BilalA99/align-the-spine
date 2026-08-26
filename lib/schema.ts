import { doctorCredentials, doctorProfileContent } from "@/content/doctor-profile";
import type { FAQ } from "@/content/faqs";
import type { Service } from "@/content/services";
import { siteConfig } from "@/content/site";
import { isVerified } from "@/content/verified-value";

/** Stable @id anchors reused across every builder in this file and every
 * page that references another entity (e.g. Person.worksFor, WebSite.
 * publisher) — per ATS schema ticket §2.8, these must never be re-derived
 * ad hoc at a call site. */
export const ORGANIZATION_ID = `${siteConfig.siteUrl}/#organization`;
export const MEDICAL_BUSINESS_ID = `${siteConfig.siteUrl}/#business`;
export const WEBSITE_ID = `${siteConfig.siteUrl}/#website`;
export const DR_ABE_PERSON_ID = `${siteConfig.siteUrl}/about#dr-abe`;

export interface OrganizationSchema {
  "@context": "https://schema.org";
  "@type": "Organization";
  "@id": string;
  name: string;
  url: string;
  logo: string;
  sameAs?: string[];
}

/** Organization entity (ATS schema ticket §2.2/§2.3) — the brand-level
 * presence, distinct from the MedicalBusiness clinic entity below. `sameAs`
 * only includes social links marketing has confirmed (SocialLink.verified,
 * content/site.ts) — every current entry is an unconfirmed "#" placeholder,
 * so it's omitted entirely today rather than publish a guess. */
export function buildOrganization(): OrganizationSchema {
  const sameAs = siteConfig.social.filter((social) => social.verified).map((social) => social.url);

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: siteConfig.business.name,
    url: siteConfig.siteUrl,
    logo: `${siteConfig.siteUrl}/figma-exports/logo_blue.png`,
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

export interface WebSiteSchema {
  "@context": "https://schema.org";
  "@type": "WebSite";
  "@id": string;
  name: string;
  url: string;
  publisher: { "@id": string };
}

/** WebSite entity (ATS schema ticket §2.2/§2.3). No `potentialAction`
 * SearchAction — the site has no on-site search feature, and this ticket's
 * rule is to only render verified, real functionality. */
export function buildWebSite(): WebSiteSchema {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: siteConfig.business.name,
    url: siteConfig.siteUrl,
    publisher: { "@id": ORGANIZATION_ID },
  };
}

/** "9:00 AM" / "7:00 PM" -> "09:00" / "19:00", per schema.org's
 * openingHoursSpecification time format. Lifted from the retired
 * lib/seo/local-business.ts. Throws on an unparseable input rather than
 * silently emitting "NaN:undefined" into openingHoursSpecification —
 * consistent with assertNoPlaceholderUrls's fail-loud philosophy
 * (components/seo/json-ld.tsx). Exported for direct unit testing. */
export function to24Hour(time: string): string {
  const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) {
    throw new Error(`to24Hour: unparseable time string "${time}"`);
  }
  const [, hourStr, minute, meridiem] = match;
  let hour = Number(hourStr) % 12;
  if (meridiem?.toUpperCase() === "PM") hour += 12;
  return `${String(hour).padStart(2, "0")}:${minute}`;
}

export interface OpeningHoursSpec {
  "@type": "OpeningHoursSpecification";
  dayOfWeek: string;
  opens: string;
  closes: string;
}

export interface AggregateRatingSchema {
  "@type": "AggregateRating";
  ratingValue: number;
  reviewCount: number;
}

export interface MedicalBusinessSchema {
  "@context": "https://schema.org";
  "@type": "MedicalBusiness";
  "@id": string;
  name: string;
  url: string;
  telephone: string;
  email: string;
  address: {
    "@type": "PostalAddress";
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo: { "@type": "GeoCoordinates"; latitude: number; longitude: number };
  areaServed?: { "@type": "City"; name: string }[];
  parentOrganization: { "@id": string };
  openingHoursSpecification?: OpeningHoursSpec[];
  aggregateRating?: AggregateRatingSchema;
}

/** MedicalBusiness entity for the practice (ATS schema ticket §2.2/§2.3) —
 * "MedicalBusiness" is the required @type per the ticket's vocabulary rule
 * (never "Chiropractic", which is a medicine-system enum, not a business
 * type). Replaces the old lib/seo/local-business.ts's
 * `["MedicalClinic", "LocalBusiness"]` type array. `openingHoursSpecification`
 * only renders once siteConfig.hoursVerified is true (§2.9) — every day is
 * currently the same untouched 9-7 placeholder, unconfirmed by the client.
 * `aggregateRating` only renders once siteConfig.reviewsRating is verified,
 * same gating pattern — the rating/count it publishes is the exact figure
 * already shown on /reviews and in the homepage hero's trust line, never a
 * placeholder. `parentOrganization` links this clinic entity back to the
 * brand-level Organization entity (buildOrganization) so a JSON-LD consumer
 * sees one connected graph instead of two same-named, unrelated entities. */
export function buildMedicalBusiness(): MedicalBusinessSchema {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "@id": MEDICAL_BUSINESS_ID,
    name: siteConfig.business.name,
    url: siteConfig.siteUrl,
    telephone: siteConfig.business.phone,
    email: siteConfig.business.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${siteConfig.business.address.line1}, ${siteConfig.business.address.suite}`,
      addressLocality: siteConfig.business.address.city,
      addressRegion: siteConfig.business.address.state,
      postalCode: siteConfig.business.address.zip,
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.business.geo.latitude,
      longitude: siteConfig.business.geo.longitude,
    },
    ...(siteConfig.serviceAreasVerified
      ? {
          areaServed: siteConfig.serviceAreas.map((city) => ({
            "@type": "City" as const,
            name: city,
          })),
        }
      : {}),
    parentOrganization: { "@id": ORGANIZATION_ID },
    ...(siteConfig.hoursVerified
      ? {
          openingHoursSpecification: siteConfig.hours.map((hours) => ({
            "@type": "OpeningHoursSpecification" as const,
            dayOfWeek: hours.day,
            opens: to24Hour(hours.open),
            closes: to24Hour(hours.close),
          })),
        }
      : {}),
    ...(isVerified(siteConfig.reviewsRating)
      ? {
          aggregateRating: {
            "@type": "AggregateRating" as const,
            ratingValue: siteConfig.reviewsRating.value.rating,
            reviewCount: siteConfig.reviewsRating.value.count,
          },
        }
      : {}),
  };
}

export interface PersonSchema {
  "@context": "https://schema.org";
  "@type": "Person";
  "@id": string;
  name: string;
  url: string;
  image: string;
  jobTitle: string;
  worksFor: { "@id": string };
  alumniOf?: string[];
  hasCredential?: string[];
}

/** Person entity for Dr. Abe (ATS schema ticket §2.2/§2.4) — "Person", never
 * "Physician" (that requires explicit owner confirmation this codebase
 * doesn't have; "jobTitle: Chiropractor" is plain-text copy the site already
 * publishes everywhere, not a licensure @type claim). alumniOf/hasCredential
 * only render once doctorCredentials.verified is true — Dr. Abe hasn't
 * confirmed his degree/school/license yet, so today's output omits both
 * fields rather than publish an unverified claim. */
export function buildPerson(): PersonSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": DR_ABE_PERSON_ID,
    name: doctorProfileContent.name,
    url: `${siteConfig.siteUrl}/about`,
    image: `${siteConfig.siteUrl}${doctorProfileContent.portrait.src}`,
    jobTitle: "Chiropractor",
    worksFor: { "@id": MEDICAL_BUSINESS_ID },
    ...(doctorCredentials.verified
      ? {
          ...(doctorCredentials.alumniOf ? { alumniOf: doctorCredentials.alumniOf } : {}),
          ...(doctorCredentials.hasCredential
            ? { hasCredential: doctorCredentials.hasCredential }
            : {}),
        }
      : {}),
  };
}

export interface BreadcrumbItemInput {
  /** Visible crumb label, e.g. "Services". */
  name: string;
  /** Route path from the site root, e.g. "/services". Use "" for Home. */
  path: string;
}

export interface BreadcrumbListSchema {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: { "@type": "ListItem"; position: number; name: string; item: string }[];
}

/** BreadcrumbList entity (ATS schema ticket §2.2/§2.6). `items` must mirror
 * the page's actual navigable path — e.g. a condition page passes
 * `[{ name: "Home", path: "" }, { name: condition.name, path: "/conditions/x" }]`,
 * not a fabricated intermediate "Conditions" hub (no such page exists in
 * this site). */
export function buildBreadcrumbList(items: BreadcrumbItemInput[]): BreadcrumbListSchema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem" as const,
      position: index + 1,
      name: item.name,
      item: `${siteConfig.siteUrl}${item.path}`,
    })),
  };
}

export interface ServiceSchema {
  "@context": "https://schema.org";
  "@type": "Service";
  "@id": string;
  name: string;
  description: string;
  provider: { "@id": string };
  areaServed?: { "@type": "City"; name: string }[];
  url: string;
}

/** Service entity (ATS schema ticket §2.2/§2.5). One per entry in
 * content/services-grid.ts — the array actually rendered by ServiceCatalog
 * on /services (content/services.ts is a separate list that feeds the
 * homepage's ServicesSection instead). There is no /services/[slug] route
 * in this codebase (services render as a single grid on /services), so
 * each gets its own #{slug} anchor on that one page instead of a dedicated
 * URL. The `Service` type here just happens to be structurally identical
 * to `ServiceCardItem` (content/services-grid.ts), which is what callers
 * actually pass. */
export function buildService(service: Service): ServiceSchema {
  const url = `${siteConfig.siteUrl}/services#${service.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": url,
    name: service.name,
    description: service.summary,
    provider: { "@id": MEDICAL_BUSINESS_ID },
    ...(siteConfig.serviceAreasVerified
      ? {
          areaServed: siteConfig.serviceAreas.map((city) => ({
            "@type": "City" as const,
            name: city,
          })),
        }
      : {}),
    url,
  };
}

export interface ServiceAreaSchemaInput {
  slug: string;
  communityName: string;
  metaDescription: string;
}

/** Service entity scoped to one published service-area page's own verified
 * community — never the global (unverified) siteConfig.serviceAreas list.
 * Safe by construction: publication-gates.ts already requires evidence and
 * an approved relationship before a service-area record can be public, so
 * any item this runs against has already passed that gate. */
export function buildServiceAreaSchema(item: ServiceAreaSchemaInput): ServiceSchema {
  const url = `${siteConfig.siteUrl}/service-areas/${item.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": url,
    name: `Chiropractic care for ${item.communityName} residents`,
    description: item.metaDescription,
    provider: { "@id": MEDICAL_BUSINESS_ID },
    areaServed: [{ "@type": "City", name: item.communityName }],
    url,
  };
}

export interface MedicalWebPageSchema {
  "@context": "https://schema.org";
  "@type": "MedicalWebPage";
  "@id": string;
  url: string;
  name: string;
  description: string;
  inLanguage: "en-US";
  datePublished?: string;
  dateModified: string;
  author: { "@id": string };
  publisher: { "@id": string };
  mainEntityOfPage: string;
  medicalAudience: { "@type": "MedicalAudience"; audienceType: string };
  about: { "@type": "MedicalTherapy"; name: string };
}

export interface MedicalWebPageInput {
  path: string;
  name: string;
  description: string;
  dateModified: string;
  datePublished?: string;
  /** What the page is substantively about, e.g. "Chiropractic care after a
   * motor vehicle accident" — kept generic/topical, not a diagnosis claim. */
  aboutTopic: string;
}

/** MedicalWebPage entity for content pages discussing chiropractic/injury
 * care (service-area and blog-article pages) — distinct from the
 * MedicalBusiness/Service entities, which describe the practice and its
 * offerings, not this specific page's content, authorship, and freshness.
 * Deliberately omits `reviewedBy`/`lastReviewed`: this codebase's own
 * publication gate discloses that formal clinician medical review has NOT
 * happened for this content (see static-service-area-repository.ts's
 * GATE_RESULT) — claiming a review via schema would contradict that
 * disclosure, so only authorship/dates/audience are asserted, nothing that
 * implies clinical sign-off. */
export function buildMedicalWebPage(input: MedicalWebPageInput): MedicalWebPageSchema {
  const url = `${siteConfig.siteUrl}${input.path}`;
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "@id": `${url}#webpage`,
    url,
    name: input.name,
    description: input.description,
    inLanguage: "en-US",
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    dateModified: input.dateModified,
    author: { "@id": DR_ABE_PERSON_ID },
    publisher: { "@id": ORGANIZATION_ID },
    mainEntityOfPage: url,
    medicalAudience: { "@type": "MedicalAudience", audienceType: "Patient" },
    about: { "@type": "MedicalTherapy", name: input.aboutTopic },
  };
}

export interface FAQPageSchema {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  mainEntity: {
    "@type": "Question";
    name: string;
    acceptedAnswer: { "@type": "Answer"; text: string };
  }[];
}

/** FAQPage entity (ATS schema ticket §2.2/§2.7). Callers must only pass the
 * exact FAQ items visibly rendered on the same page (Google's requirement
 * that structured data match visible content) — every current call site
 * (components/seo/faq-json-ld.tsx) already does this. */
export function buildFAQPage(items: FAQ[]): FAQPageSchema {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question" as const,
      name: item.question,
      acceptedAnswer: { "@type": "Answer" as const, text: item.answer },
    })),
  };
}

export interface WebPageSchema {
  "@context": "https://schema.org";
  "@type": "WebPage";
  "@id": string;
  url: string;
  name: string;
  description: string;
  inLanguage: string;
  isPartOf: { "@id": string };
  about: { "@id": string };
}

/** WebPage entity for a localized page.
 *
 * Added with the Spanish layer, and rendered only on the /es pages. Its
 * whole job is to state two things a Spanish page can't otherwise assert in
 * structured data: `inLanguage` (this page is es-US, not the site's default
 * en-US), and `about` -> the one MedicalBusiness entity, so a consumer sees
 * the Spanish pages as the same practice rather than a second, same-named
 * business. `name`/`description` are the page's own localized title and
 * description — the same strings the <title>/<meta description> carry, per
 * the rule that structured data must match visible/declared content.
 *
 * Deliberately not added to the English pages: they'd inherit the same
 * WebSite/Organization graph anyway, and retrofitting a new entity type
 * across already-indexed English URLs is an unrelated change with its own
 * risk. Nothing here duplicates a type the English pages already emit. */
export function buildWebPage(input: {
  path: string;
  name: string;
  description: string;
  inLanguage: string;
}): WebPageSchema {
  const url = `${siteConfig.siteUrl}${input.path}`;
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: input.name,
    description: input.description,
    inLanguage: input.inLanguage,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": MEDICAL_BUSINESS_ID },
  };
}
