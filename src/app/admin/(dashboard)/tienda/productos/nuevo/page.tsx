import { ProductForm } from "../ProductForm";
import { createProductAction } from "../actions";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="mb-6 font-title text-2xl font-black">Nuevo producto</h1>
      <ProductForm action={createProductAction} />
    </div>
  );
}
