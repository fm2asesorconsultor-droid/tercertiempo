/**
 * Pure constants, no server-only imports — safe to import from Client
 * Components (unlike src/lib/data/gallery.ts, which pulls in Prisma/pg).
 */
export const HOME_BENTO_SPAN: Record<string, string> = {
  normal: "md:col-span-1 md:row-span-1",
  wide: "md:col-span-2 md:row-span-1",
  tall: "md:col-span-1 md:row-span-2",
  large: "md:col-span-2 md:row-span-2",
};

export const FULL_GALLERY_SPAN: Record<string, string> = {
  normal: "col-span-1 row-span-1",
  wide: "col-span-1 md:col-span-2 row-span-1",
  tall: "col-span-1 row-span-2",
  large: "col-span-1 md:col-span-2 row-span-2",
};
