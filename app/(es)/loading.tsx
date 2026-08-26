import { Spinner } from "@/components/ui/spinner";

/** Spanish route-transition fallback — mirrors app/(en)/loading.tsx, with
 * the screen-reader-only status text in Spanish so it matches the
 * document's `lang="es-US"`. */
export default function EsLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status">
      <Spinner className="h-10 w-10 text-navy-900" />
      <span className="sr-only">Cargando…</span>
    </div>
  );
}
