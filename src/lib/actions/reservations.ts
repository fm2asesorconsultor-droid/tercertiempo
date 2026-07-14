"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { generateConfirmationCode } from "@/lib/confirmation-code";
import { sendConfirmationEmail } from "@/lib/resend";
import { getSiteSettings } from "@/lib/data/site-settings";

export type ReservationResult =
  | { ok: true; confirmationCode: string }
  | { ok: false; error: string };

const baseFields = {
  customerName: z.string().min(1, "Tu nombre es obligatorio."),
  customerPhone: z.string().min(5, "Teléfono inválido."),
  customerEmail: z
    .string()
    .optional()
    .transform((v) => (v && v.trim() ? v.trim() : undefined))
    .refine((v) => v === undefined || z.string().email().safeParse(v).success, {
      message: "Correo inválido.",
    }),
  partySize: z.coerce.number().int().min(1, "Indica cuántas personas son."),
};

async function persistReservation(data: {
  type: "MESA" | "SALA" | "PARTIDO";
  zoneId?: number;
  salaVipId?: number;
  matchId?: number;
  salaPackage?: string;
  reservationDate: Date;
  partySize: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
}): Promise<ReservationResult> {
  try {
    const confirmationCode = await generateConfirmationCode(async (code) => {
      const existing = await prisma.reservation.findUnique({ where: { confirmationCode: code } });
      return existing !== null;
    });

    await prisma.reservation.create({ data: { ...data, confirmationCode } });

    if (data.customerEmail) {
      const settings = await getSiteSettings();
      await sendConfirmationEmail({
        to: data.customerEmail,
        subject: `Reserva confirmada — ${confirmationCode}`,
        html: `
          <p>Hola ${data.customerName},</p>
          <p>Tu reserva en <strong>Tercer Tiempo</strong> quedó registrada.</p>
          <p>Código de confirmación: <strong>${confirmationCode}</strong></p>
          <p>Fecha: ${data.reservationDate.toLocaleString("es-CO")}</p>
          <p>Personas: ${data.partySize}</p>
          <p>¿Dudas? Escríbenos por WhatsApp: https://wa.me/${settings.whatsappNumber}</p>
        `,
      });
    }

    return { ok: true, confirmationCode };
  } catch (error) {
    console.error("Error creando reserva:", error);
    return { ok: false, error: "No pudimos procesar tu reserva. Intenta de nuevo." };
  }
}

const mesaSchema = z.object({
  ...baseFields,
  zoneSlug: z.string().min(1, "Selecciona una zona."),
  date: z.string().min(1, "Selecciona una fecha."),
});

export async function createMesaReservationAction(formData: FormData): Promise<ReservationResult> {
  const parsed = mesaSchema.safeParse({
    customerName: formData.get("customerName"),
    customerPhone: formData.get("customerPhone"),
    customerEmail: formData.get("customerEmail"),
    partySize: formData.get("partySize"),
    zoneSlug: formData.get("zoneSlug"),
    date: formData.get("date"),
  });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos." };

  const zone = await prisma.zone.findUnique({ where: { slug: parsed.data.zoneSlug } });
  if (!zone) return { ok: false, error: "La zona seleccionada ya no existe." };

  return persistReservation({
    type: "MESA",
    zoneId: zone.id,
    reservationDate: new Date(`${parsed.data.date}T00:00:00`),
    partySize: parsed.data.partySize,
    customerName: parsed.data.customerName,
    customerPhone: parsed.data.customerPhone,
    customerEmail: parsed.data.customerEmail,
  });
}

const partidoSchema = z.object({
  ...baseFields,
  zoneSlug: z.string().min(1, "Selecciona una zona."),
  matchId: z.coerce.number().int(),
});

export async function createPartidoReservationAction(formData: FormData): Promise<ReservationResult> {
  const parsed = partidoSchema.safeParse({
    customerName: formData.get("customerName"),
    customerPhone: formData.get("customerPhone"),
    customerEmail: formData.get("customerEmail"),
    partySize: formData.get("partySize"),
    zoneSlug: formData.get("zoneSlug"),
    matchId: formData.get("matchId"),
  });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos." };

  const [zone, match] = await Promise.all([
    prisma.zone.findUnique({ where: { slug: parsed.data.zoneSlug } }),
    prisma.match.findUnique({ where: { id: parsed.data.matchId } }),
  ]);
  if (!zone) return { ok: false, error: "La zona seleccionada ya no existe." };
  if (!match) return { ok: false, error: "El partido seleccionado ya no existe." };

  return persistReservation({
    type: "PARTIDO",
    zoneId: zone.id,
    matchId: match.id,
    reservationDate: match.kickoffAt,
    partySize: parsed.data.partySize,
    customerName: parsed.data.customerName,
    customerPhone: parsed.data.customerPhone,
    customerEmail: parsed.data.customerEmail,
  });
}

const salaSchema = z.object({
  ...baseFields,
  salaVipId: z.coerce.number().int(),
  salaPackage: z.enum(["basico", "campeon"]),
  date: z.string().min(1, "Selecciona una fecha."),
});

export async function createSalaReservationAction(formData: FormData): Promise<ReservationResult> {
  const parsed = salaSchema.safeParse({
    customerName: formData.get("customerName"),
    customerPhone: formData.get("customerPhone"),
    customerEmail: formData.get("customerEmail"),
    partySize: formData.get("partySize"),
    salaVipId: formData.get("salaVipId"),
    salaPackage: formData.get("salaPackage"),
    date: formData.get("date"),
  });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos." };

  const sala = await prisma.salaVip.findUnique({ where: { id: parsed.data.salaVipId } });
  if (!sala) return { ok: false, error: "La sala seleccionada ya no existe." };

  return persistReservation({
    type: "SALA",
    salaVipId: sala.id,
    salaPackage: parsed.data.salaPackage,
    reservationDate: new Date(`${parsed.data.date}T00:00:00`),
    partySize: parsed.data.partySize,
    customerName: parsed.data.customerName,
    customerPhone: parsed.data.customerPhone,
    customerEmail: parsed.data.customerEmail,
  });
}
