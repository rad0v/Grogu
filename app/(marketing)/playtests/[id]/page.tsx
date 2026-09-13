import type { Metadata } from "next";

import { getPlaytestById, getPlaytests } from "@/data";
import { PlaytestDetail } from "@/components/playtests/playtest-detail";

export async function generateStaticParams() {
  const playtests = await getPlaytests();
  return playtests.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const playtest = await getPlaytestById(id);
  if (!playtest) return { title: "Playtest" };
  return {
    title: playtest.title,
    description: playtest.summary,
  };
}

export default async function PlaytestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const playtest = await getPlaytestById(id);
  return <PlaytestDetail playtestId={id} initialPlaytest={playtest ?? null} />;
}
