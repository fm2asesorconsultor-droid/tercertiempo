"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth/dal";
import { prisma } from "@/lib/prisma";
import { CACHE_TAGS } from "@/lib/data/cache-tags";

const schema = z.object({
  value: z.string().min(1, "Campo obligatorio."),
  label: z.string().min(1, "Campo obligatorio."),
  order: z.coerce.number().int().default(0),
});

export type CoworkStatFormState = { error?: string };

function parseForm(formData: FormData) {
  return schema.safeParse({
    value: formData.get("value"),
    label: formData.get("label"),
    order: formData.get("order"),
  });
}

export async function createCoworkStatAction(
  _prevState: CoworkStatFormState,
  formData: FormData
): Promise<CoworkStatFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };

  await prisma.coworkStat.create({ data: parsed.data });
  updateTag(CACHE_TAGS.cowork);
  redirect("/admin/cowork/estadisticas");
}

export async function updateCoworkStatAction(
  id: number,
  _prevState: CoworkStatFormState,
  formData: FormData
): Promise<CoworkStatFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };

  await prisma.coworkStat.update({ where: { id }, data: parsed.data });
  updateTag(CACHE_TAGS.cowork);
  redirect("/admin/cowork/estadisticas");
}

export async function deleteCoworkStatAction(id: number): Promise<void> {
  await requireAdmin();
  await prisma.coworkStat.delete({ where: { id } });
  updateTag(CACHE_TAGS.cowork);
}
