"use client";

import { useActionState } from "react";
import type { Team } from "@/generated/prisma/client";
import type { TeamFormState } from "./actions";
import { FormField } from "@/components/admin/FormField";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { Button } from "@/components/ui/Button";

const initialState: TeamFormState = {};

type Props = {
  team?: Team;
  action: (prevState: TeamFormState, formData: FormData) => Promise<TeamFormState>;
};

export function TeamForm({ team, action }: Props) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <FormField label="Nombre" name="name" defaultValue={team?.name} required />
      <ImageUploadField
        label="Logo"
        urlFieldName="logoUrl"
        publicIdFieldName="logoPublicId"
        initialUrl={team?.logoUrl}
        initialPublicId={team?.logoPublicId}
      />
      {state.error && <p className="text-sm text-danger">{state.error}</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Guardando..." : "Guardar"}
      </Button>
    </form>
  );
}
