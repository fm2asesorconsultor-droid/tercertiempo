import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [pendingReservations, pendingOrders, newQuotes, subscribers] = await Promise.all([
    prisma.reservation.count({ where: { status: "PENDING" } }),
    prisma.productOrder.count({ where: { status: "PENDING" } }),
    prisma.b2BQuote.count({ where: { status: "NEW" } }),
    prisma.newsletterSubscriber.count(),
  ]);

  const stats = [
    { label: "Reservas pendientes", value: pendingReservations },
    { label: "Pedidos pendientes", value: pendingOrders },
    { label: "Cotizaciones nuevas", value: newQuotes },
    { label: "Suscriptores newsletter", value: subscribers },
  ];

  return (
    <div>
      <h1 className="mb-6 font-title text-2xl font-black">Resumen</h1>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border-default bg-background-surface p-4"
          >
            <p className="text-3xl font-black text-accent-primary">{stat.value}</p>
            <p className="mt-1 text-sm text-text-secondary">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
