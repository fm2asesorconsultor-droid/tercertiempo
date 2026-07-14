import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CoworkStatForm } from "../CoworkStatForm";
import { updateCoworkStatAction } from "../actions";

export default async function EditCoworkStatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const stat = await prisma.coworkStat.findUnique({ where: { id: Number(id) } });
  if (!stat) notFound();

  const action = updateCoworkStatAction.bind(null, stat.id);

  return (
    <div>
      <h1 className="mb-6 font-title text-2xl font-black">Editar estadística</h1>
      <CoworkStatForm stat={stat} action={action} />
    </div>
  );
}
