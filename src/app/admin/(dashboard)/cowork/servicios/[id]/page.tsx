import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ConsultingServiceForm } from "../ConsultingServiceForm";
import { updateConsultingServiceAction } from "../actions";

export default async function EditConsultingServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = await prisma.consultingService.findUnique({ where: { id: Number(id) } });
  if (!service) notFound();

  const action = updateConsultingServiceAction.bind(null, service.id);

  return (
    <div>
      <h1 className="mb-6 font-title text-2xl font-black">Editar servicio</h1>
      <ConsultingServiceForm service={service} action={action} />
    </div>
  );
}
