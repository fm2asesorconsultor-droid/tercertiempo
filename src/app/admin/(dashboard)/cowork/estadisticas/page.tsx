import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DataTable } from "@/components/admin/DataTable";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { Button } from "@/components/ui/Button";
import { deleteCoworkStatAction } from "./actions";

export default async function CoworkStatsPage() {
  const stats = await prisma.coworkStat.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-title text-2xl font-black">Estadísticas Cowork</h1>
        <Button asChild>
          <Link href="/admin/cowork/estadisticas/nueva">Nueva estadística</Link>
        </Button>
      </div>
      <DataTable
        items={stats}
        keyFor={(s) => s.id}
        emptyMessage="No hay estadísticas todavía."
        columns={[
          { header: "Orden", cell: (s) => s.order },
          { header: "Valor", cell: (s) => s.value },
          { header: "Etiqueta", cell: (s) => s.label },
          {
            header: "Acciones",
            cell: (s) => (
              <div className="flex items-center gap-4">
                <Link href={`/admin/cowork/estadisticas/${s.id}`} className="text-sm text-accent-primary hover:underline">
                  Editar
                </Link>
                <ConfirmDeleteButton action={deleteCoworkStatAction.bind(null, s.id)} />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
