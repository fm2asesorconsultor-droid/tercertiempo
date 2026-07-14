import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { CACHE_TAGS } from "@/lib/data/cache-tags";

export const getPublishedTestimonials = unstable_cache(
  async () => prisma.testimonial.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
  ["testimonials-published"],
  { tags: [CACHE_TAGS.testimonials] }
);
