"use client";

import { useActionState } from "react";
import type { CoworkStat } from "@/generated/prisma/client";
import type { CoworkStatFormState } from "./actions";
import { FormField } from "@/components/admin/FormField";
import { Button } from "@/components/ui/Button";

const initialState: CoworkStatFormState = {};

type Props = {
  stat?: CoworkStat;
  action: (prevState: CoworkStatFormState, formData: FormData) => Promise<CoworkStatFormState>;
};

export function CoworkStatForm({ stat, action }: Props) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <FormField label="Valor (ej: 60+, 2, 85&quot;, 100%)" name="value" defaultValue={stat?.value} required />
      <FormField label="Etiqueta" name="label" defaultValue={stat?.label} required />
      <FormField label="Orden" name="order" type="number" defaultValue={stat?.order ?? 0} />
      {state.error && <p className="text-sm text-danger">{state.error}</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Guardando..." : "Guardar"}
      </Button>
    </form>
  );
}
