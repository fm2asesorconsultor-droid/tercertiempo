"use client";

type Props = {
  action: () => Promise<void>;
  confirmMessage?: string;
};

export function ConfirmDeleteButton({ action, confirmMessage = "¿Eliminar este elemento? Esta acción no se puede deshacer." }: Props) {
  return (
    <form
      action={async () => {
        if (window.confirm(confirmMessage)) {
          await action();
        }
      }}
    >
      <button type="submit" className="text-sm text-danger hover:underline">
        Eliminar
      </button>
    </form>
  );
}
