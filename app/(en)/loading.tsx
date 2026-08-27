import { Spinner } from "@/components/ui/spinner";

/** App-wide route-transition fallback (Epic 12 §2). Routes here are statically
 * generated with no real async fetch, so this is a brief flash rather than a
 * designed empty state. */
export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status">
      <Spinner className="h-10 w-10 text-navy-900" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
