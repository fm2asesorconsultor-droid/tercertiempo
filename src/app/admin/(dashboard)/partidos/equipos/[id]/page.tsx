import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TeamForm } from "../TeamForm";
import { updateTeamAction } from "../actions";

export default async function EditTeamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const team = await prisma.team.findUnique({ where: { id: Number(id) } });
  if (!team) notFound();

  const action = updateTeamAction.bind(null, team.id);

  return (
    <div>
      <h1 className="mb-6 font-title text-2xl font-black">Editar equipo</h1>
      <TeamForm team={team} action={action} />
    </div>
  );
}
