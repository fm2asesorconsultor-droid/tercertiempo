import { MenuCategoryForm } from "../MenuCategoryForm";
import { createMenuCategoryAction } from "../actions";

export default function NewMenuCategoryPage() {
  return (
    <div>
      <h1 className="mb-6 font-title text-2xl font-black">Nueva categoría</h1>
      <MenuCategoryForm action={createMenuCategoryAction} />
    </div>
  );
}
