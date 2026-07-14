import { CoworkPackageForm } from "../CoworkPackageForm";
import { createCoworkPackageAction } from "../actions";

export default function NewCoworkPackagePage() {
  return (
    <div>
      <h1 className="mb-6 font-title text-2xl font-black">Nuevo paquete</h1>
      <CoworkPackageForm action={createCoworkPackageAction} />
    </div>
  );
}
