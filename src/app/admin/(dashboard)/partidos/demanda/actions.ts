"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth/dal";
import { prisma } from "@/lib/prisma";
import { CACHE_TAGS } from "@/lib/data/cache-tags";

const schema = z.object({
  date: z.string().min(1, "Selecciona una fecha.").transform((v) => new Date(`${v}T00:00:00`)),
  teamsLabel: z.string().min(1, "Campo obligatorio."),
  demand: z.enum(["HIGH", "MID", "LOW"]),
});

export type MatchDemandFormState = { error?: string };

function parseForm(formData: FormData) {
  return schema.safeParse({
    date: formData.get("date"),
    teamsLabel: formData.get("teamsLabel"),
    demand: formData.get("demand"),
  });
}

export async function createMatchDemandAction(
  _prevState: MatchDemandFormState,
  formData: FormData
): Promise<MatchDemandFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  await prisma.matchDemandDay.create({ data: parsed.data });

  updateTag(CACHE_TAGS.matchDemand);
  redirect("/admin/partidos/demanda");
}

export async function updateMatchDemandAction(
  id: number,
  _prevState: MatchDemandFormState,
  formData: FormData
): Promise<MatchDemandFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  await prisma.matchDemandDay.update({ where: { id }, data: parsed.data });

  updateTag(CACHE_TAGS.matchDemand);
  redirect("/admin/partidos/demanda");
}

export async function deleteMatchDemandAction(id: number): Promise<void> {
  await requireAdmin();
  await prisma.matchDemandDay.delete({ where: { id } });
  updateTag(CACHE_TAGS.matchDemand);
}
