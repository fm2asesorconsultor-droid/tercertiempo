"use client";

import { useActionState } from "react";
import type { QuoteExtra } from "@/generated/prisma/client";
import type { QuoteExtraFormState } from "./actions";
import { FormField } from "@/components/admin/FormField";
import { Button } from "@/components/ui/Button";

const initialState: QuoteExtraFormState = {};

type Props = {
  extra?: QuoteExtra;
  action: (prevState: QuoteExtraFormState, formData: FormData) => Promise<QuoteExtraFormState>;
};

export function QuoteExtraForm({ extra, action }: Props) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <FormField label="Nombre" name="label" defaultValue={extra?.label} required />
      <FormField label="Precio (COP, solo número)" name="price" type="number" defaultValue={extra?.price ?? 0} required />
      <FormField label="Ícono (clave, ej: catering)" name="iconKey" defaultValue={extra?.iconKey} required />
      <FormField label="Orden" name="order" type="number" defaultValue={extra?.order ?? 0} />
      {state.error && <p className="text-sm text-danger">{state.error}</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Guardando..." : "Guardar"}
      </Button>
    </form>
  );
}
