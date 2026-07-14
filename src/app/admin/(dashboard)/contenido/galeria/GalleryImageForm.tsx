"use client";

import { useActionState } from "react";
import type { GalleryImage } from "@/generated/prisma/client";
import type { GalleryImageFormState } from "./actions";
import { FormField } from "@/components/admin/FormField";
import { SelectField } from "@/components/admin/SelectField";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { Button } from "@/components/ui/Button";

const CATEGORY_OPTIONS = [
  { value: "", label: "Sin categoría (solo portada)" },
  { value: "CUMPLEANOS", label: "Cumpleaños" },
  { value: "EVENTOS", label: "Eventos" },
  { value: "VIP", label: "VIP" },
  { value: "AMIGOS", label: "Amigos" },
];

const SPAN_OPTIONS = [
  { value: "normal", label: "Normal" },
  { value: "wide", label: "Ancha" },
  { value: "tall", label: "Alta" },
  { value: "large", label: "Grande" },
];

const initialState: GalleryImageFormState = {};

type Props = {
  image?: GalleryImage;
  action: (prevState: GalleryImageFormState, formData: FormData) => Promise<GalleryImageFormState>;
};

export function GalleryImageForm({ image, action }: Props) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <FormField label="Título" name="title" defaultValue={image?.title} required />
      <SelectField label="Categoría" name="category" defaultValue={image?.category ?? ""} options={CATEGORY_OPTIONS} />
      <SelectField label="Tamaño en la cuadrícula" name="gridSpan" defaultValue={image?.gridSpan ?? "normal"} options={SPAN_OPTIONS} />
      <div className="flex items-center gap-2">
        <input
          id="featuredOnHome"
          name="featuredOnHome"
          type="checkbox"
          defaultChecked={image?.featuredOnHome ?? false}
          className="h-4 w-4 rounded border-border-default"
        />
        <label htmlFor="featuredOnHome" className="text-sm text-text-secondary">
          Mostrar en la portada (sección &quot;Nuestro Mundo&quot;)
        </label>
      </div>
      <ImageUploadField
        label="Imagen"
        urlFieldName="imageUrl"
        publicIdFieldName="imagePublicId"
        initialUrl={image?.imageUrl}
        initialPublicId={image?.imagePublicId}
      />
      <FormField label="Orden" name="order" type="number" defaultValue={image?.order ?? 0} />
      {state.error && <p className="text-sm text-danger">{state.error}</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Guardando..." : "Guardar"}
      </Button>
    </form>
  );
}
