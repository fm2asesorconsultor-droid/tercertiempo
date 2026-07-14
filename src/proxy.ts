import { NextRequest, NextResponse } from "next/server";
import { decryptSession, SESSION_COOKIE_NAME } from "@/lib/auth/session";

/**
 * Optimistic-only check: verifies the session cookie's JWT signature/expiry
 * with no database call, and redirects to /admin/login if missing/invalid.
 * This is NOT the real authorization boundary — every admin Server Action
 * and page independently calls requireAdmin() (src/lib/auth/dal.ts), which
 * also re-validates sessionVersion against the DB. A matcher gap here would
 * not, by itself, grant access to a mutation.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const payload = await decryptSession(token);

  if (!payload) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
