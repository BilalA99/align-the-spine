import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Practice Admin",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-panel-100 pt-[100px]">
      <div className="border-b border-mute-300 bg-white">
        <div className="container flex min-h-16 flex-wrap items-center justify-between gap-4 py-3">
          <Link href="/admin/content" className="font-display text-2xl text-navy-800">
            Align the Spine Admin
          </Link>
          <nav aria-label="Administration">
            <ul className="flex flex-wrap gap-2 text-sm font-semibold">
              <li>
                <Link
                  className="inline-flex min-h-11 items-center rounded-full px-4 text-navy-800 hover:bg-panel-100"
                  href="/admin/content"
                >
                  Content
                </Link>
              </li>
              <li>
                <Link
                  className="inline-flex min-h-11 items-center rounded-full px-4 text-navy-800 hover:bg-panel-100"
                  href="/"
                >
                  View site
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      {children}
    </div>
  );
}
