"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, Menu } from "lucide-react";

import { DEVELOPER_NAV, TESTER_NAV, type AppNavItem } from "@/lib/constants";
import type { UserRole } from "@/lib/types";
import { useRequireRole } from "@/lib/hooks/use-session";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";
import { PageSkeleton } from "@/components/ui/states";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AppNavBar, AppNavList } from "@/components/navigation/app-nav";
import { NotificationMenu } from "@/components/navigation/notification-menu";
import { UserMenu } from "@/components/navigation/user-menu";

/**
 * Shared shell for the authenticated tester + developer areas.
 *
 * Navigation is a single top bar rather than a sidebar — the product is a
 * gaming platform, not an admin console, and a top bar keeps the full width for
 * game art. The only per-role difference is `roleLabel` + `nav`.
 *
 * Guards the route (redirect when signed out / wrong role) and gates rendering
 * on store hydration so persisted data never causes an SSR mismatch.
 */
export function AppShell({
  role,
  roleLabel,
  children,
}: {
  role: UserRole;
  roleLabel: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { allowed, loading, session } = useRequireRole(role);
  const [mobileOpen, setMobileOpen] = useState(false);
  const nav: AppNavItem[] = role === "tester" ? TESTER_NAV : DEVELOPER_NAV;

  if (loading || !allowed || !session) {
    return (
      <div className="min-h-dvh">
        <div className="border-b border-border">
          <Container className="flex h-16 items-center">
            <Logo />
          </Container>
        </div>
        <Container className="py-10">
          <PageSkeleton />
        </Container>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="glass sticky top-0 z-50 border-b border-border">
        <Container className="flex h-16 items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-6">
            {/* Mobile drawer trigger */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                className="-ml-2 grid size-9 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none lg:hidden"
                aria-label="Open navigation"
              >
                <Menu className="size-5" />
              </SheetTrigger>
              <SheetContent side="left">
                <SheetTitle className="sr-only">
                  {roleLabel} navigation
                </SheetTitle>
                <Logo />
                <p className="text-label text-subtle-foreground">{roleLabel}</p>
                <nav aria-label={`${roleLabel} navigation`}>
                  <AppNavList
                    nav={nav}
                    pathname={pathname}
                    onNavigate={() => setMobileOpen(false)}
                  />
                </nav>
                <SheetClose asChild>
                  <Link
                    href="/"
                    className="mt-auto flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    <ExternalLink className="size-4" aria-hidden />
                    Back to grogu.com
                  </Link>
                </SheetClose>
              </SheetContent>
            </Sheet>

            <div className="flex items-center gap-3">
              <Logo href={nav[0].href} />
              <span className="hidden text-label text-subtle-foreground sm:inline">
                {roleLabel}
              </span>
            </div>

            <nav
              aria-label={`${roleLabel} navigation`}
              className="hidden lg:block"
            >
              <AppNavBar nav={nav} pathname={pathname} />
            </nav>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <NotificationMenu userId={session.user.id} />
            <UserMenu session={session} />
          </div>
        </Container>
      </header>

      <main className="flex-1 pb-20 pt-8">
        <Container>{children}</Container>
      </main>
    </div>
  );
}
