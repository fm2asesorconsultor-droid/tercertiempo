import { Input } from "@/components/ui/Input";

type Props = {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  type?: string;
  required?: boolean;
  placeholder?: string;
};

export function FormField({ label, name, defaultValue, type = "text", required, placeholder }: Props) {
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="text-sm text-text-secondary">
        {label}
      </label>
      <Input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue ?? undefined}
        required={required}
        placeholder={placeholder}
      />
    </div>
  );
}
