import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { HeroContentForm } from "./HeroContentForm";

export default async function AdminHeroPage() {
  const hero = await prisma.heroContent.findUnique({ where: { id: 1 } });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-title text-2xl font-black">Portada (Hero)</h1>
        <Link href="/admin/contenido/hero/tarjetas" className="text-sm text-accent-primary hover:underline">
          Gestionar tarjetas de experiencia →
        </Link>
      </div>
      <HeroContentForm hero={hero} />
    </div>
  );
}
