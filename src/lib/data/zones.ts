import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { CACHE_TAGS } from "@/lib/data/cache-tags";

export const getZones = unstable_cache(
  async () => prisma.zone.findMany({ orderBy: { order: "asc" } }),
  ["zones"],
  { tags: [CACHE_TAGS.zones] }
);
