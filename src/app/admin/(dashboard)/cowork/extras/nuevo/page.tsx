import { QuoteExtraForm } from "../QuoteExtraForm";
import { createQuoteExtraAction } from "../actions";

export default function NewQuoteExtraPage() {
  return (
    <div>
      <h1 className="mb-6 font-title text-2xl font-black">Nuevo extra</h1>
      <QuoteExtraForm action={createQuoteExtraAction} />
    </div>
  );
}
