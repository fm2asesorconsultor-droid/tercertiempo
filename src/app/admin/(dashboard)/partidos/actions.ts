"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth/dal";
import { prisma } from "@/lib/prisma";
import { CACHE_TAGS } from "@/lib/data/cache-tags";

const optionalInt = z
  .string()
  .optional()
  .transform((v) => (v && v.trim() !== "" ? Number(v) : undefined));

const schema = z.object({
  homeTeamId: z.coerce.number().int(),
  awayTeamId: z.coerce.number().int(),
  competition: z.string().min(1, "Campo obligatorio."),
  kickoffAt: z.string().min(1, "Selecciona fecha y hora.").transform((v) => new Date(v)),
  status: z.enum(["UPCOMING", "LIVE", "FINISHED"]),
  homeScore: optionalInt,
  awayScore: optionalInt,
  clockMinute: optionalInt,
  hype: z.coerce.number().int().min(0).max(100).default(0),
  isFeatured: z.coerce.boolean(),
  isVIP: z.coerce.boolean(),
  showOnHome: z.coerce.boolean(),
});

export type MatchFormState = { error?: string };

function parseForm(formData: FormData) {
  const parsed = schema.safeParse({
    homeTeamId: formData.get("homeTeamId"),
    awayTeamId: formData.get("awayTeamId"),
    competition: formData.get("competition"),
    kickoffAt: formData.get("kickoffAt"),
    status: formData.get("status"),
    homeScore: formData.get("homeScore"),
    awayScore: formData.get("awayScore"),
    clockMinute: formData.get("clockMinute"),
    hype: formData.get("hype"),
    isFeatured: formData.get("isFeatured") === "on",
    isVIP: formData.get("isVIP") === "on",
    showOnHome: formData.get("showOnHome") === "on",
  });

  if (parsed.success && parsed.data.homeTeamId === parsed.data.awayTeamId) {
    return {
      success: false as const,
      error: { issues: [{ message: "El equipo local y visitante no pueden ser el mismo." }] },
    };
  }

  return parsed;
}

export async function createMatchAction(
  _prevState: MatchFormState,
  formData: FormData
): Promise<MatchFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  await prisma.match.create({ data: parsed.data });

  updateTag(CACHE_TAGS.matches);
  redirect("/admin/partidos");
}

export async function updateMatchAction(
  id: number,
  _prevState: MatchFormState,
  formData: FormData
): Promise<MatchFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  await prisma.match.update({ where: { id }, data: parsed.data });

  updateTag(CACHE_TAGS.matches);
  redirect("/admin/partidos");
}

export async function deleteMatchAction(id: number): Promise<void> {
  await requireAdmin();
  await prisma.match.delete({ where: { id } });
  updateTag(CACHE_TAGS.matches);
}
