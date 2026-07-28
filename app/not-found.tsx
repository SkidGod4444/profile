import type { Metadata } from "next";
import Link from "next/link";
import { Backdrop } from "@/components/backdrop";
import { ThemeToggle } from "@/components/theme-toggle";

/* Kept out of the index so missing URLs never compete with real pages. */
export const metadata: Metadata = {
  title: "Not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="profile" aria-labelledby="notfound-title">
      <Backdrop />
      <ThemeToggle />

      <div className="profile__shell">
        <header className="profile__header">
          <div className="profile__identity">
            <h1 id="notfound-title">Not found</h1>
            <p>That page does not exist.</p>
          </div>
        </header>

        <section className="profile-section">
          <p>
            Try the <Link href="/">home page</Link> or the{" "}
            <Link href="/writings">writing</Link>.
          </p>
        </section>
      </div>
    </main>
  );
}
