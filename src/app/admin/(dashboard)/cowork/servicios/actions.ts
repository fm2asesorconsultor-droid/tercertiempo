"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth/dal";
import { prisma } from "@/lib/prisma";
import { deleteImageAction } from "@/lib/actions/delete-image";
import { CACHE_TAGS } from "@/lib/data/cache-tags";

const schema = z.object({
  name: z.string().min(1, "Campo obligatorio."),
  tag: z.string().min(1, "Campo obligatorio."),
  tag2: z.string().min(1, "Campo obligatorio."),
  description: z.string().min(1, "Campo obligatorio."),
  imageUrl: z.string().min(1, "Sube una imagen."),
  imagePublicId: z.string().optional(),
  duration: z.string().min(1, "Campo obligatorio."),
  participants: z.string().min(1, "Campo obligatorio."),
  highlight: z.string().min(1, "Campo obligatorio."),
  order: z.coerce.number().int().default(0),
});

export type ConsultingServiceFormState = { error?: string };

function parseForm(formData: FormData) {
  return schema.safeParse({
    name: formData.get("name"),
    tag: formData.get("tag"),
    tag2: formData.get("tag2"),
    description: formData.get("description"),
    imageUrl: formData.get("imageUrl"),
    imagePublicId: formData.get("imagePublicId"),
    duration: formData.get("duration"),
    participants: formData.get("participants"),
    highlight: formData.get("highlight"),
    order: formData.get("order"),
  });
}

export async function createConsultingServiceAction(
  _prevState: ConsultingServiceFormState,
  formData: FormData
): Promise<ConsultingServiceFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };

  await prisma.consultingService.create({
    data: { ...parsed.data, imagePublicId: parsed.data.imagePublicId || null },
  });

  updateTag(CACHE_TAGS.cowork);
  redirect("/admin/cowork/servicios");
}

export async function updateConsultingServiceAction(
  id: number,
  _prevState: ConsultingServiceFormState,
  formData: FormData
): Promise<ConsultingServiceFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };

  const current = await prisma.consultingService.findUnique({ where: { id } });

  await prisma.consultingService.update({
    where: { id },
    data: { ...parsed.data, imagePublicId: parsed.data.imagePublicId || null },
  });

  if (current?.imagePublicId && current.imagePublicId !== (parsed.data.imagePublicId || null)) {
    await deleteImageAction(current.imagePublicId);
  }

  updateTag(CACHE_TAGS.cowork);
  redirect("/admin/cowork/servicios");
}

export async function deleteConsultingServiceAction(id: number): Promise<void> {
  await requireAdmin();
  const current = await prisma.consultingService.findUnique({ where: { id } });
  await prisma.consultingService.delete({ where: { id } });

  if (current?.imagePublicId) {
    await deleteImageAction(current.imagePublicId);
  }

  updateTag(CACHE_TAGS.cowork);
}
