"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth/dal";
import { prisma } from "@/lib/prisma";
import { deleteImageAction } from "@/lib/actions/delete-image";
import { CACHE_TAGS } from "@/lib/data/cache-tags";

const CATEGORY_VALUES = ["", "CUMPLEANOS", "EVENTOS", "VIP", "AMIGOS"] as const;

const schema = z.object({
  title: z.string().min(1, "Campo obligatorio."),
  category: z.enum(CATEGORY_VALUES),
  featuredOnHome: z.coerce.boolean(),
  gridSpan: z.enum(["normal", "wide", "tall", "large"]),
  imageUrl: z.string().min(1, "Sube una imagen."),
  imagePublicId: z.string().optional(),
  order: z.coerce.number().int().default(0),
});

export type GalleryImageFormState = { error?: string };

function parseForm(formData: FormData) {
  return schema.safeParse({
    title: formData.get("title"),
    category: formData.get("category") ?? "",
    featuredOnHome: formData.get("featuredOnHome") === "on",
    gridSpan: formData.get("gridSpan") ?? "normal",
    imageUrl: formData.get("imageUrl"),
    imagePublicId: formData.get("imagePublicId"),
    order: formData.get("order"),
  });
}

export async function createGalleryImageAction(
  _prevState: GalleryImageFormState,
  formData: FormData
): Promise<GalleryImageFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const { category, ...rest } = parsed.data;
  await prisma.galleryImage.create({
    data: { ...rest, category: category || null, imagePublicId: rest.imagePublicId || null },
  });

  updateTag(CACHE_TAGS.gallery);
  redirect("/admin/contenido/galeria");
}

export async function updateGalleryImageAction(
  id: number,
  _prevState: GalleryImageFormState,
  formData: FormData
): Promise<GalleryImageFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const { category, ...rest } = parsed.data;
  const current = await prisma.galleryImage.findUnique({ where: { id } });

  await prisma.galleryImage.update({
    where: { id },
    data: { ...rest, category: category || null, imagePublicId: rest.imagePublicId || null },
  });

  if (current?.imagePublicId && current.imagePublicId !== (rest.imagePublicId || null)) {
    await deleteImageAction(current.imagePublicId);
  }

  updateTag(CACHE_TAGS.gallery);
  redirect("/admin/contenido/galeria");
}

export async function deleteGalleryImageAction(id: number): Promise<void> {
  await requireAdmin();
  const current = await prisma.galleryImage.findUnique({ where: { id } });
  await prisma.galleryImage.delete({ where: { id } });

  if (current?.imagePublicId) {
    await deleteImageAction(current.imagePublicId);
  }

  updateTag(CACHE_TAGS.gallery);
}
