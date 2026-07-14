import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DataTable } from "@/components/admin/DataTable";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { Button } from "@/components/ui/Button";
import { deleteMatchDemandAction } from "./actions";

export default async function MatchDemandPage() {
  const days = await prisma.matchDemandDay.findMany({ orderBy: { date: "asc" } });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-title text-2xl font-black">Demanda del calendario</h1>
        <Button asChild>
          <Link href="/admin/partidos/demanda/nueva">Nueva fecha</Link>
        </Button>
      </div>
      <DataTable
        items={days}
        keyFor={(d) => d.id}
        emptyMessage="No hay fechas registradas."
        columns={[
          { header: "Fecha", cell: (d) => new Date(d.date).toLocaleDateString("es-CO") },
          { header: "Partido", cell: (d) => d.teamsLabel },
          { header: "Demanda", cell: (d) => d.demand },
          {
            header: "Acciones",
            cell: (d) => (
              <div className="flex items-center gap-4">
                <Link href={`/admin/partidos/demanda/${d.id}`} className="text-sm text-accent-primary hover:underline">
                  Editar
                </Link>
                <ConfirmDeleteButton action={deleteMatchDemandAction.bind(null, d.id)} />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
