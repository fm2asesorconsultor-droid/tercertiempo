"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth/dal";
import { prisma } from "@/lib/prisma";
import { CACHE_TAGS } from "@/lib/data/cache-tags";

const schema = z.object({
  name: z.string().min(1, "Campo obligatorio."),
  text: z.string().min(1, "Campo obligatorio."),
  rating: z.coerce.number().int().min(1).max(5),
  published: z.coerce.boolean(),
  order: z.coerce.number().int().default(0),
});

export type TestimonialFormState = { error?: string };

function parseForm(formData: FormData) {
  return schema.safeParse({
    name: formData.get("name"),
    text: formData.get("text"),
    rating: formData.get("rating"),
    published: formData.get("published") === "on",
    order: formData.get("order"),
  });
}

export async function createTestimonialAction(
  _prevState: TestimonialFormState,
  formData: FormData
): Promise<TestimonialFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  await prisma.testimonial.create({ data: parsed.data });
  updateTag(CACHE_TAGS.testimonials);
  redirect("/admin/contenido/testimonios");
}

export async function updateTestimonialAction(
  id: number,
  _prevState: TestimonialFormState,
  formData: FormData
): Promise<TestimonialFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  await prisma.testimonial.update({ where: { id }, data: parsed.data });
  updateTag(CACHE_TAGS.testimonials);
  redirect("/admin/contenido/testimonios");
}

export async function deleteTestimonialAction(id: number): Promise<void> {
  await requireAdmin();
  await prisma.testimonial.delete({ where: { id } });
  updateTag(CACHE_TAGS.testimonials);
}
