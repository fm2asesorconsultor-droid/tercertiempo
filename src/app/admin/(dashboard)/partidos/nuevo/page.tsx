import { prisma } from "@/lib/prisma";
import { MatchForm } from "../MatchForm";
import { createMatchAction } from "../actions";

export default async function NewMatchPage() {
  const teams = await prisma.team.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <h1 className="mb-6 font-title text-2xl font-black">Nuevo partido</h1>
      {teams.length < 2 ? (
        <p className="text-sm text-danger">Necesitas al menos 2 equipos creados antes de agregar un partido.</p>
      ) : (
        <MatchForm teams={teams} action={createMatchAction} />
      )}
    </div>
  );
}
