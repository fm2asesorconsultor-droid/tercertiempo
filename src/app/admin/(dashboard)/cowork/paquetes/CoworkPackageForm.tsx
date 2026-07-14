"use client";

import { useActionState } from "react";
import type { CoworkPackage, CoworkPackageFeature } from "@/generated/prisma/client";
import type { CoworkPackageFormState } from "./actions";
import { FormField } from "@/components/admin/FormField";
import { TextAreaField } from "@/components/admin/TextAreaField";
import { SelectField } from "@/components/admin/SelectField";
import { Button } from "@/components/ui/Button";

const THEME_OPTIONS = [
  { value: "ZINC", label: "Neutro (zinc)" },
  { value: "ACCENT", label: "Acento (naranja, destacado)" },
];

const initialState: CoworkPackageFormState = {};

type Props = {
  pkg?: CoworkPackage & { features: CoworkPackageFeature[] };
  action: (prevState: CoworkPackageFormState, formData: FormData) => Promise<CoworkPackageFormState>;
};

export function CoworkPackageForm({ pkg, action }: Props) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <FormField label="Slug (identificador único, ej: tiempo-completo)" name="slug" defaultValue={pkg?.slug} required />
      <FormField label="Ícono (clave lucide, ej: trophy)" name="iconKey" defaultValue={pkg?.iconKey} required />
      <FormField label="Nombre" name="name" defaultValue={pkg?.name} required />
      <FormField label="Subtítulo" name="subtitle" defaultValue={pkg?.subtitle} required />
      <FormField label="Precio (COP, solo número)" name="price" type="number" defaultValue={pkg?.price ?? 0} required />
      <SelectField label="Tema visual" name="theme" defaultValue={pkg?.theme ?? "ZINC"} options={THEME_OPTIONS} required />
      <FormField label="Texto del botón" name="ctaLabel" defaultValue={pkg?.ctaLabel} required />
      <TextAreaField
        label="Características (una por línea)"
        name="features"
        defaultValue={pkg?.features?.map((f) => f.text).join("\n")}
        rows={6}
      />
      <label className="flex items-center gap-2 text-sm text-text-secondary">
        <input type="checkbox" name="popular" defaultChecked={pkg?.popular ?? false} className="h-4 w-4 rounded border-border-default" />
        Marcar como &quot;Más popular&quot;
      </label>
      <FormField label="Orden" name="order" type="number" defaultValue={pkg?.order ?? 0} />
      {state.error && <p className="text-sm text-danger">{state.error}</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Guardando..." : "Guardar"}
      </Button>
    </form>
  );
}
