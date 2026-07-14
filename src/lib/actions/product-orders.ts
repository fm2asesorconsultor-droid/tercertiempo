"use server";

import { z } from "zod";
import QRCode from "qrcode";
import { prisma } from "@/lib/prisma";
import { generateConfirmationCode } from "@/lib/confirmation-code";
import { sendConfirmationEmail } from "@/lib/resend";

export type ProductOrderResult =
  | { ok: true; confirmationCode: string; qrDataUrl: string }
  | { ok: false; error: string };

const schema = z.object({
  productId: z.coerce.number().int(),
  size: z.string().min(1, "Selecciona una talla."),
  customName: z.string().optional(),
  customNumber: z.string().optional(),
  pickupWindow: z.enum(["TODAY", "TOMORROW", "WEEKEND"]),
  customerName: z.string().min(1, "Tu nombre es obligatorio."),
  customerPhone: z.string().min(5, "Teléfono inválido."),
  customerEmail: z
    .string()
    .optional()
    .transform((v) => (v && v.trim() ? v.trim() : undefined))
    .refine((v) => v === undefined || z.string().email().safeParse(v).success, {
      message: "Correo inválido.",
    }),
});

export async function createProductOrderAction(formData: FormData): Promise<ProductOrderResult> {
  const parsed = schema.safeParse({
    productId: formData.get("productId"),
    size: formData.get("size"),
    customName: formData.get("customName"),
    customNumber: formData.get("customNumber"),
    pickupWindow: formData.get("pickupWindow"),
    customerName: formData.get("customerName"),
    customerPhone: formData.get("customerPhone"),
    customerEmail: formData.get("customerEmail"),
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const product = await prisma.product.findUnique({ where: { id: parsed.data.productId } });
  if (!product) return { ok: false, error: "El producto seleccionado ya no existe." };

  try {
    const confirmationCode = await generateConfirmationCode(async (code) => {
      const existing = await prisma.productOrder.findUnique({ where: { confirmationCode: code } });
      return existing !== null;
    });

    await prisma.productOrder.create({
      data: {
        productId: product.id,
        size: parsed.data.size,
        customName: parsed.data.customName || null,
        customNumber: parsed.data.customNumber || null,
        pickupWindow: parsed.data.pickupWindow,
        customerName: parsed.data.customerName,
        customerPhone: parsed.data.customerPhone,
        customerEmail: parsed.data.customerEmail,
        confirmationCode,
      },
    });

    const qrDataUrl = await QRCode.toDataURL(confirmationCode, { margin: 1, width: 256 });

    if (parsed.data.customerEmail) {
      await sendConfirmationEmail({
        to: parsed.data.customerEmail,
        subject: `Pedido confirmado — ${confirmationCode}`,
        html: `
          <p>Hola ${parsed.data.customerName},</p>
          <p>Tu pedido de <strong>${product.name}</strong> quedó registrado.</p>
          <p>Código de confirmación: <strong>${confirmationCode}</strong></p>
          <p>Muestra este código en la barra de Tercer Tiempo para pagar y recoger tu producto.</p>
        `,
      });
    }

    return { ok: true, confirmationCode, qrDataUrl };
  } catch (error) {
    console.error("Error creando pedido:", error);
    return { ok: false, error: "No pudimos procesar tu pedido. Intenta de nuevo." };
  }
}
