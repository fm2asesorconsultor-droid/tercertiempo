import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { MenuCategoryForm } from "../MenuCategoryForm";
import { updateMenuCategoryAction } from "../actions";

export default async function EditMenuCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await prisma.menuCategory.findUnique({ where: { id: Number(id) } });
  if (!category) notFound();

  const action = updateMenuCategoryAction.bind(null, category.id);

  return (
    <div>
      <h1 className="mb-6 font-title text-2xl font-black">Editar categoría</h1>
      <MenuCategoryForm category={category} action={action} />
    </div>
  );
}
