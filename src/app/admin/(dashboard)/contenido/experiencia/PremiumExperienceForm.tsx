"use client";

import { useActionState } from "react";
import type { PremiumExperienceContent, PremiumBenefit } from "@/generated/prisma/client";
import { updatePremiumExperienceAction, type PremiumExperienceFormState } from "./actions";
import { FormField } from "@/components/admin/FormField";
import { TextAreaField } from "@/components/admin/TextAreaField";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { Button } from "@/components/ui/Button";

const initialState: PremiumExperienceFormState = {};
const BENEFIT_ROWS = 8;

type Props = {
  content: PremiumExperienceContent | null;
  benefits: PremiumBenefit[];
};

export function PremiumExperienceForm({ content, benefits }: Props) {
  const [state, formAction, isPending] = useActionState(updatePremiumExperienceAction, initialState);
  const rows = Array.from({ length: BENEFIT_ROWS }, (_, i) => benefits[i]?.text ?? "");

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <FormField label="Titular (blanco)" name="headline" defaultValue={content?.headline} required />
      <FormField label="Titular acentuado (naranja)" name="headlineAccent" defaultValue={content?.headlineAccent} required />
      <TextAreaField label="Descripción" name="body" defaultValue={content?.body} rows={4} required />
      <ImageUploadField
        label="Imagen"
        urlFieldName="imageUrl"
        publicIdFieldName="imagePublicId"
        initialUrl={content?.imageUrl}
        initialPublicId={content?.imagePublicId}
      />

      <div className="space-y-2">
        <p className="text-sm text-text-secondary">Beneficios (deja vacío para omitir una fila)</p>
        {rows.map((text, i) => (
          <FormField key={i} label={`Beneficio ${i + 1}`} name={`benefit${i}`} defaultValue={text} />
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
