import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DataTable } from "@/components/admin/DataTable";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { Button } from "@/components/ui/Button";
import { deleteConsultingServiceAction } from "./actions";

export default async function ConsultingServicesPage() {
  const services = await prisma.consultingService.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-title text-2xl font-black">Servicios de consultoría</h1>
        <Button asChild>
          <Link href="/admin/cowork/servicios/nuevo">Nuevo servicio</Link>
        </Button>
      </div>
      <DataTable
        items={services}
        keyFor={(s) => s.id}
        emptyMessage="No hay servicios todavía."
        columns={[
          { header: "Orden", cell: (s) => s.order },
          { header: "Nombre", cell: (s) => s.name },
          { header: "Etiqueta", cell: (s) => s.tag },
          {
            header: "Acciones",
            cell: (s) => (
              <div className="flex items-center gap-4">
                <Link href={`/admin/cowork/servicios/${s.id}`} className="text-sm text-accent-primary hover:underline">
                  Editar
                </Link>
                <ConfirmDeleteButton action={deleteConsultingServiceAction.bind(null, s.id)} />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
