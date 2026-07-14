"use client";

import { useActionState } from "react";
import type { Product } from "@/generated/prisma/client";
import type { ProductFormState } from "./actions";
import { FormField } from "@/components/admin/FormField";
import { SelectField } from "@/components/admin/SelectField";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { Button } from "@/components/ui/Button";

const CATEGORY_OPTIONS = [
  { value: "CAMISETAS", label: "Camisetas" },
  { value: "GORRAS", label: "Gorras" },
  { value: "ACCESORIOS", label: "Accesorios" },
];

const initialState: ProductFormState = {};

type Props = {
  product?: Product;
  action: (prevState: ProductFormState, formData: FormData) => Promise<ProductFormState>;
};

export function ProductForm({ product, action }: Props) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <FormField label="Nombre" name="name" defaultValue={product?.name} required />
      <SelectField label="Categoría" name="category" defaultValue={product?.category ?? "CAMISETAS"} options={CATEGORY_OPTIONS} required />
      <FormField label="Precio (COP, solo número)" name="price" type="number" defaultValue={product?.price ?? 0} required />
      <ImageUploadField
        label="Imagen"
        urlFieldName="imageUrl"
        publicIdFieldName="imagePublicId"
        initialUrl={product?.imageUrl}
        initialPublicId={product?.imagePublicId}
      />
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm text-text-secondary">
          <input type="checkbox" name="isNew" defaultChecked={product?.isNew ?? false} className="h-4 w-4 rounded border-border-default" />
          Marcar como nuevo
        </label>
        <label className="flex items-center gap-2 text-sm text-text-secondary">
          <input type="checkbox" name="canCustomize" defaultChecked={product?.canCustomize ?? false} className="h-4 w-4 rounded border-border-default" />
          Permite personalización (nombre/número)
        </label>
      </div>
      {state.error && <p className="text-sm text-danger">{state.error}</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Guardando..." : "Guardar"}
      </Button>
    </form>
  );
}
