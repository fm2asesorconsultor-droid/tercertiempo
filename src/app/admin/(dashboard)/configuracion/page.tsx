import { prisma } from "@/lib/prisma";
import { SiteSettingsForm } from "./SiteSettingsForm";

export default async function AdminConfiguracionPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 font-title text-2xl font-black">Configuración del sitio</h1>
      <SiteSettingsForm settings={settings} />
    </div>
  );
}
