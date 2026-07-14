import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DataTable } from "@/components/admin/DataTable";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { Button } from "@/components/ui/Button";
import { deleteProductAction } from "./actions";

const formatCOP = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

export default async function ProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { id: "asc" } });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-title text-2xl font-black">Productos</h1>
        <Button asChild>
          <Link href="/admin/tienda/productos/nuevo">Nuevo producto</Link>
        </Button>
      </div>
      <DataTable
        items={products}
        keyFor={(p) => p.id}
        emptyMessage="No hay productos todavía."
        columns={[
          { header: "Nombre", cell: (p) => p.name },
          { header: "Categoría", cell: (p) => p.category },
          { header: "Precio", cell: (p) => formatCOP.format(p.price) },
          { header: "Nuevo", cell: (p) => (p.isNew ? "Sí" : "No") },
          {
            header: "Acciones",
            cell: (p) => (
              <div className="flex items-center gap-4">
                <Link href={`/admin/tienda/productos/${p.id}`} className="text-sm text-accent-primary hover:underline">
                  Editar
                </Link>
                <ConfirmDeleteButton action={deleteProductAction.bind(null, p.id)} />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
