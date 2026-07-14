import "server-only";
import { prisma } from "@/lib/prisma";

/**
 * DB-backed (not in-memory) because Vercel serverless functions don't share
 * memory across invocations — an in-memory counter would silently not work
 * in production.
 */
export const MAX_FAILED_ATTEMPTS = 5;
export const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export function isLockedOut(user: { lockedUntil: Date | null }): boolean {
  return !!user.lockedUntil && user.lockedUntil.getTime() > Date.now();
}

export async function registerFailedAttempt(userId: number, currentAttempts: number) {
  const attempts = currentAttempts + 1;
  const shouldLock = attempts >= MAX_FAILED_ATTEMPTS;

  await prisma.adminUser.update({
    where: { id: userId },
    data: {
      failedLoginAttempts: shouldLock ? 0 : attempts,
      lockedUntil: shouldLock ? new Date(Date.now() + LOCKOUT_DURATION_MS) : null,
    },
  });
}

export async function resetFailedAttempts(userId: number) {
  await prisma.adminUser.update({
    where: { id: userId },
    data: { failedLoginAttempts: 0, lockedUntil: null },
  });
}
