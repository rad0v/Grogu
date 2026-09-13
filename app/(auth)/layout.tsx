import type { ReactNode } from "react";
import { Quote } from "lucide-react";

import { getFeaturedGames } from "@/data";
import { Logo } from "@/components/ui/logo";
import { GameCover } from "@/components/games/game-cover";

/**
 * Split auth shell: the form on the left, a game-art panel on the right.
 *
 * The panel is decorative and hidden below `lg` — on mobile the form gets the
 * whole screen rather than being pushed below a hero image.
 */
export default async function AuthLayout({ children }: { children: ReactNode }) {
  const [featured] = await getFeaturedGames(1);

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="flex flex-col justify-center px-5 py-12 sm:px-10">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-10">
            <Logo />
          </div>
          {children}
        </div>
      </div>

      <aside
        aria-hidden
        className="relative hidden overflow-hidden border-l border-border lg:block"
      >
        {featured && <GameCover game={featured} />}
        <div className="absolute inset-0 bg-linear-to-t from-dark via-dark/70 to-dark/30" />

        <div className="absolute inset-x-0 bottom-0 p-12">
          <Quote className="size-7 text-secondary/60" />
          <p className="mt-5 max-w-md font-display text-2xl font-semibold leading-snug text-white">
            The best bug report we ever got came from a tester who played our
            build for four hours and wrote three paragraphs.
          </p>
          <p className="mt-5 text-sm text-white/60">
            Grogu is built for those testers — and the studios who need them.
          </p>
        </div>
      </aside>
    </div>
  );
}
