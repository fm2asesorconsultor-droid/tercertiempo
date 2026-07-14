import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DataTable } from "@/components/admin/DataTable";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { Button } from "@/components/ui/Button";
import { deleteSalaVipAction } from "./actions";

export default async function SalasVipAdminPage() {
  const salas = await prisma.salaVip.findMany({ orderBy: { id: "asc" } });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-title text-2xl font-black">Salas VIP</h1>
        <Button asChild>
          <Link href="/admin/reservas/salas-vip/nueva">Nueva sala</Link>
        </Button>
      </div>
      <DataTable
        items={salas}
        keyFor={(s) => s.id}
        emptyMessage="No hay salas todavía."
        columns={[
          { header: "Nombre", cell: (s) => s.name },
          { header: "Capacidad", cell: (s) => s.capacity },
          { header: "Estado", cell: (s) => s.status },
          { header: "Precio", cell: (s) => s.priceLabel },
          {
            header: "Acciones",
            cell: (s) => (
              <div className="flex items-center gap-4">
                <Link href={`/admin/reservas/salas-vip/${s.id}`} className="text-sm text-accent-primary hover:underline">
                  Editar
                </Link>
                <ConfirmDeleteButton action={deleteSalaVipAction.bind(null, s.id)} />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
