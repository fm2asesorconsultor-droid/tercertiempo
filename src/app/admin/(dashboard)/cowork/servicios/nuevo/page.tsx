import { ConsultingServiceForm } from "../ConsultingServiceForm";
import { createConsultingServiceAction } from "../actions";

export default function NewConsultingServicePage() {
  return (
    <div>
      <h1 className="mb-6 font-title text-2xl font-black">Nuevo servicio</h1>
      <ConsultingServiceForm action={createConsultingServiceAction} />
    </div>
  );
}
