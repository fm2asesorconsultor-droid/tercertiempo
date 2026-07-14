import "server-only";
import { Resend } from "resend";

export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

let client: Resend | null = null;

function getClient(): Resend {
  if (!client) {
    client = new Resend(process.env.RESEND_API_KEY);
  }
  return client;
}

const FROM = "Tercer Tiempo <onboarding@resend.dev>";

/**
 * Feature-detected: silently no-ops if RESEND_API_KEY isn't set, so the
 * transactional flows still work (persist to DB) without email configured.
 * Never throws — a failed confirmation email must not fail the reservation.
 */
export async function sendConfirmationEmail(params: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  if (!isResendConfigured()) return;

  try {
    await getClient().emails.send({
      from: FROM,
      to: params.to,
      subject: params.subject,
      html: params.html,
    });
  } catch (error) {
    console.error("Error enviando email de confirmación:", error);
  }
}
