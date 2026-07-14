import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CoworkPackageForm } from "../CoworkPackageForm";
import { updateCoworkPackageAction } from "../actions";

export default async function EditCoworkPackagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pkg = await prisma.coworkPackage.findUnique({
    where: { id: Number(id) },
    include: { features: { orderBy: { order: "asc" } } },
  });
  if (!pkg) notFound();

  const action = updateCoworkPackageAction.bind(null, pkg.id);

  return (
    <div>
      <h1 className="mb-6 font-title text-2xl font-black">Editar paquete</h1>
      <CoworkPackageForm pkg={pkg} action={action} />
    </div>
  );
}
