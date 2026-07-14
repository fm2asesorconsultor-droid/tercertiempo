import { prisma } from "@/lib/prisma";
import { DataTable } from "@/components/admin/DataTable";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { updateB2BQuoteStatusAction } from "./actions";

const STATUS_OPTIONS = [
  { value: "NEW" as const, label: "Nueva" },
  { value: "CONTACTED" as const, label: "Contactada" },
  { value: "WON" as const, label: "Ganada" },
  { value: "LOST" as const, label: "Perdida" },
];

const formatCOP = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

export default async function B2BQuotesPage() {
  const quotes = await prisma.b2BQuote.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="mb-6 font-title text-2xl font-black">Cotizaciones B2B</h1>
      <DataTable
        items={quotes}
        keyFor={(q) => q.id}
        emptyMessage="No hay cotizaciones todavía."
        columns={[
          { header: "Empresa", cell: (q) => q.companyName },
          { header: "Contacto", cell: (q) => `${q.customerName} · ${q.customerPhone}` },
          { header: "Paquete", cell: (q) => q.packageNameSnapshot },
          { header: "Tipo de evento", cell: (q) => q.eventType },
          { header: "Participantes", cell: (q) => q.participants },
          { header: "Total estimado", cell: (q) => formatCOP.format(q.computedTotal) },
          { header: "Fecha", cell: (q) => new Date(q.createdAt).toLocaleDateString("es-CO") },
          {
            header: "Estado",
            cell: (q) => (
              <StatusSelect id={q.id} value={q.status} options={STATUS_OPTIONS} action={updateB2BQuoteStatusAction} />
            ),
          },
        ]}
      />
    </div>
  );
}
