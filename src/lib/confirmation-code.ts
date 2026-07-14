import "server-only";

function randomDigits(): string {
  return String(Math.floor(Math.random() * 9000) + 1000);
}

/**
 * Generates a confirmation code and retries on the rare @unique collision,
 * verified via `exists`. Never trust a client-supplied code — this is the
 * server-side source of truth.
 */
export async function generateConfirmationCode(exists: (code: string) => Promise<boolean>): Promise<string> {
  const year = new Date().getFullYear();
  for (let attempt = 0; attempt < 10; attempt++) {
    const code = `TT-${year}-${randomDigits()}`;
    if (!(await exists(code))) return code;
  }
  throw new Error("No se pudo generar un código de confirmación único.");
}
