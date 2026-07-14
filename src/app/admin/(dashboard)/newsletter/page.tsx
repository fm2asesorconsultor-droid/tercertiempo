import { prisma } from "@/lib/prisma";
import { DataTable } from "@/components/admin/DataTable";

const SOURCE_LABEL: Record<string, string> = {
  FOOTER: "Pie de página",
  NEWSLETTER_SECTION: "Sección newsletter",
};

export default async function NewsletterSubscribersPage() {
  const subscribers = await prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="mb-6 font-title text-2xl font-black">Suscriptores del newsletter</h1>
      <DataTable
        items={subscribers}
        keyFor={(s) => s.id}
        emptyMessage="No hay suscriptores todavía."
        columns={[
          { header: "Correo", cell: (s) => s.email },
          { header: "Origen", cell: (s) => SOURCE_LABEL[s.source] },
          { header: "Fecha", cell: (s) => new Date(s.createdAt).toLocaleString("es-CO") },
        ]}
      />
    </div>
  );
}
