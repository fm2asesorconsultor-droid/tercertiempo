import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { CACHE_TAGS } from "@/lib/data/cache-tags";

export const getSalasVip = unstable_cache(
  async () => prisma.salaVip.findMany({ orderBy: { id: "asc" } }),
  ["salas-vip"],
  { tags: [CACHE_TAGS.salasVip] }
);
