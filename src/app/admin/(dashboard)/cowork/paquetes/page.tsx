import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DataTable } from "@/components/admin/DataTable";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { Button } from "@/components/ui/Button";
import { deleteCoworkPackageAction } from "./actions";

const formatCOP = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

export default async function CoworkPackagesPage() {
  const packages = await prisma.coworkPackage.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-title text-2xl font-black">Paquetes Cowork</h1>
        <Button asChild>
          <Link href="/admin/cowork/paquetes/nuevo">Nuevo paquete</Link>
        </Button>
      </div>
      <DataTable
        items={packages}
        keyFor={(p) => p.id}
        emptyMessage="No hay paquetes todavía."
        columns={[
          { header: "Orden", cell: (p) => p.order },
          { header: "Nombre", cell: (p) => p.name },
          { header: "Precio", cell: (p) => formatCOP.format(p.price) },
          { header: "Popular", cell: (p) => (p.popular ? "Sí" : "No") },
          {
            header: "Acciones",
            cell: (p) => (
              <div className="flex items-center gap-4">
                <Link href={`/admin/cowork/paquetes/${p.id}`} className="text-sm text-accent-primary hover:underline">
                  Editar
                </Link>
                <ConfirmDeleteButton action={deleteCoworkPackageAction.bind(null, p.id)} />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
