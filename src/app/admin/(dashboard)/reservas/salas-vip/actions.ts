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
  capacity: z.coerce.number().int().min(1),
  status: z.enum(["AVAILABLE", "LIMITED", "FULL"]),
  priceLabel: z.string().min(1, "Campo obligatorio."),
  imageUrl: z.string().min(1, "Sube una imagen."),
  imagePublicId: z.string().optional(),
  features: z
    .string()
    .transform((v) => v.split("\n").map((f) => f.trim()).filter(Boolean)),
});

export type SalaVipFormState = { error?: string };

function parseForm(formData: FormData) {
  return schema.safeParse({
    name: formData.get("name"),
    capacity: formData.get("capacity"),
    status: formData.get("status"),
    priceLabel: formData.get("priceLabel"),
    imageUrl: formData.get("imageUrl"),
    imagePublicId: formData.get("imagePublicId"),
    features: formData.get("features"),
  });
}

export async function createSalaVipAction(
  _prevState: SalaVipFormState,
  formData: FormData
): Promise<SalaVipFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  await prisma.salaVip.create({
    data: { ...parsed.data, imagePublicId: parsed.data.imagePublicId || null },
  });

  updateTag(CACHE_TAGS.salasVip);
  redirect("/admin/reservas/salas-vip");
}

export async function updateSalaVipAction(
  id: number,
  _prevState: SalaVipFormState,
  formData: FormData
): Promise<SalaVipFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const current = await prisma.salaVip.findUnique({ where: { id } });

  await prisma.salaVip.update({
    where: { id },
    data: { ...parsed.data, imagePublicId: parsed.data.imagePublicId || null },
  });

  if (current?.imagePublicId && current.imagePublicId !== (parsed.data.imagePublicId || null)) {
    await deleteImageAction(current.imagePublicId);
  }

  updateTag(CACHE_TAGS.salasVip);
  redirect("/admin/reservas/salas-vip");
}

export async function deleteSalaVipAction(id: number): Promise<void> {
  await requireAdmin();
  const current = await prisma.salaVip.findUnique({ where: { id } });
  await prisma.salaVip.delete({ where: { id } });

  if (current?.imagePublicId) {
    await deleteImageAction(current.imagePublicId);
  }

  updateTag(CACHE_TAGS.salasVip);
}
