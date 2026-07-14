import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { decryptSession, getSessionCookie } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export type AdminSession = {
  adminUserId: number;
};

/**
 * The real authorization boundary. The proxy only redirects optimistically
 * based on cookie presence; this re-verifies the JWT signature AND the
 * sessionVersion against the DB row, so a password rotation or explicit
 * revocation immediately invalidates any outstanding session tokens.
 */
export const verifySession = cache(async (): Promise<AdminSession | null> => {
  const token = await getSessionCookie();
  const payload = await decryptSession(token);
  if (!payload) return null;

  const user = await prisma.adminUser.findUnique({
    where: { id: payload.adminUserId },
    select: { sessionVersion: true },
  });

  if (!user || user.sessionVersion !== payload.sessionVersion) {
    return null;
  }

  return { adminUserId: payload.adminUserId };
});

export async function requireAdmin(): Promise<AdminSession> {
  const session = await verifySession();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
}
