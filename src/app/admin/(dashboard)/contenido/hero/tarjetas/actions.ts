"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth/dal";
import { prisma } from "@/lib/prisma";
import { deleteImageAction } from "@/lib/actions/delete-image";
import { CACHE_TAGS } from "@/lib/data/cache-tags";

const experienceCardSchema = z.object({
  iconKey: z.string().min(1, "Selecciona un ícono."),
  title: z.string().min(1, "Campo obligatorio."),
  description: z.string().min(1, "Campo obligatorio."),
  imageUrl: z.string().min(1, "Sube una imagen."),
  imagePublicId: z.string().optional(),
  order: z.coerce.number().int().default(0),
});

export type ExperienceCardFormState = { error?: string };

function parseForm(formData: FormData) {
  return experienceCardSchema.safeParse({
    iconKey: formData.get("iconKey"),
    title: formData.get("title"),
    description: formData.get("description"),
    imageUrl: formData.get("imageUrl"),
    imagePublicId: formData.get("imagePublicId"),
    order: formData.get("order"),
  });
}

export async function createExperienceCardAction(
  _prevState: ExperienceCardFormState,
  formData: FormData
): Promise<ExperienceCardFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  await prisma.experienceCard.create({
    data: { ...parsed.data, imagePublicId: parsed.data.imagePublicId || null },
  });

  updateTag(CACHE_TAGS.hero);
  redirect("/admin/contenido/hero/tarjetas");
}

export async function updateExperienceCardAction(
  id: number,
  _prevState: ExperienceCardFormState,
  formData: FormData
): Promise<ExperienceCardFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const current = await prisma.experienceCard.findUnique({ where: { id } });

  await prisma.experienceCard.update({
    where: { id },
    data: { ...parsed.data, imagePublicId: parsed.data.imagePublicId || null },
  });

  if (current?.imagePublicId && current.imagePublicId !== (parsed.data.imagePublicId || null)) {
    await deleteImageAction(current.imagePublicId);
  }

  updateTag(CACHE_TAGS.hero);
  redirect("/admin/contenido/hero/tarjetas");
}

export async function deleteExperienceCardAction(id: number): Promise<void> {
  await requireAdmin();
  const current = await prisma.experienceCard.findUnique({ where: { id } });
  await prisma.experienceCard.delete({ where: { id } });

  if (current?.imagePublicId) {
    await deleteImageAction(current.imagePublicId);
  }

  updateTag(CACHE_TAGS.hero);
}
