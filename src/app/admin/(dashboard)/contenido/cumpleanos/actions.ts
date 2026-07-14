"use server";

import { z } from "zod";
import { updateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth/dal";
import { prisma } from "@/lib/prisma";
import { deleteImageAction } from "@/lib/actions/delete-image";
import { CACHE_TAGS } from "@/lib/data/cache-tags";

const PERK_ROWS = 6;

const schema = z.object({
  eyebrow: z.string().min(1, "Campo obligatorio."),
  headline: z.string().min(1, "Campo obligatorio."),
  headlineAccent: z.string().min(1, "Campo obligatorio."),
  body: z.string().min(1, "Campo obligatorio."),
  ctaLabel: z.string().min(1, "Campo obligatorio."),
  backgroundImageUrl: z.string().min(1, "Sube una imagen de fondo."),
  backgroundImagePublicId: z.string().optional(),
});

export type BirthdayFormState = { error?: string; success?: boolean };

export async function updateBirthdayAction(
  _prevState: BirthdayFormState,
  formData: FormData
): Promise<BirthdayFormState> {
  await requireAdmin();

  const parsed = schema.safeParse({
    eyebrow: formData.get("eyebrow"),
    headline: formData.get("headline"),
    headlineAccent: formData.get("headlineAccent"),
    body: formData.get("body"),
    ctaLabel: formData.get("ctaLabel"),
    backgroundImageUrl: formData.get("backgroundImageUrl"),
    backgroundImagePublicId: formData.get("backgroundImagePublicId"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const data = parsed.data;
  const current = await prisma.birthdayContent.findUnique({ where: { id: 1 } });

  const perks: { iconKey: string; text: string }[] = [];
  for (let i = 0; i < PERK_ROWS; i++) {
    const iconKey = String(formData.get(`perkIcon${i}`) ?? "");
    const text = String(formData.get(`perkText${i}`) ?? "").trim();
    if (text) perks.push({ iconKey, text });
  }

  await prisma.$transaction([
    prisma.birthdayContent.upsert({
      where: { id: 1 },
      update: { ...data, backgroundImagePublicId: data.backgroundImagePublicId || null },
      create: { id: 1, ...data, backgroundImagePublicId: data.backgroundImagePublicId || null },
    }),
    prisma.birthdayPerk.deleteMany({}),
    prisma.birthdayPerk.createMany({
      data: perks.map((perk, order) => ({ ...perk, order })),
    }),
  ]);

  if (
    current?.backgroundImagePublicId &&
    current.backgroundImagePublicId !== (data.backgroundImagePublicId || null)
  ) {
    await deleteImageAction(current.backgroundImagePublicId);
  }

  updateTag(CACHE_TAGS.birthday);

  return { success: true };
}
