import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { getSiteSettings } from "@/lib/data/site-settings";

export default async function MarketingLayout({ children }: { children: ReactNode }) {
  const { logoUrl } = await getSiteSettings();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar logoUrl={logoUrl} />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
