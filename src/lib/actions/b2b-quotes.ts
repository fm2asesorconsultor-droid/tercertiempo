"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendConfirmationEmail } from "@/lib/resend";
import { getSiteSettings } from "@/lib/data/site-settings";

export type B2BQuoteResult =
  | { ok: true; total: number }
  | { ok: false; error: string };

const schema = z.object({
  packageId: z.coerce.number().int(),
  eventType: z.string().min(1, "Selecciona el tipo de evento."),
  participants: z.coerce.number().int().min(1),
  extraIds: z.array(z.coerce.number().int()).default([]),
  companyName: z.string().min(1, "El nombre de la empresa es obligatorio."),
  customerName: z.string().min(1, "Tu nombre es obligatorio."),
  customerPhone: z.string().min(5, "Teléfono inválido."),
  customerEmail: z
    .string()
    .optional()
    .transform((v) => (v && v.trim() ? v.trim() : undefined))
    .refine((v) => v === undefined || z.string().email().safeParse(v).success, {
      message: "Correo inválido.",
    }),
  preferredDate: z.string().optional(),
  message: z.string().optional(),
});

export async function createB2BQuoteAction(formData: FormData): Promise<B2BQuoteResult> {
  const extraIds = formData.getAll("extraIds").map((v) => Number(v));

  const parsed = schema.safeParse({
    packageId: formData.get("packageId"),
    eventType: formData.get("eventType"),
    participants: formData.get("participants"),
    extraIds,
    companyName: formData.get("companyName"),
    customerName: formData.get("customerName"),
    customerPhone: formData.get("customerPhone"),
    customerEmail: formData.get("customerEmail"),
    preferredDate: formData.get("preferredDate"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const pkg = await prisma.coworkPackage.findUnique({ where: { id: parsed.data.packageId } });
  if (!pkg) return { ok: false, error: "El paquete seleccionado ya no existe." };

  const extras = await prisma.quoteExtra.findMany({ where: { id: { in: parsed.data.extraIds } } });

  // Server-computed total — never trust the client's number.
  const participantSurcharge =
    parsed.data.participants > 30 ? Math.floor((parsed.data.participants - 30) / 10) * 50000 : 0;
  const extrasTotal = extras.reduce((sum, e) => sum + e.price, 0);
  const total = pkg.price + participantSurcharge + extrasTotal;

  try {
    await prisma.b2BQuote.create({
      data: {
        packageId: pkg.id,
        packageNameSnapshot: pkg.name,
        packageBasePriceSnapshot: pkg.price,
        eventType: parsed.data.eventType,
        participants: parsed.data.participants,
        selectedExtras: extras.map((e) => ({ id: e.id, label: e.label, price: e.price })),
        computedTotal: total,
        companyName: parsed.data.companyName,
        customerName: parsed.data.customerName,
        customerPhone: parsed.data.customerPhone,
        customerEmail: parsed.data.customerEmail,
        preferredDate: parsed.data.preferredDate ? new Date(`${parsed.data.preferredDate}T00:00:00`) : null,
        message: parsed.data.message || null,
      },
    });

    if (parsed.data.customerEmail) {
      const settings = await getSiteSettings();
      const formatCOP = (n: number) =>
        new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);
      await sendConfirmationEmail({
        to: parsed.data.customerEmail,
        subject: `Cotización recibida — ${pkg.name}`,
        html: `
          <p>Hola ${parsed.data.customerName},</p>
          <p>Recibimos tu solicitud de cotización para <strong>${parsed.data.companyName}</strong>.</p>
          <p>Paquete: ${pkg.name}</p>
          <p>Participantes: ${parsed.data.participants}</p>
          <p>Presupuesto estimado: <strong>${formatCOP(total)}</strong></p>
          <p>Nos pondremos en contacto pronto. ¿Dudas? Escríbenos: https://wa.me/${settings.whatsappNumber}</p>
        `,
      });
    }

    return { ok: true, total };
  } catch (error) {
    console.error("Error creando cotización B2B:", error);
    return { ok: false, error: "No pudimos enviar tu cotización. Intenta de nuevo." };
  }
}
