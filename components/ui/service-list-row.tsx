import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import type { ServiceCardItem } from "@/components/ui/service-card";
import { siteConfig } from "@/content/site";
import { cn } from "@/lib/cn";

export interface ServiceListRowProps {
  item: ServiceCardItem;
  className?: string;
}

/** Services-list row per Figma (file NHwBqbGepOspY0GrCnECnj, node 96:155,
 * "Online Appointment" section): image fixed to the left, title + hairline
 * Divider + meta/description on the right, "Book" pinned to the row's
 * bottom-right corner. The Divider sits under the title within each row
 * (not between rows — see ServicesSection). */
export function ServiceListRow({ item, className }: ServiceListRowProps) {
  return (
    <div
      className={cn("flex flex-col gap-6 py-10 md:flex-row md:items-stretch md:gap-10", className)}
    >
      <div className="relative aspect-[500/300] overflow-hidden w-full shrink-0 md:w-[40%]">
        <Image
          src={item.image.src}
          alt={item.image.alt}
          fill
          sizes="(min-width: 578px) 45vw, 100vw"
          className="object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col items-start gap-4">
        <h3 className="break-words font-display text-card-title text-navy-900">
          {item.href ? (
            <Link href={item.href} className="hover:underline">
              {item.name}
            </Link>
          ) : (
            item.name
          )}
        </h3>
        <Divider className="bg-navy-900" />
        <p className="font-sans text-card-body mt-4">
          <span className="text-ink-500">
            {item.duration} | Contact us {siteConfig.business.phone}
          </span>
          <br />
          <span className="text-ink-900">{item.summary}</span>
        </p>
        <div className="mt-auto flex w-full items-center justify-between gap-4 self-end">
          {item.href ? (
            <Link href={item.href} className="font-sans text-card-body text-ink-500 underline">
              {item.ctaLabel ?? "Learn more"}
            </Link>
          ) : (
            <span />
          )}
          <Button variant="book" href={siteConfig.bookingCta.href} className="text-lg">
            Book
          </Button>
        </div>
      </div>
    </div>
  );
}
