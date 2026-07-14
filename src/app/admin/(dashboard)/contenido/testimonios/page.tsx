import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DataTable } from "@/components/admin/DataTable";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { Button } from "@/components/ui/Button";
import { deleteTestimonialAction } from "./actions";

export default async function TestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-title text-2xl font-black">Testimonios</h1>
        <Button asChild>
          <Link href="/admin/contenido/testimonios/nuevo">Nuevo testimonio</Link>
        </Button>
      </div>
      <DataTable
        items={testimonials}
        keyFor={(t) => t.id}
        emptyMessage="No hay testimonios todavía."
        columns={[
          { header: "Orden", cell: (t) => t.order },
          { header: "Nombre", cell: (t) => t.name },
          { header: "Calificación", cell: (t) => "★".repeat(t.rating) },
          { header: "Publicado", cell: (t) => (t.published ? "Sí" : "No") },
          {
            header: "Acciones",
            cell: (t) => (
              <div className="flex items-center gap-4">
                <Link href={`/admin/contenido/testimonios/${t.id}`} className="text-sm text-accent-primary hover:underline">
                  Editar
                </Link>
                <ConfirmDeleteButton action={deleteTestimonialAction.bind(null, t.id)} />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
