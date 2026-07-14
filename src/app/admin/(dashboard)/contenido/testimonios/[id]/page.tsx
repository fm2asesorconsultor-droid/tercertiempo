import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TestimonialForm } from "../TestimonialForm";
import { updateTestimonialAction } from "../actions";

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const testimonial = await prisma.testimonial.findUnique({ where: { id: Number(id) } });
  if (!testimonial) notFound();

  const action = updateTestimonialAction.bind(null, testimonial.id);

  return (
    <div>
      <h1 className="mb-6 font-title text-2xl font-black">Editar testimonio</h1>
      <TestimonialForm testimonial={testimonial} action={action} />
    </div>
  );
}
