"use server";

import { requireAdmin } from "@/lib/auth/dal";
import { cloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";

/**
 * Best-effort delete of a Cloudinary asset. Callers are responsible for only
 * invoking this AFTER the corresponding DB write has durably succeeded, so a
 * failed upload/replace never orphans-deletes a still-referenced image.
 */
export async function deleteImageAction(publicId: string | null | undefined): Promise<void> {
  await requireAdmin();

  if (!publicId || !isCloudinaryConfigured()) return;

  try {
    await cloudinary.uploader.destroy(publicId);
  } catch {
    // Non-fatal: an orphaned Cloudinary asset is a cost/cleanup issue, not a
    // correctness issue for the site.
  }
}
