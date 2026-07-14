import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "./LoginForm";
import { getSiteSettings } from "@/lib/data/site-settings";

export const metadata: Metadata = {
  title: "Admin | Tercer Tiempo",
};

export default async function AdminLoginPage() {
  const { logoUrl } = await getSiteSettings();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-primary px-4">
      <div className="w-full max-w-sm space-y-6 bg-background-surface border border-border-default rounded-xl p-8">
        <div className="flex flex-col items-center space-y-2">
          <Image
            src={logoUrl}
            alt="Tercer Tiempo"
            width={220}
            height={66}
            className="h-16 w-auto object-contain"
            priority
          />
          <p className="text-sm text-text-secondary">Panel de administración</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
