"use client";

import { useState, useTransition, type ChangeEvent } from "react";
import Image from "next/image";
import { uploadImageAction } from "@/lib/actions/upload-image";

type Props = {
  label: string;
  urlFieldName: string;
  publicIdFieldName: string;
  initialUrl?: string | null;
  initialPublicId?: string | null;
};

export function ImageUploadField({
  label,
  urlFieldName,
  publicIdFieldName,
  initialUrl,
  initialPublicId,
}: Props) {
  const [url, setUrl] = useState(initialUrl ?? "");
  const [publicId, setPublicId] = useState(initialPublicId ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError(null);

    const formData = new FormData();
    formData.set("file", file);

    startTransition(async () => {
      const result = await uploadImageAction(formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setUrl(result.secureUrl);
      setPublicId(result.publicId);
    });
  }

  return (
    <div className="space-y-2">
      <label className="text-sm text-text-secondary">{label}</label>
      <input type="hidden" name={urlFieldName} value={url} />
      <input type="hidden" name={publicIdFieldName} value={publicId} />
      {url && (
        <div className="relative h-32 w-full max-w-xs overflow-hidden rounded-lg border border-border-default bg-background-surface">
          <Image src={url} alt={label} fill className="object-cover" />
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isPending}
        className="block w-full text-sm text-text-secondary file:mr-4 file:rounded-md file:border-0 file:bg-accent-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-accent-secondary disabled:opacity-50"
      />
      {isPending && <p className="text-xs text-text-muted">Subiendo...</p>}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
