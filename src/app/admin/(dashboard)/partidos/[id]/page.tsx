import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { MatchForm } from "../MatchForm";
import { updateMatchAction } from "../actions";

export default async function EditMatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [match, teams] = await Promise.all([
    prisma.match.findUnique({ where: { id: Number(id) } }),
    prisma.team.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!match) notFound();

  const action = updateMatchAction.bind(null, match.id);

  return (
    <div>
      <h1 className="mb-6 font-title text-2xl font-black">Editar partido</h1>
      <MatchForm match={match} teams={teams} action={action} />
    </div>
  );
}
