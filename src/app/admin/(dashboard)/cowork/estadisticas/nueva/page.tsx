import { CoworkStatForm } from "../CoworkStatForm";
import { createCoworkStatAction } from "../actions";

export default function NewCoworkStatPage() {
  return (
    <div>
      <h1 className="mb-6 font-title text-2xl font-black">Nueva estadística</h1>
      <CoworkStatForm action={createCoworkStatAction} />
    </div>
  );
}
