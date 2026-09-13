"use client";

import React from "react";
import {
  Building2,
  Clock,
  Edit2,
  Gamepad2,
  Globe,
  Globe2,
  Layers,
  MapPin,
  Sparkles,
  UserCheck,
  UserRound,
} from "lucide-react";
import { motion } from "motion/react";
import {
  EXPERIENCE_LABELS,
  GENRE_LABELS,
  PLATFORM_LABELS,
  STUDIO_SIZE_LABELS,
} from "@/lib/constants";
import type {
  DeveloperProfile,
  ExperienceLevel,
  GameGenre,
  GamePlatform,
} from "@/lib/types";

interface SignupReviewCardProps {
  formData: {
    role: "tester" | "developer";
    name: string;
    email: string;
    location: string;
    experienceLevel?: string;
    preferredGenres?: string[];
    platforms?: string[];
    weeklyAvailabilityHours?: number;
    studioName?: string;
    studioSize?: string;
    website?: string;
  };
  onEditStep: (step: number) => void;
}

export function SignupReviewCard({ formData, onEditStep }: SignupReviewCardProps) {
  const isTester = formData.role === "tester";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 rounded-xl border border-primary/30 bg-surface/80 p-5 shadow-xl shadow-primary/5"
    >
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-md bg-primary/20 text-secondary">
            <UserCheck className="size-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Review Account Profile</h3>
            <p className="text-[11px] text-muted-foreground">
              Confirm your details before launching your Grogu profile.
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-0.5 text-[11px] font-medium text-secondary border border-primary/20">
          <Sparkles className="size-3" />
          {isTester ? "Playtester" : "Developer"}
        </span>
      </div>

      {/* Account Info Section */}
      <div className="space-y-2 rounded-lg border border-border/60 bg-muted/20 p-3 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-medium text-subtle-foreground uppercase tracking-wider text-[10px]">
            Account Credentials
          </span>
          <button
            type="button"
            onClick={() => onEditStep(1)}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-secondary hover:underline"
          >
            <Edit2 className="size-3" /> Edit
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-foreground font-medium pt-1">
          <div className="flex items-center gap-2">
            {isTester ? (
              <UserRound className="size-3.5 text-secondary shrink-0" />
            ) : (
              <Gamepad2 className="size-3.5 text-emerald-400 shrink-0" />
            )}
            <span className="truncate">{formData.name}</span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="size-3.5 text-secondary shrink-0" />
            <span className="truncate">{formData.location}</span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground col-span-1 sm:col-span-2">
            <Globe className="size-3.5 text-secondary shrink-0" />
            <span className="truncate">{formData.email}</span>
          </div>
        </div>
      </div>

      {/* Profile Details Section */}
      <div className="space-y-2 rounded-lg border border-border/60 bg-muted/20 p-3 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-medium text-subtle-foreground uppercase tracking-wider text-[10px]">
            {isTester ? "Testing Preferences" : "Studio Profile"}
          </span>
          <button
            type="button"
            onClick={() => onEditStep(2)}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-secondary hover:underline"
          >
            <Edit2 className="size-3" /> Edit
          </button>
        </div>

        {isTester ? (
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between text-subtle-foreground">
              <span>Experience Level:</span>
              <span className="font-medium text-foreground capitalize">
                {
                  EXPERIENCE_LABELS[
                    (formData.experienceLevel ?? "regular") as ExperienceLevel
                  ]
                }
              </span>
            </div>

            <div className="flex items-center justify-between text-subtle-foreground">
              <span>Weekly Commitment:</span>
              <span className="font-medium text-foreground flex items-center gap-1">
                <Clock className="size-3 text-secondary" />
                {formData.weeklyAvailabilityHours ?? 5} hrs / week
              </span>
            </div>

            {formData.preferredGenres && formData.preferredGenres.length > 0 && (
              <div>
                <span className="text-subtle-foreground block mb-1.5">
                  Favourite Genres:
                </span>
                <div className="flex flex-wrap gap-1">
                  {formData.preferredGenres.map((g) => (
                    <span
                      key={g}
                      className="rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] text-secondary font-medium"
                    >
                      {GENRE_LABELS[g as GameGenre] || g}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {formData.platforms && formData.platforms.length > 0 && (
              <div>
                <span className="text-subtle-foreground block mb-1.5">
                  Testing Platforms:
                </span>
                <div className="flex flex-wrap gap-1">
                  {formData.platforms.map((p) => (
                    <span
                      key={p}
                      className="rounded-md border border-border bg-surface px-2 py-0.5 text-[11px] text-foreground font-medium"
                    >
                      {PLATFORM_LABELS[p as GamePlatform] || p}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2 pt-1 text-foreground">
            <div className="flex items-center justify-between">
              <span className="text-subtle-foreground flex items-center gap-1.5">
                <Building2 className="size-3.5 text-emerald-400" /> Studio Name:
              </span>
              <span className="font-medium">{formData.studioName || "N/A"}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-subtle-foreground flex items-center gap-1.5">
                <Layers className="size-3.5 text-emerald-400" /> Studio Size:
              </span>
              <span className="font-medium">
                {
                  STUDIO_SIZE_LABELS[
                    (formData.studioSize ?? "solo") as DeveloperProfile["studioSize"]
                  ]
                }
              </span>
            </div>

            {formData.website && (
              <div className="flex items-center justify-between">
                <span className="text-subtle-foreground flex items-center gap-1.5">
                  <Globe2 className="size-3.5 text-emerald-400" /> Website:
                </span>
                <span className="font-medium text-secondary truncate max-w-[180px]">
                  {formData.website}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
