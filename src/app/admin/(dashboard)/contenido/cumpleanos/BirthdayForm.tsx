"use client";

import { useActionState } from "react";
import type { BirthdayContent, BirthdayPerk } from "@/generated/prisma/client";
import { updateBirthdayAction, type BirthdayFormState } from "./actions";
import { FormField } from "@/components/admin/FormField";
import { TextAreaField } from "@/components/admin/TextAreaField";
import { SelectField } from "@/components/admin/SelectField";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { Button } from "@/components/ui/Button";

const ICON_OPTIONS = [
  { value: "beer", label: "Cerveza" },
  { value: "crown", label: "Corona" },
  { value: "gift", label: "Regalo" },
  { value: "party-popper", label: "Confeti" },
];

const initialState: BirthdayFormState = {};
const PERK_ROWS = 6;

type Props = {
  content: BirthdayContent | null;
  perks: BirthdayPerk[];
};

export function BirthdayForm({ content, perks }: Props) {
  const [state, formAction, isPending] = useActionState(updateBirthdayAction, initialState);
  const rows = Array.from({ length: PERK_ROWS }, (_, i) => perks[i] ?? { iconKey: "gift", text: "" });

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <FormField label="Texto pequeño (eyebrow)" name="eyebrow" defaultValue={content?.eyebrow} required />
      <FormField label="Titular (blanco)" name="headline" defaultValue={content?.headline} required />
      <FormField label="Titular acentuado (naranja)" name="headlineAccent" defaultValue={content?.headlineAccent} required />
      <TextAreaField label="Descripción" name="body" defaultValue={content?.body} rows={3} required />
      <FormField label="Texto del botón" name="ctaLabel" defaultValue={content?.ctaLabel} required />
      <ImageUploadField
        label="Imagen de fondo"
        urlFieldName="backgroundImageUrl"
        publicIdFieldName="backgroundImagePublicId"
        initialUrl={content?.backgroundImageUrl}
        initialPublicId={content?.backgroundImagePublicId}
      />

      <div className="space-y-3">
        <p className="text-sm text-text-secondary">Beneficios (deja el texto vacío para omitir una fila)</p>
        {rows.map((perk, i) => (
          <div key={i} className="grid grid-cols-[140px_1fr] gap-3">
            <SelectField label={`Ícono ${i + 1}`} name={`perkIcon${i}`} defaultValue={perk.iconKey} options={ICON_OPTIONS} />
            <FormField label={`Texto ${i + 1}`} name={`perkText${i}`} defaultValue={perk.text} />
          </div>
        ))}
      </div>

      {state.error && <p className="text-sm text-danger">{state.error}</p>}
      {state.success && <p className="text-sm text-success">Cambios guardados.</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Guardando..." : "Guardar cambios"}
      </Button>
    </form>
  );
}
