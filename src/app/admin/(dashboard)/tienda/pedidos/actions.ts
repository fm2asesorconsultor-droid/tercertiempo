"use server";

import { requireAdmin } from "@/lib/auth/dal";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProductOrderStatusAction(
  id: number,
  status: "PENDING" | "CONFIRMED" | "READY" | "CANCELLED"
) {
  await requireAdmin();
  await prisma.productOrder.update({ where: { id }, data: { status } });
  revalidatePath("/admin/tienda/pedidos");
}
