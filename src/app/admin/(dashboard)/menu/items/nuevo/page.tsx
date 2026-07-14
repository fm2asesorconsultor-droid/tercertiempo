import { prisma } from "@/lib/prisma";
import { MenuItemForm } from "../MenuItemForm";
import { createMenuItemAction } from "../actions";

export default async function NewMenuItemPage() {
  const categories = await prisma.menuCategory.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <h1 className="mb-6 font-title text-2xl font-black">Nuevo item de menú</h1>
      {categories.length === 0 ? (
        <p className="text-sm text-danger">Crea primero una categoría en /admin/menu/categorias.</p>
      ) : (
        <MenuItemForm categories={categories} action={createMenuItemAction} />
      )}
    </div>
  );
}
