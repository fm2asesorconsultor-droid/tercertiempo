"use client";

import { useActionState } from "react";
import type { HeroContent } from "@/generated/prisma/client";
import { updateHeroContentAction, type HeroContentFormState } from "./actions";
import { FormField } from "@/components/admin/FormField";
import { TextAreaField } from "@/components/admin/TextAreaField";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { Button } from "@/components/ui/Button";

const initialState: HeroContentFormState = {};

export function HeroContentForm({ hero }: { hero: HeroContent | null }) {
  const [state, formAction, isPending] = useActionState(updateHeroContentAction, initialState);

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <FormField label="Texto pequeño (eyebrow)" name="eyebrow" defaultValue={hero?.eyebrow} required />
      <FormField label="Titular" name="headline" defaultValue={hero?.headline} required />
      <TextAreaField label="Descripción" name="body" defaultValue={hero?.body} rows={3} required />
      <FormField label="Botón principal" name="ctaPrimaryLabel" defaultValue={hero?.ctaPrimaryLabel} required />
      <FormField label="Botón secundario" name="ctaSecondaryLabel" defaultValue={hero?.ctaSecondaryLabel} required />
      <ImageUploadField
        label="Imagen de fondo"
        urlFieldName="backgroundImageUrl"
        publicIdFieldName="backgroundImagePublicId"
        initialUrl={hero?.backgroundImageUrl}
        initialPublicId={hero?.backgroundImagePublicId}
      />
      {state.error && <p className="text-sm text-danger">{state.error}</p>}
      {state.success && <p className="text-sm text-success">Cambios guardados.</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Guardando..." : "Guardar cambios"}
      </Button>
    </form>
  );
}
