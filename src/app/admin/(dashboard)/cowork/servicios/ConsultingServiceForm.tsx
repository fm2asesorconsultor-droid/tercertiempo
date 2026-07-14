"use client";

import { useActionState } from "react";
import type { ConsultingService } from "@/generated/prisma/client";
import type { ConsultingServiceFormState } from "./actions";
import { FormField } from "@/components/admin/FormField";
import { TextAreaField } from "@/components/admin/TextAreaField";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { Button } from "@/components/ui/Button";

const initialState: ConsultingServiceFormState = {};

type Props = {
  service?: ConsultingService;
  action: (prevState: ConsultingServiceFormState, formData: FormData) => Promise<ConsultingServiceFormState>;
};

export function ConsultingServiceForm({ service, action }: Props) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <FormField label="Nombre" name="name" defaultValue={service?.name} required />
      <FormField label="Etiqueta principal" name="tag" defaultValue={service?.tag} required />
      <FormField label="Etiqueta con emoji (ej: 🧩 Innovación)" name="tag2" defaultValue={service?.tag2} required />
      <TextAreaField label="Descripción" name="description" defaultValue={service?.description} rows={4} required />
      <ImageUploadField
        label="Imagen"
        urlFieldName="imageUrl"
        publicIdFieldName="imagePublicId"
        initialUrl={service?.imageUrl}
        initialPublicId={service?.imagePublicId}
      />
      <FormField label="Duración (texto libre, ej: 4 – 8 horas)" name="duration" defaultValue={service?.duration} required />
      <FormField label="Participantes (texto libre)" name="participants" defaultValue={service?.participants} required />
      <FormField label="Highlight destacado" name="highlight" defaultValue={service?.highlight} required />
      <FormField label="Orden" name="order" type="number" defaultValue={service?.order ?? 0} />
      {state.error && <p className="text-sm text-danger">{state.error}</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Guardando..." : "Guardar"}
      </Button>
    </form>
  );
}
