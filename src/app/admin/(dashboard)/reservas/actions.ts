"use server";

import { requireAdmin } from "@/lib/auth/dal";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateReservationStatusAction(id: number, status: "PENDING" | "CONFIRMED" | "CANCELLED") {
  await requireAdmin();
  await prisma.reservation.update({ where: { id }, data: { status } });
  revalidatePath("/admin/reservas");
}
