import { cn } from "@/lib/utils";
import type { Game, GameGenre } from "@/lib/types";

/**
 * Procedural cover art for a game.
 *
 * The prototype ships no image assets, so cover art is generated: a motif
 * chosen from the game's primary genre, coloured from `accentHue`, with the
 * layout jittered by a hash of the title. Everything is deterministic, so the
 * server and client render byte-identical SVG and each game keeps the same
 * artwork on every visit.
 *
 * If a real `coverImageUrl` is added later it wins — the generator is only a
 * stand-in, never a replacement.
 */

type Motif = "ridge" | "shards" | "grid" | "contour" | "orbit" | "fog";

/** Which motif a genre reads as. First matching genre on the game wins. */
const GENRE_MOTIF: Record<GameGenre, Motif> = {
  adventure: "ridge",
  rpg: "ridge",
  platformer: "ridge",
  action: "shards",
  shooter: "shards",
  puzzle: "grid",
  strategy: "grid",
  simulation: "contour",
  roguelike: "orbit",
  horror: "fog",
};

/** FNV-1a — small, stable, and identical across server and client. */
function hash(value: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Seeded PRNG so a title always produces the same layout. */
function rng(seed: number) {
  let state = seed || 1;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function motifFor(genres: GameGenre[] | undefined): Motif {
  for (const genre of genres ?? []) {
    const motif = GENRE_MOTIF[genre];
    if (motif) return motif;
  }
  return "contour";
}

/* -------------------------------------------------------------------------- */
/*  Motifs — each draws into a 400 × 225 viewBox                               */
/* -------------------------------------------------------------------------- */

interface MotifProps {
  hue: number;
  random: () => number;
}

/** Layered ridgelines under a low sun. Reads as "world to explore". */
function Ridge({ hue, random }: MotifProps) {
  const layers = [0, 1, 2, 3].map((i) => {
    const baseY = 96 + i * 30;
    const points: string[] = [];
    for (let x = -20; x <= 420; x += 55) {
      const peak = baseY - random() * (44 - i * 8);
      points.push(`${x},${Math.round(peak)}`);
    }
    return {
      d: `M-20,240 L${points.join(" L")} L420,240 Z`,
      fill: `hsl(${(hue + i * 7) % 360} ${44 - i * 5}% ${9 + i * 4}%)`,
    };
  });

  return (
    <>
      <circle
        cx={100 + Math.round(random() * 180)}
        cy={78}
        r={30}
        fill={`hsl(${(hue + 20) % 360} 70% 62%)`}
        opacity={0.22}
      />
      {layers.map((layer, i) => (
        <path key={i} d={layer.d} fill={layer.fill} />
      ))}
    </>
  );
}

/** Diagonal angular bands. Reads as speed / impact. */
function Shards({ hue, random }: MotifProps) {
  const bands = Array.from({ length: 7 }, (_, i) => {
    const x = -60 + i * 68 + random() * 24;
    const w = 12 + random() * 34;
    return { x, w, o: 0.06 + random() * 0.16 };
  });

  return (
    <>
      {bands.map((band, i) => (
        <path
          key={i}
          d={`M${band.x},-20 L${band.x + band.w},-20 L${band.x + band.w - 90},245 L${band.x - 90},245 Z`}
          fill={`hsl(${(hue + (i % 3) * 14) % 360} 72% 60%)`}
          opacity={band.o}
        />
      ))}
      <path
        d="M-20,168 L420,120 L420,245 L-20,245 Z"
        fill={`hsl(${hue} 48% 8%)`}
        opacity={0.85}
      />
    </>
  );
}

/** Isometric block field. Reads as systems / puzzles. */
function Grid({ hue, random }: MotifProps) {
  const cells: { x: number; y: number; lit: boolean }[] = [];
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 11; col++) {
      cells.push({
        x: col * 38 + (row % 2 ? 19 : 0),
        y: row * 38 + 8,
        lit: random() > 0.82,
      });
    }
  }

  return (
    <>
      {cells.map((cell, i) => (
        <rect
          key={i}
          x={cell.x}
          y={cell.y}
          width={26}
          height={26}
          rx={5}
          fill={
            cell.lit
              ? `hsl(${(hue + 24) % 360} 70% 58%)`
              : `hsl(${hue} 40% 24%)`
          }
          opacity={cell.lit ? 0.5 : 0.16}
        />
      ))}
    </>
  );
}

/** Nested topographic contours. Reads as terrain / simulation. */
function Contour({ hue, random }: MotifProps) {
  const cx = 90 + random() * 220;
  const cy = 60 + random() * 100;
  const rings = Array.from({ length: 9 }, (_, i) => ({
    rx: 26 + i * 27,
    ry: 18 + i * 19,
    rot: -18 + random() * 36,
  }));

  return (
    <>
      {rings.map((ring, i) => (
        <ellipse
          key={i}
          cx={cx}
          cy={cy}
          rx={ring.rx}
          ry={ring.ry}
          transform={`rotate(${ring.rot} ${cx} ${cy})`}
          fill="none"
          stroke={`hsl(${(hue + i * 4) % 360} 66% 62%)`}
          strokeWidth={1.25}
          opacity={0.3 - i * 0.024}
        />
      ))}
    </>
  );
}

/** Concentric arcs with scattered nodes. Reads as runs / procedural depth. */
function Orbit({ hue, random }: MotifProps) {
  const cx = 300;
  const cy = 52;
  const nodes = Array.from({ length: 16 }, () => ({
    x: random() * 400,
    y: random() * 225,
    r: 0.9 + random() * 2.1,
  }));

  return (
    <>
      {Array.from({ length: 7 }, (_, i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={26 + i * 32}
          fill="none"
          stroke={`hsl(${(hue + 12) % 360} 68% 62%)`}
          strokeWidth={1}
          opacity={0.26 - i * 0.028}
        />
      ))}
      {nodes.map((node, i) => (
        <circle
          key={`n${i}`}
          cx={node.x}
          cy={node.y}
          r={node.r}
          fill={`hsl(${(hue + 30) % 360} 75% 72%)`}
          opacity={0.4}
        />
      ))}
    </>
  );
}

/** Tall silhouettes swallowed by fog. Reads as dread. */
function Fog({ hue, random }: MotifProps) {
  const pillars = Array.from({ length: 9 }, (_, i) => ({
    x: i * 46 + random() * 18,
    w: 14 + random() * 26,
    top: 40 + random() * 90,
  }));

  return (
    <>
      {pillars.map((pillar, i) => (
        <rect
          key={i}
          x={pillar.x}
          y={pillar.top}
          width={pillar.w}
          height={240 - pillar.top}
          fill={`hsl(${hue} 30% 6%)`}
          opacity={0.7}
        />
      ))}
      <rect width="400" height="225" fill={`url(#fog-${Math.round(hue)})`} />
    </>
  );
}

const MOTIFS: Record<Motif, (props: MotifProps) => React.JSX.Element> = {
  ridge: Ridge,
  shards: Shards,
  grid: Grid,
  contour: Contour,
  orbit: Orbit,
  fog: Fog,
};

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export function GameCover({
  game,
  className,
  /** Adds a soft bottom scrim so overlaid text stays readable. */
  scrim = false,
}: {
  game: Pick<Game, "title" | "accentHue" | "coverImageUrl"> &
    Partial<Pick<Game, "genres">>;
  className?: string;
  scrim?: boolean;
}) {
  if (game.coverImageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={game.coverImageUrl}
        alt={`${game.title} cover art`}
        className={cn("h-full w-full object-cover", className)}
      />
    );
  }

  const hue = game.accentHue;
  const seed = hash(`${game.title}:${hue}`);
  const random = rng(seed);
  const motif = motifFor(game.genres);
  const Motif = MOTIFS[motif];

  // Suffix keeps <defs> ids unique per game; identical games render identical
  // ids, which is harmless because their gradients are identical too.
  const uid = `${motif}-${seed.toString(36)}`;

  return (
    <div
      role="img"
      aria-label={`${game.title} cover art`}
      className={cn("relative h-full w-full overflow-hidden", className)}
      style={{ backgroundColor: `hsl(${hue} 42% 9%)` }}
    >
      <svg
        viewBox="0 0 400 225"
        className="absolute inset-0 h-full w-full"
        aria-hidden
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id={`sky-${uid}`} x1="0" y1="0" x2="0.4" y2="1">
            <stop offset="0" stopColor={`hsl(${(hue + 26) % 360} 56% 22%)`} />
            <stop offset="1" stopColor={`hsl(${hue} 44% 8%)`} />
          </linearGradient>
          <radialGradient id={`vig-${uid}`} cx="0.5" cy="0.42" r="0.78">
            <stop offset="0.45" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.55" />
          </radialGradient>
          <radialGradient id={`fog-${Math.round(hue)}`} cx="0.5" cy="0.9" r="0.9">
            <stop offset="0" stopColor={`hsl(${hue} 30% 40%)`} stopOpacity="0.5" />
            <stop offset="1" stopColor={`hsl(${hue} 30% 8%)`} stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="400" height="225" fill={`url(#sky-${uid})`} />
        <Motif hue={hue} random={random} />
        <rect width="400" height="225" fill={`url(#vig-${uid})`} />
      </svg>

      {scrim && (
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-t from-dark/90 via-dark/45 to-transparent"
        />
      )}
    </div>
  );
}

/**
 * Cover art in a fixed-ratio frame. Use this instead of hand-rolling an
 * `aspect-*` wrapper so every game image in the product crops identically.
 */
export function GameArt({
  game,
  ratio = "16/9",
  className,
  scrim,
  children,
}: {
  game: Pick<Game, "title" | "accentHue" | "coverImageUrl"> &
    Partial<Pick<Game, "genres">>;
  ratio?: "16/9" | "16/10" | "3/2" | "21/9";
  className?: string;
  scrim?: boolean;
  /** Overlay content — badges, titles. Positioned above the art. */
  children?: React.ReactNode;
}) {
  const ratioClass = {
    "16/9": "aspect-[16/9]",
    "16/10": "aspect-[16/10]",
    "3/2": "aspect-[3/2]",
    "21/9": "aspect-[21/9]",
  }[ratio];

  return (
    <div className={cn("relative overflow-hidden bg-dark", ratioClass, className)}>
      <GameCover game={game} scrim={scrim} />
      {children}
    </div>
  );
}
