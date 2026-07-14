import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DataTable } from "@/components/admin/DataTable";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { Button } from "@/components/ui/Button";
import { deleteEventTypeAction } from "./actions";

export default async function EventTypesPage() {
  const eventTypes = await prisma.eventType.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-title text-2xl font-black">Tipos de evento (cotizador)</h1>
        <Button asChild>
          <Link href="/admin/cowork/tipos-evento/nuevo">Nuevo tipo</Link>
        </Button>
      </div>
      <DataTable
        items={eventTypes}
        keyFor={(e) => e.id}
        emptyMessage="No hay tipos de evento todavía."
        columns={[
          { header: "Orden", cell: (e) => e.order },
          { header: "Nombre", cell: (e) => e.label },
          {
            header: "Acciones",
            cell: (e) => (
              <div className="flex items-center gap-4">
                <Link href={`/admin/cowork/tipos-evento/${e.id}`} className="text-sm text-accent-primary hover:underline">
                  Editar
                </Link>
                <ConfirmDeleteButton action={deleteEventTypeAction.bind(null, e.id)} />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
