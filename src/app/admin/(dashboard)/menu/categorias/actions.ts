"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth/dal";
import { prisma } from "@/lib/prisma";
import { CACHE_TAGS } from "@/lib/data/cache-tags";

const schema = z.object({
  name: z.string().min(1, "Campo obligatorio."),
  iconKey: z.string().min(1, "Selecciona un ícono."),
  order: z.coerce.number().int().default(0),
});

export type MenuCategoryFormState = { error?: string };

function parseForm(formData: FormData) {
  return schema.safeParse({
    name: formData.get("name"),
    iconKey: formData.get("iconKey"),
    order: formData.get("order"),
  });
}

export async function createMenuCategoryAction(
  _prevState: MenuCategoryFormState,
  formData: FormData
): Promise<MenuCategoryFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  await prisma.menuCategory.create({ data: parsed.data });
  updateTag(CACHE_TAGS.menu);
  redirect("/admin/menu/categorias");
}

export async function updateMenuCategoryAction(
  id: number,
  _prevState: MenuCategoryFormState,
  formData: FormData
): Promise<MenuCategoryFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  await prisma.menuCategory.update({ where: { id }, data: parsed.data });
  updateTag(CACHE_TAGS.menu);
  redirect("/admin/menu/categorias");
}

export async function deleteMenuCategoryAction(id: number): Promise<void> {
  await requireAdmin();
  await prisma.menuCategory.delete({ where: { id } });
  updateTag(CACHE_TAGS.menu);
}
