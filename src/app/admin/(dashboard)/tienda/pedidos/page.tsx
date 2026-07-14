import { prisma } from "@/lib/prisma";
import { DataTable } from "@/components/admin/DataTable";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { updateProductOrderStatusAction } from "./actions";

const STATUS_OPTIONS = [
  { value: "PENDING" as const, label: "Pendiente" },
  { value: "CONFIRMED" as const, label: "Confirmado" },
  { value: "READY" as const, label: "Listo para recoger" },
  { value: "CANCELLED" as const, label: "Cancelado" },
];

const PICKUP_LABEL: Record<string, string> = {
  TODAY: "Hoy",
  TOMORROW: "Mañana",
  WEEKEND: "Fin de semana",
};

export default async function ProductOrdersPage() {
  const orders = await prisma.productOrder.findMany({
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="mb-6 font-title text-2xl font-black">Pedidos de tienda</h1>
      <DataTable
        items={orders}
        keyFor={(o) => o.id}
        emptyMessage="No hay pedidos todavía."
        columns={[
          { header: "Código", cell: (o) => o.confirmationCode },
          { header: "Producto", cell: (o) => o.product.name },
          { header: "Talla", cell: (o) => o.size },
          { header: "Personalización", cell: (o) => (o.customName ? `${o.customName} #${o.customNumber ?? "-"}` : "—") },
          { header: "Recogida", cell: (o) => PICKUP_LABEL[o.pickupWindow] },
          { header: "Cliente", cell: (o) => `${o.customerName} · ${o.customerPhone}` },
          {
            header: "Estado",
            cell: (o) => (
              <StatusSelect id={o.id} value={o.status} options={STATUS_OPTIONS} action={updateProductOrderStatusAction} />
            ),
          },
        ]}
      />
    </div>
  );
}
