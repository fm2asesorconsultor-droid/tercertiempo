import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "tt_admin_session";
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // 8 hours

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET no está definido en el entorno.");
  }
  return new TextEncoder().encode(secret);
}

export type SessionPayload = {
  adminUserId: number;
  sessionVersion: number;
  expiresAt: number;
};

async function encryptSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(payload.expiresAt / 1000))
    .sign(getSecretKey());
}

export async function decryptSession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), { algorithms: ["HS256"] });
    if (
      typeof payload.adminUserId !== "number" ||
      typeof payload.sessionVersion !== "number" ||
      typeof payload.expiresAt !== "number"
    ) {
      return null;
    }
    return {
      adminUserId: payload.adminUserId,
      sessionVersion: payload.sessionVersion,
      expiresAt: payload.expiresAt,
    };
  } catch {
    return null;
  }
}

export async function createSession(adminUserId: number, sessionVersion: number) {
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  const token = await encryptSession({ adminUserId, sessionVersion, expiresAt });
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    expires: new Date(expiresAt),
  });
}

export async function updateSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const payload = await decryptSession(token);
  if (!payload) return;

  const expiresAt = Date.now() + SESSION_DURATION_MS;
  const newToken = await encryptSession({ ...payload, expiresAt });
  cookieStore.set(COOKIE_NAME, newToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    expires: new Date(expiresAt),
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSessionCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value;
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
