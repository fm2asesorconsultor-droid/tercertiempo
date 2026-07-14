"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { isLockedOut, registerFailedAttempt, resetFailedAttempts } from "@/lib/auth/rate-limit";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type LoginFormState = {
  error?: string;
};

const GENERIC_ERROR = "Correo o contraseña incorrectos.";

export async function loginAction(
  _prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: GENERIC_ERROR };
  }

  const { email, password } = parsed.data;
  const user = await prisma.adminUser.findUnique({ where: { email } });

  if (!user) {
    return { error: GENERIC_ERROR };
  }

  if (isLockedOut(user)) {
    return {
      error: "Cuenta bloqueada temporalmente por demasiados intentos fallidos. Intenta de nuevo en unos minutos.",
    };
  }

  const validPassword = await verifyPassword(password, user.passwordHash);

  if (!validPassword) {
    await registerFailedAttempt(user.id, user.failedLoginAttempts);
    return { error: GENERIC_ERROR };
  }

  await resetFailedAttempts(user.id);
  await createSession(user.id, user.sessionVersion);
  redirect("/admin");
}
