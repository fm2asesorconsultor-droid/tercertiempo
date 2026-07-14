"use client";

import { useActionState } from "react";
import type { MatchDemandDay } from "@/generated/prisma/client";
import type { MatchDemandFormState } from "./actions";
import { FormField } from "@/components/admin/FormField";
import { SelectField } from "@/components/admin/SelectField";
import { Button } from "@/components/ui/Button";

const DEMAND_OPTIONS = [
  { value: "HIGH", label: "Alta" },
  { value: "MID", label: "Media" },
  { value: "LOW", label: "Libre" },
];

const initialState: MatchDemandFormState = {};

function toDateInput(date?: Date | string): string {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
}

type Props = {
  day?: MatchDemandDay;
  action: (prevState: MatchDemandFormState, formData: FormData) => Promise<MatchDemandFormState>;
};

export function MatchDemandForm({ day, action }: Props) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <FormField label="Fecha" name="date" type="date" defaultValue={toDateInput(day?.date)} required />
      <FormField label="Partido (texto libre)" name="teamsLabel" defaultValue={day?.teamsLabel} required />
      <SelectField label="Demanda" name="demand" defaultValue={day?.demand ?? "MID"} options={DEMAND_OPTIONS} required />
      {state.error && <p className="text-sm text-danger">{state.error}</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Guardando..." : "Guardar"}
      </Button>
    </form>
  );
}
