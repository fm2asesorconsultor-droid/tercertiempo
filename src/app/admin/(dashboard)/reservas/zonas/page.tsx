import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DataTable } from "@/components/admin/DataTable";

export default async function ZonesPage() {
  const zones = await prisma.zone.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-title text-2xl font-black">Zonas del bar</h1>
        <p className="mt-1 text-sm text-text-muted">
          Las 6 zonas están fijas (coinciden con el mapa del bar en /reservar) — solo se pueden editar, no crear ni eliminar.
        </p>
      </div>
      <DataTable
        items={zones}
        keyFor={(z) => z.id}
        columns={[
          { header: "Nombre", cell: (z) => z.name },
          { header: "Piso", cell: (z) => z.floor },
          { header: "Capacidad", cell: (z) => z.capacityLabel },
          { header: "Precio", cell: (z) => z.priceLabel },
          {
            header: "Acciones",
            cell: (z) => (
              <Link href={`/admin/reservas/zonas/${z.id}`} className="text-sm text-accent-primary hover:underline">
                Editar
              </Link>
            ),
          },
        ]}
      />
    </div>
  );
}
