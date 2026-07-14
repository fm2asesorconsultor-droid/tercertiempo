"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth/dal";
import { prisma } from "@/lib/prisma";
import { deleteImageAction } from "@/lib/actions/delete-image";
import { CACHE_TAGS } from "@/lib/data/cache-tags";

const schema = z.object({
  categoryId: z.coerce.number().int(),
  name: z.string().min(1, "Campo obligatorio."),
  description: z.string().min(1, "Campo obligatorio."),
  price: z.coerce.number().int().min(0),
  imageUrl: z.string().min(1, "Sube una imagen."),
  imagePublicId: z.string().optional(),
  pairingSuggestion: z.string().optional(),
  isMVP: z.coerce.boolean(),
  order: z.coerce.number().int().default(0),
});

export type MenuItemFormState = { error?: string };

function parseForm(formData: FormData) {
  return schema.safeParse({
    categoryId: formData.get("categoryId"),
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    imageUrl: formData.get("imageUrl"),
    imagePublicId: formData.get("imagePublicId"),
    pairingSuggestion: formData.get("pairingSuggestion"),
    isMVP: formData.get("isMVP") === "on",
    order: formData.get("order"),
  });
}

export async function createMenuItemAction(
  _prevState: MenuItemFormState,
  formData: FormData
): Promise<MenuItemFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const { pairingSuggestion, imagePublicId, ...rest } = parsed.data;
  await prisma.menuItem.create({
    data: { ...rest, imagePublicId: imagePublicId || null, pairingSuggestion: pairingSuggestion || null },
  });

  updateTag(CACHE_TAGS.menu);
  redirect("/admin/menu/items");
}

export async function updateMenuItemAction(
  id: number,
  _prevState: MenuItemFormState,
  formData: FormData
): Promise<MenuItemFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const { pairingSuggestion, imagePublicId, ...rest } = parsed.data;
  const current = await prisma.menuItem.findUnique({ where: { id } });

  await prisma.menuItem.update({
    where: { id },
    data: { ...rest, imagePublicId: imagePublicId || null, pairingSuggestion: pairingSuggestion || null },
  });

  if (current?.imagePublicId && current.imagePublicId !== (imagePublicId || null)) {
    await deleteImageAction(current.imagePublicId);
  }

  updateTag(CACHE_TAGS.menu);
  redirect("/admin/menu/items");
}

export async function deleteMenuItemAction(id: number): Promise<void> {
  await requireAdmin();
  const current = await prisma.menuItem.findUnique({ where: { id } });
  await prisma.menuItem.delete({ where: { id } });

  if (current?.imagePublicId) {
    await deleteImageAction(current.imagePublicId);
  }

  updateTag(CACHE_TAGS.menu);
}
