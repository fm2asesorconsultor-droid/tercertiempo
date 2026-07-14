"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth/dal";
import { prisma } from "@/lib/prisma";
import { CACHE_TAGS } from "@/lib/data/cache-tags";

const schema = z.object({
  label: z.string().min(1, "Campo obligatorio."),
  price: z.coerce.number().int().min(0),
  iconKey: z.string().min(1, "Campo obligatorio."),
  order: z.coerce.number().int().default(0),
});

export type QuoteExtraFormState = { error?: string };

function parseForm(formData: FormData) {
  return schema.safeParse({
    label: formData.get("label"),
    price: formData.get("price"),
    iconKey: formData.get("iconKey"),
    order: formData.get("order"),
  });
}

export async function createQuoteExtraAction(
  _prevState: QuoteExtraFormState,
  formData: FormData
): Promise<QuoteExtraFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };

  await prisma.quoteExtra.create({ data: parsed.data });
  updateTag(CACHE_TAGS.cowork);
  redirect("/admin/cowork/extras");
}

export async function updateQuoteExtraAction(
  id: number,
  _prevState: QuoteExtraFormState,
  formData: FormData
): Promise<QuoteExtraFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };

  await prisma.quoteExtra.update({ where: { id }, data: parsed.data });
  updateTag(CACHE_TAGS.cowork);
  redirect("/admin/cowork/extras");
}

export async function deleteQuoteExtraAction(id: number): Promise<void> {
  await requireAdmin();
  await prisma.quoteExtra.delete({ where: { id } });
  updateTag(CACHE_TAGS.cowork);
}
