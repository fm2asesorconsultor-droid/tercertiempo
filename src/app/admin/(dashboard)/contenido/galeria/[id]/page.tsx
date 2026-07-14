import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { GalleryImageForm } from "../GalleryImageForm";
import { updateGalleryImageAction } from "../actions";

export default async function EditGalleryImagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const image = await prisma.galleryImage.findUnique({ where: { id: Number(id) } });
  if (!image) notFound();

  const action = updateGalleryImageAction.bind(null, image.id);

  return (
    <div>
      <h1 className="mb-6 font-title text-2xl font-black">Editar imagen</h1>
      <GalleryImageForm image={image} action={action} />
    </div>
  );
}
