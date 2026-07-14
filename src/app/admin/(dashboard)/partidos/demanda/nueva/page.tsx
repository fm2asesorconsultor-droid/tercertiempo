import { MatchDemandForm } from "../MatchDemandForm";
import { createMatchDemandAction } from "../actions";

export default function NewMatchDemandPage() {
  return (
    <div>
      <h1 className="mb-6 font-title text-2xl font-black">Nueva fecha de demanda</h1>
      <MatchDemandForm action={createMatchDemandAction} />
    </div>
  );
}
