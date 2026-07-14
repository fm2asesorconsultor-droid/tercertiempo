import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { CACHE_TAGS } from "@/lib/data/cache-tags";

export const getMenuCategories = unstable_cache(
  async () => prisma.menuCategory.findMany({ orderBy: { order: "asc" } }),
  ["menu-categories"],
  { tags: [CACHE_TAGS.menu] }
);

export const getMenuItems = unstable_cache(
  async () => prisma.menuItem.findMany({ include: { category: true }, orderBy: { order: "asc" } }),
  ["menu-items"],
  { tags: [CACHE_TAGS.menu] }
);
