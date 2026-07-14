import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DataTable } from "@/components/admin/DataTable";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { Button } from "@/components/ui/Button";
import { deleteMenuItemAction } from "./actions";

const formatCOP = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

export default async function MenuItemsPage() {
  const items = await prisma.menuItem.findMany({ include: { category: true }, orderBy: { order: "asc" } });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-title text-2xl font-black">Platos y bebidas</h1>
        <Button asChild>
          <Link href="/admin/menu/items/nuevo">Nuevo item</Link>
        </Button>
      </div>
      <DataTable
        items={items}
        keyFor={(i) => i.id}
        emptyMessage="No hay items todavía. Crea primero una categoría."
        columns={[
          { header: "Orden", cell: (i) => i.order },
          { header: "Nombre", cell: (i) => i.name },
          { header: "Categoría", cell: (i) => i.category.name },
          { header: "Precio", cell: (i) => formatCOP.format(i.price) },
          { header: "Destacado", cell: (i) => (i.isMVP ? "Sí" : "No") },
          {
            header: "Acciones",
            cell: (i) => (
              <div className="flex items-center gap-4">
                <Link href={`/admin/menu/items/${i.id}`} className="text-sm text-accent-primary hover:underline">
                  Editar
                </Link>
                <ConfirmDeleteButton action={deleteMenuItemAction.bind(null, i.id)} />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
