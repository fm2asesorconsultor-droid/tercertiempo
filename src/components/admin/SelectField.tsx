type Option = { value: string; label: string };

type Props = {
  label: string;
  name: string;
  defaultValue?: string | null;
  options: Option[];
  required?: boolean;
};

export function SelectField({ label, name, defaultValue, options, required }: Props) {
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="text-sm text-text-secondary">
        {label}
      </label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue ?? undefined}
        required={required}
        className="flex h-10 w-full rounded-md border border-border-default bg-background-surface px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
