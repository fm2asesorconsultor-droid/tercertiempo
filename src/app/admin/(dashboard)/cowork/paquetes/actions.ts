"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth/dal";
import { prisma } from "@/lib/prisma";
import { CACHE_TAGS } from "@/lib/data/cache-tags";

const schema = z.object({
  slug: z.string().min(1, "Campo obligatorio.").regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones."),
  iconKey: z.string().min(1, "Campo obligatorio."),
  name: z.string().min(1, "Campo obligatorio."),
  subtitle: z.string().min(1, "Campo obligatorio."),
  price: z.coerce.number().int().min(0),
  theme: z.enum(["ZINC", "ACCENT"]),
  popular: z.coerce.boolean(),
  ctaLabel: z.string().min(1, "Campo obligatorio."),
  order: z.coerce.number().int().default(0),
  features: z.string().transform((v) => v.split("\n").map((f) => f.trim()).filter(Boolean)),
});

export type CoworkPackageFormState = { error?: string };

function parseForm(formData: FormData) {
  return schema.safeParse({
    slug: formData.get("slug"),
    iconKey: formData.get("iconKey"),
    name: formData.get("name"),
    subtitle: formData.get("subtitle"),
    price: formData.get("price"),
    theme: formData.get("theme"),
    popular: formData.get("popular") === "on",
    ctaLabel: formData.get("ctaLabel"),
    order: formData.get("order"),
    features: formData.get("features"),
  });
}

export async function createCoworkPackageAction(
  _prevState: CoworkPackageFormState,
  formData: FormData
): Promise<CoworkPackageFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };

  const { features, ...rest } = parsed.data;
  await prisma.coworkPackage.create({
    data: {
      ...rest,
      features: { create: features.map((text, order) => ({ text, order })) },
    },
  });

  updateTag(CACHE_TAGS.cowork);
  redirect("/admin/cowork/paquetes");
}

export async function updateCoworkPackageAction(
  id: number,
  _prevState: CoworkPackageFormState,
  formData: FormData
): Promise<CoworkPackageFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };

  const { features, ...rest } = parsed.data;
  await prisma.$transaction([
    prisma.coworkPackage.update({ where: { id }, data: rest }),
    prisma.coworkPackageFeature.deleteMany({ where: { coworkPackageId: id } }),
    prisma.coworkPackageFeature.createMany({
      data: features.map((text, order) => ({ coworkPackageId: id, text, order })),
    }),
  ]);

  updateTag(CACHE_TAGS.cowork);
  redirect("/admin/cowork/paquetes");
}

export async function deleteCoworkPackageAction(id: number): Promise<void> {
  await requireAdmin();
  await prisma.coworkPackage.delete({ where: { id } });
  updateTag(CACHE_TAGS.cowork);
}
