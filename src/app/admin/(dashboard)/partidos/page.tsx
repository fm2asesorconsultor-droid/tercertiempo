import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DataTable } from "@/components/admin/DataTable";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { Button } from "@/components/ui/Button";
import { deleteMatchAction } from "./actions";

export default async function MatchesAdminPage() {
  const matches = await prisma.match.findMany({
    include: { homeTeam: true, awayTeam: true },
    orderBy: { kickoffAt: "asc" },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-title text-2xl font-black">Partidos</h1>
          <div className="mt-1 flex gap-4 text-sm">
            <Link href="/admin/partidos/equipos" className="text-accent-primary hover:underline">
              Gestionar equipos →
            </Link>
            <Link href="/admin/partidos/demanda" className="text-accent-primary hover:underline">
              Gestionar demanda del calendario →
            </Link>
          </div>
        </div>
        <Button asChild>
          <Link href="/admin/partidos/nuevo">Nuevo partido</Link>
        </Button>
      </div>
      <DataTable
        items={matches}
        keyFor={(m) => m.id}
        emptyMessage="No hay partidos todavía."
        columns={[
          { header: "Partido", cell: (m) => `${m.homeTeam.name} vs ${m.awayTeam.name}` },
          { header: "Competición", cell: (m) => m.competition },
          { header: "Fecha", cell: (m) => new Date(m.kickoffAt).toLocaleString("es-CO") },
          { header: "Estado", cell: (m) => m.status },
          { header: "Portada", cell: (m) => (m.showOnHome ? "Sí" : "No") },
          {
            header: "Acciones",
            cell: (m) => (
              <div className="flex items-center gap-4">
                <Link href={`/admin/partidos/${m.id}`} className="text-sm text-accent-primary hover:underline">
                  Editar
                </Link>
                <ConfirmDeleteButton action={deleteMatchAction.bind(null, m.id)} />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
