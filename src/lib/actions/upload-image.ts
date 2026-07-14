"use server";

import { requireAdmin } from "@/lib/auth/dal";
import { cloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";

export type UploadImageResult =
  | { ok: true; secureUrl: string; publicId: string }
  | { ok: false; error: string };

export async function uploadImageAction(formData: FormData): Promise<UploadImageResult> {
  await requireAdmin();

  if (!isCloudinaryConfigured()) {
    return {
      ok: false,
      error: "Cloudinary no está configurado. Define CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET.",
    };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "No se recibió ningún archivo." };
  }

  if (!file.type.startsWith("image/")) {
    return { ok: false, error: "El archivo debe ser una imagen." };
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "tercer-tiempo" },
        (error, result) => {
          if (error || !result) {
            reject(error ?? new Error("Cloudinary no devolvió resultado."));
            return;
          }
          resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    return { ok: true, secureUrl: result.secure_url, publicId: result.public_id };
  } catch {
    return { ok: false, error: "Falló la subida a Cloudinary. Intenta de nuevo." };
  }
}
