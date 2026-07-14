import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/auth/dal";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { getSiteSettings } from "@/lib/data/site-settings";

export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  await requireAdmin();
  const { logoUrl } = await getSiteSettings();

  return (
    <div className="flex min-h-screen flex-col bg-background-primary text-text-primary md:flex-row">
      <AdminSidebar logoUrl={logoUrl} />
      <main className="min-w-0 flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}
