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
  category: z.enum(["CAMISETAS", "GORRAS", "ACCESORIOS"]),
  price: z.coerce.number().int().min(0),
  imageUrl: z.string().min(1, "Sube una imagen."),
  imagePublicId: z.string().optional(),
  isNew: z.coerce.boolean(),
  canCustomize: z.coerce.boolean(),
});

export type ProductFormState = { error?: string };

function parseForm(formData: FormData) {
  return schema.safeParse({
    name: formData.get("name"),
    category: formData.get("category"),
    price: formData.get("price"),
    imageUrl: formData.get("imageUrl"),
    imagePublicId: formData.get("imagePublicId"),
    isNew: formData.get("isNew") === "on",
    canCustomize: formData.get("canCustomize") === "on",
  });
}

export async function createProductAction(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  await prisma.product.create({
    data: { ...parsed.data, imagePublicId: parsed.data.imagePublicId || null },
  });

  updateTag(CACHE_TAGS.products);
  redirect("/admin/tienda/productos");
}

export async function updateProductAction(
  id: number,
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const current = await prisma.product.findUnique({ where: { id } });

  await prisma.product.update({
    where: { id },
    data: { ...parsed.data, imagePublicId: parsed.data.imagePublicId || null },
  });

  if (current?.imagePublicId && current.imagePublicId !== (parsed.data.imagePublicId || null)) {
    await deleteImageAction(current.imagePublicId);
  }

  updateTag(CACHE_TAGS.products);
  redirect("/admin/tienda/productos");
}

export async function deleteProductAction(id: number): Promise<void> {
  await requireAdmin();
  const current = await prisma.product.findUnique({ where: { id } });
  await prisma.product.delete({ where: { id } });

  if (current?.imagePublicId) {
    await deleteImageAction(current.imagePublicId);
  }

  updateTag(CACHE_TAGS.products);
}
