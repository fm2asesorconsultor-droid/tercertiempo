import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "../ProductForm";
import { updateProductAction } from "../actions";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id: Number(id) } });
  if (!product) notFound();

  const action = updateProductAction.bind(null, product.id);

  return (
    <div>
      <h1 className="mb-6 font-title text-2xl font-black">Editar producto</h1>
      <ProductForm product={product} action={action} />
    </div>
  );
}
