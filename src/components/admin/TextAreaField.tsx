type Props = {
  label: string;
  name: string;
  defaultValue?: string | null;
  required?: boolean;
  rows?: number;
};

export function TextAreaField({ label, name, defaultValue, required, rows = 4 }: Props) {
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="text-sm text-text-secondary">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        defaultValue={defaultValue ?? undefined}
        required={required}
        rows={rows}
        className="flex w-full rounded-md border border-border-default bg-background-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  );
}
