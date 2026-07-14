import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ZoneForm } from "../ZoneForm";
import { updateZoneAction } from "../actions";

export default async function EditZonePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const zone = await prisma.zone.findUnique({ where: { id: Number(id) } });
  if (!zone) notFound();

  const action = updateZoneAction.bind(null, zone.id);

  return (
    <div>
      <h1 className="mb-6 font-title text-2xl font-black">Editar zona: {zone.name}</h1>
      <ZoneForm zone={zone} action={action} />
    </div>
  );
}
