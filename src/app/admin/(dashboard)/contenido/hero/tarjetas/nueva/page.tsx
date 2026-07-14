import { ExperienceCardForm } from "../ExperienceCardForm";
import { createExperienceCardAction } from "../actions";

export default function NewExperienceCardPage() {
  return (
    <div>
      <h1 className="mb-6 font-title text-2xl font-black">Nueva tarjeta de experiencia</h1>
      <ExperienceCardForm action={createExperienceCardAction} />
    </div>
  );
}
