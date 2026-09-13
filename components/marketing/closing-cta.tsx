"use client";

import Link from "next/link";
import { ArrowRight, Gamepad2, Shield, Sparkles, UserCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function ClosingCta() {
  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-dark py-24 lg:py-32">
      {/* Background glow effects */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 size-[450px] rounded-full bg-primary/10 blur-[130px]" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 size-[450px] rounded-full bg-emerald-500/10 blur-[130px]" />
      </div>

      <Container className="relative z-10 mx-auto max-w-6xl">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-secondary">
            <Sparkles className="size-3.5" />
            Get Started Today
          </span>

          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
            Ready to shape the next generation of games?
          </h2>

          <p className="text-base sm:text-lg text-muted-foreground">
            Join hundreds of developers and thousands of playtesters on Grogu.
          </p>
        </div>

        {/* Dual Role Call-To-Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Card 1: Developers */}
          <div className="relative flex flex-col justify-between rounded-2xl border border-emerald-500/30 bg-surface/80 p-8 shadow-xl hover:border-emerald-500/60 transition-all duration-300">
            <div className="space-y-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Gamepad2 className="size-6" />
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground">
                For Game Studios & Developers
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Recruit verified playtesters matching your exact target demographic, distribute private builds securely, and analyze structured gameplay feedback.
              </p>
            </div>

            <div className="pt-8">
              <Link
                href="/signup"
                className={buttonVariants({
                  variant: "primary",
                  size: "lg",
                  className:
                    "w-full justify-between bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20",
                })}
              >
                <span>Launch a Playtest Campaign</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: Playtesters */}
          <div className="relative flex flex-col justify-between rounded-2xl border border-primary/40 bg-surface/80 p-8 shadow-xl hover:border-primary/70 transition-all duration-300">
            <div className="space-y-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/20 text-secondary border border-primary/30">
                <UserCheck className="size-6" />
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground">
                For Gamers & Playtesters
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Discover unreleased indie prototypes and AAA builds, complete guided playtest missions, submit feedback, and build your tester reputation rank.
              </p>
            </div>

            <div className="pt-8">
              <Link
                href="/signup"
                className={buttonVariants({
                  variant: "primary",
                  size: "lg",
                  className: "w-full justify-between shadow-lg shadow-primary/25",
                })}
              >
                <span>Become a Verified Playtester</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Trust Indicators */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-xs text-subtle-foreground pt-6 border-t border-border/50">
          <div className="flex items-center gap-2">
            <Shield className="size-4 text-secondary" />
            <span>Secure Build Distribution</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-secondary" />
            <span>Structured Quantitative & Qualitative Surveys</span>
          </div>
          <div className="flex items-center gap-2">
            <UserCheck className="size-4 text-secondary" />
            <span>Verified Player Profiles</span>
          </div>
        </div>
      </Container>
    </section>
  );
}
