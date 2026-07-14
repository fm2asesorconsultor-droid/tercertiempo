import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { CACHE_TAGS } from "@/lib/data/cache-tags";

export const getFeaturedGalleryImages = unstable_cache(
  async () => prisma.galleryImage.findMany({ where: { featuredOnHome: true }, orderBy: { order: "asc" } }),
  ["gallery-featured"],
  { tags: [CACHE_TAGS.gallery] }
);

export const getFilterableGalleryImages = unstable_cache(
  async () =>
    prisma.galleryImage.findMany({
      where: { category: { not: null } },
      orderBy: { order: "asc" },
    }),
  ["gallery-filterable"],
  { tags: [CACHE_TAGS.gallery] }
);

