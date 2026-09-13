"use client";

import Link from "next/link";
import { ArrowRight, ChevronDown, Gamepad2, Sparkles, Users } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { formatCompactNumber } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { HeroScene } from "@/components/marketing/hero-scene";

interface HeroStats {
  games: number;
  activePlaytests: number;
  testers: number;
  feedbackSubmitted: number;
}

export function Hero({ stats }: { stats: HeroStats }) {
  const { scrollY } = useScroll();
  const sceneY = useTransform(scrollY, [0, 900], [0, 110]);
  const glowY = useTransform(scrollY, [0, 900], [0, -80]);

  const scrollToExplore = () => {
    const el = document.getElementById("explore-sections");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative isolate overflow-hidden border-b border-border/60 bg-dark py-16 sm:py-20 lg:min-h-[calc(100dvh-4rem)] lg:py-24">
      <motion.div aria-hidden style={{ y: glowY }} className="pointer-events-none absolute -right-24 top-12 size-[34rem] rounded-full bg-primary/15 blur-[120px]" />
      <motion.div aria-hidden style={{ y: glowY }} className="surface-grid pointer-events-none absolute inset-0 opacity-35" />
      <Container className="relative z-10 grid min-h-[680px] items-center gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(34rem,1.1fr)] lg:gap-4">
        <div className="flex max-w-2xl flex-col items-start gap-7">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-medium text-secondary backdrop-blur-md"
          >
            <Sparkles className="size-3.5 text-secondary animate-pulse" />
            <span>THE PLAYTEST NETWORK</span>
            <span className="h-3 w-px bg-primary/40 mx-1" />
            <span className="text-subtle-foreground font-normal">
              {stats.activePlaytests} playtests active
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-xl font-display text-5xl font-semibold leading-[0.98] tracking-[-0.045em] text-foreground sm:text-6xl lg:text-[5.25rem]"
          >
            Make every build count.
            <span className="mt-2 block text-secondary">Play. Notice. Shape.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Grogu connects ambitious studios with thoughtful players to turn early builds
            into games people remember.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex w-full flex-col gap-3 pt-1 sm:w-auto sm:flex-row"
          >
            <Link
              href="/discover"
              className={buttonVariants({
                variant: "primary",
                size: "xl",
                className:
                    "w-full gap-2.5 px-7 text-base shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40 sm:w-auto",
              })}
            >
              <Gamepad2 className="size-5" />
              <span>Discover Games</span>
              <ArrowRight className="size-4" />
            </Link>

            <button
              type="button"
              onClick={scrollToExplore}
              className={buttonVariants({
                variant: "outline",
                size: "xl",
                className:
                    "w-full cursor-pointer gap-2 border-border-strong/80 px-7 text-base transition-all hover:bg-surface/80 sm:w-auto",
              })}
            >
              <span>Explore Platform</span>
              <ChevronDown className="size-4 text-muted-foreground" />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-3 text-xs text-subtle-foreground sm:gap-x-8"
          >
            <div className="flex items-center gap-2">
              <Users className="size-4 text-secondary" />
              <span>
                <strong className="text-foreground font-semibold">
                  {formatCompactNumber(stats.testers)}
                </strong>{" "}
                Playtesters
              </span>
            </div>
            <div className="h-3 w-px bg-border/60 hidden sm:block" />
            <div className="flex items-center gap-2">
              <Gamepad2 className="size-4 text-secondary" />
              <span>
                <strong className="text-foreground font-semibold">
                  {stats.games}+
                </strong>{" "}
                Games Tested
              </span>
            </div>
            <div className="h-3 w-px bg-border/60 hidden sm:block" />
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-secondary" />
              <span>
                <strong className="text-foreground font-semibold">
                  {formatCompactNumber(stats.feedbackSubmitted)}
                </strong>{" "}
                Feedback Reports
              </span>
            </div>
          </motion.div>
        </div>

        <motion.div
          style={{ y: sceneY }}
          initial={{ opacity: 0, scale: 0.96, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative min-h-[390px] overflow-hidden rounded-2xl border border-border/80 bg-[#131020]/70 shadow-2xl shadow-black/30 sm:min-h-[500px] lg:min-h-[600px]"
        >
          <HeroScene />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,transparent_25%,rgba(8,5,16,0.14)_72%,rgba(8,5,16,0.72)_100%)]" />
          <div className="absolute left-5 top-5 flex items-center gap-2 rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-xs text-secondary backdrop-blur-md sm:left-7 sm:top-7">
            <span className="size-1.5 rounded-full bg-success" />
            LIVE BUILD / 0.8.4
          </div>
          <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 sm:bottom-7 sm:left-7 sm:right-7">
            <div>
              <p className="text-label text-secondary-muted">NOW PLAYTESTING</p>
              <p className="mt-2 font-display text-xl font-medium text-foreground sm:text-2xl">Aetheria: Eclipse</p>
            </div>
            <div className="hidden rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-right backdrop-blur-md sm:block">
              <p className="text-label text-secondary-muted">SIGNALS CAPTURED</p>
              <p className="mt-1 font-display text-lg text-foreground">1,248</p>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
