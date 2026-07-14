import { prisma } from "@/lib/prisma";
import { PremiumExperienceForm } from "./PremiumExperienceForm";

export default async function AdminPremiumExperiencePage() {
  const [content, benefits] = await Promise.all([
    prisma.premiumExperienceContent.findUnique({ where: { id: 1 } }),
    prisma.premiumBenefit.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div>
      <h1 className="mb-6 font-title text-2xl font-black">Experiencia Premium</h1>
      <PremiumExperienceForm content={content} benefits={benefits} />
    </div>
  );
}
