"use client";

import { useActionState } from "react";
import type { SiteSettings } from "@/generated/prisma/client";
import { updateSiteSettingsAction, type SiteSettingsFormState } from "./actions";
import { FormField } from "@/components/admin/FormField";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { Button } from "@/components/ui/Button";
import type { ScheduleEntry } from "@/lib/data/site-settings";

const SCHEDULE_ROWS = 6;
const initialState: SiteSettingsFormState = {};

function parseSchedule(value: unknown): ScheduleEntry[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (row): row is ScheduleEntry =>
      typeof row === "object" && row !== null && "day" in row && "hours" in row
  );
}

export function SiteSettingsForm({ settings }: { settings: SiteSettings | null }) {
  const [state, formAction, isPending] = useActionState(updateSiteSettingsAction, initialState);
  const schedule = parseSchedule(settings?.schedule);
  const rows = Array.from({ length: SCHEDULE_ROWS }, (_, i) => schedule[i] ?? { day: "", hours: "" });

  return (
    <form action={formAction} className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">Contacto</h2>
        <FormField
          label="Número de WhatsApp (sin +, formato wa.me, ej: 573001234567)"
          name="whatsappNumber"
          defaultValue={settings?.whatsappNumber}
          required
        />
        <FormField
          label="Teléfono para llamadas (con +, ej: +573001234567)"
          name="contactPhone"
          defaultValue={settings?.contactPhone}
          required
        />
        <FormField label="Correo de contacto" name="contactEmail" type="email" defaultValue={settings?.contactEmail} required />
        <FormField label="Dirección" name="address" defaultValue={settings?.address} required />
        <FormField label="URL embed de Google Maps" name="mapsEmbedUrl" defaultValue={settings?.mapsEmbedUrl} required />
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">Redes sociales</h2>
        <FormField label="Instagram (URL completa)" name="instagramUrl" defaultValue={settings?.instagramUrl} placeholder="https://instagram.com/tercertiempo" />
        <FormField label="Facebook (URL completa)" name="facebookUrl" defaultValue={settings?.facebookUrl} placeholder="https://facebook.com/tercertiempo" />
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">Logo</h2>
        <ImageUploadField
          label="Logo del sitio"
          urlFieldName="logoUrl"
          publicIdFieldName="logoPublicId"
          initialUrl={settings?.logoUrl}
          initialPublicId={settings?.logoPublicId}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">Horario</h2>
        <p className="text-xs text-text-muted">Deja una fila vacía (día y horas) si no la necesitas.</p>
        <div className="space-y-3">
          {rows.map((row, i) => (
            <div key={i} className="grid grid-cols-2 gap-3">
              <FormField label={`Día ${i + 1}`} name={`scheduleDay${i}`} defaultValue={row.day} />
              <FormField label={`Horas ${i + 1}`} name={`scheduleHours${i}`} defaultValue={row.hours} />
            </div>
          ))}
        </div>
      </section>

      {state.error && <p className="text-sm text-danger">{state.error}</p>}
      {state.success && <p className="text-sm text-success">Cambios guardados.</p>}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Guardando..." : "Guardar cambios"}
      </Button>
    </form>
  );
}
