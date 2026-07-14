import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DataTable } from "@/components/admin/DataTable";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { Button } from "@/components/ui/Button";
import { deleteQuoteExtraAction } from "./actions";

const formatCOP = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

export default async function QuoteExtrasPage() {
  const extras = await prisma.quoteExtra.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-title text-2xl font-black">Extras del cotizador B2B</h1>
        <Button asChild>
          <Link href="/admin/cowork/extras/nuevo">Nuevo extra</Link>
        </Button>
      </div>
      <DataTable
        items={extras}
        keyFor={(e) => e.id}
        emptyMessage="No hay extras todavía."
        columns={[
          { header: "Orden", cell: (e) => e.order },
          { header: "Nombre", cell: (e) => e.label },
          { header: "Precio", cell: (e) => formatCOP.format(e.price) },
          {
            header: "Acciones",
            cell: (e) => (
              <div className="flex items-center gap-4">
                <Link href={`/admin/cowork/extras/${e.id}`} className="text-sm text-accent-primary hover:underline">
                  Editar
                </Link>
                <ConfirmDeleteButton action={deleteQuoteExtraAction.bind(null, e.id)} />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
