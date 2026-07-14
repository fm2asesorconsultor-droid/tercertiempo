import { prisma } from "@/lib/prisma";
import { DataTable } from "@/components/admin/DataTable";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { updateReservationStatusAction } from "./actions";

const STATUS_OPTIONS = [
  { value: "PENDING" as const, label: "Pendiente" },
  { value: "CONFIRMED" as const, label: "Confirmada" },
  { value: "CANCELLED" as const, label: "Cancelada" },
];

const TYPE_LABEL: Record<string, string> = {
  MESA: "Mesa",
  SALA: "Sala VIP",
  PARTIDO: "Partido",
};

export default async function ReservationsPage() {
  const reservations = await prisma.reservation.findMany({
    include: { zone: true, salaVip: true, match: { include: { homeTeam: true, awayTeam: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="mb-6 font-title text-2xl font-black">Reservas</h1>
      <DataTable
        items={reservations}
        keyFor={(r) => r.id}
        emptyMessage="No hay reservas todavía."
        columns={[
          { header: "Código", cell: (r) => r.confirmationCode },
          { header: "Tipo", cell: (r) => TYPE_LABEL[r.type] },
          {
            header: "Lugar / Partido",
            cell: (r) =>
              r.zone?.name ?? r.salaVip?.name ?? (r.match ? `${r.match.homeTeam.name} vs ${r.match.awayTeam.name}` : "—"),
          },
          { header: "Fecha", cell: (r) => new Date(r.reservationDate).toLocaleString("es-CO") },
          { header: "Cliente", cell: (r) => `${r.customerName} · ${r.customerPhone}` },
          { header: "Personas", cell: (r) => r.partySize },
          {
            header: "Estado",
            cell: (r) => (
              <StatusSelect id={r.id} value={r.status} options={STATUS_OPTIONS} action={updateReservationStatusAction} />
            ),
          },
        ]}
      />
    </div>
  );
}
