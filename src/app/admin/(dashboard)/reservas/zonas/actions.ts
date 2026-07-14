"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth/dal";
import { prisma } from "@/lib/prisma";
import { CACHE_TAGS } from "@/lib/data/cache-tags";

const schema = z.object({
  name: z.string().min(1, "Campo obligatorio."),
  floor: z.coerce.number().int().min(1).max(2),
  capacityLabel: z.string().min(1, "Campo obligatorio."),
  priceLabel: z.string().min(1, "Campo obligatorio."),
  description: z.string().min(1, "Campo obligatorio."),
});

export type ZoneFormState = { error?: string };

export async function updateZoneAction(
  id: number,
  _prevState: ZoneFormState,
  formData: FormData
): Promise<ZoneFormState> {
  await requireAdmin();

  const parsed = schema.safeParse({
    name: formData.get("name"),
    floor: formData.get("floor"),
    capacityLabel: formData.get("capacityLabel"),
    priceLabel: formData.get("priceLabel"),
    description: formData.get("description"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  await prisma.zone.update({ where: { id }, data: parsed.data });

  updateTag(CACHE_TAGS.zones);
  redirect("/admin/reservas/zonas");
}
