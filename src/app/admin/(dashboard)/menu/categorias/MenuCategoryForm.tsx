"use client";

import { useActionState } from "react";
import type { MenuCategory } from "@/generated/prisma/client";
import type { MenuCategoryFormState } from "./actions";
import { FormField } from "@/components/admin/FormField";
import { SelectField } from "@/components/admin/SelectField";
import { Button } from "@/components/ui/Button";

const ICON_OPTIONS = [
  { value: "beef", label: "Carne (Beef)" },
  { value: "pizza", label: "Para compartir (Pizza)" },
  { value: "beer", label: "Cerveza (Beer)" },
  { value: "coffee", label: "Bebida/Cóctel (Coffee)" },
];

const initialState: MenuCategoryFormState = {};

type Props = {
  category?: MenuCategory;
  action: (prevState: MenuCategoryFormState, formData: FormData) => Promise<MenuCategoryFormState>;
};

export function MenuCategoryForm({ category, action }: Props) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <FormField label="Nombre" name="name" defaultValue={category?.name} required />
      <SelectField label="Ícono" name="iconKey" defaultValue={category?.iconKey ?? "beef"} options={ICON_OPTIONS} required />
      <FormField label="Orden" name="order" type="number" defaultValue={category?.order ?? 0} />
      {state.error && <p className="text-sm text-danger">{state.error}</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Guardando..." : "Guardar"}
      </Button>
    </form>
  );
}
