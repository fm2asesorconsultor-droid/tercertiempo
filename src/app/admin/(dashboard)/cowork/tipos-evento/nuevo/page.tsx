import { EventTypeForm } from "../EventTypeForm";
import { createEventTypeAction } from "../actions";

export default function NewEventTypePage() {
  return (
    <div>
      <h1 className="mb-6 font-title text-2xl font-black">Nuevo tipo de evento</h1>
      <EventTypeForm action={createEventTypeAction} />
    </div>
  );
}
