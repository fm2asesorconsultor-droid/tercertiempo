import { prisma } from "@/lib/prisma";
import { BirthdayForm } from "./BirthdayForm";

export default async function AdminBirthdayPage() {
  const [content, perks] = await Promise.all([
    prisma.birthdayContent.findUnique({ where: { id: 1 } }),
    prisma.birthdayPerk.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div>
      <h1 className="mb-6 font-title text-2xl font-black">Sección Cumpleaños</h1>
      <BirthdayForm content={content} perks={perks} />
    </div>
  );
}
