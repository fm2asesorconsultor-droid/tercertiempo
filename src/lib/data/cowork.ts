import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { CACHE_TAGS } from "@/lib/data/cache-tags";

export const getCoworkStats = unstable_cache(
  async () => prisma.coworkStat.findMany({ orderBy: { order: "asc" } }),
  ["cowork-stats"],
  { tags: [CACHE_TAGS.cowork] }
);

export const getCoworkPackages = unstable_cache(
  async () =>
    prisma.coworkPackage.findMany({
      include: { features: { orderBy: { order: "asc" } } },
      orderBy: { order: "asc" },
    }),
  ["cowork-packages"],
  { tags: [CACHE_TAGS.cowork] }
);

export const getConsultingServices = unstable_cache(
  async () => prisma.consultingService.findMany({ orderBy: { order: "asc" } }),
  ["consulting-services"],
  { tags: [CACHE_TAGS.cowork] }
);

export const getQuoteExtras = unstable_cache(
  async () => prisma.quoteExtra.findMany({ orderBy: { order: "asc" } }),
  ["quote-extras"],
  { tags: [CACHE_TAGS.cowork] }
);

export const getEventTypes = unstable_cache(
  async () => prisma.eventType.findMany({ orderBy: { order: "asc" } }),
  ["event-types"],
  { tags: [CACHE_TAGS.cowork] }
);
