"use client";

import { useActionState } from "react";
import type { Testimonial } from "@/generated/prisma/client";
import type { TestimonialFormState } from "./actions";
import { FormField } from "@/components/admin/FormField";
import { TextAreaField } from "@/components/admin/TextAreaField";
import { Button } from "@/components/ui/Button";

const initialState: TestimonialFormState = {};

type Props = {
  testimonial?: Testimonial;
  action: (prevState: TestimonialFormState, formData: FormData) => Promise<TestimonialFormState>;
};

export function TestimonialForm({ testimonial, action }: Props) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <FormField label="Nombre" name="name" defaultValue={testimonial?.name} required />
      <TextAreaField label="Testimonio" name="text" defaultValue={testimonial?.text} rows={3} required />
      <FormField label="Calificación (1-5)" name="rating" type="number" defaultValue={testimonial?.rating ?? 5} required />
      <div className="flex items-center gap-2">
        <input
          id="published"
          name="published"
          type="checkbox"
          defaultChecked={testimonial?.published ?? true}
          className="h-4 w-4 rounded border-border-default"
        />
        <label htmlFor="published" className="text-sm text-text-secondary">
          Publicado (visible en el sitio)
        </label>
      </div>
      <FormField label="Orden" name="order" type="number" defaultValue={testimonial?.order ?? 0} />
      {state.error && <p className="text-sm text-danger">{state.error}</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Guardando..." : "Guardar"}
      </Button>
    </form>
  );
}
