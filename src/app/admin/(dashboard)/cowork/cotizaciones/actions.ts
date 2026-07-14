"use server";

import { requireAdmin } from "@/lib/auth/dal";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateB2BQuoteStatusAction(id: number, status: "NEW" | "CONTACTED" | "WON" | "LOST") {
  await requireAdmin();
  await prisma.b2BQuote.update({ where: { id }, data: { status } });
  revalidatePath("/admin/cowork/cotizaciones");
}
