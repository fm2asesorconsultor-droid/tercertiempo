"use client";

import { useTransition } from "react";

type Option<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  id: number;
  value: T;
  options: Option<T>[];
  action: (id: number, status: T) => Promise<void>;
};

export function StatusSelect<T extends string>({ id, value, options, action }: Props<T>) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      defaultValue={value}
      disabled={isPending}
      onChange={(e) => startTransition(() => action(id, e.target.value as T))}
      className="rounded-md border border-border-default bg-background-surface px-2 py-1 text-xs text-text-primary disabled:opacity-50"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
