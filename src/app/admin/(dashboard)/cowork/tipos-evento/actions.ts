"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth/dal";
import { prisma } from "@/lib/prisma";
import { CACHE_TAGS } from "@/lib/data/cache-tags";

const schema = z.object({
  label: z.string().min(1, "Campo obligatorio."),
  order: z.coerce.number().int().default(0),
});

export type EventTypeFormState = { error?: string };

function parseForm(formData: FormData) {
  return schema.safeParse({
    label: formData.get("label"),
    order: formData.get("order"),
  });
}

export async function createEventTypeAction(
  _prevState: EventTypeFormState,
  formData: FormData
): Promise<EventTypeFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };

  await prisma.eventType.create({ data: parsed.data });
  updateTag(CACHE_TAGS.cowork);
  redirect("/admin/cowork/tipos-evento");
}

export async function updateEventTypeAction(
  id: number,
  _prevState: EventTypeFormState,
  formData: FormData
): Promise<EventTypeFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };

  await prisma.eventType.update({ where: { id }, data: parsed.data });
  updateTag(CACHE_TAGS.cowork);
  redirect("/admin/cowork/tipos-evento");
}

export async function deleteEventTypeAction(id: number): Promise<void> {
  await requireAdmin();
  await prisma.eventType.delete({ where: { id } });
  updateTag(CACHE_TAGS.cowork);
}
