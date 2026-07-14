import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DataTable } from "@/components/admin/DataTable";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { Button } from "@/components/ui/Button";
import { deleteMenuCategoryAction } from "./actions";

export default async function MenuCategoriesPage() {
  const categories = await prisma.menuCategory.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-title text-2xl font-black">Categorías del menú</h1>
          <Link href="/admin/menu/items" className="text-sm text-accent-primary hover:underline">
            Gestionar platos y bebidas →
          </Link>
        </div>
        <Button asChild>
          <Link href="/admin/menu/categorias/nueva">Nueva categoría</Link>
        </Button>
      </div>
      <DataTable
        items={categories}
        keyFor={(c) => c.id}
        emptyMessage="No hay categorías todavía."
        columns={[
          { header: "Orden", cell: (c) => c.order },
          { header: "Nombre", cell: (c) => c.name },
          { header: "Ícono", cell: (c) => c.iconKey },
          {
            header: "Acciones",
            cell: (c) => (
              <div className="flex items-center gap-4">
                <Link href={`/admin/menu/categorias/${c.id}`} className="text-sm text-accent-primary hover:underline">
                  Editar
                </Link>
                <ConfirmDeleteButton action={deleteMenuCategoryAction.bind(null, c.id)} />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
