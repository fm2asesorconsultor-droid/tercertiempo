import { GalleryImageForm } from "../GalleryImageForm";
import { createGalleryImageAction } from "../actions";

export default function NewGalleryImagePage() {
  return (
    <div>
      <h1 className="mb-6 font-title text-2xl font-black">Nueva imagen de galería</h1>
      <GalleryImageForm action={createGalleryImageAction} />
    </div>
  );
}
