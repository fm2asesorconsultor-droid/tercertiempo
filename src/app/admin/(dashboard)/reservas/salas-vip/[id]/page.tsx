import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SalaVipForm } from "../SalaVipForm";
import { updateSalaVipAction } from "../actions";

export default async function EditSalaVipPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sala = await prisma.salaVip.findUnique({ where: { id: Number(id) } });
  if (!sala) notFound();

  const action = updateSalaVipAction.bind(null, sala.id);

  return (
    <div>
      <h1 className="mb-6 font-title text-2xl font-black">Editar sala VIP</h1>
      <SalaVipForm sala={sala} action={action} />
    </div>
  );
}
