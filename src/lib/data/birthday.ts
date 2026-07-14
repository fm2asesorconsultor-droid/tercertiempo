import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { CACHE_TAGS } from "@/lib/data/cache-tags";

export const getBirthdayContent = unstable_cache(
  async () => prisma.birthdayContent.findUniqueOrThrow({ where: { id: 1 } }),
  ["birthday-content"],
  { tags: [CACHE_TAGS.birthday] }
);

export const getBirthdayPerks = unstable_cache(
  async () => prisma.birthdayPerk.findMany({ orderBy: { order: "asc" } }),
  ["birthday-perks"],
  { tags: [CACHE_TAGS.birthday] }
);
