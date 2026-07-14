import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { CACHE_TAGS } from "@/lib/data/cache-tags";
import type { Prisma } from "@/generated/prisma/client";

export type MatchWithTeams = Prisma.MatchGetPayload<{
  include: { homeTeam: true; awayTeam: true };
}>;

export const getHomeMatches = unstable_cache(
  async () =>
    prisma.match.findMany({
      where: { showOnHome: true },
      include: { homeTeam: true, awayTeam: true },
      orderBy: { kickoffAt: "asc" },
    }),
  ["matches-home"],
  { tags: [CACHE_TAGS.matches, CACHE_TAGS.teams] }
);

export const getAllMatches = unstable_cache(
  async () =>
    prisma.match.findMany({
      include: { homeTeam: true, awayTeam: true },
      orderBy: { kickoffAt: "asc" },
    }),
  ["matches-all"],
  { tags: [CACHE_TAGS.matches, CACHE_TAGS.teams] }
);

export const getTeams = unstable_cache(
  async () => prisma.team.findMany({ orderBy: { name: "asc" } }),
  ["teams"],
  { tags: [CACHE_TAGS.teams] }
);

export const getMatchDemandDays = unstable_cache(
  async () => prisma.matchDemandDay.findMany({ orderBy: { date: "asc" } }),
  ["match-demand-days"],
  { tags: [CACHE_TAGS.matchDemand] }
);

export type MatchDayRecord = Record<string, { teams: string; demand: "high" | "mid" | "low" }>;

/** Keys by LOCAL calendar date (matching MatchCalendar's own toKey), not UTC — avoids timezone drift. */
export function toMatchDaysRecord(
  days: { date: Date; teamsLabel: string; demand: string }[]
): MatchDayRecord {
  const record: MatchDayRecord = {};
  for (const d of days) {
    const dt = new Date(d.date);
    const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
    record[key] = { teams: d.teamsLabel, demand: d.demand.toLowerCase() as "high" | "mid" | "low" };
  }
  return record;
}
