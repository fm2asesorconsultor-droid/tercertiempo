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
  logoUrl: z.string().min(1, "Sube un logo."),
  logoPublicId: z.string().optional(),
});

export type TeamFormState = { error?: string };

function parseForm(formData: FormData) {
  return schema.safeParse({
    name: formData.get("name"),
    logoUrl: formData.get("logoUrl"),
    logoPublicId: formData.get("logoPublicId"),
  });
}

export async function createTeamAction(
  _prevState: TeamFormState,
  formData: FormData
): Promise<TeamFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  await prisma.team.create({
    data: { ...parsed.data, logoPublicId: parsed.data.logoPublicId || null },
  });

  updateTag(CACHE_TAGS.teams);
  redirect("/admin/partidos/equipos");
}

export async function updateTeamAction(
  id: number,
  _prevState: TeamFormState,
  formData: FormData
): Promise<TeamFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const current = await prisma.team.findUnique({ where: { id } });

  await prisma.team.update({
    where: { id },
    data: { ...parsed.data, logoPublicId: parsed.data.logoPublicId || null },
  });

  if (current?.logoPublicId && current.logoPublicId !== (parsed.data.logoPublicId || null)) {
    await deleteImageAction(current.logoPublicId);
  }

  updateTag(CACHE_TAGS.teams);
  redirect("/admin/partidos/equipos");
}

export async function deleteTeamAction(id: number): Promise<void> {
  await requireAdmin();
  const current = await prisma.team.findUnique({ where: { id } });
  await prisma.team.delete({ where: { id } });

  if (current?.logoPublicId) {
    await deleteImageAction(current.logoPublicId);
  }

  updateTag(CACHE_TAGS.teams);
}
