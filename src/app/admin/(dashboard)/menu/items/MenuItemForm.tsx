"use client";

import { useActionState } from "react";
import type { MenuItem, MenuCategory } from "@/generated/prisma/client";
import type { MenuItemFormState } from "./actions";
import { FormField } from "@/components/admin/FormField";
import { TextAreaField } from "@/components/admin/TextAreaField";
import { SelectField } from "@/components/admin/SelectField";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { Button } from "@/components/ui/Button";

const initialState: MenuItemFormState = {};

type Props = {
  item?: MenuItem;
  categories: MenuCategory[];
  action: (prevState: MenuItemFormState, formData: FormData) => Promise<MenuItemFormState>;
};

export function MenuItemForm({ item, categories, action }: Props) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const categoryOptions = categories.map((c) => ({ value: String(c.id), label: c.name }));

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <SelectField label="Categoría" name="categoryId" defaultValue={String(item?.categoryId ?? categories[0]?.id ?? "")} options={categoryOptions} required />
      <FormField label="Nombre" name="name" defaultValue={item?.name} required />
      <TextAreaField label="Descripción" name="description" defaultValue={item?.description} rows={3} required />
      <FormField label="Precio (COP, solo número)" name="price" type="number" defaultValue={item?.price ?? 0} required />
      <FormField label="Match perfecto (sugerencia de acompañamiento)" name="pairingSuggestion" defaultValue={item?.pairingSuggestion ?? undefined} />
      <ImageUploadField
        label="Imagen"
        urlFieldName="imageUrl"
        publicIdFieldName="imagePublicId"
        initialUrl={item?.imageUrl}
        initialPublicId={item?.imagePublicId}
      />
      <label className="flex items-center gap-2 text-sm text-text-secondary">
        <input type="checkbox" name="isMVP" defaultChecked={item?.isMVP ?? false} className="h-4 w-4 rounded border-border-default" />
        Destacado (ocupa más espacio en la cuadrícula)
      </label>
      <FormField label="Orden" name="order" type="number" defaultValue={item?.order ?? 0} />
      {state.error && <p className="text-sm text-danger">{state.error}</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Guardando..." : "Guardar"}
      </Button>
    </form>
  );
}
