import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editorial sign in",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main
      id="main-content"
      className="container flex min-h-[70vh] items-center justify-center py-16"
    >
      <section
        className="w-full max-w-md rounded-30 bg-white p-8 shadow-card"
        aria-labelledby="login-heading"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-teal-500">
          Authorized editors only
        </p>
        <h1 id="login-heading" className="mt-3 font-display text-4xl text-navy-800">
          Editorial sign in
        </h1>
        <p className="mt-4 leading-7 text-ink-500">
          Accounts are provisioned by an administrator. Public self-registration is disabled.
        </p>
        <form method="post" action="/api/admin/auth/sign-in" className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="block font-semibold text-navy-800">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              required
              className="mt-2 min-h-12 w-full rounded-15 border border-mute-400 px-4 text-base"
            />
          </div>
          <div>
            <label htmlFor="password" className="block font-semibold text-navy-800">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-2 min-h-12 w-full rounded-15 border border-mute-400 px-4 text-base"
            />
          </div>
          <button
            className="min-h-12 w-full rounded-full bg-navy-900 px-6 font-semibold text-white"
            type="submit"
          >
            Sign in
          </button>
        </form>
      </section>
    </main>
  );
}
