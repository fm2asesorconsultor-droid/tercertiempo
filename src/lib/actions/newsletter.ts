"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";

export type NewsletterFormState = { error?: string; success?: boolean };

const schema = z.object({
  email: z.string().email("Correo inválido."),
});

export async function subscribeAction(
  source: "FOOTER" | "NEWSLETTER_SECTION",
  _prevState: NewsletterFormState,
  formData: FormData
): Promise<NewsletterFormState> {
  const parsed = schema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Correo inválido." };
  }

  try {
    await prisma.newsletterSubscriber.upsert({
      where: { email: parsed.data.email },
      update: {},
      create: { email: parsed.data.email, source },
    });
    return { success: true };
  } catch (error) {
    console.error("Error suscribiendo al newsletter:", error);
    return { error: "No pudimos procesar tu suscripción. Intenta de nuevo." };
  }
}
