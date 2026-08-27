import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Página no encontrada | Align the Spine Chiropractic",
  description: "La página que busca no existe o fue movida.",
  path: "/es/404",
  robots: { index: false },
  locale: "es",
});

/** Spanish 404 — the Spanish-tree counterpart of app/(en)/not-found.tsx.
 * An unknown /es/... URL must land here (a real 404 in Spanish), never on
 * the English 404 and never on a 200 shell: a soft 404 under /es would
 * teach Google that arbitrary Spanish paths resolve. */
export default function EsNotFound() {
  return (
    <Section spacing="lg" className="container pt-40 md:pt-48">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
        <p
          aria-hidden="true"
          className="font-display text-[clamp(80px,14vw,160px)] leading-none text-navy-900/10"
        >
          404
        </p>

        <h1 className="font-display text-display text-navy-900">Página no encontrada</h1>

        <p className="font-sans text-body-lg text-ink-500">
          La página que busca no existe o fue movida. Le ayudamos a continuar desde aquí.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button href="/es/solicitar-cita" variant="teal">
            Solicitar Cita
          </Button>
          <Button href="/es" variant="primary">
            Volver al Inicio
          </Button>
        </div>
      </div>
    </Section>
  );
}
