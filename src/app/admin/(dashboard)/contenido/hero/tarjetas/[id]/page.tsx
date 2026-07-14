import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ExperienceCardForm } from "../ExperienceCardForm";
import { updateExperienceCardAction } from "../actions";

export default async function EditExperienceCardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const card = await prisma.experienceCard.findUnique({ where: { id: Number(id) } });
  if (!card) notFound();

  const action = updateExperienceCardAction.bind(null, card.id);

  return (
    <div>
      <h1 className="mb-6 font-title text-2xl font-black">Editar tarjeta</h1>
      <ExperienceCardForm card={card} action={action} />
    </div>
  );
}
