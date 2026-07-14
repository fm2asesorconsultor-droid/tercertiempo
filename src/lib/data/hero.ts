import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { CACHE_TAGS } from "@/lib/data/cache-tags";

export const getHeroContent = unstable_cache(
  async () => prisma.heroContent.findUniqueOrThrow({ where: { id: 1 } }),
  ["hero-content"],
  { tags: [CACHE_TAGS.hero] }
);

export const getExperienceCards = unstable_cache(
  async () => prisma.experienceCard.findMany({ orderBy: { order: "asc" } }),
  ["experience-cards"],
  { tags: [CACHE_TAGS.hero] }
);
