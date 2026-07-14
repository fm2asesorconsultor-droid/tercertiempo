import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { MenuItemForm } from "../MenuItemForm";
import { updateMenuItemAction } from "../actions";

export default async function EditMenuItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [item, categories] = await Promise.all([
    prisma.menuItem.findUnique({ where: { id: Number(id) } }),
    prisma.menuCategory.findMany({ orderBy: { order: "asc" } }),
  ]);
  if (!item) notFound();

  const action = updateMenuItemAction.bind(null, item.id);

  return (
    <div>
      <h1 className="mb-6 font-title text-2xl font-black">Editar item</h1>
      <MenuItemForm item={item} categories={categories} action={action} />
    </div>
  );
}
