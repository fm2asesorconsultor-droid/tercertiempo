import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { CACHE_TAGS } from "@/lib/data/cache-tags";

export const getProducts = unstable_cache(
  async () => prisma.product.findMany({ orderBy: { id: "asc" } }),
  ["products"],
  { tags: [CACHE_TAGS.products] }
);
