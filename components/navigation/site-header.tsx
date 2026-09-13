"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { MARKETING_NAV } from "@/lib/constants";
import { useSession, homePathForRole } from "@/lib/hooks/use-session";
import { Button, buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";
import { NotificationMenu } from "@/components/navigation/notification-menu";
import { UserMenu } from "@/components/navigation/user-menu";

/**
 * Top-level site header for the public / browse pages. Session-aware: shows
 * auth CTAs when signed out and the account controls when signed in.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const { session, isAuthenticated } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <header className="glass sticky top-0 z-50 border-b border-border">
      <Container className="flex h-16 items-center justify-between gap-6">
        <div className="flex items-center gap-8">
          <Logo />
          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-0.5">
              {MARKETING_NAV.map((item) => {
                const itemPath = item.href.split("#")[0];
                const active =
                  pathname === itemPath || pathname.startsWith(`${itemPath}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative flex h-16 items-center px-3 text-sm font-medium transition-colors duration-[120ms]",
                        active
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {item.label}
                      {active && (
                        <span
                          aria-hidden
                          className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-primary"
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {isAuthenticated && session ? (
            <>
              <Link
                href={homePathForRole(session.role)}
                className={buttonVariants({ variant: "secondary", size: "sm" })}
              >
                {session.role === "tester" ? "Tester home" : "Developer home"}
              </Link>
              <NotificationMenu userId={session.user.id} />
              <UserMenu session={session} />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className={buttonVariants({ variant: "primary", size: "sm" })}
              >
                Get started
              </Link>
            </>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="-mr-2 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X /> : <Menu />}
        </Button>
      </Container>

      {open && (
        <div id="mobile-nav" className="border-t border-border bg-background md:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {MARKETING_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-border pt-4">
              {isAuthenticated && session ? (
                <>
                  <div className="flex items-center justify-end gap-2 pb-1">
                    <NotificationMenu userId={session.user.id} />
                    <UserMenu session={session} />
                  </div>
                  <Link
                    href={homePathForRole(session.role)}
                    onClick={() => setOpen(false)}
                    className={buttonVariants({ variant: "primary", size: "md" })}
                  >
                    Go to {session.role === "tester" ? "tester" : "developer"} home
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className={buttonVariants({ variant: "secondary", size: "md" })}
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setOpen(false)}
                    className={buttonVariants({ variant: "primary", size: "md" })}
                  >
                    Get started
                  </Link>
                </>
              )}
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
