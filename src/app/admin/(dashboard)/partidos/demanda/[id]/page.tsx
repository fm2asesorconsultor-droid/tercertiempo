import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { MatchDemandForm } from "../MatchDemandForm";
import { updateMatchDemandAction } from "../actions";

export default async function EditMatchDemandPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const day = await prisma.matchDemandDay.findUnique({ where: { id: Number(id) } });
  if (!day) notFound();

  const action = updateMatchDemandAction.bind(null, day.id);

  return (
    <div>
      <h1 className="mb-6 font-title text-2xl font-black">Editar fecha</h1>
      <MatchDemandForm day={day} action={action} />
    </div>
  );
}
