import Link from "next/link";

import { SITE } from "@/lib/constants";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";

const FOOTER_SECTIONS: { title: string; links: { label: string; href: string }[] }[] =
  [
    {
      title: "Testers",
      links: [
        { label: "Discover playtests", href: "/discover" },
        { label: "Your applications", href: "/applications" },
        { label: "Tester profile", href: "/profile" },
      ],
    },
    {
      title: "Developers",
      links: [
        { label: "For developers", href: "/developers" },
        { label: "Developer dashboard", href: "/developer/dashboard" },
        { label: "Create a playtest", href: "/developer/playtests/new" },
      ],
    },
    {
      title: "Platform",
      links: [
        { label: "How it works", href: "/how-it-works#top" },
        { label: "Log in", href: "/login" },
        { label: "Sign up", href: "/signup" },
      ],
    },
  ];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-dark">
      <Container className="grid gap-10 py-14 md:grid-cols-[1.6fr_repeat(3,1fr)]">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Structured playtesting that respects everyone&apos;s time — for indie
            teams and the testers who make their games better.
          </p>
        </div>

        {FOOTER_SECTIONS.map((section) => (
          <nav key={section.title} aria-label={section.title}>
            <h2 className="text-label text-subtle-foreground">{section.title}</h2>
            <ul className="mt-4 space-y-2.5">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </Container>

      <div className="border-t border-border">
        <Container className="flex flex-col items-center justify-between gap-2 py-6 text-xs text-subtle-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {SITE.fullName}. Student project — mock
            data only.
          </p>
          <p>Built with Next.js &amp; Tailwind CSS.</p>
        </Container>
      </div>
    </footer>
  );
}
