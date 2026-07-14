import { SalaVipForm } from "../SalaVipForm";
import { createSalaVipAction } from "../actions";

export default function NewSalaVipPage() {
  return (
    <div>
      <h1 className="mb-6 font-title text-2xl font-black">Nueva sala VIP</h1>
      <SalaVipForm action={createSalaVipAction} />
    </div>
  );
}
