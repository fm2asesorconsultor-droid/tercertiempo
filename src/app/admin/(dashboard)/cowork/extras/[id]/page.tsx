import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { QuoteExtraForm } from "../QuoteExtraForm";
import { updateQuoteExtraAction } from "../actions";

export default async function EditQuoteExtraPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const extra = await prisma.quoteExtra.findUnique({ where: { id: Number(id) } });
  if (!extra) notFound();

  const action = updateQuoteExtraAction.bind(null, extra.id);

  return (
    <div>
      <h1 className="mb-6 font-title text-2xl font-black">Editar extra</h1>
      <QuoteExtraForm extra={extra} action={action} />
    </div>
  );
}
