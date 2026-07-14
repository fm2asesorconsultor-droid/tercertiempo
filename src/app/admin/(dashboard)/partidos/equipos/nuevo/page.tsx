import { TeamForm } from "../TeamForm";
import { createTeamAction } from "../actions";

export default function NewTeamPage() {
  return (
    <div>
      <h1 className="mb-6 font-title text-2xl font-black">Nuevo equipo</h1>
      <TeamForm action={createTeamAction} />
    </div>
  );
}
