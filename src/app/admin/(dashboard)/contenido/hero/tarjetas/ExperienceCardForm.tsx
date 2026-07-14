"use client";

import { useActionState } from "react";
import type { ExperienceCard } from "@/generated/prisma/client";
import type { ExperienceCardFormState } from "./actions";
import { FormField } from "@/components/admin/FormField";
import { TextAreaField } from "@/components/admin/TextAreaField";
import { SelectField } from "@/components/admin/SelectField";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { Button } from "@/components/ui/Button";

const ICON_OPTIONS = [
  { value: "monitor", label: "Pantalla (Monitor)" },
  { value: "sofa", label: "Sofá" },
  { value: "shopping-bag", label: "Bolsa de compras" },
];

const initialState: ExperienceCardFormState = {};

type Props = {
  card?: ExperienceCard;
  action: (prevState: ExperienceCardFormState, formData: FormData) => Promise<ExperienceCardFormState>;
};

export function ExperienceCardForm({ card, action }: Props) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <SelectField label="Ícono" name="iconKey" defaultValue={card?.iconKey ?? "monitor"} options={ICON_OPTIONS} required />
      <FormField label="Título" name="title" defaultValue={card?.title} required />
      <TextAreaField label="Descripción" name="description" defaultValue={card?.description} rows={2} required />
      <ImageUploadField
        label="Imagen"
        urlFieldName="imageUrl"
        publicIdFieldName="imagePublicId"
        initialUrl={card?.imageUrl}
        initialPublicId={card?.imagePublicId}
      />
      <FormField label="Orden" name="order" type="number" defaultValue={card?.order ?? 0} />
      {state.error && <p className="text-sm text-danger">{state.error}</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Guardando..." : "Guardar"}
      </Button>
    </form>
  );
}
