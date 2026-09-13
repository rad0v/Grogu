"use client";

import React from "react";
import { Check, Gamepad2, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface RoleCardProps {
  role: "tester" | "developer";
  active: boolean;
  onSelect: () => void;
}

const ROLE_DATA = {
  tester: {
    icon: UserRound,
    badge: "Playtester",
    title: "Test Games & Provide Feedback",
    description: "Discover unreleased games, test build mechanics, and earn a reputation as a trusted playtester.",
    features: [
      "Access early-stage builds & indie titles",
      "Submit structured bugs & surveys",
      "Build your gaming profile & badges",
    ],
    accentColor: "from-purple-600/20 to-indigo-600/10 border-primary/50 text-secondary",
  },
  developer: {
    icon: Gamepad2,
    badge: "Developer",
    title: "Run Playtests & Recruit Players",
    description: "Launch playtest runs, recruit targeted gamers, and gain actionable feedback to refine your game.",
    features: [
      "Target playtesters by genre & hardware",
      "Manage playtest applications & access",
      "Analyze survey & quantitative reports",
    ],
    accentColor: "from-emerald-600/20 to-teal-600/10 border-emerald-500/50 text-emerald-300",
  },
};

export function InteractiveRoleCard({ role, active, onSelect }: RoleCardProps) {
  const data = ROLE_DATA[role];
  const Icon = data.icon;

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.2 }}
      aria-pressed={active}
      className={cn(
        "relative flex flex-col justify-between rounded-xl border p-5 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? "border-primary bg-gradient-to-b from-primary/15 via-surface/90 to-surface shadow-lg shadow-primary/10 ring-1 ring-primary/40"
          : "border-border/80 bg-surface/40 hover:border-border-strong hover:bg-surface/70"
      )}
    >
      {/* Radio checkmark circle indicator */}
      <div className="absolute top-4 right-4 flex items-center justify-center">
        <div
          className={cn(
            "flex size-5 items-center justify-center rounded-full border transition-all duration-200",
            active
              ? "border-primary bg-primary text-primary-foreground scale-110 shadow-sm"
              : "border-border bg-muted/40 text-transparent"
          )}
        >
          <Check className="size-3.5 stroke-[3]" />
        </div>
      </div>

      <div className="space-y-4">
        {/* Header with Icon and Badge */}
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex size-11 items-center justify-center rounded-lg border transition-colors",
              active
                ? "border-primary/40 bg-primary/20 text-secondary"
                : "border-border bg-muted/50 text-muted-foreground"
            )}
          >
            <Icon className="size-5" />
          </div>
          <div>
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase",
                active
                  ? "bg-primary/20 text-secondary border border-primary/30"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <Sparkles className="size-3" />
              {data.badge}
            </span>
          </div>
        </div>

        {/* Title & Description */}
        <div>
          <h3 className="text-base font-semibold tracking-tight text-foreground">
            {data.title}
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {data.description}
          </p>
        </div>

        {/* Key Features Bullet List */}
        <ul className="space-y-2 pt-2 border-t border-border/50 text-xs">
          {data.features.map((feature, idx) => (
            <li key={idx} className="flex items-center gap-2 text-subtle-foreground">
              <ShieldCheck
                className={cn(
                  "size-3.5 shrink-0",
                  active ? "text-secondary" : "text-muted-foreground/70"
                )}
              />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.button>
  );
}
