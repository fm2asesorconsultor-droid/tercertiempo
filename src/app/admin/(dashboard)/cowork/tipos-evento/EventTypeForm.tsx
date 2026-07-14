"use client";

import { useActionState } from "react";
import type { EventType } from "@/generated/prisma/client";
import type { EventTypeFormState } from "./actions";
import { FormField } from "@/components/admin/FormField";
import { Button } from "@/components/ui/Button";

const initialState: EventTypeFormState = {};

type Props = {
  eventType?: EventType;
  action: (prevState: EventTypeFormState, formData: FormData) => Promise<EventTypeFormState>;
};

export function EventTypeForm({ eventType, action }: Props) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <FormField label="Nombre" name="label" defaultValue={eventType?.label} required />
      <FormField label="Orden" name="order" type="number" defaultValue={eventType?.order ?? 0} />
      {state.error && <p className="text-sm text-danger">{state.error}</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Guardando..." : "Guardar"}
      </Button>
    </form>
  );
}
