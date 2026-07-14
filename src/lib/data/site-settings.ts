import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { CACHE_TAGS } from "@/lib/data/cache-tags";

export const getSiteSettings = unstable_cache(
  async () => prisma.siteSettings.findUniqueOrThrow({ where: { id: 1 } }),
  ["site-settings"],
  { tags: [CACHE_TAGS.siteSettings] }
);

export type ScheduleEntry = { day: string; hours: string };
