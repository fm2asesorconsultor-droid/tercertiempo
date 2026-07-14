import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EventTypeForm } from "../EventTypeForm";
import { updateEventTypeAction } from "../actions";

export default async function EditEventTypePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const eventType = await prisma.eventType.findUnique({ where: { id: Number(id) } });
  if (!eventType) notFound();

  const action = updateEventTypeAction.bind(null, eventType.id);

  return (
    <div>
      <h1 className="mb-6 font-title text-2xl font-black">Editar tipo de evento</h1>
      <EventTypeForm eventType={eventType} action={action} />
    </div>
  );
}
