import { Building2, Globe, MapPin } from "lucide-react";

import { cn } from "@/lib/utils";
import { STUDIO_SIZE_LABELS } from "@/lib/constants";
import type { DeveloperProfile, User } from "@/lib/types";
import { UserAvatar } from "@/components/ui/avatar";

export function DeveloperCard({
  user,
  profile,
  className,
}: {
  user: User;
  profile?: DeveloperProfile;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface p-5",
        className,
      )}
    >
      <div className="flex items-center gap-3.5">
        <UserAvatar
          name={profile?.studioName ?? user.name}
          src={user.avatarUrl}
          className="size-12"
        />
        <div className="min-w-0">
          <p className="truncate font-display text-base font-semibold">
            {profile?.studioName ?? user.name}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            Led by {user.name}
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        {user.bio}
      </p>

      <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
        {profile && (
          <div className="flex items-center gap-2">
            <Building2 className="size-3.5 text-subtle-foreground" aria-hidden />
            <dt className="sr-only">Studio size</dt>
            <dd>
              {STUDIO_SIZE_LABELS[profile.studioSize]} studio · founded{" "}
              {profile.foundedYear}
            </dd>
          </div>
        )}
        <div className="flex items-center gap-2">
          <MapPin className="size-3.5 text-subtle-foreground" aria-hidden />
          <dt className="sr-only">Location</dt>
          <dd>{user.location}</dd>
        </div>
        {profile?.website && (
          <div className="flex items-center gap-2">
            <Globe className="size-3.5 text-subtle-foreground" aria-hidden />
            <dt className="sr-only">Website</dt>
            <dd className="truncate">
              {profile.website.replace(/^https?:\/\//, "")}
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}
