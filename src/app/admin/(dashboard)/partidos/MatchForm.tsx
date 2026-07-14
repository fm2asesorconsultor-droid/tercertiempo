"use client";

import { useActionState } from "react";
import type { Match, Team } from "@/generated/prisma/client";
import type { MatchFormState } from "./actions";
import { FormField } from "@/components/admin/FormField";
import { SelectField } from "@/components/admin/SelectField";
import { Button } from "@/components/ui/Button";

const STATUS_OPTIONS = [
  { value: "UPCOMING", label: "Próximo" },
  { value: "LIVE", label: "En vivo" },
  { value: "FINISHED", label: "Finalizado" },
];

const initialState: MatchFormState = {};

function toDatetimeLocal(date?: Date | string): string {
  if (!date) return "";
  const d = new Date(date);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

type Props = {
  match?: Match;
  teams: Team[];
  action: (prevState: MatchFormState, formData: FormData) => Promise<MatchFormState>;
};

export function MatchForm({ match, teams, action }: Props) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const teamOptions = teams.map((t) => ({ value: String(t.id), label: t.name }));

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <SelectField label="Equipo local" name="homeTeamId" defaultValue={String(match?.homeTeamId ?? teams[0]?.id ?? "")} options={teamOptions} required />
        <SelectField label="Equipo visitante" name="awayTeamId" defaultValue={String(match?.awayTeamId ?? teams[1]?.id ?? "")} options={teamOptions} required />
      </div>
      <FormField label="Competición" name="competition" defaultValue={match?.competition} required />
      <FormField label="Fecha y hora" name="kickoffAt" type="datetime-local" defaultValue={toDatetimeLocal(match?.kickoffAt)} required />
      <SelectField label="Estado" name="status" defaultValue={match?.status ?? "UPCOMING"} options={STATUS_OPTIONS} required />
      <div className="grid grid-cols-3 gap-3">
        <FormField label="Goles local" name="homeScore" type="number" defaultValue={match?.homeScore ?? undefined} />
        <FormField label="Goles visitante" name="awayScore" type="number" defaultValue={match?.awayScore ?? undefined} />
        <FormField label="Minuto" name="clockMinute" type="number" defaultValue={match?.clockMinute ?? undefined} />
      </div>
      <FormField label="Hype (0-100)" name="hype" type="number" defaultValue={match?.hype ?? 0} />

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm text-text-secondary">
          <input type="checkbox" name="isFeatured" defaultChecked={match?.isFeatured ?? false} className="h-4 w-4 rounded border-border-default" />
          Partido destacado
        </label>
        <label className="flex items-center gap-2 text-sm text-text-secondary">
          <input type="checkbox" name="isVIP" defaultChecked={match?.isVIP ?? false} className="h-4 w-4 rounded border-border-default" />
          VIP disponible
        </label>
        <label className="flex items-center gap-2 text-sm text-text-secondary">
          <input type="checkbox" name="showOnHome" defaultChecked={match?.showOnHome ?? false} className="h-4 w-4 rounded border-border-default" />
          Mostrar en la portada
        </label>
      </div>

      {state.error && <p className="text-sm text-danger">{state.error}</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Guardando..." : "Guardar"}
      </Button>
    </form>
  );
}
