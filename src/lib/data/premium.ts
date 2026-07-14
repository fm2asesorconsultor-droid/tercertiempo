import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { CACHE_TAGS } from "@/lib/data/cache-tags";

export const getPremiumExperienceContent = unstable_cache(
  async () => prisma.premiumExperienceContent.findUniqueOrThrow({ where: { id: 1 } }),
  ["premium-experience-content"],
  { tags: [CACHE_TAGS.premiumExperience] }
);

export const getPremiumBenefits = unstable_cache(
  async () => prisma.premiumBenefit.findMany({ orderBy: { order: "asc" } }),
  ["premium-benefits"],
  { tags: [CACHE_TAGS.premiumExperience] }
);
