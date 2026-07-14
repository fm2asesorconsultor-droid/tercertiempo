"use server";

import { z } from "zod";
import { updateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth/dal";
import { prisma } from "@/lib/prisma";
import { deleteImageAction } from "@/lib/actions/delete-image";
import { CACHE_TAGS } from "@/lib/data/cache-tags";

const BENEFIT_ROWS = 8;

const schema = z.object({
  headline: z.string().min(1, "Campo obligatorio."),
  headlineAccent: z.string().min(1, "Campo obligatorio."),
  body: z.string().min(1, "Campo obligatorio."),
  imageUrl: z.string().min(1, "Sube una imagen."),
  imagePublicId: z.string().optional(),
});

export type PremiumExperienceFormState = { error?: string; success?: boolean };

export async function updatePremiumExperienceAction(
  _prevState: PremiumExperienceFormState,
  formData: FormData
): Promise<PremiumExperienceFormState> {
  await requireAdmin();

  const parsed = schema.safeParse({
    headline: formData.get("headline"),
    headlineAccent: formData.get("headlineAccent"),
    body: formData.get("body"),
    imageUrl: formData.get("imageUrl"),
    imagePublicId: formData.get("imagePublicId"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const data = parsed.data;
  const current = await prisma.premiumExperienceContent.findUnique({ where: { id: 1 } });

  const benefits: string[] = [];
  for (let i = 0; i < BENEFIT_ROWS; i++) {
    const text = String(formData.get(`benefit${i}`) ?? "").trim();
    if (text) benefits.push(text);
  }

  await prisma.$transaction([
    prisma.premiumExperienceContent.upsert({
      where: { id: 1 },
      update: { ...data, imagePublicId: data.imagePublicId || null },
      create: { id: 1, ...data, imagePublicId: data.imagePublicId || null },
    }),
    prisma.premiumBenefit.deleteMany({}),
    prisma.premiumBenefit.createMany({
      data: benefits.map((text, order) => ({ text, order })),
    }),
  ]);

  if (current?.imagePublicId && current.imagePublicId !== (data.imagePublicId || null)) {
    await deleteImageAction(current.imagePublicId);
  }

  updateTag(CACHE_TAGS.premiumExperience);

  return { success: true };
}
