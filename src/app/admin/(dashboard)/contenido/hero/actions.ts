"use server";

import { z } from "zod";
import { updateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth/dal";
import { prisma } from "@/lib/prisma";
import { deleteImageAction } from "@/lib/actions/delete-image";
import { CACHE_TAGS } from "@/lib/data/cache-tags";

const heroContentSchema = z.object({
  eyebrow: z.string().min(1, "Campo obligatorio."),
  headline: z.string().min(1, "Campo obligatorio."),
  body: z.string().min(1, "Campo obligatorio."),
  ctaPrimaryLabel: z.string().min(1, "Campo obligatorio."),
  ctaSecondaryLabel: z.string().min(1, "Campo obligatorio."),
  backgroundImageUrl: z.string().min(1, "Sube una imagen de fondo."),
  backgroundImagePublicId: z.string().optional(),
});

export type HeroContentFormState = { error?: string; success?: boolean };

export async function updateHeroContentAction(
  _prevState: HeroContentFormState,
  formData: FormData
): Promise<HeroContentFormState> {
  await requireAdmin();

  const parsed = heroContentSchema.safeParse({
    eyebrow: formData.get("eyebrow"),
    headline: formData.get("headline"),
    body: formData.get("body"),
    ctaPrimaryLabel: formData.get("ctaPrimaryLabel"),
    ctaSecondaryLabel: formData.get("ctaSecondaryLabel"),
    backgroundImageUrl: formData.get("backgroundImageUrl"),
    backgroundImagePublicId: formData.get("backgroundImagePublicId"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const data = parsed.data;
  const current = await prisma.heroContent.findUnique({ where: { id: 1 } });

  await prisma.heroContent.upsert({
    where: { id: 1 },
    update: { ...data, backgroundImagePublicId: data.backgroundImagePublicId || null },
    create: { id: 1, ...data, backgroundImagePublicId: data.backgroundImagePublicId || null },
  });

  if (
    current?.backgroundImagePublicId &&
    current.backgroundImagePublicId !== (data.backgroundImagePublicId || null)
  ) {
    await deleteImageAction(current.backgroundImagePublicId);
  }

  updateTag(CACHE_TAGS.hero);

  return { success: true };
}
