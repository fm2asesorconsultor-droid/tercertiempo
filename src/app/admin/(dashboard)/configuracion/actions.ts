"use server";

import { z } from "zod";
import { updateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth/dal";
import { prisma } from "@/lib/prisma";
import { deleteImageAction } from "@/lib/actions/delete-image";
import { CACHE_TAGS } from "@/lib/data/cache-tags";

const SCHEDULE_ROWS = 6;

const optionalUrl = z
  .string()
  .optional()
  .transform((v) => (v && v.trim() ? v.trim() : undefined))
  .refine((v) => v === undefined || z.string().url().safeParse(v).success, {
    message: "URL inválida.",
  });

const siteSettingsSchema = z.object({
  whatsappNumber: z.string().min(5, "Número de WhatsApp inválido."),
  contactEmail: z.string().email("Correo inválido."),
  contactPhone: z.string().min(5, "Teléfono inválido."),
  address: z.string().min(1, "La dirección es obligatoria."),
  mapsEmbedUrl: z.string().url("URL de Google Maps inválida."),
  instagramUrl: optionalUrl,
  facebookUrl: optionalUrl,
  logoUrl: z.string().min(1, "Sube un logo."),
  logoPublicId: z.string().optional(),
});

export type SiteSettingsFormState = { error?: string; success?: boolean };

export async function updateSiteSettingsAction(
  _prevState: SiteSettingsFormState,
  formData: FormData
): Promise<SiteSettingsFormState> {
  await requireAdmin();

  const parsed = siteSettingsSchema.safeParse({
    whatsappNumber: formData.get("whatsappNumber"),
    contactEmail: formData.get("contactEmail"),
    contactPhone: formData.get("contactPhone"),
    address: formData.get("address"),
    mapsEmbedUrl: formData.get("mapsEmbedUrl"),
    instagramUrl: formData.get("instagramUrl"),
    facebookUrl: formData.get("facebookUrl"),
    logoUrl: formData.get("logoUrl"),
    logoPublicId: formData.get("logoPublicId"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const schedule: { day: string; hours: string }[] = [];
  for (let i = 0; i < SCHEDULE_ROWS; i++) {
    const day = String(formData.get(`scheduleDay${i}`) ?? "").trim();
    const hours = String(formData.get(`scheduleHours${i}`) ?? "").trim();
    if (day && hours) schedule.push({ day, hours });
  }

  const data = parsed.data;
  const current = await prisma.siteSettings.findUnique({ where: { id: 1 } });

  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {
      whatsappNumber: data.whatsappNumber,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      address: data.address,
      mapsEmbedUrl: data.mapsEmbedUrl,
      instagramUrl: data.instagramUrl ?? null,
      facebookUrl: data.facebookUrl ?? null,
      logoUrl: data.logoUrl,
      logoPublicId: data.logoPublicId || null,
      schedule,
    },
    create: {
      id: 1,
      whatsappNumber: data.whatsappNumber,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      address: data.address,
      mapsEmbedUrl: data.mapsEmbedUrl,
      instagramUrl: data.instagramUrl ?? null,
      facebookUrl: data.facebookUrl ?? null,
      logoUrl: data.logoUrl,
      logoPublicId: data.logoPublicId || null,
      schedule,
    },
  });

  if (current?.logoPublicId && current.logoPublicId !== (data.logoPublicId || null)) {
    await deleteImageAction(current.logoPublicId);
  }

  updateTag(CACHE_TAGS.siteSettings);

  return { success: true };
}
