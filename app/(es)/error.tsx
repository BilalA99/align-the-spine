"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { InfoIcon } from "@/components/ui/icons/info";
import { Section } from "@/components/ui/section";
import { siteConfig } from "@/content/site";

/** Spanish error boundary — mirrors app/(en)/error.tsx. A Spanish page that
 * throws must not fall back to an English error screen. */
export default function EsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Section spacing="lg" className="container pt-40 md:pt-48">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-navy-900">
          <InfoIcon className="h-8 w-8 text-white" />
        </span>

        <h1 className="font-display text-display text-navy-900">Algo salió mal</h1>

        <p className="font-sans text-body-lg text-ink-500">
          Ocurrió un error inesperado al cargar esta página. Puede intentar de nuevo, volver al
          inicio o llamarnos y le atendemos de inmediato.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button variant="primary" onClick={reset}>
            Intentar de nuevo
          </Button>
          <Button href="/es" variant="ghost">
            Volver al Inicio
          </Button>
          <Button href={siteConfig.business.phoneHref} variant="teal">
            Llamar al {siteConfig.business.phone}
          </Button>
        </div>
      </div>
    </Section>
  );
}
