import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DataTable } from "@/components/admin/DataTable";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { Button } from "@/components/ui/Button";
import { deleteGalleryImageAction } from "./actions";

export default async function GalleryImagesPage() {
  const images = await prisma.galleryImage.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-title text-2xl font-black">Galería</h1>
        <Button asChild>
          <Link href="/admin/contenido/galeria/nueva">Nueva imagen</Link>
        </Button>
      </div>
      <DataTable
        items={images}
        keyFor={(img) => img.id}
        emptyMessage="No hay imágenes todavía."
        columns={[
          { header: "Orden", cell: (img) => img.order },
          { header: "Título", cell: (img) => img.title },
          { header: "Categoría", cell: (img) => img.category ?? "— (solo portada)" },
          { header: "En portada", cell: (img) => (img.featuredOnHome ? "Sí" : "No") },
          {
            header: "Acciones",
            cell: (img) => (
              <div className="flex items-center gap-4">
                <Link href={`/admin/contenido/galeria/${img.id}`} className="text-sm text-accent-primary hover:underline">
                  Editar
                </Link>
                <ConfirmDeleteButton action={deleteGalleryImageAction.bind(null, img.id)} />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
