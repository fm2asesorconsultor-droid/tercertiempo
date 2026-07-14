import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DataTable } from "@/components/admin/DataTable";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { Button } from "@/components/ui/Button";
import { deleteTeamAction } from "./actions";

export default async function TeamsPage() {
  const teams = await prisma.team.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-title text-2xl font-black">Equipos</h1>
        <Button asChild>
          <Link href="/admin/partidos/equipos/nuevo">Nuevo equipo</Link>
        </Button>
      </div>
      <DataTable
        items={teams}
        keyFor={(t) => t.id}
        emptyMessage="No hay equipos todavía."
        columns={[
          { header: "Nombre", cell: (t) => t.name },
          {
            header: "Acciones",
            cell: (t) => (
              <div className="flex items-center gap-4">
                <Link href={`/admin/partidos/equipos/${t.id}`} className="text-sm text-accent-primary hover:underline">
                  Editar
                </Link>
                <ConfirmDeleteButton action={deleteTeamAction.bind(null, t.id)} />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
