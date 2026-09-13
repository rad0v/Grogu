"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, RefreshCw, UserRound } from "lucide-react";

import type { Session } from "@/lib/types";
import { logout } from "@/lib/mock-auth";
import { useGroguStore } from "@/lib/store/grogu-store";
import { UserAvatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserMenu({ session }: { session: Session }) {
  const router = useRouter();
  const resetDemo = useGroguStore((s) => s.resetDemo);
  const [busy, setBusy] = useState(false);

  const profileHref = session.role === "tester" ? "/profile" : "/developer/profile";

  async function handleLogout() {
    setBusy(true);
    await logout();
    router.push("/");
  }

  function handleReset() {
    resetDemo();
    router.push("/");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex items-center gap-2 rounded-full p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Account menu"
      >
        <UserAvatar name={session.user.name} src={session.user.avatarUrl} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          <span className="block text-sm font-medium text-foreground">
            {session.user.name}
          </span>
          <span className="block truncate text-xs text-muted-foreground">
            {session.user.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={profileHref}>
            <UserRound aria-hidden />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={handleReset}>
          <RefreshCw aria-hidden />
          Reset demo data
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleLogout} disabled={busy}>
          <LogOut aria-hidden />
          {busy ? "Signing out…" : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
