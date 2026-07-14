"use client";

import { useActionState } from "react";
import type { SalaVip } from "@/generated/prisma/client";
import type { SalaVipFormState } from "./actions";
import { FormField } from "@/components/admin/FormField";
import { TextAreaField } from "@/components/admin/TextAreaField";
import { SelectField } from "@/components/admin/SelectField";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { Button } from "@/components/ui/Button";

const STATUS_OPTIONS = [
  { value: "AVAILABLE", label: "Disponible" },
  { value: "LIMITED", label: "Últimos cupos" },
  { value: "FULL", label: "Completa" },
];

const initialState: SalaVipFormState = {};

type Props = {
  sala?: SalaVip;
  action: (prevState: SalaVipFormState, formData: FormData) => Promise<SalaVipFormState>;
};

export function SalaVipForm({ sala, action }: Props) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <FormField label="Nombre" name="name" defaultValue={sala?.name} required />
      <FormField label="Capacidad (número)" name="capacity" type="number" defaultValue={sala?.capacity ?? 10} required />
      <SelectField label="Estado" name="status" defaultValue={sala?.status ?? "AVAILABLE"} options={STATUS_OPTIONS} required />
      <FormField label="Precio (texto libre)" name="priceLabel" defaultValue={sala?.priceLabel} required />
      <TextAreaField
        label="Características (una por línea)"
        name="features"
        defaultValue={sala?.features?.join("\n")}
        rows={4}
      />
      <ImageUploadField
        label="Imagen"
        urlFieldName="imageUrl"
        publicIdFieldName="imagePublicId"
        initialUrl={sala?.imageUrl}
        initialPublicId={sala?.imagePublicId}
      />
      {state.error && <p className="text-sm text-danger">{state.error}</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Guardando..." : "Guardar"}
      </Button>
    </form>
  );
}
