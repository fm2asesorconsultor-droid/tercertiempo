import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DataTable } from "@/components/admin/DataTable";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { Button } from "@/components/ui/Button";
import { deleteExperienceCardAction } from "./actions";

export default async function ExperienceCardsPage() {
  const cards = await prisma.experienceCard.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-title text-2xl font-black">Tarjetas de experiencia (Hero)</h1>
        <Button asChild>
          <Link href="/admin/contenido/hero/tarjetas/nueva">Nueva tarjeta</Link>
        </Button>
      </div>
      <DataTable
        items={cards}
        keyFor={(c) => c.id}
        emptyMessage="No hay tarjetas todavía."
        columns={[
          { header: "Orden", cell: (c) => c.order },
          { header: "Título", cell: (c) => c.title },
          { header: "Ícono", cell: (c) => c.iconKey },
          {
            header: "Acciones",
            cell: (c) => (
              <div className="flex items-center gap-4">
                <Link href={`/admin/contenido/hero/tarjetas/${c.id}`} className="text-sm text-accent-primary hover:underline">
                  Editar
                </Link>
                <ConfirmDeleteButton action={deleteExperienceCardAction.bind(null, c.id)} />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
