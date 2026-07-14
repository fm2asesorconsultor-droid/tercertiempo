"use client";

import { useActionState } from "react";
import type { Zone } from "@/generated/prisma/client";
import type { ZoneFormState } from "./actions";
import { FormField } from "@/components/admin/FormField";
import { TextAreaField } from "@/components/admin/TextAreaField";
import { Button } from "@/components/ui/Button";

const initialState: ZoneFormState = {};

type Props = {
  zone: Zone;
  action: (prevState: ZoneFormState, formData: FormData) => Promise<ZoneFormState>;
};

export function ZoneForm({ zone, action }: Props) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <FormField label="Nombre" name="name" defaultValue={zone.name} required />
      <FormField label="Piso (1 o 2)" name="floor" type="number" defaultValue={zone.floor} required />
      <FormField label="Capacidad (texto libre)" name="capacityLabel" defaultValue={zone.capacityLabel} required />
      <FormField label="Precio (texto libre)" name="priceLabel" defaultValue={zone.priceLabel} required />
      <TextAreaField label="Descripción" name="description" defaultValue={zone.description} rows={3} required />
      {state.error && <p className="text-sm text-danger">{state.error}</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Guardando..." : "Guardar"}
      </Button>
    </form>
  );
}
